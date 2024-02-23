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

// --------------------------------------------------------------------------

/**
 * hero animation
 */
const animateHero = () => {
    if (document.querySelector('.hero')) {
        bodyLock()

        const tl = gsap.timeline();

        tl.fromTo(
            '.hero__mountains',
            {
                translateY: '-110%'
            },
            {
                translateY: 0,
                delay: 0.5,
                duration: 3
            }
        )
            .fromTo(
                '.hero__bg',
                { clipPath: 'polygon(0 0, 100% 0%, 100% 0, 0 0)' },
                {
                    clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
                    duration: 3
                },
                0.6
            )
            .fromTo(
                '.hero__content',
                { translateY: '100%' },
                {
                    translateY: 0,
                    duration: 2
                },
                1.2
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
                            bodyUnlock()
                        }, 2000);
                    }
                },
                2
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
                2
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
                    opacity: 1,
                    translateY: 0,
                    scale: 1
                },
                2
            )
            .to(
                '.choose',
                {
                    '--groundOpacity': 1
                },
                3
            );
    }
};

// loader
if (document.querySelector('.loader') && bodyLockStatus) {
    const percentVal = document.getElementById('percentVal');
    let percent = 0;

    const incrementProgress = () => {
        percent += 1;
        percentVal.innerText = `${percent}`;
        if (percent < 100) {
            window.requestAnimationFrame(incrementProgress);
        } else {
            document.documentElement.classList.add('_is-loaded');
            bodyUnlock();

            setTimeout(() => {
                document.querySelector('.loader').remove();
            }, 600);

            animateHero();
        }
    };
    bodyLock();

    window.requestAnimationFrame(incrementProgress);
}

// gsap plugins & defaults
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, Observer);
gsap.defaults({
    duration: 1,
    ease: 'circ.out'
});

