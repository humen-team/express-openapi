import { StringValueSchema } from './fixtures';

describe('StringValueSchema', () => {
    it('toList', () => {
        const StringValueListSchema = StringValueSchema.toList();
        expect(StringValueListSchema.id).toEqual('StringValueList');

        const refs = StringValueListSchema.listRefs();
        expect(refs.length).toEqual(1);
        expect(refs[0].id).toEqual(StringValueSchema.id);
    });
});
