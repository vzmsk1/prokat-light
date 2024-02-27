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
import { setInnerContent, bodyLock, bodyUnlock, bodyLockStatus } from '../utils/utils';

// gsap plugins & defaults
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, Observer);
gsap.defaults({
    duration: 1,
    ease: 'circ.out'
});

// --------------------------------------------------------------------------

// media query (mobile)
const mm = window.matchMedia('(max-width: 768px)');

class HomePage {
    constructor() {
        this.docElement = document.documentElement;
        this.scroller = document.querySelector('._smooth-scroll');

        // locomotive scroll instance
        this.locoScroll = new LocomotiveScroll({
            el: this.scroller,
            smooth: true,
            multiplier: mm.matches ? 1.1 : 0.6,
            smoothMobile: true,
            smartphone: {
                smooth: true
            }
        });

        // general classes
        this.classes = {
            menuOpened: '_menu-opened',
            anim: '_is-animating',
            reverseSl: '_reverse',
            forwardSl: '_forward',
            passed: '_is-passes',
            hovered: '_is-hovered'
        };

        // special utils methods
        this.unlockScroll = () => {
            if (bodyLockStatus) {
                bodyUnlock();
                if (this.locoScroll) this.locoScroll.start();
            }
        };
        this.lockScroll = () => {
            if (bodyLockStatus) {
                bodyLock();
                if (this.locoScroll) this.locoScroll.stop();
            }
        };
        this.updateScroll = () => {
            if (this.locoScroll) this.locoScroll.update();
        };
        this.setSlideClasses = (swiper) => {
            swiper.slides.forEach((slide, i) => {
                slide.classList.remove('_is-next', '_is-prev');

                if (i > swiper.activeIndex) {
                    slide.classList.add('_is-next');
                } else if (i < swiper.activeIndex) {
                    slide.classList.add('_is-prev');
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

        // code will execute for home page only
        if (document.querySelector('.home-page')) {
            this.init();
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
                        _this.locoScroll.scrollTo(anchor.dataset.anchor, {
                            duration: 2.5,
                            offset: -40,
                            immediate: false
                        });
                    });
                });
            }
        };
        initAnchors();

        /**
         * init hamburger menu
         */
        const initHamburgerMenu = () => {
            if (document.querySelector('.header__hamburger')) {
                const hamburgerBtn = document.querySelector('.header__hamburger');
                const closeMenu = () => {
                    _this.unlockScroll();
                    _this.docElement.classList.remove(this.classes.menuOpened);
                };

                hamburgerBtn.addEventListener('click', function (e) {
                    if (bodyLockStatus) {
                        if (_this.docElement.classList.contains(this.classes.menuOpened)) {
                            closeMenu();
                        } else {
                            _this.lockScroll();
                            _this.docElement.classList.add(this.classes.menuOpened);
                        }
                    }
                });

                mm.addEventListener('change', function () {
                    if (!mm.matches) {
                        closeMenu();
                    }
                });
            }
        };
        initHamburgerMenu();

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

