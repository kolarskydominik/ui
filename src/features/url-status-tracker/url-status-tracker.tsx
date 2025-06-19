import { Copy, Download, FileText, Link, Plus, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

type UrlItemType = {
  url: string;
  emojis: string[];
  id: string;
};

type EmojiDescriptionType = {
  emoji: string;
  description: string;
};

const defaultEmojiDescriptions: EmojiDescriptionType[] = [
  {
    emoji: '✅',
    description: 'Working correctly',
  },
  {
    emoji: '📅',
    description: 'Date input needs calendar update',
  },
  {
    emoji: '🚧',
    description: 'Domain issues or 404 errors',
  },
  {
    emoji: '🪫',
    description: 'No availability in dates',
  },
];

const URLStatusTracker = () => {
  const [urls, setUrls] = useState<UrlItemType[]>([]);
  const [emojiDescriptions, setEmojiDescriptions] = useState(
    defaultEmojiDescriptions,
  );
  const [newUrl, setNewUrl] = useState('');
  const [newEmoji, setNewEmoji] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [output, setOutput] = useState('');

  // Handlers
  const addUrl = () => {
    if (newUrl.trim()) {
      setUrls([
        ...urls,
        {
          url: newUrl.trim(),
          emojis: [],
          id: uuid(),
        },
      ]);
      setNewUrl('');
    }
  };

  const addEmojiDescription = () => {
    if (newEmoji.trim() && newDescription.trim()) {
      setEmojiDescriptions([
        ...emojiDescriptions,
        {
          emoji: newEmoji.trim(),
          description: newDescription.trim(),
        },
      ]);
      setNewEmoji('');
      setNewDescription('');
    }
  };

  const removeUrl = (id: string) => {
    setUrls(urls.filter((url) => url.id !== id));
  };

  const removeEmojiDescription = (index: number) => {
    setEmojiDescriptions(emojiDescriptions.filter((_, i) => i !== index));
  };

  const toggleEmojiForUrl = (urlId: string, emoji: string) => {
    setUrls(
      urls.map((url) => {
        if (url.id === urlId) {
          const hasEmoji = url.emojis.includes(emoji);
          return {
            ...url,
            emojis: hasEmoji
              ? url.emojis.filter((e) => e !== emoji)
              : [...url.emojis, emoji],
          };
        }
        return url;
      }),
    );
  };

  const generateOutput = () => {
    // Generate emoji descriptions section
    const descriptionsSection = emojiDescriptions
      .map((item) => `${item.emoji} ${item.description}`)
      .join('\n');

    // Generate URLs section
    const urlsSection = urls
      .map((url) => {
        const emojiString =
          url.emojis.length > 0 ? ` ${url.emojis.join(' ')}` : '';
        return `- ${url.url}${emojiString}`;
      })
      .join('\n');

    const fullOutput = `${descriptionsSection}\n\n${urlsSection}`;
    setOutput(fullOutput);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadAsFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'url-status-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBulkUrlUpload = (text: string) => {
    const lines = text.split('\n').filter((line) => line.trim());
    const newUrls = lines.map((line) => ({
      url: line.trim(),
      emojis: [],
      id: uuid(),
    }));
    setUrls([...urls, ...newUrls]);
  };

  return (
    <section
      className="mx-auto flex min-h-screen flex-1 items-center justify-center bg-gradient-to-br
        from-blue-50 to-indigo-100 p-4 font-sans"
    >
      <div className="max-w-screen-xl">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-gray-800">
              URL Status Tracker
            </h1>
            <p className="text-gray-600">
              Upload URLs, assign status emojis, and generate formatted reports
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column - Input Section */}
            <div className="space-y-6">
              {/* Emoji Descriptions */}
              <div className="rounded-xl bg-gray-50 p-6">
                <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
                  <FileText className="mr-2" size={20} />
                  Status Emojis
                </h2>

                <div className="mb-4 space-y-2">
                  {emojiDescriptions.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-white p-3"
                    >
                      <span className="text-lg">
                        {item.emoji} {item.description}
                      </span>
                      <button
                        onClick={() => removeEmojiDescription(index)}
                        className="text-red-500 transition-colors hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    placeholder="🔄"
                    className="w-16 rounded-lg border border-gray-300 p-2 text-center text-lg"
                    maxLength={2}
                  />
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Add description..."
                    className="flex-1 rounded-lg border border-gray-300 p-2"
                  />
                  <button
                    onClick={addEmojiDescription}
                    className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* URL Input */}
              <div className="rounded-xl bg-gray-50 p-6">
                <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-800">
                  <Link className="mr-2" size={20} />
                  Add URLs
                </h2>

                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com/page"
                    className="flex-1 rounded-lg border border-gray-300 p-2"
                    onKeyUp={(e) => e.key === 'Enter' && addUrl()}
                  />
                  <button
                    onClick={addUrl}
                    className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors
                      hover:bg-green-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="mb-4">
                  <textarea
                    placeholder="Or paste multiple URLs (one per line)..."
                    className="h-24 w-full resize-none rounded-lg border border-gray-300 p-3"
                    onPaste={(e) => {
                      setTimeout(() => {
                        const text = (e.target as HTMLTextAreaElement).value;
                        if (text.includes('\n')) {
                          handleBulkUrlUpload(text);
                          (e.target as HTMLTextAreaElement).value = '';
                        }
                      }, 0);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - URL List */}
            <div className="rounded-xl bg-gray-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center text-xl font-semibold text-gray-800">
                  <Upload className="mr-2" size={20} />
                  URLs ({urls.length})
                </h2>
                <button
                  onClick={generateOutput}
                  className="rounded-lg bg-purple-500 px-6 py-2 font-medium text-white transition-colors
                    hover:bg-purple-600"
                >
                  Generate Report
                </button>
              </div>

              <div className="max-h-96 space-y-3 overflow-y-auto md:max-h-160">
                {urls.map((url) => (
                  <div
                    key={url.id}
                    className="rounded-lg bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-sm break-all text-gray-600">
                          {url.url}
                        </p>
                      </div>
                      <button
                        onClick={() => removeUrl(url.id)}
                        className="flex-shrink-0 text-red-500 transition-colors hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {emojiDescriptions.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => toggleEmojiForUrl(url.id, item.emoji)}
                          className={`rounded-lg p-2 text-lg transition-all ${
                          url.emojis.includes(item.emoji)
                              ? 'scale-110 bg-blue-100 ring-2 ring-blue-300'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          title={item.description}
                        >
                          {item.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {urls.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <Link size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No URLs added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Output Section */}
          {output && (
            <div className="mt-8 rounded-xl bg-gray-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Generated Report
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white
                      transition-colors hover:bg-blue-600"
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                  <button
                    onClick={downloadAsFile}
                    className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white
                      transition-colors hover:bg-green-600"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              <pre
                className="max-h-96 overflow-x-auto overflow-y-auto rounded-lg border bg-white p-4
                  font-mono text-sm whitespace-pre-wrap"
              >
                {output}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default URLStatusTracker;
