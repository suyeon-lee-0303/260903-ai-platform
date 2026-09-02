import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Load local env files for the API server.
 * Priority (later wins): .env → .env.local
 * Secrets must live only in these files (or host env like Vercel), never in source code.
 */
export function loadEnvFiles() {
  dotenv.config({ path: path.join(rootDir, '.env') })
  dotenv.config({ path: path.join(rootDir, '.env.local'), override: true })
}

export function getEnv(name: string): string | undefined {
  const value = process.env[name]
  return value?.trim() ? value.trim() : undefined
}

export function requireEnv(name: string): string {
  const value = getEnv(name)
  if (!value) {
    throw new Error(`${name} is not set. Add it to .env (or .env.local) and restart the API server.`)
  }
  return value
}
