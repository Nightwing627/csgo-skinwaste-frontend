const req = require.context('./', false, /^(?!.*test.js)(?!.*index.js)((.*\.(js\.*))[^.]*$)/im)
const files = {}

req.keys().forEach(i => {
  files[i.replace(/.\/|.js/g, '')] = req(i).default
})

export default files
