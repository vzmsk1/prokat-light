import LocomotiveScroll from 'locomotive-scroll';
import gsap from 'gsap';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';

import { setInnerContent, setCssProperty } from '../utils/utils';

// --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const mm = window.matchMedia('(max-width: 768px)');

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
                    clickable: mm ? true : false,
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

    mm.addEventListener('change', initSliders);
});

window.addEventListener('load', function () {
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector('._smooth-scroll'),
        smooth: true
    });

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

    setCssProperty(document.querySelectorAll('[data-tr-speed]'), 'transitionDuration', 'trSpeed');
    setCssProperty(document.querySelectorAll('[data-tr-delay]'), 'transitionDelay', 'trDelay');
});
window.requestAnimationFrame(function () {
    /**
     * initializes hero animation
     */
    const initHeroAnim = () => {
        if (document.querySelector('.hero')) {
            const tl = gsap.timeline();

            tl.fromTo(
                '.hero__mountains_front',
                { translateY: '-100%' },
                {
                    translateY: 0,
                    duration: 3
                }
            )
                .fromTo(
                    '.hero__mountains_back',
                    { clipPath: 'polygon(0 0, 100% 0%, 100% 0, 0 0)' },
                    {
                        clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
                        duration: 3
                    },
                    0
                )
                .fromTo(
                    '.hero__content',
                    { translateY: '100%' },
                    {
                        translateY: 0,
                        duration: 2.5
                    },
                    1
                )
                .fromTo(
                    '.hero__content',
                    { opacity: 0, visibility: 'hidden' },
                    {
                        opacity: 1,
                        visibility: 'visible',
                        duration: 0.5
                    },
                    1.5
                )
                .fromTo(
                    '.header',
                    {
                        translateY: '-100%'
                    },
                    {
                        translateY: 0,
                        duration: 2
                    },
                    1.5
                );
            // .to(
            //     '.hero__car img',
            //     {
            //         scale: 1,
            //         duration: 2
            //     },
            //     1.5
            // )
        }
    };
    initHeroAnim();
});
