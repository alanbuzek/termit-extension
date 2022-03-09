import classnames from "classnames";
// import { LabeledButton, Icon } from '@hypothesis/frontend-shared';
import React from "react";
// import { useShortcut } from '../../shared/shortcut';
import { AnnotationIcon, PencilIcon } from "./Toolbar";

/**
 * @param {object} props
 *  @param {number} [props.badgeCount]
 *  @param {string} [props.icon]
 *  @param {string} props.label
 *  @param {() => any} props.onClick
 *  @param {string|null} props.shortcut
 */
// function ToolbarButton({ badgeCount, icon, label, onClick, shortcut }) {
//   // useShortcut(shortcut, onClick);

//   const title = shortcut ? `${label} (${shortcut})` : label;

//   return (
//     <LabeledButton
//       classes="LabeledIconButton AdderToolbar__button"
//       icon={icon}
//       onClick={onClick}
//       title={title}
//     >
//       {typeof badgeCount === 'number' && (
//         <span className="hyp-u-bg-color--grey-7 AdderToolbar__badge">
//           {badgeCount}
//         </span>
//       )}
//       <span className="LabeledIconButton__label">{label}</span>
//     </LabeledButton>
//   );
// }

/**
 * @param {object} props
 *  @param {import("preact").Ref<HTMLButtonElement>} [props.buttonRef]
 *  @param {boolean} [props.expanded]
 *  @param {string} [props.className]
 *  @param {string} props.label
 *  @param {string} props.icon
 *  @param {() => any} props.onClick
 *  @param {boolean} [props.selected]
 */
function ToolbarButton({
  buttonRef,
  expanded,
  className = "Toolbar__button",
  label,
  icon,
  onClick,
  selected = false,
  children,
}) {
  return (
    <button
      className={className}
      aria-label={label}
      aria-expanded={expanded}
      aria-pressed={selected}
      onClick={onClick}
      ref={buttonRef}
      title={label}
    >
      {children}
    </button>
  );
}

/**
 * Union of possible toolbar commands.
 *
 * @typedef {'annotate'|'highlight'|'show'|'hide'} Command
 */

/**
 * @typedef AdderToolbarProps
 * @prop {'up'|'down'} arrowDirection -
 *   Whether the arrow pointing out of the toolbar towards the selected text
 *   should appear above the toolbar pointing Up or below the toolbar pointing
 *   Down.
 * @prop {boolean} isVisible - Whether to show the toolbar or not.
 * @prop {(c: Command) => any} onCommand - Called when a toolbar button is clicked.
 * @prop {number} [annotationCount] -
 *   Number of annotations associated with the selected text.
 *   If non-zero, a "Show" button is displayed to allow the user to see the
 *   annotations that correspond to the selection.
 */

/**
 * The toolbar that is displayed above selected text in the document providing
 * options to create annotations or highlights.
 *
 * @param {AdderToolbarProps} props
 */
export default function AdderToolbar({
  arrowDirection,
  isVisible,
  onMarkOccurrence,
  onMarkDefinition
}) {
  return (
    <div className="flex text-sm">
      <div className="flex items-center flex-col justify-center mr-3 hover:bg-gray-100 cursor-pointer"  onClick={onMarkOccurrence}>
        <AnnotationIcon className="h-4 w-4 mb-1" />
        Occurrence
      </div>
      <div className="flex items-center justify-center flex-col hover:bg-gray-100 cursor-pointer" onClick={onMarkDefinition}>
        <PencilIcon className="h-4 w-4 mb-1"  />
        Definition
      </div>
    </div>
  );
}
