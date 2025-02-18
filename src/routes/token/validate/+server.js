import {validateToken} from "$lib/utils/gcatokens.js";

export const POST = async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());

    const token = formData.token ?? null;

    if (!token || token === '') {
        return new Response(
            JSON.stringify({
                message: "Missing token"
            }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    if (!validateToken(token)) {
        return new Response(
            JSON.stringify({
                message: "Invalid token"
            }),
            {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    return new Response(
        JSON.stringify({
            message: "Valid token"
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}