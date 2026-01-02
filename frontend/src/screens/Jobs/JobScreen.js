import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../utils/api';
import { setApplications, addApplication, updateApplication } from '../../redux/slices/jobsSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

function JobsScreen() {
    const dispatch = useDispatch();
    const { applications } = useSelector((state) => state.jobs);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        jobUrl: '',
        status: 'saved'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/jobs/applications');
            dispatch(setApplications(response.data));
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/jobs/applications', formData);
            dispatch(addApplication(response.data));
            setFormData({ jobTitle: '', company: '', jobUrl: '', status: 'saved' });
            setShowForm(false);
            alert('Application added successfully!');
        } catch (error) {
            alert('Failed to add application');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await api.put(/jobs/applications / ${ id }, { status });
            dispatch(updateApplication(response.data));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const statusColors = {
        saved: 'bg-gray-100 text-gray-700',
        applied: 'bg-blue-100 text-blue-700',
        interviewing: 'bg-yellow-100 text-yellow-700',
        offered: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700'
    };

    if (loading) {
        return <LoadingSpinner message="Loading applications..." />;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Job Applications</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Add Application'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Application</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                            <input
                                type="text"
                                required
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job URL</label>
                            <input
                                type="url"
                                value={formData.jobUrl}
                                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Add Application
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {applications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <p className="text-gray-500 text-lg">No applications yet. Start tracking your job search!</p>
                    </div>
                ) : (
                    applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{app.jobTitle}</h3>
                  <p className="text-gray-600">{app.company}</p>
                  {app.jobUrl && (
                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                      View Job Posting →
                    </a>
                  )}
                </div>
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className={px-4 py-2 rounded-lg font-semibold ${statusColors[app.status]}}
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📅 Added {new Date(app.createdAt).toLocaleDateString()}</span>
                {app.appliedDate && (
                  <span>✉️ Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            ))
        )}
        </div>
    </div >
  );
}

export default JobsScreen;