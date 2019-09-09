import Info from './info';
import Server from './server';
import Spec from './spec';

function buildSpec({ info, openapiVersion, operations, server, ...more }) {
    const spec = new Spec({
        info,
        operations,
        server,
        ...more,
    });
    return spec.build(openapiVersion);
}

function serveSpec(options) {
    const spec = buildSpec(options);
    return (req, res) => {
        res.status(200).send(spec);
    };
}

export {
    Info,
    Server,
    Spec,
    buildSpec,
    serveSpec,
};
