/* Example routes.
 */
import { readFileSync } from 'fs';

async function count() {
    const data = 0;
    return {
        data,
        headers: {
            'X-Total-Count': data,
        },
    };
}

async function create({ bar }) {
    return {
        bar,
        id: 'new-id',
    };
}

async function destroy(fooId) {
    return !!fooId;
}

async function replace(fooId, { bar }) {
    return {
        bar,
        id: fooId,
    };
}

async function retrieve(fooId) {
    return {
        bar: 'baz',
        id: fooId,
    };
}

async function search({ limit, offset }) {
    return {
        count: 0,
        items: [],
        limit,
        offset,
    };
}

async function update(fooId, { bar }) {
    return {
        bar,
        id: fooId,
    };
}

async function retrieveFile() {
    return readFileSync('src/__tests__/assets/1x1.png');
}

async function createFile(file) {
    if (!file) {
        throw new Error('Upload failed');
    }
    return {
        id: 'new-id',
    };
}

async function replaceFile(fileId, file) {
    if (!file) {
        throw new Error('Upload failed');
    }
    return {
        id: fileId,
    };
}

async function command({ request }) {
    return {
        response: request,
    };
}

async function query({ request }) {
    return {
        response: request,
    };
}

export default {
    command,
    count,
    create,
    createFile,
    delete: destroy,
    query,
    replace,
    replaceFile,
    retrieve,
    retrieveFile,
    search,
    update,
};
