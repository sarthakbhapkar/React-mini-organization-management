import { useFormContext } from "../context/FormContext";
import React from "react";

type FieldProps<TFormData, TKey extends keyof TFormData> = {
    name: TKey;
    label?: string;
    required?: boolean;
    render: (props: {
        name: string;
        value: TFormData[TKey];
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) => React.ReactElement;
};

export function Field<T, K extends keyof T>({
                                                name,
                                                label,
                                                required = false,
                                                render,
                                            }: FieldProps<T, K>) {
    const form = useFormContext<T>();
    const value = form.values[name];
    const error = form.errors[name];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = (e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value) as T[K];
        form.updateField(name, inputValue);
    };

    return (
        <div style={{ marginBottom: "1rem" }}>
            <label htmlFor={String(name)}>
                {label} {required && <span style={{ color: "red" }}>*</span>}
            </label>

            {render({
                name: String(name),
                value,
                onChange: handleChange,
            })}

            {error && <span style={{ color: "red", fontSize: "0.9rem" }}>{error}</span>}
        </div>
    );
}
