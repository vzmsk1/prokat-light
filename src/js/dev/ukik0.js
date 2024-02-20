import Swiper from 'swiper';
import { EffectFade, Navigation, Thumbs } from 'swiper/modules';
import { remToPx } from '../utils/utils';

document.addEventListener('DOMContentLoaded', () => {
    function fade(activeSlide) {
        const text = document.querySelector('.routes__tabs-attractions-text');

        text.classList.remove('_visible');

        setTimeout(() => {
            text.classList.add('_visible');
            text.innerHTML = activeSlide.querySelector('.routes__tabs-attractions-swiper-text').textContent;
        }, 500);
    }

    const routesSwiper = new Swiper('.routes__tabs-attractions-swiper', {
        modules: [Navigation],
        slidesPerView: 1,
        spaceBetween: remToPx(4),
        speed: 1500,
        allowTouchMove: false,
        navigation: {
            prevEl: '.routes__tabs-attractions-navigation .swiper-button-prev',
            nextEl: '.routes__tabs-attractions-navigation .swiper-button-next'
        },
        on: {
            slideChange: ({ activeIndex, slides }) => {
                fade(slides[activeIndex]);
                setActiveRadioByIndex(activeIndex);
            },
            init: ({ activeIndex, slides }) => {
                fade(slides[activeIndex]);
            }
        }
    });

    Array.from(document.querySelectorAll('.routes__tabs-wrapper input[type="radio"]')).forEach((input) => {
        input.addEventListener('change', () => {
            const index = currentActiveRadioIndex();

            routesSwiper.slideTo(index);
        });
    });

    function currentActiveRadioIndex() {
        const inputs = document.querySelectorAll('.routes__tabs-wrapper input[type="radio"]');

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                return i;
            }
        }

        return -1;
    }

    function setActiveRadioByIndex(index) {
        const radioInputs = document.querySelectorAll('.routes__tabs-wrapper input[type="radio"]');

        radioInputs.forEach((input, i) => {
            input.checked = i === index;
        });
    }
});
