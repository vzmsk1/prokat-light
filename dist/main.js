/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/dev/kie6er.js":
/*!******************************!*\
  !*** ./src/js/dev/kie6er.js ***!
  \******************************/
/***/ (() => {



/***/ }),

/***/ "./src/js/dev/markusDM.js":
/*!********************************!*\
  !*** ./src/js/dev/markusDM.js ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "./src/js/dev/ukik0.js":
/*!*****************************!*\
  !*** ./src/js/dev/ukik0.js ***!
  \*****************************/
/***/ (() => {



/***/ }),

/***/ "./src/js/dev/vzmsk1.js":
/*!******************************!*\
  !*** ./src/js/dev/vzmsk1.js ***!
  \******************************/
/***/ (() => {



/***/ }),

/***/ "./src/js/modules.js":
/*!***************************!*\
  !*** ./src/js/modules.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   modules: () => (/* binding */ modules)
/* harmony export */ });
const modules = {};

/***/ }),

/***/ "./src/js/utils/forms.js":
/*!*******************************!*\
  !*** ./src/js/utils/forms.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules.js */ "./src/js/modules.js");


// --------------------------------------------------------------------------

class Validation {
  constructor() {
    this.attrs = {
      REQUIRED: 'data-required',
      IGNORE_VALIDATION: 'data-ignore-validation',
      AJAX: 'data-ajax',
      DEV: 'data-dev',
      IGNORE_FOCUS: 'data-ignore-focus',
      SHOW_PLACEHOLDER: 'data-show-placeholder',
      VALIDATE: 'data-validate'
    };
    this.classes = {
      HAS_ERROR: '_has-error',
      HAS_FOCUS: '_has-focus'
    };
  }
  getErrors(form) {
    let err = 0;
    let requiredFields = form.querySelectorAll(`*[${this.attrs.REQUIRED}]`);
    if (requiredFields.length) {
      requiredFields.forEach(requiredField => {
        if ((requiredField.offsetParent !== null || requiredField.tagName === 'SELECT') && !requiredField.disabled) {
          err += this.validateField(requiredField);
        }
      });
    }
    return err;
  }
  addError(requiredField) {
    requiredField.classList.add(this.classes.HAS_ERROR);
    requiredField.parentElement.classList.add(this.classes.HAS_ERROR);
  }
  removeError(requiredField) {
    requiredField.classList.remove(this.classes.HAS_ERROR);
    requiredField.parentElement.classList.remove(this.classes.HAS_ERROR);
  }
  validateField(requiredField) {
    let err = 0;
    if (requiredField.dataset.required === 'email') {
      requiredField.value = requiredField.value.replace(' ', '');
      if (this.testEmail(requiredField)) {
        this.addError(requiredField);
        err++;
      } else {
        this.removeError(requiredField);
      }
    } else if (requiredField.type === 'checkbox' && !requiredField.checked) {
      this.addError(requiredField);
      err++;
    } else {
      if (!requiredField.value.trim()) {
        this.addError(requiredField);
        err++;
      } else {
        this.removeError(requiredField);
      }
    }
    return err;
  }
  clearFields(form) {
    form.reset();
    setTimeout(() => {
      const inputs = form.querySelectorAll('input,textarea');
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      if (inputs.length) {
        for (let index = 0; index < inputs.length; index++) {
          const input = inputs[index];
          input.parentElement.classList.remove(this.classes.HAS_FOCUS);
          input.classList.remove(this.classes.HAS_FOCUS);
          this.removeError(input);
        }
      }
      if (checkboxes.length) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
        }
      }
    }, 0);
  }
  testEmail(requiredField) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(requiredField.value);
  }
}
class FormSubmition extends Validation {
  constructor(shouldValidate) {
    super();
    this.shouldValidate = shouldValidate ? shouldValidate : true;
    this.forms = document.querySelectorAll('form');
    this.init();
  }
  sendForm(form) {
    let responseResult = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ``;
    document.dispatchEvent(new CustomEvent('sendForm', {
      detail: {
        form: form
      }
    }));

    // show modal, if popup module is connected
    setTimeout(() => {
      if (_modules_js__WEBPACK_IMPORTED_MODULE_0__.modules.popup) {
        const modal = form.dataset.modalMessage;
        modal ? _modules_js__WEBPACK_IMPORTED_MODULE_0__.modules.modal.open(modal) : null;
      }
    }, 0);
    this.clearFields(form);
    console.log('is sent');
  }
  async handleSubmition(form, e) {
    const err = !form.hasAttribute(this.attrs.IGNORE_VALIDATION) ? this.getErrors(form) : 0;
    if (err === 0) {
      const ajax = form.hasAttribute(this.attrs.AJAX);
      if (ajax) {
        e.preventDefault();
        const action = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
        const method = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
        const data = new FormData(form);
        form.classList.add('_is-sending');
        const response = await fetch(action, {
          method: method,
          body: data
        });
        if (response.ok) {
          const result = await response.json();
          form.classList.remove('_is-sending');
          this.sendForm(form, result);
        } else {
          alert('error');
          form.classList.remove('_is-sending');
        }
      } else if (form.hasAttribute(this.attrs.DEV)) {
        // in development mode
        e.preventDefault();
        this.sendForm(form);
      }
    } else {
      e.preventDefault();
    }
  }
  init() {
    const _this = this;
    if (this.forms.length) {
      this.forms.forEach(form => {
        form.addEventListener('submit', function (e) {
          _this.handleSubmition(e.target, e);
        });
        form.addEventListener('reset', function (e) {
          _this.clearFields(e.target);
        });
      });
    }
  }
}
class FormFields extends Validation {
  constructor() {
    super();
    this.fields = document.querySelectorAll('input,textarea');
    this.init();
  }
  savePlaceholder() {
    if (this.fields.length) {
      this.fields.forEach(field => {
        if (!field.hasAttribute(this.attrs.SHOW_PLACEHOLDER)) {
          field.dataset.placeholder = field.placeholder;
        }
      });
    }
  }
  handleFocusin(e) {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      if (target.dataset.placeholder) target.placeholder = '';
      if (!target.hasAttribute(this.attrs.IGNORE_FOCUS)) {
        target.classList.add(this.classes.HAS_FOCUS);
        target.parentElement.classList.add(this.classes.HAS_FOCUS);
        target.classList.remove(this.classes.HAS_ERROR);
        target.parentElement.classList.remove(this.classes.HAS_ERROR);
      }
      this.removeError(target);
    }
  }
  handleFocusout(e) {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      if (target.dataset.placeholder) {
        target.placeholder = target.dataset.placeholder;
      }
      if (!target.hasAttribute(this.attrs.IGNORE_FOCUS)) {
        target.classList.remove(this.classes.HAS_FOCUS);
        target.parentElement.classList.remove(this.classes.HAS_FOCUS);
      }
      if (target.hasAttribute(this.attrs.VALIDATE)) {
        this.validateField(target);
      }
    }
  }
  init() {
    // save placeholder in data attribute
    this.savePlaceholder();

    // handle submition
    new FormSubmition();

    // events
    document.body.addEventListener('focusin', this.handleFocusin.bind(this));
    document.body.addEventListener('focusout', this.handleFocusout.bind(this));
  }
}

// --------------------------------------------------------------------------

new FormFields();

/***/ }),

/***/ "./src/js/utils/tabs.js":
/*!******************************!*\
  !*** ./src/js/utils/tabs.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/utils/utils.js");


// --------------------------------------------------------------------------

class Tabs {
  constructor() {
    this.attrs = {
      TABS: 'data-tabs',
      INDEX: 'data-tabs-index',
      TITLES: 'data-tabs-titles',
      TITLE: 'data-tabs-title',
      TAB_ITEM: 'data-tabs-item',
      BODY: 'data-tabs-body',
      HASH: 'data-tabs-hash'
    };
    this.classes = {
      INIT: '_tabs-init',
      ACTIVE: '_is-active',
      MODAL: 'modal'
    };
    this.tabs = document.querySelectorAll(`[data-tabs]`);
    this.activeHash = [];
    if (this.tabs.length) {
      const hash = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getHash)();
      if (hash && hash.startsWith('tab-')) {
        activeHash = hash.replace('tab-', '').split('-');
      }
      this.tabs.forEach((tabsBlock, index) => {
        tabsBlock.classList.add(this.classes.INIT);
        tabsBlock.setAttribute(this.attrs.INDEX, index);
        tabsBlock.addEventListener('click', this.setActions.bind(this));
        this.init(tabsBlock);
      });
    }
  }
  setStatus(tabsBlock) {
    let titles = tabsBlock.querySelectorAll(`[${this.attrs.TITLE}]`);
    let content = tabsBlock.querySelectorAll(`[${this.attrs.TAB_ITEM}]`);
    const index = tabsBlock.dataset.tabsIndex;
    if (content.length) {
      const hasHash = tabsBlock.hasAttribute(this.attrs.HASH);
      content = Array.from(content).filter(item => item.closest(`[${this.attrs.TABS}]`) === tabsBlock);
      titles = Array.from(titles).filter(item => item.closest(`[${this.attrs.TABS}]`) === tabsBlock);
      content.forEach((item, indx) => {
        if (titles[indx].classList.contains(this.classes.ACTIVE)) {
          item.hidden = false;
          if (hasHash && !item.closest(`.${this.classes.MODAL}`)) {
            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setHash)(`tab-${index}-${indx}`);
          }
        } else {
          item.hidden = true;
        }
      });
    }
  }
  setActions(e) {
    const target = e.target;
    if (target.closest(`[${this.attrs.TITLE}]`)) {
      const title = target.closest(`[${this.attrs.TITLE}]`);
      const tabsBlock = title.closest(`[${this.attrs.TABS}]`);
      if (!title.classList.contains(this.classes.ACTIVE)) {
        let activeTitle = tabsBlock.querySelectorAll(`[${this.attrs.TITLE}].${this.classes.ACTIVE}`);
        activeTitle.length ? activeTitle = Array.from(activeTitle).filter(item => item.closest(`[${this.attrs.TABS}]`) === tabsBlock) : null;
        activeTitle.length ? activeTitle[0].classList.remove(this.classes.ACTIVE) : null;
        title.classList.add(this.classes.ACTIVE);
        this.setStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
  init(tabsBlock) {
    let titles = tabsBlock.querySelectorAll(`[${this.attrs.TITLES}]>*`);
    let content = tabsBlock.querySelectorAll(`[${this.attrs.BODY}]>*`);
    const index = tabsBlock.dataset.tabsIndex;
    const activeHashBlock = this.activeHash[0] == index;
    if (activeHashBlock) {
      const activeTitle = tabsBlock.querySelector(`[${this.attrs.TITLES}]>.${this.classes.ACTIVE}`);
      activeTitle ? activeTitle.classList.remove(this.classes.ACTIVE) : null;
    }
    if (content.length) {
      content = Array.from(content).filter(item => item.closest(`[${this.attrs.TABS}]`) === tabsBlock);
      titles = Array.from(titles).filter(item => item.closest(`[${this.attrs.TABS}]`) === tabsBlock);
      content.forEach((item, index) => {
        titles[index].setAttribute(this.attrs.TITLE, '');
        item.setAttribute(this.attrs.TAB_ITEM, '');
        if (activeHashBlock && index == this.activeHash[1]) {
          titles[index].classList.add(this.classes.ACTIVE);
        }
        item.hidden = !titles[index].classList.contains(this.classes.ACTIVE);
      });
    }
  }
}

// --------------------------------------------------------------------------

new Tabs();

/***/ }),

/***/ "./src/js/utils/utils.js":
/*!*******************************!*\
  !*** ./src/js/utils/utils.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _slideDown: () => (/* binding */ _slideDown),
/* harmony export */   _slideToggle: () => (/* binding */ _slideToggle),
/* harmony export */   _slideUp: () => (/* binding */ _slideUp),
/* harmony export */   bodyLock: () => (/* binding */ bodyLock),
/* harmony export */   bodyLockStatus: () => (/* binding */ bodyLockStatus),
/* harmony export */   bodyLockToggle: () => (/* binding */ bodyLockToggle),
/* harmony export */   bodyUnlock: () => (/* binding */ bodyUnlock),
/* harmony export */   dataMediaQueries: () => (/* binding */ dataMediaQueries),
/* harmony export */   getHash: () => (/* binding */ getHash),
/* harmony export */   menuClose: () => (/* binding */ menuClose),
/* harmony export */   menuInit: () => (/* binding */ menuInit),
/* harmony export */   menuOpen: () => (/* binding */ menuOpen),
/* harmony export */   remToPx: () => (/* binding */ remToPx),
/* harmony export */   removeClasses: () => (/* binding */ removeClasses),
/* harmony export */   setHash: () => (/* binding */ setHash),
/* harmony export */   uniqueArray: () => (/* binding */ uniqueArray)
/* harmony export */ });
/**
 * set hash to url
 * @param {string} hash
 */
const setHash = hash => {
  hash = hash ? `#${hash}` : window.location.href.split('#')[0];
  history.pushState('', '', hash);
};

/**
 * get hash from url
 * @returns string
 */
const getHash = () => {
  if (location.hash) {
    return location.hash.replace('#', '');
  }
};

/**
 * initializes hamburger menu
 */
const menuInit = () => {
  if (document.querySelector('.hamburger')) {
    document.addEventListener('click', function (e) {
      if (bodyLockStatus && e.target.closest('.hamburger')) {
        menuOpen();
      } else if (bodyLockStatus && document.documentElement.classList.contains('_menu-opened') && (e.target.closest('.menu__close-btn') || !e.target.closest('.menu'))) {
        menuClose();
      }
    });
  }
};
/**
 * opens hamburger menu
 */
const menuOpen = () => {
  bodyLock();
  document.documentElement.classList.add('_menu-opened');
};
/**
 * closes hamburger menu
 */
const menuClose = () => {
  bodyUnlock();
  document.documentElement.classList.remove('_menu-opened');
};

// body lock
let bodyLockStatus = true;
/**
 * toggles body lock
 * @param {number} delay
 */
const bodyLockToggle = function () {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
/**
 * unlocks body
 * @param {number} delay
 */
const bodyUnlock = function () {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  if (bodyLockStatus) {
    setTimeout(() => {
      document.documentElement.classList.remove('lock');
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
/**
 * locks body
 * @param {number} delay
 */
const bodyLock = function () {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  if (bodyLockStatus) {
    document.documentElement.classList.add('lock');
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};

/**
 * make the array unique
 * @param {array} array
 * @returns
 */
function uniqueArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

/**
 *
 * @param {array} array
 * @param {number} dataSetValue
 * process media requests from attributes
 */
const dataMediaQueries = (array, dataSetValue) => {
  // get objects with media queries
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(',')[0];
    }
  });
  // objects with media queries initialization
  if (media.length) {
    const breakpointsArray = [];
    media.forEach(item => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(',');
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    // get unique breakpoints
    let mdQueries = breakpointsArray.map(function (item) {
      return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type;
    });
    mdQueries = uniqueArray(mdQueries);
    const mdQueriesArray = [];
    if (mdQueries.length) {
      // work with every breakpoint
      mdQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(',');
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        // objects with conditions
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia
        });
      });
      return mdQueriesArray;
    }
  }
};

/**
 * smoothly slides up
 * @param {HTMLElement} target
 * @param {number} duration
 * @param {boolean} showmore
 */
const _slideUp = function (target) {
  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  let showmore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}rem` : `0`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty('height') : null;
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      !showmore ? target.style.removeProperty('overflow') : null;
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // create event
      document.dispatchEvent(new CustomEvent('slideUpDone', {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
};

/**
 * smoothly slides down
 * @param {HTMLElement} target
 * @param {number} duration
 * @param {boolean} showmore
 */
const _slideDown = function (target) {
  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  let showmore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty('height') : null;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}rem` : `0`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // create event
      document.dispatchEvent(new CustomEvent('slideDownDone', {
        detail: {
          target: target
        }
      }));
    }, duration);
  }
};

/**
 * toggles smooth slide
 * @param {HTMLElement} target
 * @param {number} duration
 * @returns function
 */
const _slideToggle = function (target) {
  let duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};

/**
 * converts rem to pixels
 * @param {number} remValue
 * @returns string
 */
function remToPx(remValue) {
  const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const pxValue = remValue * htmlFontSize;
  return Math.round(pxValue) + 'px';
}

/**
 * remove classes from array items
 * @param {array} array
 * @param {string} className
 */
