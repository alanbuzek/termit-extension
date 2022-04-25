import * as React from "react";
import { injectIntl } from "react-intl";
import withI18n, { HasI18n } from "../hoc/withI18n";
// @ts-ignore
import { IntelligentTreeSelect } from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import Term, { TermData } from "../../model/Term";
import { FormFeedback, FormGroup, Label } from "reactstrap";
import VocabularyUtils from "../../util/VocabularyUtils";
import { getLocalized } from "../../model/MultilingualString";
import { getShortLocale } from "../../util/IntlUtil";
import IntlData from "../../model/IntlData";
import _ from "lodash";
import HelpIcon from "../misc/HelpIcon";
import api from "../../../api";

interface TermTypesEditProps extends HasI18n {
  termTypes: string[];
  onChange: (types: string[]) => void;
  validationMessage?: string | JSX.Element;
  availableTypes: { [key: string]: Term };
  intl: IntlData;
  loadTypes: () => void;
}

const getTypesForSelector = _.memoize(
  (availableTypes: { [key: string]: Term }) => {
    if (!availableTypes) {
      return [];
    }
    const typesMap = {};
    // Make a deep copy of the available types since we're going to modify them for the tree select
    Object.keys(availableTypes).forEach(
      (t) => (typesMap[t] = new Term(availableTypes[t]))
    );
    const types = Object.keys(typesMap).map((k) => typesMap[k]);
    
    console.log('typesMap: ', typesMap);
    console.log('availableTypes: ', availableTypes);
    types.forEach((t) => {
      if (t.subTerms) {
        // The tree-select needs parent for proper function
        // @ts-ignore
        t.subTerms.forEach((st) => {
          // TODO
          if (!typesMap[st]){
            console.log('typeMap: ', typesMap, ', st: ', st)
          } else {
            typesMap[st].parent = t.iri;
          }
        });
      }
    });
    return types;
  }
);

// TODO: deal with this crashing component later
export class TermTypesEdit extends React.Component<TermTypesEditProps> {
  state = { availableTypes: null };
  public async componentDidMount() {
    // TODO: move this api load?
    const types = await api.loadTypes();
    this.setState({ availableTypes: types });
  }

  public onChange = (val: Term | null) => {
    this.props.onChange(
      val ? [val.iri, VocabularyUtils.TERM] : [VocabularyUtils.TERM]
    );
  };

  private resolveSelectedTypes(types: Term[]): string | undefined {
    const matching = types.filter(
      (t) =>
        t.iri !== VocabularyUtils.TERM &&
        this.props.termTypes.indexOf(t.iri) !== -1
    );
    return matching.length > 0 ? matching[0].iri : undefined;
  }

  public render() {
    if (!this.state.availableTypes){
      return null;
    }

    const types = getTypesForSelector(this.state.availableTypes);
    const selected = this.resolveSelectedTypes(types);
    const { i18n, intl } = this.props;

  
    console.log('types: ', types, ', this.props.termTypes: ', this.props.termTypes)
    return (
      <FormGroup>
        <Label className="attribute-label">
          {i18n("term.metadata.types")}
          {/* <HelpIcon id={"test-types-edit"} text={i18n("term.types.help")} /> */}
        </Label>
        <IntelligentTreeSelect
          onChange={this.onChange}
          value={selected}
          options={types}
          valueKey="iri"
          getOptionLabel={(option: TermData) =>
            getLocalized(option.label, getShortLocale(intl.locale))
          }
          childrenKey="subTerms"
          showSettings={false}
          maxHeight={150}
          multi={false}
          displayInfoOnHover={true}
          expanded={true}
          renderAsTree={true}
          placeholder=""
        />
        {this.props.validationMessage && (
          <FormFeedback
            className="validation-feedback"
            title={i18n("validation.message.tooltip")}
          >
            {this.props.validationMessage}
          </FormFeedback>
        )}
      </FormGroup>
    );
  }
}

export default injectIntl(withI18n(TermTypesEdit)) as any;
