import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';

$(document).ready(function () {
    $('.contacts').length > 0 ? initMap() : null;
    !!$('.condition').length && conditionSlider();
});

const markers = [
    {
        address: 'Можайский вал, 10',
        coordinate: [37.528583852499565, 55.73236309372132],
        active: false
    },
    {
        address: 'Можайский вал, 10',
        coordinate: [37.639430799072265, 55.76706090220457],
        active: true
    }
];

async function initMap() {
    await ymaps3.ready;
    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;
    const map = new YMap(document.getElementById('contacts-map'), {
        location: {
            center: [37.588144, 55.733842],
            zoom: 12,
        }
    });
    map.addChild(new YMapDefaultSchemeLayer());
    map.addChild(new YMapDefaultFeaturesLayer({ zIndex: 1800 }));

    markers.forEach((el) => {
        let content = document.createElement('div');
        content.classList.add('marker', el.type);
        content.insertAdjacentHTML(
            'beforeend',
            `
				<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M49.2857 21.4285C49.2857 32.1 30 57.8571 30 57.8571C30 57.8571 10.7143 32.1 10.7143 21.4285C10.7143 16.3136 12.7462 11.4082 16.3629 7.79148C19.9797 4.1747 24.8851 2.14282 30 2.14282C35.1149 2.14282 40.0203 4.1747 43.6371 7.79148C47.2538 11.4082 49.2857 16.3136 49.2857 21.4285V21.4285Z" stroke="#FF6C01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M30 27.8571C33.5504 27.8571 36.4286 24.979 36.4286 21.4286C36.4286 17.8782 33.5504 15 30 15C26.4496 15 23.5714 17.8782 23.5714 21.4286C23.5714 24.979 26.4496 27.8571 30 27.8571Z" stroke="#FF6C01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M49.2857 21.4285C49.2857 32.1 30 57.8571 30 57.8571C30 57.8571 10.7143 32.1 10.7143 21.4285C10.7143 16.3136 12.7462 11.4082 16.3629 7.79148C19.9797 4.1747 24.8851 2.14282 30 2.14282C35.1149 2.14282 40.0203 4.1747 43.6371 7.79148C47.2538 11.4082 49.2857 16.3136 49.2857 21.4285V21.4285Z" stroke="#FF6C01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M30 27.8571C33.5504 27.8571 36.4286 24.979 36.4286 21.4286C36.4286 17.8782 33.5504 15 30 15C26.4496 15 23.5714 17.8782 23.5714 21.4286C23.5714 24.979 26.4496 27.8571 30 27.8571Z" stroke="#FF6C01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			`
        );
        el.active ? $(content).addClass('active') : null;
        clickMarker(content, el);
        const marker = new YMapMarker({ coordinates: el.coordinate, draggable: false }, content);
        map.addChild(marker);
    });
}

function clickMarker(content, marker) {
    $(content).on('click', function () {
        changeMarkers(content, marker);
    });
}

function changeMarkers(content, marker) {
    $('.marker').removeClass('active');
    markers.forEach((el) => (el.active = false));
    marker.active = true;
    $(content).addClass('active');
}

function remToPx(remValue) {
    // Получаем текущий базовый размер шрифта (font-size) из элемента <html>
    var htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    // Переводим значение из rem в px
    var pxValue = remValue * htmlFontSize;

    // Округляем значение до целых пикселей (по желанию)
    return Math.round(pxValue) + 'px';
}

function conditionSlider() {
    new Swiper('.condition__slider', {
        modules: [Navigation, Pagination],
        speed: 1200,
        navigation: {
            nextEl: '.condition__slider-next',
            prevEl: '.condition__slider-prev'
        },
        breakpoints: {
            0: {
                centeredSlides: true,
                slidesPerView: 1.9,
                loop: true,
                spaceBetween: 0,
                pagination: {
                    el: '.condition__footer-pagination',
                    type: 'bullets',
                    clickable: true,
                    renderBullet: function (index, className) {
                        return `<span class="${className}"></span>`;
                    }
                }
            },
            768: {
                slidesPerView: 7,
                spaceBetween: `${remToPx(7.35)}`
            }
        }
    });
}
