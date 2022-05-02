import * as React from "react";
import { injectIntl } from "react-intl";
import withI18n, { HasI18n } from "../hoc/withI18n";
// @ts-ignore
import { IntelligentTreeSelect } from "intelligent-tree-select";
import "intelligent-tree-select/lib/styles.css";
import Term, { TermData } from "../../model/Term";
// import { FormFeedback, FormGroup, Label } from "reactstrap";
import VocabularyUtils from "../../util/VocabularyUtils";
import { getLocalized } from "../../model/MultilingualString";
import { getShortLocale } from "../../util/IntlUtil";
import IntlData from "../../model/IntlData";
import _ from "lodash";
import api from "../../../api";

interface TermTypesEditProps extends HasI18n {
  termTypes: string[];
  onChange: (types: string[]) => void;
  validationMessage?: string | JSX.Element;
  intl: IntlData;
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
    console.log("availableTypes: ", availableTypes);
    const types = Object.keys(typesMap).map((k) => typesMap[k]);
    types.forEach((t) => {
      if (t.subTerms) {
        console.log("t.subTerms: ", t.subTerms, ", typesMap: ", typesMap);

        // The tree-select needs parent for proper function
        // @ts-ignore
        t.subTerms.forEach((st) => {
          typesMap[st] && (typesMap[st].parent = t.iri);
        });
      }
    });
    return types;
  }
);

export class TermTypesEdit extends React.Component<TermTypesEditProps> {
  state = { availableTypes: null };

  public async componentDidMount() {
    const availableTypes = await api.loadTypes();
    this.setState({ availableTypes });
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
    const { availableTypes } = this.state;
    if (!availableTypes) {
      return null;
    }

    const types = getTypesForSelector(availableTypes);
    const selected = this.resolveSelectedTypes(types);
    const { intl } = this.props;
    return (
      <div>
        {/*  <FormGroup> */}
        {/* <Label className="attribute-label">
          {i18n("term.metadata.types")}
          <HelpIcon id={"test-types-edit"} text={i18n("term.types.help")} />
        </Label> */}

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
        {/* {this.props.validationMessage && (
          <FormFeedback
            className="validation-feedback"
            title={i18n("validation.message.tooltip")}
          >
            {this.props.validationMessage}
          </FormFeedback>
        )} */}
        {/* </FormGroup> */}
      </div>
    );
  }
}

export default injectIntl(withI18n(TermTypesEdit)) as any;
