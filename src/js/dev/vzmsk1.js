// locomotive scroll
import LocomotiveScroll from 'locomotive-scroll';

// gsap
import gsap from 'gsap';
import { MotionPathPlugin, ScrollTrigger, Observer } from 'gsap/all';

// swiper
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';

// vivus
import Vivus from 'vivus';

// utils
import { setInnerContent, bodyLock, bodyUnlock, remToPx } from '../utils/utils';
import { modules } from '../modules';

// gsap plugins & defaults
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, Observer);
gsap.defaults({
    duration: 1,
    ease: 'circ.out'
});

// --------------------------------------------------------------------------

let bodyLockStatus = true;

// media query (mobile)
const mm = window.matchMedia('(max-width: 768px)');

// locomotive scroll instance
export const locoScroll = new LocomotiveScroll({
    el: document.querySelector('._smooth-scroll'),
    smooth: true,
    multiplier: 0.6,
    smoothMobile: false,
    tablet: {
        smooth: true
    },
    smartphone: {
        smooth: false
    }
});

class HomePage {
    constructor() {
        this.docElement = document.documentElement;
        this.scroller = document.querySelector('._smooth-scroll');

        // general classes
        this.classes = {
            menuOpened: '_menu-opened',
            anim: '_is-animating',
            reverseSl: '_reverse',
            forwardSl: '_forward',
            active: '_is-active',
            hovered: '_is-hovered',
            beginning: '_is-beginning',
            end: '_is-end',
            loaded: '_is-loaded'
        };

        // special utils methods
        this.unlockScroll = () => {
            if (bodyLockStatus) {
                if (bodyLockStatus) {
                    setTimeout(() => {
                        document.documentElement.classList.remove('lock');
                        locoScroll ? locoScroll.start() : null;
                    }, 500);
                    bodyLockStatus = false;
                    setTimeout(function () {
                        bodyLockStatus = true;
                    }, 500);
                }
                if (locoScroll) locoScroll.start();
            }
        };
        this.lockScroll = () => {
            if (bodyLockStatus) {
                if (bodyLockStatus) {
                    document.documentElement.classList.add('lock');
                    locoScroll ? locoScroll.stop() : null;

                    bodyLockStatus = false;
                    setTimeout(function () {
                        bodyLockStatus = true;
                    }, 500);
                }
                if (locoScroll) locoScroll.stop();
            }
        };
        this.updateScroll = () => {
            if (locoScroll) locoScroll.update();
        };
        this.setSlideClasses = (swiper) => {
            swiper.slides.forEach((slide, i) => {
                slide.classList.remove('_is-next', '_is-prev', '_prev-active', '_next-active');

                if (i > swiper.activeIndex) {
                    slide.classList.add('_is-next');
                } else if (i < swiper.activeIndex) {
                    slide.classList.add('_is-prev');
                }
                if (swiper.isEnd) {
                    swiper.slides[0].classList.add('_next-active');
                    swiper.slides[swiper.slides.length - 2].classList.add('_prev-active');
                }
                if (swiper.activeIndex === 0) {
                    swiper.slides[1].classList.add('_next-active');
                    swiper.slides[swiper.slides.length - 1].classList.add('_prev-active');
                }
            });
        };
        this.delayClass = (el, classname, delay, swiper) => {
            el.classList.add(classname);

            setTimeout(() => {
                el.classList.remove(classname);

                if (swiper) swiper.animating = false;
            }, delay);
        };
        this.isActive = (section) => {
            return section.classList.contains(this.classes.active);
        };

        this.init();
    }

    initHamburgerMenu(_this) {
        if (document.querySelector('.header__hamburger')) {
            const hamburgerBtn = document.querySelector('.header__hamburger');
            const closeMenu = () => {
                _this.unlockScroll();
                _this.docElement.classList.remove(_this.classes.menuOpened);
            };

            hamburgerBtn.addEventListener('click', function (e) {
                if (bodyLockStatus) {
                    if (_this.docElement.classList.contains(_this.classes.menuOpened)) {
                        closeMenu();
                    } else {
                        _this.lockScroll();
                        _this.docElement.classList.add(_this.classes.menuOpened);
                    }
                }
            });

            mm.addEventListener('change', function () {
                if (!mm.matches) {
                    closeMenu();
                    locoScroll.update();
                    setTimeout(() => {
                        if (modules.modal) {
                            const modals = document.querySelectorAll('.modal');

                            if (modals.length) {
                                modals.forEach((modal) => {
                                    modal.classList.remove('modal_show');
                                    _this.docElement.classList.remove('modal-show');
                                    _this.unlockScroll();
                                });
                            }
                        }
                    }, 0);
                }
            });
        }
    }

