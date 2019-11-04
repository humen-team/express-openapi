import { Router } from 'express';

import Command from './command';
import Count from './count';
import Create from './create';
import CreateFile from './create_file';
import CreateFor from './create_for';
import Delete from './delete';
import DeleteMany from './delete_many';
import Query from './query';
import Replace from './replace';
import ReplaceFile from './replace_file';
import Retrieve from './retrieve';
import RetrieveFile from './retrieve_file';
import Search from './search';
import Update from './update';

/* A namespace is a collection of operations under the same resource.
 */
export default class Namespace {
    constructor(resourceName, options = {}) {
        const { middleware } = options;
        this.resourceName = resourceName;
        this.middleware = middleware || [];
        this.operations = [];
        this.tags = undefined;
        this.router = new Router();
    }

    register(app) {
        app.use(...this.middleware, this.router);
    }

    using(...middleware) {
        this.middleware.push(...middleware);
        return this;
    }

    tag(...tags) {
        this.tags = tags;
        return this;
    }

    add(Operation, options) {
        const operation = new Operation({
            resourceName: this.resourceName,
            tags: this.tags,
            ...options,
        });

        this.operations.push(operation);
        operation.register(this.router);

        return this;
    }

    command(options) {
        return this.add(Command, options);
    }

    count(options) {
        return this.add(Count, options);
    }

    create(options) {
        return this.add(Create, options);
    }

    createFor(options) {
        return this.add(CreateFor, options);
    }

    createFile(options) {
        return this.add(CreateFile, options);
    }

    delete(options) {
        return this.add(Delete, options);
    }

    deleteMany(options) {
        return this.add(DeleteMany, options);
    }

    query(options) {
        return this.add(Query, options);
    }

    replace(options) {
        return this.add(Replace, options);
    }

    replaceFile(options) {
        return this.add(ReplaceFile, options);
    }

    retrieve(options) {
        return this.add(Retrieve, options);
    }

    retrieveFile(options) {
        return this.add(RetrieveFile, options);
    }

    search(options) {
        return this.add(Search, options);
    }

    update(options) {
        return this.add(Update, options);
    }
}
