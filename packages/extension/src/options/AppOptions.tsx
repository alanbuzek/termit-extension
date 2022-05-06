/* eslint-disable jsx-a11y/label-has-associated-control */
/* global chrome */

import React from "react";
import Dashboard from "./layout/Dashboard";
import Navbar from "./layout/Navbar";
import TutorialPage from "./TutorialPage";

const AppOptions = () => (
  <div className="bg-gray-50 h-full">
    <Navbar simpleLayout />
    <Dashboard>
      <TutorialPage />
    </Dashboard>
  </div>
);
export default AppOptions;
