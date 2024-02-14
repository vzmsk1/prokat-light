import gsap from 'gsap';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import AOS from 'aos';

import { setInnerContent } from '../utils/utils';

// --------------------------------------------------------------------------

AOS.init({
    once: true,
    duration: 700
});

document.addEventListener('DOMContentLoaded', function () {
    const mm = window.matchMedia('(max-width: 768px)');
    const gsapMm = gsap.matchMedia();

    /**
     * initializes hero animation
     */
    const initHeroAnim = () => {
        if (document.querySelector('.hero')) {
            const tl = gsap.timeline();

            tl.to('.hero__mountains_front', {
                translateY: 0,
                duration: 3
            })
                .to(
                    '.hero__mountains_back',
                    {
                        clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
                        duration: 3
                    },
                    0
                )
                .to(
                    '.hero__content',
                    {
                        bottom: 0,
                        translateY: 0,
                        duration: 2
                    },
                    1.5
                )
                .to(
                    '.hero__car img',
                    {
                        scale: 1,
                        duration: 2
                    },
                    1.5
                )
                .to(
                    '.hero__content',
                    {
                        opacity: 1,
                        visibility: 'visible',
                        duration: 1.5
                    },
                    2.3
                );
        }
    };
    initHeroAnim();

    /**
     * initializes sliders
     */
    const initSliders = () => {
        if (document.querySelector('.choose__slider')) {
            const textCnt = document.getElementById('chooseItemText');
            const priceCnt = document.getElementById('chooseItemPrice');
            const pledgeCnt = document.getElementById('chooseItemPledge');
            const setContent = (swiper) => {
                const activeSlide = swiper.slides[swiper.activeIndex];
                const text = activeSlide.dataset.text;
                const price = activeSlide.dataset.price;
                const pledge = activeSlide.dataset.pledge;

                setInnerContent(text, textCnt);
                setInnerContent(price, priceCnt);
                setInnerContent(pledge, pledgeCnt);
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
                    clickable: true,
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
                        setTimeout(function () {
                            swiper.animating = false;
                        }, 0);
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
    setTimeout(function () {
        AOS.refresh();
    }, 500);
});