window.addEventListener('load', function () {
    // media query (mobile)
    const mm = window.matchMedia('(max-width: 768px)');


    // locomotive scroll instance
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector('._smooth-scroll'),
        smooth: true,
        multiplier: 1.2
    });
    setTimeout(() => {
        locoScroll.update();
    }, 5000);


    /**
     * initializes hamburger menu
     */
    const menuInit = () => {
        if (document.querySelector('.header__hamburger')) {
            document.addEventListener('click', function (e) {
                if (bodyLockStatus && e.target.closest('.header__hamburger')) {
                    menuToggle()
                }
            });
        }
    };
    menuInit()
    /**
     * opens hamburger menu
     */
    const menuOpen = () => {
        bodyLock();
        locoScroll.stop()
        document.documentElement.classList.add('_menu-opened');
    };
    /**
     * closes hamburger menu
     */
    const menuClose = () => {
        bodyUnlock();
        locoScroll.start()
        document.documentElement.classList.remove('_menu-opened');
    };
    /**
     * opens / closes hamburger menu=
     */
    const menuToggle = () => {
        if (bodyLockStatus) {
            if (document.documentElement.classList.contains('_menu-opened')) {
                menuClose()
            } else {
                menuOpen()
            }
        }
    }

    /**
     * initializes anchors
     */
    const initAnchors = () => {
        const anchors = document.querySelectorAll('[data-scroll-to]');

        if (anchors.length) {
            anchors.forEach((anchor) => {
                anchor.addEventListener('click', function () {
                    locoScroll.scrollTo(anchor.dataset.scrollTo, {
                        duration: 2.5,
                        offset: -40,
                        immediate: false
                    });
                });
            });
        }
    };
    initAnchors();

    // locomotive scroll integration with scroll trigger
    ScrollTrigger.scrollerProxy('._smooth-scroll', {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector('._smooth-scroll').style.transform ? 'transform' : 'fixed'
    });

    /**
     * sets slide content
     * @param swiper
     */
    const setSlideContent = (swiper) => {
        const activeSlide = swiper.slides[swiper.activeIndex];

        setInnerContent(activeSlide.dataset.text, document.getElementById('chooseItemText'));
        setInnerContent(activeSlide.dataset.price, document.getElementById('chooseItemPrice'));
        setInnerContent(activeSlide.dataset.pledge, document.getElementById('chooseItemPledge'));

        setTimeout(() => {
            setInnerContent(activeSlide.dataset.heading, document.getElementById('chooseItemHeading'));
        }, 300);
    };

    /**
     * sets prev & next classes to slides
     * @param swiper
     */
    const setSlidesClasses = (swiper) => {
        swiper.slides.forEach((slide, i) => {
            slide.classList.remove('_is-next');
            slide.classList.remove('_is-prev');

            if (i > swiper.activeIndex) {
                slide.classList.add('_is-next');
            } else if (i < swiper.activeIndex) {
                slide.classList.add('_is-prev');
            }
        });
    };

    // locomotive scroll event
    locoScroll.on('scroll', (args) => {
        ScrollTrigger.update();

        gsap.to(document.body, { '--scrollY': `${args.scroll.y}px` });
    });

    // scroll trigger integration with locomotive scroll
    ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
    ScrollTrigger.defaults({ scroller: '._smooth-scroll' });


    /**
     * changes viewbox attribute vars
     */
    const changeViewboxData = () => {
        if (document.querySelector('.speedometer__wrap')) {
            const wrap = document.querySelector('.speedometer__wrap');
            const [deskW, deskH, mobW, mobH] = wrap.dataset.viewbox.trim().split(',');
            wrap.setAttribute('viewBox', mm.matches ? `0 0 ${mobW} ${mobH}` : `0 0 ${deskW} ${deskH}`);
        }
    };
    changeViewboxData();

    /**
     * choose section animation
     */
    const animateChooseSection = () => {
        if (document.querySelector('.choose')) {
            const section = document.querySelector('.choose');
            const chooseSlider = new Swiper('.choose__slider', {
                modules: [Navigation, Pagination],
                observer: true,
                slideToClickedSlide: true,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.choose__sl-arr_next',
                    prevEl: '.choose__sl-arr_prev'
                },
                pagination: {
                    el: '.choose__pagination',
                    type: 'bullets',
                    clickable: mm.matches ? true : false,
                    renderBullet: function (index, className) {
                        const indx = index >= 10 ? index : '0' + ++index;
                        return `<span class="${className}" data-index="${indx}"></span>`;
                    }
                },
                on: {
                    init: (swiper) => {
                        setSlideContent(swiper);
                        if (!mm.matches) setSlidesClasses(swiper);
                    },
                    slideChangeTransitionStart: (swiper) => {
                        setSlideContent(swiper);
                        if (!mm.matches) {
                            setSlidesClasses(swiper);
                            swiper.el.parentElement.classList.add('_is-animating');

                            setTimeout(() => {
                                swiper.el.parentElement.classList.remove('_is-animating');
                                swiper.animating = false;
                            }, 500);

                            swiper.el.querySelector('.swiper-wrapper').style.removeProperty('transform');
                        }
                    },
                    slidePrevTransitionStart: (swiper) => {
                        if (!mm.matches) {
                            swiper.el.parentElement.classList.add('_prev-slide');

                            setTimeout(() => {
                                swiper.el.parentElement.classList.remove('_prev-slide');
                            }, 1000);
                        }
                    },
                    reachEnd: (swiper) => {
                        if (!mm.matches) {
                            setTimeout(() => {
                                bodyUnlock();
                                locoScroll.start();
                                swiper.el.closest('section').classList.add('_is-passed');
                            }, 500);
                        }
                    }
                },
                breakpoints: {
                    768: {
                        spaceBetween: 0,
                        preventInteractionOnTransition: true,
                        virtualTranslate: true
                    }
                }
            });

            gsap.matchMedia().add('(min-width: 768px)', () => {
                document.querySelector('.choose__wrapper').style.removeProperty('transform');
                setSlidesClasses(chooseSlider);

                const isPassed = () => {
                    return section.classList.contains('_is-passed');
                };

                if (!isPassed()) {
                    const handleObserver = () => {
                        locoScroll.scrollTo(section);
                        setTimeout(() => {
                            locoScroll.stop();
                            bodyLock();

                            ScrollTrigger.observe({
                                target: '.choose',
                                type: 'wheel,touch',
                                tolerance: 280,
                                id: 'chooseSection',
                                onUp: () => chooseSlider.slidePrev(),
                                onDown: (e) => {
                                    if (e.deltaY === 0) {
                                        setTimeout(() => {
                                            chooseSlider.slideNext();
                                        }, 500);
                                    } else {
                                        chooseSlider.slideNext();
                                    }
                                }
                            });
                        }, 500);
                    };
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
                                trigger: '.choose',
                                scroller: '._smooth-scroll',
                                start: 'top 35%',
                                onEnter: () => {
                                    if (!isPassed()) {
                                        locoScroll.scrollTo(section);
                                        locoScroll.stop();
                                        bodyLock();
                                    }
                                },
                                onUpdate: () => {
                                    if (isPassed()) {
                                        Observer.getById('chooseSection')
                                            ? Observer.getById('chooseSection').kill()
                                            : null;
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
                            2
                        )
                        .to(
                            '.choose__slide.swiper-slide-active .slide-choose__image',
                            { scale: 1, translateY: 0 },
                            2
                        )
                        .fromTo(
                            '.choose__sl-navigation, .choose__btn, .choose__list',
                            { opacity: 0 },
                            { opacity: 1, onStart: () => handleObserver() },
                            3
                        );
                }
            });

            if (mm.matches) {
                section.classList.add('_is-passed');
            }
        }
    };
    animateChooseSection();

    /**
     * animates speedometer
     */
    const animateSpeedometer = () => {
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
                            duration: 1.1,
                            delay: 0.9
                        });

                        gsap.from('#speedometerScore', {
                            textContent: 0,
                            duration: 1.1,
                            delay: 0.8,
                            snap: { textContent: 1 }
                        });

                        gsap.to('.speedometer__text-wrap', { opacity: 1, visibility: 'visible', delay: 0.8 });
                    }, 0);
                }
            });
        }
    };
    /**
     * initializes 3d-scroll
     */
    const init3DScroll = () => {
        const section = document.querySelector('.three-scroll');
        const children = Array.from(section.children);

        if (section) {
            gsap.matchMedia().add('(min-width: 768px)', () => {
                ScrollTrigger.refresh();
                ScrollTrigger.update();
                ScrollTrigger.getById('3dScrollSection')
                    ? ScrollTrigger.getById('3dScrollSection').kill()
                    : null;

                const setProgressClasses = (_this) => {
                    const activeIndex = children.indexOf(_this.targets()[0]);
                    const prevIndex = activeIndex - 1 > 0 ? activeIndex - 1 : 0;

                    children.forEach((child, i) => {
                        child.classList.remove('_is-prev', '_is-next', '_is-visible');

                        if (i < activeIndex) {
                            child.classList.add('_is-prev');
                        } else if (i > activeIndex) {
                            child.classList.add('_is-next');
                        }
                    });

                    _this.targets()[0].classList.add('_is-visible');
                };

                const tl = gsap
                    .timeline({
                        scrollTrigger: {
                            trigger: section,
                            pin: true,
                            scrub: true,
                            scroller: '._smooth-scroll',
                            end: '+=2800'
                        }
                    })
                    .to(children, {
                        stagger: {
                            each: 6,
                            onStart() {
                                const activeIndex = children.indexOf(this.targets()[0]);

                                if (
                                    activeIndex === 1 &&
                                    !document.querySelector('.speedometer._is-complete')
                                ) {
                                    animateSpeedometer();
                                    document.querySelector('.speedometer').classList.add('_is-complete');
                                }
                            },
                            onComplete() {
                                setProgressClasses(this);
                            },
                            onReverseComplete() {
                                setProgressClasses(this);
                            }
                        },
                        opacity: 1,
                        visibility: 'visible',
                        translateZ: '0rem',
                        duration: 1.5
                    });
            });
            gsap.matchMedia().add('(max-width: 768px)', () => {
                children.forEach((child) => child.removeAttribute('style'));

                if (!document.querySelector('.speedometer._is-complete')) {
                    gsap.set('.speedometer__text-wrap', { opacity: 0 });

                    gsap.timeline({
                        scrollTrigger: {
                            trigger: '.advantages',
                            start: 'top 200',
                            id: '3dScrollSection',
                            once: true,
                            onEnter: () => {
                                animateSpeedometer();
                            }
                        }
                    });
                }

                if (document.querySelector('.choose'))
                    document.querySelector('.choose').classList.add('_is-passed');

                bodyUnlock();
                locoScroll.start();
            });
            gsap.matchMedia().revert();
        }
    };
    init3DScroll();

    // listen to media query
    mm.addEventListener('change', function () {
        changeViewboxData();

        if (!mm.matches) {
            menuClose()
        }
    });

    setTimeout(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
    }, 0);
});
