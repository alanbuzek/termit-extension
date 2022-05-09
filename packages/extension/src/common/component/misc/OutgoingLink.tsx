import * as React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useI18n } from "../hook/useI18n";

interface OutgoingLinkProps {
  label: string | JSX.Element;
  iri: string;
  showLink?: boolean;
  className?: string;
  id?: string;
}

export const OutgoingLink: React.FC<OutgoingLinkProps> = (
  props: OutgoingLinkProps
) => {
  const { formatMessage } = useI18n();
  return (
    <span className="flex items-start">
      {props.label}
      <a
        id={props.id}
        href={props.iri}
        target="_blank"
        style={{ color: "gray" }}
        className={props.className}
        rel="noopener noreferrer"
        title={formatMessage("link.external.title", { url: props.iri })}
      >
        <span className={`${props.showLink ? "" : "hidden"} text-sm ml-1`}>
          <FaExternalLinkAlt className="text-green-500" />
        </span>
      </a>
    </span>
  );
};

OutgoingLink.defaultProps = {
  showLink: true,
};

export default OutgoingLink;
