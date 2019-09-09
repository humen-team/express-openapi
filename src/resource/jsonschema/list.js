import JSONSchemaResource from './resource';

export default class JSONSchemaListResource extends JSONSchemaResource {
    constructor(item) {
        super(JSONSchemaListResource.createSchema(item), item.config);
        this.item = item;
    }

    static createSchema(item) {
        const { config } = item;
        const properties = {
            items: {
                type: 'array',
                items: item.toRef(),
            },
        };
        const required = [
            'items',
        ];

        // enable response to report on current offset/limit paging
        if (config.pagingStrategy.hasOffsetLimit) {
            properties.limit = {
                type: 'integer',
            };
            properties.offset = {
                type: 'integer',
            };
        }
        // enable response to report on total collection count
        if (config.pagingStrategy.hasCount) {
            properties.count = {
                type: 'integer',
            };
            required.push('count');
        }

        return {
            id: config.namingStrategy.toListName(item.id),
            type: 'object',
            properties,
            required,
        };
    }
}
