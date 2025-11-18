import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: number;
}

// Mock user for the open platform
const mockUser = {
  name: 'Demo User',
};

export default function RealtimeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [usersOnline, setUsersOnline] = useState(1);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws/chat`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        setMessages((prev) => [...prev, data]);
      } else if (data.type === 'users') {
        setUsersOnline(data.count);
      } else if (data.type === 'history') {
        setMessages(data.messages || []);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setConnected(false);
      console.log('WebSocket disconnected');
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = {
      type: 'message',
      username: mockUser.name,
      message: inputMessage.trim(),
      timestamp: Date.now(),
    };

    wsRef.current.send(JSON.stringify(message));
    setInputMessage('');
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Real-time Chat</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span
                className={`inline-block w-2 h-2 rounded-full mr-1 ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`}
                data-testid="connection-status"
              ></span>
              {connected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Users Online</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400" data-testid="users-online">
              {usersOnline}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3" data-testid="messages-container">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.username === mockUser.name;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${msg.id}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isOwnMessage ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">{msg.username}</span>
                      <span
                        className={`text-xs ${isOwnMessage ? 'text-indigo-200' : 'text-gray-500'}`}
                      >
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="break-words">{msg.message}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={!connected}
              className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              data-testid="message-input"
            />
            <button
              type="submit"
              disabled={!connected || !inputMessage.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="send-button"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
