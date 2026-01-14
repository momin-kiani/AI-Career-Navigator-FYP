// components/career/DocumentHub.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function DocumentHub() {
  const [documents, setDocuments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'other',
    description: '',
    tags: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/career/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('documentFile', selectedFile);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('tags', formData.tags);

    try {
      await axios.post('/career/documents', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Document uploaded successfully!');
      setSelectedFile(null);
      setFormData({ category: 'other', description: '', tags: '' });
      setShowUpload(false);
      fetchDocuments();
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await axios.delete(`/career/documents/${id}`);
      fetchDocuments();
      alert('Document deleted successfully!');
    } catch (error) {
      alert('Failed to delete document');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      txt: '📃',
      image: '🖼️',
      other: '📎'
    };
    return icons[fileType] || icons.other;
  };

  const categoryColors = {
    resume: 'bg-blue-100 text-blue-700',
    'cover-letter': 'bg-green-100 text-green-700',
    certificate: 'bg-yellow-100 text-yellow-700',
    portfolio: 'bg-purple-100 text-purple-700',
    reference: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Document Hub</h2>
        <button
          onClick={() => setShowUpload(!showUpload)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {showUpload ? 'Cancel' : '+ Upload Document'}
        </button>
      </div>

      {showUpload && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Document</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">File *</label>
              <input
                type="file"
                required
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="resume">Resume</option>
                <option value="cover-letter">Cover Letter</option>
                <option value="certificate">Certificate</option>
                <option value="portfolio">Portfolio</option>
                <option value="reference">Reference</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="e.g., software, engineering, 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No documents yet. Upload your first document to get started!</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{getFileIcon(doc.fileType)}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 truncate">{doc.fileName}</h3>
                    <p className="text-sm text-gray-500">{formatFileSize(doc.fileSize)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
              
              <div className="mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[doc.category] || categoryColors.other}`}>
                  {doc.category}
                </span>
              </div>

              {doc.description && (
                <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
              )}

              {doc.tags && doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {doc.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400">
                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DocumentHub;
