import React, { useState, useEffect } from "react";
import Button from "../content/components/Button";
import Spinner from "../content/components/Spinner";
import useDebounce from "../content/helper/useDebounce";

const stages = [
  {
    heading: <span>Start page annotation through the sidebar!</span>,
    description: (
      <span>
        On any page you like, just open the extension sidebar to the right, pick
        a vocabulary to use and begin your annotation journey with TermIt
        Annotate!
      </span>
    ),
    image: chrome.runtime.getURL("/static/img/onboarding/annotation-start.png"),
    buttonText: <span>Next &#8594;</span>,
  },
  {
    heading: (
      <span className="text-3xl">
        Confirm suggested occurrences and create your own!
      </span>
    ),
    description: (
      <span>
        After first triggering page annotation, you'll have suggested term
        occurrences appear on the page, based on the vocabulary you've chosen.
        <br></br>
        Confirm, remove or reassign annotation suggestions as well as highlight
        any text to create your want annotations.
      </span>
    ),
    image: chrome.runtime.getURL("/static/img/onboarding/annotation-1.png"),
    reversed: true,
    buttonText: <span>Next &#8594;</span>,
  },
  {
    heading: <span className="text-3xl">See your annotations over time.</span>,
    description: (
      <span>
        Anytime you come back to a page you've previously annotated, you're
        annotations we'll appear again and you'll be able to continue right
        where you left off!
      </span>
    ),
    image: chrome.runtime.getURL("/static/img/onboarding/annotation-2.png"),
    reversed: false,
    buttonText: "I pinned the icon ✓",
    skipButtonText: `I'll do it later`,
  },
  {
    heading: (
      <span className="text-3xl">Use sidebar to keep things in grip.</span>
    ),
    description: (
      <div>
        Through the extension's sidebar, you'll be able to search and manage
        through existing page annotations, delete suggestions or all annotations
        or disable the extensions if you wish.
      </div>
    ),
    image: chrome.runtime.getURL("/static/img/onboarding/sidebar.png"),
    reversed: false,
    buttonText: `Finish Tutorial`,
  },
  {
    heading: (
      <span className="text-3xl">
        Take full advantage of <br />
        TermIt's semantic vocabulary platform
      </span>
    ),
    description: (
      <div>
        TermIt is powered by Semantic Web technologies, providing a
        robust tool for your vocabulary management needs. You can click through
        into the web application from the extension any time, visiting terms,
        definitions or vocabularies and manage everything in further detail.
      </div>
    ),
    image: chrome.runtime.getURL("/static/img/onboarding/termit.png"),
    reversed: false,
    buttonText: `Finish Tutorial`,
  },
];

const TutorialPage = () => {
  const [step, setStep] = useState(-1);
  const loading = useDebounce(step, 700);

  const finishTutorial = () => {};

  useEffect(() => {
    setStep(0);
  }, []);

  if (step === -1) {
    return null;
  }

  return (
    <div className="lg:mx-20">
      <h3 className="ml-10 mb-5 text-3xl text-green-500 font-medium mt-0">
        Quick Tutorial
      </h3>
      <div className="rounded-lg shadow-lg bg-gray-200 px-7 lg:px-14 py-5 lg:py-10 relative">
        <div className="flex flex-col lg:flex-row">
          <>
            <img
              src={`${stages[step].image}`}
              alt="full app"
              width="400"
              className={`rounded-lg shadow-lg card my-4 ${
                stages[step].reversed
                  ? "order-2 lg:ml-10 lg:mr-2"
                  : "order-1 lg:mr-14 lg:ml-2"
              }`}
            />
            <div
              className={`flex flex-col justify-center items-start ${
                stages[step].reversed ? "order-1" : "order-2"
              }`}
            >
              <h3
                className="mt-2 lg:mt-4 text-gray-900 font-semibold leading-relaxed"
                style={{ fontSize: "1.7rem" }}
              >
                {stages[step].heading}
              </h3>
              <p className="text-gray-700 mt-3 text-base lg:text-lg leading-relaxed">
                {stages[step].description}
              </p>
              <div className="flex justify-start items-end mt-4 lg:mt-8">
                <Button
                  color="secondary"
                  size="big"
                  className="mr-4"
                  onClick={() => {
                    if (step === stages.length - 1) {
                      finishTutorial();
                      return;
                    }

                    setStep(step + 1);
                  }}
                  //   disabled={debouncedStep !== step}
                >
                  {stages[step].buttonText}
                </Button>
                {stages[step].skipButtonText && (
                  <Button
                    color="light"
                    className="text-gray-800 mb-1.5 -ml-2"
                    onClick={() => {
                      setStep(step + 1);
                    }}
                  >
                    {stages[step].skipButtonText}
                  </Button>
                )}
              </div>
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
              step >= stageIdx ? "bg-green-300" : "bg-gray-300"
            }`}
            onClick={() => {
              setStep(stageIdx);
            }}
          >
            {stageIdx + 1}
          </div>
        ))}
        <div
          className="hover:underline text-base cursor-pointer text-gray-500 absolute right-2 lg:right-10 top-1"
          onClick={() => {
            finishTutorial();
          }}
        >
          Skip tutorial
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;
