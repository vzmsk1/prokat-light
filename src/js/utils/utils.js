/**
 * set hash to url
 * @param {string} hash
 */
export const setHash = (hash) => {
    hash = hash ? `#${hash}` : window.location.href.split('#')[0];
    history.pushState('', '', hash);
};

/**
 * get hash from url
 * @returns string
 */
export const getHash = () => {
    if (location.hash) {
        return location.hash.replace('#', '');
    }
};

/**
 * shows more / less content
 */
export const showmore = () => {
    const showMoreBlocks = document.querySelectorAll('[data-showmore]');
    let showMoreBlocksRegular;
    let mdQueriesArray;
    if (showMoreBlocks.length) {
        // get regular objects
        showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
            return !item.dataset.showmoreMedia;
        });
        // regular objects initialization
        showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

        document.addEventListener('click', showMoreActions);
        window.addEventListener('resize', showMoreActions);

        // get objects with media queries
        mdQueriesArray = dataMediaQueries(showMoreBlocks, 'showmoreMedia');
        if (mdQueriesArray && mdQueriesArray.length) {
            mdQueriesArray.forEach((mdQueriesItem) => {
                // event
                mdQueriesItem.matchMedia.addEventListener('change', function () {
                    initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
            });
            initItemsMedia(mdQueriesArray);
        }
    }
    function initItemsMedia(mdQueriesArray) {
        mdQueriesArray.forEach((mdQueriesItem) => {
            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
    }
    function initItems(showMoreBlocks, matchMedia) {
        showMoreBlocks.forEach((showMoreBlock) => {
            initItem(showMoreBlock, matchMedia);
        });
    }
    function initItem(showMoreBlock, matchMedia = false) {
        showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
        let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content]');
        let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button]');
        showMoreContent = Array.from(showMoreContent).filter(
            (item) => item.closest('[data-showmore]') === showMoreBlock
        )[0];
        showMoreButton = Array.from(showMoreButton).filter(
            (item) => item.closest('[data-showmore]') === showMoreBlock
        )[0];
        const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
        if (matchMedia.matches || !matchMedia) {
            if (hiddenHeight < getOriginalHeight(showMoreContent)) {
                _slideUp(showMoreContent, 0, hiddenHeight);
                showMoreButton.hidden = false;
            } else {
                _slideDown(showMoreContent, 0, hiddenHeight);
                showMoreButton.hidden = true;
            }
        } else {
            _slideDown(showMoreContent, 0, hiddenHeight);
            showMoreButton.hidden = true;
        }
    }
    function getHeight(showMoreBlock, showMoreContent) {
        let hiddenHeight = 0;
        const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : 'size';
        if (showMoreType === 'items') {
            const showMoreTypeValue = showMoreContent.dataset.showmoreContent
                ? showMoreContent.dataset.showmoreContent
                : 3;
            const showMoreItems = showMoreContent.children;
            for (let index = 1; index < showMoreItems.length; index++) {
                const showMoreItem = showMoreItems[index - 1];
                hiddenHeight += showMoreItem.offsetHeight;
                if (index == showMoreTypeValue) break;
            }
        } else {
            const showMoreTypeValue = showMoreContent.dataset.showmoreContent
                ? showMoreContent.dataset.showmoreContent
                : 150;
            hiddenHeight = showMoreTypeValue;
        }
        return hiddenHeight;
    }
    function getOriginalHeight(showMoreContent) {
        let parentHidden;
        let hiddenHeight = showMoreContent.offsetHeight;
        showMoreContent.style.removeProperty('height');
        if (showMoreContent.closest(`[hidden]`)) {
            parentHidden = showMoreContent.closest(`[hidden]`);
            parentHidden.hidden = false;
        }
        let originalHeight = showMoreContent.offsetHeight;
        parentHidden ? (parentHidden.hidden = true) : null;
        showMoreContent.style.height = `${hiddenHeight}px`;
        return originalHeight;
    }
    function showMoreActions(e) {
        const targetEvent = e.target;
        const targetType = e.type;
        if (targetType === 'click') {
            if (targetEvent.closest('[data-showmore-button]')) {
                const showMoreButton = targetEvent.closest('[data-showmore-button]');
                const showMoreBlock = showMoreButton.closest('[data-showmore]');
                const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
                const showMoreSpeed = showMoreBlock.dataset.showmoreButton
                    ? showMoreBlock.dataset.showmoreButton
                    : '500';
                const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                if (!showMoreContent.classList.contains('_slide')) {
                    showMoreBlock.classList.contains('_showmore-active')
                        ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight)
                        : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
                    showMoreBlock.classList.toggle('_showmore-active');
                }
            }
        } else if (targetType === 'resize') {
            showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
            mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
        }
    }
};

// body lock
export let bodyLockStatus = true;
/**
 * toggles body lock
 * @param {number} delay
 */
export const bodyLockToggle = (delay = 500) => {
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
export const bodyUnlock = (delay = 500) => {
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
export const bodyLock = (delay = 500) => {
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
export function uniqueArray(array) {
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
export const dataMediaQueries = (array, dataSetValue) => {
    // get objects with media queries
    const media = Array.from(array).filter(function (item, index, self) {
        if (item.dataset[dataSetValue]) {
            return item.dataset[dataSetValue].split(',')[0];
        }
    });
    // objects with media queries initialization
    if (media.length) {
        const breakpointsArray = [];
        media.forEach((item) => {
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
            mdQueries.forEach((breakpoint) => {
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
export const _slideUp = (target, duration = 500, showmore = 0) => {
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
            document.dispatchEvent(
                new CustomEvent('slideUpDone', {
                    detail: {
                        target: target
                    }
                })
            );
        }, duration);
    }
};

/**
 * smoothly slides down
 * @param {HTMLElement} target
 * @param {number} duration
 * @param {boolean} showmore
 */
export const _slideDown = (target, duration = 500, showmore = 0) => {
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
            document.dispatchEvent(
                new CustomEvent('slideDownDone', {
                    detail: {
                        target: target
                    }
                })
            );
        }, duration);
    }
};

/**
 * toggles smooth slide
 * @param {HTMLElement} target
 * @param {number} duration
 * @returns function
 */
export const _slideToggle = (target, duration = 500) => {
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
export function remToPx(remValue) {
    const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const pxValue = remValue * htmlFontSize;

    return Math.round(pxValue) + 'px';
}

/**
 * remove classes from array items
 * @param {array} array
 * @param {string} className
 */
export const removeClasses = (array, className) => {
    for (var i = 0; i < array.length; i++) {
        array[i].classList.remove(className);
    }
};

/**
 * sets content to container target
 * @param {string} content
 * @param {HTMLElement} container
 */
export const setInnerContent = (content, container) => {
    if (content && container) container.innerHTML = content;
};

/**
 * sets attribute to an element / collection of elements
 * @param {HTMLCollection | HTMLElement} arr
 * @param {string} attr
 * @param {string} val
 */
export const setAttr = (arr, attr, val) => {
    if (arr.length) {
        arr.forEach((item) => {
            item.setAttribute(attr, val);
        });
    }
};

