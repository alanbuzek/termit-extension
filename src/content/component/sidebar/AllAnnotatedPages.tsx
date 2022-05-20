import React from 'react';
import { useI18n } from '../../../termit-ui-common/component/hook/useI18n';
import Vocabulary from '../../../termit-ui-common/model/Vocabulary';

export default function AllAnnotatedPagesSection({
  vocabularies,
}: {
  vocabularies: Vocabulary[];
}) {
  const websites = vocabularies.flatMap(
    (vocab) => vocab.document?.websites || []
  );
  const { i18n } = useI18n();

  return (
    <div>
      <div className="flex text-lg px-2.5 py-2 mt-2.5 font-semibold text-gray-700">
        {i18n('extension.allpages')}
      </div>
      {websites.map((website) => (
        <a
          className="mb-0 text-sm font-semibold break-all"
          href={website.url}
          target="_blank"
          rel="noreferrer"
          key={website.url}
        >
          <div className="py-1 px-2.5">
            <div className="rounded-md p-2.5 border border-gray-400 mb-0.5 cursor-pointer transition-all duration-300 relative bg-white term-occurrence-card">
              <div className="flex justify-between items-end">
                {website.url}
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
