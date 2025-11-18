import { useRef } from 'react';

export default function RichTextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    // Content changes are tracked via ref
  };

  const isCommandActive = (command: string) => {
    return document.queryCommandState(command);
  };

  const getHTML = () => {
    return editorRef.current?.innerHTML || '';
  };

  const clearContent = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Rich Text Editor</h2>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-1">
          {/* Text Style */}
          <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => execCommand('bold')}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                isCommandActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Bold"
              data-testid="bold-button"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => execCommand('italic')}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                isCommandActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Italic"
              data-testid="italic-button"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => execCommand('underline')}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                isCommandActive('underline') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Underline"
              data-testid="underline-button"
            >
              <u>U</u>
            </button>
            <button
              onClick={() => execCommand('strikeThrough')}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                isCommandActive('strikeThrough') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Strikethrough"
              data-testid="strikethrough-button"
            >
              <s>S</s>
            </button>
          </div>

          {/* Alignment */}
          <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => execCommand('justifyLeft')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Align Left"
              data-testid="align-left"
            >
              ☰
            </button>
            <button
              onClick={() => execCommand('justifyCenter')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Align Center"
              data-testid="align-center"
            >
              ☷
            </button>
            <button
              onClick={() => execCommand('justifyRight')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Align Right"
              data-testid="align-right"
            >
              ≡
            </button>
          </div>

          {/* Lists */}
          <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => execCommand('insertUnorderedList')}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                isCommandActive('insertUnorderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Bullet List"
              data-testid="bullet-list"
            >
              •••
            </button>
            <button
              onClick={() => execCommand('insertOrderedList')}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                isCommandActive('insertOrderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Numbered List"
              data-testid="numbered-list"
            >
              123
            </button>
          </div>

          {/* Formatting */}
          <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
            <select
              onChange={(e) => execCommand('formatBlock', e.target.value)}
              className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
              data-testid="heading-select"
              defaultValue=""
            >
              <option value="">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
          </div>

          {/* Insert */}
          <div className="flex gap-1">
            <button
              onClick={insertLink}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Insert Link"
              data-testid="insert-link"
            >
              🔗
            </button>
            <button
              onClick={clearContent}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600 dark:text-red-400"
              title="Clear All"
              data-testid="clear-button"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="min-h-[300px] p-4 focus:outline-none prose max-w-none text-gray-900 dark:text-white"
          data-testid="editor-content"
          suppressContentEditableWarning
        >
          <p>Start typing here...</p>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">HTML Output</h3>
        <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded border border-gray-300 dark:border-gray-600 overflow-x-auto">
          <code className="text-gray-900 dark:text-white" data-testid="html-output">{getHTML()}</code>
        </pre>
      </div>

      {/* Character Count */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-right">
        {editorRef.current?.textContent?.length || 0} characters
      </div>
    </div>
  );
}
