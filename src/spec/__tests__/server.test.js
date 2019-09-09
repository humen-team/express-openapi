import Server from '../server';

describe('Server', () => {

    describe('build', () => {
        it('encodes a naked path by default', () => {
            const server = new Server();
            expect(server.build()).toEqual({
                url: '/',
            });
        });

        it('encodes a custom path', () => {
            const server = new Server({ path: '/foo' });
            expect(server.build()).toEqual({
                url: '/foo',
            });
        });

        it('encodes a custom hostname', () => {
            const server = new Server({
                host: 'example.com',
                path: '/foo',
                scheme: 'http',
            });
            expect(server.build()).toEqual({
                url: 'http://example.com/foo',
            });
        });

        it('encodes a custom scheme', () => {
            const server = new Server({
                host: 'example.com',
                path: '/foo',
                scheme: 'https',
            });
            expect(server.build()).toEqual({
                url: 'https://example.com/foo',
            });
        });

        it('encodes a custom port url', () => {
            const server = new Server({
                host: 'example.com',
                path: '/foo',
                port: 443,
                scheme: 'https',
            });
            expect(server.build()).toEqual({
                url: 'https://example.com:443/foo',
            });
        });
    });
});
