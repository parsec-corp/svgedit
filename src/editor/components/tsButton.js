/* globals svgEditor */
import { t } from '../locale.js'
const template = document.createElement('template')
template.innerHTML = `
  <style>
  @keyframes btnHover {
    from {
      background-color: var(--main-bg-color);
    }

    to {
      background-color: var(--icon-bg-color-hover);
    }
  }
  :host(:hover) :not(.disabled)
  {
    animation: btnHover 0.2s forwards;
  }
  div
  {
    height: 24px;
    width: 24px;
    margin: 4px 1px 4px;
    padding: 3px;
    background-color: var(--icon-bg-color);
    cursor: pointer;
    border-radius: 3px;
    text-align: center;
  }
  .small {
    width: 14px;
    height: 14px;
    padding: 1px;
    border-radius: 1px;
  }
  i {
    color: var(--icon-color);
    font-size: 18px;
    line-height: 24px;
  }
  .small i {
    font-size: 10px;
    line-height: 14px;
  }
  .pressed {
    background-color: var(--icon-bg-color-hover);
  }
  .disabled {
    opacity: 0.3;
    cursor: default;
  }
  </style>
  <div title="title">
    <i class="bi bi-gear" alt="icon"></i>
  </div>
`
/**
 * @class ToolButton
 */
export class ToolButton extends HTMLElement {
  /**
    * @function constructor
    */
  constructor() {
    super()
    // create the shadowDom and insert the template
    this._shadowRoot = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style');

    const cssIconPaths = svgEditor.configObj.curConfig.cssIconPaths;
    var styleCtx = '';
    cssIconPaths.forEach((path) => {
      styleCtx += `@import url("${path}");`;
    });
    style.textContent = styleCtx;
    this._shadowRoot.append(style);

    this._shadowRoot.append(template.content.cloneNode(true))
    // locate the component
    this.$div = this._shadowRoot.querySelector('div')
    this.$icon = this._shadowRoot.querySelector('i')
  }

  /**
   * @function observedAttributes
   * @returns {any} observed
   */
  static get observedAttributes() {
    return ['title', 'icon', 'pressed', 'disabled', 'size', 'style']
  }

  /**
   * @function attributeChangedCallback
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   * @returns {void}
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return
    switch (name) {
      case 'title':
        {
          const shortcut = this.getAttribute('shortcut')
          this.$div.setAttribute('title', `${t(newValue)} ${shortcut ? `[${t(shortcut)}]` : ''}`)
        }
        break
      case 'style':
        this.$div.style = newValue
        break
      case 'icon':
        this.$icon.setAttribute('class', newValue);
        break
      case 'pressed':
        if (newValue === null) {
          this.$div.classList.remove('pressed')
        } else {
          this.$div.classList.add('pressed')
        }
        break
      case 'size':
        if (newValue === 'small') {
          this.$div.classList.add('small')
        } else {
          this.$div.classList.remove('small')
        }
        break
      case 'disabled':
        if (newValue) {
          this.$div.classList.add('disabled')
        } else {
          this.$div.classList.remove('disabled')
        }
        break
      default:
        console.error(`unknown attribute: ${name}`)
        break
    }
  }

  /**
   * @function get
   * @returns {any}
   */
  get title() {
    return this.getAttribute('title')
  }

  /**
   * @function set
   * @returns {void}
   */
  set title(value) {
    this.setAttribute('title', value)
  }

  /**
   * @function get
   * @returns {any}
   */
  get pressed() {
    return this.hasAttribute('pressed')
  }

  /**
   * @function set
   * @returns {void}
   */
  set pressed(value) {
    // boolean value => existence = true
    if (value) {
      this.setAttribute('pressed', 'true')
    } else {
      this.removeAttribute('pressed')
    }
  }

  /**
   * @function get
   * @returns {any}
   */
  get disabled() {
    return this.hasAttribute('disabled')
  }

  /**
   * @function set
   * @returns {void}
   */
  set disabled(value) {
    // boolean value => existence = true
    if (value) {
      this.setAttribute('disabled', 'true')
    } else {
      this.removeAttribute('disabled')
    }
  }

  /**
   * @function get
   * @returns {any}
   */
  get icon() {
    return this.getAttribute('icon')
  }

  /**
   * @function set
   * @returns {void}
   */
  set icon(value) {
    this.setAttribute('icon', value)
  }

  /**
   * @function get
   * @returns {any}
   */
  get size() {
    return this.getAttribute('size')
  }

  /**
   * @function set
   * @returns {void}
   */
  set size(value) {
    this.setAttribute('size', value)
  }

  /**
   * @function connectedCallback
   * @returns {void}
   */
  connectedCallback() {
    // capture shortcuts
    const shortcut = this.getAttribute('shortcut')
    if (shortcut) {
      // register the keydown event
      document.addEventListener('keydown', (e) => {
        // only track keyboard shortcuts for the body containing the SVG-Editor
        if (e.target.nodeName !== 'BODY') return
        // normalize key
        const key = `${(e.metaKey) ? 'meta+' : ''}${(e.ctrlKey) ? 'ctrl+' : ''}${e.key.toUpperCase()}`
        if (shortcut !== key) return
        // launch the click event
        this.click()
        e.preventDefault()
      })
    }
  }
}

// Register
customElements.define('ts-button', ToolButton)
