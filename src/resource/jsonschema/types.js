/* Cast a JSON value to a JSON Schema primitive type.
 */
export function castInputValue(value, type) {
    if (type === 'integer' || type === 'long') {
        return parseInt(value, 10);
    }
    if (type === 'float' || type === 'double') {
        return parseFloat(value);
    }
    if (type === 'boolean') {
        return value.toLowerCase() === 'true' || value === '1';
    }
    if (type === 'date' || type === 'dateTime') {
        return new Date(value);
    }
    if (type === 'byte') {
        return Buffer.from(value, 'base64');
    }
    if (type === 'binary') {
        return Buffer.from(value, 'binary');
    }
    return value;
}

/* Cast a value to JSON.
 */
export function castOutputValue(value) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    return value;
}
