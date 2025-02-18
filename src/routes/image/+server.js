import sharp from 'sharp';
import {MAX_IMAGE_SIZE, MAX_IMAGE_QUALITY, MAX_IMAGE_HEIGHT, MAX_IMAGE_WIDTH} from "$env/static/private";
import {validateToken} from "$lib/utils/gcatokens.js";

const convertImage = async (image, width, height, quality, name) => {
    const imageSharp = sharp(await image.arrayBuffer());
    const metadata = await imageSharp.metadata();

    if (!width) {
        width = metadata.width;
    }

    if (!height) {
        height = metadata.height;
    }

    if (!quality) {
        quality = 80;
    }

    if (!name) {
        name = `image-${Date.now()}.webp`;
    }

    if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
        return {
            status: 400,
            body: {
                message: `Width and height must be less than ${MAX_IMAGE_WIDTH}x${MAX_IMAGE_HEIGHT} pixels`
            }
        }
    }

    if (quality > MAX_IMAGE_QUALITY) {
        return {
            status: 400,
            body: {
                message: `Quality must be less than ${MAX_IMAGE_QUALITY}`
            }
        }
    }

    if (image.size > MAX_IMAGE_SIZE) {
        return {
            status: 400,
            body: {
                message: `Image size must be less than ${MAX_IMAGE_SIZE} bytes`
            }
        }
    }

    const convertedImage = await imageSharp
        .rotate()
        .resize(width, height, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        })
        .webp({quality})
        .toBuffer();

    const file = new File([convertedImage], name, { type: 'image/webp', lastModified: Date.now() });

    return {
        status: 200,
        body: file,
    }
}

export const POST = async ({ request }) => {
    const formData = Object.fromEntries(await request.formData());

    let width = formData.width ?? null;
    let height = formData.height ?? null;
    let quality = formData.quality ?? null;
    let name = formData.name ?? null;
    const image = formData.image ?? null;
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


    if (!image || !image.type.startsWith('image/')) {
        return new Response(
            JSON.stringify({
                message: "Invalid image file"
            }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    if (width) {
        width = parseInt(width);
        if (isNaN(width)) {
            return new Response(
                JSON.stringify({
                    message: "Invalid width value"
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }
    }

    if (height) {
        height = parseInt(height);
        if (isNaN(height)) {
            return new Response(
                JSON.stringify({
                    message: "Invalid height value"
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }
    }

    if (quality) {
        quality = parseInt(quality);
        if (isNaN(quality)) {
            return new Response(
                JSON.stringify({
                    message: "Invalid quality value"
                }),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }
    }

    let result = await convertImage(image, width, height, quality, name);

    if (result.status === 200) {
        return new Response(result.body, {
            status: 200,
            headers: {
                'Content-Type': `${result.body.type}`,
                'Content-Disposition': `attachment; filename="${result.body.name}"`,
            }
        });
    } else {
        return new Response(
            JSON.stringify(result.body),
            {
                status: result.status,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}