// @ts-check
import { rm } from 'node:fs/promises'
import { join } from 'node:path'

const args = process.argv.slice(2)
if (args.length === 0) {
  throw new Error('❌ Requires a least one parameter')
}
for (const arg of args) {
  const path = join(process.cwd(), arg)
  console.log(`⌛ Now deleting path "${path}"`)
  rm(path, { recursive: true, force: true }).then(() => {
    console.log(`🗑️ Deleted path "${path}"`)
  })
}
