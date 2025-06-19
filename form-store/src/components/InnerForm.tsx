import React from 'react';
import {createSelectField, NumberField, StringField} from '../fields';
import {useFieldArray} from "../hooks/useFieldArray.tsx";
import {useFormContext} from "../context/FormContext.tsx";

const GenderField = createSelectField<'male' | 'female' | 'other'>();

export const InnerForm: React.FC = () => {
    const hobbiesArray = useFieldArray('hobbies');
    return (
        <form onSubmit={useFormContext().handleSubmit}
              style={{maxWidth: '400px', margin: '2rem auto'}}>
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

            <StringField name="address.street" label="Street" required/>
            <StringField name="address.city" label="City" required/>

            <div>
                <label>Hobbies</label>
                {hobbiesArray.fields.map((_hobby: { title: string }, index: number) => (
                    <div key={index}>
                        <StringField name={`hobbies.${index}.title`} label={`Hobby ${index + 1}`} required/>
                        <button type="button" onClick={() => hobbiesArray.remove(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={() => hobbiesArray.append({title: ''})}>Add Hobby</button>
            </div>

            <button type="submit">
                Submit
            </button>
        </form>
    );
};