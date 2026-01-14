// components/assistant/EnhancedChatbot.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function EnhancedChatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Load chat history if needed
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await axios.get('/chat/history');
      if (response.data && response.data.length > 0) {
        const latestHistory = response.data[0];
        if (latestHistory.messages && latestHistory.messages.length > 0) {
          setMessages(latestHistory.messages.slice(-10)); // Last 10 messages
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      // Don't show error to user if history fails - just start fresh
      // This is expected if user has no chat history yet
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    setSuggestions([]);

    try {
      // Log the request for debugging
      console.log('Sending chat message to:', '/assistant/chat');
      console.log('Full URL will be:', axios.defaults.baseURL + '/assistant/chat');
      
      const response = await axios.post('/assistant/chat', {
        message: inputMessage,
        category: 'career-guidance'
      });

      console.log('Chat response received:', response.data);

      if (response.data && response.data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
        
        if (response.data.suggestions && response.data.suggestions.length > 0) {
          setSuggestions(response.data.suggestions);
        }
      } else {
        // Handle case where response structure might be different
        const responseText = response.data?.response || response.data?.message || JSON.stringify(response.data);
        if (responseText) {
          setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        } else {
          throw new Error('Invalid response from server');
        }
      }
    } catch (error) {
      console.error('Chatbot error details:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      let troubleshooting = '';
      
      if (error.response) {
        // Server responded with error
        const status = error.response.status;
        errorMessage = error.response.data?.error || `Server error: ${status}`;
        
        if (status === 404) {
          troubleshooting = '\n\n⚠️ 404 Error - Endpoint not found.\n\nPossible causes:\n1. Backend server may not be running\n2. Endpoint path mismatch\n3. Route not registered\n\nPlease check:\n- Is backend running on http://localhost:5000?\n- Check browser console for full error details';
        } else if (status === 401) {
          troubleshooting = '\n\n⚠️ Authentication Error - Please log in again.';
        } else if (status === 500) {
          troubleshooting = '\n\n⚠️ Server Error - Check backend console for details.';
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Unable to connect to server.';
        troubleshooting = '\n\n⚠️ Connection Error\n\nPlease ensure:\n1. Backend server is running: cd backend && node server.js\n2. Server is on http://localhost:5000\n3. No firewall blocking the connection';
      } else {
        // Error in request setup
        errorMessage = error.message || 'An unexpected error occurred.';
        troubleshooting = '\n\n⚠️ Request Error - Check browser console for details.';
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⚠️ ${errorMessage}${troubleshooting}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-white rounded-xl shadow-md p-6 mb-4 overflow-y-auto min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">How can I help you today?</h3>
              <p className="text-gray-600 mb-4">Ask me about career guidance, resume tips, job search strategies, and more!</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setInputMessage('How can I improve my resume?')}
                  className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-100 transition"
                >
                  Resume Tips
                </button>
                <button
                  onClick={() => setInputMessage('What jobs match my skills?')}
                  className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-100 transition"
                >
                  Job Search
                </button>
                <button
                  onClick={() => setInputMessage('How do I prepare for interviews?')}
                  className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm hover:bg-purple-100 transition"
                >
                  Interview Prep
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="mb-4 bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800 mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(suggestion)}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={sendMessage} className="flex space-x-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default EnhancedChatbot;
