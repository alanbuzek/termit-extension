/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useState } from 'react';

import { IntlProvider } from 'react-intl';
import cs from '../termit-ui-common/i18n/cs';
import en from '../termit-ui-common/i18n/en';
import Constants from '../termit-ui-common/util/Constants';
import BrowserApi from '../shared/BrowserApi';
import Dashboard from './layout/Dashboard';
import Navbar from './layout/Navbar';
import TutorialPage from './TutorialPage';

const AppOptions = () => {
  const [locale, setLocale] = useState();
  useEffect(() => {
    BrowserApi.storage.get(Constants.STORAGE.LOCALE).then((storedLocale) => {
      setLocale(storedLocale || Constants.DEFAULT_LANGUAGE);
    });
  }, []);

  if (!locale) {
    return null;
  }

  return (
    <IntlProvider
      locale={locale}
      defaultLocale="en"
      messages={locale === 'en' ? en.messages : cs.messages}
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
