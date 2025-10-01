import crypto from 'crypto';

function deriveKey(secret32bit) {
    return crypto.createHash('sha256').update(secret32bit).digest();
  }
  
  export const  encrypt = function(token64bit, secret32bit) {
    const key = deriveKey(secret32bit);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
    let encrypted = cipher.update(token64bit, 'utf8', 'hex');
    encrypted += cipher.final('hex');
  
    // Return IV + ciphertext
    return iv.toString('hex') + ':' + encrypted;
  }
  
  export const decrypt = function(encryptedToken, secret32bit) {
    const key = deriveKey(secret32bit);
    const [ivHex, encrypted] = encryptedToken.split(':');
    const iv = Buffer.from(ivHex, 'hex');
  
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
  
    return decrypted;
  }