'use server'

import { client } from '@/lib/prisma'
import { Theme } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'
import { onAuthenticateUser } from './user'

// Type definitions
type ContentType = 'column' | 'row' | 'text' | 'image' | 'heading' | 'title'

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

// Utility function to extract JSON from LLaMA response
const extractJson = (content: string): string | null => {
  // Try to find JSON block
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (jsonMatch) return jsonMatch[0]

  // Try to extract from code blocks
  const codeBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
  if (codeBlockMatch) return codeBlockMatch[1]

  return null
}

// Check if content has a title element
function hasTitle(content: Content): boolean {
  if (content.type === 'title') return true
  if (Array.isArray(content.content)) {
    return content.content.some((child) => hasTitle(child as Content))
  }
  return false
}

// Auto-inject title if missing
function injectTitleIfMissing(layout: SlideLayout): SlideLayout {
  if (!hasTitle(layout.content)) {
    console.log(
      `[injectTitleIfMissing] Adding missing title to slide: ${layout.slideName}`
    )
    layout.content = {
      id: uuidv4(),
      type: 'column',
      name: 'Column',
      content: [
        {
          id: uuidv4(),
          type: 'title',
          name: 'Title',
          content: layout.slideName || 'Slide Title',
          className: 'text-5xl font-bold text-center mb-6 text-gray-900',
        },
        layout.content,
      ],
      className: 'w-full',
    }
  }
  return layout
}

// Generate creative prompt outline from LLaMA
export const generateCreativePrompt = async (userPrompt: string) => {
  const finalPrompt = `
Create a coherent and relevant outline for the following prompt: "${userPrompt}".

The outline should consist of at least 6 points, with each point written as a single sentence.
Ensure the outline is well-structured and directly related to the topic.

CRITICAL: Return ONLY the JSON object below with NO additional text, explanations, or markdown:

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
  `.trim()

  try {
    const baseUrl = process.env.LLAMA_BASE_URL
    const model = process.env.LLAMA_MODEL || 'gemma:2b'

    if (!baseUrl) {
      throw new Error('LLAMA_BASE_URL is not set in environment variables')
    }

    console.log(
      `[generateCreativePrompt] Calling LLaMA at ${baseUrl} with model ${model}`
    )

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
              'You are a helpful assistant that ONLY returns valid JSON. Never include explanations, markdown, or any text outside the JSON object.',
          },
          {
            role: 'user',
            content: finalPrompt,
          },
        ],
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(
        '[generateCreativePrompt] LLaMA API error:',
        res.status,
        errorText
      )
      throw new Error(`LLaMA API returned status ${res.status}: ${errorText}`)
    }

    const data = await res.json()
    const content =
      data?.message?.content || data?.choices?.[0]?.message?.content || ''

    if (!content) {
      console.error('[generateCreativePrompt] Empty response from LLaMA')
      throw new Error('Empty response from LLaMA')
    }

    console.log('[generateCreativePrompt] Raw LLaMA output:', content)

    const jsonString = extractJson(content)
    if (!jsonString) {
      console.error('[generateCreativePrompt] No JSON found in response')
      throw new Error('No JSON found in LLaMA response')
    }

    const parsed = JSON.parse(jsonString) as LlamaOutlineResponse

    if (
      !parsed.outlines ||
      !Array.isArray(parsed.outlines) ||
      parsed.outlines.length === 0
    ) {
      console.error('[generateCreativePrompt] Invalid JSON structure:', parsed)
      throw new Error(
        'Invalid JSON shape from LLaMA: missing or empty outlines array'
      )
    }

    console.log(
      '[generateCreativePrompt] Successfully generated',
      parsed.outlines.length,
      'outlines'
    )
    return parsed.outlines
  } catch (error) {
    console.error('[generateCreativePrompt] Error:', error)
    throw error instanceof Error
      ? error
      : new Error('Failed to generate outline from LLaMA')
  }
}