const removeClasses = (array, className) => {
  for (var i = 0; i < array.length; i++) {
    array[i].classList.remove(className);
  }
};

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/group-css-media-queries-loader/lib/index.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/style.scss":
/*!*************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/group-css-media-queries-loader/lib/index.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/style.scss ***!
  \*************************************************************************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_SOURCEMAP_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_SOURCEMAP_IMPORT___);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Roboto:300,regular,500,600,700,900&display=swap);"]);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Unbounded:600&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@font-face {
  font-family: "Druk Wide Cyr";
  font-weight: 500;
  src: url("./assets/fonts/DrukWideCyr_medium.woff2") format("woff2");
}
@font-face {
  font-family: "Gilroy";
  font-weight: 700;
  src: url("./assets/fonts/Gilroy_bold.woff2") format("woff2");
}
@font-face {
  font-family: "Druk Text Wide Cyr";
  font-weight: 500;
  src: url("./assets/fonts/DrukTextWideCyr_medium.woff2") format("woff2");
}
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-family: "Roboto";
  font-size: 0.5208335vw;
  font-style: normal;
  font-weight: normal;
  -webkit-animation: bugfix infinite 1s;
  line-height: 1.2;
  margin: 0;
  height: 100%;
  padding: 0;
}

body {
  font-style: normal;
  font-weight: normal;
  -webkit-animation: bugfix infinite 1s;
  line-height: 1.2;
  margin: 0;
  padding: 0;
  height: 100%;
  font-size: 1.8rem;
  color: #ffffff;
  background-color: #191c20;
}

input,
textarea {
  -webkit-animation: bugfix infinite 1s;
  line-height: inherit;
  margin: 0;
  padding: 0;
  background-color: transparent;
  border: none;
  color: inherit;
}

a {
  color: unset;
}

a,
a:hover {
  text-decoration: none;
}

button,
input,
a,
textarea {
  outline: none;
  cursor: pointer;
  font: inherit;
}
button:focus,
input:focus,
a:focus,
textarea:focus {
  outline: none;
}
button:active,
input:active,
a:active,
textarea:active {
  outline: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font: inherit;
  margin: 0;
  padding: 0;
}

p {
  margin-top: 0;
  margin-bottom: 0;
}

img {
  width: 100%;
  height: auto;
  display: block;
}

button {
  border: none;
  color: inherit;
  font: inherit;
  text-align: inherit;
  padding: 0;
  background-color: transparent;
}

ul {
  padding: 0;
  margin: 0;
}

ul li {
  margin: 0;
  padding: 0;
  list-style: none;
}

.container {
  width: 164rem;
  margin: 0 auto;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

svg,
img {
  width: 100%;
  height: auto;
  object-fit: contain;
}
html.lock,
html.lock body {
  overflow: hidden;
  touch-action: none;
}

html,
body {
  overflow-x: hidden;
}

main {
  position: relative;
}

.wrapper {
  margin: 0 auto;
  max-width: 1920px;
}

.h {
  font-family: "Druk Wide Cyr";
  font-weight: 500;
  text-transform: uppercase;
}
.h_1 {
  font-size: 6rem;
  line-height: 120%;
  letter-spacing: 3%;
}
.h_2 {
  font-size: 5.2rem;
  line-height: 130%;
  letter-spacing: 2%;
}
.h_3 {
  font-size: 3.6rem;
  line-height: 130%;
  letter-spacing: 2%;
}

.subtitle {
  font-family: Roboto;
  font-weight: 500;
  font-size: 2.4rem;
  line-height: 140%;
}

.txt {
  line-height: 140%;
}
.txt_14 {
  font-size: 1.4rem;
}

.btn {
  margin: 2rem;
  position: relative;
  padding: 2rem 4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
  background: radial-gradient(55.63% 191.15% at 60.94% 0%, rgba(254, 254, 254, 0.7) 0%, rgba(255, 255, 255, 0) 100%);
  color: #ffffff;
  overflow: hidden;
}
.btn::before, .btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  border-radius: 0.8rem;
  box-shadow: 0 0.6rem 1.5rem rgba(0, 0, 0, 0.25);
  transform: translate(-50%, -50%);
}
.btn::before {
  background: radial-gradient(54% 100% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(180deg, #ff6c01 0%, #b34f06 100%);
}
.btn::after {
  opacity: 0;
  background: radial-gradient(54% 100% at 50% 0%, rgba(255, 255, 255, 0.48) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(180deg, #dc5e01 0%, #ae4a01 100%);
  transition: opacity 0.3s ease;
}
.btn._is-disabled::before {
  background: radial-gradient(54% 100% at 50% 0%, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(180deg, #b0b0b0 0%, #6c6c6c 100%);
}
.btn._is-disabled::after {
  content: none;
}
.btn._is-disabled .btn__txt {
  color: #6f6f6f;
}
.btn__txt {
  position: relative;
  z-index: 2;
  font-weight: 500;
  line-height: 110%;
  text-transform: uppercase;
}

.icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 7rem;
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  box-shadow: inset 0 -0.16rem 0.8rem rgba(255, 168, 0, 0.48), inset 0.32rem 0.32rem 0.16rem rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(0.5rem);
  overflow: hidden;
}
.icon::before, .icon::after {
  content: "";
  position: absolute;
  bottom: 0;
}
.icon::before {
  left: 50%;
  height: 2.5rem;
  width: 125%;
  background-image: url(./assets/images/bg/btn-gradient.svg);
  background-size: cover;
  background-repeat: no-repeat;
  transform: translateX(-50%);
}
.icon::after {
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(64deg, #e35d1b 21.64%, #cd591f 69.31%);
  opacity: 0;
  backdrop-filter: blur(0.8rem);
  transition: opacity 0.3s ease;
}
.icon_white {
  box-shadow: inset 0 -0.16rem 0.8rem rgba(255, 255, 255, 0.48), inset 0.32rem 0.32rem 0.16rem rgba(255, 255, 255, 0.1);
}
.icon_white::after {
  background: linear-gradient(64deg, #ffffff 21.64%, #efefef 69.31%);
}
.icon_white::before {
  background-image: url(./assets/images/bg/btn-gradient-white.svg);
}
.icon._is-disabled {
  box-shadow: inset 0 -0.16rem 0.8rem rgba(173, 173, 173, 0.48), inset 0.32rem 0.32rem 0.16rem rgba(255, 255, 255, 0.1);
}
.icon._is-disabled svg path {
  fill: #6f6f6f;
}
.icon._is-disabled::after {
  background: linear-gradient(64deg, #b5b5b5 21.64%, #818181 69.31%);
}
.icon._is-disabled::before {
  background-image: url(./assets/images/bg/btn-gradient-white.svg);
}
.icon svg {
  width: 2rem;
  height: 2rem;
}
.icon svg path {
  transition: fill 0.3s ease;
}
.icon svg:first-child {
  position: relative;
  z-index: 3;
}
.icon svg:last-child {
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  filter: blur(0.2rem);
  transform: translate(-50%, -50%);
}

.tabs__navigation {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
}
.tab {
  padding-left: 3.4rem;
  padding-right: 3.4rem;
  padding-bottom: 1.5rem;
  border-bottom: 0.3rem solid #6f6f6f;
  font-size: 2rem;
  line-height: 1;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  color: #6f6f6f;
  transition: color 0.3s ease, border-bottom 0.3s ease;
}
.tab._is-active {
  border-bottom: 0.3rem solid #ff6c01;
  color: #ff6c01;
}

input[type=text],
input[type=email],
input[type=tel],
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

textarea:focus,
input:focus {
  outline: none;
}

.input {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: 1.1rem;
}
.input__field {
  padding-bottom: 2rem;
  padding-right: 2rem;
  display: block;
  width: 100%;
  line-height: 1;
  border-bottom: 1px solid #6f6f6f;
  transition: border-bottom 0.3s ease;
}
.input__field::placeholder {
  color: #6f6f6f;
  transition: color 0.3s ease;
}
.input__hint {
  display: none;
  color: #e20707;
}
.input._has-focus .input__field {
  border-bottom: 1px solid #ffffff;
}
.input._has-error .input__field {
  border-bottom: 1px solid #e20707;
}
.input._has-error .input__hint {
  display: inline-block;
}
@media (min-width: 1920px){
  html {
    font-size: 10px;
  }
}
@media (max-width: 48em){
  html {
    font-size: 5px;
    font-size: 1.5625vw;
    font-size: 1.3333333333vw;
    -webkit-text-size-adjust: none;
  }
  body {
    font-size: 3rem;
    -webkit-text-size-adjust: none;
  }
  .container {
    padding: 0 2rem;
    width: 100%;
  }
  .h_1 {
    font-size: 4.4rem;
  }
  .h_2 {
    font-size: 4rem;
  }
  .h_3 {
    font-size: 3.6rem;
  }
  .subtitle {
    font-size: 3.6rem;
  }
  .txt_14 {
    font-size: 2.8rem;
  }
  .btn {
    padding: 4rem 8rem;
    border-radius: 1.6rem;
  }
  .btn::before, .btn::after {
    border-radius: 1.6rem;
  }
  .btn__txt {
    font-size: 3.6rem;
    line-height: 4rem;
  }
  .icon {
    flex: 0 0 13rem;
    width: 13rem;
    height: 13rem;
    box-shadow: inset 0 -0.48rem 2.4rem rgba(255, 168, 0, 0.48), inset 0.96rem 0.96rem 0.48rem rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(1.4rem);
  }
  .icon svg {
    width: 5rem;
    height: 5rem;
  }
  .tabs__navigation {
    overflow-x: auto;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none;
  }
  .tabs__navigation::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
  .tab {
    padding-left: 5rem;
    padding-right: 5rem;
    padding-bottom: 3.6rem;
    border-bottom: 0.4rem solid #6f6f6f;
    font-size: 3.2rem;
  }
  .tab._is-active {
    border-bottom: 0.4rem solid #ff6c01;
  }
  .input__field {
    padding-bottom: 3.2rem;
    padding-right: 3.2rem;
  }
}
@media (any-hover: hover){
  .btn:not(.btn._is-disabled):hover::after {
    opacity: 1;
  }
  .icon:not(.icon._is-disabled, .icon_white):hover::after {
    opacity: 1;
  }
  .icon:not(.icon._is-disabled, .icon_white):hover svg path {
    fill: #ffffff;
  }
}`, "",{"version":3,"sources":["webpack://./src/scss/fonts.scss","webpack://./src/scss/style.scss","webpack://./src/scss/set.scss","webpack://./src/ui/styles/_typo.scss","webpack://./src/ui/styles/_button.scss","webpack://./src/ui/styles/_icon.scss","webpack://./src/ui/styles/_tabs.scss","webpack://./src/ui/styles/_input.scss","<no source>"],"names":[],"mappings":"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","sourcesContent":["@font-face {\n  font-family: 'Druk Wide Cyr';\n  font-weight: 500;\n  src: url('./assets/fonts/DrukWideCyr_medium.woff2') format('woff2');\n}\n\n@font-face {\n  font-family: 'Gilroy';\n  font-weight: 700;\n  src: url('./assets/fonts/Gilroy_bold.woff2') format('woff2');\n}\n\n@font-face {\n  font-family: 'Druk Text Wide Cyr';\n  font-weight: 500;\n  src: url('./assets/fonts/DrukTextWideCyr_medium.woff2') format('woff2');\n}\n","// --------------------------------- mixins ---------------------------------\n\n@import './mixins';\n\n// -------------------------------- variables -------------------------------\n\n// colors\n$white: #ffffff;\n$black: #111316;\n$bgColor: #191c20;\n$gray: #6f6f6f;\n$orange: #ff6c01;\n$red: #e20707;\n\n// ---------------------------------- fonts ---------------------------------\n\n@import url(https://fonts.googleapis.com/css?family=Roboto:300,regular,500,600,700,900&display=swap);\n@import url(https://fonts.googleapis.com/css?family=Unbounded:600&display=swap);\n\n// local fonts\n@import './fonts';\n\n// ------------------------------- base styles ------------------------------\n\n// base scss file\n@import './set';\n\n// html\nhtml.lock,\nhtml.lock body {\n  overflow: hidden;\n  touch-action: none;\n}\nhtml,\nbody {\n  overflow-x: hidden;\n}\n\n// main\nmain {\n  position: relative;\n}\n\n.wrapper {\n  margin: 0 auto;\n  max-width: 1920px;\n}\n\n// --------------------------------------------------------------------------\n\n// header / footer\n@import './sections/header';\n@import './sections/footer';\n\n// ui\n@import '../ui/styles/ui.scss';\n\n// --------------------------------------------------------------------------\n\n@import './dev/vzmsk1.scss';\n@import './dev/markusDM.scss';\n@import './dev/ukik0.scss';\n@import './dev/kie6er.scss';\n","*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\nhtml {\n  font-family: 'Roboto'; // шрифт по умолчанию по сайту\n  font-size: 0.5208335vw; // на разрешении 1920 0.520835vw === 10px\n  font-style: normal;\n  font-weight: normal;\n  -webkit-animation: bugfix infinite 1s;\n  line-height: 1.2;\n  margin: 0;\n  height: 100%;\n  padding: 0;\n}\n\nbody {\n  font-style: normal;\n  font-weight: normal;\n  -webkit-animation: bugfix infinite 1s;\n  line-height: 1.2;\n  margin: 0;\n  padding: 0;\n  height: 100%;\n  font-size: 1.8rem;\n  color: $white; // цвет по умолчанию текста по сайту\n  background-color: $bgColor;\n}\n\ninput,\ntextarea {\n  -webkit-animation: bugfix infinite 1s;\n  line-height: inherit;\n  margin: 0;\n  padding: 0;\n  background-color: transparent;\n  border: none;\n  color: inherit;\n}\na {\n  color: unset;\n}\na,\na:hover {\n  text-decoration: none;\n}\n\nbutton,\ninput,\na,\ntextarea {\n  outline: none;\n  cursor: pointer;\n  font: inherit;\n  &:focus {\n    outline: none;\n  }\n  &:active {\n    outline: none;\n  }\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font: inherit;\n  margin: 0;\n  padding: 0;\n}\np {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\nimg {\n  width: 100%;\n  height: auto;\n  display: block;\n}\n\nbutton {\n  border: none;\n  color: inherit;\n  font: inherit;\n  text-align: inherit;\n  padding: 0;\n  background-color: transparent;\n}\nul {\n  padding: 0;\n  margin: 0;\n}\n\nul li {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n\n.container {\n  width: 164rem;\n  margin: 0 auto;\n}\n\ninput[type='number']::-webkit-inner-spin-button,\ninput[type='number']::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n\ninput[type='number'] {\n  -moz-appearance: textfield;\n}\n\nsvg,\nimg {\n  width: 100%;\n  height: auto;\n  object-fit: contain;\n}\n\n@media (min-width: 1920px) {\n  html {\n    font-size: 10px;\n  }\n}\n\n@media (max-width: 48em) {\n  html {\n    font-size: 5px;\n    font-size: 1.5625vw;\n    font-size: calc((100 / 375) * 5vw); // где 375 это ширина моб версии макета\n    -webkit-text-size-adjust: none;\n  }\n\n  body {\n    font-size: 3rem;\n    -webkit-text-size-adjust: none;\n  }\n\n  .container {\n    padding: 0 2rem; // в моб версии отступ от края задаем для всех контейнеров, а там где не нужно можем точечно убрать\n    width: 100%;\n  }\n}\n",".h {\n  font-family: 'Druk Wide Cyr';\n  font-weight: 500;\n  text-transform: uppercase;\n\n  &_1 {\n    font-size: 6rem;\n    line-height: 120%;\n    letter-spacing: 3%;\n\n    @media (max-width: 48em) {\n      font-size: 4.4rem;\n    }\n  }\n\n  &_2 {\n    font-size: 5.2rem;\n    line-height: 130%;\n    letter-spacing: 2%;\n\n    @media (max-width: 48em) {\n      font-size: 4rem;\n    }\n  }\n\n  &_3 {\n    font-size: 3.6rem;\n    line-height: 130%;\n    letter-spacing: 2%;\n\n    @media (max-width: 48em) {\n      font-size: 3.6rem;\n    }\n  }\n}\n\n.subtitle {\n  font-family: Roboto;\n  font-weight: 500;\n  font-size: 2.4rem;\n  line-height: 140%;\n\n  @media (max-width: 48em) {\n    font-size: 3.6rem;\n  }\n}\n\n.txt {\n  line-height: 140%;\n\n  &_14 {\n    font-size: 1.4rem;\n\n    @media (max-width: 48em) {\n      font-size: 2.8rem;\n    }\n  }\n}\n",".btn {\n  margin: 2rem;\n  position: relative;\n  padding: 2rem 4rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 0.8rem;\n  background: radial-gradient(\n    55.63% 191.15% at 60.94% 0%,\n    rgba(254, 254, 254, 0.7) 0%,\n    rgba(255, 255, 255, 0) 100%\n  );\n  color: $white;\n  overflow: hidden;\n\n  &::before,\n  &::after {\n    content: '';\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    width: calc(100% - 2px);\n    height: calc(100% - 2px);\n    border-radius: 0.8rem;\n    box-shadow: 0 0.6rem 1.5rem rgba(0, 0, 0, 0.25);\n    transform: translate(-50%, -50%);\n  }\n  &::before {\n    background: radial-gradient(\n        54% 100% at 50% 0%,\n        rgba(255, 255, 255, 0.3) 0%,\n        rgba(0, 0, 0, 0) 100%\n      ),\n      linear-gradient(180deg, #ff6c01 0%, #b34f06 100%);\n  }\n  &::after {\n    opacity: 0;\n    background: radial-gradient(\n        54% 100% at 50% 0%,\n        rgba(255, 255, 255, 0.48) 0%,\n        rgba(0, 0, 0, 0) 100%\n      ),\n      linear-gradient(180deg, #dc5e01 0%, #ae4a01 100%);\n    transition: opacity 0.3s ease;\n  }\n\n  &._is-disabled {\n    &::before {\n      background: radial-gradient(\n          54% 100% at 50% 0%,\n          rgba(255, 255, 255, 0.3) 0%,\n          rgba(0, 0, 0, 0) 100%\n        ),\n        linear-gradient(180deg, #b0b0b0 0%, #6c6c6c 100%);\n    }\n    &::after {\n      content: none;\n    }\n\n    .btn__txt {\n      color: $gray;\n    }\n  }\n\n  @media (any-hover: hover) {\n    &:not(&._is-disabled) {\n      &:hover {\n        &::after {\n          opacity: 1;\n        }\n      }\n    }\n  }\n\n  @media (max-width: 48em) {\n    padding: 4rem 8rem;\n    border-radius: 1.6rem;\n\n    &::before,\n    &::after {\n      border-radius: 1.6rem;\n    }\n  }\n\n  // .btn__txt\n\n  &__txt {\n    position: relative;\n    z-index: 2;\n    font-weight: 500;\n    line-height: 110%;\n    text-transform: uppercase;\n\n    @media (max-width: 48em) {\n      font-size: 3.6rem;\n      line-height: 4rem;\n    }\n  }\n}\n",".icon {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 7rem;\n  width: 7rem;\n  height: 7rem;\n  border-radius: 50%;\n  box-shadow: inset 0 -0.16rem 0.8rem rgba(255, 168, 0, 0.48),\n    inset 0.32rem 0.32rem 0.16rem rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(0.5rem);\n  overflow: hidden;\n\n  &::before,\n  &::after {\n    content: '';\n    position: absolute;\n    bottom: 0;\n  }\n\n  &::before {\n    left: 50%;\n    height: 2.5rem;\n    width: 125%;\n    background-image: url(./assets/images/bg/btn-gradient.svg);\n    background-size: cover;\n    background-repeat: no-repeat;\n    transform: translateX(-50%);\n  }\n\n  &::after {\n    left: 0;\n    height: 100%;\n    width: 100%;\n    background: linear-gradient(64deg, #e35d1b 21.64%, #cd591f 69.31%);\n    opacity: 0;\n    backdrop-filter: blur(0.8rem);\n    transition: opacity 0.3s ease;\n  }\n\n  &_white {\n    box-shadow: inset 0 -0.16rem 0.8rem rgba(255, 255, 255, 0.48),\n      inset 0.32rem 0.32rem 0.16rem rgba(255, 255, 255, 0.1);\n\n    &::after {\n      background: linear-gradient(64deg, #ffffff 21.64%, #efefef 69.31%);\n    }\n\n    &::before {\n      background-image: url(./assets/images/bg/btn-gradient-white.svg);\n    }\n  }\n\n  &._is-disabled {\n    box-shadow: inset 0 -0.16rem 0.8rem rgba(173, 173, 173, 0.48),\n      inset 0.32rem 0.32rem 0.16rem rgba(255, 255, 255, 0.1);\n\n    svg path {\n      fill: $gray;\n    }\n\n    &::after {\n      background: linear-gradient(64deg, #b5b5b5 21.64%, #818181 69.31%);\n    }\n    &::before {\n      background-image: url(./assets/images/bg/btn-gradient-white.svg);\n    }\n  }\n\n  svg {\n    width: 2rem;\n    height: 2rem;\n\n    path {\n      transition: fill 0.3s ease;\n    }\n\n    &:first-child {\n      position: relative;\n      z-index: 3;\n    }\n\n    &:last-child {\n      position: absolute;\n      z-index: 2;\n      top: 50%;\n      left: 50%;\n      filter: blur(0.2rem);\n      transform: translate(-50%, -50%);\n    }\n  }\n\n  @media (any-hover: hover) {\n    &:not(&._is-disabled, &_white) {\n      &:hover {\n        &::after {\n          opacity: 1;\n        }\n        svg path {\n          fill: $white;\n        }\n      }\n    }\n  }\n\n  @media (max-width: 48em) {\n    flex: 0 0 13rem;\n    width: 13rem;\n    height: 13rem;\n    box-shadow: inset 0 -0.48rem 2.4rem rgba(255, 168, 0, 0.48),\n      inset 0.96rem 0.96rem 0.48rem rgba(255, 255, 255, 0.1);\n    backdrop-filter: blur(1.4rem);\n    svg {\n      width: 5rem;\n      height: 5rem;\n    }\n  }\n}\n",".tabs {\n  // .tabs__navigation\n\n  &__navigation {\n    position: relative;\n    display: flex;\n    flex-wrap: nowrap;\n\n    @media (max-width: 48em) {\n      overflow-x: auto;\n      -ms-overflow-style: none; /* Internet Explorer 10+ */\n      scrollbar-width: none;\n      &::-webkit-scrollbar {\n        display: none; /* Safari and Chrome */\n      }\n    }\n  }\n\n  // .tabs__title\n\n  &__title {\n  }\n\n  // .tabs__content\n\n  &__content {\n  }\n\n  // .tabs__body\n\n  &__body {\n  }\n}\n\n.tab {\n  padding-left: 3.4rem;\n  padding-right: 3.4rem;\n  padding-bottom: 1.5rem;\n  border-bottom: 0.3rem solid $gray;\n  font-size: 2rem;\n  line-height: 1;\n  text-align: center;\n  text-transform: uppercase;\n  white-space: nowrap;\n  color: $gray;\n  transition: color 0.3s ease, border-bottom 0.3s ease;\n\n  &._is-active {\n    border-bottom: 0.3rem solid $orange;\n    color: $orange;\n  }\n\n  @media (max-width: 48em) {\n    padding-left: 5rem;\n    padding-right: 5rem;\n    padding-bottom: 3.6rem;\n    border-bottom: 0.4rem solid $gray;\n    font-size: 3.2rem;\n\n    &._is-active {\n      border-bottom: 0.4rem solid $orange;\n    }\n  }\n}\n","input[type='text'],\ninput[type='email'],\ninput[type='tel'],\ntextarea {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\ntextarea:focus,\ninput:focus {\n  outline: none;\n}\n\n.input {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  row-gap: 1.1rem;\n\n  // .input__field\n\n  &__field {\n    padding-bottom: 2rem;\n    padding-right: 2rem;\n    display: block;\n    width: 100%;\n    line-height: 1;\n    border-bottom: 1px solid $gray;\n    transition: border-bottom 0.3s ease;\n\n    &::placeholder {\n      color: $gray;\n      transition: color 0.3s ease;\n    }\n\n    @media (max-width: 48em) {\n      padding-bottom: 3.2rem;\n      padding-right: 3.2rem;\n    }\n  }\n\n  // .input__hint\n\n  &__hint {\n    display: none;\n    color: $red;\n  }\n\n  &._has-focus {\n    .input__field {\n      border-bottom: 1px solid $white;\n    }\n  }\n  &._has-error {\n    .input__field {\n      border-bottom: 1px solid $red;\n    }\n    .input__hint {\n      display: inline-block;\n    }\n  }\n}\n",null],"sourceRoot":""}]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/scss/style.scss":
/*!*****************************!*\
  !*** ./src/scss/style.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/group-css-media-queries-loader/lib/index.js!../../node_modules/sass-loader/dist/cjs.js!./style.scss */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/group-css-media-queries-loader/lib/index.js!./node_modules/sass-loader/dist/cjs.js!./src/scss/style.scss");
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()((_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6___default()), options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6___default()) && (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6___default().locals) ? (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_group_css_media_queries_loader_lib_index_js_node_modules_sass_loader_dist_cjs_js_style_scss__WEBPACK_IMPORTED_MODULE_6___default().locals) : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/style.scss */ "./src/scss/style.scss");
/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/utils.js */ "./src/js/utils/utils.js");
/* harmony import */ var _utils_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/forms */ "./src/js/utils/forms.js");
/* harmony import */ var _utils_tabs_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/tabs.js */ "./src/js/utils/tabs.js");
/* harmony import */ var _dev_vzmsk1_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dev/vzmsk1.js */ "./src/js/dev/vzmsk1.js");
/* harmony import */ var _dev_vzmsk1_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_dev_vzmsk1_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _dev_markusDM_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dev/markusDM.js */ "./src/js/dev/markusDM.js");
/* harmony import */ var _dev_markusDM_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_dev_markusDM_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _dev_ukik0_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dev/ukik0.js */ "./src/js/dev/ukik0.js");
/* harmony import */ var _dev_ukik0_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_dev_ukik0_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _dev_kie6er_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dev/kie6er.js */ "./src/js/dev/kie6er.js");
/* harmony import */ var _dev_kie6er_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_dev_kie6er_js__WEBPACK_IMPORTED_MODULE_7__);


