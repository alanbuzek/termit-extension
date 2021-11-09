import React from 'react';

const App = () => (
  <AppLayout>
    <div>
      <h3>Welcome to TermIt extension!</h3>
    </div>
  </AppLayout>
);

const AppLayout = ({ children }) => (
  <div className="pb-2 pt-2.5 h-full">{children}</div>
);

export default App;
