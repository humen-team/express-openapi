/* Define a type (Pet) with a polymorphic property (CatInfo/DogInfo).
 */
import { JSONSchemaResource } from '..';

export const PetType = Object.freeze({
    cat: 'cat',
    dog: 'dog',
});

export const CatInfo = JSONSchemaResource.all({
    id: 'CatInfo',
    properties: {
        lives: {
            type: 'integer',
        },
    },
});

export const DogInfo = JSONSchemaResource.all({
    id: 'DogInfo',
    properties: {
        bestFriend: {
            type: 'string',
        },
    },
});

export const Pet = JSONSchemaResource.all({
    id: 'Pet',
    properties: {
        name: {
            type: 'string',
        },
        type: {
            type: 'string',
            enum: Object.keys(PetType).sort(),
        },
        info: {
            anyOf: [
                {
                    $ref: CatInfo.toRef(),
                },
                {
                    $ref: DogInfo.toRef(),
                },
            ],
        },
    },
});
