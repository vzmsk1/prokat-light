import Swiper from 'swiper';
import { remToPx } from '../utils/utils';
import { Pagination } from 'swiper/modules';

document.addEventListener('DOMContentLoaded', () => {
    const resizableSwiper = (
        swiperClass,
        swiperSettings = {},
        breakpoint = '(max-width: 768px)',
        callback
    ) => {
        if (!document.querySelector(swiperClass)) return;

        let swiper;

        breakpoint = window.matchMedia(breakpoint);

        const enableSwiper = function (className, settings) {
            swiper = new Swiper(className, settings);

            if (callback) {
                callback(swiper);
            }
        };

        const checker = function () {
            if (breakpoint.matches) {
                return enableSwiper(swiperClass, swiperSettings);
            }

            if (swiper) swiper.destroy(true, true);
        };

        breakpoint.addEventListener('change', checker);
        checker();
    };

    resizableSwiper('.condition-info-swiper', {
        modules: [Pagination],
        slidesPerView: 1,
        speed: 1200,
        spaceBetween: remToPx(4.8),
        pagination: {
            el: '.condition__pagination',
            type: 'bullets',
            renderBullet: function (index, className) {
                return `<span class="${className}"></span>`;
            }
        }
    });

    resizableSwiper('.popular-promotions-swiper', {
        modules: [Pagination],
        slidesPerView: 1,
        speed: 1200,
        spaceBetween: remToPx(4.8),
        pagination: {
            el: '.popular__pagination',
            type: 'bullets',
            renderBullet: function (index, className) {
                return `<span class="${className}"></span>`;
            }
        }
    });

    resizableSwiper('.similar-swiper', {
        modules: [Pagination],
        slidesPerView: 1,
        speed: 1200,
        spaceBetween: remToPx(4.8),
        pagination: {
            el: '.similar__pagination',
            type: 'bullets',
            renderBullet: function (index, className) {
                return `<span class="${className}"></span>`;
            }
        }
    });
});
