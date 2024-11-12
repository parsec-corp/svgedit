/* globals svgEditor */
import { t } from '../locale.js'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  [aria-label="option"]{
    padding:0.25rem 0.125rem !important;
    background-color: var(--icon-bg-color);
  }
  [aria-label="option"]:hover{
    background-color: var(--icon-bg-color-hover);
  }

  .selected {
    background-color: var(--icon-bg-color-hover);
  }

  i {
    color: var(--icon-color);
  }

  </style>
  <div aria-label="option">
    <i alt="icon"></i>
    <img alt="icon" />
    <slot></slot>
  </div>
`
/**
 * @class SeMenu
 */
export class SeListItem extends HTMLElement {
  /**
    * @function constructor
    */
  constructor() {
    super()
    // create the shadowDom and insert the template
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.append(template.content.cloneNode(true))
    this.$menuitem = this._shadowRoot.querySelector('[aria-label=option]')

    this.$img = this._shadowRoot.querySelector('img')
    this.$img.setAttribute('style', 'display: none;')
    this.imgPath = svgEditor.configObj.curConfig.imgPath

    this.$icon = this._shadowRoot.querySelector('i')
    this.$icon.setAttribute('style', 'display: none;')

    this.$menuitem.addEventListener('mousedown', e => {
      this.$menuitem.dispatchEvent(new CustomEvent('selectedindexchange', {
        bubbles: true,
        composed: true,
        detail: { selectedItem: this.getAttribute('value') }
      }))
    })
  }

  /**
   * @function observedAttributes
   * @returns {any} observed
   */
  static get observedAttributes() {
    return ['option', 'src', 'title', 'img-height', 'selected', 'icon', 'icon-size']
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
      case 'option':
        this.$menuitem.setAttribute('option', newValue)
        this.$menuitem.textContent = t(newValue)
        break
      case 'src':
        this.$img.setAttribute('style', 'display: block;')
        this.$img.setAttribute('src', this.imgPath + '/' + newValue)
        break
      case 'icon':
        this.$icon.setAttribute('class', newValue);
        this.$icon.setAttribute('style', 'display: block;')

        // add icon css
        const style = document.createElement('style');
        const cssIconPaths = svgEditor.configObj.curConfig.cssIconPaths;
        var styleCtx = '';
        cssIconPaths.forEach((path) => {
          styleCtx += `@import url("${path}");`;
        });
        style.textContent = styleCtx;
        this._shadowRoot.prepend(style);
        break
      case 'icon-size':
        this.$icon.setAttribute('style', `font-size: ${newValue};`)
        break;
      case 'title':
        const title = t(newValue);
        this.$img.setAttribute('title', title);
        this.$icon.setAttribute('title', title);
        break
      case 'img-height':
        this.$img.setAttribute('height', newValue)
        break
      case 'selected':
        if (newValue === 'true') {
          this.$menuitem.classList.add('selected')
        } else {
          this.$menuitem.classList.remove('selected')
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
  get option() {
    return this.getAttribute('option')
  }

  /**
   * @function set
   * @returns {void}
   */
  set option(value) {
    this.setAttribute('option', value)
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
  get imgHeight() {
    return this.getAttribute('img-height')
  }

  /**
   * @function set
   * @returns {void}
   */
  set imgHeight(value) {
    this.setAttribute('img-height', value)
  }

  /**
   * @function get
   * @returns {any}
   */
  get src() {
    return this.getAttribute('src')
  }

  /**
   * @function set
   * @returns {void}
   */
  set src(value) {
    this.setAttribute('src', value)
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
  get iconSize() {
    return this.getAttribute('icon-size')
  }

  /**
   * @function set
   * @returns {void}
   */
  set iconSize(value) {
    this.setAttribute('icon-size', value)
  }
}

// Register
customElements.define('se-list-item', SeListItem)
