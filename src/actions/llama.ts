'use server'

import { client } from '@/lib/prisma'
import { Theme } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'
import { onAuthenticateUser } from './user'

// Type definitions
type ContentType = 'column' | 'row' | 'text' | 'image' | 'heading'

type Content = {
  id: string
  type: ContentType
  name: string
  content?: Content[] | string
  src?: string
  alt?: string
  className?: string
}

type SlideLayout = {
  slideName: string
  type: string
  className: string
  content: Content
}

type LlamaOutlineResponse = {
  outlines: string[]
}

type LlamaLayoutResponse = {
  layouts: SlideLayout[]
}

// Generate creative prompt outline from LLaMA
export const generateCreativePrompt = async (userPrompt: string) => {
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
  `.trim()

  try {
    const baseUrl = process.env.LLAMA_BASE_URL
    const model = process.env.LLAMA_MODEL || 'gemma:2b'

    if (!baseUrl) {
      throw new Error('LLAMA_BASE_URL is not set')
    }

    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that ONLY returns valid JSON.',
          },
          {
            role: 'user',
            content: finalPrompt,
          },
        ],
      }),
    })

    if (!res.ok) {
      console.error('LLaMA API error status:', res.status, await res.text())
      throw new Error('Failed to call LLaMA server')
    }

    const data = await res.json()
    const content =
      data?.message?.content || data?.choices?.[0]?.message?.content || ''

    if (!content) throw new Error('Empty response from LLaMA')

    console.log('Raw LLaMA output:', content)

    const match = content.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON found in LLaMA response')

    const parsed = JSON.parse(match[0]) as LlamaOutlineResponse

    if (!parsed.outlines || !Array.isArray(parsed.outlines)) {
      throw new Error('Invalid JSON shape from LLaMA')
    }

    return parsed.outlines
  } catch (error) {
    console.error('generateCreativePrompt error:', error)
    throw new Error('Failed to generate outline from LLaMA')
  }
}

// Example layouts for reference
const existingLayouts: SlideLayout[] = [
  {
    slideName: 'Image and Text',
    type: 'imageText',
    className: 'min-h-[200px] p-8 mx-auto flex justify-center items-center',
    content: {
      id: uuidv4(),
      type: 'column' as ContentType,
      name: 'Column',
      content: [
        {
          id: uuidv4(),
          type: 'image' as ContentType,
          name: 'Image',
          src: 'https://via.placeholder.com/800x400',
          alt: 'Placeholder image',
          className: 'w-full h-64 object-cover rounded-lg mb-4',
        },
        {
          id: uuidv4(),
          type: 'text' as ContentType,
          name: 'Text',
          content: 'Sample text content goes here',
          className: 'text-lg text-gray-700',
        },
      ],
    },
  },
  {
    slideName: 'Title and Subtitle',
    type: 'titleSubtitle',
    className:
      'min-h-[200px] p-8 mx-auto flex flex-col justify-center items-center',
    content: {
      id: uuidv4(),
      type: 'column' as ContentType,
      name: 'Column',
      content: [
        {
          id: uuidv4(),
          type: 'heading' as ContentType,
          name: 'Heading',
          content: 'Main Title',
          className: 'text-4xl font-bold text-center mb-4',
        },
        {
          id: uuidv4(),
          type: 'text' as ContentType,
          name: 'Text',
          content: 'Subtitle or description text',
          className: 'text-xl text-gray-600 text-center',
        },
      ],
    },
  },
  {
    slideName: 'Two Column Layout',
    type: 'twoColumn',
    className: 'min-h-[200px] p-8 mx-auto',
    content: {
      id: uuidv4(),
      type: 'row' as ContentType,
      name: 'Row',
      content: [
        {
          id: uuidv4(),
          type: 'column' as ContentType,
          name: 'Column',
          className: 'w-1/2 pr-4',
          content: [
            {
              id: uuidv4(),
              type: 'heading' as ContentType,
              name: 'Heading',
              content: 'Left Column Title',
              className: 'text-2xl font-bold mb-2',
            },
            {
              id: uuidv4(),
              type: 'text' as ContentType,
              name: 'Text',
              content: 'Left column content',
              className: 'text-base',
            },
          ],
        },
        {
          id: uuidv4(),
          type: 'column' as ContentType,
          name: 'Column',
          className: 'w-1/2 pl-4',
          content: [
            {
              id: uuidv4(),
              type: 'heading' as ContentType,
              name: 'Heading',
              content: 'Right Column Title',
              className: 'text-2xl font-bold mb-2',
            },
            {
              id: uuidv4(),
              type: 'text' as ContentType,
              name: 'Text',
              content: 'Right column content',
              className: 'text-base',
            },
          ],
        },
      ],
    },
  },
]

// Generate layout JSON from outlines
export const generateLayoutJson = async (outlineArray: string[]) => {
  const prompt = `
You are a highly creative AI that generates JSON-based layouts for presentations. I will provide you with an array of outlines, and for each outline, you must generate a unique and creative layout. Use the existing layouts as examples for structure and design, and generate unique designs based on the provided outline.

### Guidelines:
1. Write layouts based on the specific outline provided.
2. Use diverse and engaging designs, ensuring each layout is unique.
3. Adhere to the structure of existing layouts but add new styles or components if needed.
4. Fill placeholder data into content fields where required.
5. Generate unique image placeholders for the 'content' property of image components and also alt text according to the outline.
6. Ensure proper formatting and schema alignment for the output JSON.

### Example Layouts:
${JSON.stringify(existingLayouts, null, 2)}

### Outline Array:
${JSON.stringify(outlineArray)}

For each entry in the outline array, generate:
- A unique JSON layout with creative designs.
- Properly filled content, including placeholders for image components.
- Clear and well-structured JSON data.

For Images:
- The alt text should describe the image clearly and concisely.
- Focus on the main subject(s) of the image and any relevant details such as colors, shapes, people or objects.
- Ensure the alt text aligns with the context of the presentation slide it will be used on (e.g., professional, educational, business-related).
- Avoid using terms like 'image of' or 'picture of,' and instead focus directly on the content and meaning.

Output the layouts in the following JSON format ONLY:

{
  "layouts": [
    // Array of layout objects matching the structure of existing layouts
  ]
}

Return only valid JSON. Do NOT include explanations or Markdown.
  `.trim()

  try {
    const baseUrl = process.env.LLAMA_BASE_URL
    const model = process.env.LLAMA_MODEL || 'gemma:2b'

    if (!baseUrl) {
      throw new Error('LLAMA_BASE_URL is not set')
    }

    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that ONLY returns valid JSON for presentation layouts.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!res.ok) {
      console.error('LLaMA API error status:', res.status, await res.text())
      return {
        status: 500,
        error: 'Failed to call LLaMA server for layout generation',
      }
    }

    const data = await res.json()
    const content =
      data?.message?.content || data?.choices?.[0]?.message?.content || ''

    if (!content) {
      return {
        status: 500,
        error: 'Empty response from LLaMA',
      }
    }

    console.log('Raw LLaMA layout output:', content)

    const match = content.match(/\{[\s\S]*\}/)
    if (!match) {
      return {
        status: 500,
        error: 'No JSON found in LLaMA response',
      }
    }

    const parsed = JSON.parse(match[0]) as LlamaLayoutResponse

    if (!parsed.layouts || !Array.isArray(parsed.layouts)) {
      return {
        status: 500,
        error: 'Invalid JSON shape from LLaMA',
      }
    }

    return {
      status: 200,
      data: parsed.layouts,
    }
  } catch (error) {
    console.error('generateLayoutJson error:', error)
    return {
      status: 500,
      error: 'Failed to generate layout from LLaMA',
    }
  }
}

// Main function to generate layout for a project
export const generateLayout = async (projectId: string, theme: Theme) => {
  try {
    if (!projectId) {
      return {
        status: 400,
        error: 'Project ID is required',
      }
    }

    const authResult = await onAuthenticateUser()
    if (authResult.status !== 200 || !authResult.user) {
      return {
        status: authResult.status ?? 401,
        error: authResult.message ?? 'Unauthorized',
      }
    }

    const project = await client.project.findUnique({
      where: {
        id: projectId,
        isDeleted: false,
      },
    })

    if (!project) {
      return {
        status: 404,
        error: 'Project not found',
      }
    }

    if (!project.outlines || project.outlines.length === 0) {
      return {
        status: 400,
        error: 'Project outlines are required to generate layout',
      }
    }

    const layouts = await generateLayoutJson(project.outlines as string[])

    if (layouts.status !== 200) {
      return layouts
    }

    await client.project.update({
      where: { id: projectId },
      data: {
        slides: layouts.data,
        themeName: theme.name,
      },
    })

    return {
      status: 200,
      data: layouts.data,
    }
  } catch (error) {
    console.error('generateLayout error:', error)
    return {
      status: 500,
      error: 'Failed to generate layout',
    }
  }
}
