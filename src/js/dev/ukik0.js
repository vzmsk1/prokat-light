import $ from 'jquery';
import Swiper from 'swiper';
import { EffectCoverflow, EffectFade, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { _slideToggle, _slideUp, remToPx } from '../utils/utils';
import { wrap } from 'gsap/gsap-core';

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
    setActiveClass('.detailed__rent-item');

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
                map.style.transform = 'scale(1.75) translate(63rem, -33.5rem) rotate(6deg)';
                overlay.style.opacity = 1;
                break;
            case 2:
                map.style.transform = 'rotate(0deg) scale(0.51) translate(-2.3rem, -40.5rem)';
                overlay.style.opacity = 0;
                break;
            case 3:
                map.style.transform = 'rotate(6deg) scale(.8) translate(29.7rem, -46.5rem)';
                overlay.style.opacity = 1;
                break;

            default:
                overlay.style.opacity = 1;
                map.style.transform = 'rotate(7deg) scale(1.75) translate(57.7rem, -41rem)';
        }
    }

    if (document.querySelector('.detailed')) {
        const detailedGalleryThumbs = new Swiper('.detailed-gallery-thumbnails', {
            slidesPerView: 3,
            freeMode: true,
            watchSlidesProgress: true,
            spaceBetween: remToPx(1.6),
            speed: 1200,
            slideToClickedSlide: true
        });

        const detailedGallery = new Swiper('.detailed-gallery-swiper', {
            modules: [Thumbs, Navigation, Pagination],
            speed: 1200,
            grabCursor: true,
            thumbs: {
                swiper: detailedGalleryThumbs
            },

            navigation: {
                prevEl: '.detailed__gallery-thumbnail .prev',
                nextEl: '.detailed__gallery-thumbnail .next'
            },
            slidesPerView: 1,
            pagination: {
                el: '.detailed__gallery-pagination',
                type: 'bullets',
                clickable: true,
                renderBullet: function (index, className) {
                    return `<span class="${className}"></span>`;
                }
            },
            breakpoints: {
                0: {
                    spaceBetween: remToPx(3.2)
                },
                768: {
                    spaceBetween: remToPx(1.6)
                }
            }
        });

        document
            .querySelector('.detailed__gallery-characteristics-dropdown-heading')
            .addEventListener('click', function () {
                const parent = this.closest('.detailed__gallery-characteristics-dropdown');

                parent.classList.toggle('--active');

                const wrapper = parent.querySelector('.detailed__gallery-characteristics-dropdown-wrapper');

                _slideToggle(wrapper, 300);
            });

        const prevEl = document.querySelector('.gallery__navigation-button.prev');
        const nextEl = document.querySelector('.gallery__navigation-button.next');

        new Swiper('.gallery-modal-swiper', {
            modules: [Navigation, Thumbs],
            thumbs: {
                swiper: detailedGallery
            },
            slidesPerView: 1,
            spaceBetween: remToPx(4.8),
            speed: 1200,
            navigation: {
                prevEl,
                nextEl
            }
        });

        const wrapper = document.querySelector('.gallery__wrapper').querySelector('.swiper-wrapper');

        const slides = Array.from(document.querySelectorAll('.detailed__gallery-image'), (slide) => {
            const copy = slide.cloneNode(true);

            copy.classList.replace('detailed__gallery-image', 'gallery__image');

            return copy;
        });

        slides.forEach((slide) => {
            const element = document.createElement('li');

            element.classList.add('swiper-slide');

            element.append(slide);

            wrapper.append(element);
        });
    }

    const clickOutside = (selector, callback) => {
        const element = document.querySelector(selector);

        if (!element) return;

        document.addEventListener('click', (event) => {
            const isBoundary = event.composedPath().includes(element);

            if (!isBoundary) {
                callback();
            }
        });
    };

    clickOutside('.detailed__gallery-characteristics-dropdown', () => {
        const dropdown = document.querySelector('.detailed__gallery-characteristics-dropdown');

        dropdown.classList.remove('--active');

        _slideUp(dropdown.querySelector('.detailed__gallery-characteristics-dropdown-wrapper'), 300);
    });
});