    initUtils(_this) {
        /**
         * init anchors
         */
        const initAnchors = () => {
            if (document.querySelectorAll('[data-anchor]').length) {
                const anchors = document.querySelectorAll('[data-anchor]');

                anchors.forEach((anchor) => {
                    anchor.addEventListener('click', function () {
                        locoScroll.scrollTo(anchor.dataset.anchor, {
                            duration: 2.5,
                            offset: anchor.dataset.anchorOffset.length ? anchor.dataset.anchorOffset : -40,
                            immediate: false
                        });
                    });
                });
            }
        };
        initAnchors();

        /**
         * changes viewbox params
         */
        const changeViewboxData = (el) => {
            const init = () => {
                if (el) {
                    const [deskW, deskH, mobW, mobH] = el.dataset.viewbox.trim().split(',');
                    el.setAttribute('viewBox', mm.matches ? `0 0 ${mobW} ${mobH}` : `0 0 ${deskW} ${deskH}`);
                }
            };
            init();
            mm.addEventListener('change', init);
        };
        changeViewboxData(document.querySelector('.speedometer__wrap'));
    }

    initLoader(_this) {
        if (document.querySelector('.loader')) {
            const loader = document.querySelector('.loader');
            const progressContainer = document.getElementById('percentVal');
            const images = document.images;
            const imagesLength = images.length;
            const LOADER_DELAY = 600;
            let num = 0;

            // lock scroll till all images on page are loaded
            _this.lockScroll();

            /**
             * sets progress (in %) of all loaded images
             */
            const imgLoad = () => {
                setTimeout(function () {
                    // increment amount of loaded images
                    progressContainer.textContent = Math.ceil((num / imagesLength) * 100) + '%';
                    num++;

                    if (num < imagesLength) {
                        // use recursion
                        imgLoad(document.images[num]);
                    } else {
                        // set progress to 100%
                        progressContainer.textContent = '100%';

                        // temporarily hide loader
                        gsap.to(loader, {
                            opacity: 0,
                            visibility: 'hidden'
                        });

                        // remove loader from the page
                        setTimeout(() => {
                            loader.remove();
                        }, LOADER_DELAY);

                        // delayed animations
                        _this.animateHero(_this);
                        _this.animateChooseSection(_this);
                        _this.init3DScroll(_this);

                        gsap.matchMedia().add('(max-width: 768px)', () => {
                            const advantagesSection = document.querySelector('.advantages');
                            if (advantagesSection && !_this.isActive(advantagesSection)) {
                                gsap.timeline({
                                    scrollTrigger: {
                                        trigger: advantagesSection,
                                        once: true,
                                        scroller: _this.scroller,
                                        start: 'top 20%',
                                        onEnter: () => {
                                            _this.animateSpeedometer();
                                            advantagesSection.classList.add(_this.classes.active);
                                        }
                                    }
                                });
                            }
                        });
                    }
                }, 100);
            };
            imgLoad(document.images[num]);
        }
    }

    animateHero(_this) {
        if (document.querySelector('.hero')) {
            // main timeline
            gsap.timeline()
                .fromTo(
                    '.hero__mountains',
                    {
                        translateY: '-110%'
                    },
                    {
                        translateY: 0,
                        delay: 0.5,
                        duration: 2.5
                    }
                )
                .fromTo(
                    '.hero__bg',
                    { clipPath: 'polygon(0 0, 100% 0%, 100% 0, 0 0)' },
                    {
                        clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
                        duration: 3,
                        delay: 0.5
                    },
                    0
                )
                .fromTo(
                    '.hero__content',
                    { translateY: '100%' },
                    {
                        translateY: 0,
                        duration: 1.8
                    },
                    0.8
                )
                .fromTo(
                    '.hero__content',
                    { opacity: 0, visibility: 'hidden' },
                    {
                        opacity: 1,
                        visibility: 'visible',
                        duration: 1,
                        onStart: () => {
                            document.querySelector('header').classList.add('_is-visible');
                            setTimeout(() => {
                                _this.unlockScroll();
                                _this.initHamburgerMenu(_this);
                                if (mm.matches) {
                                    document.querySelector('.choose').classList.add(_this.classes.active);
                                }
                            }, 2000);
                        }
                    },
                    1.5
                )
                .fromTo(
                    '.hero__list, .hero__anchor',
                    {
                        scale: 0.2,
                        transformOrigin: '50% 50%'
                    },
                    {
                        scale: 1,
                        opacity: 1,
                        visibility: 'visible',
                        translateY: mm.matches ? 0 : '-5.5rem'
                    },
                    1.5
                )
                .fromTo(
                    '.promotion-btn',
                    {
                        opacity: 0,
                        visibility: 'hidden',
                        scale: mm.matches ? 1 : 0.2,
                        transformOrigin: '50% 50%'
                    },
                    {
                        scale: 1,
                        opacity: 1,
                        visibility: 'visible'
                    },
                    1.5
                )
                .fromTo(
                    '.hero__car',
                    {
                        opacity: 0,
                        scale: 0.2,
                        translateY: '20rem',
                        translateX: '-50%',
                        transformOrigin: '50% 50%'
                    },
                    {
                        duration: 0.5,
                        opacity: 1,
                        translateY: 0,
                        scale: 1
                    },
                    1.5
                )
                .to(
                    '.choose',
                    {
                        '--groundOpacity': 1
                    },
                    1.5
                );
        }
    }

