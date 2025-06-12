import React from 'react';
import { createSelectField, NumberField, StringField } from '../fields';
import { useForm } from '../hooks/UseFormHook';

import {
    emailFormat,
    maxLength,
    numberRange,
    required,
} from '../utils/validations';
import {FormProvider} from '../context/FormContext';

type SampleFormData = {
    name: string;
    email: string;
    age: number;
    gender: 'male' | 'female' | 'other';
};

const GenderField = createSelectField<'male' | 'female' | 'other'>();

const SampleForm: React.FC = () => {

    const form = useForm<SampleFormData>({
        initialValues: {
            name: '',
            email: '',
            age: 0,
            gender: 'male',
        },
        validate: validateAll
    });

    function validateAll(): Partial<Record<keyof SampleFormData, string>> {
        const errors: Partial<Record<keyof SampleFormData, string>> = {};

        const nameErrors = form.validateField('name', [required(), maxLength(20)]);
        if (nameErrors.length > 0) {
            errors.name = nameErrors[0];
        }

        const emailErrors = form.validateField('email', [required(), emailFormat()]);
        if (emailErrors.length > 0) {
            errors.email = emailErrors[0];
        }

        const ageErrors = form.validateField('age', [required(), numberRange(18, 99)]);
        if (ageErrors.length > 0) {
            errors.age = ageErrors[0];
        }

        const genderErrors = form.validateField('gender', [required()]);
        if (genderErrors.length > 0) {
            errors.gender = genderErrors[0];
        }
        return errors;
    }

    return (
        <FormProvider value={form}>
            <form onSubmit={form.handleSubmit}
                style={{ maxWidth: '400px', margin: '2rem auto' }}>
                <StringField
                    name="name"
                    label="Name"
                    required
                    maxLength={20}
                    onChange={(val) => console.log('External change:', val)}
                />
                <StringField
                    name="email"
                    label="Email"
                    required
                    emailFormat
                />
                <NumberField
                    name="age"
                    label="Age"
                    required
                    numberRange={[18, 99]}
                />
                <GenderField
                    name="gender"
                    label="Gender"
                    required
                    options={['male', 'female', 'other']}
                />
                <button type="submit">
                    Submit
                </button>
            </form>
        </FormProvider>
    );
};

export default SampleForm;

