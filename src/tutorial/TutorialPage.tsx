import React, { useState, useEffect } from 'react';
import { useI18n } from '../termit-ui-common/component/hook/useI18n';
import Button from '../content/component/shared/Button';
import Spinner from '../content/component/shared/Spinner';
import useDebounce from '../content/component/hook/useDebounce';

const getStages = ({ i18n }) => [
  {
    heading: (
      <span>
        {i18n('extension.onboarding.welcome.header')}{' '}
        <span className="text-green-500 font-bold">TermIt Annotate!</span>
      </span>
    ),
    description: <span>{i18n('extension.onboarding.welcome.text1')}</span>,
    image: chrome.runtime.getURL('/static/img/onboarding/welcome-termit.png'),
    buttonText: <span>{i18n('extension.onboarding.welcome.button')}</span>,
  },
  {
    heading: <span>{i18n('extension.onboarding.step1.header')}</span>,
    description: (
      <span>
        {i18n('extension.onboarding.step1.text1')}
        <br />
        {i18n('extension.onboarding.step1.text2')}
      </span>
    ),
    image: chrome.runtime.getURL('/static/img/onboarding/start-annotating.gif'),
    buttonText: <span>{i18n('extension.onboarding.next')} &#8594;</span>,
  },
  {
    heading: (
      <span className="text-3xl">
        {i18n('extension.onboarding.step2.header')}
      </span>
    ),
    description: (
      <span>
        {i18n('extension.onboarding.step2.text1')}

        <br />
        {i18n('extension.onboarding.step2.text2')}

        <br />
        {i18n('extension.onboarding.step2.text3')}
      </span>
    ),
    image: chrome.runtime.getURL('/static/img/onboarding/annotation-1.png'),
    reversed: true,
    buttonText: <span>{i18n('extension.onboarding.next')} &#8594;</span>,
  },
  {
    heading: (
      <span className="text-3xl">
        {' '}
        {i18n('extension.onboarding.step4.header')}
      </span>
    ),
    description: <div>{i18n('extension.onboarding.step4.text1')}</div>,
    image: chrome.runtime.getURL('/static/img/onboarding/sidebar.png'),
    reversed: false,
    buttonText: <span>{i18n('extension.onboarding.next')} &#8594;</span>,
  },
  {
    heading: (
      <span className="text-3xl">
        {i18n('extension.onboarding.step3.header')}
      </span>
    ),
    description: <span>{i18n('extension.onboarding.step3.text1')}</span>,
    image: chrome.runtime.getURL('/static/img/onboarding/annotation-2.png'),
    reversed: false,
    buttonText: <span>{i18n('extension.onboarding.next')} &#8594;</span>,
  },
  {
    heading: (
      <span className="text-3xl">
        {i18n('extension.onboarding.step5.header')}
      </span>
    ),
    description: <div>{i18n('extension.onboarding.step5.text1')}</div>,
    image: chrome.runtime.getURL('/static/img/onboarding/termit.png'),
    reversed: false,
    buttonText: <span>{i18n('extension.onboarding.next')} &#8594;</span>,
  },
  {
    heading: (
      <span className="text-3xl">
        {i18n('extension.onboarding.step6.header')}
      </span>
    ),
    description: <div>{i18n('extension.onboarding.step6.text1')}</div>,
  },
];

const TutorialPage = () => {
  const [step, setStep] = useState(-1);
  const loading = useDebounce(step, 700);
  const { i18n } = useI18n();

  const stages = getStages({ i18n });

  useEffect(() => {
    setStep(0);
  }, []);

  if (step === -1) {
    return null;
  }

  return (
    <div className="lg:mx-20">
      <h3 className="ml-10 mb-5 text-2xl text-gray-500 font-medium mt-0">
        {i18n('extension.onboarding.header')}
      </h3>
      <div className="rounded-lg shadow-lg bg-gray-200 px-7 lg:px-14 py-5 lg:py-10 relative">
        <div className="flex flex-col lg:flex-row">
          <>
            {stages[step].image && (
              <img
                src={`${stages[step].image}`}
                alt="full app"
                width="400"
                className={`rounded-lg shadow-lg card my-4 ${
                  stages[step].reversed
                    ? 'order-2 lg:ml-10 lg:mr-2'
                    : 'order-1 lg:mr-14 lg:ml-2'
                }`}
              />
            )}
            <div
              className={`flex flex-col justify-center items-start ${
                stages[step].reversed ? 'order-1' : 'order-2'
              }`}
            >
              <h3
                className="mt-2 lg:mt-4 text-gray-900 font-semibold leading-relaxed"
                style={{ fontSize: '1.7rem' }}
              >
                {stages[step].heading}
              </h3>
              <p className="text-gray-700 mt-3 text-base lg:text-lg leading-relaxed">
                {stages[step].description}
              </p>
              {step < stages.length - 1 ? (
                <div className="flex justify-start items-end mt-4 lg:mt-8">
                  <Button
                    color="secondary"
                    size="big"
                    className="mr-4"
                    onClick={() => {
                      setStep(step + 1);
                    }}
                  >
                    {stages[step].buttonText}
                  </Button>
                </div>
              ) : null}
            </div>
          </>
          {loading !== step ? (
            <div className="flex justify-center items-center w-full absolute h-full bg-gray-200 left-0 top-0">
              <Spinner size="8" />
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-center mt-10 relative">
        {stages.map((stage, stageIdx) => (
          <div
            key={stage.image}
            className={`cursor-pointer rounded-full mr-6 lg:mr-16 w-6 h-6 flex items-center justify-center text-white text-sm ${
              step >= stageIdx ? 'bg-green-300' : 'bg-gray-300'
            }`}
            onClick={() => {
              setStep(stageIdx);
            }}
          >
            {stageIdx + 1}
          </div>
        ))}
        {step !== stages.length - 1 ? (
          <div
            className="hover:underline text-base cursor-pointer text-gray-500 absolute right-2 lg:right-10 top-1"
            onClick={() => {
              setStep(stages.length - 1);
            }}
          >
            {i18n('extension.onboarding.skip')}
          </div>
        ) : (
          <div
            className="hover:underline text-base cursor-pointer text-gray-500 absolute right-2 lg:right-10 top-1"
            onClick={() => {
              setStep(0);
            }}
          >
            {i18n('extension.onboarding.gotostart')}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialPage;
