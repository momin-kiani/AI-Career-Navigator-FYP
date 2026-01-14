// components/resume/ResumeTemplates.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function ResumeTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/resume/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume Templates</h2>
        <p className="text-gray-600 mb-6">
          Choose a professional template that matches your industry and career level. 
          Each template is optimized for ATS compatibility.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition ${
                selectedTemplate?.id === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-700 mb-2">Sections:</div>
                <div className="flex flex-wrap gap-1">
                  {template.sections.map((section, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500 italic">{template.preview}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedTemplate && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {selectedTemplate.name} Template
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600">{selectedTemplate.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Preview</h4>
              <p className="text-gray-600 italic">{selectedTemplate.preview}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Included Sections</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {selectedTemplate.sections.map((section, index) => (
                  <li key={index}>{section}</li>
                ))}
              </ul>
            </div>
            <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Use This Template
            </button>
          </div>
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">About Templates</h3>
        <p className="text-sm text-blue-700">
          All templates are designed with ATS compatibility in mind. They use standard section headers, 
          clear formatting, and are optimized for both human recruiters and applicant tracking systems. 
          Choose a template that best represents your professional style and industry expectations.
        </p>
      </div>
    </div>
  );
}

export default ResumeTemplates;
