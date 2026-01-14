// components/network/OpportunitiesDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function OpportunitiesDashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'job',
    description: '',
    status: 'exploring',
    priority: 'medium',
    deadline: '',
    value: { amount: '', currency: 'USD' },
    notes: ''
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get('/opportunities');
      setOpportunities(response.data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline) : null,
        value: formData.value.amount ? { amount: parseFloat(formData.value.amount), currency: formData.value.currency } : null
      };
      
      if (selectedOpportunity) {
        await axios.put(`/opportunities/${selectedOpportunity._id}`, data);
      } else {
        await axios.post('/opportunities', data);
      }
      setFormData({ title: '', company: '', type: 'job', description: '', status: 'exploring', priority: 'medium', deadline: '', value: { amount: '', currency: 'USD' }, notes: '' });
      setShowForm(false);
      setSelectedOpportunity(null);
      fetchOpportunities();
      alert(selectedOpportunity ? 'Opportunity updated successfully!' : 'Opportunity added successfully!');
    } catch (error) {
      alert('Failed to save opportunity: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      await axios.delete(`/opportunities/${id}`);
      fetchOpportunities();
      alert('Opportunity deleted successfully!');
    } catch (error) {
      alert('Failed to delete opportunity');
    }
  };

  const handleEdit = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setFormData({
      title: opportunity.title || '',
      company: opportunity.company || '',
      type: opportunity.type || 'job',
      description: opportunity.description || '',
      status: opportunity.status || 'exploring',
      priority: opportunity.priority || 'medium',
      deadline: opportunity.deadline ? new Date(opportunity.deadline).toISOString().split('T')[0] : '',
      value: opportunity.value || { amount: '', currency: 'USD' },
      notes: opportunity.notes || ''
    });
    setShowForm(true);
  };

  const statusColors = {
    exploring: 'bg-gray-100 text-gray-700',
    applied: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    closed: 'bg-green-100 text-green-700',
    lost: 'bg-red-100 text-red-700'
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Opportunities</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSelectedOpportunity(null);
            setFormData({ title: '', company: '', type: 'job', description: '', status: 'exploring', priority: 'medium', deadline: '', value: { amount: '', currency: 'USD' }, notes: '' });
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add Opportunity'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {selectedOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="job">Job</option>
                  <option value="project">Project</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="referral">Referral</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="exploring">Exploring</option>
                  <option value="applied">Applied</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.value.amount}
                    onChange={(e) => setFormData({...formData, value: {...formData.value, amount: e.target.value}})}
                    placeholder="Amount"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={formData.value.currency}
                    onChange={(e) => setFormData({...formData, value: {...formData.value, currency: e.target.value}})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
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
              {selectedOpportunity ? 'Update Opportunity' : 'Add Opportunity'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {opportunities.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No opportunities tracked yet. Start tracking your opportunities!</p>
          </div>
        ) : (
          opportunities.map((opp) => (
            <div key={opp._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{opp.title}</h3>
                  {opp.company && <p className="text-gray-600">{opp.company}</p>}
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[opp.status]}`}>
                      {opp.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityColors[opp.priority]}`}>
                      {opp.priority} priority
                    </span>
                    <span className="text-gray-500 text-sm">{opp.type}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(opp)}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(opp._id)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {opp.deadline && (
                <p className="text-sm text-gray-500 mb-2">
                  Deadline: {new Date(opp.deadline).toLocaleDateString()}
                </p>
              )}
              
              {opp.value && opp.value.amount && (
                <p className="text-sm text-gray-600 mb-2">
                  Value: {opp.value.currency} {opp.value.amount.toLocaleString()}
                </p>
              )}
              
              {opp.description && (
                <p className="text-gray-700 mb-2">{opp.description}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OpportunitiesDashboard;
