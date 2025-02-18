## Image Compression
This is a simple SvelteKit project that exposes a few routes as APIs to compress images. 

APIs:
- POST /image
- 

## Developing

Install dependencies: `npm install`

```bash
npm run dev
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

> [!TIP]
> By default, we're using `adapter-node`. Using another adapter may require additional configuration.

## Usage:

Root page leads to a debug-page, allowing you to select an image and compress it. The compressed image will be displayed below forms.

This page also allows you to:
- Generate a token.
- Test a token.
- NB: Image compression input already generates and uses a token on its own.