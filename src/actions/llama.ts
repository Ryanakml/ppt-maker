'use server' // This tells Next.js that this file runs on the server, not in the browser.

// Define a TypeScript type to describe what we expect from the LLaMA model's response.
// In this case, the model should return JSON with a property "outlines" that is an array of strings.
type LlamaOutlineResponse = {
  outlines: string[]
}

// This function will send a user’s prompt to your local LLaMA API
// and expect a structured outline (list of bullet points) back as JSON.
export const generateCreativePrompt = async (userPrompt: string) => {
  // This is the text (prompt) we’ll send to the LLaMA model.
  // It tells the model exactly what we want and in what format.
  const finalPrompt = `
Create a coherent and relevant outline for the following prompt: "${userPrompt}".

The outline should consist of at least 6 points, with each point written as a single sentence.
Ensure the outline is well-structured and directly related to the topic.
Return the output in the following JSON format ONLY:

{
  "outlines": [
    "Point 1",
    "Point 2",
    "Point 3",
    "Point 4",
    "Point 5",
    "Point 6"
  ]
}

Ensure that:
- Return only valid JSON. Do NOT include explanations or Markdown.
- If you output anything else, it will break the program.
  `.trim() // .trim() removes extra newlines or spaces from start and end.

  try {
    // Grab your local LLaMA server base URL from environment variables.
    // You usually set this in your `.env` file.
    const baseUrl = process.env.LLAMA_BASE_URL
    // Also grab the model name (e.g., "gemma:2b"), or use the default if not set.
    const model = process.env.LLAMA_MODEL || 'gemma:2b'

    // If there’s no base URL, that means your environment variable isn’t set properly.
    if (!baseUrl) {
      throw new Error('LLAMA_BASE_URL is not set')
    }

    // Send an HTTP POST request to your LLaMA API server.
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model, // Which model to use
        stream: false, // Disable streaming — we want the full reply at once
        messages: [
          {
            // The "system" message sets the behavior or role of the AI model.
            role: 'system',
            content:
              'You are a helpful assistant that ONLY returns valid JSON.',
          },
          {
            // The "user" message is your actual request for the outline.
            role: 'user',
            content: finalPrompt,
          },
        ],
      }),
    })

    // If the server didn’t respond with a 200 OK status, something went wrong.
    if (!res.ok) {
      console.error('LLaMA API error status:', res.status, await res.text())
      throw new Error('Failed to call LLaMA server')
    }

    // Parse the JSON response from the LLaMA server.
    const data = await res.json()

    // Depending on your LLaMA API setup, the text output might be in different places.
    // We check multiple possible fields to be safe.
    let content =
      data?.message?.content || data?.choices?.[0]?.message?.content || ''

    // If there’s no content at all, something’s wrong.
    if (!content) throw new Error('Empty response from LLaMA')

    console.log('Raw LLaMA output:', content) // Log the raw text (for debugging).

    // Sometimes LLaMA might return extra text like explanations.
    // So we try to "extract" only the valid JSON part using a regular expression.
    const match = content.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON found in LLaMA response')

    // Parse the extracted JSON string into a JavaScript object.
    const parsed = JSON.parse(match[0]) as LlamaOutlineResponse

    // Validate that the parsed object actually has an "outlines" array.
    if (!parsed.outlines || !Array.isArray(parsed.outlines)) {
      throw new Error('Invalid JSON shape from LLaMA')
    }

    // If everything’s good, return the outlines array.
    return parsed.outlines
  } catch (error) {
    // Catch and log any error that happened during the process.
    console.error('generateCreativePrompt error:', error)
    // Throw a new error to let the caller know something failed.
    throw new Error('Failed to generate outline from LLaMA')
  }
}