    animateSpeedometer() {
        if (document.getElementById('speedometerProgress')) {
            new Vivus('speedometerProgress', {
                type: 'sync',
                start: 'manual',
                duration: 100,
                delay: 0,
                onReady: function (vivus) {
                    vivus.stop();
                    vivus.reset();
                    setTimeout(() => {
                        vivus.el.querySelector('path').style.transition =
                            'stroke-dasharray 2s ease, stroke-dashoffset 2s ease';
                        vivus.setFrameProgress(0.18);

                        gsap.to('#speedometerNeedle', {
                            motionPath: {
                                path: '#speedometerPath',
                                align: '#speedometerPath',
                                alignOrigin: [0.5, 0.1],
                                autoRotate: true,
                                start: 0.13, // 0.13
                                end: 0.29 // 0.87
                            },
                            duration: 1.3,
                            delay: 0.85
                        });

                        gsap.from('#speedometerScore', {
                            textContent: 0,
                            duration: 0.62,
                            delay: 0.8,
                            snap: { textContent: 1 }
                        });

                        gsap.to('.speedometer__text-wrap', { opacity: 1, visibility: 'visible', delay: 0.8 });
                    }, 0);
                }
            });
        }
    }

    animateChooseSection(_this) {
        const DESK_DELAY = 400;
        const MOBILE_DELAY = 600;
        const SPEED = 600;
        const ID = 'chooseSection';

        const section = document.querySelector('.choose');

        /**
         * set slide content
         */
        const setSlideContent = (swiper) => {
            const activeSlide = swiper.slides[swiper.activeIndex];

            setInnerContent(activeSlide.dataset.text, document.getElementById('chooseItemText'));
            setInnerContent(activeSlide.dataset.price, document.getElementById('chooseItemPrice'));
            setInnerContent(activeSlide.dataset.pledge, document.getElementById('chooseItemPledge'));

            setTimeout(
                () => {
                    document.getElementById('chooseItemHeading').href = activeSlide.href;
                    setInnerContent(
                        activeSlide.dataset.heading,
                        document.getElementById('chooseItemHeading')
                    );
                },
                mm.matches ? MOBILE_DELAY : DESK_DELAY
            );
        };

        if (section) {
            const carousel = section.querySelector('.choose__carousel');
            const prevArr = document.querySelector('.choose__sl-arr_prev');
            const nextArr = document.querySelector('.choose__sl-arr_next');
            const controlStateClasses = (addClass, removeClass) => {
                carousel.classList.add(addClass);
                carousel.classList.remove(removeClass);
            };
            const getData = (swiper) => {
                return {
                    prevSl: swiper.previousIndex,
                    activeSl: swiper.activeIndex,
                    slidesLen: swiper.slides.length,
                    isReversed: swiper.previousIndex === 0 && swiper.isEnd && !mm.matches,
                    isBeginning: swiper.activeIndex === 0
                };
            };
            const slider = new Swiper('.choose__slider', {
                modules: [Navigation, Pagination],
                observer: true,
                spaceBetween: 30,
                speed: SPEED,
                allowTouchMove: true,
                rewind: true,
                navigation: {
                    nextEl: nextArr,
                    prevEl: prevArr
                },
                pagination: {
                    el: '.choose__pagination',
                    type: 'bullets',
                    clickable: mm.matches,
                    renderBullet: function (index, className) {
                        const indx = index >= 10 ? index : '0' + ++index;
                        return `<span class="${className}" data-index="${indx}"></span>`;
                    }
                },
                breakpoints: {
                    768: {
                        spaceBetween: 0,
                        preventInteractionOnTransition: true,
                        virtualTranslate: true,
                        allowTouchMove: false
                    }
                },
                on: {
                    init: (swiper) => {
                        setSlideContent(swiper);
                        if (!mm.matches) _this.setSlideClasses(swiper);

                        nextArr.addEventListener('click', function () {
                            if (swiper.activeIndex === swiper.slides.length - 1) {
                                swiper.slideTo(0);
                            }
                        });
                    },
                    slideChangeTransitionStart: (swiper) => {
                        const { ...data } = getData(swiper);

                        // set slide content
                        setSlideContent(swiper);
                        // add is animating class
                        _this.delayClass(carousel, _this.classes.anim, SPEED, swiper);
                        // remove all state classes
                        carousel.classList.remove(_this.classes.beginning, _this.classes.end);

                        // if it's a desktop screen, then reset state classes and remove swiper wrapper styling
                        if (!mm.matches) {
                            _this.setSlideClasses(swiper);
                            swiper.wrapperEl.style.removeProperty('transform');

                            // is beginning
                            if (data.isBeginning) {
                                carousel.classList.add(_this.classes.beginning);
                            }
                            // leading
                            if (data.isReversed || (data.isBeginning && data.prevSl !== data.slidesLen - 1)) {
                                controlStateClasses(_this.classes.reverseSl, _this.classes.forwardSl);
                            }
                            // reversed
                            if (
                                (data.prevSl === data.slidesLen - 2 && swiper.isEnd) ||
                                (data.isBeginning && data.prevSl === data.slidesLen - 1) ||
                                (!swiper.isEnd && data.activeSl !== 0)
                            ) {
                                controlStateClasses(_this.classes.forwardSl, _this.classes.reverseSl);
                            }
                            // is end
                            if (swiper.isEnd) {
                                carousel.classList.add(_this.classes.end);
                                setTimeout(() => {
                                    _this.unlockScroll();
                                    section.classList.add(_this.classes.active);
                                    nextArr.removeAttribute('disabled');
                                }, SPEED);
                            }
                        }
                    },
                    slideNextTransitionStart: (swiper) => {
                        if (
                            !_this.isActive(section) &&
                            !mm.matches &&
                            swiper.activeIndex !== 0 &&
                            !swiper.isEnd
                        ) {
                            _this.delayClass(nextArr, _this.classes.active, SPEED, swiper);
                        }
                    },
                    slidePrevTransitionStart: (swiper) => {
                        if (
                            !_this.isActive(section) &&
                            !mm.matches &&
                            swiper.activeIndex !== 0 &&
                            !swiper.isEnd
                        ) {
                            _this.delayClass(prevArr, _this.classes.active, SPEED, swiper);
                        }
                    }
                }
            });

            /**
             * handle gsap observer
             */
            const handleObserver = () => {
                _this.lockScroll();

                ScrollTrigger.observe({
                    target: section,
                    type: 'wheel,touch',
                    tolerance: 280,
                    id: ID,
                    onUp: () => slider.slidePrev(),
                    onDown: (e) => {
                        if (e.deltaY === 0) {
                            setTimeout(() => {
                                slider.slideNext();
                            }, 500);
                        } else {
                            slider.slideNext();
                        }
                    }
                });
            };

            gsap.matchMedia().add('(min-width: 768px)', () => {
                slider.wrapperEl.style.removeProperty('transform');
                _this.setSlideClasses(slider);

                if (!_this.isActive(section)) {
                    gsap.set('.choose__slide.swiper-slide-active .slide-choose__image', {
                        scale: 1.2,
                        translateY: '7rem'
                    });

                    const tl = gsap
                        .timeline({
                            defaults: {
                                duration: 1.5,
                                ease: 'power2.out'
                            },
                            scrollTrigger: {
                                trigger: section,
                                scroller: _this.scroller,
                                start: 'top 25%',
                                onEnter: () => {
                                    if (!_this.isActive(section)) {
                                        locoScroll.scrollTo(section, {
                                            offset: '155%',
                                            callback: () => {
                                                _this.lockScroll();
                                            }
                                        });
                                    }
                                },
                                onUpdate: () => {
                                    if (_this.isActive(section)) {
                                        Observer.getById(ID) ? Observer.getById(ID).kill() : null;
                                        tl.kill();
                                    }
                                }
                            }
                        })
                        .fromTo(
                            '.choose__slide.swiper-slide-active .slide-choose__image, .choose__pagination, .choose__head',
                            { opacity: 0 },
                            { opacity: 1 }
                        )
                        .to('.choose', { '--whiteGradientOpacity': 1 }, 0)
                        .fromTo(
                            `.choose__slide.swiper-slide-next .slide-choose__image, 
            #chooseItemText, .choose__characteristics, #chooseItemHeading`,
                            {
                                opacity: 0,
                                translateY: '7rem'
                            },
                            {
                                opacity: 1,
                                translateY: 0
                            },
                            1.2
                        )
                        .to(
                            '.choose__slide.swiper-slide-active .slide-choose__image',
                            { scale: 1, translateY: 0 },
                            1.2
                        )
                        .fromTo(
                            '.choose__sl-navigation, .choose__btn, .choose__list',
                            { opacity: 0 },
                            { opacity: 1, onStart: () => handleObserver() },
                            2
                        );
                }
            });

            if (!mm.matches) {
                section.addEventListener('mouseover', function (e) {
                    if (e.target.closest('.swiper-slide-active') || e.target.closest('.choose__heading')) {
                        section.classList.add(_this.classes.hovered);
                    } else {
                        section.classList.remove(_this.classes.hovered);
                    }
                });
            }
        }
    }

