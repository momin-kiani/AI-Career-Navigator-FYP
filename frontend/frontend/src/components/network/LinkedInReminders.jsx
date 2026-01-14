// components/network/LinkedInReminders.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function LinkedInReminders() {
  const [reminders, setReminders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contactId: '',
    type: 'follow-up',
    message: '',
    scheduledDate: '',
    linkedInUrl: '',
    notes: ''
  });

  useEffect(() => {
    fetchReminders();
    fetchContacts();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await axios.get('/linkedin/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.scheduledDate) {
      alert('Please select a scheduled date');
      return;
    }
    try {
      await axios.post('/linkedin/reminders', formData);
      setFormData({ contactId: '', type: 'follow-up', message: '', scheduledDate: '', linkedInUrl: '', notes: '' });
      setShowForm(false);
      fetchReminders();
      alert('Reminder created successfully!');
    } catch (error) {
      alert('Failed to create reminder: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.post(`/linkedin/reminders/${id}/complete`);
      fetchReminders();
      alert('Reminder marked as completed!');
    } catch (error) {
      alert('Failed to complete reminder');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;
    try {
      await axios.delete(`/linkedin/reminders/${id}`);
      fetchReminders();
      alert('Reminder deleted successfully!');
    } catch (error) {
      alert('Failed to delete reminder');
    }
  };

  const typeColors = {
    'connection-request': 'bg-blue-100 text-blue-700',
    'follow-up': 'bg-yellow-100 text-yellow-700',
    'thank-you': 'bg-green-100 text-green-700',
    'check-in': 'bg-purple-100 text-purple-700',
    'custom': 'bg-gray-100 text-gray-700'
  };

  const upcomingReminders = reminders.filter(r => !r.completed && new Date(r.scheduledDate) >= new Date());
  const pastReminders = reminders.filter(r => r.completed || new Date(r.scheduledDate) < new Date());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">LinkedIn Reminders</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Create Reminder'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Create LinkedIn Reminder</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact (Optional)</label>
                <select
                  value={formData.contactId}
                  onChange={(e) => setFormData({...formData, contactId: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a contact</option>
                  {contacts.map(contact => (
                    <option key={contact._id} value={contact._id}>{contact.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="connection-request">Connection Request</option>
                  <option value="follow-up">Follow-Up</option>
                  <option value="thank-you">Thank You</option>
                  <option value="check-in">Check-In</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="3"
                placeholder="Reminder message or notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedInUrl}
                onChange={(e) => setFormData({...formData, linkedInUrl: e.target.value})}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Reminder
            </button>
          </form>
        </div>
      )}

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Reminders</h3>
          <div className="grid grid-cols-1 gap-4">
            {upcomingReminders.map((reminder) => (
              <div key={reminder._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${typeColors[reminder.type]}`}>
                        {reminder.type.replace('-', ' ')}
                      </span>
                      <span className="text-gray-600">
                        {new Date(reminder.scheduledDate).toLocaleString()}
                      </span>
                    </div>
                    {reminder.contactId && reminder.contactId.name && (
                      <p className="text-gray-700 font-semibold">{reminder.contactId.name}</p>
                    )}
                    {reminder.message && (
                      <p className="text-gray-600 mt-2">{reminder.message}</p>
                    )}
                    {reminder.linkedInUrl && (
                      <a
                        href={reminder.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                      >
                        View LinkedIn Profile →
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleComplete(reminder._id)}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleDelete(reminder._id)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past/Completed Reminders */}
      {pastReminders.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Past Reminders</h3>
          <div className="grid grid-cols-1 gap-4">
            {pastReminders.map((reminder) => (
              <div key={reminder._id} className="bg-gray-50 rounded-xl shadow-md p-6 opacity-75">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${typeColors[reminder.type]}`}>
                        {reminder.type.replace('-', ' ')}
                      </span>
                      <span className="text-gray-600">
                        {new Date(reminder.scheduledDate).toLocaleString()}
                      </span>
                      {reminder.completed && (
                        <span className="text-green-600 font-semibold">✓ Completed</span>
                      )}
                    </div>
                    {reminder.contactId && reminder.contactId.name && (
                      <p className="text-gray-700 font-semibold">{reminder.contactId.name}</p>
                    )}
                    {reminder.message && (
                      <p className="text-gray-600 mt-2">{reminder.message}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(reminder._id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reminders.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No reminders yet. Create reminders to stay on top of your LinkedIn follow-ups!</p>
        </div>
      )}
    </div>
  );
}

export default LinkedInReminders;
