// components/network/ContactsDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function ContactsDashboard() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all'); // all, recruiter, hiring-manager
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    email: '',
    phone: '',
    linkedInUrl: '',
    location: '',
    tags: [],
    notes: ''
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, filterTag]);

  const filterContacts = () => {
    let filtered = [...contacts];

    // Filter by tag (recruiter, hiring-manager, or all)
    if (filterTag !== 'all') {
      filtered = filtered.filter(contact => 
        contact.tags && contact.tags.some(tag => 
          tag.toLowerCase().includes(filterTag.toLowerCase())
        )
      );
    }

    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name?.toLowerCase().includes(lowerSearch) ||
        contact.role?.toLowerCase().includes(lowerSearch) ||
        contact.company?.toLowerCase().includes(lowerSearch) ||
        contact.email?.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredContacts(filtered);
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
    try {
      if (selectedContact) {
        await axios.put(`/contacts/${selectedContact._id}`, formData);
      } else {
        await axios.post('/contacts', formData);
      }
      setFormData({ name: '', role: '', company: '', email: '', phone: '', linkedInUrl: '', location: '', tags: [], notes: '' });
      setShowForm(false);
      setSelectedContact(null);
      fetchContacts();
      alert(selectedContact ? 'Contact updated successfully!' : 'Contact added successfully!');
    } catch (error) {
      alert('Failed to save contact: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await axios.delete(`/contacts/${id}`);
      fetchContacts();
      alert('Contact deleted successfully!');
    } catch (error) {
      alert('Failed to delete contact');
    }
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name || '',
      role: contact.role || '',
      company: contact.company || '',
      email: contact.email || '',
      phone: contact.phone || '',
      linkedInUrl: contact.linkedInUrl || '',
      location: contact.location || '',
      tags: contact.tags || [],
      notes: contact.notes || ''
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSelectedContact(null);
            setFormData({ name: '', role: '', company: '', email: '', phone: '', linkedInUrl: '', location: '', tags: [], notes: '' });
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add Contact'}
        </button>
      </div>

      {/* Recruiter/Hiring Manager Search Tool */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔍 Recruiter & Hiring Manager Search</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, role, company, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterTag('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterTag === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Contacts
            </button>
            <button
              onClick={() => setFilterTag('recruiter')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterTag === 'recruiter'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Recruiters
            </button>
            <button
              onClick={() => setFilterTag('hiring-manager')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterTag === 'hiring-manager'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hiring Managers
            </button>
          </div>
        </div>
        {filterTag !== 'all' && (
          <p className="mt-2 text-sm text-gray-600">
            Showing {filteredContacts.length} {filterTag === 'recruiter' ? 'recruiter' : 'hiring manager'}(s)
          </p>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {selectedContact ? 'Edit Contact' : 'Add New Contact'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedInUrl}
                  onChange={(e) => setFormData({...formData, linkedInUrl: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (e.g., recruiter, hiring-manager, mentor)</label>
              <input
                type="text"
                placeholder="Enter tags separated by commas"
                value={formData.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                  setFormData({...formData, tags});
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Common tags: recruiter, hiring-manager, mentor, colleague</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {selectedContact ? 'Update Contact' : 'Add Contact'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              {contacts.length === 0 
                ? 'No contacts yet. Start building your network!'
                : `No contacts found matching your search${filterTag !== 'all' ? ` (${filterTag})` : ''}.`
              }
            </p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div key={contact._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{contact.name}</h3>
                  {contact.role && <p className="text-gray-600">{contact.role}</p>}
                  {contact.company && <p className="text-gray-600">{contact.company}</p>}
                  {contact.location && <p className="text-gray-500 text-sm">📍 {contact.location}</p>}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline text-sm">
                    📧 {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <span className="text-gray-600 text-sm">📞 {contact.phone}</span>
                )}
                {contact.linkedInUrl && (
                  <a href={contact.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    💼 LinkedIn
                  </a>
                )}
              </div>

              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {contact.tags.map((tag, i) => (
                    <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {contact.lastContactDate && (
                <p className="text-sm text-gray-500">
                  Last contact: {new Date(contact.lastContactDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContactsDashboard;
