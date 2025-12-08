import { useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import { Highlight, themes } from 'prism-react-renderer';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  formatOnPaste?: boolean;
  cleanOnPaste?: boolean;
  showValidation?: boolean;
}

interface HtmlValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Validate HTML structure (simplified - just checks for basic issues)
function validateHtml(html: string): HtmlValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!html.trim()) {
    return { isValid: true, errors: [], warnings: [] };
  }

  // Check for escaped HTML
  if (html.includes('&amp;') && html.includes('&lt;')) {
    warnings.push('El HTML parece estar escapado (contiene &amp; y &lt;)');
  }

  // Check for obviously broken HTML
  const openBrackets = (html.match(/</g) || []).length;
  const closeBrackets = (html.match(/>/g) || []).length;
  
  if (Math.abs(openBrackets - closeBrackets) > 5) {
    errors.push(`Posible HTML malformado: ${openBrackets} "<" vs ${closeBrackets} ">"`);
  }

  // Check for common structural tags
  const hasTable = html.includes('<table');
  const hasDiv = html.includes('<div');
  const hasBody = html.includes('<body');
  
  if (!hasTable && !hasDiv && !hasBody && html.length > 100) {
    warnings.push('El HTML no contiene tags estructurales comunes (table, div, body)');
  }

  // Check for content - should have some text
  const textContent = html.replace(/<[^>]*>/g, '').trim();
  if (textContent.length < 10 && html.length > 100) {
    warnings.push('El HTML parece no tener contenido de texto');
  }

  // Check for email-specific content (good sign for bank emails)
  const hasEmailContent = 
    html.toLowerCase().includes('comercio') ||
    html.toLowerCase().includes('monto') ||
    html.toLowerCase().includes('transacción') ||
    html.toLowerCase().includes('transaction') ||
    html.toLowerCase().includes('amount');
    
  if (hasEmailContent) {
    // This looks like a bank email - good!
  } else if (html.length > 500) {
    warnings.push('No se detectó contenido típico de email bancario');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Decode HTML entities
function decodeHtmlEntities(html: string): string {
  // Use a temporary element to decode entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

// Clean HTML - remove scripts, styles, and inline styles
function cleanHtml(html: string): string {
  let cleaned = html;
  
  // Decode HTML entities first
  cleaned = decodeHtmlEntities(cleaned);
  
  // Remove script tags and their content
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove style tags and their content
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove noscript tags and their content
  cleaned = cleaned.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '');
  
  // Remove SVG elements (usually icons)
  cleaned = cleaned.replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '');
  
  // Remove button elements
  cleaned = cleaned.replace(/<button\b[^>]*>[\s\S]*?<\/button>/gi, '');
  
  // Remove img tags (keep alt text info in comments if needed)
  cleaned = cleaned.replace(/<img\b[^>]*>/gi, '');
  
  // Remove inline style attributes
  cleaned = cleaned.replace(/\s+style\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove onclick, onload, and other event handlers
  cleaned = cleaned.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove data-* attributes (tracking, tooltips, etc.)
  cleaned = cleaned.replace(/\s+data-[a-z-]+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove jsaction, jscontroller, jslog and other JS framework attributes
  cleaned = cleaned.replace(/\s+js\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove aria-* attributes
  cleaned = cleaned.replace(/\s+aria-[a-z-]+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove role attributes
  cleaned = cleaned.replace(/\s+role\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove tabindex attributes
  cleaned = cleaned.replace(/\s+tabindex\s*=\s*["'][^"']*["']/gi, '');
  
  // Keep id and class attributes - useful for parsing
  
  // Remove name attributes on non-input elements
  cleaned = cleaned.replace(/(<(?!input)[^>]*)\s+name\s*=\s*["'][^"']*["']/gi, '$1');
  
  // Remove empty attributes
  cleaned = cleaned.replace(/\s+\w+\s*=\s*["']\s*["']/g, '');
  
  // Remove HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove empty spans: <span></span> or <span> </span>
  cleaned = cleaned.replace(/<span[^>]*>\s*<\/span>/gi, '');
  
  // Remove empty divs: <div></div> or <div> </div>
  cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, '');
  
  // Remove empty paragraphs
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');
  
  // Remove empty table cells
  cleaned = cleaned.replace(/<td[^>]*>\s*<\/td>/gi, '');
  cleaned = cleaned.replace(/<th[^>]*>\s*<\/th>/gi, '');
  
  // Remove empty links
  cleaned = cleaned.replace(/<a[^>]*>\s*<\/a>/gi, '');
  
  // Unwrap unnecessary container divs/spans (single child)
  // This runs multiple times to handle nested cases
  for (let i = 0; i < 5; i++) {
    // Unwrap div with only whitespace and one child element
    cleaned = cleaned.replace(/<div>\s*(<(?:table|tr|td|th|p|h[1-6]|ul|ol|li|a)[^>]*>[\s\S]*?<\/(?:table|tr|td|th|p|h[1-6]|ul|ol|li|a)>)\s*<\/div>/gi, '$1');
    
    // Unwrap span with only text content (no nested tags)
    cleaned = cleaned.replace(/<span>([^<]+)<\/span>/gi, '$1');
  }
  
  // Remove multiple spaces
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
  // Remove whitespace between tags
  cleaned = cleaned.replace(/>\s+</g, '><');
  
  // Remove empty lines
  cleaned = cleaned.replace(/^\s*[\r\n]/gm, '');
  
  return cleaned.trim();
}

// Simple HTML formatter
function formatHtml(html: string): string {
  let formatted = '';
  let indent = 0;
  const tab = '  ';
  
  // Remove existing whitespace between tags
  html = html.replace(/>\s+</g, '><').trim();
  
  // Split by tags
  const tags = html.split(/(<[^>]+>)/g).filter(Boolean);
  
  for (const tag of tags) {
    if (tag.startsWith('</')) {
      // Closing tag - decrease indent first
      indent = Math.max(0, indent - 1);
      formatted += tab.repeat(indent) + tag + '\n';
    } else if (tag.startsWith('<') && !tag.startsWith('<!') && !tag.endsWith('/>') && !tag.includes('</')) {
      // Opening tag
      formatted += tab.repeat(indent) + tag + '\n';
      // Don't indent for void elements
      const voidElements = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
      const tagName = tag.match(/<(\w+)/)?.[1]?.toLowerCase();
      if (tagName && !voidElements.includes(tagName)) {
        indent++;
      }
    } else if (tag.startsWith('<')) {
      // Self-closing or special tags
      formatted += tab.repeat(indent) + tag + '\n';
    } else if (tag.trim()) {
      // Text content
      formatted += tab.repeat(indent) + tag.trim() + '\n';
    }
  }
  
  return formatted.trim();
}

export function CodeEditor({
  value,
  onChange,
  language = 'markup',
  placeholder = '',
  className,
  minHeight = '300px',
  maxHeight = '500px',
  formatOnPaste = false,
  cleanOnPaste = false,
  showValidation = false,
}: CodeEditorProps) {
  // Validate HTML when showValidation is enabled
  const validation = useMemo(() => {
    if (!showValidation || language !== 'markup') {
      return null;
    }
    return validateHtml(value);
  }, [value, showValidation, language]);

  const highlight = (code: string) => (
    <Highlight theme={themes.nightOwl} code={code} language={language}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </>
      )}
    </Highlight>
  );

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if ((formatOnPaste || cleanOnPaste) && language === 'markup') {
      e.preventDefault();
      let pastedText = e.clipboardData.getData('text');
      
      // Clean first if enabled
      if (cleanOnPaste) {
        pastedText = cleanHtml(pastedText);
      }
      
      // Then format if enabled
      if (formatOnPaste) {
        pastedText = formatHtml(pastedText);
      }
      
      onChange(pastedText);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'overflow-auto rounded-md border border-input bg-[#011627] text-sm transition-colors focus-within:ring-1 focus-within:ring-ring focus-within:border-ring',
          validation && !validation.isValid && 'border-destructive',
          validation && validation.isValid && value.trim() && 'border-green-500',
          className
        )}
        style={{ minHeight, maxHeight }}
        onPaste={handlePaste}
      >
        <Editor
          value={value}
          onValueChange={handleChange}
          highlight={highlight}
          placeholder={placeholder}
          padding={12}
          style={{
            fontFamily: '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
            fontSize: 13,
            lineHeight: 1.5,
            minHeight,
          }}
          className="focus:outline-none"
          textareaClassName="focus:outline-none"
        />
      </div>

      {/* Validation feedback */}
      {validation && value.trim() && (
        <div className="flex flex-col gap-1">
          {validation.isValid && validation.warnings.length === 0 && (
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>HTML válido</span>
            </div>
          )}
          {validation.warnings.map((warning, i) => (
            <div key={`w-${i}`} className="flex items-center gap-1.5 text-xs text-yellow-600">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
          {validation.errors.slice(0, 3).map((error, i) => (
            <div key={`e-${i}`} className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
          {validation.errors.length > 3 && (
            <div className="text-xs text-muted-foreground">
              ...y {validation.errors.length - 3} errores más
            </div>
          )}
        </div>
      )}
    </div>
  );
}
