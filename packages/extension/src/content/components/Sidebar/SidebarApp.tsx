import React from "react";
import { ContentState } from "../..";
import Vocabulary from "../../../common/model/Vocabulary";
import Button from "../Button";
import SidebarControlPanel from "./SidebarControlPanel";
import TermOccurrencesFeed from "./TermOccurrencesFeed";

const SidebarApp = ({
  state,
  handleAnnotatePage,
  handleDeletePage,
}: {
  state: ContentState;
  handleAnnotatePage: (vocabulary: Vocabulary) => void;
  handleDeletePage: () => void;
}) => {
  return (
    <div style={{ height: "100%" }}>
      <div
        className="h-full w-full p-3 overflow-x-auto flex flex-column"
        style={{ background: "#dddddd" }}
      >
        <div className="flex px-2 pb-2 justify-between items-center mb-3">
          <a
            href={`http://localhost:3000/#/`}
            target="_blank"
            className="ml-sm-3 ml-md-0 brand ml-2 p-0 navbar-brand"
          >
            TermIt
          </a>
          {state.user && (
            <a
              className="flex ml-auto items-center text-gray-800"
              href={`http://localhost:3000/#/profile`}
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>{" "}
              <span className="ml-2 text-base">
                {state.user.abbreviatedName}
              </span>
            </a>
          )}
        </div>
        {!state.user && (
          <div className="mt-2 p-3 mb-4 rounded-md bg-gray-100 border-gray-600 border flex flex-col items-center">
            {/* {allowPanel} */}
            <p className="font-semibold">
              You need to login start using TermIt.
            </p>
            <a
              href={`http://localhost:3000/#/login`}
              target="_blank"
              className="mx-auto block my-2"
            >
              <Button>Login</Button>
            </a>
            <p>After you do so, refresh this page to start annotating.</p>
            <p>
              Don't have an account?{" "}
              <a href={`http://localhost:3000/#/register`}>Register here</a>.
            </p>
          </div>
        )}

        {state.vocabularies.length && (
          <>
            <SidebarControlPanel
              annotations={state.annotations}
              handleAnnotatePage={handleAnnotatePage}
              vocabulary={state.vocabulary}
              vocabularies={state.vocabularies}
              handlePageDelete={handleDeletePage}
            />
            <hr className="my-4 bg-gray-400"></hr>
            {state.annotations && (
              <TermOccurrencesFeed annotations={state.annotations} />
            )}
            {state.annotations && <hr className="my-2"></hr>}
          </>
        )}
        <footer
          className="footer-row mt-auto"
          style={{ background: "transparent" }}
        >
          <div className="px-sm-3 px-2 col">
            <a
              href="https://kbss.felk.cvut.cz"
              target="_blank"
              rel="noopener noreferrer"
              title="KBSS FEL ČVUT v Praze"
            >
              ©&nbsp;KBSS FEL ČVUT v Praze, 2022
            </a>
          </div>
          <div className="news-viewer-toggle px-sm-2 px-sm-3 px-1 text-right">
            <span id="news-toggler">
              <span className="footer-version">Verze&nbsp;</span>0.0.1
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SidebarApp;
