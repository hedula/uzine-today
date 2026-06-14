/** Minimal Editor.js OutputData types for MVP blocks */

export interface EditorBlock<T extends string = string, D = Record<string, unknown>> {
  id?: string;
  type: T;
  data: D;
}

export interface EditorOutputData {
  time?: number;
  version?: string;
  blocks: EditorBlock[];
}

export interface ParagraphData {
  text: string;
}

export interface HeaderData {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ListData {
  style: 'ordered' | 'unordered';
  items: string[];
}

export interface QuoteData {
  text: string;
  caption?: string;
  alignment?: 'left' | 'center';
}

export interface ImageData {
  file: {
    url: string;
  };
  caption?: string;
  withBorder?: boolean;
  withBackground?: boolean;
  stretched?: boolean;
}

export type SupportedBlockType =
  | 'paragraph'
  | 'header'
  | 'list'
  | 'quote'
  | 'image'
  | 'delimiter';

export const SUPPORTED_BLOCK_TYPES: SupportedBlockType[] = [
  'paragraph',
  'header',
  'list',
  'quote',
  'image',
  'delimiter',
];