    init3DScroll(_this) {
        if (document.querySelector('.three-scroll')) {
            const SPEED = 600;
            const ID = 'scrollSection';

            const section = document.querySelector('.three-scroll');
            const slides = Array.from(section.querySelectorAll('[data-three-slide]'));
            const routesSlide = section.querySelector('[data-three-slide="routes"]');
            const routesIndx = slides.indexOf(routesSlide);

            gsap.matchMedia().add('(min-width: 768px)', () => {
                const slider = new Swiper('.three-scroll__swiper', {
                    observer: true,
                    speed: 600,
                    spaceBetween: 0,
                    preventInteractionOnTransition: true,
                    virtualTranslate: true,
                    enabled: false,
                    on: {
                        init: (swiper) => {
                            if (!mm.matches) _this.setSlideClasses(swiper);
                        },
                        slideChangeTransitionStart: (swiper) => {
                            _this.delayClass(section, _this.classes.anim, SPEED, swiper);

                            if (!mm.matches) {
                                _this.setSlideClasses(swiper);
                                swiper.wrapperEl.style.removeProperty('transform');
                            }
                        },
                        slidePrevTransitionStart: (swiper) => {
                            if (!mm.matches) {
                                _this.delayClass(section, _this.classes.reverseSl, SPEED);
                            }
                        },
                        slideNextTransitionStart: (swiper) => {
                            if (!mm.matches) {
                                _this.delayClass(section, _this.classes.forwardSl, SPEED);

                                if (
                                    routesSlide &&
                                    swiper.activeIndex === routesIndx &&
                                    !_this.isActive(routesSlide)
                                ) {
                                    routesSlide.classList.add(_this.classes.active);
                                }
                            }
                        }
                    },
                    breakpoints: {
                        768: {
                            enabled: true
                        }
                    }
                });

                const handleObserver = () => {
                    ScrollTrigger.observe({
                        target: section,
                        type: 'wheel,touch',
                        tolerance: 280,
                        id: ID,
                        onUp: (e) => {
                            if (slider.isBeginning) {
                                _this.unlockScroll();
                            } else {
                                e.disable();
                                locoScroll.scrollTo(section, {
                                    duration: 500,
                                    callback: () => {
                                        _this.lockScroll();
                                        slider.slidePrev();
                                    }
                                });

                                setTimeout(() => {
                                    e.enable();
                                }, 500);
                            }
                        },
                        onDown: (e) => {
                            if (slider.isEnd) {
                                _this.unlockScroll();
                            } else {
                                e.disable();
                                locoScroll.scrollTo(section, {
                                    duration: 500,
                                    callback: () => {
                                        _this.lockScroll();
                                        slider.slideNext();
                                    }
                                });

                                setTimeout(() => {
                                    e.enable();
                                }, 500);
                            }
                        }
                    });
                };

                _this.setSlideClasses(slider);

                const tl = gsap.timeline({
                    defaults: {
                        duration: 1.5,
                        ease: 'power2.out'
                    },
                    scrollTrigger: {
                        trigger: section,
                        scroller: _this.scroller,
                        id: ID,
                        start: 'top 35%',
                        bottom: 'bottom bottom',
                        onEnter: ({ progress }) => {
                            if (progress !== 1 && !mm.matches) {
                                locoScroll.scrollTo(section, {
                                    duration: 500,
                                    callback: () => {
                                        _this.lockScroll();
                                        handleObserver();
                                    }
                                });

                                if (!_this.isActive(slider.slides[0])) {
                                    _this.animateSpeedometer();
                                    slider.slides[0].classList.add(_this.classes.active);
                                }
                            }
                        },
                        onEnterBack: () => {
                            if (!mm.matches) {
                                locoScroll.scrollTo(section, {
                                    duration: 500,
                                    callback: () => {
                                        _this.lockScroll();
                                        handleObserver();
                                    }
                                });
                            }
                        },
                        onLeave: () => {
                            locoScroll.update();
                        }
                    }
                });
            });
            gsap.matchMedia().add('(max-width: 768px)', () => {
                Observer.getById(ID) ? Observer.getById(ID).kill() : null;
                ScrollTrigger.getById(ID) ? ScrollTrigger.getById(ID) : null;
                section.querySelector('.swiper-wrapper').style.removeProperty('transform');

                _this.unlockScroll();
            });
        }
    }

