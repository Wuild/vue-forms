import { type App, type Ref, type ComputedRef } from 'vue';
interface FormErrors {
    [key: string]: string[];
}
export interface FormInstance<T> {
    processing: Ref<boolean>;
    progress: Ref<number | null>;
    errors: FormErrors;
    isDirty: ComputedRef<boolean>;
    hasErrors: ComputedRef<boolean>;
    reset: () => void;
    clearErrors: () => void;
    setError: (field: string, message: string) => void;
    submit: (callback: (data: T) => Promise<any>) => Promise<any>;
    getFields: () => Record<string, any>;
}
export declare function useForm<T extends object = Record<string, any>>(initialData?: T): FormInstance<T> & T;
export declare const FormPlugin: {
    install: (app: App) => void;
};
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $form: <T extends object>(initialData: T) => FormInstance<T>;
    }
}
export {};
