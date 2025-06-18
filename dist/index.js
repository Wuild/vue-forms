'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

function useForm(initialData = {}) {
    const data = vue.reactive({ ...initialData });
    const processing = vue.ref(false);
    const progress = vue.ref(null);
    const errors = vue.reactive({});
    const originalData = { ...initialData };
    const isDirty = vue.computed(() => {
        return JSON.stringify(data) !== JSON.stringify(originalData);
    });
    const hasErrors = vue.computed(() => {
        return Object.keys(errors).length > 0;
    });
    const reset = () => {
        Object.assign(data, originalData);
        clearErrors();
    };
    const clearErrors = () => {
        Object.keys(errors).forEach((key) => delete errors[key]);
    };
    const setError = (field, message) => {
        if (!errors[field]) {
            errors[field] = [];
        }
        errors[field].push(message);
    };
    const submit = async (callback) => {
        var _a, _b;
        processing.value = true;
        clearErrors();
        try {
            const response = await callback(data);
            processing.value = false;
            return response;
        }
        catch (error) {
            processing.value = false;
            if ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.errors) {
                Object.keys(error.response.data.errors).forEach((key) => {
                    errors[key] = error.response.data.errors[key];
                });
            }
            throw error;
        }
    };
    const getFields = () => {
        const deepUnref = (val) => {
            const unwrapped = vue.unref(val);
            if (Array.isArray(unwrapped)) {
                return unwrapped.map((item) => deepUnref(item));
            }
            if (unwrapped && typeof unwrapped === 'object') {
                const result = {};
                for (const key in unwrapped) {
                    if (Object.prototype.hasOwnProperty.call(unwrapped, key)) {
                        result[key] = deepUnref(unwrapped[key]);
                    }
                }
                return result;
            }
            return unwrapped;
        };
        return deepUnref(data);
    };
    const form = {
        processing,
        progress,
        errors,
        isDirty,
        hasErrors,
        reset,
        clearErrors,
        setError,
        submit,
        getFields
    };
    return new Proxy(form, {
        get(target, prop) {
            if (prop in target) {
                const value = target[prop];
                if (prop === 'processing' || prop === 'progress') {
                    return value.value;
                }
                return value;
            }
            return data[prop];
        },
        set(target, prop, value) {
            if (prop in data) {
                data[prop] = value;
                return true;
            }
            if (prop === 'processing' || prop === 'progress') {
                target[prop].value = value;
                return true;
            }
            target[prop] = value;
            return true;
        }
    });
}
// Vue Plugin
const FormPlugin = {
    install: (app) => {
        app.config.globalProperties.$form = useForm;
    }
};

exports.FormPlugin = FormPlugin;
exports.useForm = useForm;
//# sourceMappingURL=index.js.map
