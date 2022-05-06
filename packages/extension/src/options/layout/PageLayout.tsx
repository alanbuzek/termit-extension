import React from 'react';
import { ReactNode } from 'react';

interface PageLayoutProps {
  heading: string;
  children: ReactNode;
}

const PageLayout = ({ children, heading, ...props }: PageLayoutProps) => (
  <div>
    <h3 className="mb-12">{heading}</h3>
    {children}
  </div>
);

export default PageLayout;
