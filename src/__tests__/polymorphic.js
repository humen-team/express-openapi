/* Define a type (Pet) with a polymorphic property (CatInfo/DogInfo).
 */
import { JSONSchemaResource } from '..';

export const PetType = Object.freeze({
    cat: 'cat',
    dog: 'dog',
    unicorn: 'unicorn',
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

export const PetInfo = JSONSchemaResource.choice({
    id: 'PetInfo',
    resources: [
        CatInfo,
        DogInfo,
    ],
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
            $ref: PetInfo.toRef(),
        },
    },
});
