import { getValue, setValue } from '../utils/path';
import { useFormContext } from '../context/FormContext';

export function useFieldArray<T>(name: string) {
    const form = useFormContext<T>();

    const fields = getValue(form.values, name) || [];

    const append = (val: { title: string }) => {
        const newArr = [...fields, val];
        const updated = structuredClone(form.values);
        setValue(updated, name, newArr);
        form.setValues(updated);
    };

    const remove = (index: number) => {
        const newArr = fields.filter((_title: string, i: number) => i !== index);
        const updated = structuredClone(form.values);
        setValue(updated, name, newArr);
        form.setValues(updated);
    };

    return { fields, append, remove };
}
