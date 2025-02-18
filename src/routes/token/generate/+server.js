import {generateToken} from "$lib/utils/gcatokens.js";

export const GET = async ({ }) => {
    const token = generateToken();

    return new Response(
        JSON.stringify({
            token
        }),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}

export const POST = async ({ }) => {
    const token = generateToken();

    return new Response(
        JSON.stringify({
            token
        }),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}