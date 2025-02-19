## Image Compression
This is a simple SvelteKit project that exposes a few routes as APIs to compress images.

It uses `sharp` to compress images.

It was made as an experimental service for a personal project. 

> [!CAUTION] 
> This project is not meant to be used in production.

### Setup:
- Clone the repository.
- Run `npm install` to install dependencies.
- Create a `.env` file in the root directory with the following fields (NB: you can use the `.env.example` file as a template, rename it to `.env`, and update the values):
  - `ORIGIN` - Origin of the website, nice to have for `adapter-node`. Example: `https://mywebsite.com`.
  - `BODY_SIZE_LIMIT` - Maximum body size limit for the server (in `bytes`). Example: `15728640` for 15MB.
  - `MAX_IMAGE_SIZE` - Maximum image size for the server (in `bytes`). Example: `15728640` for 15MB.
  - `MAX_IMAGE_WIDTH` - Maximum image width for the server (in `pixels`). Example: `1920`.
  - `MAX_IMAGE_HEIGHT` - Maximum image height for the server (in `pixels`). Example: `1080`.
  - `MAX_IMAGE_QUALITY` - Maximum image quality for the server (0-100). Example: `80`.
  - `PRIVATE_KEY_CONVERTER` - Private SHA256 key for token generation. Make your own with some tool, such as: [https://onlinehashtools.com/generate-random-sha256-hash](https://onlinehashtools.com/generate-random-sha256-hash).
- Run `npm run dev` to start the server (or `npm run build` and then run it from the `build` folder).

### API:
> [!CAUTION]
> Usually tested using FormData objects and `formData.mode = 'no-cors'`.
> ```javascript
>    const formData = new FormData();
>    formData.append('image', file);
>    formData.append('token', token);
>    formData.enctype = 'multipart/form-data';
>    formData.mode = 'no-cors';
>
>    const response = await fetch(PUBLIC_CONVERTER_URL + '/image', {
>        method: 'POST',
>        body: formData,
>    });
> ```

- **POST** `/image` Generates a compressed image from a given image.
> [!TIP]
> Send a `FormData` object with an `image` file to compress it, and a valid `token` (From `/token/generate` perhaps, read below), `optional` fields:
> - `quality` (0-100) - Image quality, Max value is set in .env, defaults to `quality: 80`.
> - `width` - Image width. Max value is set in .env.
> - `height` - Image height. Max value is set in .env.
> Returns a `Response` with status:
> - `400` JSON object `{ message: "Missing token" }` if no token is provided.
> - `401` JSON object `{ message: "Invalid token" }` if token is invalid.
> - `400` JSON object `{ message: "Invalid image file" }` if no image is provided or invalid image type.
> - `400` JSON object `{ message: "Invalid quality value" }` if quality is invalid.
> - `400` JSON object `{ message: "Invalid width value" }` if width is invalid.
> - `400` JSON object `{ message: "Invalid height value" }` if height is invalid.
> - `200` and `Blob` object if image is compressed successfully. Image is `.webp`. Can be used in SvelteKit with something such as:
> - ```javascript
>   const response = await fetch('https://somewebsite.com/image', {
>       method: 'POST',
>       body: formData
>    });
>
>   const blob = await response.blob();
>   const url = URL.createObjectURL(blob);
>   ```
>   - `url` can be used in an `img` tag in SvelteKit, such as:
>   - ```html
>     <img src={url} alt="Compressed Image" />
>     ```
>     - This will display the compressed image.
>   - A full example is available in the `src/routes/+page.svelte` file, specifically `handleSubmit()` function and relative `form`.
- **GET**/**POST** `/token/generate` Generates a token.
> [!TIP]
> You don't need a `FormData` object to generate a token. Just send a request to the endpoint. Token is valid for `1 hour`.
> - The `Response` is a `JSON` object with a `token` string field.
- **POST** `/token/validate` Validates a token.
> [!TIP]
> Send a `FormData` object with a `token` string to validate it. Returns `Response` with status:
> - `400` "Missing token" if no token is provided, 
> - `401` "Invalid token" if token is invalid,
> - `200` "Token is valid" if token is valid.


## Extras:

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

> [!TIP]
> By default, we're using `adapter-node`. Using another adapter may require additional configuration.

Root page leads to a debug-page, allowing you to select an image and compress it. The compressed image will be displayed below forms.

This page also allows you to:
- Generate a token.
- Test a token.
- NB: Image compression input already generates and uses a token on its own.

> [!TIP]
> You may want to see the example code in `src/routes/+page.svelte` file.
