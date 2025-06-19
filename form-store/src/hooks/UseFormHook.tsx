import React, {useState} from "react";
import type {Validator} from "../utils/validations.ts";
import {setValue} from "../utils/path.ts";

type Errors<T> = Partial<Record<keyof T, string>>;
type DisabledFields<T> = Partial<Record<keyof T, boolean>>;

interface UseFormProps<T> {
    initialValues: T;
    validate?: (values: T) => Errors<T>;
    onSubmit?: (values: T) => void;
}

export interface UseFormReturn<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    updateField: (path: string, value: any) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    resetForm: () => void;
    disableField: (field: keyof T) => void;
    enableField: (field: keyof T) => void;
    disabledFields: DisabledFields<T>;
    isSubmitted: boolean;
    validateField: <K extends keyof T>(key: K, validators: Validator<T[K]>[]) => string[];
    setValues: (vals: T) => void;
}

export function useForm<T extends Record<string, any>>({initialValues, validate, onSubmit}: UseFormProps<T>):UseFormReturn<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Errors<T>>({});
    const [disabledFields, setDisabledFields] = useState<DisabledFields<T>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const updateField = (path: string, value: any) => {
        setValues(prev => {
            const updated = { ...prev };
            setValue(updated, path, value);
            return updated;
        });

        if (validate) {
            const newErrors = validate({ ...values });
            setErrors(newErrors);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate ? validate(values) : {};
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            alert(`Form submitted with values: ${JSON.stringify(values, null, 2)}`);
            if (onSubmit) {
                onSubmit(values);
            }
            setIsSubmitted(true);
        }else {
            alert("Please fix form errors before submitting.");
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
        setDisabledFields({});
        setIsSubmitted(false);
    };

    const validateField = <K extends keyof T>(key: K, validators: Validator<T[K]>[]): string[] => {
        const value = values[key];
        const fieldErrors: string[] = [];

        for (const validator of validators) {
            const error = validator(value);
            if (error) fieldErrors.push(error);
        }

        setErrors(prev => ({ ...prev, [key]: fieldErrors[0] }));
        return fieldErrors;
    };

    const disableField = (field: keyof T) => {
        setDisabledFields((prev) => ({...prev, [field]: true}));
    };

    const enableField = (field: keyof T) => {
        setDisabledFields((prev) => ({...prev, [field]: false}));
    };

    return {
        values,
        errors,
        updateField,
        handleSubmit,
        resetForm,
        disableField,
        enableField,
        disabledFields,
        isSubmitted,
        validateField,
        setValues
    };
}