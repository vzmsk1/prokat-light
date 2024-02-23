import Swiper from 'swiper';
import { EffectFade, Navigation, Thumbs } from 'swiper/modules';
import { remToPx } from '../utils/utils';

document.addEventListener('DOMContentLoaded', () => {
    function fade(activeSlide) {
        if (!activeSlide) return

        const parent = activeSlide.closest('.routes__tabs-attractions');

        const text = parent.querySelector('.routes__tabs-attractions-text');

        text.classList.remove('_visible');
        text.classList.remove('_shown');

        setTimeout(() => {
            text.classList.add('_visible');
            text.innerHTML = activeSlide.querySelector('.routes__tabs-attractions-swiper-text').textContent;
        }, 500);
    }

    function showText(activeSlide) {
        if (!activeSlide) return

        const parent = activeSlide.closest('.routes__tabs-attractions');

        const text = parent.querySelector('.routes__tabs-attractions-text');

        text.innerHTML = activeSlide.querySelector('.routes__tabs-attractions-swiper-text').textContent;

        text.classList.add('_shown');
    }

    Array.from(document.querySelectorAll('.routes__tabs-attractions-swiper')).forEach((swiper) => {
        new Swiper(swiper, {
            modules: [Navigation],
            slidesPerView: 1,
            spaceBetween: remToPx(4),
            speed: 1500,
            allowTouchMove: false,
            navigation: {
                prevEl: swiper.querySelector('.swiper-button-prev'),
                nextEl: swiper.querySelector('.swiper-button-next')
            },
            on: {
                slideChange: ({ activeIndex, slides }) => {
                    fade(slides[activeIndex]);
                },
                init: ({ activeIndex, slides }) => {
                    showText(slides[activeIndex]);
                }
            }
        });
    });
});
