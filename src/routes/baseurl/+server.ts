import type { RequestHandler } from '../$types.js';

export const GET: RequestHandler = async () => {
    console.log('GET /server')

    return new Response(
        'Fetch GET relative url `/baseurl`:  Prefixing current URI Location as Base url <br/><br/> ** test passed! **'
    );
};