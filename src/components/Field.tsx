import React, {useState} from 'react';
import { useFormContext } from '../context/FormContext';

type Validator<T> = (value: T) => string | null;

type FieldRenderProps<T> = {
    name: string;
    value: T;
    onChange: (val: T) => void;
};

interface FieldProps<T> {
    name: string;
    label: string;
    validators?: Validator<T>[];
    render: (props: FieldRenderProps<T>) => React.ReactNode;
}

export function Field<T>({ name, label, validators = [], render }: FieldProps<T>) {
    const form = useFormContext<any>();
    const value = form.values[name];
    const error = form.errors[name];
    const [touched, setTouched] = useState(false);

    const onChange = (val: T) => {
        form.updateField(name, val);
        setTouched(true);
    };

    const validationError = touched
            ? validators.map(v => v(value)).find(Boolean)
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

