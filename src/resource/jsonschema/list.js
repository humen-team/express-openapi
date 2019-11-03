import JSONSchemaResource from './resource';

/* A resource that represents a list of another resource.
 */
export default class JSONSchemaListResource extends JSONSchemaResource {
    constructor(item) {
        const schema = JSONSchemaListResource.createSchema(item);
        super(schema, item.options);
        this.item = item;
    }

    /* Create a new JSONSchema represention for a list of items.
     */
    static createSchema(item) {
        const { config } = item;
        const { namingStrategy, pagingStrategy } = config;
        const schema = {
            id: namingStrategy.toListResourceId(item.id),
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: {
                        $ref: item.toRef(),
                    },
                },
            },
            required: [
                'items',
            ],
        };

        // enable response to report on current offset/limit paging
        if (pagingStrategy.hasOffsetLimit) {
            schema.properties.limit = {
                type: 'integer',
            };
            schema.properties.offset = {
                type: 'integer',
            };
        }
        // enable response to report on total collection count
        if (pagingStrategy.hasCount) {
            schema.properties.count = {
                type: 'integer',
            };
            schema.required.push('count');
        }

        return schema;
    }
}