// Example layouts with MORE title examples
const getExampleLayouts = (): SlideLayout[] => [
  {
    slideName: 'Full Title Slide',
    type: 'fullTitle',
    className:
      'min-h-[400px] flex justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50',
    content: {
      id: uuidv4(),
      type: 'title',
      name: 'Title',
      content: 'Your Presentation Title Here',
      className: 'text-6xl font-bold text-center text-gray-900',
    },
  },
  {
    slideName: 'Main Title With Subtitle',
    type: 'titleSlide',
    className:
      'min-h-[400px] flex flex-col justify-center items-center p-10 bg-white',
    content: {
      id: uuidv4(),
      type: 'column',
      name: 'Column',
      content: [
        {
          id: uuidv4(),
          type: 'title',
          name: 'Title',
          content: 'Main Slide Title',
          className: 'text-6xl font-bold text-center mb-4 text-gray-900',
        },
        {
          id: uuidv4(),
          type: 'text',
          name: 'Subtitle',
          content: 'Subtitle describing the slide topic',
          className: 'text-xl text-gray-600 text-center',
        },
      ],
    },
  },
  {
    slideName: 'Title with Content',
    type: 'titleContent',
    className: 'min-h-[400px] p-8 mx-auto flex flex-col',
    content: {
      id: uuidv4(),
      type: 'column',
      name: 'Column',
      content: [
        {
          id: uuidv4(),
          type: 'title',
          name: 'Title',
          content: 'Section Title',
          className: 'text-5xl font-bold text-center mb-8 text-gray-900',
        },
        {
          id: uuidv4(),
          type: 'text',
          name: 'Text',
          content: 'Main content text goes here with detailed information',
          className: 'text-xl text-gray-700 text-center max-w-4xl mx-auto',
        },
      ],
    },
  },
  {
    slideName: 'Title with Image',
    type: 'titleImage',
    className: 'min-h-[400px] p-8 mx-auto flex flex-col',
    content: {
      id: uuidv4(),
      type: 'column',
      name: 'Column',
      content: [
        {
          id: uuidv4(),
          type: 'title',
          name: 'Title',
          content: 'Visual Content Title',
          className: 'text-5xl font-bold text-center mb-6 text-gray-900',
        },
        {
          id: uuidv4(),
          type: 'image',
          name: 'Image',
          src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
          alt: 'Professional business meeting',
          className: 'w-full h-80 object-cover rounded-xl shadow-lg',
        },
      ],
    },
  },
  {
    slideName: 'Title with Two Columns',
    type: 'titleTwoColumn',
    className: 'min-h-[400px] p-8 mx-auto flex flex-col',
    content: {
      id: uuidv4(),
      type: 'column',
      name: 'Column',
      content: [
        {
          id: uuidv4(),
          type: 'title',
          name: 'Title',
          content: 'Comparison Title',
          className: 'text-5xl font-bold text-center mb-8 text-gray-900',
        },
        {
          id: uuidv4(),
          type: 'row',
          name: 'Row',
          content: [
            {
              id: uuidv4(),
              type: 'column',
              name: 'Column',
              className: 'w-1/2 pr-8',
              content: [
                {
                  id: uuidv4(),
                  type: 'heading',
                  name: 'Heading',
                  content: 'Left Section',
                  className: 'text-2xl font-semibold mb-4 text-gray-800',
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  name: 'Text',
                  content: 'Left column details',
                  className: 'text-lg text-gray-700',
                },
              ],
            },
            {
              id: uuidv4(),
              type: 'column',
              name: 'Column',
              className: 'w-1/2 pl-8',
              content: [
                {
                  id: uuidv4(),
                  type: 'heading',
                  name: 'Heading',
                  content: 'Right Section',
                  className: 'text-2xl font-semibold mb-4 text-gray-800',
                },
                {
                  id: uuidv4(),
                  type: 'text',
                  name: 'Text',
                  content: 'Right column details',
                  className: 'text-lg text-gray-700',
                },
              ],
            },
          ],
        },
      ],
    },
  },
]

