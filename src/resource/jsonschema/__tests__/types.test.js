import { castInputValue } from '../types';

describe('castInputValue', () => {
    it('it converts to true', () => {
        const value = 'true';
        const schema = {
            type: 'boolean',
        };
        expect(castInputValue(value, schema)).toEqual(true);
    });
    it('it converts to true for array', () => {
        const value = 'true';
        const schema = {
            type: ['boolean'],
        };
        expect(castInputValue(value, schema)).toEqual(true);
    });
    it('it converts to false', () => {
        const value = 'false';
        const schema = {
            type: 'boolean',
        };
        expect(castInputValue(value, schema)).toEqual(false);
    });
    it('it converts to false for array', () => {
        const value = 'false';
        const schema = {
            type: ['boolean'],
        };
        expect(castInputValue(value, schema)).toEqual(false);
    });
});
