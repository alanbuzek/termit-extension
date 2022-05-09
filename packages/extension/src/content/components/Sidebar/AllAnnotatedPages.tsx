import React from "react";
import Vocabulary from "../../../common/model/Vocabulary";
import Website from "../../../common/model/Website";
import { openNewTabLink } from "../LoginPromptPopup";

export default function AllAnnotatedPagesSection({
  vocabularies,
}: {
  vocabularies: Vocabulary[];
}) {
  const websites = vocabularies.flatMap((vocab) => {
    return vocab.document?.websites || [];
  });

  return (
    <div>
      <div className="flex text-lg px-2.5 py-2 mt-2.5 font-semibold text-gray-700">
        All annotated pages:
      </div>
      {websites.map((website) => {
        return (
          <a
            className="mb-0 text-sm font-semibold break-all"
            href={website.url}
            target="_blank"
          >
            <div className="py-1 px-2.5">
              <div className="rounded-md p-2.5 border border-gray-400 mb-0.5 cursor-pointer transition-all duration-300 relative bg-white term-occurrence-card">
                <div className="flex justify-between items-end">
                  {website.url}
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
