// types.ts

// type definition for content types
export type ContentType =
  | 'column'
  | 'resizable-column'
  | 'text'
  | 'paragraph'
  | 'image'
  | 'table'
  | 'multiColumn'
  | 'blank'
  | 'imageAndText'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'title'
  | 'heading4'
  | 'blockquote'
  | 'numberedList'
  | 'bulletedList'
  | 'code'
  | 'link'
  | 'quote'
  | 'divider'
  | 'calloutBox'
  | 'todoList'
  | 'bulletList'
  | 'codeBlock'
  | 'customButton'
  | 'tableOfContents'

// content item interface
export interface ContentItem {
  id: string
  type: ContentType
  name: string
  content: ContentItem[] | string | string[] | string[][]

  initialRows?: number
  initialColumns?: number
  restrictToDrop?: boolean
  columns?: number
  placeholder?: string
  className?: string
  alt?: string

  callOutType?: 'success' | 'warning' | 'info' | 'question' | 'caution'

  link?: string
  code?: string
  language?: string
  bgColor?: string
  isTransparent?: boolean
}

// slide interface
export interface Slide {
  id: string
  slideName: string
  type: string
  content: ContentItem
  slideOrder: number
  className?: string
}

// theme interface
export interface Theme {
  name: string
  fontFamily: string
  fontcolor: string
  backgroundColor: string
  slideBackgroundColor: string
  accentColor: string
  gradientBackground?: string
  sidebarColor?: string
  navColor?: string
  type: 'light' | 'dark'
}

export interface OutlineCard {
  title: string
  id: string
  order: string
}