    init() {
        const _this = this;

        if (document.querySelector('.home-page')) {
            // init page loader
            this.initLoader(this);
        } else {
            _this.initHamburgerMenu(this);
        }

        // window load event
        window.addEventListener('load', function () {
            // add loaded class
            _this.docElement.classList.add(_this.classes.loaded);

            // fix footer cut off
            setTimeout(_this.updateScroll, 5000);

            // init utils
            _this.initUtils(_this);

            // locomotive scroll integration with gsap scroll trigger
            ScrollTrigger.scrollerProxy(_this.scroller, {
                scrollTop(value) {
                    return arguments.length
                        ? locoScroll.scrollTo(value, 0, 0)
                        : locoScroll.scroll.instance.scroll.y;
                },
                getBoundingClientRect() {
                    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                },
                pinType: _this.scroller.style.transform ? 'transform' : 'fixed'
            });
        });

        // locomotive scroll event & integration
        if (locoScroll) {
            if (!mm.matches) {
                locoScroll.on('scroll', (args) => {
                    ScrollTrigger.update();

                    if (document.querySelector('.home-page')) {
                        gsap.to(document.body, { '--scrollY': `${args.scroll.y}px` });
                    }
                    if (args.scroll.y === 0) {
                        gsap.to('.promotion-btn', { top: '89.3rem', translateY: 0 });
                    } else {
                        gsap.to('.promotion-btn', { top: '100vh', translateY: '-105%' });
                    }
                });
            }

            // scroll trigger integration with locomotive scroll
            ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
            ScrollTrigger.defaults({ scroller: _this.scroller });
        }

        // refresh gsap scroll trigger
        setTimeout(() => {
            ScrollTrigger.refresh();
            ScrollTrigger.update();
        }, 0);
    }
}
new HomePage();

const initRoutesModal = () => {
    const routesBtn = document.querySelector('.routes__tabs-info-button');
    if (routesBtn) {
        routesBtn.addEventListener('click', function () {
            const tabs = document.querySelectorAll('.routes__tabs-navigation .tab');

            console.log(tabs);
            if (tabs.length) {
                tabs.forEach((tab) => {
                    if (tab.classList.contains('_is-active')) {
                        const t = document.querySelector(`[data-routes-content="${tab.dataset.routesTab}"`);
                        document.querySelector('.attractions-modal__inner').innerHTML = t.innerHTML;

                        new Swiper(document.querySelector('.attractions-modal__inner .swiper'), {
                            modules: [Navigation, Pagination],
                            slidesPerView: 1,
                            spaceBetween: remToPx(4),
                            speed: 800,
                            pagination: {
                                el: '.attractions-modal__pagination',
                                type: 'bullets',
                                clickable: true,
                                renderBullet: function (index, className) {
                                    const indx = index >= 10 ? index : '0' + ++index;
                                    return `<span class="${className}" data-index="${indx}"></span>`;
                                }
                            }
                        });
                    }
                });
            }
        });
    }
};
initRoutesModal();
