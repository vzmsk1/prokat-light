import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { remToPx } from '../utils/utils';

import $ from 'jquery';

document.addEventListener('DOMContentLoaded', () => {
    function fade(activeSlide) {
        if (!activeSlide) return;

        const parent = activeSlide.closest('.routes__tabs-attractions');

        const text = parent.querySelector('.routes__tabs-attractions-text');

        text.classList.remove('_visible');
        text.classList.remove('_shown');

        setTimeout(() => {
            text.classList.add('_shown');
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

    if (document.querySelector('.routes')) {
        document.querySelectorAll('.routes__tabs-navigation button').forEach((button) => {
            button.addEventListener('click', () => {
                const elements = Array.from(document.querySelectorAll('.routes__tabs-navigation button'));

                elements.forEach((element, index) => {
                    setTimeout(() => {
                        if (element.classList.contains('_is-active')) {
                            animateMap(index + 1);
                        }
                    }, 0);
                });
            });
        });
    }

    function animateMap(index) {
        if (window.innerWidth < 768) return;

        const map = document.querySelector('.routes__tabs-map');
        const overlay = document.querySelector('.routes__tabs-overlay');

        switch (index) {
            case 1:
                map.style.transform = 'scale(1.75) translate(62.7rem, -33.5rem) rotate(6deg)';
                overlay.style.opacity = 1;
                break;
            case 2:
                map.style.transform = 'rotate(0deg) scale(0.51) translate(-2.3rem, -40.5rem)';
                overlay.style.opacity = 0;
                break;
            case 3:
                map.style.transform = 'rotate(5deg) scale(.8) translate(29.7rem, -46.5rem)';
                overlay.style.opacity = 1;
                break;

            default:
                overlay.style.opacity = 1;
                map.style.transform = 'rotate(7deg) scale(1.75) translate(57.7rem, -41.5rem)';
        }
    }
});
