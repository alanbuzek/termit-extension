/* eslint-disable react/jsx-no-bind */
import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import AnnotationPopup, {
  PopupType,
} from '../component/annotation-popup/AnnotationPopup';
import Annotation from '../Annotation';
import { ContentState } from '../AnnotatorController';
import en from '../../termit-ui-common/i18n/en';
import cs from '../../termit-ui-common/i18n/cs';
import StyleSheetLoader from '../util/StyleSheetLoader';
import PageOverlay from '../util/PageOverlay';

/**
 * Stop bubbling up of several events.
 *
 * This makes the host page a little bit less aware of the annotator activity.
 * It is still possible for the host page to manipulate the events on the capturing
 * face.
 *
 * Another benefit is that click and touchstart typically causes the sidebar to close.
 * By preventing the bubble up of these events, we don't have to individually stop
 * the propagation.
 *
 * @param {HTMLElement|ShadowRoot} element
 */
function stopEventPropagation(element) {
  element.addEventListener('mouseup', (event) => event.stopPropagation());
  element.addEventListener('mousedown', (event) => event.stopPropagation());
  element.addEventListener('touchstart', (event) => event.stopPropagation(), {
    passive: true,
  });
}

/**
 * Create the shadow root for an annotator UI component and load the annotator
 * CSS styles into it.
 *
 * @param {HTMLElement} container - Container element to render the UI into
 * @return {ShadowRoot}
 */
export function createShadowRoot(container: HTMLElement) {
  const shadowRoot = container.attachShadow({ mode: 'open' });

  // @ts-ignore The window doesn't know about the polyfill
  // applyFocusVisiblePolyfill comes from the focus-visible package.
  const applyFocusVisible = window.applyFocusVisiblePolyfill;
  if (applyFocusVisible) {
    applyFocusVisible(shadowRoot);
  }

  stopEventPropagation(shadowRoot);
  return shadowRoot;
}

function toPx(pixels) {
  return `${pixels.toString()}px`;
}

const ARROW_HEIGHT = 10;

function nearestPositionedAncestor(el) {
  let parentEl = /** @type {Element} */ el.parentElement;
  while (parentEl.parentElement) {
    if (getComputedStyle(parentEl).position !== 'static') {
      break;
    }
    parentEl = parentEl.parentElement;
  }
  return parentEl;
}

export class AnnotationPopupContainer {
  private outerContainer: HTMLElement;

  private shadowRoot: ShadowRoot;

  private view: any;

  private isVisible: boolean;

  private currentAnnotation: Annotation | null = null;

  private contentState: ContentState;

  private onSelectDefinition: () => any;

  private stylesHaveBeenLoaded = false;

  private selectionRect;

  private isRTLselection;

  private selectionRange;

  constructor(
    element: HTMLElement,
    contentState: ContentState,
    onSelectDefinition
  ) {
    this.contentState = contentState;
    this.outerContainer = document.createElement('hypothesis-adder');
    this.onSelectDefinition = onSelectDefinition;
    element.appendChild(this.outerContainer);
    console.log('this.outerContainer: ', this.outerContainer);
    this.shadowRoot = createShadowRoot(this.outerContainer);
    console.log('this.shadowRoot1: ', this.shadowRoot);

    // Set initial style
    Object.assign(this.outerContainer.style, {
      position: 'absolute',
      top: 0,
      left: 0,
      'z-index': 1000,
    });

    this.view = element.ownerDocument.defaultView;

    this.isVisible = false;
  }

  public hide() {
    this.isVisible = false;
    this.render();
    Object.assign(this.outerContainer.style, {
      top: 0,
      left: 0,
    });
  }

  public unmount() {
    ReactDOM.render(<div />, this.shadowRoot);
  }

  public destroy() {
    this.outerContainer.remove();
  }

  public show(
    selectionRect,
    isRTLselection,
    selectionRange,
    annotation: Annotation | null = null
  ) {
    this.currentAnnotation = annotation;
    const { left, top } = this.calculateTarget(selectionRect, !annotation);
    this.showAt(left, top, false);
    this.isVisible = true;
    this.render(selectionRange);
  }

  public repositionWithAnnotation(annotation: Annotation) {
    this.currentAnnotation = annotation;
    this.show(
      this.selectionRect,
      this.isRTLselection,
      this.selectionRange,
      annotation
    );
  }

  private calculateTarget(selectionRect, isSelectionPurposeDialog) {
    let top;
    let left;

    const adderWidth = isSelectionPurposeDialog ? 148 : 298;
    const adderHeight = isSelectionPurposeDialog ? 56 : 125.8;
    // Render the adder a little lower on touch devices to provide room for the native
    // selection handles so that the interactions with selection don't compete with the adder.

    if (selectionRect.width > adderWidth) {
      left = selectionRect.left + selectionRect.width / 2 - adderWidth / 2;
    } else {
      left = selectionRect.left - (adderWidth - selectionRect.width) / 2;
    }

    top = selectionRect.top + selectionRect.height + ARROW_HEIGHT;

    const sidebarClosed = document
      .querySelector('termit-sidebar-container')
      ?.classList.contains('annotator-collapsed');
    const sidebarWidth = sidebarClosed ? 0 : 350;
    // Constrain the adder to the viewport.
    left = Math.max(left, 0);
    left = Math.min(
      left,
      this.view.innerWidth - adderWidth - sidebarWidth + 200
    );

    top = Math.max(top, 0);
    top = Math.min(top, this.view.innerHeight - adderHeight);

    return { top, left };
  }

  private showAt(left, top, isModal = false) {
    const positionedAncestor = nearestPositionedAncestor(this.outerContainer);
    const parentRect = positionedAncestor.getBoundingClientRect();

    if (isModal) {
      PageOverlay.on();
      Object.assign(this.outerContainer.style, {
        // modal props
        left: '50%',
        top: '50%',
        position: 'fixed',
        transform: 'translate(-350px, -250px)',
        zIndex: 2000,
      });
    } else {
      Object.assign(this.outerContainer.style, {
        left: toPx(left - parentRect.left),
        top: toPx(top - parentRect.top),
        position: 'absolute',
        transform: 'none',
        zIndex: 2000,
      });
    }
  }

  public isOpen() {
    return this.isVisible;
  }

  private render(selectionRange?) {
    let initialPopupType = PopupType.PurposeSelection;
    if (this.currentAnnotation) {
      if (this.currentAnnotation.isDefinition()) {
        initialPopupType = PopupType.TermDefinition;
      } else {
        initialPopupType = PopupType.TermOccurrence;
      }
    }

    this.unmount();

    ReactDOM.render(
      <IntlProvider
        locale={this.contentState.locale}
        defaultLocale="en"
        messages={this.contentState.locale === 'en' ? en.messages : cs.messages}
      >
        <AnnotationPopup
          isVisible={this.isVisible}
          showAt={this.showAt.bind(this)}
          hide={this.hide.bind(this)}
          selectionRange={selectionRange}
          annotation={this.currentAnnotation}
          initialPopupType={initialPopupType}
          contentState={this.contentState}
          onSelectDefinition={this.onSelectDefinition}
          repositionWithAnnotation={this.repositionWithAnnotation.bind(this)}
        />
      </IntlProvider>,
      this.shadowRoot,
      () => {
        if (!this.stylesHaveBeenLoaded) {
          this.stylesHaveBeenLoaded = true;
          StyleSheetLoader.loadContentStylesSheets(this.shadowRoot as any);
        }
      }
    );
  }

  public getShadowRoot() {
    return this.shadowRoot;
  }
}
