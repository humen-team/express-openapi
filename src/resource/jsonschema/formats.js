import { validate } from 'uuid';

export function uuidFormat(input) {
    return validate(input);
}

export function userIdFormat(input) {
    return input === 'me' || uuidFormat(input);
}
