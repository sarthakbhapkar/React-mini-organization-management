import React from 'react';
import { Field } from '../components/Field';
import {
    required as requiredValidator,
    emailFormat as emailFormatValidator,
    maxLength as maxLengthValidator,
    numberRange as numberRangeValidator,
    type Validator
} from '../utils/validations';

export interface WithFieldProps<T> {
    name: string;
    label: string;
    validators?: Validator<T>[];
    required?: boolean;
    emailFormat?: boolean;
    numberRange?: [number, number];
    maxLength?: number;
}

export function withField<T extends any, P extends { name: string; value: T; onChange: (val: T) => void }>(
    Component: React.ComponentType<P>
): React.FC<Omit<P, 'value' | 'onChange' | 'name'> &
    WithFieldProps<T> &
    { onChange?: (val: T) => void }> {

    return ({
                name,
                label,
                validators = [],
                onChange: externalOnChange,
                required,
                emailFormat,
                numberRange: range,
                maxLength: maxLen,
                ...rest
            }) => {

        const generated: Validator<any>[] = [];

        if (required) {
            generated.push(requiredValidator());
        }

        if (emailFormat && typeof ('' as T) === 'string') {
            generated.push(emailFormatValidator());
        }

        if (range && typeof (0 as T) === 'number') {
            generated.push(numberRangeValidator(range[0], range[1]));
        }

        if (maxLen !== undefined && typeof ('' as T) === 'string') {
            generated.push(maxLengthValidator(maxLen));
        }

        const generatedValidators: Validator<T>[] = [
            ...generated,
            ...validators,
        ];

        return (
            <Field<T>
                name={name}
                label={label}
                validators={generatedValidators}
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