                        // execute hero animation
                        _this.animateHero(_this);
                    }
                }, 100);
            };
            imgLoad(document.images[num]);
        }
    }

    initAnimations(_this) {
        _this.animateChooseSection();
        _this.animateSpeedometer();
        _this.init3DScroll();
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
                            setTimeout(_this.unlockScroll, 2000);
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
                        scale: 1
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

    animateChooseSection() {
        const DESK_DELAY = 400;
        const MOBILE_DELAY = 600;
        const SPEED = 600;
        const ID = 'chooseSection';

        const _this = this;
        const section = document.querySelector('.choose');

        /**
         * check if section is passed
         * @returns {boolean}
         */
        const isPassed = () => {
            return section.classList.contains(_this.classes.passed);
        };
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
            const slider = new Swiper('.choose__slider', {
                modules: [Navigation, Pagination],
                observer: true,
                spaceBetween: 30,
                speed: SPEED,
                navigation: {
                    nextEl: '.choose__sl-arr_next',
                    prevEl: '.choose__sl-arr_prev'
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
                        virtualTranslate: true
                    }
                },
                on: {
                    init: (swiper) => {
                        setSlideContent(swiper);
                        if (!mm.matches) _this.setSlideClasses(swiper);
                    },
                    slideChangeTransitionStart: (swiper) => {
                        setSlideContent(swiper);
                        _this.delayClass(carousel, _this.classes.anim, SPEED, swiper);

                        if (!mm.matches) {
                            _this.setSlideClasses(swiper);
                            swiper.wrapperEl.style.removeProperty('transform');
                        }
                    },
                    slidePrevTransitionStart: (swiper) => {
                        if (!mm.matches) {
                            _this.delayClass(carousel, _this.classes.reverseSl, SPEED);
                        }
                    },
                    slideNextTransitionStart: (swiper) => {
                        if (!mm.matches) {
                            _this.delayClass(carousel, _this.classes.forwardSl, SPEED);
                        }
                    },
                    reachEnd: (swiper) => {
                        if (!mm.matches) {
                            setTimeout(() => {
                                _this.unlockScroll();
                                section.classList.add(_this.classes.passed);
                            }, SPEED);
                        }
                    }
                }
            });

            /**
             * handle gsap observer
             */
            const handleObserver = () => {
                _this.locoScroll.scrollTo(section);

                setTimeout(() => {
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
                }, 500);
            };

            gsap.matchMedia().add('(min-width: 768px)', () => {
                slider.wrapperEl.style.removeProperty('transform');
                _this.setSlideClasses(slider);

                if (!isPassed()) {
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
                                start: 'top 35%',
                                onEnter: () => {
                                    if (!isPassed()) {
                                        _this.locoScroll.scrollTo(section);
                                        setTimeout(() => _this.lockScroll(), 1000);
                                    }
                                },
                                onUpdate: () => {
                                    if (isPassed()) {
                                        Observer.getById(ID) ? Observer.getById(ID).kill() : null;
                                        tl.kill();
                                    }
                                }
                            }
                        })
                        .fromTo(
                            '.choose__slide.swiper-slide-active .slide-choose__image, .choose__pagination',
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

            if (mm.matches) {
                section.classList.add(_this.classes.passed);
            } else {
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

    init3DScroll() {
        if (document.querySelector('.three-scroll')) {
            const _this = this;
            const SPEED = 600;
            const ID = 'scrollSection';

            const section = document.querySelector('.three-scroll');
            const slider = new Swiper('.three-scroll__swiper', {
                observer: true,
                speed: 600,
                spaceBetween: 0,
                preventInteractionOnTransition: true,
                virtualTranslate: true,
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
                        }
                    }
                }
            });

            const isPassed = () => {
                return section.classList.contains(_this.classes.passed);
            };

            const handleObserver = () => {
                // _this.locoScroll.scrollTo(section);

                setTimeout(() => {
                    _this.lockScroll();

                    ScrollTrigger.observe({
                        target: section,
                        type: 'wheel,touch',
                        tolerance: 280,
                        id: ID,
                        onUp: () => {
                            if (slider.isBeginning) {
                                _this.unlockScroll();
                            } else {
                                slider.slidePrev();
                                _this.lockScroll();
                            }
                        },
                        onDown: (e) => {
                            if (slider.isEnd) {
                                _this.unlockScroll();
                            } else {
                                slider.slideNext();
                                _this.lockScroll();
                            }
                        }
                    });
                }, 500);
            };

            gsap.matchMedia().add('(min-width: 768px)', () => {
                slider.wrapperEl.style.removeProperty('transform');
                _this.setSlideClasses(slider);

                const tl = gsap.timeline({
                    defaults: {
                        duration: 1.5,
                        ease: 'power2.out'
                    },
                    scrollTrigger: {
                        trigger: section,
                        scroller: _this.scroller,
                        start: 'top 35%',
                        bottom: 'bottom bottom',
                        markers: true,
                        onEnter: (self) => {
                            _this.locoScroll.scrollTo(section);
                            setTimeout(() => {
                                _this.lockScroll();
                                handleObserver();
                            }, 1000);
                        },
                        onEnterBack: () => {
                            _this.locoScroll.scrollTo(section);
                            setTimeout(() => {
                                _this.lockScroll();
                                handleObserver();
                            }, 1000);
                        }
                    }
                });
            });
        }
    }

    init() {
        const _this = this;

        // init page loader
        this.initLoader(this);

        // window load event
        window.addEventListener('load', function () {
            // fix footer cut off
            setTimeout(_this.updateScroll, 5000);

            // init utils
            _this.initUtils(_this);

            // locomotive scroll integration with gsap scroll trigger
            ScrollTrigger.scrollerProxy(_this.scroller, {
                scrollTop(value) {
                    return arguments.length
                        ? _this.locoScroll.scrollTo(value, 0, 0)
                        : _this.locoScroll.scroll.instance.scroll.y;
                },
                getBoundingClientRect() {
                    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                },
                pinType: _this.scroller.style.transform ? 'transform' : 'fixed'
            });

            // init sliders
            _this.initAnimations(_this);
        });

        // locomotive scroll event & integration
        if (_this.locoScroll) {
            _this.locoScroll.on('scroll', (args) => {
                ScrollTrigger.update();

                gsap.to(document.body, { '--scrollY': `${args.scroll.y}px` });
            });

            // scroll trigger integration with locomotive scroll
            ScrollTrigger.addEventListener('refresh', () => _this.locoScroll.update());
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
