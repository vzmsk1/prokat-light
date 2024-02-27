import $ from 'jquery';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { remToPx } from '../utils/utils';
document.addEventListener('DOMContentLoaded', () => {
    function fade(activeSlide) {
        if (!activeSlide) return;

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
        if (!activeSlide) return;

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

    function setActiveClass(selector) {
        if (!document.querySelector(selector)) return;

        const items = document.querySelectorAll(selector);

        items.forEach((item) => {
            item.addEventListener('click', () => {
                removeActiveClass();

                item.classList.add('--active');
            });
        });

        function removeActiveClass() {
            items.forEach((item) => item.classList.remove('--active'));
        }
    }

    setActiveClass('.news__navigation-item');
    setActiveClass('.news__filters-item');

    $('.contact-form__file-input').bind('change', function () {
        const filename = $(this).val();

        if (/^\s*$/.test(filename)) {
            $('.contact-form__file label span').text(
                'Прикрепите документы (договор проката, водительское удостоверение,\n' +
                    '                                    паспорт)'
            );

            return;
        }

        $('.contact-form__file label span').text(filename.replace('C:\\fakepath\\', ''));
    });
});