// ---------------------------------- utils ---------------------------------



// hamburger menu
// utils.menuInit();

// ------------------------------- components -------------------------------

// forms


// tabs


// // accordion
// import './utils/accordion.js';

// // select
// import './utils/select.js';

// // modals
// import './utils/modals.js';

// --------------------------------------------------------------------------





})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aUssU0FBUyxDQUFDO0VBQ3RDO0FBQ0YsQ0FBQzs7Ozs7Ozs7OztBQ3RTRDtBQUNBLDRDQUE0QyxtQkFBTyxDQUFDLHNIQUEwRDtBQUM5RyxrQ0FBa0MsbUJBQU8sQ0FBQyx3R0FBbUQ7QUFDN0Y7QUFDQSwrSUFBK0k7QUFDL0ksMEhBQTBIO0FBQzFIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxPQUFPLDRXQUE0VyxXQUFXLFdBQVcsV0FBVyxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLFdBQVcsV0FBVyxXQUFXLEtBQUssUUFBUSxXQUFXLE9BQU8sTUFBTSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsVUFBVSxPQUFPLE1BQU0sV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsYUFBYSxPQUFPLE9BQU8sV0FBVyxXQUFXLFVBQVUsVUFBVSxXQUFXLFVBQVUsVUFBVSxPQUFPLE1BQU0sVUFBVSxPQUFPLE9BQU8sV0FBVyxPQUFPLFNBQVMsVUFBVSxVQUFVLFVBQVUsTUFBTSxTQUFTLFVBQVUsTUFBTSxTQUFTLFVBQVUsT0FBTyxXQUFXLFVBQVUsVUFBVSxVQUFVLE9BQU8sTUFBTSxVQUFVLFdBQVcsT0FBTyxNQUFNLFVBQVUsVUFBVSxVQUFVLE9BQU8sTUFBTSxVQUFVLFVBQVUsVUFBVSxXQUFXLFVBQVUsV0FBVyxPQUFPLE1BQU0sVUFBVSxVQUFVLE9BQU8sTUFBTSxVQUFVLFVBQVUsV0FBVyxPQUFPLE1BQU0sVUFBVSxVQUFVLE9BQU8sT0FBTyxXQUFXLFVBQVUsT0FBTyxNQUFNLFdBQVcsT0FBTyxPQUFPLFVBQVUsVUFBVSxXQUFXLE1BQU0sT0FBTyxXQUFXLFdBQVcsT0FBTyxPQUFPLFdBQVcsT0FBTyxNQUFNLFdBQVcsT0FBTyxNQUFNLFVBQVUsV0FBVyxPQUFPLE1BQU0sV0FBVyxXQUFXLFdBQVcsTUFBTSxNQUFNLFVBQVUsV0FBVyxXQUFXLE1BQU0sTUFBTSxXQUFXLFdBQVcsV0FBVyxNQUFNLE1BQU0sV0FBVyxXQUFXLFdBQVcsT0FBTyxNQUFNLFdBQVcsV0FBVyxXQUFXLFdBQVcsT0FBTyxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsT0FBTyxNQUFNLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsTUFBTSxNQUFNLFVBQVUsV0FBVyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsV0FBVyxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sVUFBVSxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLE9BQU8sTUFBTSxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxNQUFNLFVBQVUsV0FBVyxVQUFVLE1BQU0sTUFBTSxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLFVBQVUsVUFBVSxXQUFXLFVBQVUsV0FBVyxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxVQUFVLFVBQVUsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsVUFBVSxNQUFNLE1BQU0sV0FBVyxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsT0FBTyxNQUFNLFdBQVcsVUFBVSxXQUFXLE1BQU0sTUFBTSxXQUFXLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFlBQVksTUFBTSxNQUFNLFdBQVcsV0FBVyxPQUFPLFNBQVMsV0FBVyxXQUFXLFdBQVcsT0FBTyxPQUFPLFVBQVUsT0FBTyxNQUFNLFdBQVcsVUFBVSxXQUFXLFVBQVUsTUFBTSxNQUFNLFdBQVcsV0FBVyxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsTUFBTSxNQUFNLFdBQVcsWUFBWSxNQUFNLE1BQU0sVUFBVSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sT0FBTyxNQUFNLFVBQVUsTUFBTSxNQUFNLE1BQU0sTUFBTSxVQUFVLFdBQVcsV0FBVyxXQUFXLE1BQU0sTUFBTSxVQUFVLFdBQVcsTUFBTSxNQUFNLFVBQVUsVUFBVSxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sVUFBVSxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sV0FBVyxNQUFNLE1BQU0sWUFBWSxXQUFXLE1BQU0sTUFBTSxXQUFXLE1BQU0sTUFBTSxXQUFXLFdBQVcsTUFBTSxNQUFNLFdBQVcsVUFBVSxVQUFVLFdBQVcsV0FBVyxNQUFNLE1B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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzVEYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDYkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E0Qjs7QUFFNUI7O0FBRTBDOztBQUUxQztBQUNBOztBQUVBOztBQUVBO0FBQ3VCOztBQUV2QjtBQUN5Qjs7QUFFekI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRXlCO0FBQ0U7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy9tb2R1bGVzLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy91dGlscy9mb3Jtcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvanMvdXRpbHMvdGFicy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9zcmMvanMvdXRpbHMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vc3JjL3Njc3Mvc3R5bGUuc2NzcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9zY3NzL3N0eWxlLnNjc3M/NmMyZCIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2VicGFja19leGFtcGxlL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWJwYWNrX2V4YW1wbGUvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3dlYnBhY2tfZXhhbXBsZS8uL3NyYy9qcy9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IG1vZHVsZXMgPSB7fTtcbiIsImltcG9ydCB7IG1vZHVsZXMgfSBmcm9tICcuLi9tb2R1bGVzLmpzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY2xhc3MgVmFsaWRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXR0cnMgPSB7XG4gICAgICBSRVFVSVJFRDogJ2RhdGEtcmVxdWlyZWQnLFxuICAgICAgSUdOT1JFX1ZBTElEQVRJT046ICdkYXRhLWlnbm9yZS12YWxpZGF0aW9uJyxcbiAgICAgIEFKQVg6ICdkYXRhLWFqYXgnLFxuICAgICAgREVWOiAnZGF0YS1kZXYnLFxuICAgICAgSUdOT1JFX0ZPQ1VTOiAnZGF0YS1pZ25vcmUtZm9jdXMnLFxuICAgICAgU0hPV19QTEFDRUhPTERFUjogJ2RhdGEtc2hvdy1wbGFjZWhvbGRlcicsXG4gICAgICBWQUxJREFURTogJ2RhdGEtdmFsaWRhdGUnLFxuICAgIH07XG4gICAgdGhpcy5jbGFzc2VzID0ge1xuICAgICAgSEFTX0VSUk9SOiAnX2hhcy1lcnJvcicsXG4gICAgICBIQVNfRk9DVVM6ICdfaGFzLWZvY3VzJyxcbiAgICB9O1xuICB9XG5cbiAgZ2V0RXJyb3JzKGZvcm0pIHtcbiAgICBsZXQgZXJyID0gMDtcbiAgICBsZXQgcmVxdWlyZWRGaWVsZHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoYCpbJHt0aGlzLmF0dHJzLlJFUVVJUkVEfV1gKTtcblxuICAgIGlmIChyZXF1aXJlZEZpZWxkcy5sZW5ndGgpIHtcbiAgICAgIHJlcXVpcmVkRmllbGRzLmZvckVhY2gocmVxdWlyZWRGaWVsZCA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAocmVxdWlyZWRGaWVsZC5vZmZzZXRQYXJlbnQgIT09IG51bGwgfHxcbiAgICAgICAgICAgIHJlcXVpcmVkRmllbGQudGFnTmFtZSA9PT0gJ1NFTEVDVCcpICYmXG4gICAgICAgICAgIXJlcXVpcmVkRmllbGQuZGlzYWJsZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXJyICs9IHRoaXMudmFsaWRhdGVGaWVsZChyZXF1aXJlZEZpZWxkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBlcnI7XG4gIH1cblxuICBhZGRFcnJvcihyZXF1aXJlZEZpZWxkKSB7XG4gICAgcmVxdWlyZWRGaWVsZC5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5IQVNfRVJST1IpO1xuICAgIHJlcXVpcmVkRmllbGQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5IQVNfRVJST1IpO1xuICB9XG5cbiAgcmVtb3ZlRXJyb3IocmVxdWlyZWRGaWVsZCkge1xuICAgIHJlcXVpcmVkRmllbGQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuSEFTX0VSUk9SKTtcbiAgICByZXF1aXJlZEZpZWxkLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuSEFTX0VSUk9SKTtcbiAgfVxuXG4gIHZhbGlkYXRlRmllbGQocmVxdWlyZWRGaWVsZCkge1xuICAgIGxldCBlcnIgPSAwO1xuXG4gICAgaWYgKHJlcXVpcmVkRmllbGQuZGF0YXNldC5yZXF1aXJlZCA9PT0gJ2VtYWlsJykge1xuICAgICAgcmVxdWlyZWRGaWVsZC52YWx1ZSA9IHJlcXVpcmVkRmllbGQudmFsdWUucmVwbGFjZSgnICcsICcnKTtcblxuICAgICAgaWYgKHRoaXMudGVzdEVtYWlsKHJlcXVpcmVkRmllbGQpKSB7XG4gICAgICAgIHRoaXMuYWRkRXJyb3IocmVxdWlyZWRGaWVsZCk7XG4gICAgICAgIGVycisrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFcnJvcihyZXF1aXJlZEZpZWxkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlcXVpcmVkRmllbGQudHlwZSA9PT0gJ2NoZWNrYm94JyAmJiAhcmVxdWlyZWRGaWVsZC5jaGVja2VkKSB7XG4gICAgICB0aGlzLmFkZEVycm9yKHJlcXVpcmVkRmllbGQpO1xuICAgICAgZXJyKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghcmVxdWlyZWRGaWVsZC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgdGhpcy5hZGRFcnJvcihyZXF1aXJlZEZpZWxkKTtcbiAgICAgICAgZXJyKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUVycm9yKHJlcXVpcmVkRmllbGQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZXJyO1xuICB9XG5cbiAgY2xlYXJGaWVsZHMoZm9ybSkge1xuICAgIGZvcm0ucmVzZXQoKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCx0ZXh0YXJlYScpO1xuICAgICAgY29uc3QgY2hlY2tib3hlcyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cbiAgICAgIGlmIChpbnB1dHMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBpbnB1dHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBpbnB1dHNbaW5kZXhdO1xuXG4gICAgICAgICAgaW5wdXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5IQVNfRk9DVVMpO1xuICAgICAgICAgIGlucHV0LmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkhBU19GT0NVUyk7XG4gICAgICAgICAgdGhpcy5yZW1vdmVFcnJvcihpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaGVja2JveGVzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgY2hlY2tib3hlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBjb25zdCBjaGVja2JveCA9IGNoZWNrYm94ZXNbaW5kZXhdO1xuICAgICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIDApO1xuICB9XG5cbiAgdGVzdEVtYWlsKHJlcXVpcmVkRmllbGQpIHtcbiAgICByZXR1cm4gIS9eXFx3KyhbXFwuLV0/XFx3KykqQFxcdysoW1xcLi1dP1xcdyspKihcXC5cXHd7Miw4fSkrJC8udGVzdChcbiAgICAgIHJlcXVpcmVkRmllbGQudmFsdWVcbiAgICApO1xuICB9XG59XG5jbGFzcyBGb3JtU3VibWl0aW9uIGV4dGVuZHMgVmFsaWRhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHNob3VsZFZhbGlkYXRlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnNob3VsZFZhbGlkYXRlID0gc2hvdWxkVmFsaWRhdGUgPyBzaG91bGRWYWxpZGF0ZSA6IHRydWU7XG4gICAgdGhpcy5mb3JtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2Zvcm0nKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHNlbmRGb3JtKGZvcm0sIHJlc3BvbnNlUmVzdWx0ID0gYGApIHtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgbmV3IEN1c3RvbUV2ZW50KCdzZW5kRm9ybScsIHtcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgZm9ybTogZm9ybSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIHNob3cgbW9kYWwsIGlmIHBvcHVwIG1vZHVsZSBpcyBjb25uZWN0ZWRcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmIChtb2R1bGVzLnBvcHVwKSB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gZm9ybS5kYXRhc2V0Lm1vZGFsTWVzc2FnZTtcbiAgICAgICAgbW9kYWwgPyBtb2R1bGVzLm1vZGFsLm9wZW4obW9kYWwpIDogbnVsbDtcbiAgICAgIH1cbiAgICB9LCAwKTtcblxuICAgIHRoaXMuY2xlYXJGaWVsZHMoZm9ybSk7XG5cbiAgICBjb25zb2xlLmxvZygnaXMgc2VudCcpO1xuICB9XG5cbiAgYXN5bmMgaGFuZGxlU3VibWl0aW9uKGZvcm0sIGUpIHtcbiAgICBjb25zdCBlcnIgPSAhZm9ybS5oYXNBdHRyaWJ1dGUodGhpcy5hdHRycy5JR05PUkVfVkFMSURBVElPTilcbiAgICAgID8gdGhpcy5nZXRFcnJvcnMoZm9ybSlcbiAgICAgIDogMDtcblxuICAgIGlmIChlcnIgPT09IDApIHtcbiAgICAgIGNvbnN0IGFqYXggPSBmb3JtLmhhc0F0dHJpYnV0ZSh0aGlzLmF0dHJzLkFKQVgpO1xuXG4gICAgICBpZiAoYWpheCkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3QgYWN0aW9uID0gZm9ybS5nZXRBdHRyaWJ1dGUoJ2FjdGlvbicpXG4gICAgICAgICAgPyBmb3JtLmdldEF0dHJpYnV0ZSgnYWN0aW9uJykudHJpbSgpXG4gICAgICAgICAgOiAnIyc7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGZvcm0uZ2V0QXR0cmlidXRlKCdtZXRob2QnKVxuICAgICAgICAgID8gZm9ybS5nZXRBdHRyaWJ1dGUoJ21ldGhvZCcpLnRyaW0oKVxuICAgICAgICAgIDogJ0dFVCc7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XG5cbiAgICAgICAgZm9ybS5jbGFzc0xpc3QuYWRkKCdfaXMtc2VuZGluZycpO1xuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYWN0aW9uLCB7XG4gICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgYm9keTogZGF0YSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgIGZvcm0uY2xhc3NMaXN0LnJlbW92ZSgnX2lzLXNlbmRpbmcnKTtcbiAgICAgICAgICB0aGlzLnNlbmRGb3JtKGZvcm0sIHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxlcnQoJ2Vycm9yJyk7XG4gICAgICAgICAgZm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdfaXMtc2VuZGluZycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGZvcm0uaGFzQXR0cmlidXRlKHRoaXMuYXR0cnMuREVWKSkge1xuICAgICAgICAvLyBpbiBkZXZlbG9wbWVudCBtb2RlXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5zZW5kRm9ybShmb3JtKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgY29uc3QgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuZm9ybXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmZvcm1zLmZvckVhY2goZm9ybSA9PiB7XG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICBfdGhpcy5oYW5kbGVTdWJtaXRpb24oZS50YXJnZXQsIGUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgX3RoaXMuY2xlYXJGaWVsZHMoZS50YXJnZXQpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuY2xhc3MgRm9ybUZpZWxkcyBleHRlbmRzIFZhbGlkYXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZmllbGRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQsdGV4dGFyZWEnKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHNhdmVQbGFjZWhvbGRlcigpIHtcbiAgICBpZiAodGhpcy5maWVsZHMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgaWYgKCFmaWVsZC5oYXNBdHRyaWJ1dGUodGhpcy5hdHRycy5TSE9XX1BMQUNFSE9MREVSKSkge1xuICAgICAgICAgIGZpZWxkLmRhdGFzZXQucGxhY2Vob2xkZXIgPSBmaWVsZC5wbGFjZWhvbGRlcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRm9jdXNpbihlKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICBpZiAodGFyZ2V0LnRhZ05hbWUgPT09ICdJTlBVVCcgfHwgdGFyZ2V0LnRhZ05hbWUgPT09ICdURVhUQVJFQScpIHtcbiAgICAgIGlmICh0YXJnZXQuZGF0YXNldC5wbGFjZWhvbGRlcikgdGFyZ2V0LnBsYWNlaG9sZGVyID0gJyc7XG5cbiAgICAgIGlmICghdGFyZ2V0Lmhhc0F0dHJpYnV0ZSh0aGlzLmF0dHJzLklHTk9SRV9GT0NVUykpIHtcbiAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc2VzLkhBU19GT0NVUyk7XG4gICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc2VzLkhBU19GT0NVUyk7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5IQVNfRVJST1IpO1xuICAgICAgICB0YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5IQVNfRVJST1IpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbW92ZUVycm9yKHRhcmdldCk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRm9jdXNvdXQoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGlmICh0YXJnZXQudGFnTmFtZSA9PT0gJ0lOUFVUJyB8fCB0YXJnZXQudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xuICAgICAgaWYgKHRhcmdldC5kYXRhc2V0LnBsYWNlaG9sZGVyKSB7XG4gICAgICAgIHRhcmdldC5wbGFjZWhvbGRlciA9IHRhcmdldC5kYXRhc2V0LnBsYWNlaG9sZGVyO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRhcmdldC5oYXNBdHRyaWJ1dGUodGhpcy5hdHRycy5JR05PUkVfRk9DVVMpKSB7XG4gICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5IQVNfRk9DVVMpO1xuICAgICAgICB0YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuY2xhc3Nlcy5IQVNfRk9DVVMpO1xuICAgICAgfVxuICAgICAgaWYgKHRhcmdldC5oYXNBdHRyaWJ1dGUodGhpcy5hdHRycy5WQUxJREFURSkpIHtcbiAgICAgICAgdGhpcy52YWxpZGF0ZUZpZWxkKHRhcmdldCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvLyBzYXZlIHBsYWNlaG9sZGVyIGluIGRhdGEgYXR0cmlidXRlXG4gICAgdGhpcy5zYXZlUGxhY2Vob2xkZXIoKTtcblxuICAgIC8vIGhhbmRsZSBzdWJtaXRpb25cbiAgICBuZXcgRm9ybVN1Ym1pdGlvbigpO1xuXG4gICAgLy8gZXZlbnRzXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdmb2N1c2luJywgdGhpcy5oYW5kbGVGb2N1c2luLmJpbmQodGhpcykpO1xuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXNvdXQnLCB0aGlzLmhhbmRsZUZvY3Vzb3V0LmJpbmQodGhpcykpO1xuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm5ldyBGb3JtRmllbGRzKCk7XG4iLCJpbXBvcnQgeyBzZXRIYXNoLCBnZXRIYXNoIH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNsYXNzIFRhYnMge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmF0dHJzID0ge1xuICAgICAgVEFCUzogJ2RhdGEtdGFicycsXG4gICAgICBJTkRFWDogJ2RhdGEtdGFicy1pbmRleCcsXG4gICAgICBUSVRMRVM6ICdkYXRhLXRhYnMtdGl0bGVzJyxcbiAgICAgIFRJVExFOiAnZGF0YS10YWJzLXRpdGxlJyxcbiAgICAgIFRBQl9JVEVNOiAnZGF0YS10YWJzLWl0ZW0nLFxuICAgICAgQk9EWTogJ2RhdGEtdGFicy1ib2R5JyxcbiAgICAgIEhBU0g6ICdkYXRhLXRhYnMtaGFzaCcsXG4gICAgfTtcbiAgICB0aGlzLmNsYXNzZXMgPSB7XG4gICAgICBJTklUOiAnX3RhYnMtaW5pdCcsXG4gICAgICBBQ1RJVkU6ICdfaXMtYWN0aXZlJyxcbiAgICAgIE1PREFMOiAnbW9kYWwnLFxuICAgIH07XG4gICAgdGhpcy50YWJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtdGFic11gKTtcbiAgICB0aGlzLmFjdGl2ZUhhc2ggPSBbXTtcblxuICAgIGlmICh0aGlzLnRhYnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBoYXNoID0gZ2V0SGFzaCgpO1xuXG4gICAgICBpZiAoaGFzaCAmJiBoYXNoLnN0YXJ0c1dpdGgoJ3RhYi0nKSkge1xuICAgICAgICBhY3RpdmVIYXNoID0gaGFzaC5yZXBsYWNlKCd0YWItJywgJycpLnNwbGl0KCctJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudGFicy5mb3JFYWNoKCh0YWJzQmxvY2ssIGluZGV4KSA9PiB7XG4gICAgICAgIHRhYnNCbG9jay5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5JTklUKTtcbiAgICAgICAgdGFic0Jsb2NrLnNldEF0dHJpYnV0ZSh0aGlzLmF0dHJzLklOREVYLCBpbmRleCk7XG4gICAgICAgIHRhYnNCbG9jay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2V0QWN0aW9ucy5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5pbml0KHRhYnNCbG9jayk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzZXRTdGF0dXModGFic0Jsb2NrKSB7XG4gICAgbGV0IHRpdGxlcyA9IHRhYnNCbG9jay5xdWVyeVNlbGVjdG9yQWxsKGBbJHt0aGlzLmF0dHJzLlRJVExFfV1gKTtcbiAgICBsZXQgY29udGVudCA9IHRhYnNCbG9jay5xdWVyeVNlbGVjdG9yQWxsKGBbJHt0aGlzLmF0dHJzLlRBQl9JVEVNfV1gKTtcbiAgICBjb25zdCBpbmRleCA9IHRhYnNCbG9jay5kYXRhc2V0LnRhYnNJbmRleDtcblxuICAgIGlmIChjb250ZW50Lmxlbmd0aCkge1xuICAgICAgY29uc3QgaGFzSGFzaCA9IHRhYnNCbG9jay5oYXNBdHRyaWJ1dGUodGhpcy5hdHRycy5IQVNIKTtcblxuICAgICAgY29udGVudCA9IEFycmF5LmZyb20oY29udGVudCkuZmlsdGVyKFxuICAgICAgICBpdGVtID0+IGl0ZW0uY2xvc2VzdChgWyR7dGhpcy5hdHRycy5UQUJTfV1gKSA9PT0gdGFic0Jsb2NrXG4gICAgICApO1xuXG4gICAgICB0aXRsZXMgPSBBcnJheS5mcm9tKHRpdGxlcykuZmlsdGVyKFxuICAgICAgICBpdGVtID0+IGl0ZW0uY2xvc2VzdChgWyR7dGhpcy5hdHRycy5UQUJTfV1gKSA9PT0gdGFic0Jsb2NrXG4gICAgICApO1xuXG4gICAgICBjb250ZW50LmZvckVhY2goKGl0ZW0sIGluZHgpID0+IHtcbiAgICAgICAgaWYgKHRpdGxlc1tpbmR4XS5jbGFzc0xpc3QuY29udGFpbnModGhpcy5jbGFzc2VzLkFDVElWRSkpIHtcbiAgICAgICAgICBpdGVtLmhpZGRlbiA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKGhhc0hhc2ggJiYgIWl0ZW0uY2xvc2VzdChgLiR7dGhpcy5jbGFzc2VzLk1PREFMfWApKSB7XG4gICAgICAgICAgICBzZXRIYXNoKGB0YWItJHtpbmRleH0tJHtpbmR4fWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtLmhpZGRlbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHNldEFjdGlvbnMoZSkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgaWYgKHRhcmdldC5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRJVExFfV1gKSkge1xuICAgICAgY29uc3QgdGl0bGUgPSB0YXJnZXQuY2xvc2VzdChgWyR7dGhpcy5hdHRycy5USVRMRX1dYCk7XG4gICAgICBjb25zdCB0YWJzQmxvY2sgPSB0aXRsZS5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRBQlN9XWApO1xuXG4gICAgICBpZiAoIXRpdGxlLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLmNsYXNzZXMuQUNUSVZFKSkge1xuICAgICAgICBsZXQgYWN0aXZlVGl0bGUgPSB0YWJzQmxvY2sucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICBgWyR7dGhpcy5hdHRycy5USVRMRX1dLiR7dGhpcy5jbGFzc2VzLkFDVElWRX1gXG4gICAgICAgICk7XG5cbiAgICAgICAgYWN0aXZlVGl0bGUubGVuZ3RoXG4gICAgICAgICAgPyAoYWN0aXZlVGl0bGUgPSBBcnJheS5mcm9tKGFjdGl2ZVRpdGxlKS5maWx0ZXIoXG4gICAgICAgICAgICAgIGl0ZW0gPT4gaXRlbS5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRBQlN9XWApID09PSB0YWJzQmxvY2tcbiAgICAgICAgICAgICkpXG4gICAgICAgICAgOiBudWxsO1xuICAgICAgICBhY3RpdmVUaXRsZS5sZW5ndGhcbiAgICAgICAgICA/IGFjdGl2ZVRpdGxlWzBdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5jbGFzc2VzLkFDVElWRSlcbiAgICAgICAgICA6IG51bGw7XG4gICAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQodGhpcy5jbGFzc2VzLkFDVElWRSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdHVzKHRhYnNCbG9jayk7XG4gICAgICB9XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICBpbml0KHRhYnNCbG9jaykge1xuICAgIGxldCB0aXRsZXMgPSB0YWJzQmxvY2sucXVlcnlTZWxlY3RvckFsbChgWyR7dGhpcy5hdHRycy5USVRMRVN9XT4qYCk7XG4gICAgbGV0IGNvbnRlbnQgPSB0YWJzQmxvY2sucXVlcnlTZWxlY3RvckFsbChgWyR7dGhpcy5hdHRycy5CT0RZfV0+KmApO1xuICAgIGNvbnN0IGluZGV4ID0gdGFic0Jsb2NrLmRhdGFzZXQudGFic0luZGV4O1xuICAgIGNvbnN0IGFjdGl2ZUhhc2hCbG9jayA9IHRoaXMuYWN0aXZlSGFzaFswXSA9PSBpbmRleDtcblxuICAgIGlmIChhY3RpdmVIYXNoQmxvY2spIHtcbiAgICAgIGNvbnN0IGFjdGl2ZVRpdGxlID0gdGFic0Jsb2NrLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGBbJHt0aGlzLmF0dHJzLlRJVExFU31dPi4ke3RoaXMuY2xhc3Nlcy5BQ1RJVkV9YFxuICAgICAgKTtcbiAgICAgIGFjdGl2ZVRpdGxlID8gYWN0aXZlVGl0bGUuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLmNsYXNzZXMuQUNUSVZFKSA6IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnQubGVuZ3RoKSB7XG4gICAgICBjb250ZW50ID0gQXJyYXkuZnJvbShjb250ZW50KS5maWx0ZXIoXG4gICAgICAgIGl0ZW0gPT4gaXRlbS5jbG9zZXN0KGBbJHt0aGlzLmF0dHJzLlRBQlN9XWApID09PSB0YWJzQmxvY2tcbiAgICAgICk7XG4gICAgICB0aXRsZXMgPSBBcnJheS5mcm9tKHRpdGxlcykuZmlsdGVyKFxuICAgICAgICBpdGVtID0+IGl0ZW0uY2xvc2VzdChgWyR7dGhpcy5hdHRycy5UQUJTfV1gKSA9PT0gdGFic0Jsb2NrXG4gICAgICApO1xuXG4gICAgICBjb250ZW50LmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIHRpdGxlc1tpbmRleF0uc2V0QXR0cmlidXRlKHRoaXMuYXR0cnMuVElUTEUsICcnKTtcbiAgICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUodGhpcy5hdHRycy5UQUJfSVRFTSwgJycpO1xuXG4gICAgICAgIGlmIChhY3RpdmVIYXNoQmxvY2sgJiYgaW5kZXggPT0gdGhpcy5hY3RpdmVIYXNoWzFdKSB7XG4gICAgICAgICAgdGl0bGVzW2luZGV4XS5jbGFzc0xpc3QuYWRkKHRoaXMuY2xhc3Nlcy5BQ1RJVkUpO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW0uaGlkZGVuID0gIXRpdGxlc1tpbmRleF0uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMuY2xhc3Nlcy5BQ1RJVkUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm5ldyBUYWJzKCk7XG4iLCIvKipcbiAqIHNldCBoYXNoIHRvIHVybFxuICogQHBhcmFtIHtzdHJpbmd9IGhhc2hcbiAqL1xuZXhwb3J0IGNvbnN0IHNldEhhc2ggPSBoYXNoID0+IHtcbiAgaGFzaCA9IGhhc2ggPyBgIyR7aGFzaH1gIDogd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVswXTtcbiAgaGlzdG9yeS5wdXNoU3RhdGUoJycsICcnLCBoYXNoKTtcbn07XG5cbi8qKlxuICogZ2V0IGhhc2ggZnJvbSB1cmxcbiAqIEByZXR1cm5zIHN0cmluZ1xuICovXG5leHBvcnQgY29uc3QgZ2V0SGFzaCA9ICgpID0+IHtcbiAgaWYgKGxvY2F0aW9uLmhhc2gpIHtcbiAgICByZXR1cm4gbG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xuICB9XG59O1xuXG4vKipcbiAqIGluaXRpYWxpemVzIGhhbWJ1cmdlciBtZW51XG4gKi9cbmV4cG9ydCBjb25zdCBtZW51SW5pdCA9ICgpID0+IHtcbiAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oYW1idXJnZXInKSkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChib2R5TG9ja1N0YXR1cyAmJiBlLnRhcmdldC5jbG9zZXN0KCcuaGFtYnVyZ2VyJykpIHtcbiAgICAgICAgbWVudU9wZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGJvZHlMb2NrU3RhdHVzICYmXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ19tZW51LW9wZW5lZCcpICYmXG4gICAgICAgIChlLnRhcmdldC5jbG9zZXN0KCcubWVudV9fY2xvc2UtYnRuJykgfHwgIWUudGFyZ2V0LmNsb3Nlc3QoJy5tZW51JykpXG4gICAgICApIHtcbiAgICAgICAgbWVudUNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG4vKipcbiAqIG9wZW5zIGhhbWJ1cmdlciBtZW51XG4gKi9cbmV4cG9ydCBjb25zdCBtZW51T3BlbiA9ICgpID0+IHtcbiAgYm9keUxvY2soKTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ19tZW51LW9wZW5lZCcpO1xufTtcbi8qKlxuICogY2xvc2VzIGhhbWJ1cmdlciBtZW51XG4gKi9cbmV4cG9ydCBjb25zdCBtZW51Q2xvc2UgPSAoKSA9PiB7XG4gIGJvZHlVbmxvY2soKTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ19tZW51LW9wZW5lZCcpO1xufTtcblxuLy8gYm9keSBsb2NrXG5leHBvcnQgbGV0IGJvZHlMb2NrU3RhdHVzID0gdHJ1ZTtcbi8qKlxuICogdG9nZ2xlcyBib2R5IGxvY2tcbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWxheVxuICovXG5leHBvcnQgY29uc3QgYm9keUxvY2tUb2dnbGUgPSAoZGVsYXkgPSA1MDApID0+IHtcbiAgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2xvY2snKSkge1xuICAgIGJvZHlVbmxvY2soZGVsYXkpO1xuICB9IGVsc2Uge1xuICAgIGJvZHlMb2NrKGRlbGF5KTtcbiAgfVxufTtcbi8qKlxuICogdW5sb2NrcyBib2R5XG4gKiBAcGFyYW0ge251bWJlcn0gZGVsYXlcbiAqL1xuZXhwb3J0IGNvbnN0IGJvZHlVbmxvY2sgPSAoZGVsYXkgPSA1MDApID0+IHtcbiAgaWYgKGJvZHlMb2NrU3RhdHVzKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbG9jaycpO1xuICAgIH0sIGRlbGF5KTtcbiAgICBib2R5TG9ja1N0YXR1cyA9IGZhbHNlO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgYm9keUxvY2tTdGF0dXMgPSB0cnVlO1xuICAgIH0sIGRlbGF5KTtcbiAgfVxufTtcbi8qKlxuICogbG9ja3MgYm9keVxuICogQHBhcmFtIHtudW1iZXJ9IGRlbGF5XG4gKi9cbmV4cG9ydCBjb25zdCBib2R5TG9jayA9IChkZWxheSA9IDUwMCkgPT4ge1xuICBpZiAoYm9keUxvY2tTdGF0dXMpIHtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbG9jaycpO1xuXG4gICAgYm9keUxvY2tTdGF0dXMgPSBmYWxzZTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGJvZHlMb2NrU3RhdHVzID0gdHJ1ZTtcbiAgICB9LCBkZWxheSk7XG4gIH1cbn07XG5cbi8qKlxuICogbWFrZSB0aGUgYXJyYXkgdW5pcXVlXG4gKiBAcGFyYW0ge2FycmF5fSBhcnJheVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXF1ZUFycmF5KGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBzZWxmKSB7XG4gICAgcmV0dXJuIHNlbGYuaW5kZXhPZihpdGVtKSA9PT0gaW5kZXg7XG4gIH0pO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge2FycmF5fSBhcnJheVxuICogQHBhcmFtIHtudW1iZXJ9IGRhdGFTZXRWYWx1ZVxuICogcHJvY2VzcyBtZWRpYSByZXF1ZXN0cyBmcm9tIGF0dHJpYnV0ZXNcbiAqL1xuZXhwb3J0IGNvbnN0IGRhdGFNZWRpYVF1ZXJpZXMgPSAoYXJyYXksIGRhdGFTZXRWYWx1ZSkgPT4ge1xuICAvLyBnZXQgb2JqZWN0cyB3aXRoIG1lZGlhIHF1ZXJpZXNcbiAgY29uc3QgbWVkaWEgPSBBcnJheS5mcm9tKGFycmF5KS5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0sIGluZGV4LCBzZWxmKSB7XG4gICAgaWYgKGl0ZW0uZGF0YXNldFtkYXRhU2V0VmFsdWVdKSB7XG4gICAgICByZXR1cm4gaXRlbS5kYXRhc2V0W2RhdGFTZXRWYWx1ZV0uc3BsaXQoJywnKVswXTtcbiAgICB9XG4gIH0pO1xuICAvLyBvYmplY3RzIHdpdGggbWVkaWEgcXVlcmllcyBpbml0aWFsaXphdGlvblxuICBpZiAobWVkaWEubGVuZ3RoKSB7XG4gICAgY29uc3QgYnJlYWtwb2ludHNBcnJheSA9IFtdO1xuICAgIG1lZGlhLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBwYXJhbXMgPSBpdGVtLmRhdGFzZXRbZGF0YVNldFZhbHVlXTtcbiAgICAgIGNvbnN0IGJyZWFrcG9pbnQgPSB7fTtcbiAgICAgIGNvbnN0IHBhcmFtc0FycmF5ID0gcGFyYW1zLnNwbGl0KCcsJyk7XG4gICAgICBicmVha3BvaW50LnZhbHVlID0gcGFyYW1zQXJyYXlbMF07XG4gICAgICBicmVha3BvaW50LnR5cGUgPSBwYXJhbXNBcnJheVsxXSA/IHBhcmFtc0FycmF5WzFdLnRyaW0oKSA6ICdtYXgnO1xuICAgICAgYnJlYWtwb2ludC5pdGVtID0gaXRlbTtcbiAgICAgIGJyZWFrcG9pbnRzQXJyYXkucHVzaChicmVha3BvaW50KTtcbiAgICB9KTtcbiAgICAvLyBnZXQgdW5pcXVlIGJyZWFrcG9pbnRzXG4gICAgbGV0IG1kUXVlcmllcyA9IGJyZWFrcG9pbnRzQXJyYXkubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAnKCcgK1xuICAgICAgICBpdGVtLnR5cGUgK1xuICAgICAgICAnLXdpZHRoOiAnICtcbiAgICAgICAgaXRlbS52YWx1ZSArXG4gICAgICAgICdweCksJyArXG4gICAgICAgIGl0ZW0udmFsdWUgK1xuICAgICAgICAnLCcgK1xuICAgICAgICBpdGVtLnR5cGVcbiAgICAgICk7XG4gICAgfSk7XG4gICAgbWRRdWVyaWVzID0gdW5pcXVlQXJyYXkobWRRdWVyaWVzKTtcbiAgICBjb25zdCBtZFF1ZXJpZXNBcnJheSA9IFtdO1xuXG4gICAgaWYgKG1kUXVlcmllcy5sZW5ndGgpIHtcbiAgICAgIC8vIHdvcmsgd2l0aCBldmVyeSBicmVha3BvaW50XG4gICAgICBtZFF1ZXJpZXMuZm9yRWFjaChicmVha3BvaW50ID0+IHtcbiAgICAgICAgY29uc3QgcGFyYW1zQXJyYXkgPSBicmVha3BvaW50LnNwbGl0KCcsJyk7XG4gICAgICAgIGNvbnN0IG1lZGlhQnJlYWtwb2ludCA9IHBhcmFtc0FycmF5WzFdO1xuICAgICAgICBjb25zdCBtZWRpYVR5cGUgPSBwYXJhbXNBcnJheVsyXTtcbiAgICAgICAgY29uc3QgbWF0Y2hNZWRpYSA9IHdpbmRvdy5tYXRjaE1lZGlhKHBhcmFtc0FycmF5WzBdKTtcbiAgICAgICAgLy8gb2JqZWN0cyB3aXRoIGNvbmRpdGlvbnNcbiAgICAgICAgY29uc3QgaXRlbXNBcnJheSA9IGJyZWFrcG9pbnRzQXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IG1lZGlhQnJlYWtwb2ludCAmJiBpdGVtLnR5cGUgPT09IG1lZGlhVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbWRRdWVyaWVzQXJyYXkucHVzaCh7XG4gICAgICAgICAgaXRlbXNBcnJheSxcbiAgICAgICAgICBtYXRjaE1lZGlhLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1kUXVlcmllc0FycmF5O1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBzbW9vdGhseSBzbGlkZXMgdXBcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNob3dtb3JlXG4gKi9cbmV4cG9ydCBjb25zdCBfc2xpZGVVcCA9ICh0YXJnZXQsIGR1cmF0aW9uID0gNTAwLCBzaG93bW9yZSA9IDApID0+IHtcbiAgaWYgKCF0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdfc2xpZGUnKSkge1xuICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKCdfc2xpZGUnKTtcbiAgICB0YXJnZXQuc3R5bGUudHJhbnNpdGlvblByb3BlcnR5ID0gJ2hlaWdodCwgbWFyZ2luLCBwYWRkaW5nJztcbiAgICB0YXJnZXQuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gZHVyYXRpb24gKyAnbXMnO1xuICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSBgJHt0YXJnZXQub2Zmc2V0SGVpZ2h0fXB4YDtcbiAgICB0YXJnZXQub2Zmc2V0SGVpZ2h0O1xuICAgIHRhcmdldC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgIHRhcmdldC5zdHlsZS5oZWlnaHQgPSBzaG93bW9yZSA/IGAke3Nob3dtb3JlfXJlbWAgOiBgMGA7XG4gICAgdGFyZ2V0LnN0eWxlLnBhZGRpbmdUb3AgPSAwO1xuICAgIHRhcmdldC5zdHlsZS5wYWRkaW5nQm90dG9tID0gMDtcbiAgICB0YXJnZXQuc3R5bGUubWFyZ2luVG9wID0gMDtcbiAgICB0YXJnZXQuc3R5bGUubWFyZ2luQm90dG9tID0gMDtcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0YXJnZXQuaGlkZGVuID0gIXNob3dtb3JlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgIXNob3dtb3JlID8gdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCdoZWlnaHQnKSA6IG51bGw7XG4gICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3BhZGRpbmctdG9wJyk7XG4gICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3BhZGRpbmctYm90dG9tJyk7XG4gICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ21hcmdpbi10b3AnKTtcbiAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnbWFyZ2luLWJvdHRvbScpO1xuICAgICAgIXNob3dtb3JlID8gdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCdvdmVyZmxvdycpIDogbnVsbDtcbiAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgndHJhbnNpdGlvbi1kdXJhdGlvbicpO1xuICAgICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCd0cmFuc2l0aW9uLXByb3BlcnR5Jyk7XG4gICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnX3NsaWRlJyk7XG4gICAgICAvLyBjcmVhdGUgZXZlbnRcbiAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgIG5ldyBDdXN0b21FdmVudCgnc2xpZGVVcERvbmUnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9LCBkdXJhdGlvbik7XG4gIH1cbn07XG5cbi8qKlxuICogc21vb3RobHkgc2xpZGVzIGRvd25cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNob3dtb3JlXG4gKi9cbmV4cG9ydCBjb25zdCBfc2xpZGVEb3duID0gKHRhcmdldCwgZHVyYXRpb24gPSA1MDAsIHNob3dtb3JlID0gMCkgPT4ge1xuICBpZiAoIXRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ19zbGlkZScpKSB7XG4gICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ19zbGlkZScpO1xuICAgIHRhcmdldC5oaWRkZW4gPSB0YXJnZXQuaGlkZGVuID8gZmFsc2UgOiBudWxsO1xuICAgIHNob3dtb3JlID8gdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCdoZWlnaHQnKSA6IG51bGw7XG4gICAgbGV0IGhlaWdodCA9IHRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgdGFyZ2V0LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgdGFyZ2V0LnN0eWxlLmhlaWdodCA9IHNob3dtb3JlID8gYCR7c2hvd21vcmV9cmVtYCA6IGAwYDtcbiAgICB0YXJnZXQuc3R5bGUucGFkZGluZ1RvcCA9IDA7XG4gICAgdGFyZ2V0LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAwO1xuICAgIHRhcmdldC5zdHlsZS5tYXJnaW5Ub3AgPSAwO1xuICAgIHRhcmdldC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAwO1xuICAgIHRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgdGFyZ2V0LnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9ICdoZWlnaHQsIG1hcmdpbiwgcGFkZGluZyc7XG4gICAgdGFyZ2V0LnN0eWxlLnRyYW5zaXRpb25EdXJhdGlvbiA9IGR1cmF0aW9uICsgJ21zJztcbiAgICB0YXJnZXQuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcbiAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3BhZGRpbmctdG9wJyk7XG4gICAgdGFyZ2V0LnN0eWxlLnJlbW92ZVByb3BlcnR5KCdwYWRkaW5nLWJvdHRvbScpO1xuICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnbWFyZ2luLXRvcCcpO1xuICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnbWFyZ2luLWJvdHRvbScpO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnaGVpZ2h0Jyk7XG4gICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ292ZXJmbG93Jyk7XG4gICAgICB0YXJnZXQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RyYW5zaXRpb24tZHVyYXRpb24nKTtcbiAgICAgIHRhcmdldC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgndHJhbnNpdGlvbi1wcm9wZXJ0eScpO1xuICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ19zbGlkZScpO1xuICAgICAgLy8gY3JlYXRlIGV2ZW50XG4gICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoJ3NsaWRlRG93bkRvbmUnLCB7XG4gICAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9LCBkdXJhdGlvbik7XG4gIH1cbn07XG5cbi8qKlxuICogdG9nZ2xlcyBzbW9vdGggc2xpZGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uXG4gKiBAcmV0dXJucyBmdW5jdGlvblxuICovXG5leHBvcnQgY29uc3QgX3NsaWRlVG9nZ2xlID0gKHRhcmdldCwgZHVyYXRpb24gPSA1MDApID0+IHtcbiAgaWYgKHRhcmdldC5oaWRkZW4pIHtcbiAgICByZXR1cm4gX3NsaWRlRG93bih0YXJnZXQsIGR1cmF0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gX3NsaWRlVXAodGFyZ2V0LCBkdXJhdGlvbik7XG4gIH1cbn07XG5cbi8qKlxuICogY29udmVydHMgcmVtIHRvIHBpeGVsc1xuICogQHBhcmFtIHtudW1iZXJ9IHJlbVZhbHVlXG4gKiBAcmV0dXJucyBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbVRvUHgocmVtVmFsdWUpIHtcbiAgY29uc3QgaHRtbEZvbnRTaXplID0gcGFyc2VGbG9hdChcbiAgICBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZm9udFNpemVcbiAgKTtcblxuICBjb25zdCBweFZhbHVlID0gcmVtVmFsdWUgKiBodG1sRm9udFNpemU7XG5cbiAgcmV0dXJuIE1hdGgucm91bmQocHhWYWx1ZSkgKyAncHgnO1xufVxuXG4vKipcbiAqIHJlbW92ZSBjbGFzc2VzIGZyb20gYXJyYXkgaXRlbXNcbiAqIEBwYXJhbSB7YXJyYXl9IGFycmF5XG4gKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXG4gKi9cbmV4cG9ydCBjb25zdCByZW1vdmVDbGFzc2VzID0gKGFycmF5LCBjbGFzc05hbWUpID0+IHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGFycmF5W2ldLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgfVxufTtcbiIsIi8vIEltcG9ydHNcbnZhciBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCIpO1xudmFyIF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCIpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1Sb2JvdG86MzAwLHJlZ3VsYXIsNTAwLDYwMCw3MDAsOTAwJmRpc3BsYXk9c3dhcCk7XCJdKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9VW5ib3VuZGVkOjYwMCZkaXNwbGF5PXN3YXApO1wiXSk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBmb250LWZhY2Uge1xuICBmb250LWZhbWlseTogXCJEcnVrIFdpZGUgQ3lyXCI7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIHNyYzogdXJsKFwiLi9hc3NldHMvZm9udHMvRHJ1a1dpZGVDeXJfbWVkaXVtLndvZmYyXCIpIGZvcm1hdChcIndvZmYyXCIpO1xufVxuQGZvbnQtZmFjZSB7XG4gIGZvbnQtZmFtaWx5OiBcIkdpbHJveVwiO1xuICBmb250LXdlaWdodDogNzAwO1xuICBzcmM6IHVybChcIi4vYXNzZXRzL2ZvbnRzL0dpbHJveV9ib2xkLndvZmYyXCIpIGZvcm1hdChcIndvZmYyXCIpO1xufVxuQGZvbnQtZmFjZSB7XG4gIGZvbnQtZmFtaWx5OiBcIkRydWsgVGV4dCBXaWRlIEN5clwiO1xuICBmb250LXdlaWdodDogNTAwO1xuICBzcmM6IHVybChcIi4vYXNzZXRzL2ZvbnRzL0RydWtUZXh0V2lkZUN5cl9tZWRpdW0ud29mZjJcIikgZm9ybWF0KFwid29mZjJcIik7XG59XG4qLFxuKjo6YmVmb3JlLFxuKjo6YWZ0ZXIge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG5odG1sIHtcbiAgZm9udC1mYW1pbHk6IFwiUm9ib3RvXCI7XG4gIGZvbnQtc2l6ZTogMC41MjA4MzM1dnc7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgLXdlYmtpdC1hbmltYXRpb246IGJ1Z2ZpeCBpbmZpbml0ZSAxcztcbiAgbGluZS1oZWlnaHQ6IDEuMjtcbiAgbWFyZ2luOiAwO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHBhZGRpbmc6IDA7XG59XG5cbmJvZHkge1xuICBmb250LXN0eWxlOiBub3JtYWw7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIC13ZWJraXQtYW5pbWF0aW9uOiBidWdmaXggaW5maW5pdGUgMXM7XG4gIGxpbmUtaGVpZ2h0OiAxLjI7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgaGVpZ2h0OiAxMDAlO1xuICBmb250LXNpemU6IDEuOHJlbTtcbiAgY29sb3I6ICNmZmZmZmY7XG4gIGJhY2tncm91bmQtY29sb3I6ICMxOTFjMjA7XG59XG5cbmlucHV0LFxudGV4dGFyZWEge1xuICAtd2Via2l0LWFuaW1hdGlvbjogYnVnZml4IGluZmluaXRlIDFzO1xuICBsaW5lLWhlaWdodDogaW5oZXJpdDtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyOiBub25lO1xuICBjb2xvcjogaW5oZXJpdDtcbn1cblxuYSB7XG4gIGNvbG9yOiB1bnNldDtcbn1cblxuYSxcbmE6aG92ZXIge1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59XG5cbmJ1dHRvbixcbmlucHV0LFxuYSxcbnRleHRhcmVhIHtcbiAgb3V0bGluZTogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBmb250OiBpbmhlcml0O1xufVxuYnV0dG9uOmZvY3VzLFxuaW5wdXQ6Zm9jdXMsXG5hOmZvY3VzLFxudGV4dGFyZWE6Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xufVxuYnV0dG9uOmFjdGl2ZSxcbmlucHV0OmFjdGl2ZSxcbmE6YWN0aXZlLFxudGV4dGFyZWE6YWN0aXZlIHtcbiAgb3V0bGluZTogbm9uZTtcbn1cblxuaDEsXG5oMixcbmgzLFxuaDQsXG5oNSxcbmg2IHtcbiAgZm9udDogaW5oZXJpdDtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xufVxuXG5wIHtcbiAgbWFyZ2luLXRvcDogMDtcbiAgbWFyZ2luLWJvdHRvbTogMDtcbn1cblxuaW1nIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogYXV0bztcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbmJ1dHRvbiB7XG4gIGJvcmRlcjogbm9uZTtcbiAgY29sb3I6IGluaGVyaXQ7XG4gIGZvbnQ6IGluaGVyaXQ7XG4gIHRleHQtYWxpZ246IGluaGVyaXQ7XG4gIHBhZGRpbmc6IDA7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG51bCB7XG4gIHBhZGRpbmc6IDA7XG4gIG1hcmdpbjogMDtcbn1cblxudWwgbGkge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG5cbi5jb250YWluZXIge1xuICB3aWR0aDogMTY0cmVtO1xuICBtYXJnaW46IDAgYXV0bztcbn1cblxuaW5wdXRbdHlwZT1udW1iZXJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuaW5wdXRbdHlwZT1udW1iZXJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICBtYXJnaW46IDA7XG59XG5cbmlucHV0W3R5cGU9bnVtYmVyXSB7XG4gIC1tb3otYXBwZWFyYW5jZTogdGV4dGZpZWxkO1xufVxuXG5zdmcsXG5pbWcge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiBhdXRvO1xuICBvYmplY3QtZml0OiBjb250YWluO1xufVxuaHRtbC5sb2NrLFxuaHRtbC5sb2NrIGJvZHkge1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB0b3VjaC1hY3Rpb246IG5vbmU7XG59XG5cbmh0bWwsXG5ib2R5IHtcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xufVxuXG5tYWluIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4ud3JhcHBlciB7XG4gIG1hcmdpbjogMCBhdXRvO1xuICBtYXgtd2lkdGg6IDE5MjBweDtcbn1cblxuLmgge1xuICBmb250LWZhbWlseTogXCJEcnVrIFdpZGUgQ3lyXCI7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG4uaF8xIHtcbiAgZm9udC1zaXplOiA2cmVtO1xuICBsaW5lLWhlaWdodDogMTIwJTtcbiAgbGV0dGVyLXNwYWNpbmc6IDMlO1xufVxuLmhfMiB7XG4gIGZvbnQtc2l6ZTogNS4ycmVtO1xuICBsaW5lLWhlaWdodDogMTMwJTtcbiAgbGV0dGVyLXNwYWNpbmc6IDIlO1xufVxuLmhfMyB7XG4gIGZvbnQtc2l6ZTogMy42cmVtO1xuICBsaW5lLWhlaWdodDogMTMwJTtcbiAgbGV0dGVyLXNwYWNpbmc6IDIlO1xufVxuXG4uc3VidGl0bGUge1xuICBmb250LWZhbWlseTogUm9ib3RvO1xuICBmb250LXdlaWdodDogNTAwO1xuICBmb250LXNpemU6IDIuNHJlbTtcbiAgbGluZS1oZWlnaHQ6IDE0MCU7XG59XG5cbi50eHQge1xuICBsaW5lLWhlaWdodDogMTQwJTtcbn1cbi50eHRfMTQge1xuICBmb250LXNpemU6IDEuNHJlbTtcbn1cblxuLmJ0biB7XG4gIG1hcmdpbjogMnJlbTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBwYWRkaW5nOiAycmVtIDRyZW07XG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYm9yZGVyLXJhZGl1czogMC44cmVtO1xuICBiYWNrZ3JvdW5kOiByYWRpYWwtZ3JhZGllbnQoNTUuNjMlIDE5MS4xNSUgYXQgNjAuOTQlIDAlLCByZ2JhKDI1NCwgMjU0LCAyNTQsIDAuNykgMCUsIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCkgMTAwJSk7XG4gIGNvbG9yOiAjZmZmZmZmO1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuLmJ0bjo6YmVmb3JlLCAuYnRuOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgd2lkdGg6IGNhbGMoMTAwJSAtIDJweCk7XG4gIGhlaWdodDogY2FsYygxMDAlIC0gMnB4KTtcbiAgYm9yZGVyLXJhZGl1czogMC44cmVtO1xuICBib3gtc2hhZG93OiAwIDAuNnJlbSAxLjVyZW0gcmdiYSgwLCAwLCAwLCAwLjI1KTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG59XG4uYnRuOjpiZWZvcmUge1xuICBiYWNrZ3JvdW5kOiByYWRpYWwtZ3JhZGllbnQoNTQlIDEwMCUgYXQgNTAlIDAlLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMykgMCUsIHJnYmEoMCwgMCwgMCwgMCkgMTAwJSksIGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNmZjZjMDEgMCUsICNiMzRmMDYgMTAwJSk7XG59XG4uYnRuOjphZnRlciB7XG4gIG9wYWNpdHk6IDA7XG4gIGJhY2tncm91bmQ6IHJhZGlhbC1ncmFkaWVudCg1NCUgMTAwJSBhdCA1MCUgMCUsIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC40OCkgMCUsIHJnYmEoMCwgMCwgMCwgMCkgMTAwJSksIGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNkYzVlMDEgMCUsICNhZTRhMDEgMTAwJSk7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcyBlYXNlO1xufVxuLmJ0bi5faXMtZGlzYWJsZWQ6OmJlZm9yZSB7XG4gIGJhY2tncm91bmQ6IHJhZGlhbC1ncmFkaWVudCg1NCUgMTAwJSBhdCA1MCUgMCUsIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKSAwJSwgcmdiYSgwLCAwLCAwLCAwKSAxMDAlKSwgbGluZWFyLWdyYWRpZW50KDE4MGRlZywgI2IwYjBiMCAwJSwgIzZjNmM2YyAxMDAlKTtcbn1cbi5idG4uX2lzLWRpc2FibGVkOjphZnRlciB7XG4gIGNvbnRlbnQ6IG5vbmU7XG59XG4uYnRuLl9pcy1kaXNhYmxlZCAuYnRuX190eHQge1xuICBjb2xvcjogIzZmNmY2Zjtcbn1cbi5idG5fX3R4dCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgei1pbmRleDogMjtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgbGluZS1oZWlnaHQ6IDExMCU7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG5cbi5pY29uIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXg6IDAgMCA3cmVtO1xuICB3aWR0aDogN3JlbTtcbiAgaGVpZ2h0OiA3cmVtO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJveC1zaGFkb3c6IGluc2V0IDAgLTAuMTZyZW0gMC44cmVtIHJnYmEoMjU1LCAxNjgsIDAsIDAuNDgpLCBpbnNldCAwLjMycmVtIDAuMzJyZW0gMC4xNnJlbSByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigwLjVyZW0pO1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuLmljb246OmJlZm9yZSwgLmljb246OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3R0b206IDA7XG59XG4uaWNvbjo6YmVmb3JlIHtcbiAgbGVmdDogNTAlO1xuICBoZWlnaHQ6IDIuNXJlbTtcbiAgd2lkdGg6IDEyNSU7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCguL2Fzc2V0cy9pbWFnZXMvYmcvYnRuLWdyYWRpZW50LnN2Zyk7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbn1cbi5pY29uOjphZnRlciB7XG4gIGxlZnQ6IDA7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg2NGRlZywgI2UzNWQxYiAyMS42NCUsICNjZDU5MWYgNjkuMzElKTtcbiAgb3BhY2l0eTogMDtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDAuOHJlbSk7XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcyBlYXNlO1xufVxuLmljb25fd2hpdGUge1xuICBib3gtc2hhZG93OiBpbnNldCAwIC0wLjE2cmVtIDAuOHJlbSByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNDgpLCBpbnNldCAwLjMycmVtIDAuMzJyZW0gMC4xNnJlbSByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XG59XG4uaWNvbl93aGl0ZTo6YWZ0ZXIge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoNjRkZWcsICNmZmZmZmYgMjEuNjQlLCAjZWZlZmVmIDY5LjMxJSk7XG59XG4uaWNvbl93aGl0ZTo6YmVmb3JlIHtcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4vYXNzZXRzL2ltYWdlcy9iZy9idG4tZ3JhZGllbnQtd2hpdGUuc3ZnKTtcbn1cbi5pY29uLl9pcy1kaXNhYmxlZCB7XG4gIGJveC1zaGFkb3c6IGluc2V0IDAgLTAuMTZyZW0gMC44cmVtIHJnYmEoMTczLCAxNzMsIDE3MywgMC40OCksIGluc2V0IDAuMzJyZW0gMC4zMnJlbSAwLjE2cmVtIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcbn1cbi5pY29uLl9pcy1kaXNhYmxlZCBzdmcgcGF0aCB7XG4gIGZpbGw6ICM2ZjZmNmY7XG59XG4uaWNvbi5faXMtZGlzYWJsZWQ6OmFmdGVyIHtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDY0ZGVnLCAjYjViNWI1IDIxLjY0JSwgIzgxODE4MSA2OS4zMSUpO1xufVxuLmljb24uX2lzLWRpc2FibGVkOjpiZWZvcmUge1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi9hc3NldHMvaW1hZ2VzL2JnL2J0bi1ncmFkaWVudC13aGl0ZS5zdmcpO1xufVxuLmljb24gc3ZnIHtcbiAgd2lkdGg6IDJyZW07XG4gIGhlaWdodDogMnJlbTtcbn1cbi5pY29uIHN2ZyBwYXRoIHtcbiAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIGVhc2U7XG59XG4uaWNvbiBzdmc6Zmlyc3QtY2hpbGQge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IDM7XG59XG4uaWNvbiBzdmc6bGFzdC1jaGlsZCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMjtcbiAgdG9wOiA1MCU7XG4gIGxlZnQ6IDUwJTtcbiAgZmlsdGVyOiBibHVyKDAuMnJlbSk7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xufVxuXG4udGFic19fbmF2aWdhdGlvbiB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiBub3dyYXA7XG59XG4udGFiIHtcbiAgcGFkZGluZy1sZWZ0OiAzLjRyZW07XG4gIHBhZGRpbmctcmlnaHQ6IDMuNHJlbTtcbiAgcGFkZGluZy1ib3R0b206IDEuNXJlbTtcbiAgYm9yZGVyLWJvdHRvbTogMC4zcmVtIHNvbGlkICM2ZjZmNmY7XG4gIGZvbnQtc2l6ZTogMnJlbTtcbiAgbGluZS1oZWlnaHQ6IDE7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgY29sb3I6ICM2ZjZmNmY7XG4gIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgZWFzZSwgYm9yZGVyLWJvdHRvbSAwLjNzIGVhc2U7XG59XG4udGFiLl9pcy1hY3RpdmUge1xuICBib3JkZXItYm90dG9tOiAwLjNyZW0gc29saWQgI2ZmNmMwMTtcbiAgY29sb3I6ICNmZjZjMDE7XG59XG5cbmlucHV0W3R5cGU9dGV4dF0sXG5pbnB1dFt0eXBlPWVtYWlsXSxcbmlucHV0W3R5cGU9dGVsXSxcbnRleHRhcmVhIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAtbW96LWFwcGVhcmFuY2U6IG5vbmU7XG4gIGFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbnRleHRhcmVhOmZvY3VzLFxuaW5wdXQ6Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xufVxuXG4uaW5wdXQge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHJvdy1nYXA6IDEuMXJlbTtcbn1cbi5pbnB1dF9fZmllbGQge1xuICBwYWRkaW5nLWJvdHRvbTogMnJlbTtcbiAgcGFkZGluZy1yaWdodDogMnJlbTtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBsaW5lLWhlaWdodDogMTtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICM2ZjZmNmY7XG4gIHRyYW5zaXRpb246IGJvcmRlci1ib3R0b20gMC4zcyBlYXNlO1xufVxuLmlucHV0X19maWVsZDo6cGxhY2Vob2xkZXIge1xuICBjb2xvcjogIzZmNmY2ZjtcbiAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyBlYXNlO1xufVxuLmlucHV0X19oaW50IHtcbiAgZGlzcGxheTogbm9uZTtcbiAgY29sb3I6ICNlMjA3MDc7XG59XG4uaW5wdXQuX2hhcy1mb2N1cyAuaW5wdXRfX2ZpZWxkIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNmZmZmZmY7XG59XG4uaW5wdXQuX2hhcy1lcnJvciAuaW5wdXRfX2ZpZWxkIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlMjA3MDc7XG59XG4uaW5wdXQuX2hhcy1lcnJvciAuaW5wdXRfX2hpbnQge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMTkyMHB4KXtcbiAgaHRtbCB7XG4gICAgZm9udC1zaXplOiAxMHB4O1xuICB9XG59XG5AbWVkaWEgKG1heC13aWR0aDogNDhlbSl7XG4gIGh0bWwge1xuICAgIGZvbnQtc2l6ZTogNXB4O1xuICAgIGZvbnQtc2l6ZTogMS41NjI1dnc7XG4gICAgZm9udC1zaXplOiAxLjMzMzMzMzMzMzN2dztcbiAgICAtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XG4gIH1cbiAgYm9keSB7XG4gICAgZm9udC1zaXplOiAzcmVtO1xuICAgIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcbiAgfVxuICAuY29udGFpbmVyIHtcbiAgICBwYWRkaW5nOiAwIDJyZW07XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cbiAgLmhfMSB7XG4gICAgZm9udC1zaXplOiA0LjRyZW07XG4gIH1cbiAgLmhfMiB7XG4gICAgZm9udC1zaXplOiA0cmVtO1xuICB9XG4gIC5oXzMge1xuICAgIGZvbnQtc2l6ZTogMy42cmVtO1xuICB9XG4gIC5zdWJ0aXRsZSB7XG4gICAgZm9udC1zaXplOiAzLjZyZW07XG4gIH1cbiAgLnR4dF8xNCB7XG4gICAgZm9udC1zaXplOiAyLjhyZW07XG4gIH1cbiAgLmJ0biB7XG4gICAgcGFkZGluZzogNHJlbSA4cmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDEuNnJlbTtcbiAgfVxuICAuYnRuOjpiZWZvcmUsIC5idG46OmFmdGVyIHtcbiAgICBib3JkZXItcmFkaXVzOiAxLjZyZW07XG4gIH1cbiAgLmJ0bl9fdHh0IHtcbiAgICBmb250LXNpemU6IDMuNnJlbTtcbiAgICBsaW5lLWhlaWdodDogNHJlbTtcbiAgfVxuICAuaWNvbiB7XG4gICAgZmxleDogMCAwIDEzcmVtO1xuICAgIHdpZHRoOiAxM3JlbTtcbiAgICBoZWlnaHQ6IDEzcmVtO1xuICAgIGJveC1zaGFkb3c6IGluc2V0IDAgLTAuNDhyZW0gMi40cmVtIHJnYmEoMjU1LCAxNjgsIDAsIDAuNDgpLCBpbnNldCAwLjk2cmVtIDAuOTZyZW0gMC40OHJlbSByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XG4gICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDEuNHJlbSk7XG4gIH1cbiAgLmljb24gc3ZnIHtcbiAgICB3aWR0aDogNXJlbTtcbiAgICBoZWlnaHQ6IDVyZW07XG4gIH1cbiAgLnRhYnNfX25hdmlnYXRpb24ge1xuICAgIG92ZXJmbG93LXg6IGF1dG87XG4gICAgLW1zLW92ZXJmbG93LXN0eWxlOiBub25lOyAvKiBJbnRlcm5ldCBFeHBsb3JlciAxMCsgKi9cbiAgICBzY3JvbGxiYXItd2lkdGg6IG5vbmU7XG4gIH1cbiAgLnRhYnNfX25hdmlnYXRpb246Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICBkaXNwbGF5OiBub25lOyAvKiBTYWZhcmkgYW5kIENocm9tZSAqL1xuICB9XG4gIC50YWIge1xuICAgIHBhZGRpbmctbGVmdDogNXJlbTtcbiAgICBwYWRkaW5nLXJpZ2h0OiA1cmVtO1xuICAgIHBhZGRpbmctYm90dG9tOiAzLjZyZW07XG4gICAgYm9yZGVyLWJvdHRvbTogMC40cmVtIHNvbGlkICM2ZjZmNmY7XG4gICAgZm9udC1zaXplOiAzLjJyZW07XG4gIH1cbiAgLnRhYi5faXMtYWN0aXZlIHtcbiAgICBib3JkZXItYm90dG9tOiAwLjRyZW0gc29saWQgI2ZmNmMwMTtcbiAgfVxuICAuaW5wdXRfX2ZpZWxkIHtcbiAgICBwYWRkaW5nLWJvdHRvbTogMy4ycmVtO1xuICAgIHBhZGRpbmctcmlnaHQ6IDMuMnJlbTtcbiAgfVxufVxuQG1lZGlhIChhbnktaG92ZXI6IGhvdmVyKXtcbiAgLmJ0bjpub3QoLmJ0bi5faXMtZGlzYWJsZWQpOmhvdmVyOjphZnRlciB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuICAuaWNvbjpub3QoLmljb24uX2lzLWRpc2FibGVkLCAuaWNvbl93aGl0ZSk6aG92ZXI6OmFmdGVyIHtcbiAgICBvcGFjaXR5OiAxO1xuICB9XG4gIC5pY29uOm5vdCguaWNvbi5faXMtZGlzYWJsZWQsIC5pY29uX3doaXRlKTpob3ZlciBzdmcgcGF0aCB7XG4gICAgZmlsbDogI2ZmZmZmZjtcbiAgfVxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3Njc3MvZm9udHMuc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3Njc3Mvc3R5bGUuc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3Njc3Mvc2V0LnNjc3NcIixcIndlYnBhY2s6Ly8uL3NyYy91aS9zdHlsZXMvX3R5cG8uc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3VpL3N0eWxlcy9fYnV0dG9uLnNjc3NcIixcIndlYnBhY2s6Ly8uL3NyYy91aS9zdHlsZXMvX2ljb24uc2Nzc1wiLFwid2VicGFjazovLy4vc3JjL3VpL3N0eWxlcy9fdGFicy5zY3NzXCIsXCJ3ZWJwYWNrOi8vLi9zcmMvdWkvc3R5bGVzL19pbnB1dC5zY3NzXCIsXCI8bm8gc291cmNlPlwiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLDRCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxtRUFBQTtBQ0dGO0FEQUE7RUFDRSxxQkFBQTtFQUNBLGdCQUFBO0VBQ0EsNERBQUE7QUNFRjtBRENBO0VBQ0UsaUNBQUE7RUFDQSxnQkFBQTtFQUNBLHVFQUFBO0FDQ0Y7QUNoQkE7OztFQUdFLHNCQUFBO0FEa0JGOztBQ2hCQTtFQUNFLHFCQUFBO0VBQ0Esc0JBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EscUNBQUE7RUFDQSxnQkFBQTtFQUNBLFNBQUE7RUFDQSxZQUFBO0VBQ0Es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dUZGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6ICdEcnVrIFdpZGUgQ3lyJztcXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICBzcmM6IHVybCgnLi9hc3NldHMvZm9udHMvRHJ1a1dpZGVDeXJfbWVkaXVtLndvZmYyJykgZm9ybWF0KCd3b2ZmMicpO1xcbn1cXG5cXG5AZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiAnR2lscm95JztcXG4gIGZvbnQtd2VpZ2h0OiA3MDA7XFxuICBzcmM6IHVybCgnLi9hc3NldHMvZm9udHMvR2lscm95X2JvbGQud29mZjInKSBmb3JtYXQoJ3dvZmYyJyk7XFxufVxcblxcbkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6ICdEcnVrIFRleHQgV2lkZSBDeXInO1xcbiAgZm9udC13ZWlnaHQ6IDUwMDtcXG4gIHNyYzogdXJsKCcuL2Fzc2V0cy9mb250cy9EcnVrVGV4dFdpZGVDeXJfbWVkaXVtLndvZmYyJykgZm9ybWF0KCd3b2ZmMicpO1xcbn1cXG5cIixcIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBtaXhpbnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuXFxuQGltcG9ydCAnLi9taXhpbnMnO1xcblxcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHZhcmlhYmxlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuXFxuLy8gY29sb3JzXFxuJHdoaXRlOiAjZmZmZmZmO1xcbiRibGFjazogIzExMTMxNjtcXG4kYmdDb2xvcjogIzE5MWMyMDtcXG4kZ3JheTogIzZmNmY2ZjtcXG4kb3JhbmdlOiAjZmY2YzAxO1xcbiRyZWQ6ICNlMjA3MDc7XFxuXFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmb250cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cXG5AaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9Um9ib3RvOjMwMCxyZWd1bGFyLDUwMCw2MDAsNzAwLDkwMCZkaXNwbGF5PXN3YXApO1xcbkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1VbmJvdW5kZWQ6NjAwJmRpc3BsYXk9c3dhcCk7XFxuXFxuLy8gbG9jYWwgZm9udHNcXG5AaW1wb3J0ICcuL2ZvbnRzJztcXG5cXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGJhc2Ugc3R5bGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcblxcbi8vIGJhc2Ugc2NzcyBmaWxlXFxuQGltcG9ydCAnLi9zZXQnO1xcblxcbi8vIGh0bWxcXG5odG1sLmxvY2ssXFxuaHRtbC5sb2NrIGJvZHkge1xcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcXG4gIHRvdWNoLWFjdGlvbjogbm9uZTtcXG59XFxuaHRtbCxcXG5ib2R5IHtcXG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcXG59XFxuXFxuLy8gbWFpblxcbm1haW4ge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4ud3JhcHBlciB7XFxuICBtYXJnaW46IDAgYXV0bztcXG4gIG1heC13aWR0aDogMTkyMHB4O1xcbn1cXG5cXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxcblxcbi8vIGhlYWRlciAvIGZvb3RlclxcbkBpbXBvcnQgJy4vc2VjdGlvbnMvaGVhZGVyJztcXG5AaW1wb3J0ICcuL3NlY3Rpb25zL2Zvb3Rlcic7XFxuXFxuLy8gdWlcXG5AaW1wb3J0ICcuLi91aS9zdHlsZXMvdWkuc2Nzcyc7XFxuXFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cXG5AaW1wb3J0ICcuL2Rldi92em1zazEuc2Nzcyc7XFxuQGltcG9ydCAnLi9kZXYvbWFya3VzRE0uc2Nzcyc7XFxuQGltcG9ydCAnLi9kZXYvdWtpazAuc2Nzcyc7XFxuQGltcG9ydCAnLi9kZXYva2llNmVyLnNjc3MnO1xcblwiLFwiKixcXG4qOjpiZWZvcmUsXFxuKjo6YWZ0ZXIge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuaHRtbCB7XFxuICBmb250LWZhbWlseTogJ1JvYm90byc7IC8vINGI0YDQuNGE0YIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4g0L/QviDRgdCw0LnRgtGDXFxuICBmb250LXNpemU6IDAuNTIwODMzNXZ3OyAvLyDQvdCwINGA0LDQt9GA0LXRiNC10L3QuNC4IDE5MjAgMC41MjA4MzV2dyA9PT0gMTBweFxcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXG4gIC13ZWJraXQtYW5pbWF0aW9uOiBidWdmaXggaW5maW5pdGUgMXM7XFxuICBsaW5lLWhlaWdodDogMS4yO1xcbiAgbWFyZ2luOiAwO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuYm9keSB7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgLXdlYmtpdC1hbmltYXRpb246IGJ1Z2ZpeCBpbmZpbml0ZSAxcztcXG4gIGxpbmUtaGVpZ2h0OiAxLjI7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgZm9udC1zaXplOiAxLjhyZW07XFxuICBjb2xvcjogJHdoaXRlOyAvLyDRhtCy0LXRgiDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDRgtC10LrRgdGC0LAg0L/QviDRgdCw0LnRgtGDXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAkYmdDb2xvcjtcXG59XFxuXFxuaW5wdXQsXFxudGV4dGFyZWEge1xcbiAgLXdlYmtpdC1hbmltYXRpb246IGJ1Z2ZpeCBpbmZpbml0ZSAxcztcXG4gIGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyOiBub25lO1xcbiAgY29sb3I6IGluaGVyaXQ7XFxufVxcbmEge1xcbiAgY29sb3I6IHVuc2V0O1xcbn1cXG5hLFxcbmE6aG92ZXIge1xcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG5cXG5idXR0b24sXFxuaW5wdXQsXFxuYSxcXG50ZXh0YXJlYSB7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgZm9udDogaW5oZXJpdDtcXG4gICY6Zm9jdXMge1xcbiAgICBvdXRsaW5lOiBub25lO1xcbiAgfVxcbiAgJjphY3RpdmUge1xcbiAgICBvdXRsaW5lOiBub25lO1xcbiAgfVxcbn1cXG5cXG5oMSxcXG5oMixcXG5oMyxcXG5oNCxcXG5oNSxcXG5oNiB7XFxuICBmb250OiBpbmhlcml0O1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxucCB7XFxuICBtYXJnaW4tdG9wOiAwO1xcbiAgbWFyZ2luLWJvdHRvbTogMDtcXG59XFxuXFxuaW1nIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiBhdXRvO1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbmJ1dHRvbiB7XFxuICBib3JkZXI6IG5vbmU7XFxuICBjb2xvcjogaW5oZXJpdDtcXG4gIGZvbnQ6IGluaGVyaXQ7XFxuICB0ZXh0LWFsaWduOiBpbmhlcml0O1xcbiAgcGFkZGluZzogMDtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG51bCB7XFxuICBwYWRkaW5nOiAwO1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG51bCBsaSB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgbGlzdC1zdHlsZTogbm9uZTtcXG59XFxuXFxuLmNvbnRhaW5lciB7XFxuICB3aWR0aDogMTY0cmVtO1xcbiAgbWFyZ2luOiAwIGF1dG87XFxufVxcblxcbmlucHV0W3R5cGU9J251bWJlciddOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxcbmlucHV0W3R5cGU9J251bWJlciddOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuaW5wdXRbdHlwZT0nbnVtYmVyJ10ge1xcbiAgLW1vei1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XFxufVxcblxcbnN2ZyxcXG5pbWcge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IGF1dG87XFxuICBvYmplY3QtZml0OiBjb250YWluO1xcbn1cXG5cXG5AbWVkaWEgKG1pbi13aWR0aDogMTkyMHB4KSB7XFxuICBodG1sIHtcXG4gICAgZm9udC1zaXplOiAxMHB4O1xcbiAgfVxcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogNDhlbSkge1xcbiAgaHRtbCB7XFxuICAgIGZvbnQtc2l6ZTogNXB4O1xcbiAgICBmb250LXNpemU6IDEuNTYyNXZ3O1xcbiAgICBmb250LXNpemU6IGNhbGMoKDEwMCAvIDM3NSkgKiA1dncpOyAvLyDQs9C00LUgMzc1INGN0YLQviDRiNC40YDQuNC90LAg0LzQvtCxINCy0LXRgNGB0LjQuCDQvNCw0LrQtdGC0LBcXG4gICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiBub25lO1xcbiAgfVxcblxcbiAgYm9keSB7XFxuICAgIGZvbnQtc2l6ZTogM3JlbTtcXG4gICAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiBub25lO1xcbiAgfVxcblxcbiAgLmNvbnRhaW5lciB7XFxuICAgIHBhZGRpbmc6IDAgMnJlbTsgLy8g0LIg0LzQvtCxINCy0LXRgNGB0LjQuCDQvtGC0YHRgtGD0L8g0L7RgiDQutGA0LDRjyDQt9Cw0LTQsNC10Lwg0LTQu9GPINCy0YHQtdGFINC60L7QvdGC0LXQudC90LXRgNC+0LIsINCwINGC0LDQvCDQs9C00LUg0L3QtSDQvdGD0LbQvdC+INC80L7QttC10Lwg0YLQvtGH0LXRh9C90L4g0YPQsdGA0LDRgtGMXFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgfVxcbn1cXG5cIixcIi5oIHtcXG4gIGZvbnQtZmFtaWx5OiAnRHJ1ayBXaWRlIEN5cic7XFxuICBmb250LXdlaWdodDogNTAwO1xcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG5cXG4gICZfMSB7XFxuICAgIGZvbnQtc2l6ZTogNnJlbTtcXG4gICAgbGluZS1oZWlnaHQ6IDEyMCU7XFxuICAgIGxldHRlci1zcGFjaW5nOiAzJTtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICBmb250LXNpemU6IDQuNHJlbTtcXG4gICAgfVxcbiAgfVxcblxcbiAgJl8yIHtcXG4gICAgZm9udC1zaXplOiA1LjJyZW07XFxuICAgIGxpbmUtaGVpZ2h0OiAxMzAlO1xcbiAgICBsZXR0ZXItc3BhY2luZzogMiU7XFxuXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgZm9udC1zaXplOiA0cmVtO1xcbiAgICB9XFxuICB9XFxuXFxuICAmXzMge1xcbiAgICBmb250LXNpemU6IDMuNnJlbTtcXG4gICAgbGluZS1oZWlnaHQ6IDEzMCU7XFxuICAgIGxldHRlci1zcGFjaW5nOiAyJTtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICBmb250LXNpemU6IDMuNnJlbTtcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG4uc3VidGl0bGUge1xcbiAgZm9udC1mYW1pbHk6IFJvYm90bztcXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XFxuICBmb250LXNpemU6IDIuNHJlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxNDAlO1xcblxcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgZm9udC1zaXplOiAzLjZyZW07XFxuICB9XFxufVxcblxcbi50eHQge1xcbiAgbGluZS1oZWlnaHQ6IDE0MCU7XFxuXFxuICAmXzE0IHtcXG4gICAgZm9udC1zaXplOiAxLjRyZW07XFxuXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgZm9udC1zaXplOiAyLjhyZW07XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXCIuYnRuIHtcXG4gIG1hcmdpbjogMnJlbTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHBhZGRpbmc6IDJyZW0gNHJlbTtcXG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYm9yZGVyLXJhZGl1czogMC44cmVtO1xcbiAgYmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KFxcbiAgICA1NS42MyUgMTkxLjE1JSBhdCA2MC45NCUgMCUsXFxuICAgIHJnYmEoMjU0LCAyNTQsIDI1NCwgMC43KSAwJSxcXG4gICAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKSAxMDAlXFxuICApO1xcbiAgY29sb3I6ICR3aGl0ZTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuXFxuICAmOjpiZWZvcmUsXFxuICAmOjphZnRlciB7XFxuICAgIGNvbnRlbnQ6ICcnO1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHRvcDogNTAlO1xcbiAgICBsZWZ0OiA1MCU7XFxuICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAycHgpO1xcbiAgICBoZWlnaHQ6IGNhbGMoMTAwJSAtIDJweCk7XFxuICAgIGJvcmRlci1yYWRpdXM6IDAuOHJlbTtcXG4gICAgYm94LXNoYWRvdzogMCAwLjZyZW0gMS41cmVtIHJnYmEoMCwgMCwgMCwgMC4yNSk7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xcbiAgfVxcbiAgJjo6YmVmb3JlIHtcXG4gICAgYmFja2dyb3VuZDogcmFkaWFsLWdyYWRpZW50KFxcbiAgICAgICAgNTQlIDEwMCUgYXQgNTAlIDAlLFxcbiAgICAgICAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjMpIDAlLFxcbiAgICAgICAgcmdiYSgwLCAwLCAwLCAwKSAxMDAlXFxuICAgICAgKSxcXG4gICAgICBsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjZmY2YzAxIDAlLCAjYjM0ZjA2IDEwMCUpO1xcbiAgfVxcbiAgJjo6YWZ0ZXIge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICBiYWNrZ3JvdW5kOiByYWRpYWwtZ3JhZGllbnQoXFxuICAgICAgICA1NCUgMTAwJSBhdCA1MCUgMCUsXFxuICAgICAgICByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNDgpIDAlLFxcbiAgICAgICAgcmdiYSgwLCAwLCAwLCAwKSAxMDAlXFxuICAgICAgKSxcXG4gICAgICBsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjZGM1ZTAxIDAlLCAjYWU0YTAxIDEwMCUpO1xcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuM3MgZWFzZTtcXG4gIH1cXG5cXG4gICYuX2lzLWRpc2FibGVkIHtcXG4gICAgJjo6YmVmb3JlIHtcXG4gICAgICBiYWNrZ3JvdW5kOiByYWRpYWwtZ3JhZGllbnQoXFxuICAgICAgICAgIDU0JSAxMDAlIGF0IDUwJSAwJSxcXG4gICAgICAgICAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjMpIDAlLFxcbiAgICAgICAgICByZ2JhKDAsIDAsIDAsIDApIDEwMCVcXG4gICAgICAgICksXFxuICAgICAgICBsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjYjBiMGIwIDAlLCAjNmM2YzZjIDEwMCUpO1xcbiAgICB9XFxuICAgICY6OmFmdGVyIHtcXG4gICAgICBjb250ZW50OiBub25lO1xcbiAgICB9XFxuXFxuICAgIC5idG5fX3R4dCB7XFxuICAgICAgY29sb3I6ICRncmF5O1xcbiAgICB9XFxuICB9XFxuXFxuICBAbWVkaWEgKGFueS1ob3ZlcjogaG92ZXIpIHtcXG4gICAgJjpub3QoJi5faXMtZGlzYWJsZWQpIHtcXG4gICAgICAmOmhvdmVyIHtcXG4gICAgICAgICY6OmFmdGVyIHtcXG4gICAgICAgICAgb3BhY2l0eTogMTtcXG4gICAgICAgIH1cXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG5cXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgIHBhZGRpbmc6IDRyZW0gOHJlbTtcXG4gICAgYm9yZGVyLXJhZGl1czogMS42cmVtO1xcblxcbiAgICAmOjpiZWZvcmUsXFxuICAgICY6OmFmdGVyIHtcXG4gICAgICBib3JkZXItcmFkaXVzOiAxLjZyZW07XFxuICAgIH1cXG4gIH1cXG5cXG4gIC8vIC5idG5fX3R4dFxcblxcbiAgJl9fdHh0IHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICB6LWluZGV4OiAyO1xcbiAgICBmb250LXdlaWdodDogNTAwO1xcbiAgICBsaW5lLWhlaWdodDogMTEwJTtcXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICBmb250LXNpemU6IDMuNnJlbTtcXG4gICAgICBsaW5lLWhlaWdodDogNHJlbTtcXG4gICAgfVxcbiAgfVxcbn1cXG5cIixcIi5pY29uIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGlubGluZS1mbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgZmxleDogMCAwIDdyZW07XFxuICB3aWR0aDogN3JlbTtcXG4gIGhlaWdodDogN3JlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIGJveC1zaGFkb3c6IGluc2V0IDAgLTAuMTZyZW0gMC44cmVtIHJnYmEoMjU1LCAxNjgsIDAsIDAuNDgpLFxcbiAgICBpbnNldCAwLjMycmVtIDAuMzJyZW0gMC4xNnJlbSByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XFxuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMC41cmVtKTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuXFxuICAmOjpiZWZvcmUsXFxuICAmOjphZnRlciB7XFxuICAgIGNvbnRlbnQ6ICcnO1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIGJvdHRvbTogMDtcXG4gIH1cXG5cXG4gICY6OmJlZm9yZSB7XFxuICAgIGxlZnQ6IDUwJTtcXG4gICAgaGVpZ2h0OiAyLjVyZW07XFxuICAgIHdpZHRoOiAxMjUlO1xcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi9hc3NldHMvaW1hZ2VzL2JnL2J0bi1ncmFkaWVudC5zdmcpO1xcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XFxuICB9XFxuXFxuICAmOjphZnRlciB7XFxuICAgIGxlZnQ6IDA7XFxuICAgIGhlaWdodDogMTAwJTtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCg2NGRlZywgI2UzNWQxYiAyMS42NCUsICNjZDU5MWYgNjkuMzElKTtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDAuOHJlbSk7XFxuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4zcyBlYXNlO1xcbiAgfVxcblxcbiAgJl93aGl0ZSB7XFxuICAgIGJveC1zaGFkb3c6IGluc2V0IDAgLTAuMTZyZW0gMC44cmVtIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC40OCksXFxuICAgICAgaW5zZXQgMC4zMnJlbSAwLjMycmVtIDAuMTZyZW0gcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xcblxcbiAgICAmOjphZnRlciB7XFxuICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDY0ZGVnLCAjZmZmZmZmIDIxLjY0JSwgI2VmZWZlZiA2OS4zMSUpO1xcbiAgICB9XFxuXFxuICAgICY6OmJlZm9yZSB7XFxuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKC4vYXNzZXRzL2ltYWdlcy9iZy9idG4tZ3JhZGllbnQtd2hpdGUuc3ZnKTtcXG4gICAgfVxcbiAgfVxcblxcbiAgJi5faXMtZGlzYWJsZWQge1xcbiAgICBib3gtc2hhZG93OiBpbnNldCAwIC0wLjE2cmVtIDAuOHJlbSByZ2JhKDE3MywgMTczLCAxNzMsIDAuNDgpLFxcbiAgICAgIGluc2V0IDAuMzJyZW0gMC4zMnJlbSAwLjE2cmVtIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKTtcXG5cXG4gICAgc3ZnIHBhdGgge1xcbiAgICAgIGZpbGw6ICRncmF5O1xcbiAgICB9XFxuXFxuICAgICY6OmFmdGVyIHtcXG4gICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoNjRkZWcsICNiNWI1YjUgMjEuNjQlLCAjODE4MTgxIDY5LjMxJSk7XFxuICAgIH1cXG4gICAgJjo6YmVmb3JlIHtcXG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoLi9hc3NldHMvaW1hZ2VzL2JnL2J0bi1ncmFkaWVudC13aGl0ZS5zdmcpO1xcbiAgICB9XFxuICB9XFxuXFxuICBzdmcge1xcbiAgICB3aWR0aDogMnJlbTtcXG4gICAgaGVpZ2h0OiAycmVtO1xcblxcbiAgICBwYXRoIHtcXG4gICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgZWFzZTtcXG4gICAgfVxcblxcbiAgICAmOmZpcnN0LWNoaWxkIHtcXG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgICAgei1pbmRleDogMztcXG4gICAgfVxcblxcbiAgICAmOmxhc3QtY2hpbGQge1xcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgICB6LWluZGV4OiAyO1xcbiAgICAgIHRvcDogNTAlO1xcbiAgICAgIGxlZnQ6IDUwJTtcXG4gICAgICBmaWx0ZXI6IGJsdXIoMC4ycmVtKTtcXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcXG4gICAgfVxcbiAgfVxcblxcbiAgQG1lZGlhIChhbnktaG92ZXI6IGhvdmVyKSB7XFxuICAgICY6bm90KCYuX2lzLWRpc2FibGVkLCAmX3doaXRlKSB7XFxuICAgICAgJjpob3ZlciB7XFxuICAgICAgICAmOjphZnRlciB7XFxuICAgICAgICAgIG9wYWNpdHk6IDE7XFxuICAgICAgICB9XFxuICAgICAgICBzdmcgcGF0aCB7XFxuICAgICAgICAgIGZpbGw6ICR3aGl0ZTtcXG4gICAgICAgIH1cXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG5cXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgIGZsZXg6IDAgMCAxM3JlbTtcXG4gICAgd2lkdGg6IDEzcmVtO1xcbiAgICBoZWlnaHQ6IDEzcmVtO1xcbiAgICBib3gtc2hhZG93OiBpbnNldCAwIC0wLjQ4cmVtIDIuNHJlbSByZ2JhKDI1NSwgMTY4LCAwLCAwLjQ4KSxcXG4gICAgICBpbnNldCAwLjk2cmVtIDAuOTZyZW0gMC40OHJlbSByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSk7XFxuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxLjRyZW0pO1xcbiAgICBzdmcge1xcbiAgICAgIHdpZHRoOiA1cmVtO1xcbiAgICAgIGhlaWdodDogNXJlbTtcXG4gICAgfVxcbiAgfVxcbn1cXG5cIixcIi50YWJzIHtcXG4gIC8vIC50YWJzX19uYXZpZ2F0aW9uXFxuXFxuICAmX19uYXZpZ2F0aW9uIHtcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LXdyYXA6IG5vd3JhcDtcXG5cXG4gICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4ZW0pIHtcXG4gICAgICBvdmVyZmxvdy14OiBhdXRvO1xcbiAgICAgIC1tcy1vdmVyZmxvdy1zdHlsZTogbm9uZTsgLyogSW50ZXJuZXQgRXhwbG9yZXIgMTArICovXFxuICAgICAgc2Nyb2xsYmFyLXdpZHRoOiBub25lO1xcbiAgICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcXG4gICAgICAgIGRpc3BsYXk6IG5vbmU7IC8qIFNhZmFyaSBhbmQgQ2hyb21lICovXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuXFxuICAvLyAudGFic19fdGl0bGVcXG5cXG4gICZfX3RpdGxlIHtcXG4gIH1cXG5cXG4gIC8vIC50YWJzX19jb250ZW50XFxuXFxuICAmX19jb250ZW50IHtcXG4gIH1cXG5cXG4gIC8vIC50YWJzX19ib2R5XFxuXFxuICAmX19ib2R5IHtcXG4gIH1cXG59XFxuXFxuLnRhYiB7XFxuICBwYWRkaW5nLWxlZnQ6IDMuNHJlbTtcXG4gIHBhZGRpbmctcmlnaHQ6IDMuNHJlbTtcXG4gIHBhZGRpbmctYm90dG9tOiAxLjVyZW07XFxuICBib3JkZXItYm90dG9tOiAwLjNyZW0gc29saWQgJGdyYXk7XFxuICBmb250LXNpemU6IDJyZW07XFxuICBsaW5lLWhlaWdodDogMTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgY29sb3I6ICRncmF5O1xcbiAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyBlYXNlLCBib3JkZXItYm90dG9tIDAuM3MgZWFzZTtcXG5cXG4gICYuX2lzLWFjdGl2ZSB7XFxuICAgIGJvcmRlci1ib3R0b206IDAuM3JlbSBzb2xpZCAkb3JhbmdlO1xcbiAgICBjb2xvcjogJG9yYW5nZTtcXG4gIH1cXG5cXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgIHBhZGRpbmctbGVmdDogNXJlbTtcXG4gICAgcGFkZGluZy1yaWdodDogNXJlbTtcXG4gICAgcGFkZGluZy1ib3R0b206IDMuNnJlbTtcXG4gICAgYm9yZGVyLWJvdHRvbTogMC40cmVtIHNvbGlkICRncmF5O1xcbiAgICBmb250LXNpemU6IDMuMnJlbTtcXG5cXG4gICAgJi5faXMtYWN0aXZlIHtcXG4gICAgICBib3JkZXItYm90dG9tOiAwLjRyZW0gc29saWQgJG9yYW5nZTtcXG4gICAgfVxcbiAgfVxcbn1cXG5cIixcImlucHV0W3R5cGU9J3RleHQnXSxcXG5pbnB1dFt0eXBlPSdlbWFpbCddLFxcbmlucHV0W3R5cGU9J3RlbCddLFxcbnRleHRhcmVhIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gIC1tb3otYXBwZWFyYW5jZTogbm9uZTtcXG4gIGFwcGVhcmFuY2U6IG5vbmU7XFxufVxcbnRleHRhcmVhOmZvY3VzLFxcbmlucHV0OmZvY3VzIHtcXG4gIG91dGxpbmU6IG5vbmU7XFxufVxcblxcbi5pbnB1dCB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHJvdy1nYXA6IDEuMXJlbTtcXG5cXG4gIC8vIC5pbnB1dF9fZmllbGRcXG5cXG4gICZfX2ZpZWxkIHtcXG4gICAgcGFkZGluZy1ib3R0b206IDJyZW07XFxuICAgIHBhZGRpbmctcmlnaHQ6IDJyZW07XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgbGluZS1oZWlnaHQ6IDE7XFxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAkZ3JheTtcXG4gICAgdHJhbnNpdGlvbjogYm9yZGVyLWJvdHRvbSAwLjNzIGVhc2U7XFxuXFxuICAgICY6OnBsYWNlaG9sZGVyIHtcXG4gICAgICBjb2xvcjogJGdyYXk7XFxuICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyBlYXNlO1xcbiAgICB9XFxuXFxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiA0OGVtKSB7XFxuICAgICAgcGFkZGluZy1ib3R0b206IDMuMnJlbTtcXG4gICAgICBwYWRkaW5nLXJpZ2h0OiAzLjJyZW07XFxuICAgIH1cXG4gIH1cXG5cXG4gIC8vIC5pbnB1dF9faGludFxcblxcbiAgJl9faGludCB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgIGNvbG9yOiAkcmVkO1xcbiAgfVxcblxcbiAgJi5faGFzLWZvY3VzIHtcXG4gICAgLmlucHV0X19maWVsZCB7XFxuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICR3aGl0ZTtcXG4gICAgfVxcbiAgfVxcbiAgJi5faGFzLWVycm9yIHtcXG4gICAgLmlucHV0X19maWVsZCB7XFxuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICRyZWQ7XFxuICAgIH1cXG4gICAgLmlucHV0X19oaW50IHtcXG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsbnVsbF0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0gX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1syXS51c2VbMV0hLi4vLi4vbm9kZV9tb2R1bGVzL2dyb3VwLWNzcy1tZWRpYS1xdWVyaWVzLWxvYWRlci9saWIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGUuc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzJdLnVzZVsxXSEuLi8uLi9ub2RlX21vZHVsZXMvZ3JvdXAtY3NzLW1lZGlhLXF1ZXJpZXMtbG9hZGVyL2xpYi9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5zY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgJy4uL3Njc3Mvc3R5bGUuc2Nzcyc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gdXRpbHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMvdXRpbHMuanMnO1xuXG4vLyBoYW1idXJnZXIgbWVudVxuLy8gdXRpbHMubWVudUluaXQoKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBjb21wb25lbnRzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gZm9ybXNcbmltcG9ydCAnLi91dGlscy9mb3Jtcyc7XG5cbi8vIHRhYnNcbmltcG9ydCAnLi91dGlscy90YWJzLmpzJztcblxuLy8gLy8gYWNjb3JkaW9uXG4vLyBpbXBvcnQgJy4vdXRpbHMvYWNjb3JkaW9uLmpzJztcblxuLy8gLy8gc2VsZWN0XG4vLyBpbXBvcnQgJy4vdXRpbHMvc2VsZWN0LmpzJztcblxuLy8gLy8gbW9kYWxzXG4vLyBpbXBvcnQgJy4vdXRpbHMvbW9kYWxzLmpzJztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuaW1wb3J0ICcuL2Rldi92em1zazEuanMnO1xuaW1wb3J0ICcuL2Rldi9tYXJrdXNETS5qcyc7XG5pbXBvcnQgJy4vZGV2L3VraWswLmpzJztcbmltcG9ydCAnLi9kZXYva2llNmVyLmpzJztcbiJdLCJuYW1lcyI6WyJtb2R1bGVzIiwiVmFsaWRhdGlvbiIsImNvbnN0cnVjdG9yIiwiYXR0cnMiLCJSRVFVSVJFRCIsIklHTk9SRV9WQUxJREFUSU9OIiwiQUpBWCIsIkRFViIsIklHTk9SRV9GT0NVUyIsIlNIT1dfUExBQ0VIT0xERVIiLCJWQUxJREFURSIsImNsYXNzZXMiLCJIQVNfRVJST1IiLCJIQVNfRk9DVVMiLCJnZXRFcnJvcnMiLCJmb3JtIiwiZXJyIiwicmVxdWlyZWRGaWVsZHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwibGVuZ3RoIiwiZm9yRWFjaCIsInJlcXVpcmVkRmllbGQiLCJvZmZzZXRQYXJlbnQiLCJ0YWdOYW1lIiwiZGlzYWJsZWQiLCJ2YWxpZGF0ZUZpZWxkIiwiYWRkRXJyb3IiLCJjbGFzc0xpc3QiLCJhZGQiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlRXJyb3IiLCJyZW1vdmUiLCJkYXRhc2V0IiwicmVxdWlyZWQiLCJ2YWx1ZSIsInJlcGxhY2UiLCJ0ZXN0RW1haWwiLCJ0eXBlIiwiY2hlY2tlZCIsInRyaW0iLCJjbGVhckZpZWxkcyIsInJlc2V0Iiwic2V0VGltZW91dCIsImlucHV0cyIsImNoZWNrYm94ZXMiLCJpbmRleCIsImlucHV0IiwiY2hlY2tib3giLCJ0ZXN0IiwiRm9ybVN1Ym1pdGlvbiIsInNob3VsZFZhbGlkYXRlIiwiZm9ybXMiLCJkb2N1bWVudCIsImluaXQiLCJzZW5kRm9ybSIsInJlc3BvbnNlUmVzdWx0IiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwicG9wdXAiLCJtb2RhbCIsIm1vZGFsTWVzc2FnZSIsIm9wZW4iLCJjb25zb2xlIiwibG9nIiwiaGFuZGxlU3VibWl0aW9uIiwiZSIsImhhc0F0dHJpYnV0ZSIsImFqYXgiLCJwcmV2ZW50RGVmYXVsdCIsImFjdGlvbiIsImdldEF0dHJpYnV0ZSIsIm1ldGhvZCIsImRhdGEiLCJGb3JtRGF0YSIsInJlc3BvbnNlIiwiZmV0Y2giLCJib2R5Iiwib2siLCJyZXN1bHQiLCJqc29uIiwiYWxlcnQiLCJfdGhpcyIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0YXJnZXQiLCJGb3JtRmllbGRzIiwiZmllbGRzIiwic2F2ZVBsYWNlaG9sZGVyIiwiZmllbGQiLCJwbGFjZWhvbGRlciIsImhhbmRsZUZvY3VzaW4iLCJoYW5kbGVGb2N1c291dCIsImJpbmQiLCJzZXRIYXNoIiwiZ2V0SGFzaCIsIlRhYnMiLCJUQUJTIiwiSU5ERVgiLCJUSVRMRVMiLCJUSVRMRSIsIlRBQl9JVEVNIiwiQk9EWSIsIkhBU0giLCJJTklUIiwiQUNUSVZFIiwiTU9EQUwiLCJ0YWJzIiwiYWN0aXZlSGFzaCIsImhhc2giLCJzdGFydHNXaXRoIiwic3BsaXQiLCJ0YWJzQmxvY2siLCJzZXRBdHRyaWJ1dGUiLCJzZXRBY3Rpb25zIiwic2V0U3RhdHVzIiwidGl0bGVzIiwiY29udGVudCIsInRhYnNJbmRleCIsImhhc0hhc2giLCJBcnJheSIsImZyb20iLCJmaWx0ZXIiLCJpdGVtIiwiY2xvc2VzdCIsImluZHgiLCJjb250YWlucyIsImhpZGRlbiIsInRpdGxlIiwiYWN0aXZlVGl0bGUiLCJhY3RpdmVIYXNoQmxvY2siLCJxdWVyeVNlbGVjdG9yIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsIm1lbnVJbml0IiwiYm9keUxvY2tTdGF0dXMiLCJtZW51T3BlbiIsImRvY3VtZW50RWxlbWVudCIsIm1lbnVDbG9zZSIsImJvZHlMb2NrIiwiYm9keVVubG9jayIsImJvZHlMb2NrVG9nZ2xlIiwiZGVsYXkiLCJ1bmlxdWVBcnJheSIsImFycmF5Iiwic2VsZiIsImluZGV4T2YiLCJkYXRhTWVkaWFRdWVyaWVzIiwiZGF0YVNldFZhbHVlIiwibWVkaWEiLCJicmVha3BvaW50c0FycmF5IiwicGFyYW1zIiwiYnJlYWtwb2ludCIsInBhcmFtc0FycmF5IiwicHVzaCIsIm1kUXVlcmllcyIsIm1hcCIsIm1kUXVlcmllc0FycmF5IiwibWVkaWFCcmVha3BvaW50IiwibWVkaWFUeXBlIiwibWF0Y2hNZWRpYSIsIml0ZW1zQXJyYXkiLCJfc2xpZGVVcCIsImR1cmF0aW9uIiwic2hvd21vcmUiLCJzdHlsZSIsInRyYW5zaXRpb25Qcm9wZXJ0eSIsInRyYW5zaXRpb25EdXJhdGlvbiIsImhlaWdodCIsIm9mZnNldEhlaWdodCIsIm92ZXJmbG93IiwicGFkZGluZ1RvcCIsInBhZGRpbmdCb3R0b20iLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJyZW1vdmVQcm9wZXJ0eSIsIl9zbGlkZURvd24iLCJfc2xpZGVUb2dnbGUiLCJyZW1Ub1B4IiwicmVtVmFsdWUiLCJodG1sRm9udFNpemUiLCJwYXJzZUZsb2F0IiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImZvbnRTaXplIiwicHhWYWx1ZSIsIk1hdGgiLCJyb3VuZCIsInJlbW92ZUNsYXNzZXMiLCJjbGFzc05hbWUiLCJpIiwidXRpbHMiXSwic291cmNlUm9vdCI6IiJ9