// components/layout/MainApp.jsx
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import NavItem from './NavItem';
import AnimatedPageWrapper from './AnimatedPageWrapper';
import Dashboard from '../../pages/Dashboard';
import ResumeModule from '../../pages/ResumeModule';
import JobApplicationsModule from '../../pages/JobApplicationsModule';
import LinkedInModule from '../../pages/LinkedInModule';
import AssessmentModule from '../../pages/AssessmentModule';
import MentorshipModule from '../../pages/MentorshipModule';
import MarketInsightsModule from '../../pages/MarketInsightsModule';
import ChatModule from '../../pages/ChatModule';
import NetworkModule from '../../pages/NetworkModule';
import ProfileOptimization from '../../pages/ProfileOptimization';
import CareerResources from '../../pages/CareerResources';
import CareerAssistant from '../../pages/CareerAssistant';
import IndustryInsights from '../../pages/IndustryInsights';
import RegionalInsights from '../../pages/RegionalInsights';
import StudentTestModule from '../../pages/StudentTestModule';

function MainApp({ user, currentPage, setCurrentPage, handleLogout }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col relative">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">CareerX</h1>
          <p className="text-sm text-gray-600 mt-1">AI Career Navigator</p>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <NavItem icon="📊" label="Dashboard" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
          <NavItem icon="📄" label="Resume" active={currentPage === 'resume'} onClick={() => setCurrentPage('resume')} />
          <NavItem icon="💼" label="Job Applications" active={currentPage === 'jobs'} onClick={() => setCurrentPage('jobs')} />
          <NavItem icon="🌐" label="Network" active={currentPage === 'network'} onClick={() => setCurrentPage('network')} />
          <NavItem icon="👤" label="Profile" active={currentPage === 'profile'} onClick={() => setCurrentPage('profile')} />
          <NavItem icon="📚" label="Resources" active={currentPage === 'resources'} onClick={() => setCurrentPage('resources')} />
          <NavItem icon="🤖" label="AI Assistant" active={currentPage === 'assistant'} onClick={() => setCurrentPage('assistant')} />
          <NavItem icon="🏭" label="Industry Insights" active={currentPage === 'industry'} onClick={() => setCurrentPage('industry')} />
          <NavItem icon="🌍" label="Regional Insights" active={currentPage === 'regional'} onClick={() => setCurrentPage('regional')} />
          <NavItem icon="📝" label="Tests" active={currentPage === 'tests'} onClick={() => setCurrentPage('tests')} />
          <NavItem icon="🔗" label="LinkedIn" active={currentPage === 'linkedin'} onClick={() => setCurrentPage('linkedin')} />
          <NavItem icon="🎯" label="Career Assessment" active={currentPage === 'assessment'} onClick={() => setCurrentPage('assessment')} />
          <NavItem icon="👥" label="Mentorship" active={currentPage === 'mentorship'} onClick={() => setCurrentPage('mentorship')} />
          <NavItem icon="📈" label="Market Insights" active={currentPage === 'market'} onClick={() => setCurrentPage('market')} />
          <NavItem icon="💬" label="AI Assistant" active={currentPage === 'chat'} onClick={() => setCurrentPage('chat')} />
        </nav>

        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {currentPage === 'dashboard' && (
            <AnimatedPageWrapper key="dashboard">
              <Dashboard user={user} setCurrentPage={setCurrentPage} />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'resume' && (
            <AnimatedPageWrapper key="resume">
              <ResumeModule />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'jobs' && (
            <AnimatedPageWrapper key="jobs">
              <JobApplicationsModule />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'network' && (
            <AnimatedPageWrapper key="network">
              <NetworkModule />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'profile' && (
            <AnimatedPageWrapper key="profile">
              <ProfileOptimization />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'resources' && (
            <AnimatedPageWrapper key="resources">
              <CareerResources />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'assistant' && (
            <AnimatedPageWrapper key="assistant">
              <CareerAssistant />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'industry' && (
            <AnimatedPageWrapper key="industry">
              <IndustryInsights />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'regional' && (
            <AnimatedPageWrapper key="regional">
              <RegionalInsights />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'tests' && (
            <AnimatedPageWrapper key="tests">
              <StudentTestModule />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'linkedin' && (
            <AnimatedPageWrapper key="linkedin">
              <LinkedInModule />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'assessment' && (
            <AnimatedPageWrapper key="assessment">
              <AssessmentModule />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'mentorship' && (
            <AnimatedPageWrapper key="mentorship">
              <MentorshipModule />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'market' && (
            <AnimatedPageWrapper key="market">
              <MarketInsightsModule />
            </AnimatedPageWrapper>
          )}
          {currentPage === 'chat' && (
            <AnimatedPageWrapper key="chat">
              <ChatModule />
            </AnimatedPageWrapper>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default MainApp;
