const jwtHeader = {
  alg: 'HS256',
  typ: 'JWT'
};
const jwtSecret = '4106b4423a93ae871ceab981bd4e37ef52127fbe25d2b898f615f6ba62010c39';

function base64UrlEncode(data) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(data)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

async function createJWT(header, payload, secret) {
  const encoder = new TextEncoder();
  const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(payload)));

  const token = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(token)
  );

  const encodedSignature = base64UrlEncode(signature);

  return `${token}.${encodedSignature}`;
}


// Hàm để giải mã Base64URL
function base64UrlDecode(data) {
  data = data.replace(/-/g, '+').replace(/_/g, '/');
  const pad = data.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
    }
    data += new Array(5 - pad).join('=');
  }
  return atob(data);
}

// Hàm để giải mã JWT
function decodeJWT(token) {
  const [header, payload, signature] = token.split('.');
  const decodedPayload = base64UrlDecode(payload);
  return JSON.parse(decodedPayload);
}

