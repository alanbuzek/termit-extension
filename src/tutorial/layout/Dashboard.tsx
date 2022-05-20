import React from 'react';

const Dashboard = ({ children }: { children: any }) => (
  <>
    <main>
      <div className="max-w-7xl mx-auto py-6 px-0 sm:px-6 md:px-8">
        <div className="px-4 py-2 sm:py-6 sm:px-0">{children}</div>
      </div>
    </main>
  </>
);

export default Dashboard;
