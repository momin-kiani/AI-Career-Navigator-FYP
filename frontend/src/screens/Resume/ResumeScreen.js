import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../utils/api';
import { setResumes, addResume } from '../../redux/slices/resumeSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

function ResumeScreen() {
    const dispatch = useDispatch();
    const { resumes } = useSelector((state) => state.resume);
    const [uploading, setUploading] = useState(false);
    const [resumeContent, setResumeContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await api.get('/resume/list');
            dispatch(setResumes(response.data));
        } catch (error) {
            console.error('Error fetching resumes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const response = await api.post('/resume/upload', {
                fileName: 'Resume.pdf',
                content: resumeContent
            });

            dispatch(addResume(response.data));
            setResumeContent('');
            alert('Resume uploaded successfully!');
        } catch (error) {
            alert('Upload failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading resumes..." />;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Resume Optimization</h1>

            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Upload New Resume</h2>
                <form onSubmit={handleUpload}>
                    <textarea
                        value={resumeContent}
                        onChange={(e) => setResumeContent(e.target.value)}
                        placeholder="Paste your resume content here..."
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                        required
                    />
                    <button
                        type="submit"
                        disabled={uploading}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {uploading ? 'Uploading...' : 'Upload & Analyze'}
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Resumes</h2>
                <div className="space-y-4">
                    {resumes.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No resumes uploaded yet</p>
                    ) : (
                        resumes.map((resume) => (
                            <div key={resume._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{resume.fileName || 'Resume'}</h3>
                                        <p className="text-sm text-gray-500">
                                            Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">{resume.atsScore}%</div>
                                        <div className="text-sm text-gray-500">ATS Score</div>
                                    </div>
                                </div>

                                {resume.analysis && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-700 mb-2">Strengths</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {resume.analysis.strengths?.map((strength, i) => (
                                                        <li key={i}>✓ {strength}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-700 mb-2">Suggestions</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {resume.analysis.suggestions?.slice(0, 3).map((suggestion, i) => (
                                                        <li key={i}>• {suggestion}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResumeScreen;