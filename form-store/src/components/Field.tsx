import React, { useState } from 'react';
import { useFormContext } from '../context/FormContext';
import { getValue, setValue } from '../utils/path';
import {
    required as requiredValidator,
    emailFormat as emailFormatValidator,
    maxLength as maxLengthValidator,
    numberRange as numberRangeValidator,
    type Validator,
} from '../utils/validations';

type FieldRenderProps<T> = {
    name: string;
    value: T;
    onChange: (val: T) => void;
};

interface FieldProps<T> {
    name: string;
    label: string;
    validators?: Validator<T>[];
    required?: boolean;
    emailFormat?: boolean;
    numberRange?: [number, number];
    maxLength?: number;
    render: (props: FieldRenderProps<T>) => React.ReactNode;
}

export function Field<T>({
                             name,
                             label,
                             validators = [],
                             required,
                             emailFormat,
                             numberRange,
                             maxLength,
                             render,
                         }: FieldProps<T>) {
    const form = useFormContext<any>();
    const [touched, setTouched] = useState(false);

    const value = getValue(form.values, name);
    const error = getValue(form.errors, name);

    const onChange = (val: T) => {
        const updated = { ...form.values };
        setValue(updated, name, val);
        form.setValues(updated);
        setTouched(true);
    };

    const generated: Validator<any>[] = [];

    if (required) {
        generated.push(requiredValidator());
    }

    if (emailFormat && typeof value === 'string') {
        generated.push(emailFormatValidator());
    }

    if (numberRange && typeof value === 'number') {
        generated.push(numberRangeValidator(numberRange[0], numberRange[1]));
    }

    if (maxLength !== undefined && typeof value === 'string') {
        generated.push(maxLengthValidator(maxLength));
    }

    const finalValidators: Validator<T>[] = [
        ...generated,
        ...validators,
    ];

    const validationError = touched
        ? finalValidators.map(v => v(value)).find(Boolean)
        : undefined;

    const finalError = error || validationError;

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label>
                <div>{label}</div>
                {render({ name, value, onChange })}
            </label>
            {finalError && <div style={{ color: 'red' }}>{finalError}</div>}
        </div>
    );
}
