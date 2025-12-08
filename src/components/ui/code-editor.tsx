import Editor from 'react-simple-code-editor';
import { Highlight, themes } from 'prism-react-renderer';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = 'markup',
  placeholder = '',
  className,
  minHeight = '300px',
}: CodeEditorProps) {
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

  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-input bg-[#011627] text-sm transition-colors focus-within:ring-1 focus-within:ring-ring focus-within:border-ring',
        className
      )}
      style={{ minHeight }}
    >
      <Editor
        value={value}
        onValueChange={onChange}
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
  );
}
