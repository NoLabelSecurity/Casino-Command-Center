/**
 * Obfuscates passwords saved inside local storage so credentials
 * are not stored as plain text. This provides a simulation of a
 * cryptographically secure credential enclave in our client demonstration.
 */

const SECRET_KEY_OBFUSCATION = "CASINO_COMMAND_SECRET_KEY";

export function encryptPassword(password: string): string {
  if (!password) return "";
  let result = "";
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i);
    const keyChar = SECRET_KEY_OBFUSCATION.charCodeAt(i % SECRET_KEY_OBFUSCATION.length);
    // Simple symmetric XOR and scale
    const encryptedChar = (charCode ^ keyChar).toString(16).padStart(2, "0");
    result += encryptedChar;
  }
  return `ENC__${result}`;
}

export function decryptPassword(encrypted: string): string {
  if (!encrypted || !encrypted.startsWith("ENC__")) return encrypted;
  const hexPart = encrypted.substring(5);
  let result = "";
  try {
    let index = 0;
    for (let i = 0; i < hexPart.length; i += 2) {
      const hexChar = hexPart.substring(i, i + 2);
      const charCode = parseInt(hexChar, 16);
      const keyChar = SECRET_KEY_OBFUSCATION.charCodeAt(index % SECRET_KEY_OBFUSCATION.length);
      result += String.fromCharCode(charCode ^ keyChar);
      index++;
    }
    return result;
  } catch (e) {
    return "Error decrypting key";
  }
}
