import * as React from "react";
import { useI18n } from '../hook/useI18n';
import { AnnotationClass } from '../../util/Annotation';

interface TermOccurrenceAnnotationViewProps {
  term?: any;
  score?: string;
  resource?: string;
  annotationClass: string;
}

const TermOccurrenceAnnotationView: React.FC<TermOccurrenceAnnotationViewProps> =
  (props) => {
    const { i18n, formatMessage } = useI18n();
    switch (props.annotationClass) {
      case AnnotationClass.ASSIGNED_OCCURRENCE:
        return (
          <table>
            <tbody>
              <tr>
                <td className={"label"}>
                  {i18n("annotation.term.assigned-occurrence.termLabel")}
                </td>
                <td>
                  {/* <TermLink term={props.term!} /> */}
                </td>
              </tr>
            </tbody>
          </table>
        );
      case AnnotationClass.SUGGESTED_OCCURRENCE:
        return (
          <span className="an-warning">
            {i18n("annotation.form.suggested-occurrence.message")}
          </span>
        );
      case AnnotationClass.INVALID:
        return (
          <span className="an-error">
            {formatMessage("annotation.form.invalid-occurrence.message", {
              term: props.term ? props.term.iri : props.resource,
            })}
          </span>
        );
    }
    return <div />;
  };

export default TermOccurrenceAnnotationView;
