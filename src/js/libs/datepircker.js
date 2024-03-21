import AirDatepicker from 'air-datepicker';

const options = {
    inline: false,
    isMobile: true,
    onSelect: ({ date }) => {
        Array.from(document.querySelectorAll('.input'), (input) => {
            input.blur();
            input.classList.remove('_has-error');
        });
    }
};

new AirDatepicker('#from', {
    ...options,
    autoClose: true
});

new AirDatepicker('#to', {
    ...options,
    autoClose: true
});
