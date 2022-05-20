import React from 'react';

const Navbar = () => (
  <nav className="bg-white border-b border-gray-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div className="relative flex items-center justify-between h-16">
        <div className="flex-1 flex items-stretch justify-start">
          <div className="flex justify-between items-center mt-2 px-3.5 pb-3">
            <div className="ml-sm-3 ml-md-0 ml-2 p-0 text-2xl font-semibold text-green-600">
              TermIt Annotate
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
