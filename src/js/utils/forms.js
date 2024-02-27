import { modules } from '../modules.js';

// --------------------------------------------------------------------------

class Validation {
    constructor() {
        this.attrs = {
            REQUIRED: 'data-required',
            IGNORE_VALIDATION: 'data-ignore-validation',
            AJAX: 'data-ajax',
            DEV: 'data-dev',
            IGNORE_FOCUS: 'data-ignore-focus',
            SHOW_PLACEHOLDER: 'data-show-placeholder',
            VALIDATE: 'data-validate'
        };
        this.classes = {
            HAS_ERROR: '_has-error',
            HAS_FOCUS: '_has-focus'
        };
    }

    getErrors(form) {
        let err = 0;
        let requiredFields = form.querySelectorAll(`*[${this.attrs.REQUIRED}]`);

        if (requiredFields.length) {
            requiredFields.forEach((requiredField) => {
                if (
                    (requiredField.offsetParent !== null ||
                        requiredField.tagName === 'SELECT' ||
                        requiredField.dataset.fileInput) &&
                    !requiredField.disabled
                ) {
                    err += this.validateField(requiredField);
                }
            });
        }
        return err;
    }

    addError(requiredField) {
        requiredField.classList.add(this.classes.HAS_ERROR);
        requiredField.parentElement.classList.add(this.classes.HAS_ERROR);
    }

    removeError(requiredField) {
        requiredField.classList.remove(this.classes.HAS_ERROR);
        requiredField.parentElement.classList.remove(this.classes.HAS_ERROR);
    }

    validateField(requiredField) {
        let err = 0;

        if (requiredField.dataset.required === 'email') {
            requiredField.value = requiredField.value.replace(' ', '');

            if (this.testEmail(requiredField)) {
                this.addError(requiredField);
                err++;
            } else {
                this.removeError(requiredField);
            }
        } else if (requiredField.type === 'checkbox' && !requiredField.checked) {
            this.addError(requiredField);
            err++;
        } else if (requiredField.type === 'file') {
            const _this = this;
            const reader = new FileReader();
            const parent = requiredField.parentElement;
            const hint = document.querySelector('.contact-form__file-input-hint');

            const addErr = () => {
                parent.classList.add('_error');
                parent.classList.remove('_filled');
                _this.addError(requiredField);
                err++;
            };

            reader.onload = function (e) {
                const maxSize = Number(requiredField.dataset.fileInputSize);
                const file = requiredField.files[0];

                if (file) {
                    console.log(file);
                    const placeholder = parent.querySelector('[data-file-placeholder]');
                    const data = {
                        name: file.name.split('.').slice(0, -1).join(''),
                        size: file.size,
                        extension: file.name.split('.').pop()
                    };
                    const extensions = ['pdf'];

                    const formatBytes = (bytes) => {
                        if (bytes >= 1000) {
                            return `${(bytes / 1048576).toFixed(2)} mб`;
                        }
                        return `${bytes} б`;
                    };

                    // if ((data.size / 1048576).toFixed(2) > maxSize) {
                    //   text.innerHTML = 'Большой размер файла';
                    //   addErr();
                    // }
                    if (hint && !extensions.includes(data.extension)) {
                        placeholder ? (placeholder.innerHTML = placeholder.dataset.filePlaceholder) : null;
                        hint.innerHTML = 'Файл должен иметь формат pdf';
                        addErr();
                    } else {
                        if (requiredField.value.trim().length) {
                            parent.classList.remove('_error');
                            parent.classList.add('_filled');
                            _this.removeError(requiredField);
                        }
                    }
                }
            };

            if (!requiredField.value.trim().length) {
                addErr();
                hint.innerHTML = 'Прикрепите документы';
            } else {
                if (requiredField.files[0]) reader.readAsDataURL(requiredField.files[0]);
            }
        } else {
            if (!requiredField.value.trim().length) {
                this.addError(requiredField);
                err++;
            } else {
                this.removeError(requiredField);
            }
        }
        return err;
    }

    clearFields(form) {
        form.reset();

        setTimeout(() => {
            const inputs = form.querySelectorAll('input,textarea');
            const checkboxes = form.querySelectorAll('input[type="checkbox"]');

            if (inputs.length) {
                for (let index = 0; index < inputs.length; index++) {
                    const input = inputs[index];

                    input.parentElement.classList.remove(this.classes.HAS_FOCUS);
                    input.classList.remove(this.classes.HAS_FOCUS);
                    this.removeError(input);

                    if (input.type && input.type === 'file') {
                        const placeholder = input.parentElement.querySelector('[data-file-placeholder]');
                        input.value = '';
                        this.removeError(input);

                        if (placeholder) {
                            placeholder.innerHTML = placeholder.dataset.filePlaceholder;
                        }
                    }
                }
            }
            if (checkboxes.length) {
                for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
            }
        }, 0);
    }

