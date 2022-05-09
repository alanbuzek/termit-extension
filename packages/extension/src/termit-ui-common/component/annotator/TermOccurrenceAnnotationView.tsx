import * as React from 'react';
import { useI18n } from '../hook/useI18n';
import { AnnotationTypeClass } from '../../../content/Annotation';
import TermLink from '../term/TermLink';

interface TermOccurrenceAnnotationViewProps {
  term?: any;
  resource?: string;
  annotationClass: string;
}

const TermOccurrenceAnnotationView: React.FC<TermOccurrenceAnnotationViewProps> =
  (props) => {
    const { i18n, formatMessage } = useI18n();
    switch (props.annotationClass) {
      case AnnotationTypeClass.ASSIGNED_OCCURRENCE:
        return (
          <table>
            <tbody>
              <tr>
                <td>
                  <TermLink term={props.term!} />
                </td>
              </tr>
            </tbody>
          </table>
        );
      case AnnotationTypeClass.SUGGESTED_OCCURRENCE:
        return (
          <span className="an-warning">
            {i18n('annotation.form.suggested-occurrence.message')}
          </span>
        );
      case AnnotationTypeClass.INVALID:
        return (
          <span className="an-error">
            {formatMessage('annotation.form.invalid-occurrence.message', {
              term: props.term ? props.term.iri : props.resource,
            })}
          </span>
        );
    }
    return <div />;
  };

export default TermOccurrenceAnnotationView;
