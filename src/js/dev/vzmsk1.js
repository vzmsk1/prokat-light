import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import { MotionPathPlugin, ScrollTrigger } from 'gsap/all';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import Vivus from 'vivus';

import { setInnerContent, setCssProperty } from '../utils/utils';

// --------------------------------------------------------------------------

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
gsap.defaults({
    duration: 1
});

const mm = window.matchMedia('(max-width: 768px)');
const locoScroll = new LocomotiveScroll({
    el: document.querySelector('._smooth-scroll'),
    smooth: true
});

window.addEventListener('load', function () {
    const changeViewboxData = () => {
        if (document.querySelector('.speedometer__wrap')) {
            const wrap = document.querySelector('.speedometer__wrap');
            const [deskW, deskH, mobW, mobH] = wrap.dataset.viewbox.trim().split(',');
            wrap.setAttribute('viewBox', mm.matches ? `0 0 ${mobW} ${mobH}` : `0 0 ${deskW} ${deskH}`);
        }
    };
    changeViewboxData();

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

    /**
     * initializes sliders
     */
    const initSliders = () => {
        if (document.querySelector('.choose__slider')) {
            const textCnt = document.getElementById('chooseItemText');
            const priceCnt = document.getElementById('chooseItemPrice');
            const pledgeCnt = document.getElementById('chooseItemPledge');
            const headingCnt = document.getElementById('chooseItemHeading');

            const setContent = (swiper) => {
                const activeSlide = swiper.slides[swiper.activeIndex];
                const text = activeSlide.dataset.text;
                const price = activeSlide.dataset.price;
                const pledge = activeSlide.dataset.pledge;
                const heading = activeSlide.dataset.heading;

                setInnerContent(text, textCnt);
                setInnerContent(price, priceCnt);
                setInnerContent(pledge, pledgeCnt);
                setInnerContent(heading, headingCnt);
            };

            new Swiper('.choose__slider', {
                modules: [Navigation, Pagination],
                observer: true,
                loop: true,
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
                        setContent(swiper);
                    },
                    slideChangeTransitionStart: (swiper) => {
                        swiper.el.parentElement.classList.add('_is-animating');
                        setTimeout(() => {
                            swiper.el.parentElement.classList.remove('_is-animating');
                            swiper.animating = false;
                        }, 1000);
                    },
                    slidePrevTransitionStart: (swiper) => {
                        swiper.el.parentElement.classList.add('_prev-slide');
                        setTimeout(() => {
                            swiper.el.parentElement.classList.remove('_prev-slide');
                        }, 1000);
                    },
                    slideChange: (swiper) => {
                        setContent(swiper);
                    }
                },
                breakpoints: {
                    768: {
                        spaceBetween: 0,
                        virtualTranslate: true
                    }
                }
            });
        }
    };
    initSliders();

    /**
     * initializes hero animation
     */
    const initHeroAnim = () => {
        if (document.querySelector('.hero')) {
            const tl = gsap.timeline();

            tl.to('.hero', {
                '--y': 0,
                delay: 0.5,
                duration: 3.5
            })
                .fromTo(
                    '.hero__bg',
                    { clipPath: 'polygon(0 0, 100% 0%, 100% 0, 0 0)' },
                    {
                        clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
                        duration: 3.5
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
                        duration: 1
                    },
                    1.5
                )
                .to(
                    '.header',
                    {
                        translateY: 0,
                        duration: 1.5,
                        opacity: 1
                    },
                    3
                );
        }
    };

    /**
     * animates speedometer
     */
    const animateSpeedometer = () => {
        if (document.getElementById('speedometerProgress')) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: '.advantages',
                    start: 'top 200',
                    once: true,
                    onEnter: () => {
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
                                        delay: 0.8
                                    });

                                    gsap.from('#speedometerScore', {
                                        textContent: 0,
                                        duration: 1.1,
                                        delay: 0.8,
                                        snap: { textContent: 1 }
                                    });
                                }, 0);
                            }
                        });
                    }
                }
            });
        }
    };

    setTimeout(() => {
        ScrollTrigger.refresh();

        gsap.matchMedia().add('(min-width: 768px)', () => {
            const tl = gsap
                .timeline({
                    scrollTrigger: {
                        trigger: '.home-page__3d-scroll',
                        pin: true,
                        scrub: 0.1,
                        start: 'top top'
                    }
                })
                .to('.banner', {
                    scale: 0.8,
                    opacity: 0,
                    stagger: 1
                })
                .to('.advantages', {
                    scale: 1,
                    opacity: 1,
                    stagger: 1
                })
                .to('.advantages', {
                    scale: 0.8,
                    opacity: 0,
                    stagger: 1
                })
                .to('.author', {
                    scale: 1,
                    opacity: 1,
                    stagger: 1
                });

            return () => {
                tl.kill();
            };
        });
    }, 1000);

    window.requestAnimationFrame(function () {
        initHeroAnim();
        animateSpeedometer();
    });

    setCssProperty(document.querySelectorAll('[data-tr-speed]'), 'transitionDuration', 'trSpeed');
    setCssProperty(document.querySelectorAll('[data-tr-delay]'), 'transitionDelay', 'trDelay');
    mm.addEventListener('change', function () {
        initSliders();
        changeViewboxData();
    });
});
