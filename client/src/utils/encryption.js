const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const generateRandomBytes = (length) => {
    return window.crypto.getRandomValues(new Uint8Array(length));
};

const bufferToHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

const hexToBuffer = (hex) => {
    const pairs = hex.match(/[\dA-F]{2}/gi) || [];
    return new Uint8Array(pairs.map(s => parseInt(s, 16)));
};

export const generateSalt = () => {
    const salt = generateRandomBytes(SALT_LENGTH);
    return bufferToHex(salt);
};

export const deriveKey = async (salt, userId) => {
    const masterKey = import.meta.env.VITE_ENCRYPTION_KEY;
    const encoder = new TextEncoder();
    const combinedSalt = `${salt}-${userId}`;
    
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(masterKey),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    return await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode(combinedSalt),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: ALGORITHM, length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
};

export const encryptData = async (data, key) => {
    const iv = generateRandomBytes(IV_LENGTH);
    const encodedData = encoder.encode(data);

    const encryptedContent = await window.crypto.subtle.encrypt(
        {
            name: ALGORITHM,
            iv: iv
        },
        key,
        encodedData
    );

    const encryptedObj = {
        iv: bufferToHex(iv),
        encryptedData: bufferToHex(encryptedContent)
    };

    // Convert to Base64
    return btoa(JSON.stringify(encryptedObj));
};

export const decryptData = async (base64Data, key) => {
    // Decode from Base64
    const encryptedObj = JSON.parse(atob(base64Data));
    
    const iv = hexToBuffer(encryptedObj.iv);
    const encryptedContent = hexToBuffer(encryptedObj.encryptedData);

    const decryptedContent = await window.crypto.subtle.decrypt(
        {
            name: ALGORITHM,
            iv: iv
        },
        key,
        encryptedContent
    );

    return decoder.decode(decryptedContent);
};