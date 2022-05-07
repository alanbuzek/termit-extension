/* eslint-disable jsx-a11y/label-has-associated-control */
/* global chrome */

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { IntlProvider } from "react-intl";
import cs from '../common/i18n/cs';
import en from '../common/i18n/en';
import Constants from "../common/util/Constants";
import BrowserApi from "../shared/BrowserApi";
import Dashboard from "./layout/Dashboard";
import Navbar from "./layout/Navbar";
import TutorialPage from "./TutorialPage";

const AppOptions = () => {
  const [locale, setLocale] = useState();
  useEffect(() => {
    BrowserApi.storage.get(Constants.STORAGE.LOCALE).then((locale) => {
      setLocale(locale || Constants.DEFAULT_LANGUAGE);
    });
  }, []);

  if (!locale) {
    return null;
  }

  return (
    <IntlProvider
      locale={locale}
      defaultLocale="en"
      messages={locale === "en" ? en.messages : cs.messages}
    >
      <div className="bg-gray-50 h-full">
        <Navbar />
        <Dashboard>
          <TutorialPage />
        </Dashboard>
      </div>
    </IntlProvider>
  );
};
export default AppOptions;
