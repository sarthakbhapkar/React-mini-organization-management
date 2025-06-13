export function getValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
}

export function setValue(obj: any, path: string, value: any): any {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((o, p) => o[p] ??= {}, obj);
    target[lastKey] = value;
    return obj;
}
