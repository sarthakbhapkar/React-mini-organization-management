import React from 'react';

export const TextInput: React.FC<{
    value: string;
    onChange: (value: string) => void;
}> = ({ value, onChange }) => (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} />
);

export const NumberInput: React.FC<{
    value: number;
    onChange: (value: number) => void;
}> = ({ value, onChange }) => (
    <input type="number" value={value} onChange={e => onChange(Number(e.target.value))} />
);

export const SelectInput = <T extends string>({
                                                  value,
                                                  onChange,
                                                  options,
                                              }: {
    value: T;
    onChange: (value: T) => void;
    options: T[];
}) => (
    <select value={value} onChange={e => onChange(e.target.value as T)}>
        {options.map(opt => (
            <option key={opt} value={opt}>
                {opt}
            </option>
        ))}
    </select>
);
