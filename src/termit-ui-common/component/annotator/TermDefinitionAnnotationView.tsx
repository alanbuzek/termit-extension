import * as React from 'react';
import Term from '../../model/Term';
import TermLink from '../term/TermLink';
import { useI18n } from '../hook/useI18n';

interface TermDefinitionAnnotationViewProps {
  term?: Term | null;
  resource?: string;
  textContent: string;
  instance?;
}

const TermDefinitionAnnotationView: React.FC<TermDefinitionAnnotationViewProps> =
  (props) => {
    const { i18n } = useI18n();
    if (props.term) {
      return (
        <table>
          <tbody>
            <tr>
              <td>
                <TermLink term={props.term} instance={props.instance} />
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
    return (
      <table>
        <tbody>
          <tr>
            <td className="label">
              {i18n('annotation.definition.definition')}
            </td>
            <td>{props.textContent}</td>
          </tr>
        </tbody>
      </table>
    );
  };

export default TermDefinitionAnnotationView;