// Generate layout JSON from outlines with STRICT title requirements
export const generateLayoutJson = async (outlineArray: string[]) => {
  if (!outlineArray || outlineArray.length === 0) {
    throw new Error('Outline array is empty or undefined')
  }

  const exampleLayouts = getExampleLayouts()

  const prompt = `
You are a presentation layout generator.

### CRITICAL RULES (MUST FOLLOW):
1. The MAIN TITLE of EVERY slide MUST use: { "type": "title", "name": "Title", "content": "..." }
2. NEVER use "heading" for the main title of a slide.
3. Use "heading" ONLY for subsection headers INSIDE content areas.
4. Every generated layout MUST contain EXACTLY ONE "title" element.
5. The "title" must ALWAYS appear at the TOP of the slide content structure.
6. If the layout has multiple sections, the title comes first, then use "heading" for subsections.
7. Use the example layouts as structural references and ALWAYS follow the title rules above.

### Content Type Hierarchy:
- "title" = Main slide title (REQUIRED on every slide)
- "heading" = Subsection header (optional, only for sections within content)
- "text" = Body content

### Output Requirements:
- Output ONLY valid JSON with NO markdown, explanations, or extra text.
- Generate exactly ${outlineArray.length} layouts (one per outline).
- Each layout must have a "title" type element as the main title.

### Example Layouts (Note: ALL examples have "type": "title" for main titles):
${JSON.stringify(exampleLayouts, null, 2)}

### Outlines to Convert (${outlineArray.length} items):
${outlineArray.map((o, i) => `${i + 1}. ${o}`).join('\n')}

### Image URL Format:
Use: https://images.unsplash.com/photo-{random_id}?w=800&h=400&fit=crop&q=80

Return ONLY this JSON structure:

{
  "layouts": [
    {
      "slideName": "Descriptive name based on outline",
      "type": "layoutType",
      "className": "min-h-[400px] p-8 flex ...",
      "content": {
        "id": "uuid",
        "type": "column",
        "name": "Column",
        "content": [
          {
            "id": "uuid",
            "type": "title",
            "name": "Title",
            "content": "Main Title From Outline",
            "className": "text-5xl font-bold text-center mb-6"
          },
          ... other content elements
        ]
      }
    }
  ]
}
  `.trim()

  try {
    const baseUrl = process.env.LLAMA_BASE_URL
    const model = process.env.LLAMA_MODEL || 'gemma:2b'

    if (!baseUrl) {
      throw new Error('LLAMA_BASE_URL is not set in environment variables')
    }

    console.log(
      `[generateLayoutJson] Generating layouts for ${outlineArray.length} outlines`
    )

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
              'You are a presentation layout designer that ONLY returns valid JSON. The main title of every slide MUST use "type": "title". Never use "heading" for main titles. Never include explanations, markdown, or any text outside the JSON object.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(
        '[generateLayoutJson] LLaMA API error:',
        res.status,
        errorText
      )
      return {
        status: 500,
        error: `LLaMA API returned status ${res.status}: ${errorText}`,
      }
    }

    const data = await res.json()
    const content =
      data?.message?.content || data?.choices?.[0]?.message?.content || ''

    if (!content) {
      console.error('[generateLayoutJson] Empty response from LLaMA')
      return {
        status: 500,
        error: 'Empty response from LLaMA',
      }
    }

    console.log('[generateLayoutJson] Raw LLaMA layout output:', content)

    const jsonString = extractJson(content)
    if (!jsonString) {
      console.error('[generateLayoutJson] No JSON found in response')
      return {
        status: 500,
        error: 'No JSON found in LLaMA response',
      }
    }

    const parsed = JSON.parse(jsonString) as LlamaLayoutResponse

    if (
      !parsed.layouts ||
      !Array.isArray(parsed.layouts) ||
      parsed.layouts.length === 0
    ) {
      console.error('[generateLayoutJson] Invalid JSON structure:', parsed)
      return {
        status: 500,
        error: 'Invalid JSON shape from LLaMA: missing or empty layouts array',
      }
    }

    // 🔥 AUTO-FIX: Inject title if AI forgot or used wrong type
    parsed.layouts = parsed.layouts.map(injectTitleIfMissing)

    // Validate that we have the right number of layouts
    if (parsed.layouts.length !== outlineArray.length) {
      console.warn(
        `[generateLayoutJson] Expected ${outlineArray.length} layouts but got ${parsed.layouts.length}`
      )
    }

    console.log(
      '[generateLayoutJson] Successfully generated',
      parsed.layouts.length,
      'layouts'
    )
    console.log('[generateLayoutJson] All layouts validated with titles')

    return {
      status: 200,
      data: parsed.layouts,
    }
  } catch (error) {
    console.error('[generateLayoutJson] Error:', error)
    return {
      status: 500,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to generate layout from LLaMA',
    }
  }
}

// Main function to generate layout for a project
export const generateLayout = async (projectId: string, theme: Theme) => {
  try {
    console.log(
      '[generateLayout] Starting layout generation for project:',
      projectId
    )

    if (!projectId) {
      console.error('[generateLayout] Missing project ID')
      return {
        status: 400,
        error: 'Project ID is required',
      }
    }

    const authResult = await onAuthenticateUser()
    if (authResult.status !== 200 || !authResult.user) {
      console.error(
        '[generateLayout] Authentication failed:',
        authResult.status
      )
      return {
        status: authResult.status ?? 401,
        error: authResult.message ?? 'Unauthorized',
      }
    }

    console.log('[generateLayout] User authenticated:', authResult.user.id)

    const project = await client.project.findUnique({
      where: {
        id: projectId,
        isDeleted: false,
      },
    })

    if (!project) {
      console.error('[generateLayout] Project not found:', projectId)
      return {
        status: 404,
        error: 'Project not found',
      }
    }

    console.log('[generateLayout] Project found:', project.id)

    if (
      !project.outlines ||
      !Array.isArray(project.outlines) ||
      project.outlines.length === 0
    ) {
      console.error('[generateLayout] Project has no outlines')
      return {
        status: 400,
        error: 'Project outlines are required to generate layout',
      }
    }

    console.log(
      '[generateLayout] Generating layouts for',
      project.outlines.length,
      'outlines'
    )

    const layouts = await generateLayoutJson(project.outlines as string[])

    if (layouts.status !== 200 || !layouts.data) {
      console.error(
        '[generateLayout] Failed to generate layouts:',
        layouts.error
      )
      return layouts
    }

    console.log(
      '[generateLayout] Updating project with',
      layouts.data.length,
      'layouts'
    )

    const updatedProject = await client.project.update({
      where: { id: projectId },
      data: {
        slides: layouts.data as any,
        themeName: theme.name,
      },
    })

    console.log('[generateLayout] Project updated successfully')

    return {
      status: 200,
      data: layouts.data,
      message: `Successfully generated ${layouts.data.length} slides with validated titles`,
    }
  } catch (error) {
    console.error('[generateLayout] Unexpected error:', error)
    return {
      status: 500,
      error:
        error instanceof Error ? error.message : 'Failed to generate layout',
    }
  }
}
