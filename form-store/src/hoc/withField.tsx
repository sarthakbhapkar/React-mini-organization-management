import React from 'react';
import { Field } from '../components/Field';
import { type Validator } from '../utils/validations';

export interface WithFieldProps<T> {
    name: string;
    label: string;
    validators?: Validator<T>[];
    required?: boolean;
    emailFormat?: boolean;
    numberRange?: [number, number];
    maxLength?: number;
}

export function withField<
    T extends any,
    P extends { name: string; value: T; onChange: (val: T) => void }
>(
    Component: React.ComponentType<P>
): React.FC<Omit<P, 'value' | 'onChange' | 'name'> &
    WithFieldProps<T> & { onChange?: (val: T) => void }> {
    return ({
                name,
                label,
                validators = [],
                onChange: externalOnChange,
                required,
                emailFormat,
                numberRange,
                maxLength,
                ...rest
            }) => {
        return (
            <Field<T>
                name={name}
                label={label}
                validators={validators}
                required={required}
                emailFormat={emailFormat}
                numberRange={numberRange}
                maxLength={maxLength}
                render={({ name, value, onChange }) => {
                    const combinedOnChange = (val: T) => {
                        onChange(val);
                        if (externalOnChange) externalOnChange(val);
                    };

                    const props = {
                        name,
                        value,
                        onChange: combinedOnChange,
                        ...(rest as unknown as Omit<P, 'value' | 'onChange' | 'name'>),
                    } as P;

                    return <Component {...props} />;
                }}
            />
        );
    };
}
