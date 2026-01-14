// components/layout/NavItem.jsx
import React from 'react';

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
        active 
          ? 'bg-blue-50 text-blue-600 font-semibold' 
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default NavItem;
