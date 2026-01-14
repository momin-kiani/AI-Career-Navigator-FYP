// components/network/EmailWriter.jsx
import React, { useState } from 'react';
import axios from '../../services/api';

function EmailWriter() {
  const [purpose, setPurpose] = useState('networking');
  const [recipientName, setRecipientName] = useState('');
  const [recipientRole, setRecipientRole] = useState('');
  const [recipientCompany, setRecipientCompany] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/ai/email', {
        purpose,
        recipientName,
        recipientRole,
        recipientCompany,
        context
      });
      setEmail(response.data);
    } catch (error) {
      alert('Failed to generate email: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (email) {
      const fullEmail = `Subject: ${email.subject}\n\n${email.body}`;
      navigator.clipboard.writeText(fullEmail);
      alert('Email copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Email Writer</h2>
        <p className="text-gray-600 mb-6">
          Generate professional email drafts for networking, follow-ups, thank-you notes, and more.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Purpose *</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="networking">Networking</option>
              <option value="follow-up">Follow-Up</option>
              <option value="thank-you">Thank You</option>
              <option value="introduction">Introduction</option>
              <option value="connection-request">Connection Request</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Role</label>
              <input
                type="text"
                value={recipientRole}
                onChange={(e) => setRecipientRole(e.target.value)}
                placeholder="Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Company</label>
            <input
              type="text"
              value={recipientCompany}
              onChange={(e) => setRecipientCompany(e.target.value)}
              placeholder="Tech Corp"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Context</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows="3"
              placeholder="e.g., Met at conference, discussed job opportunity, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Email'}
          </button>
        </form>
      </div>

      {email && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Generated Email</h3>
              <button
                onClick={copyToClipboard}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Copy to Clipboard
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold">
                {email.subject}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg whitespace-pre-wrap">
                {email.body}
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <span>Word Count: {email.wordCount}</span>
              <span>Estimated Read Time: {email.estimatedReadTime} min</span>
            </div>
          </div>

          {email.tips && email.tips.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Tips</h4>
              <ul className="space-y-2">
                {email.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-green-50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-green-800 mb-2">How It Works</h4>
            <p className="text-sm text-green-700">
              The AI uses template-based generation with personalization. Based on the email purpose, it selects an appropriate 
              template (networking, follow-up, thank-you, etc.) and fills it with your profile information and recipient details. 
              The algorithm ensures professional tone, clear structure, and appropriate call-to-action for each email type.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailWriter;
