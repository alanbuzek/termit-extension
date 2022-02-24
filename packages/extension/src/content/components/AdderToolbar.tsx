import classnames from 'classnames';
import React from 'react';
import CreateTermFromAnnotation from './CreateTermFromAnnotation';

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
  onCommand,
  annotationCount = 0,
}) {
  // Since the selection toolbar is only shown when there is a selection
  // of static text, we can use a plain key without any modifier as
  // the shortcut. This avoids conflicts with browser/OS shortcuts.
  const annotateShortcut = isVisible ? 'a' : null;
  const highlightShortcut = isVisible ? 'h' : null;
  const showShortcut = isVisible ? 's' : null;
  const hideShortcut = isVisible ? 'Escape' : null;

  // Add a shortcut to close the adder. Note, there is no button associated with this
  // shortcut because any outside click will also hide the adder.
  // useShortcut(hideShortcut, () => onCommand('hide'));

  // nb. The adder is hidden using the `visibility` property rather than `display`
  // so that we can compute its size in order to position it before display.
  return (
    <div
      className={classnames(
        'hyp-u-border hyp-u-bg-color--white',
        'AdderToolbar',
        {
          'AdderToolbar--down': arrowDirection === 'up',
          'AdderToolbar--up': arrowDirection === 'down',
          'is-active': isVisible,
        }
      )}
      // style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <div className="hyp-u-layout-row AdderToolbar__actions p-4">
        <CreateTermFromAnnotation />
      </div>
    </div>
  );
}
