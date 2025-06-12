export type Validator<T> = (value: T) => string | null;

export const required = <T>(message = 'This field is required'): Validator<T> =>
    value => (value === null || value === undefined || value === '' ? message : null);

export const maxLength = (max: number): Validator<string> =>
    value => value.length > max ? `Maximum length is ${max}` : null;

export const numberRange = (min: number, max: number): Validator<number> =>
    value => (value < min || value > max) ? `Must be between ${min} and ${max}` : null;

export const emailFormat = (): Validator<string> =>
    value => /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email format';
