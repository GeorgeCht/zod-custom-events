import { readFileSync, writeFileSync } from 'node:fs'

// Read and parse 'package.json'
const packageJsonPath = './package.json'
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
const newVersion = packageJson.version

// Read and parse 'jsr.json'
const jsrJsonPath = './jsr.json'
const jsrJson = JSON.parse(readFileSync(jsrJsonPath, 'utf-8'))
const oldVersion = jsrJson.version

// If versions are same, exit
if (newVersion === oldVersion) {
  console.log(`🤭 Versions are same. Currently in v${newVersion}. Exiting...`)
  process.exit(1)
}

// Update 'version' in 'jsr.json'
jsrJson.version = newVersion

// Write the updated 'jsr.json' back to file
writeFileSync(jsrJsonPath, JSON.stringify(jsrJson, null, 2), 'utf-8')

// Log success message
console.log(`✅ JSR version updated from v${oldVersion} to v${newVersion}.`)
