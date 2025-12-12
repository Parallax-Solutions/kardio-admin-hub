/**
 * Parser Config domain types
 * Re-exports from store for consistency, can be extended with frontend-specific types
 */
export type { 
  ParserConfig, 
  ParserStrategy, 
  EmailKind 
} from '@/stores/parserConfigsStore';

export type { ParserConfigFormState } from '@/hooks/useParserConfigEditor';
export type { TestResult } from '@/hooks/useParserTest';
