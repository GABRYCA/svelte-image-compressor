<!-- Sample page with input form to test /image post endpoint -->
<script>
    let finalImage = $state(null);
    let imageName = $state(null);
    let token = $state(null);
    let validToken = $state(null);

    // Form function to submit image to /image endpoint
    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const tempToken = await getToken();
        formData.append('token', tempToken);

        const response = await fetch('/image', {
            method: 'POST',
            body: formData
        });

        /*if (response.ok) {
            const content = await response.body.getReader().read();
            finalImage = URL.createObjectURL(new Blob([new Uint8Array(content.value)], {type: 'image/webp'}));
            console.log(finalImage);
        } else {
            console.error('Failed to convert image');
        }*/

        if (response.ok) {
            const blob = await response.blob();
            finalImage = URL.createObjectURL(blob);
        } else {
            const errorData = await response.json();
            console.error('Failed to convert image:', errorData.message);
        }
    }

    // Function to get token from /token/generate endpoint
    async function getToken() {
        const response = await fetch('/token/generate');
        if (!response.ok) {
            console.error('Failed to get token');
            return null;
        }
        const data = await response.json();
        return data.token;
    }

    // Form function to generate token
    async function generateToken(event) {
        event.preventDefault();

        // Generate token using /token/generate GET endpoint
        const response = await fetch('/token/generate');

        if (response.ok) {
            const data = await response.json();
            token = data.token;
        } else {
            console.error('Failed to generate token');
        }
    }

    // Form function to validate token
    async function validateToken(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const response = await fetch('/token/validate', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // const data = await response.json();
            validToken = true;
        } else {
            validToken = false;
            console.error('Failed to validate token');
        }
    }
</script>

<form onsubmit={handleSubmit} enctype="multipart/form-data">
    <input type="file" id="file" name="image" accept="image/*" required>
    <button type="submit">Submit</button>
</form>
<!-- Form to validate generate token -->
<form onsubmit={generateToken}>
    <button type="submit">Generate Token</button>
</form>
<!-- Form to validate generate token -->
<form onsubmit={validateToken}>
    <input type="text" id="token" name="token" required>
    <button type="submit">Validate Token</button>
</form>

{#if token}
    <p>Token: {token}</p>
{/if}

{#if validToken}
    <p>Token is valid</p>
{:else if (validToken === false)}
    <p>Token is invalid</p>
{/if}

{#if finalImage}
    <img src={finalImage} alt="Converted">
    <p>{imageName}</p>
{/if}