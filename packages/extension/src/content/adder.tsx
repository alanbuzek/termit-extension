import AdderToolbar from './components/AdderToolbar';
import React from 'react';
import ReactDOM from 'react-dom';
/**
 * Returns true when the device is a touch device such
 * as android or iOS.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer#browser_compatibility
 *
 * @param _window {Window} - Test seam
 */
 export const isTouchDevice = (_window = window) => {
  return _window.matchMedia('(pointer: coarse)').matches;
};


const styles = `#masterlingo-popup{
  width: 300px;
  height: auto;
  position: absolute;
  /* top: 750px;
  right: 500px; */
  z-index: 2147483;
  background-color: white;
  /* box-shadow: 0px 0px 2px #5c5c5c8e; */
  border-radius: 5px;
  border:1px solid rgb(229, 231, 235);
}

#masterlingo-popup iframe {
  width: 100%;
  height: 100%;
  border: none;
}

#masterlingo-snackbar iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* TODO: maybe this won't need to be separated into 2 disctinct classes because of previously though mark.js constraints */
termit-h.termit-highlighted-word,
termit-h.termit-highlighted-word--not-due {
  transition: all .3s;
  cursor: pointer !important;
  padding:0;
  margin:0;
  color: #333 !important;
  /* border-radius: 5px;  */
  /* background-color: inherit !important; */
}

termit-h.termit-highlighted-word {
  background-color: rgba(239,207,184,.8) !important;
  border: 0.15em dotted #ef451b;
}


termit-h.termit-highlighted-word--not-due{
  background-color: #f6fcd0 !important;
}

termit-h.termit-highlighted-word:hover {
  background-color: rgb(219, 219, 219) !important;
}

.termit-info-window {
 position: fixed;
 background-color: rgb(163, 245, 156);
 color: rgba(0, 0, 0, 0.938);
 right: 10px;
 bottom: 10px;
 width: 650px;
 height: 120px;
 font-weight: 500;
 font-size: 20px;
 padding: 15px;
 border-radius: 18px;
}

.termit-failures {
  font-weight: bold;
}

.termit-successes {
  font-weight: bold;
}

.frame-root {
  overflow-y: hidden !important;
}


#masterlingo-snackbar {
  z-index: 2147483647;
  width: 600px;
  height: 414px;
  /* background-color: #333; */
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 0px;
  position: fixed;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%);
  font-size: 17px;
  box-shadow: 0px 0px 2px #5c5c5c8e;
  border:1px solid rgb(143, 143, 143);
}


/* Hypothes.is */

@charset "UTF-8";
/*
! tailwindcss v3.0.18 | MIT License | https://tailwindcss.com
*/
/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/
*,
::before,
::after {
box-sizing: border-box; /* 1 */
border-width: 0; /* 2 */
border-style: solid; /* 2 */
border-color: #dbdbdb; /* 2 */
}
::before,
::after {
--tw-content: '';
}
/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
*/
html {
line-height: 1.5; /* 1 */
-webkit-text-size-adjust: 100%; /* 2 */
-moz-tab-size: 4; /* 3 */
tab-size: 4; /* 3 */
font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; /* 4 */
}
/*
1. Remove the margin in all browsers.
2. Inherit line-height from html so users can set them as a class directly on the html element.
*/
body {
margin: 0; /* 1 */
line-height: inherit; /* 2 */
}
/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/
hr {
height: 0; /* 1 */
color: inherit; /* 2 */
border-top-width: 1px; /* 3 */
}
/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/
abbr:where([title]) {
-webkit-text-decoration: underline dotted;
        text-decoration: underline dotted;
}
/*
Remove the default font size and weight for headings.
*/
h1,
h2,
h3,
h4,
h5,
h6 {
font-size: inherit;
font-weight: inherit;
}
/*
Reset links to optimize for opt-in styling instead of opt-out.
*/
a {
color: inherit;
text-decoration: inherit;
}
/*
Add the correct font weight in Edge and Safari.
*/
b,
strong {
font-weight: bolder;
}
/*
1. Use the user's configured mono font family by default.
2. Correct the odd em font sizing in all browsers.
*/
code,
kbd,
samp,
pre {
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */
font-size: 1em; /* 2 */
}
/*
Add the correct font size in all browsers.
*/
small {
font-size: 80%;
}
/*
Prevent sub and sup elements from affecting the line height in all browsers.
*/
sub,
sup {
font-size: 75%;
line-height: 0;
position: relative;
vertical-align: baseline;
}
sub {
bottom: -0.25em;
}
sup {
top: -0.5em;
}
/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/
table {
text-indent: 0; /* 1 */
border-color: inherit; /* 2 */
border-collapse: collapse; /* 3 */
}
/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/
button,
input,
optgroup,
select,
textarea {
font-family: inherit; /* 1 */
font-size: 100%; /* 1 */
line-height: inherit; /* 1 */
color: inherit; /* 1 */
margin: 0; /* 2 */
padding: 0; /* 3 */
}
/*
Remove the inheritance of text transform in Edge and Firefox.
*/
button,
select {
text-transform: none;
}
/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/
button,
[type='button'],
[type='reset'],
[type='submit'] {
-webkit-appearance: button; /* 1 */
background-color: transparent; /* 2 */
background-image: none; /* 2 */
}
/*
Use the modern Firefox focus style for all focusable elements.
*/
:-moz-focusring {
outline: auto;
}
/*
Remove the additional :invalid styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/
:-moz-ui-invalid {
box-shadow: none;
}
/*
Add the correct vertical alignment in Chrome and Firefox.
*/
progress {
vertical-align: baseline;
}
/*
Correct the cursor style of increment and decrement buttons in Safari.
*/
::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
height: auto;
}
/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/
[type='search'] {
-webkit-appearance: textfield; /* 1 */
outline-offset: -2px; /* 2 */
}
/*
Remove the inner padding in Chrome and Safari on macOS.
*/
::-webkit-search-decoration {
-webkit-appearance: none;
}
/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to inherit in Safari.
*/
::-webkit-file-upload-button {
-webkit-appearance: button; /* 1 */
font: inherit; /* 2 */
}
/*
Add the correct display in Chrome and Safari.
*/
summary {
display: list-item;
}
/*
Removes the default spacing and border for appropriate elements.
*/
blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
margin: 0;
}
fieldset {
margin: 0;
padding: 0;
}
legend {
padding: 0;
}
ol,
ul,
menu {
list-style: none;
margin: 0;
padding: 0;
}
/*
Prevent resizing textareas horizontally by default.
*/
textarea {
resize: vertical;
}
/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/
input::placeholder,
textarea::placeholder {
opacity: 1; /* 1 */
color: #9ca3af; /* 2 */
}
/*
Set the default cursor for buttons.
*/
button,
[role="button"] {
cursor: pointer;
}
/*
Make sure disabled buttons don't get the pointer cursor.
*/
:disabled {
cursor: default;
}
/*
1. Make replaced elements display: block by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add vertical-align: middle to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
 This can trigger a poorly considered lint error in some tools but is included by design.
*/
img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
display: block; /* 1 */
vertical-align: middle; /* 2 */
}
/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/
img,
video {
max-width: 100%;
height: auto;
}
/*
Ensure the default browser behavior of the hidden attribute.
*/
[hidden] {
display: none;
}
*, ::before, ::after{
--tw-translate-x: 0;
--tw-translate-y: 0;
--tw-rotate: 0;
--tw-skew-x: 0;
--tw-skew-y: 0;
--tw-scale-x: 1;
--tw-scale-y: 1;
--tw-pan-x:  ;
--tw-pan-y:  ;
--tw-pinch-zoom:  ;
--tw-scroll-snap-strictness: proximity;
--tw-ordinal:  ;
--tw-slashed-zero:  ;
--tw-numeric-figure:  ;
--tw-numeric-spacing:  ;
--tw-numeric-fraction:  ;
--tw-ring-inset:  ;
--tw-ring-offset-width: 0px;
--tw-ring-offset-color: #fff;
--tw-ring-color: rgb(59 130 246 / 0.5);
--tw-ring-offset-shadow: 0 0 #0000;
--tw-ring-shadow: 0 0 #0000;
--tw-shadow: 0 0 #0000;
--tw-shadow-colored: 0 0 #0000;
--tw-blur:  ;
--tw-brightness:  ;
--tw-contrast:  ;
--tw-grayscale:  ;
--tw-hue-rotate:  ;
--tw-invert:  ;
--tw-saturate:  ;
--tw-sepia:  ;
--tw-drop-shadow:  ;
--tw-backdrop-blur:  ;
--tw-backdrop-brightness:  ;
--tw-backdrop-contrast:  ;
--tw-backdrop-grayscale:  ;
--tw-backdrop-hue-rotate:  ;
--tw-backdrop-invert:  ;
--tw-backdrop-opacity:  ;
--tw-backdrop-saturate:  ;
--tw-backdrop-sepia:  ;
}
/**
* Return a length value for use in spacing between (margin) or around
* (padding) elements.
*
* @param {number} [$space-unit] - The relative size of the space desired,
*   from 0 (no space) to 9 (lots of space). Default 5.
*/
/**
* Add border styles for all element sides (default) or a specific single side
*
* @param {'left'|'right'|'bottom'|'top'} [$side]
*/
/**
* Style a shadow off of the element. $active variant is larger, darker,
* intended for hovered/active elements.
*
* @param {boolean} [$active]
*/
/**
* Override CSS rules.
*
* This mixin serves two purposes:
* - Allows developers to be explicit that the contained CSS rule-set overrides
*   styling imposed by another pattern
* - Increases the specificity of the contained rule-set to aid in overriding
*
* Current implementation: Use the :not pseudo-class to increase specifity.
*/
/**
* Add stylized focus to interactive elements such <input> or <textarea>
*
* @param {boolean} [$inset] -
*   The focus style is implemented with a box-shadow and this parameter determines whether
*   the box-shadow should be inset on the element. Set this to true when the element
*   may be adjacent to another in order to prevent part of the outline from being obscured.
*/
/**
* Display an outline on an element only when it has keyboard focus.
*
* This requires the browser to support the :focus-visible pseudo-selector [1]
* or for the JS polyfill [2] to be loaded.
*
* [1] https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
* [2] https://github.com/WICG/focus-visible
*
* @param {boolean} $inset - Does the outline render inset or not
*/
/**
* Apply a margin to all sides (default) or designated $side in specified
* $size (default: spacing-unit 5)
*
* @param {number} [$size] - spacing-unit 0-9, default 5
* @param {'left'|'right'|'top'|'bottom'} [$side]
*/
/**
* Apply padding to all sides (default) or designated $side in specified
* $size (default: spacing-unit 3)
*
* @param {number} [$size] - spacing-unit 0-9, default 3
* @param {'left'|'right'|'top'|'bottom'} [$side]
*/
/**
* Abstract mixin for establishing basic flex container. External users should
* use row or column as needed. Default values here reflect default CSS
* values for flex rules.
*
* @param {string} $direction [row] - value for flex-direction (row or column).
* @param {string} $justify [flex-start] - How to align contents on main axis.
*                                    Accepts and maps special value of 'right'
*                                   (roughly analogous to horizontal alignment)
* @param {string} $align [stretch] - How to align contents on cross axis.
*                                    (roughly analogous to vertical alignment)
*/
/**
* Establish a column (flex-direction: column) flex container.
*
* @param {string} $justify [flex-start] - How to justify flex contents
* @param {string} $align [stretch] - How to align flex contents
*/
/**
* Establish a row (flex-direction: column) flex container.
*
* @param {string} $justify [flex-start] - How to justify flex contents
* @param {string} $align [stretch] - How to align flex contents
*/
/**
* Put $size of vertical space between all immediate children.
*
* @param {length} [$size] - Relative size of spacing, 0 - 9. Default 5
*/
/**
* Put $size of horizontal space between all immediate children.
*
* @param {length} [$size] - Relative size of spacing, 0 - 9. Default 3
*/
/**
* Position an element vertically and horizontally within the viewport
*/
/**
* Position an element, absolutely, vertically and horizontally
*/
/**
* Semi-opaque overlay, full-viewport
*/
/**
* General styling for a text-like input
*/
/**
* Styling for <input type="text" />. Includes a state class for errors.
*/
/**
* A pattern for pairing a text input (left) with an icon-only button (right).
*
* Removes border radiuses where the two elements touch, and adds a border
* to the button to align with the input.
*
* Sample usage:
*  <div.hyp-text-input-with-button />
*   <input.hyp-text-input />
*   <button.hyp-IconButton />
*  </div>
*/
/**
* Style a <label> element that wraps around its input, e.g.
*
* <label>
*  <input type="checkbox" />
*  <span>I am a label</span>
* </label>
*/
/**
* A checkbox input field.
*
* Style appearance of <input[type="checkbox"]> using an <svg> element.
*
* Style the input itself such that it is not visible to sighted users, and
* instead use the SVG for checkbox appearance. The SVG and input are composited
* such that users are still interacting with the input.
*
* See https://www.sarasoueidan.com/blog/inclusively-hiding-and-styling-checkboxes-and-radio-buttons/
*
* The <svg> element should be contained within a <span> immediately following
* (adjacent sibling to) the <input>:
*
*   <input class="hyp-checkbox" type="checkbox" />
*   <span> <!-- generated by SvgIcon -->
*     <svg.hyp-svg-checkbox>
*       <rect.hyp-svg-checkbox--background />
*       <polyline.hyp-svg-checkbox--checkmark />
*     </svg>
*   </span>
*/
.Hyp-LabeledCheckbox {
cursor: pointer;
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
}
.Hyp-LabeledCheckbox > :not(:first-child) {
margin-left: 0.25rem;
}
.Hyp-LabeledCheckbox > :first-child {
margin-left: 0;
}
.Hyp-LabeledCheckbox > :last-child {
margin-right: 0;
}

.Hyp-Checkbox {
cursor: pointer;
position: absolute;
width: 1em;
height: 1em;
opacity: 0.00001;
}
.Hyp-Checkbox + span:not(#increase-specificity) {
margin-left: 0;
}
.Hyp-Checkbox + span > svg {
width: 1em;
height: 1em;
}
.Hyp-Checkbox + span > svg * {
transition: all 0.1s linear;
}
.Hyp-Checkbox:focus + span > svg {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.Hyp-Checkbox:focus:not(:focus-visible) + span > svg {
outline: none;
box-shadow: none;
}
.Hyp-Checkbox:not(:checked) + span .hyp-svg-checkbox--background {
stroke: #737373;
}
.Hyp-Checkbox:checked + span .hyp-svg-checkbox--background {
fill: white;
stroke: #3f3f3f;
}
.Hyp-Checkbox:checked + span .hyp-svg-checkbox--checkmark {
stroke: #3f3f3f;
}

/**
* This mixin allows other mixins to declare rules that should only apply
* when a particular theme is active.
*
* The only known theme at present is the "clean" theme and it only applies
* to the client (Sidebar, Notebook) application.
*
* The client application provides relatively minimalistic support for a
* "clean" theme by applying a theme-clean class to the application container
* element.
*
* For example, let's say that the clean-theme variant of a pattern called
* banana should not have any borders applied. Its mixin can be written:
*
* @mixin banana {
*  border: 1px solid pink;
*  @include theme('clean') {
*    border: none;
*  }
* }
*
* .hyp-banana {
*   @include banana;
* }
*
* This would result in CSS:
*
* .hyp-banana {
*   border: 1px solid pink;
* }
*
* .theme-clean .hyp-banana {
*   border: none;
* }
*
* Note: As implemented here, theming increases specificity. Rules defined in
* theming cannot be overridden with utility classes as currently structured.
*/
/**
* Patterns that are composites of multiple atomic utilities, but
* are not standalone components.
*/
/**
* Give an element a border, background color and internal vertical spacing
*/
/**
* A frame with a shadow and (optional) shadow hover effect. Fills available
* horizontal space.
*
* @param {boolean} [$with-hover] - Should this frame have a hover effect?
*/
/**
* A container that lays out a collection of actions—typically buttons. Default
* to a row layout, but also available as column.
*
* @param {'row'|'column'} [$direction]
*/
/**
* A modal container, with responsive positioning and sizing.
*
* A modal should contain one immediate-child element; in most cases, an
* element that applies the dialog[1] pattern. Content within the dialog
* (grandchild elements of modal) can be managed with overflow rules so as not
* to exceed the size constraints of the modal within the viewport.
*
* Example structure follows:
*
* <modal>
*   <dialog>
*     <div /> <!-- dialog can contain any arbitrary content -->
*     <div style="overflow: auto">
*       This content will scroll vertically if it is too tall for the
*       available space in the modal.
*     </div>
*     <div />
*     ...
*   </dialog>
* </modal>
*
* [1]: The modal's immediate child need not specifically apply the dialog
*      pattern, but any element that needs to manage overflow within the modal
*      must be a grandchild of the modal container element.
*/
/**
* A scrolling "frame" that shows scroll-hint shadows at the top and bottom
* of the frame if:
*  - The content height exceeds the frame height: i.e. can be scrolled, and
*  - The content is scrollable in the shadow's direction (up or down)
*
* Shadows are not visible once the frame has been scrolled all the way in the
* shadow's direction. Shadows are not visible if the height of the content
* does not overflow the frame (is not scrollable).
*
* The shadow hinting is handled by four positioned background gradients:
*   - One gradient each at top and bottom of frame that obscure the shadow hints
*     (shadow covers). These use background-attachment: local, which makes
*     their position fixed to the _content_ within the scrollbox.
*   - One gradient each at the top and the bottom of the frame that are the
*     shadow hints (shadows). These use background-attachment: scroll such
*     that they are always positioned at the top and the bottom of the
*     _scrollbox_ frame. When these positions align with the positions of the
*     shadow covers--at the top and the bottom of the overflowing content--
*     they will be obscured by those shadow covers.
*
* See https://lea.verou.me/2012/04/background-attachment-local/
*
* Safari's behavior is different because of a bug with
* background-attachment: local.
* See https://bugs.webkit.org/show_bug.cgi?id=219324
* In Safari:
*   - Scroll-hint shadows do not appear if content does not overflow (this is
*     consistent with other browsers)
*   - Only the bottom scroll-hint shadow appears if content overflows
*   - The bottom scroll-hint shadow is always present, even if content is
*     fully scrolled
*
* @param {CSSLength} [$shadow-top-position=0] - Top scroll-indicating shadow
*   (y) position. Default 0: at top edge of scrollbox. Use case: move
*   shadow down to accommodate a sticky header of a known height, such that the
*   shadow appears below the header(s).
* @param {CSSLength} [$shadow-bottom-position=100%] - Bottom scroll-indicating
*   shadow position relative to scrollbox. Default 100%: flush to bottom.
*/
/**
* A scrollbox with the top shadow repositioned down by touch-target-size
* to accommodate, e.g., a sticky header at the top of the scrollable content.
*/
/**
* A sticky container that is sized one-touch-unit high. This is currently
* expanded upon by table styling, but not used in other patterns (yet).
*/
.Hyp-Frame {
padding: 1rem;
border: 1px solid #dbdbdb;
border-radius: 2px;
background-color: white;
}
.Hyp-Frame > :not(:first-child) {
margin-top: 1rem;
}
.Hyp-Frame > :first-child {
margin-top: 0;
}
.Hyp-Frame > :last-child {
margin-bottom: 0;
}
.theme-clean .Hyp-Frame {
border: none;
}

.Hyp-Card {
padding: 1rem;
border: 1px solid #dbdbdb;
border-radius: 2px;
background-color: white;
/* offset-x | offset-y | blur-radius | color */
box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
width: 100%;
}
.Hyp-Card > :not(:first-child) {
margin-top: 1rem;
}
.Hyp-Card > :first-child {
margin-top: 0;
}
.Hyp-Card > :last-child {
margin-bottom: 0;
}
.theme-clean .Hyp-Card {
border: none;
}
.Hyp-Card:hover, .Hyp-Card.is-focused {
/* offset-x | offset-y | blur-radius | spread-radius | color */
box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
}
.theme-clean .Hyp-Card {
box-shadow: none;
}

.Hyp-Actions,
.Hyp-Actions--row {
display: flex;
flex-direction: row;
justify-content: flex-end;
align-items: stretch;
}
.Hyp-Actions > :not(:first-child),
.Hyp-Actions--row > :not(:first-child) {
margin-left: 0.75rem;
}
.Hyp-Actions > :first-child,
.Hyp-Actions--row > :first-child {
margin-left: 0;
}
.Hyp-Actions > :last-child,
.Hyp-Actions--row > :last-child {
margin-right: 0;
}

.Hyp-Actions--column {
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: stretch;
}
.Hyp-Actions--column > :not(:first-child) {
margin-top: 0.5rem;
}
.Hyp-Actions--column > :first-child {
margin-top: 0;
}
.Hyp-Actions--column > :last-child {
margin-bottom: 0;
}

.Hyp-Scrollbox {
overflow: auto;
border: 1px solid #dbdbdb;
position: relative;
height: 100%;
width: 100%;
background: linear-gradient(white 30%, rgba(255, 255, 255, 0)) 0 0, linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05) 5px, rgba(255, 255, 255, 0) 70%) 0 0, linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05) 5px, rgba(255, 255, 255, 0) 70%) 0 100%;
background-repeat: no-repeat;
background-color: white;
background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
background-attachment: local, local, scroll, scroll;
}

.Hyp-Scrollbox--with-header {
overflow: auto;
border: 1px solid #dbdbdb;
position: relative;
height: 100%;
width: 100%;
background: linear-gradient(white 30%, rgba(255, 255, 255, 0)) 0 44px, linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05) 5px, rgba(255, 255, 255, 0) 70%) 0 44px, linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05) 5px, rgba(255, 255, 255, 0) 70%) 0 100%;
background-repeat: no-repeat;
background-color: white;
background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
background-attachment: local, local, scroll, scroll;
}

/**
* A panel is a card that adds an optional header and/or close button positioning.
* Panels using an icon-only button as a close button should use the --closeable
* modifier.
*/
.Hyp-Dialog {
padding: 1rem;
border: 1px solid #dbdbdb;
border-radius: 2px;
background-color: white;
/* offset-x | offset-y | blur-radius | color */
box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
width: 100%;
}
.Hyp-Dialog:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Hyp-Dialog:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-Dialog:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-Dialog > :not(:first-child) {
margin-top: 1rem;
}
.Hyp-Dialog > :first-child {
margin-top: 0;
}
.Hyp-Dialog > :last-child {
margin-bottom: 0;
}
.theme-clean .Hyp-Dialog {
border: none;
}
.Hyp-Dialog:hover, .Hyp-Dialog.is-focused {
/* offset-x | offset-y | blur-radius | spread-radius | color */
box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
}
.theme-clean .Hyp-Dialog {
box-shadow: none;
border: 1px solid #dbdbdb;
}
.Hyp-Dialog > .Hyp-Dialog__header {
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
border-bottom: 1px solid #dbdbdb;
padding-bottom: 1rem;
}
.Hyp-Dialog > .Hyp-Dialog__header > :not(:first-child) {
margin-left: 0.5rem;
}
.Hyp-Dialog > .Hyp-Dialog__header > :first-child {
margin-left: 0;
}
.Hyp-Dialog > .Hyp-Dialog__header > :last-child {
margin-right: 0;
}
.Hyp-Dialog__title {
font-size: 1.1em;
color: #bd1c2b;
font-weight: 600;
line-height: 1;
flex-grow: 1;
}
.Hyp-Dialog--closeable .Hyp-Dialog__header {
padding-bottom: 0.25rem;
margin-top: -0.5rem;
}
.Hyp-Dialog--closeable > .Hyp-Dialog__header .Hyp-Dialog__close {
font-size: 1.375em;
margin-right: -0.75rem;
}
.Hyp-Dialog__content > :not(:first-child) {
margin-top: 1rem;
}
.Hyp-Dialog__content > :first-child {
margin-top: 0;
}
.Hyp-Dialog__content > :last-child {
margin-bottom: 0;
}
.Hyp-Dialog__actions {
display: flex;
flex-direction: row;
justify-content: flex-end;
align-items: stretch;
}
.Hyp-Dialog__actions > :not(:first-child) {
margin-left: 0.75rem;
}
.Hyp-Dialog__actions > :first-child {
margin-left: 0;
}
.Hyp-Dialog__actions > :last-child {
margin-right: 0;
}

.Hyp-Link {
display: inline-block;
color: #bd1c2b;
text-decoration: none;
border-radius: 2px;
}
.Hyp-Link:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Hyp-Link:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-Link:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-Link:active, .Hyp-Link:focus {
text-decoration: none;
}
.Hyp-Link:hover {
text-decoration: none;
color: #84141e;
}

.Hyp-Modal__overlay {
z-index: 10;
position: fixed;
top: 0;
left: 0;
bottom: 0;
right: 0;
background-color: rgba(0, 0, 0, 0.5);
}

.Hyp-Modal {
z-index: 20;
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 90vw;
max-width: 90vw;
max-height: 90vh;
}
@media screen and (min-width: 48rem) {
.Hyp-Modal {
  width: auto;
  min-width: 28rem;
  max-width: 44rem;
  max-width: min(44rem, 90vw);
}
}
@media screen and (min-height: 32rem) {
.Hyp-Modal {
  top: 10vh;
  max-height: 80vh;
  transform: translate(-50%, 0);
}
}
.Hyp-Modal > * {
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: stretch;
max-height: 90vh;
}
@media screen and (min-height: 32rem) {
.Hyp-Modal > * {
  max-height: 80vh;
}
}

.Hyp-Panel {
padding: 1rem;
border: 1px solid #dbdbdb;
border-radius: 2px;
background-color: white;
/* offset-x | offset-y | blur-radius | color */
box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
width: 100%;
}
.Hyp-Panel:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Hyp-Panel:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-Panel:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-Panel > :not(:first-child) {
margin-top: 1rem;
}
.Hyp-Panel > :first-child {
margin-top: 0;
}
.Hyp-Panel > :last-child {
margin-bottom: 0;
}
.theme-clean .Hyp-Panel {
border: none;
}
.Hyp-Panel:hover, .Hyp-Panel.is-focused {
/* offset-x | offset-y | blur-radius | spread-radius | color */
box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
}
.theme-clean .Hyp-Panel {
box-shadow: none;
border: 1px solid #dbdbdb;
}
.Hyp-Panel > .Hyp-Panel__header {
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
border-bottom: 1px solid #dbdbdb;
padding-bottom: 1rem;
}
.Hyp-Panel > .Hyp-Panel__header > :not(:first-child) {
margin-left: 0.5rem;
}
.Hyp-Panel > .Hyp-Panel__header > :first-child {
margin-left: 0;
}
.Hyp-Panel > .Hyp-Panel__header > :last-child {
margin-right: 0;
}
.Hyp-Panel__title {
font-size: 1.1em;
color: #bd1c2b;
font-weight: 600;
line-height: 1;
flex-grow: 1;
}
.Hyp-Panel--closeable .Hyp-Panel__header {
padding-bottom: 0.25rem;
margin-top: -0.5rem;
}
.Hyp-Panel--closeable > .Hyp-Panel__header .Hyp-Panel__close {
font-size: 1.375em;
margin-right: -0.75rem;
}
.Hyp-Panel__content > :not(:first-child) {
margin-top: 1rem;
}
.Hyp-Panel__content > :first-child {
margin-top: 0;
}
.Hyp-Panel__content > :last-child {
margin-bottom: 0;
}
.Hyp-Panel__actions {
display: flex;
flex-direction: row;
justify-content: flex-end;
align-items: stretch;
}
.Hyp-Panel__actions > :not(:first-child) {
margin-left: 0.75rem;
}
.Hyp-Panel__actions > :first-child {
margin-left: 0;
}
.Hyp-Panel__actions > :last-child {
margin-right: 0;
}

/**
* Style an svg icon as a loading spinner
*
* @param {'small'|'medium'|'large'} [$size='medium'] - Relative size of
*   spinner image
*/
/**
* Style a container with an svg.&__spinner as a full-screen loading spinner,
* by applying an overlay to the container and fixed-centered positioning to
* the contained svg icon
*/
.Hyp-Spinner--small {
color: #737373;
font-size: 1em;
}

.Hyp-Spinner,
.Hyp-Spinner--medium {
color: #737373;
font-size: 2em;
}

.Hyp-Spinner--large {
color: #737373;
font-size: 4em;
}

.Hyp-FullScreenSpinner {
z-index: 10;
position: fixed;
top: 0;
left: 0;
bottom: 0;
right: 0;
background-color: rgba(255, 255, 255, 0.5);
}
.Hyp-FullScreenSpinner__spinner {
z-index: 20;
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.Hyp-Icon {
display: block;
width: 1em;
height: 1em;
}

/* Make the wrapper element's size match the contained svg element  */
.Hyp-SvgIcon {
display: flex;
}
.Hyp-SvgIcon--inline {
display: inline;
}

.Hyp-Table-Scrollbox {
min-height: 132px;
}
.Hyp-Table-Scrollbox__loading {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
margin-top: 22px;
}
.Hyp-Table-Scrollbox__message {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
display: flex;
flex-direction: row;
justify-content: center;
align-items: stretch;
padding: 0.5rem;
width: 100%;
top: 88px;
}

.Hyp-Table {
border-collapse: separate;
border-spacing: 0;
table-layout: fixed;
width: 100%;
color: #202020;
}
.Hyp-Table:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Hyp-Table:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-Table:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-Table th,
.Hyp-Table td {
padding: 0.5rem;
line-height: 1;
}
.Hyp-Table td {
border-top: 1px solid #dbdbdb;
}
.Hyp-Table__header {
position: -webkit-sticky;
position: sticky;
top: 0;
height: 44px;
padding: 0.5rem;
font-weight: bold;
background-color: white;
width: 100%;
border-bottom: 1px solid #9c9c9c;
background-color: #ececec;
z-index: 1;
text-align: left;
}
.Hyp-Table__header__heading {
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
height: 100%;
}
.Hyp-Table tbody {
cursor: pointer;
}
.Hyp-Table tr {
height: 44px;
padding: 0.5rem;
}
.Hyp-Table tr:first-child td {
border-top: none;
}
.Hyp-Table tr.is-selected td {
background-color: #595969;
color: white;
}
.Hyp-Table tr:hover:not(.is-selected) {
background-color: #babac444;
}
.Hyp-Table tr:nth-child(odd):not(.is-selected) {
background-color: rgba(0, 0, 0, 0.025);
}

.Hyp-TextInput {
border: 1px solid #dbdbdb;
padding: 0.5rem;
background-color: #fafafa;
color: #202020;
border-radius: 2px;
}
.Hyp-TextInput:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8 inset;
}
.Hyp-TextInput.has-error, .Hyp-TextInput.is-error {
outline: none;
box-shadow: 0 0 0 2px #d93c3f inset;
}
.Hyp-TextInput::placeholder {
color: #737373;
}
.Hyp-TextInput:focus {
background-color: white;
}
.Hyp-TextInput:focus::placeholder {
color: #a6a6a6;
}

.Hyp-TextInputWithButton {
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: stretch;
width: 100%;
}
.Hyp-TextInputWithButton input {
border: 1px solid #dbdbdb;
padding: 0.5rem;
background-color: #fafafa;
color: #202020;
border-radius: 2px;
flex-grow: 1;
border-top-right-radius: 0;
border-bottom-right-radius: 0;
}
.Hyp-TextInputWithButton input:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8 inset;
}
.Hyp-TextInputWithButton input.has-error, .Hyp-TextInputWithButton input.is-error {
outline: none;
box-shadow: 0 0 0 2px #d93c3f inset;
}
.Hyp-TextInputWithButton input::placeholder {
color: #737373;
}
.Hyp-TextInputWithButton input:focus {
background-color: white;
}
.Hyp-TextInputWithButton input:focus::placeholder {
color: #a6a6a6;
}
.Hyp-TextInputWithButton button {
border: 1px solid #dbdbdb;
border-top-left-radius: 0;
border-bottom-left-radius: 0;
border-left: 0;
}

.Hyp-Thumbnail {
padding: 0.75rem;
background-color: #f2f2f2;
width: 100%;
height: 100%;
}
.Hyp-Thumbnail__content {
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
font-size: 2em;
color: #9c9c9c;
background-color: white;
width: 100%;
height: 100%;
}
.Hyp-Thumbnail__content > img {
width: 100%;
height: 100%;
object-fit: contain;
}

.Hyp-LabeledButton {
padding: 0;
margin: 0;
background-color: transparent;
border-style: none;
color: #595959;
background-color: #f2f2f2;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
border-radius: 2px;
border: none;
padding: 0.5em;
font-size: 1em;
font-weight: 700;
white-space: nowrap;
display: flex;
align-items: center;
}
.Hyp-LabeledButton:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Hyp-LabeledButton:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-LabeledButton:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-LabeledButton:disabled {
color: #595959;
}
.Hyp-LabeledButton[aria-expanded=true], .Hyp-LabeledButton[aria-pressed=true] {
color: #202020;
}
.Hyp-LabeledButton[aria-expanded=true]:hover:not([disabled]), .Hyp-LabeledButton[aria-pressed=true]:hover:not([disabled]) {
color: #202020;
}
.Hyp-LabeledButton[aria-expanded=true]:focus:not([disabled]), .Hyp-LabeledButton[aria-pressed=true]:focus:not([disabled]) {
color: #202020;
}
.Hyp-LabeledButton:hover:not([disabled]) {
color: #202020;
background-color: #ececec;
}
.Hyp-LabeledButton--small {
padding: 0.25em;
}
.Hyp-LabeledButton--large {
padding: 0.75em;
}
.Hyp-LabeledButton--icon-left svg {
margin-right: 0.5em;
}
.Hyp-LabeledButton--icon-right svg {
margin-left: 0.5em;
}
.Hyp-LabeledButton svg {
width: 1.25em;
height: 1.25em;
}
.Hyp-LabeledButton--light {
color: #595959;
background-color: #f2f2f2;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
}
.Hyp-LabeledButton--light:disabled {
color: #595959;
}
.Hyp-LabeledButton--light[aria-expanded=true], .Hyp-LabeledButton--light[aria-pressed=true] {
color: #202020;
}
.Hyp-LabeledButton--light[aria-expanded=true]:hover:not([disabled]), .Hyp-LabeledButton--light[aria-pressed=true]:hover:not([disabled]) {
color: #202020;
}
.Hyp-LabeledButton--light[aria-expanded=true]:focus:not([disabled]), .Hyp-LabeledButton--light[aria-pressed=true]:focus:not([disabled]) {
color: #202020;
}
.Hyp-LabeledButton--light:hover:not([disabled]) {
color: #202020;
background-color: #ececec;
}
.Hyp-LabeledButton--primary {
color: #f2f2f2;
background-color: #595959;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
}
.Hyp-LabeledButton--primary:disabled {
color: #a6a6a6;
}
.Hyp-LabeledButton--primary[aria-expanded=true], .Hyp-LabeledButton--primary[aria-pressed=true] {
color: #f2f2f2;
}
.Hyp-LabeledButton--primary[aria-expanded=true]:hover:not([disabled]), .Hyp-LabeledButton--primary[aria-pressed=true]:hover:not([disabled]) {
color: #f2f2f2;
}
.Hyp-LabeledButton--primary[aria-expanded=true]:focus:not([disabled]), .Hyp-LabeledButton--primary[aria-pressed=true]:focus:not([disabled]) {
color: #f2f2f2;
}
.Hyp-LabeledButton--primary:hover:not([disabled]) {
color: #f2f2f2;
background-color: #3f3f3f;
}
.Hyp-LabeledButton--dark {
color: #595959;
background-color: transparent;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
}
.Hyp-LabeledButton--dark:disabled {
color: #595959;
}
.Hyp-LabeledButton--dark[aria-expanded=true], .Hyp-LabeledButton--dark[aria-pressed=true] {
color: #595959;
background-color: #dbdbdb;
}
.Hyp-LabeledButton--dark[aria-expanded=true]:hover:not([disabled]), .Hyp-LabeledButton--dark[aria-pressed=true]:hover:not([disabled]) {
color: #202020;
}
.Hyp-LabeledButton--dark[aria-expanded=true]:focus:not([disabled]), .Hyp-LabeledButton--dark[aria-pressed=true]:focus:not([disabled]) {
color: #595959;
}
.Hyp-LabeledButton--dark:hover:not([disabled]) {
color: #202020;
background-color: #dbdbdb;
}

.Hyp-IconButton {
padding: 0;
margin: 0;
border-style: none;
color: #595959;
background-color: transparent;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
border-radius: 2px;
border: none;
padding: 0.5em;
font-size: 1em;
font-weight: 700;
white-space: nowrap;
display: flex;
align-items: center;
}
.Hyp-IconButton:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Hyp-IconButton:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-IconButton:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-IconButton:disabled {
color: #595959;
}
.Hyp-IconButton[aria-expanded=true], .Hyp-IconButton[aria-pressed=true] {
color: #bd1c2b;
}
.Hyp-IconButton[aria-expanded=true]:hover:not([disabled]), .Hyp-IconButton[aria-pressed=true]:hover:not([disabled]) {
color: #202020;
}
.Hyp-IconButton[aria-expanded=true]:focus:not([disabled]), .Hyp-IconButton[aria-pressed=true]:focus:not([disabled]) {
color: #bd1c2b;
}
.Hyp-IconButton:hover:not([disabled]) {
color: #202020;
background-color: transparent;
}
.Hyp-IconButton--small {
padding: 0.25em;
}
.Hyp-IconButton--large {
padding: 0.75em;
}
.Hyp-IconButton svg {
width: 1em;
height: 1em;
}
.Hyp-IconButton--light {
color: #9c9c9c;
background-color: transparent;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
}
.Hyp-IconButton--light:disabled {
color: #9c9c9c;
}
.Hyp-IconButton--light[aria-expanded=true], .Hyp-IconButton--light[aria-pressed=true] {
color: #9c9c9c;
}
.Hyp-IconButton--light[aria-expanded=true]:hover:not([disabled]), .Hyp-IconButton--light[aria-pressed=true]:hover:not([disabled]) {
color: #3f3f3f;
}
.Hyp-IconButton--light[aria-expanded=true]:focus:not([disabled]), .Hyp-IconButton--light[aria-pressed=true]:focus:not([disabled]) {
color: #9c9c9c;
}
.Hyp-IconButton--light:hover:not([disabled]) {
color: #3f3f3f;
background-color: transparent;
}
.Hyp-IconButton--primary {
color: #bd1c2b;
background-color: transparent;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
}
.Hyp-IconButton--primary:disabled {
color: #595959;
}
.Hyp-IconButton--primary[aria-expanded=true], .Hyp-IconButton--primary[aria-pressed=true] {
color: #bd1c2b;
}
.Hyp-IconButton--primary[aria-expanded=true]:hover:not([disabled]), .Hyp-IconButton--primary[aria-pressed=true]:hover:not([disabled]) {
color: #bd1c2b;
}
.Hyp-IconButton--primary[aria-expanded=true]:focus:not([disabled]), .Hyp-IconButton--primary[aria-pressed=true]:focus:not([disabled]) {
color: #bd1c2b;
}
.Hyp-IconButton--primary:hover:not([disabled]) {
color: #bd1c2b;
background-color: transparent;
}
.Hyp-IconButton--dark {
color: #595959;
background-color: #ececec;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
}
.Hyp-IconButton--dark:disabled {
color: #9c9c9c;
}
.Hyp-IconButton--dark[aria-expanded=true], .Hyp-IconButton--dark[aria-pressed=true] {
color: #202020;
background-color: #dbdbdb;
}
.Hyp-IconButton--dark[aria-expanded=true]:hover:not([disabled]), .Hyp-IconButton--dark[aria-pressed=true]:hover:not([disabled]) {
color: #202020;
}
.Hyp-IconButton--dark[aria-expanded=true]:focus:not([disabled]), .Hyp-IconButton--dark[aria-pressed=true]:focus:not([disabled]) {
color: #202020;
}
.Hyp-IconButton--dark:hover:not([disabled]) {
color: #202020;
background-color: #dbdbdb;
}
@media (pointer: coarse) {
.Hyp-IconButton--medium, .Hyp-IconButton--large {
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
}
}

.Hyp-LinkButton {
margin: 0;
border-style: none;
color: #595959;
background-color: transparent;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
border-radius: 2px;
border: none;
padding: 0.5em;
font-size: 1em;
white-space: nowrap;
display: flex;
align-items: center;
font-weight: 400;
padding: 0;
}
.Hyp-LinkButton:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Hyp-LinkButton:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-LinkButton:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Hyp-LinkButton:disabled {
color: #595959;
}
.Hyp-LinkButton[aria-expanded=true], .Hyp-LinkButton[aria-pressed=true] {
color: #202020;
}
.Hyp-LinkButton[aria-expanded=true]:hover:not([disabled]), .Hyp-LinkButton[aria-pressed=true]:hover:not([disabled]) {
color: #84141e;
}
.Hyp-LinkButton[aria-expanded=true]:focus:not([disabled]), .Hyp-LinkButton[aria-pressed=true]:focus:not([disabled]) {
color: #202020;
}
.Hyp-LinkButton:hover:not([disabled]) {
color: #84141e;
background-color: transparent;
}
.Hyp-LinkButton--small {
padding: 0.25em;
}
.Hyp-LinkButton--large {
padding: 0.75em;
}
.Hyp-LinkButton svg {
width: 1em;
height: 1em;
}
.Hyp-LinkButton--light {
color: #595959;
background-color: transparent;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
}
.Hyp-LinkButton--light:disabled {
color: #595959;
}
.Hyp-LinkButton--light[aria-expanded=true], .Hyp-LinkButton--light[aria-pressed=true] {
color: #202020;
}
.Hyp-LinkButton--light[aria-expanded=true]:hover:not([disabled]), .Hyp-LinkButton--light[aria-pressed=true]:hover:not([disabled]) {
color: #84141e;
}
.Hyp-LinkButton--light[aria-expanded=true]:focus:not([disabled]), .Hyp-LinkButton--light[aria-pressed=true]:focus:not([disabled]) {
color: #202020;
}
.Hyp-LinkButton--light:hover:not([disabled]) {
color: #84141e;
background-color: transparent;
}
.Hyp-LinkButton--primary {
color: #bd1c2b;
background-color: transparent;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
}
.Hyp-LinkButton--primary:disabled {
color: #595959;
}
.Hyp-LinkButton--primary[aria-expanded=true], .Hyp-LinkButton--primary[aria-pressed=true] {
color: #bd1c2b;
}
.Hyp-LinkButton--primary[aria-expanded=true]:hover:not([disabled]), .Hyp-LinkButton--primary[aria-pressed=true]:hover:not([disabled]) {
color: #bd1c2b;
}
.Hyp-LinkButton--primary[aria-expanded=true]:focus:not([disabled]), .Hyp-LinkButton--primary[aria-pressed=true]:focus:not([disabled]) {
color: #bd1c2b;
}
.Hyp-LinkButton--primary:hover:not([disabled]) {
color: #bd1c2b;
background-color: transparent;
}
.Hyp-LinkButton--dark {
color: #202020;
background-color: transparent;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
}
.Hyp-LinkButton--dark:disabled {
color: #595959;
}
.Hyp-LinkButton--dark[aria-expanded=true], .Hyp-LinkButton--dark[aria-pressed=true] {
color: #202020;
}
.Hyp-LinkButton--dark[aria-expanded=true]:hover:not([disabled]), .Hyp-LinkButton--dark[aria-pressed=true]:hover:not([disabled]) {
color: #84141e;
}
.Hyp-LinkButton--dark[aria-expanded=true]:focus:not([disabled]), .Hyp-LinkButton--dark[aria-pressed=true]:focus:not([disabled]) {
color: #202020;
}
.Hyp-LinkButton--dark:hover:not([disabled]) {
color: #84141e;
background-color: transparent;
}
.Hyp-LinkButton:hover:not([disabled]) {
text-decoration: underline;
}
.Hyp-LinkButton--primary {
font-weight: 500;
}

.InlineLinkButton {
display: inline;
}

.InlineLinkButton--underlined {
text-decoration: underline;
}

.PublishControlButton {
border-top-right-radius: 0;
border-bottom-right-radius: 0;
}

.PaginationPageButton {
padding: 0.75em 1em;
}

@media (pointer: coarse) {
.NonResponsiveIconButton {
  min-width: auto;
  min-height: auto;
}
}

.LabeledIconButton {
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: center;
cursor: pointer;
font-weight: normal;
font-size: 12px;
line-height: 1em;
padding: 0.75em;
transition: color 80ms;
background: transparent;
}
.LabeledIconButton:hover:not([disabled]) {
background-color: transparent;
}
.LabeledIconButton__label {
margin-top: 0.25em;
transition: color 80ms;
}

.TransparentButton {
background-color: transparent;
}
.TransparentButton:hover:not([disabled]) {
background-color: transparent;
}

.IconOnlyLink {
padding: 1em;
color: #202020;
}
.IconOnlyLink:hover:not([disabled]) {
color: #202020;
}

.AdderToolbar {
all: initial;
position: absolute;
box-sizing: border-box;
direction: ltr;
border-radius: 4px;
-webkit-user-select: none;
        user-select: none;
box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25);
opacity: 0.05;
animation-duration: 80ms;
animation-timing-function: ease-in;
animation-fill-mode: forwards;
}
.AdderToolbar--down.is-active {
animation-name: adder-fade-in, adder-pop-down;
}
.AdderToolbar--up.is-active {
animation-name: adder-fade-in, adder-pop-up;
}

.AdderToolbar__arrow {
position: absolute;
z-index: 2;
color: #dbdbdb;
fill: #fff;
left: 50%;
height: auto;
width: auto;
}
.AdderToolbar__arrow--down {
transform: rotateX(180deg) translateX(-50%) translateY(1px);
}
.AdderToolbar__arrow--up {
top: 0;
transform: translate(-50%, -100%);
}

.AdderToolbar__badge {
border-radius: 4px;
color: #f2f2f2;
font-weight: bold;
padding: 2px 4px;
}

.AdderToolbar__separator {
border-right: 1px solid #a6a6a6;
}

.AdderToolbar__actions:hover .AdderToolbar__button:not(:hover) {
color: #9c9c9c;
}
.AdderToolbar__actions:hover .AdderToolbar__button:not(:hover) .AdderToolbar__badge {
background-color: #9c9c9c;
}

@keyframes adder-fade-in {
0% {
  opacity: 0.05;
}
20% {
  opacity: 0.7;
}
100% {
  opacity: 1;
}
}
@keyframes adder-pop-up {
from {
  transform: scale(0.8) translateY(10px);
}
to {
  transform: scale(1) translateY(0px);
}
}
@keyframes adder-pop-down {
from {
  transform: scale(0.8) translateY(-10px);
}
to {
  transform: scale(1) translateY(0px);
}
}
/**
* Abstract mixin for establishing basic flex container. External users should
* use row or column as needed. Default values here reflect default CSS
* values for flex rules.
*
* @param {string} $direction [row] - value for flex-direction (row or column).
* @param {string} $justify [flex-start] - How to align contents on main axis.
*                                    Accepts and maps special value of 'right'
*                                   (roughly analogous to horizontal alignment)
* @param {string} $align [stretch] - How to align contents on cross axis.
*                                    (roughly analogous to vertical alignment)
*/
/**
* Establish a column (flex-direction: column) flex container.
*
* @param {string} $justify [flex-start] - How to justify flex contents
* @param {string} $align [stretch] - How to align flex contents
*/
/**
* Establish a row (flex-direction: column) flex container.
*
* @param {string} $justify [flex-start] - How to justify flex contents
* @param {string} $align [stretch] - How to align flex contents
*/
/**
* Establish a horizontal (margin) rhythm for this element's immediate
* children (i.e. put equal space between children).
*
* This mixin uses !important such that it can compete with specificity
* of reset rules that set some of our element's margins to 0. That allows
* these rules—which are applied to a parent element—to be able to assert
* margins, as it should be able to do.
*
* @param $size [5px] - Size of horizontal margin between child elements
*/
/**
* Establish a vertical (margin) rhythm for this element's immediate
* children (i.e. put equal space between children).
*
* This mixin uses !important such that it can compete with specificity
* of reset rules that set some of our element's margins to 0. That allows
* these rules—which are applied to a parent element—to be able to assert
* margins, as it should be able to do.
*
* @param $size [var.$layout-space--medium]: Spacing size (padding)
* @FIXME Find workaround for SvgIcon exception
*/
/**
* Establish vertical space outside of elements within the container
*
* @param $size [var.$layout-space--medium]: Spacing size (padding)
*/
/**
* Establish horizontal space outside of elements within the container
*
* @param $size [var.$layout-space--medium]: Spacing size (padding)
*/
/**
* Button mixins for use by the Button component or any component that wishes
* to override default Button-component styling. These mixins are meant to be
* applied to <button> HTML elements, with an optional contained icon
* (i.e. SvgIcon component or <svg> element).
*
* To customize default Button styling, start with an appropriate button mixin
* and extend or or override rules as necessary in your component's SCSS module.
*
* e.g., let's pretend you wish the Button used in MyComponent
* to have a pink background. In my-component.scss, you might do something like:
*
* .my-component-button {
*    @include button--labeled;
*    background-color: pink;
* }
*
* And pass 'my-component-button' as the className prop to Button.
*/
/**
* Basic color, sizing, padding and hover for buttons.
*/
/*
* A button with an icon and no displayed text.
*
* @param {boolean} [$with-active-state] - Adds an active state color when pressed / expanded
* @param {boolean} [$coarse-min-size] - Overrides the minimum height and width in mobile view.
*/
/**
* A button with displayed text. It may or may not have an icon. The default
* colors assume the button is displayed on a white background.
*
* @param {CSSColor} [$background-color] - The button's background color when
*   neither hovered nor active.
* @param {CSSColor} [$active-background-color]
*/
/**
* A labeled button that is a primary action.
*/
/**
* Mixins that style buttons to appear as lozenges with an integrated arrow
* pointing left, up or down (right doesn't exist yet but could easily be added).
* These indicators are used, e.g., in the bucket bar.
*
* These button or button-like elements consist of styles applied to the
* element itself, which create a rounded-rectangle lozenge with small-sized
* label text, as well as composited ::before and ::after pseudo-elements to
* create an arrow-pointer effect.
*
* The arrow-points are created by the combination of borders and positioning.
* See https://css-tricks.com/snippets/css/css-triangle/ for a few examples
*
*/
.Buckets__list {
background: #ececec;
pointer-events: none;
position: absolute;
height: 100%;
width: 23px;
left: -22px;
}

.annotator-collapsed .Buckets__list {
background: rgba(0, 0, 0, 0.08);
}

.Buckets__bucket {
position: absolute;
right: 0;
}

.Buckets__button {
pointer-events: all;
}

.Buckets__button--left {
margin-top: -8px;
padding: 0;
margin: 0;
background-color: transparent;
border-style: none;
border: 1px solid #dbdbdb;
position: absolute;
right: 0;
background-color: #fff;
width: 26px;
height: 16px;
text-align: center;
color: #737373;
font-weight: bold;
font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
font-size: 10px;
line-height: 1;
border-radius: 2px 4px 4px 2px;
}
.Buckets__button--left:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Buckets__button--left:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Buckets__button--left:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Buckets__button--left::before, .Buckets__button--left::after {
content: "";
position: absolute;
border: inset transparent;
right: 100%;
top: 50%;
}
.Buckets__button--left::before {
border-width: 8px;
border-right: 5px solid #dbdbdb;
margin-top: -8px;
}
.Buckets__button--left::after {
border-width: 7px;
border-right: 4px solid #fff;
margin-top: -7px;
}

.Buckets__button--up {
padding: 0;
margin: 0;
background-color: transparent;
border-style: none;
border: 1px solid #dbdbdb;
position: absolute;
right: 0;
background-color: #fff;
width: 26px;
height: 16px;
text-align: center;
color: #737373;
font-weight: bold;
font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
font-size: 10px;
line-height: 1;
box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
z-index: 1;
border-radius: 2px 2px 4px 4px;
margin-top: -11px;
}
.Buckets__button--up:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Buckets__button--up:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Buckets__button--up:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Buckets__button--up::before, .Buckets__button--up::after {
content: "";
position: absolute;
border: inset transparent;
left: 50%;
top: auto;
bottom: 100%;
}
.Buckets__button--up::before {
border-width: 13px;
border-bottom: 6px solid #dbdbdb;
margin-left: -13px;
}
.Buckets__button--up::after {
border-width: 12px;
border-bottom: 5px solid #fff;
margin-left: -12px;
}

.Buckets__button--down {
padding: 0;
margin: 0;
background-color: transparent;
border-style: none;
border: 1px solid #dbdbdb;
position: absolute;
right: 0;
background-color: #fff;
width: 26px;
height: 16px;
text-align: center;
color: #737373;
font-weight: bold;
font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
font-size: 10px;
line-height: 1;
box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
z-index: 1;
margin-top: 0;
border-radius: 4px 4px 2px 2px;
}
.Buckets__button--down:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Buckets__button--down:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Buckets__button--down:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Buckets__button--down::before, .Buckets__button--down::after {
content: "";
position: absolute;
border: inset transparent;
left: 50%;
top: 100%;
}
.Buckets__button--down::before {
border-width: 13px;
border-top: 6px solid #dbdbdb;
margin-left: -13px;
}
.Buckets__button--down::after {
border-width: 12px;
border-top: 5px solid #fff;
margin-left: -12px;
}

/**
* A straightforward "frame" that serves as a basis for other card-like
* patterns. May be used on its own for components that don't need all of
* card or panel's bells and whistles.
*/
/**
* A "card"-like pattern that may be displayed in vertical lists, a la
* annotation (thread) cards. Will vertically-space its children. Adds a
* hover/active intensified box shadow and accounts for "theme-clean" affordances.
*/
/**
* horizontally-oriented collection of linked icons
*/
/**
* A pattern for styling a little "pointer" (arrow) icon that attaches to
* menu content and serves as a visual anchor back to the triggering
* button/element. When using, you'll need to provide the appropriate
* positioning details to get the pointer to be where you want it in the
* given menu.
*
* @param {string} [$direction] - Which direction the arrow should "point"
*/
/**
* Base styles for a "panel"-like element, with appropriate
* padding, heading and close-button styles.
*
* @param {length} [$rhythm] - An optional value to use for vertical rhythm
*   (spacing, vertically)
*/
/**
* panel with tighter margins and padding, for use in more confined spaces
*/
/**
* A full-width banner with optional "type" and styled icon at left
*/
/**
* A variant of banner for use as a toast message container. Narrower,
* lighter border, more padding around message text.
*/
.NotebookModal__outer {
box-sizing: border-box;
position: fixed;
z-index: 2147483647;
top: 0;
left: 0;
right: 0;
bottom: 0;
padding: 1em;
background-color: rgba(0, 0, 0, 0.5);
}
.NotebookModal__outer.is-hidden {
display: none;
}
.NotebookModal__inner {
position: relative;
box-sizing: border-box;
border: 1px solid #dbdbdb;
box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
border-radius: 2px;
background-color: #fff;
padding: 0;
width: 100%;
height: 100%;
border: 0;
}
.NotebookModal__close-button-container {
position: absolute;
right: 0;
font-size: 18px;
margin: 1em;
}
.NotebookModal__close-button-container > button {
cursor: pointer;
}

.NotebookIframe {
width: 100%;
height: 100%;
border: none;
}

.Toolbar {
position: absolute;
left: -33px;
width: 33px;
z-index: 2;
}
@media (pointer: coarse) {
.Toolbar {
  left: -32px;
  width: 32px;
}
}

.Toolbar__buttonbar {
margin-top: 0.75em;
}
.Toolbar__buttonbar > * + *:not([class*=SvgIcon--inline]) {
margin-top: 5px !important;
}

.Toolbar__button {
padding: 0;
margin: 0;
background-color: transparent;
border-style: none;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 0.5em;
border: none;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
color: #737373;
background: #fff;
box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
border: 1px solid #dbdbdb;
border-radius: 4px;
}
.Toolbar__button:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Toolbar__button:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Toolbar__button:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Toolbar__button svg {
width: 16px;
height: 16px;
}
.Toolbar__button:hover:not([disabled]), .Toolbar__button:focus:not([disabled]) {
color: #202020;
}
@media (pointer: coarse) {
.Toolbar__button {
  min-width: 44px;
  min-height: 44px;
}
.Toolbar__button {
  min-width: 32px;
  min-height: 32px;
}
}

.Toolbar__sidebar-toggle {
padding: 0;
margin: 0;
background-color: transparent;
border-style: none;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 0.5em;
border-radius: 2px;
border: none;
transition: color 0.2s ease-out, background-color 0.2s ease-out, opacity 0.2s ease-out;
color: #737373;
background: #fff;
border-left: 1px solid #dbdbdb;
border-bottom: 1px solid #dbdbdb;
padding-left: 2px;
width: 33px;
height: 40px;
color: #9c9c9c;
}
.Toolbar__sidebar-toggle:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Toolbar__sidebar-toggle:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Toolbar__sidebar-toggle:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Toolbar__sidebar-toggle svg {
width: 16px;
height: 16px;
}
.Toolbar__sidebar-toggle:hover:not([disabled]), .Toolbar__sidebar-toggle:focus:not([disabled]) {
color: #202020;
}
@media (pointer: coarse) {
.Toolbar__sidebar-toggle {
  min-width: 44px;
  min-height: 44px;
}
.Toolbar__sidebar-toggle {
  min-width: 32px;
  min-height: 32px;
}
}

/** Visible with clean theme */
.Toolbar__sidebar-close {
padding: 0;
margin: 0;
background-color: transparent;
border-style: none;
border: 1px solid #dbdbdb;
border-right-width: 0;
background: #fff;
box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.5);
color: #737373;
padding: 1px 6px;
width: 27px;
height: 27px;
margin-top: 140px;
margin-left: 6px;
}
.Toolbar__sidebar-close:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .Toolbar__sidebar-close:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.Toolbar__sidebar-close:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}
.Toolbar__sidebar-close:hover:not([disabled]), .Toolbar__sidebar-close:focus:not([disabled]) {
color: #202020;
}

.WarningBanner {
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
width: 100%;
background-color: #fff;
border-style: solid;
border-width: 2px 0;
font-size: 12px;
}
.WarningBanner--success {
border-color: #00a36d;
}
.WarningBanner--error {
border-color: #d93c3f;
}
.WarningBanner--notice {
border-color: #fbc168;
}
.WarningBanner__type {
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
padding: 0.75em 1em;
color: white;
}
.WarningBanner--success .WarningBanner__type {
background-color: #00a36d;
}
.WarningBanner--error .WarningBanner__type {
background-color: #d93c3f;
}
.WarningBanner--notice .WarningBanner__type {
background-color: #fbc168;
}
.WarningBanner__message {
padding: 0.75em;
width: 100%;
}

.hyp-u-screen-reader-only {
position: absolute;
width: 1px;
height: 1px;
white-space: nowrap;
clip: rect(0 0 0 0);
overflow: hidden;
}

.hyp-u-border {
border: 1px solid #dbdbdb;
}

.hyp-u-border--left {
border-left: 1px solid #dbdbdb;
}

.hyp-u-border--right {
border-right: 1px solid #dbdbdb;
}

.hyp-u-border--top {
border-top: 1px solid #dbdbdb;
}

.hyp-u-border--bottom {
border-bottom: 1px solid #dbdbdb;
}

.hyp-u-shadow {
/* offset-x | offset-y | blur-radius | color */
box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
}

.hyp-u-shadow--active {
/* offset-x | offset-y | blur-radius | spread-radius | color */
box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.15);
}

.hyp-u-color--white {
color: white;
}

.hyp-u-color--grey-0 {
color: #fafafa;
}

.hyp-u-color--grey-1 {
color: #f2f2f2;
}

.hyp-u-color--grey-2 {
color: #ececec;
}

.hyp-u-color--grey-3 {
color: #dbdbdb;
}

.hyp-u-color--grey-4 {
color: #a6a6a6;
}

.hyp-u-color--grey-5 {
color: #9c9c9c;
}

.hyp-u-color--grey-6 {
color: #737373;
}

.hyp-u-color--grey-7 {
color: #595959;
}

.hyp-u-color--grey-8 {
color: #3f3f3f;
}

.hyp-u-color--grey-9 {
color: #202020;
}

.hyp-u-color--brand {
color: #bd1c2b;
}

.hyp-u-color--selection {
color: #59a7e8;
}

.hyp-u-color--error {
color: #d93c3f;
}

.hyp-u-color--notice {
color: #fbc168;
}

.hyp-u-color--success {
color: #00a36d;
}

.hyp-u-bg-color--white {
background-color: white;
}

.hyp-u-bg-color--grey-0 {
background-color: #fafafa;
}

.hyp-u-bg-color--grey-1 {
background-color: #f2f2f2;
}

.hyp-u-bg-color--grey-2 {
background-color: #ececec;
}

.hyp-u-bg-color--grey-3 {
background-color: #dbdbdb;
}

.hyp-u-bg-color--grey-4 {
background-color: #a6a6a6;
}

.hyp-u-bg-color--grey-5 {
background-color: #9c9c9c;
}

.hyp-u-bg-color--grey-6 {
background-color: #737373;
}

.hyp-u-bg-color--grey-7 {
background-color: #595959;
}

.hyp-u-bg-color--grey-8 {
background-color: #3f3f3f;
}

.hyp-u-bg-color--grey-9 {
background-color: #202020;
}

.hyp-u-bg-color--brand {
background-color: #bd1c2b;
}

.hyp-u-bg-color--selection {
background-color: #59a7e8;
}

.hyp-u-bg-color--error {
background-color: #d93c3f;
}

.hyp-u-bg-color--notice {
background-color: #fbc168;
}

.hyp-u-bg-color--success {
background-color: #00a36d;
}

.hyp-u-focus-outline:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}

.hyp-u-focus-outline--inset:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8 inset;
}

.hyp-u-focus-outline--hide {
outline: none;
box-shadow: none;
}

.hyp-u-outline-on-keyboard-focus:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8;
}
.js-focus-visible .hyp-u-outline-on-keyboard-focus:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.hyp-u-outline-on-keyboard-focus:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}

.hyp-u-outline-on-keyboard-focus--inset:focus {
outline: none;
box-shadow: 0 0 0 2px #59a7e8 inset;
}
.js-focus-visible .hyp-u-outline-on-keyboard-focus--inset:focus:not(.focus-visible) {
outline: none;
box-shadow: none;
}
.hyp-u-outline-on-keyboard-focus--inset:focus:not(:focus-visible) {
outline: none;
box-shadow: none;
}

/* Spacing classes */
.hyp-u-horizontal-spacing > :not(:first-child) {
margin-left: 0.5rem;
}
.hyp-u-horizontal-spacing > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing > :last-child {
margin-right: 0;
}

.hyp-u-vertical-spacing > :not(:first-child) {
margin-top: 1rem;
}
.hyp-u-vertical-spacing > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing > :last-child {
margin-bottom: 0;
}

.hyp-u-horizontal-spacing--0 > :not(:first-child) {
margin-left: 0;
}
.hyp-u-horizontal-spacing--0 > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing--0 > :last-child {
margin-right: 0;
}

.hyp-u-horizontal-spacing--1 > :not(:first-child) {
margin-left: 0.125rem;
}
.hyp-u-horizontal-spacing--1 > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing--1 > :last-child {
margin-right: 0;
}

.hyp-u-horizontal-spacing--2 > :not(:first-child) {
margin-left: 0.25rem;
}
.hyp-u-horizontal-spacing--2 > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing--2 > :last-child {
margin-right: 0;
}

.hyp-u-horizontal-spacing--3 > :not(:first-child) {
margin-left: 0.5rem;
}
.hyp-u-horizontal-spacing--3 > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing--3 > :last-child {
margin-right: 0;
}

.hyp-u-horizontal-spacing--4 > :not(:first-child) {
margin-left: 0.75rem;
}
.hyp-u-horizontal-spacing--4 > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing--4 > :last-child {
margin-right: 0;
}

.hyp-u-horizontal-spacing--5 > :not(:first-child) {
margin-left: 1rem;
}
.hyp-u-horizontal-spacing--5 > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing--5 > :last-child {
margin-right: 0;
}

.hyp-u-horizontal-spacing--6 > :not(:first-child) {
margin-left: 1.5rem;
}
.hyp-u-horizontal-spacing--6 > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing--6 > :last-child {
margin-right: 0;
}

.hyp-u-horizontal-spacing--7 > :not(:first-child) {
margin-left: 2rem;
}
.hyp-u-horizontal-spacing--7 > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing--7 > :last-child {
margin-right: 0;
}

.hyp-u-horizontal-spacing--8 > :not(:first-child) {
margin-left: 4rem;
}
.hyp-u-horizontal-spacing--8 > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing--8 > :last-child {
margin-right: 0;
}

.hyp-u-horizontal-spacing--9 > :not(:first-child) {
margin-left: 8rem;
}
.hyp-u-horizontal-spacing--9 > :first-child {
margin-left: 0;
}
.hyp-u-horizontal-spacing--9 > :last-child {
margin-right: 0;
}

.hyp-u-vertical-spacing--0 > :not(:first-child) {
margin-top: 0;
}
.hyp-u-vertical-spacing--0 > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing--0 > :last-child {
margin-bottom: 0;
}

.hyp-u-vertical-spacing--1 > :not(:first-child) {
margin-top: 0.125rem;
}
.hyp-u-vertical-spacing--1 > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing--1 > :last-child {
margin-bottom: 0;
}

.hyp-u-vertical-spacing--2 > :not(:first-child) {
margin-top: 0.25rem;
}
.hyp-u-vertical-spacing--2 > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing--2 > :last-child {
margin-bottom: 0;
}

.hyp-u-vertical-spacing--3 > :not(:first-child) {
margin-top: 0.5rem;
}
.hyp-u-vertical-spacing--3 > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing--3 > :last-child {
margin-bottom: 0;
}

.hyp-u-vertical-spacing--4 > :not(:first-child) {
margin-top: 0.75rem;
}
.hyp-u-vertical-spacing--4 > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing--4 > :last-child {
margin-bottom: 0;
}

.hyp-u-vertical-spacing--5 > :not(:first-child) {
margin-top: 1rem;
}
.hyp-u-vertical-spacing--5 > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing--5 > :last-child {
margin-bottom: 0;
}

.hyp-u-vertical-spacing--6 > :not(:first-child) {
margin-top: 1.5rem;
}
.hyp-u-vertical-spacing--6 > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing--6 > :last-child {
margin-bottom: 0;
}

.hyp-u-vertical-spacing--7 > :not(:first-child) {
margin-top: 2rem;
}
.hyp-u-vertical-spacing--7 > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing--7 > :last-child {
margin-bottom: 0;
}

.hyp-u-vertical-spacing--8 > :not(:first-child) {
margin-top: 4rem;
}
.hyp-u-vertical-spacing--8 > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing--8 > :last-child {
margin-bottom: 0;
}

.hyp-u-vertical-spacing--9 > :not(:first-child) {
margin-top: 8rem;
}
.hyp-u-vertical-spacing--9 > :first-child {
margin-top: 0;
}
.hyp-u-vertical-spacing--9 > :last-child {
margin-bottom: 0;
}

/* Margin and padding classes */
.hyp-u-margin {
margin: 1rem;
}

.hyp-u-margin--left {
margin-left: 1rem;
}

.hyp-u-margin--right {
margin-right: 1rem;
}

.hyp-u-margin--top {
margin-top: 1rem;
}

.hyp-u-margin--bottom {
margin-bottom: 1rem;
}

.hyp-u-margin--0 {
margin: 0;
}

.hyp-u-margin--left--0 {
margin-left: 0;
}

.hyp-u-margin--right--0 {
margin-right: 0;
}

.hyp-u-margin--top--0 {
margin-top: 0;
}

.hyp-u-margin--bottom--0 {
margin-bottom: 0;
}

.hyp-u-margin--1 {
margin: 0.125rem;
}

.hyp-u-margin--left--1 {
margin-left: 0.125rem;
}

.hyp-u-margin--right--1 {
margin-right: 0.125rem;
}

.hyp-u-margin--top--1 {
margin-top: 0.125rem;
}

.hyp-u-margin--bottom--1 {
margin-bottom: 0.125rem;
}

.hyp-u-margin--2 {
margin: 0.25rem;
}

.hyp-u-margin--left--2 {
margin-left: 0.25rem;
}

.hyp-u-margin--right--2 {
margin-right: 0.25rem;
}

.hyp-u-margin--top--2 {
margin-top: 0.25rem;
}

.hyp-u-margin--bottom--2 {
margin-bottom: 0.25rem;
}

.hyp-u-margin--3 {
margin: 0.5rem;
}

.hyp-u-margin--left--3 {
margin-left: 0.5rem;
}

.hyp-u-margin--right--3 {
margin-right: 0.5rem;
}

.hyp-u-margin--top--3 {
margin-top: 0.5rem;
}

.hyp-u-margin--bottom--3 {
margin-bottom: 0.5rem;
}

.hyp-u-margin--4 {
margin: 0.75rem;
}

.hyp-u-margin--left--4 {
margin-left: 0.75rem;
}

.hyp-u-margin--right--4 {
margin-right: 0.75rem;
}

.hyp-u-margin--top--4 {
margin-top: 0.75rem;
}

.hyp-u-margin--bottom--4 {
margin-bottom: 0.75rem;
}

.hyp-u-margin--5 {
margin: 1rem;
}

.hyp-u-margin--left--5 {
margin-left: 1rem;
}

.hyp-u-margin--right--5 {
margin-right: 1rem;
}

.hyp-u-margin--top--5 {
margin-top: 1rem;
}

.hyp-u-margin--bottom--5 {
margin-bottom: 1rem;
}

.hyp-u-margin--6 {
margin: 1.5rem;
}

.hyp-u-margin--left--6 {
margin-left: 1.5rem;
}

.hyp-u-margin--right--6 {
margin-right: 1.5rem;
}

.hyp-u-margin--top--6 {
margin-top: 1.5rem;
}

.hyp-u-margin--bottom--6 {
margin-bottom: 1.5rem;
}

.hyp-u-margin--7 {
margin: 2rem;
}

.hyp-u-margin--left--7 {
margin-left: 2rem;
}

.hyp-u-margin--right--7 {
margin-right: 2rem;
}

.hyp-u-margin--top--7 {
margin-top: 2rem;
}

.hyp-u-margin--bottom--7 {
margin-bottom: 2rem;
}

.hyp-u-margin--8 {
margin: 4rem;
}

.hyp-u-margin--left--8 {
margin-left: 4rem;
}

.hyp-u-margin--right--8 {
margin-right: 4rem;
}

.hyp-u-margin--top--8 {
margin-top: 4rem;
}

.hyp-u-margin--bottom--8 {
margin-bottom: 4rem;
}

.hyp-u-margin--9 {
margin: 8rem;
}

.hyp-u-margin--left--9 {
margin-left: 8rem;
}

.hyp-u-margin--right--9 {
margin-right: 8rem;
}

.hyp-u-margin--top--9 {
margin-top: 8rem;
}

.hyp-u-margin--bottom--9 {
margin-bottom: 8rem;
}

.hyp-u-padding {
padding: 0.5rem;
}

.hyp-u-padding--left {
padding-left: 0.5rem;
}

.hyp-u-padding--right {
padding-right: 0.5rem;
}

.hyp-u-padding--top {
padding-top: 0.5rem;
}

.hyp-u-padding--bottom {
padding-bottom: 0.5rem;
}

.hyp-u-padding--0 {
padding: 0;
}

.hyp-u-padding--left--0 {
padding-left: 0;
}

.hyp-u-padding--right--0 {
padding-right: 0;
}

.hyp-u-padding--top--0 {
padding-top: 0;
}

.hyp-u-padding--bottom--0 {
padding-bottom: 0;
}

.hyp-u-padding--1 {
padding: 0.125rem;
}

.hyp-u-padding--left--1 {
padding-left: 0.125rem;
}

.hyp-u-padding--right--1 {
padding-right: 0.125rem;
}

.hyp-u-padding--top--1 {
padding-top: 0.125rem;
}

.hyp-u-padding--bottom--1 {
padding-bottom: 0.125rem;
}

.hyp-u-padding--2 {
padding: 0.25rem;
}

.hyp-u-padding--left--2 {
padding-left: 0.25rem;
}

.hyp-u-padding--right--2 {
padding-right: 0.25rem;
}

.hyp-u-padding--top--2 {
padding-top: 0.25rem;
}

.hyp-u-padding--bottom--2 {
padding-bottom: 0.25rem;
}

.hyp-u-padding--3 {
padding: 0.5rem;
}

.hyp-u-padding--left--3 {
padding-left: 0.5rem;
}

.hyp-u-padding--right--3 {
padding-right: 0.5rem;
}

.hyp-u-padding--top--3 {
padding-top: 0.5rem;
}

.hyp-u-padding--bottom--3 {
padding-bottom: 0.5rem;
}

.hyp-u-padding--4 {
padding: 0.75rem;
}

.hyp-u-padding--left--4 {
padding-left: 0.75rem;
}

.hyp-u-padding--right--4 {
padding-right: 0.75rem;
}

.hyp-u-padding--top--4 {
padding-top: 0.75rem;
}

.hyp-u-padding--bottom--4 {
padding-bottom: 0.75rem;
}

.hyp-u-padding--5 {
padding: 1rem;
}

.hyp-u-padding--left--5 {
padding-left: 1rem;
}

.hyp-u-padding--right--5 {
padding-right: 1rem;
}

.hyp-u-padding--top--5 {
padding-top: 1rem;
}

.hyp-u-padding--bottom--5 {
padding-bottom: 1rem;
}

.hyp-u-padding--6 {
padding: 1.5rem;
}

.hyp-u-padding--left--6 {
padding-left: 1.5rem;
}

.hyp-u-padding--right--6 {
padding-right: 1.5rem;
}

.hyp-u-padding--top--6 {
padding-top: 1.5rem;
}

.hyp-u-padding--bottom--6 {
padding-bottom: 1.5rem;
}

.hyp-u-padding--7 {
padding: 2rem;
}

.hyp-u-padding--left--7 {
padding-left: 2rem;
}

.hyp-u-padding--right--7 {
padding-right: 2rem;
}

.hyp-u-padding--top--7 {
padding-top: 2rem;
}

.hyp-u-padding--bottom--7 {
padding-bottom: 2rem;
}

.hyp-u-padding--8 {
padding: 4rem;
}

.hyp-u-padding--left--8 {
padding-left: 4rem;
}

.hyp-u-padding--right--8 {
padding-right: 4rem;
}

.hyp-u-padding--top--8 {
padding-top: 4rem;
}

.hyp-u-padding--bottom--8 {
padding-bottom: 4rem;
}

.hyp-u-padding--9 {
padding: 8rem;
}

.hyp-u-padding--left--9 {
padding-left: 8rem;
}

.hyp-u-padding--right--9 {
padding-right: 8rem;
}

.hyp-u-padding--top--9 {
padding-top: 8rem;
}

.hyp-u-padding--bottom--9 {
padding-bottom: 8rem;
}

/* Flex-layout classes */
.hyp-u-layout-row {
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: stretch;
}

.hyp-u-layout-row--center {
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
}

.hyp-u-layout-row--align-baseline {
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: baseline;
}

.hyp-u-layout-row--align-center {
display: flex;
flex-direction: row;
justify-content: flex-start;
align-items: center;
}

.hyp-u-layout-row--justify-center {
display: flex;
flex-direction: row;
justify-content: center;
align-items: stretch;
}

.hyp-u-layout-row--justify-right {
display: flex;
flex-direction: row;
justify-content: flex-end;
align-items: stretch;
}

.hyp-u-layout-column {
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: stretch;
}

.hyp-u-layout-column--center {
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
}

.hyp-u-stretch {
flex-grow: 1;
}

/* Positioning and overlay classes */
.hyp-u-fixed-centered {
z-index: 20;
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.hyp-u-absolute-centered {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
}

.hyp-u-overlay {
z-index: 10;
position: fixed;
top: 0;
left: 0;
bottom: 0;
right: 0;
background-color: rgba(0, 0, 0, 0.5);
}

.sr-only{
position: absolute;
width: 1px;
height: 1px;
padding: 0;
margin: -1px;
overflow: hidden;
clip: rect(0, 0, 0, 0);
white-space: nowrap;
border-width: 0;
}

.visible{
visibility: visible;
}

.\!visible{
visibility: visible !important;
}

.static{
position: static;
}

.fixed{
position: fixed;
}

.absolute{
position: absolute;
}

.relative{
position: relative;
}

.sticky{
position: -webkit-sticky;
position: sticky;
}

.m-0\.5{
margin: 0.125rem;
}

.m-0{
margin: 0px;
}

.mx-1{
margin-left: 0.25rem;
margin-right: 0.25rem;
}

.ml-1{
margin-left: 0.25rem;
}

.mb-2{
margin-bottom: 0.5rem;
}

.-mt-3{
margin-top: -0.75rem;
}

.-ml-3{
margin-left: -0.75rem;
}

.-mr-3{
margin-right: -0.75rem;
}

.-mt-0\.5{
margin-top: -0.125rem;
}

.-mt-0{
margin-top: -0px;
}

.mb-4{
margin-bottom: 1rem;
}

.-mt-1{
margin-top: -0.25rem;
}

.-mb-px{
margin-bottom: -1px;
}

.mr-4{
margin-right: 1rem;
}

.block{
display: block;
}

.inline{
display: inline;
}

.flex{
display: flex;
}

.table{
display: table;
}

.grid{
display: grid;
}

.contents{
display: contents;
}

.hidden{
display: none;
}

.h-3{
height: 0.75rem;
}

.h-16{
height: 4rem;
}

.h-full{
height: 100%;
}

.h-screen{
height: 100vh;
}

.h-8{
height: 2rem;
}

.w-3{
width: 0.75rem;
}

.w-16{
width: 4rem;
}

.w-full{
width: 100%;
}

.w-screen{
width: 100vw;
}

.w-64{
width: 16rem;
}

.w-\[450px\]{
width: 450px;
}

.max-w-6xl{
max-width: 72rem;
}

.flex-1{
flex: 1 1 0%;
}

.grow{
flex-grow: 1;
}

.resize{
resize: both;
}

.list-decimal{
list-style-type: decimal;
}

.grid-cols-2{
grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-\[20rem_1fr\]{
grid-template-columns: 20rem 1fr;
}

.grid-cols-8{
grid-template-columns: repeat(8, minmax(0, 1fr));
}

.flex-row{
flex-direction: row;
}

.flex-col{
flex-direction: column;
}

.flex-wrap{
flex-wrap: wrap;
}

.flex-wrap-reverse{
flex-wrap: wrap-reverse;
}

.items-center{
align-items: center;
}

.justify-center{
justify-content: center;
}

.gap-4{
gap: 1rem;
}

.gap-16{
gap: 4rem;
}

.gap-2{
gap: 0.5rem;
}

.gap-6{
gap: 1.5rem;
}

.gap-x-3{
column-gap: 0.75rem;
}

.gap-x-4{
column-gap: 1rem;
}

.space-x-2 > :not([hidden]) ~ :not([hidden]){
--tw-space-x-reverse: 0;
margin-right: calc(0.5rem * var(--tw-space-x-reverse));
margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}

.space-y-4 > :not([hidden]) ~ :not([hidden]){
--tw-space-y-reverse: 0;
margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}

.space-y-3 > :not([hidden]) ~ :not([hidden]){
--tw-space-y-reverse: 0;
margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
}

.space-y-2 > :not([hidden]) ~ :not([hidden]){
--tw-space-y-reverse: 0;
margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}

.self-center{
align-self: center;
}

.truncate{
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}

.whitespace-nowrap{
white-space: nowrap;
}

.whitespace-pre-wrap{
white-space: pre-wrap;
}

.break-words{
overflow-wrap: break-word;
}

.rounded{
border-radius: 0.25rem;
}

.rounded-lg{
border-radius: 0.5rem;
}

.border-y{
border-top-width: 1px;
border-bottom-width: 1px;
}

.border-r{
border-right-width: 1px;
}

.border-t{
border-top-width: 1px;
}

.border-grey-2{
--tw-border-opacity: 1;
border-color: rgb(236 236 236 / var(--tw-border-opacity));
}

.border-\[\#9c9cab\]{
--tw-border-opacity: 1;
border-color: rgb(156 156 171 / var(--tw-border-opacity));
}

.bg-grey-1{
--tw-bg-opacity: 1;
background-color: rgb(242 242 242 / var(--tw-bg-opacity));
}

.bg-red-error{
--tw-bg-opacity: 1;
background-color: rgb(217 60 63 / var(--tw-bg-opacity));
}

.bg-grey-6{
--tw-bg-opacity: 1;
background-color: rgb(115 115 115 / var(--tw-bg-opacity));
}

.bg-slate-1{
--tw-bg-opacity: 1;
background-color: rgb(227 227 229 / var(--tw-bg-opacity));
}

.bg-color-text{
--tw-bg-opacity: 1;
background-color: rgb(32 32 32 / var(--tw-bg-opacity));
}

.bg-grey-2{
--tw-bg-opacity: 1;
background-color: rgb(236 236 236 / var(--tw-bg-opacity));
}

.bg-grey-3{
--tw-bg-opacity: 1;
background-color: rgb(219 219 219 / var(--tw-bg-opacity));
}

.bg-brand{
--tw-bg-opacity: 1;
background-color: rgb(189 28 43 / var(--tw-bg-opacity));
}

.bg-brand-dark{
--tw-bg-opacity: 1;
background-color: rgb(132 20 30 / var(--tw-bg-opacity));
}

.bg-white{
--tw-bg-opacity: 1;
background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}

.bg-grey-0{
--tw-bg-opacity: 1;
background-color: rgb(250 250 250 / var(--tw-bg-opacity));
}

.bg-grey-4{
--tw-bg-opacity: 1;
background-color: rgb(166 166 166 / var(--tw-bg-opacity));
}

.bg-grey-5{
--tw-bg-opacity: 1;
background-color: rgb(156 156 156 / var(--tw-bg-opacity));
}

.bg-grey-7{
--tw-bg-opacity: 1;
background-color: rgb(89 89 89 / var(--tw-bg-opacity));
}

.bg-grey-8{
--tw-bg-opacity: 1;
background-color: rgb(63 63 63 / var(--tw-bg-opacity));
}

.bg-grey-9{
--tw-bg-opacity: 1;
background-color: rgb(32 32 32 / var(--tw-bg-opacity));
}

.bg-black{
--tw-bg-opacity: 1;
background-color: rgb(0 0 0 / var(--tw-bg-opacity));
}

.bg-green-success{
--tw-bg-opacity: 1;
background-color: rgb(0 163 109 / var(--tw-bg-opacity));
}

.bg-yellow-notice{
--tw-bg-opacity: 1;
background-color: rgb(251 193 104 / var(--tw-bg-opacity));
}

.p-3{
padding: 0.75rem;
}

.p-4{
padding: 1rem;
}

.p-2{
padding: 0.5rem;
}

.p-5{
padding: 1.25rem;
}

.py-4{
padding-top: 1rem;
padding-bottom: 1rem;
}

.py-1{
padding-top: 0.25rem;
padding-bottom: 0.25rem;
}

.py-3{
padding-top: 0.75rem;
padding-bottom: 0.75rem;
}

.px-4{
padding-left: 1rem;
padding-right: 1rem;
}

.py-2{
padding-top: 0.5rem;
padding-bottom: 0.5rem;
}

.pr-2{
padding-right: 0.5rem;
}

.pl-10{
padding-left: 2.5rem;
}

.pl-6{
padding-left: 1.5rem;
}

.pt-0{
padding-top: 0px;
}

.text-center{
text-align: center;
}

.text-xl{
font-size: 16px;
}

.text-lg{
font-size: 14px;
}

.text-tiny{
font-size: 10px;
}

.text-sm{
font-size: 11px;
line-height: 1.4;
}

.font-medium{
font-weight: 500;
}

.font-normal{
font-weight: 400;
}

.font-semibold{
font-weight: 600;
}

.font-bold{
font-weight: 700;
}

.italic{
font-style: italic;
}

.leading-none{
line-height: 1;
}

.text-brand{
--tw-text-opacity: 1;
color: rgb(189 28 43 / var(--tw-text-opacity));
}

.text-color-text-light{
--tw-text-opacity: 1;
color: rgb(115 115 115 / var(--tw-text-opacity));
}

.text-color-text{
--tw-text-opacity: 1;
color: rgb(32 32 32 / var(--tw-text-opacity));
}

.text-white{
--tw-text-opacity: 1;
color: rgb(255 255 255 / var(--tw-text-opacity));
}

.text-grey-6{
--tw-text-opacity: 1;
color: rgb(115 115 115 / var(--tw-text-opacity));
}

.underline{
-webkit-text-decoration-line: underline;
        text-decoration-line: underline;
}

.shadow{
--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.outline{
outline-style: solid;
}

.ring{
--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.blur{
--tw-blur: blur(8px);
filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.filter{
filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.transition{
transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;
transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
transition-duration: 150ms;
}

.ease-in{
transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}
:host > * {
font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
}

.annotator-frame {
position: fixed;
top: 0;
left: 100%;
height: 100%;
z-index: 2147483647;
direction: ltr;
font-size: 12px;
line-height: 20px;
-webkit-user-select: none;
        user-select: none;
-webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
.annotator-frame.is-hidden {
visibility: hidden;
transition: visibility 150ms;
}
.annotator-frame.annotator-collapsed {
margin-left: 0;
}
.annotator-frame.annotator-collapsed .h-sidebar-iframe {
transition: visibility 150ms;
visibility: hidden;
}
.annotator-frame .h-sidebar-iframe {
border: none;
height: 100%;
width: 100%;
z-index: 3;
position: relative;
}

.annotator-no-transition {
transition: none !important;
}

/** Affordances for clean theme */
.annotator-frame--theme-clean {
box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.5);
}

/*
Mobile layout
240-479 px
*/
@media screen and (min-width: 15em) {
.annotator-frame {
  width: 90%;
  margin-left: -90%;
}
}
/*
Wide mobile layout
480-599 px
*/
@media screen and (min-width: 30em) {
.annotator-frame {
  width: 70%;
  margin-left: -70%;
}
}
/*
Tablet layout
600-above px
*/
@media screen and (min-width: 37.5em) {
.annotator-frame {
  transition: margin-left 150ms cubic-bezier(0.55, 0, 0.2, 0.8);
  width: 428px;
  margin-left: -428px;
}
}

.last-of-type\:border-r-0:last-of-type{
border-right-width: 0px;
}

.hover\:bg-grey-3:hover{
--tw-bg-opacity: 1;
background-color: rgb(219 219 219 / var(--tw-bg-opacity));
}

.hover\:underline:hover{
-webkit-text-decoration-line: underline;
        text-decoration-line: underline;
}

.theme-clean .theme-clean\:bg-white{
--tw-bg-opacity: 1;
background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}
/*# sourceMappingURL=annotator.css.map */
`
/**
 * Load stylesheets for annotator UI components into the shadow DOM root.
 */
 export function loadStyles(shadowRoot, fileName = 'annotator') {
    // Find the preloaded stylesheet added by the boot script.
    const url = /** @type {HTMLLinkElement|undefined} */ (
      document.querySelector(
        `link[rel="preload"][href*="/static/css/${fileName}.css"]`
      )
    )?.href;
  
    if (!url) {
      return;
    }
  
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = url;
    console.log('before linkEl: ', linkEl, 'url: ', url);
    shadowRoot.appendChild(linkEl);
    console.log('after shadow root: ', shadowRoot.children);
}

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
  element.addEventListener('mouseup', event => event.stopPropagation());
  element.addEventListener('mousedown', event => event.stopPropagation());
  element.addEventListener('touchstart', event => event.stopPropagation(), {
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
 export function createShadowRoot(container) {
  const shadowRoot = container.attachShadow({ mode: 'open' });
  loadStyles(shadowRoot);

  // @ts-ignore The window doesn't know about the polyfill
  // applyFocusVisiblePolyfill comes from the focus-visible package.
  const applyFocusVisible = window.applyFocusVisiblePolyfill;
  if (applyFocusVisible) {
    applyFocusVisible(shadowRoot);
  }

  console.log('SR 2: ', shadowRoot.children);
  stopEventPropagation(shadowRoot);
  return shadowRoot;
}


/**
 *  @typedef {1} ArrowPointingDown
 * Show the adder above the selection with an arrow pointing down at the
 * selected text.
 */
export const ARROW_POINTING_DOWN = 1;

/**
 *  @typedef {2} ArrowPointingUp
 * Show the adder above the selection with an arrow pointing up at the
 * selected text.
 */
export const ARROW_POINTING_UP = 2;

/**
 *  @typedef {ArrowPointingDown|ArrowPointingUp} ArrowDirection
 * Show the adder above the selection with an arrow pointing up at the
 * selected text.
 */

/**
 * @typedef Target
 * @prop {number} left - Offset from left edge of viewport.
 * @prop {number} top - Offset from top edge of viewport.
 * @prop {ArrowDirection} arrowDirection - Direction of the adder's arrow.
 */

function toPx(pixels) {
  return pixels.toString() + 'px';
}

const ARROW_HEIGHT = 10;

// The preferred gap between the end of the text selection and the adder's
// arrow position.
const ARROW_H_MARGIN = 20;

/**
 * Return the closest ancestor of el which has been positioned.
 *
 * If no ancestor has been positioned, returns the root element.
 *
 * @param {Element} el
 * @return {Element}
 */
function nearestPositionedAncestor(el) {
  let parentEl = /** @type {Element} */ (el.parentElement);
  while (parentEl.parentElement) {
    if (getComputedStyle(parentEl).position !== 'static') {
      break;
    }
    parentEl = parentEl.parentElement;
  }
  return parentEl;
}

/**
 * @typedef AdderOptions
 * @prop {() => void} onAnnotate - Callback invoked when "Annotate" button is clicked
 * @prop {() => void} onHighlight - Callback invoked when "Highlight" button is clicked
 * @prop {(tags: string[]) => void} onShowAnnotations -
 *   Callback invoked when  "Show" button is clicked
 *
 * @typedef {import('../types/annotator').Destroyable} Destroyable
 */

/**
 * Container for the 'adder' toolbar which provides controls for the user to
 * annotate and highlight the selected text.
 *
 * The toolbar implementation is split between this class, which is
 * the container for the toolbar that positions it on the page and isolates
 * it from the page's styles using shadow DOM, and the AdderToolbar Preact
 * component which actually renders the toolbar.
 *
 * @implements {Destroyable}
 */
export class Adder {
  _outerContainer: HTMLElement;
  _shadowRoot: any;
  _view: any;
  _width: () => any;
  _height: () => any;
  _isVisible: boolean;
  _arrowDirection: string;
  _onAnnotate: any;
  _onHighlight: any;
  _onShowAnnotations: any;
  annotationsForSelection: never[];
  /**
   * Create the toolbar's container and hide it.
   *
   * The adder is initially hidden.
   *
   * @param {HTMLElement} element - The DOM element into which the adder will be created
   * @param {AdderOptions} options - Options object specifying onAnnotate and onHighlight
   *        event handlers.
   */
  constructor(element, options) {
    this._outerContainer = document.createElement('hypothesis-adder');
    element.appendChild(this._outerContainer);
    this._shadowRoot = createShadowRoot(this._outerContainer);

    console.log('SR 3: ',this._shadowRoot.children);
    
    // Set initial style
    Object.assign(this._outerContainer.style, {
      // take position out of layout flow initially
      position: 'absolute',
      top: 0,
      left: 0,
    });

    this._view = /** @type {Window} */ (element.ownerDocument.defaultView);

    this._width = () => {
      const firstChild = /** @type {Element} */ (this._shadowRoot.firstChild);
      return firstChild.getBoundingClientRect().width;
    };

    this._height = () => {
      const firstChild = /** @type {Element} */ (this._shadowRoot.firstChild);
      return firstChild.getBoundingClientRect().height;
    };

    this._isVisible = false;

    /** @type {'up'|'down'} */
    this._arrowDirection = 'up';

    this._onAnnotate = options.onAnnotate;
    this._onHighlight = options.onHighlight;
    this._onShowAnnotations = options.onShowAnnotations;

    /**
     * Annotation tags associated with the current selection. If non-empty,
     * a "Show" button appears in the toolbar. Clicking the button calls the
     * onShowAnnotations callback with the current value of annotationsForSelection.
     *
     * @type {string[]}
     */
    this.annotationsForSelection = [];

    this._render();
  }

  /** Hide the adder */
  hide() {
    this._isVisible = false;
    this._render();
    // Reposition the outerContainer because it affects the responsiveness of host page
    // https://github.com/hypothesis/client/issues/3193
    Object.assign(this._outerContainer.style, {
      top: 0,
      left: 0,
    });
  }

  destroy() {
    ReactDOM.render(null, this._shadowRoot); // First, unload the Preact component
    this._outerContainer.remove();
  }

  /**
   * Display the adder in the best position in order to target the
   * selected text in selectionRect.
   *
   * @param {DOMRect} selectionRect - The rect of text to target, in viewport
   *        coordinates.
   * @param {boolean} isRTLselection - True if the selection was made
   *        rigth-to-left, such that the focus point is mosty likely at the
   *        top-left edge of targetRect.
   */
  show(selectionRect, isRTLselection) {
    const { left, top, arrowDirection } = this._calculateTarget(
      selectionRect,
      isRTLselection
    );
    this._showAt(left, top);

    this._isVisible = true;
    this._arrowDirection = arrowDirection === ARROW_POINTING_UP ? 'up' : 'down';

    this._render();
  }

  /**
   *  Determine the best position for the Adder and its pointer-arrow.
   * - Position the pointer-arrow near the end of the selection (where the user's
   *   cursor/input is most likely to be)
   * - Position the Adder to center horizontally on the pointer-arrow
   * - Position the Adder below the selection (arrow pointing up) for LTR selections
   *   and above (arrow down) for RTL selections
   *
   * @param {DOMRect} selectionRect - The rect of text to target, in viewport
   *        coordinates.
   * @param {boolean} isRTLselection - True if the selection was made
   *        rigth-to-left, such that the focus point is mosty likely at the
   *        top-left edge of targetRect.
   * @return {Target}
   */
  _calculateTarget(selectionRect, isRTLselection) {
    // Set the initial arrow direction based on whether the selection was made
    // forwards/upwards or downwards/backwards.
    /** @type {ArrowDirection} */ let arrowDirection;
    if (isRTLselection && !isTouchDevice()) {
      arrowDirection = ARROW_POINTING_DOWN;
    } else {
      // Render the adder below the selection for touch devices due to competing
      // space with the native copy/paste bar that typical (not always) renders above
      // the selection.
      arrowDirection = ARROW_POINTING_UP;
    }
    let top;
    let left;

    // Position the adder such that the arrow it is above or below the selection
    // and close to the end.
    const hMargin = Math.min(ARROW_H_MARGIN, selectionRect.width);
    const adderWidth = this._width();
    // Render the adder a little lower on touch devices to provide room for the native
    // selection handles so that the interactions with selection don't compete with the adder.
    const touchScreenOffset = isTouchDevice() ? 10 : 0;
    const adderHeight = this._height();
    if (isRTLselection) {
      left = selectionRect.left - adderWidth / 2 + hMargin;
    } else {
      left =
        selectionRect.left + selectionRect.width - adderWidth / 2 - hMargin;
    }

    // Flip arrow direction if adder would appear above the top or below the
    // bottom of the viewport.
    if (
      selectionRect.top - adderHeight < 0 &&
      arrowDirection === ARROW_POINTING_DOWN
    ) {
      arrowDirection = ARROW_POINTING_UP;
    } else if (selectionRect.top + adderHeight > this._view.innerHeight) {
      arrowDirection = ARROW_POINTING_DOWN;
    }

    if (arrowDirection === ARROW_POINTING_UP) {
      top =
        selectionRect.top +
        selectionRect.height +
        ARROW_HEIGHT +
        touchScreenOffset;
    } else {
      top = selectionRect.top - adderHeight - ARROW_HEIGHT;
    }

    // Constrain the adder to the viewport.
    left = Math.max(left, 0);
    left = Math.min(left, this._view.innerWidth - adderWidth);

    top = Math.max(top, 0);
    top = Math.min(top, this._view.innerHeight - adderHeight);

    return { top, left, arrowDirection };
  }

  /**
   * Find a Z index value that will cause the adder to appear on top of any
   * content in the document when the adder is shown at (left, top).
   *
   * @param {number} left - Horizontal offset from left edge of viewport.
   * @param {number} top - Vertical offset from top edge of viewport.
   * @return {number} - greatest zIndex (default value of 1)
   */
  _findZindex(left, top) {
    if (document.elementsFromPoint === undefined) {
      // In case of not being able to use document.elementsFromPoint,
      // default to the large arbitrary number (2^15)
      return 32768;
    }

    const adderWidth = this._width();
    const adderHeight = this._height();

    // Find the Z index of all the elements in the screen for five positions
    // around the adder (left-top, left-bottom, middle-center, right-top,
    // right-bottom) and use the greatest.

    // Unique elements so getComputedStyle is called the minimum amount of times.
    const elements = new Set([
      ...document.elementsFromPoint(left, top),
      ...document.elementsFromPoint(left, top + adderHeight),
      ...document.elementsFromPoint(
        left + adderWidth / 2,
        top + adderHeight / 2
      ),
      ...document.elementsFromPoint(left + adderWidth, top),
      ...document.elementsFromPoint(left + adderWidth, top + adderHeight),
    ]);

    const zIndexes = [...elements]
      .map(element => +getComputedStyle(element).zIndex)
      .filter(Number.isInteger);

    // Make sure the array contains at least one element,
    // otherwise Math.max(...[]) results in +Infinity
    zIndexes.push(0);

    return Math.max(...zIndexes) + 1;
  }

  /**
   * Show the adder at the given position and with the arrow pointing in
   * arrowDirection.
   *
   * @param {number} left - Horizontal offset from left edge of viewport.
   * @param {number} top - Vertical offset from top edge of viewport.
   */
  _showAt(left, top) {
    // Translate the (left, top) viewport coordinates into positions relative to
    // the adder's nearest positioned ancestor (NPA).
    //
    // Typically the adder is a child of the <body> and the NPA is the root
    // <html> element. However page styling may make the <body> positioned.
    // See https://github.com/hypothesis/client/issues/487.
    const positionedAncestor = nearestPositionedAncestor(this._outerContainer);
    const parentRect = positionedAncestor.getBoundingClientRect();

    const zIndex = this._findZindex(left, top);

    Object.assign(this._outerContainer.style, {
      left: toPx(left - parentRect.left),
      top: toPx(top - parentRect.top),
      zIndex,
    });
    console.log('style: ', this._outerContainer.style)
  }

  _render() {
    console.log('rendering adder')
    const handleCommand = command => {
      // switch (command) {
      //   case 'annotate':
      //     this._onAnnotate();
      //     this.hide();
      //     break;
      //   case 'highlight':
      //     this._onHighlight();
      //     this.hide();
      //     break;
      //   case 'show':
      //     this._onShowAnnotations(this.annotationsForSelection);
      //     break;
      //   case 'hide':
      //     this.hide();
      //     break;
      //   default:
      //     break;
      return false;
      // }
    };

    console.log('SR before render: ', this._shadowRoot.children);
    ReactDOM.render(
      <AdderToolbar
        isVisible={this._isVisible}
        arrowDirection={this._arrowDirection}
        onCommand={handleCommand}
        annotationCount={20}
      />,
      this._shadowRoot,
      () => {
        if (!calledRender){
          console.log('back call called!');
          loadStyles(this._shadowRoot, 'annotator');
          loadStyles(this._shadowRoot, 'styles');
          calledRender = true;
        }
    
      }
    );

  }
}

let calledRender = false;
