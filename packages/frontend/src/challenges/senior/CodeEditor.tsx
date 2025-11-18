import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface EditorFile {
  name: string;
  language: string;
  content: string;
}

const initialFiles: EditorFile[] = [
  {
    name: 'script.js',
    language: 'javascript',
    content: `// JavaScript Example
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

const user = 'World';
greet(user);

// Try editing this code and running it!`,
  },
  {
    name: 'app.ts',
    language: 'typescript',
    content: `// TypeScript Example
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
  };
}

const newUser = createUser('John Doe', 'john@example.com');
console.log(newUser);`,
  },
  {
    name: 'example.py',
    language: 'python',
    content: `# Python Example
def fibonacci(n):
    """Calculate fibonacci number"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Calculate first 10 fibonacci numbers
for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")`,
  },
  {
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a sample HTML document.</p>
</body>
</html>`,
  },
  {
    name: 'styles.css',
    language: 'css',
    content: `/* CSS Example */
body {
  font-family: 'Arial', sans-serif;
  background-color: #1e1e1e;
  color: #ffffff;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.button {
  background-color: #007acc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
  },
];

const languages = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'json', name: 'JSON' },
];

export default function CodeEditor() {
  const [files, setFiles] = useState<EditorFile[]>(initialFiles);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [output, setOutput] = useState<string>('');
  const [showOutput, setShowOutput] = useState(false);
  const editorRef = useRef<any>(null);

  const activeFile = files[activeFileIndex];

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      const newFiles = [...files];
      newFiles[activeFileIndex].content = value;
      setFiles(newFiles);
    }
  };

  const addNewFile = () => {
    const newFileName = `file${files.length + 1}.js`;
    const newFile: EditorFile = {
      name: newFileName,
      language: 'javascript',
      content: '// New file\n',
    };
    setFiles([...files, newFile]);
    setActiveFileIndex(files.length);
  };

  const closeFile = (index: number) => {
    if (files.length > 1) {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      if (activeFileIndex >= index && activeFileIndex > 0) {
        setActiveFileIndex(activeFileIndex - 1);
      }
    }
  };

  const changeLanguage = (language: string) => {
    const newFiles = [...files];
    newFiles[activeFileIndex].language = language;
    setFiles(newFiles);
  };

  const runCode = () => {
    if (activeFile.language === 'javascript') {
      try {
        // Capture console.log output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args: any[]) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
          originalLog(...args);
        };

        // Execute the code
        // eslint-disable-next-line no-eval
        eval(activeFile.content);

        // Restore console.log
        console.log = originalLog;

        setOutput(logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)');
        setShowOutput(true);
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        setShowOutput(true);
      }
    } else {
      setOutput(`Code execution is only supported for JavaScript files.\nSelected language: ${activeFile.language}`);
      setShowOutput(true);
    }
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const findAndReplace = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.startFindReplaceAction').run();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Code Editor</h1>
          <p className="text-gray-400">Monaco Editor with multi-language support</p>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-800 rounded-t-lg p-3 flex flex-wrap items-center gap-3 border-b border-gray-700">
          <select
            data-testid="language-select"
            value={activeFile.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <select
            data-testid="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'vs-dark' | 'light')}
            className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="vs-dark">Dark Theme</option>
            <option value="light">Light Theme</option>
          </select>

          <button
            data-testid="format-button"
            onClick={formatCode}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition"
            title="Format Code (Shift+Alt+F)"
          >
            Format
          </button>

          <button
            data-testid="find-replace-button"
            onClick={findAndReplace}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition"
            title="Find & Replace (Ctrl+H)"
          >
            Find/Replace
          </button>

          {activeFile.language === 'javascript' && (
            <button
              data-testid="run-button"
              onClick={runCode}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
            >
              ▶ Run Code
            </button>
          )}

          <button
            data-testid="add-file-button"
            onClick={addNewFile}
            className="ml-auto px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition"
          >
            + New File
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto">
          {files.map((file, index) => (
            <div
              key={index}
              data-testid={`tab-${index}`}
              className={`flex items-center gap-2 px-4 py-2 border-r border-gray-700 cursor-pointer transition ${
                index === activeFileIndex
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
              }`}
              onClick={() => setActiveFileIndex(index)}
            >
              <span className="text-sm">{file.name}</span>
              {files.length > 1 && (
                <button
                  data-testid={`close-tab-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(index);
                  }}
                  className="text-gray-500 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="bg-gray-900" data-testid="monaco-editor">
          <Editor
            height="500px"
            language={activeFile.language}
            value={activeFile.content}
            theme={theme}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              folding: true,
              foldingStrategy: 'indentation',
              showFoldingControls: 'always',
              wordWrap: 'on',
              tabSize: 2,
            }}
          />
        </div>

        {/* Output Panel */}
        {showOutput && (
          <div className="mt-4 bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">Output</h3>
              <button
                data-testid="close-output-button"
                onClick={() => setShowOutput(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <pre
              data-testid="code-output"
              className="bg-gray-900 rounded p-4 text-sm text-gray-300 overflow-auto max-h-48"
            >
              {output}
            </pre>
          </div>
        )}

        {/* Editor Features Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">✨ Features</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• Syntax highlighting for multiple languages</li>
              <li>• Line numbers and code folding</li>
              <li>• IntelliSense / Autocomplete (Ctrl+Space)</li>
              <li>• Find and replace (Ctrl+H)</li>
              <li>• Code formatting (Shift+Alt+F)</li>
              <li>• Multiple file tabs</li>
              <li>• Theme switching (Dark/Light)</li>
              <li>• JavaScript code execution</li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">⌨️ Keyboard Shortcuts</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>• <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+S</kbd> Save (no-op)</li>
              <li>• <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+F</kbd> Find</li>
              <li>• <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+H</kbd> Replace</li>
              <li>• <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+Space</kbd> Autocomplete</li>
              <li>• <kbd className="px-2 py-1 bg-gray-700 rounded">Shift+Alt+F</kbd> Format</li>
              <li>• <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl+/</kbd> Comment</li>
            </ul>
          </div>
        </div>

        {/* Testing Hints */}
        <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-600 rounded">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Switch languages using language-select dropdown</li>
            <li>• Toggle themes with theme-select</li>
            <li>• Type code and verify syntax highlighting appears</li>
            <li>• Test code folding by clicking line number gutter</li>
            <li>• Use Ctrl+Space to trigger autocomplete</li>
            <li>• Create new files with add-file-button</li>
            <li>• Close tabs using close-tab-[index] buttons</li>
            <li>• Run JavaScript code and verify output in code-output</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

