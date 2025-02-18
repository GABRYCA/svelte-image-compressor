import crypto from "crypto";
import {PRIVATE_KEY_CONVERTER} from "$env/static/private";
import {PRIVATE_EXPIRE_TIME} from "$env/static/private";

export const generateToken = () => {
    const data = `${Date.now()}`;
    const hmac = crypto.createHmac('sha256', PRIVATE_KEY_CONVERTER);
    hmac.update(data);
    const hmacDigest = hmac.digest('hex');
    return `${hmacDigest}.${data}`;
}

export const validateToken = (token) => {
    const [receivedHmac, receivedData] = token.split('.');
    if (!receivedHmac || !receivedData) {
        return false;
    }

    let expireTime = PRIVATE_EXPIRE_TIME;
    if (expireTime === undefined || isNaN(expireTime)) {
        expireTime = 3600 * 1000;
    } else {
        expireTime *= 1000;
    }

    // Check if token has expired (1 hour)
    const tokenTimestamp = parseInt(receivedData);
    if (isNaN(tokenTimestamp) || Date.now() - tokenTimestamp > expireTime) {
        return false;
    }

    const hmac = crypto.createHmac('sha256', PRIVATE_KEY_CONVERTER);
    hmac.update(receivedData);
    const expectedHmac = hmac.digest('hex');

    try {
        return crypto.timingSafeEqual(Buffer.from(receivedHmac, 'hex'), Buffer.from(expectedHmac, 'hex'));
    } catch (e) {
        return false;
    }
}