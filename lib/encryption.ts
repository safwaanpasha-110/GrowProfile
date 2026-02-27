import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const TAG_LENGTH = 16

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }
  // Key should be 64 hex chars = 32 bytes
  return Buffer.from(key, 'hex')
}

export interface EncryptedData {
  encrypted: string // hex-encoded ciphertext
  iv: string        // hex-encoded IV
  tag: string       // hex-encoded auth tag
}

/**
 * Encrypt a plaintext string using AES-256-GCM
 */
export function encrypt(plaintext: string): EncryptedData {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const tag = cipher.getAuthTag()

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  }
}

/**
 * Decrypt ciphertext using AES-256-GCM
 */
export function decrypt(data: EncryptedData): string {
  const key = getEncryptionKey()
  const iv = Buffer.from(data.iv, 'hex')
  const tag = Buffer.from(data.tag, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)

  let decrypted = decipher.update(data.encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Encrypt an Instagram access token for DB storage
 */
export function encryptToken(token: string): {
  accessTokenEncrypted: string
  accessTokenIv: string
  accessTokenTag: string
} {
  const { encrypted, iv, tag } = encrypt(token)
  return {
    accessTokenEncrypted: encrypted,
    accessTokenIv: iv,
    accessTokenTag: tag,
  }
}

/**
 * Decrypt an Instagram access token from DB storage
 */
export function decryptToken(data: {
  accessTokenEncrypted: string | null
  accessTokenIv: string | null
  accessTokenTag: string | null
}): string | null {
  if (!data.accessTokenEncrypted || !data.accessTokenIv || !data.accessTokenTag) {
    return null
  }
  return decrypt({
    encrypted: data.accessTokenEncrypted,
    iv: data.accessTokenIv,
    tag: data.accessTokenTag,
  })
}
