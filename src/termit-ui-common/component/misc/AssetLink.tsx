import * as React from 'react';
import { ExternalLinkIcon } from '../../../content/component/sidebar/TermOccurrencesList';
import OutgoingLink from './OutgoingLink';

interface AssetType {
  iri: string;
  label: React.ReactNode | string;
}

interface AssetLinkProps<T extends AssetType> {
  asset: T;
  path: string;
  tooltip?: string;
  id?: string;
}

interface AssetLinkState {
  showLink: boolean;
}

export default class AssetLink<T extends AssetType> extends React.Component<
  AssetLinkProps<T>,
  AssetLinkState
> {
  constructor(props: AssetLinkProps<T>) {
    super(props);
    this.state = { showLink: false };
  }

  private setVisible() {
    this.setState({ showLink: true });
  }

  private setInvisible() {
    this.setState({ showLink: false });
  }

  public render() {
    const { props } = this;
    const setInvisible = this.setInvisible.bind(this);
    const setVisible = this.setVisible.bind(this);

    return (
      <span onMouseOut={setInvisible} onMouseOver={setVisible}>
        <OutgoingLink
          label={
            <a
              id={this.props.id}
              title={this.props.tooltip ? this.props.tooltip : undefined}
              href={props.path}
              target="_blank"
              className="items-center"
              style={{ display: 'inline-flex' }}
              rel="noreferrer"
            >
              {props.asset.label}
            </a>
          }
          iri={props.asset.iri}
          showLink={this.state.showLink}
          className="m-asset-link"
        />
      </span>
    );
  }
}
