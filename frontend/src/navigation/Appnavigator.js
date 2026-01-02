import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import NavItem from '../components/NavItem';

function MainLayout() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-blue-600">CareerX</h1>
                    <p className="text-sm text-gray-600 mt-1">AI Career Navigator</p>
                </div>

                <nav className="p-4 space-y-2">
                    <NavItem
                        icon="📊"
                        label="Dashboard"
                        active={isActive('/dashboard')}
                        onClick={() => navigate('/dashboard')}
                    />
                    <NavItem
                        icon="📄"
                        label="Resume"
                        active={isActive('/resume')}
                        onClick={() => navigate('/resume')}
                    />
                    <NavItem
                        icon="💼"
                        label="Job Applications"
                        active={isActive('/jobs')}
                        onClick={() => navigate('/jobs')}
                    />
                    <NavItem
                        icon="🔗"
                        label="LinkedIn"
                        active={isActive('/linkedin')}
                        onClick={() => navigate('/linkedin')}
                    />
                    <NavItem
                        icon="🎯"
                        label="Career Assessment"
                        active={isActive('/assessment')}
                        onClick={() => navigate('/assessment')}
                    />
                    <NavItem
                        icon="👥"
                        label="Mentorship"
                        active={isActive('/mentorship')}
                        onClick={() => navigate('/mentorship')}
                    />
                    <NavItem
                        icon="📈"
                        label="Market Insights"
                        active={isActive('/market')}
                        onClick={() => navigate('/market')}
                    />
                    <NavItem
                        icon="💬"
                        label="AI Assistant"
                        active={isActive('/chat')}
                        onClick={() => navigate('/chat')}
                    />
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">
                                {user?.firstName} {user?.lastName}
                            </p>
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
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;