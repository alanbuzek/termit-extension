import * as React from 'react';
import { Badge } from 'reactstrap';
import Term from '../../model/Term';
import Utils from '../../util/Utils';
import ValidationResult from '../../model/ValidationResult';
import { ConsolidatedResults } from '../../model/ConsolidatedResults';
import Validation from '../../util/Validation';
import { HasI18n } from '../hoc/withI18n';

interface TermQualityBadgeProps extends HasI18n {
  term: Term | null;
  validationResults?: ConsolidatedResults;
}

export class TermQualityBadge extends React.Component<TermQualityBadgeProps> {
  private computeScore(results: ValidationResult[]): number | undefined {
    return results.reduce((reduceScore, result) => {
      if (
        Validation.QUALITY_AFFECTING_RULES.indexOf(result.sourceShape?.iri) >= 0
      ) {
        return (
          reduceScore -
          Math.floor(100 / Validation.QUALITY_AFFECTING_RULES.length)
        );
      }
      return reduceScore;
    }, 100);
  }

  public setBadgeColor(score: number | undefined): string {
    switch (score) {
      case 100:
        return 'dark-green';
      case 75:
      case 50:
        return 'dark-yellow';
      case 25:
      case 0:
        return 'dark-red';
      default:
        return 'gray';
    }
  }

  public render() {
    let score: number | undefined;
    if (this.props.validationResults) {
      const res = this.props.validationResults[this.props.term!.iri] || [];
      score = res ? this.computeScore(res) : undefined;
    }
    return score === undefined ? (
      <></>
    ) : (
      <Badge
        color={this.setBadgeColor(score)}
        className="term-quality-badge"
        title={
          score !== undefined
            ? this.props.formatMessage('term.badge.score.tooltip', { score })
            : this.props.i18n('term.badge.no-score.tooltip')
        }
        onClick={this.onBadgeClick}
      >
        &nbsp;
      </Badge>
    );
  }
}

export default TermQualityBadge;
