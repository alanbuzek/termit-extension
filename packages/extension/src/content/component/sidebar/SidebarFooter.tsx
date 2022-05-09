import React from 'react';
import { FaCog, FaHighlighter, FaListAlt } from 'react-icons/fa';

const SidebarFooter = ({ activeSection, setActiveSection, isAnonymous }) => {
  const sections = [
    {
      icon: <FaHighlighter className="text-lg" />,
      label: 'Current',
    },
    {
      icon: <FaListAlt className="text-lg" />,
      label: 'All Pages',
    },
    {
      icon: <FaCog className="text-lg" />,
      label: 'Settings',
    },
  ];
  return (
    <div
      className={`flex border-t border-gray-300 w-full ${
        activeSection === 0 ? 'mt-auto' : 'position-absolute right-0 bottom-0'
      }`}
      style={{ zIndex: 2000 }}
    >
      {sections.map((section, idx) => {
        const isDisabled = isAnonymous && idx === 1;
        const isActive = idx === activeSection;
        return (
          <div
            key={section.label}
            onClick={() => {
              if (isDisabled) {
                return;
              }
              setActiveSection(idx);
            }}
            style={{
              flex: '1 1 0',
              width: '0',
            }}
            className={`py-2 flex flex-col items-center bg-gray-100 transition-all duration-300 ${
              isActive ? 'text-green-600' : ''
            } ${
              isDisabled
                ? 'cursor-not-allowed text-gray-300 font-normal'
                : 'cursor-pointer hover:!bg-gray-200 font-semibold'
            } ${!isActive && !isDisabled ? 'text-gray-400' : ''} `}
          >
            <div className="text-sm">{section.icon}</div>
            <div className="mt-2 text-sm ">{section.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarFooter;