    testEmail(requiredField) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(requiredField.value);
    }
}
class FormSubmition extends Validation {
    constructor(shouldValidate) {
        super();
        this.shouldValidate = shouldValidate ? shouldValidate : true;
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    sendForm(form, responseResult = ``) {
        document.dispatchEvent(
            new CustomEvent('sendForm', {
                detail: {
                    form: form
                }
            })
        );

        // show modal, if popup module is connected
        setTimeout(() => {
            if (modules.modal) {
                const modal = form.dataset.modalMessage;
                modal ? modules.modal.open(modal) : null;
            }
        }, 0);

        this.clearFields(form);

        console.log('is sent');
    }

    async handleSubmition(form, e) {
        this.getErrors(form);
        const err = !form.hasAttribute(this.attrs.IGNORE_VALIDATION)
            ? form.querySelectorAll('[data-required]._has-error').length
            : 0;
        console.log(err);

        if (err === 0) {
            const ajax = form.hasAttribute(this.attrs.AJAX);

            if (ajax) {
                e.preventDefault();

                const action = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
                const method = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
                const data = new FormData(form);

                form.classList.add('_is-sending');

                const response = await fetch(action, {
                    method: method,
                    body: data
                });

                if (response.ok) {
                    const result = await response.json();
                    form.classList.remove('_is-sending');
                    this.sendForm(form, result);
                } else {
                    alert('error');
                    form.classList.remove('_is-sending');
                }
            } else if (form.hasAttribute(this.attrs.DEV)) {
                // in development mode
                e.preventDefault();
                this.sendForm(form);
            }
        } else {
            e.preventDefault();
        }
    }

    init() {
        const _this = this;

        if (this.forms.length) {
            this.forms.forEach((form) => {
                form.addEventListener('submit', function (e) {
                    _this.handleSubmition(e.target, e);
                });
                form.addEventListener('reset', function (e) {
                    _this.clearFields(e.target);
                });
            });
        }
    }
}
class FormFields extends Validation {
    constructor() {
        super();
        this.fields = document.querySelectorAll('input,textarea');
        this.init();
    }

    savePlaceholder() {
        if (this.fields.length) {
            this.fields.forEach((field) => {
                if (!field.hasAttribute(this.attrs.SHOW_PLACEHOLDER)) {
                    field.dataset.placeholder = field.placeholder;
                }
            });
        }
    }

    handleFocusin(e) {
        const target = e.target;

        if (
            (target.tagName === 'INPUT' &&
                target.type !== 'file' &&
                target.type !== 'checkbox' &&
                target.type !== 'radio') ||
            target.tagName === 'TEXTAREA'
        ) {
            if (target.dataset.placeholder) target.placeholder = '';

            if (!target.hasAttribute(this.attrs.IGNORE_FOCUS)) {
                target.classList.add(this.classes.HAS_FOCUS);
                target.parentElement.classList.add(this.classes.HAS_FOCUS);
                target.classList.remove(this.classes.HAS_ERROR);
                target.parentElement.classList.remove(this.classes.HAS_ERROR);
            }

            this.removeError(target);
        }
    }

    handleFocusout(e) {
        const target = e.target;
        if (
            (target.tagName === 'INPUT' &&
                target.type !== 'file' &&
                target.type !== 'checkbox' &&
                target.type !== 'radio') ||
            target.tagName === 'TEXTAREA'
        ) {
            if (target.dataset.placeholder) {
                target.placeholder = target.dataset.placeholder;
            }

            if (!target.hasAttribute(this.attrs.IGNORE_FOCUS)) {
                target.classList.remove(this.classes.HAS_FOCUS);
                target.parentElement.classList.remove(this.classes.HAS_FOCUS);
            }
            if (target.hasAttribute(this.attrs.VALIDATE)) {
                this.validateField(target);
            }
        }
    }

    init() {
        // save placeholder in data attribute
        this.savePlaceholder();

        // handle submition
        new FormSubmition();

        // events
        document.body.addEventListener('focusin', this.handleFocusin.bind(this));
        document.body.addEventListener('focusout', this.handleFocusout.bind(this));
        if (document.querySelectorAll('[data-file-input]').length) {
            document.querySelectorAll('[data-file-input]').forEach((fileInput) => {
                fileInput.addEventListener('input', function () {
                    new Validation().validateField(fileInput);
                });
            });
        }
    }
}

// --------------------------------------------------------------------------

new FormFields();
