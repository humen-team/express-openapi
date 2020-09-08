import { validate } from 'uuid';

export function uuidFormat(input) {
    return input === null || validate(input);
}

export function userIdFormat(input) {
    return input === 'me' || uuidFormat(input);
}
