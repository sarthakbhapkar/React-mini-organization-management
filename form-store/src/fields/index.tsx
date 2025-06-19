import { TextInput, NumberInput, SelectInput } from '../components/inputs';
import { withField } from '../hoc/withField';

export const StringField = withField<string, { name: string; value: string; onChange: (val: string) => void }>(TextInput);
export const NumberField = withField<number, { name: string; value: number; onChange: (val: number) => void }>(NumberInput);

export function createSelectField<T extends string>() {
    return withField<T, { name: string; value: T; onChange: (val: T) => void; options: T[] }>(SelectInput);
}
