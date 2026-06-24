const SYNONYM_MAP = {
  password: ['pass', 'passwd', 'pwd', 'secret', 'credentials', 'cred', 'key', 'passcode', 'passphrase'],
  db: ['database', 'dbase', 'datastore', 'data_store'],
  config: ['configuration', 'settings', 'setup', 'cfg'],
  admin: ['administrator', 'adm'],
  user: ['username', 'login', 'account', 'uid', 'user_id'],
  host: ['hostname', 'server', 'node', 'address'],
  url: ['uri', 'endpoint', 'link', 'path'],
  email: ['mail', 'e_mail', 'inbox'],
  token: ['secret', 'key', 'passkey', 'credential', 'auth'],
  ssh: ['secure_shell'],
  api: ['rest', 'graphql', 'endpoint', 'service'],
  auth: ['authentication', 'authorization', 'login', 'access'],
  secret: ['password', 'key', 'token', 'passkey', 'credential'],
  private: ['priv', 'secret', 'personal'],
  public: ['pub', 'shared', 'open'],
  cert: ['certificate', 'crt', 'pem', 'tls', 'ssl'],
  key: ['secret', 'token', 'key_material'],
  access: ['auth', 'login', 'entry'],
  connection: ['conn', 'dsn', 'connect'],
  endpoint: ['api', 'url', 'uri', 'route'],
  bucket: ['container', 'storage'],
  registry: ['repo', 'repository', 'store'],
  cluster: ['instance', 'node', 'group'],
}

function getSynonyms(word) {
  return SYNONYM_MAP[word.toLowerCase()] || []
}

function caseVariants(word) {
  const set = new Set()
  set.add(word)
  set.add(word.toLowerCase())
  set.add(word.toUpperCase())
  set.add(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  return [...set]
}

export function expandVocabulary(category, mutationConfig) {
  if (!category || !category.keywords || category.keywords.length === 0) return []

  const maxVariants = mutationConfig?.max_variants || 50
  const result = new Set()

  for (const kw of category.keywords) {
    for (const cv of caseVariants(kw)) {
      result.add(cv)
    }

    const lowerKw = kw.toLowerCase()

    if (lowerKw.includes('_')) {
      const parts = lowerKw.split('_')
      if (parts.length >= 2) {
        for (let i = 0; i < parts.length; i++) {
          const synonyms = getSynonyms(parts[i])
          for (const syn of synonyms) {
            const newParts = [...parts]
            newParts[i] = syn
            const variant = newParts.join('_')
            for (const cv of caseVariants(variant)) {
              result.add(cv)
            }
          }
        }
      }
    }

    if (lowerKw.includes('_')) {
      const parts = lowerKw.split('_')
      for (let fromPart of parts) {
        const synonyms = getSynonyms(fromPart)
        for (let syncPart of synonyms) {
          const newParts = [syncPart, ...parts.filter(p => p !== fromPart)]
          for (let i = 0; i < parts.length; i++) {
            const alt = [...parts]
            alt[i] = syncPart
            const combined = alt.join('_')
            for (const cv of caseVariants(combined)) {
              result.add(cv)
            }
          }
        }
      }
    }
  }

  const arr = [...result]
  if (arr.length > maxVariants) {
    return arr.slice(0, maxVariants)
  }
  return arr
}
