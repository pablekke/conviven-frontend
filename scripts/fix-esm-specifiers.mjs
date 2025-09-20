import fs from 'node:fs'

const ROOT = new URL('../.tests-dist', import.meta.url)

function shouldUpdate(specifier) {
  if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
    return false
  }
  return !specifier.endsWith('.js') && !specifier.endsWith('.json') && !specifier.endsWith('.node')
}

function fixFile(fileUrl) {
  const content = fs.readFileSync(fileUrl, 'utf8')
  const replaced = content.replace(/from\s+(['"])([\.]{1,2}\/[^'";]+?)\1/g, (match, quote, specifier) => {
    if (!shouldUpdate(specifier)) {
      return match
    }
    return `from ${quote}${specifier}.js${quote}`
  })

  if (replaced !== content) {
    fs.writeFileSync(fileUrl, replaced)
  }
}

function walk(dirUrl) {
  const entries = fs.readdirSync(dirUrl, { withFileTypes: true })
  for (const entry of entries) {
    const entryUrl = new URL(`${entry.name}`, dirUrl)
    if (entry.isDirectory()) {
      walk(new URL(`${entry.name}/`, dirUrl))
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      fixFile(entryUrl)
    }
  }
}

walk(new URL('./', ROOT))
