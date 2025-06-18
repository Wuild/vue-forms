import {ref, reactive, computed, type App, type Ref, type ComputedRef, unref} from 'vue'

interface FormErrors {
    [key: string]: string[]
}

export interface FormInstance<T> {
    processing: Ref<boolean>
    progress: Ref<number | null>
    errors: FormErrors
    isDirty: ComputedRef<boolean>
    hasErrors: ComputedRef<boolean>
    reset: () => void
    clearErrors: () => void
    setError: (field: string, message: string) => void
    submit: (callback: (data: T) => Promise<any>) => Promise<any>
    // Add the new method
    getFields: () => Record<string, any>
}

export function useForm<T extends object = Record<string, any>>(initialData: T = {} as T): FormInstance<T> & T {
    const data = reactive({...initialData}) as T
    const processing = ref(false)
    const progress = ref<number | null>(null)
    const errors = reactive<FormErrors>({})
    const originalData = {...initialData}

    const isDirty = computed(() => {
        return JSON.stringify(data) !== JSON.stringify(originalData)
    })

    const hasErrors = computed(() => {
        return Object.keys(errors).length > 0
    })

    const reset = () => {
        Object.assign(data, originalData)
        clearErrors()
    }

    const clearErrors = () => {
        Object.keys(errors).forEach((key) => delete errors[key])
    }

    const setError = (field: string, message: string) => {
        if (!errors[field]) {
            errors[field] = []
        }
        errors[field].push(message)
    }

    const submit = async (callback: (data: T) => Promise<any>) => {
        processing.value = true
        clearErrors()

        try {
            const response = await callback(data)
            processing.value = false
            return response
        } catch (error: any) {
            processing.value = false
            if (error.response?.data?.errors) {
                Object.keys(error.response.data.errors).forEach((key) => {
                    errors[key] = error.response.data.errors[key]
                })
            }
            throw error
        }
    }

    const getFields = () => {
        const deepUnref = (val: any): any => {
            const unwrapped = unref(val)

            if (Array.isArray(unwrapped)) {
                return unwrapped.map((item) => deepUnref(item))
            }

            if (unwrapped && typeof unwrapped === 'object') {
                const result: Record<string, any> = {}
                for (const key in unwrapped) {
                    if (Object.prototype.hasOwnProperty.call(unwrapped, key)) {
                        result[key] = deepUnref(unwrapped[key])
                    }
                }
                return result
            }

            return unwrapped
        }

        return deepUnref(data)
    }

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
    }

    return new Proxy(form as FormInstance<T> & T, {
        get(target: any, prop: string) {
            if (prop in target) {
                const value = target[prop]
                if (prop === 'processing' || prop === 'progress') {
                    return value.value
                }
                return value
            }
            return (data as Record<string, any>)[prop]
        },
        set(target: any, prop: string, value: any) {
            if (prop in data) {
                (data as Record<string, any>)[prop] = value
                return true
            }
            if (prop === 'processing' || prop === 'progress') {
                target[prop].value = value
                return true
            }
            target[prop] = value
            return true
        }
    })
}

// Vue Plugin
export const FormPlugin = {
    install: (app: App) => {
        app.config.globalProperties.$form = useForm
    }
}

// Type declarations for Options API
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $form: <T extends object>(initialData: T) => FormInstance<T>
    }
}
