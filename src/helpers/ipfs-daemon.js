const execa = require('execa')
const fs = require('fs')
const path = require('path')
const os = require('os')
const ipfsAPI = require('ipfs-api')
const { getNPMBinary } = require('../util')

const ipfsBin = getNPMBinary('go-ipfs', 'bin/ipfs')

const ensureIPFSInitialized = async () => {
  if (!fs.existsSync(path.join(os.homedir(), '.ipfs'))) {
    // We could use 'ipfs daemon --init' when https://github.com/ipfs/go-ipfs/issues/3913 is solved
    await execa(ipfsBin, ['init'])
  }
}

const startIPFSDaemon = () => {
  const IPFS_START_TIMEOUT = 7500 // 7.5s for timeout, may need to be tweaked

  let startOutput = ''

  // We add a timeout as starting
  const timeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Starting IPFS timed out:\n${startOutput}`))
    }, IPFS_START_TIMEOUT)
  })

  const start = new Promise(async (resolve, reject) => {
    await ensureIPFSInitialized()
    const ipfsProc = execa(ipfsBin, ['daemon'])

    ipfsProc.stdout.on('data', (data) => {
      startOutput = `${startOutput}${data.toString()}\n`
      if (data.toString().includes('Daemon is ready')) resolve()
    })

    ipfsProc.stderr.on('data', (data) => {
      reject(new Error(`Starting IPFS failed: ${data.toString()}`))
    })
  })

  return Promise.race([start, timeout])
}

let ipfsNode

const IPFSCORS = [{
  key: 'API.HTTPHeaders.Access-Control-Allow-Origin',
  value: ["*"]
}, {
  key: 'API.HTTPHeaders.Access-Control-Allow-Methods',
  value: ["PUT", "GET", "POST"]
}]

const isIPFSCORS = async (ipfsRpc) => {
  if (!ipfsNode) ipfsNode = ipfsAPI(ipfsRpc)
  const conf = await ipfsNode.config.get('API.HTTPHeaders')
  const allowOrigin = IPFSCORS[0].key.split('.').pop()
  const allowMethods = IPFSCORS[1].key.split('.').pop()
  if (conf && conf[allowOrigin] && conf[allowMethods]) {
    return true
  } else {
    throw new Error(`Please set the following flags in your IPFS node:
    ${IPFSCORS.map(({ key, value }) => {
      return `${key}: ${value}`
    }).join('\n    ')}`)
    process.exit()
  }
}

const setIPFSCORS = (ipfsRpc) => {
  if (!ipfsNode) ipfsNode = ipfsAPI(ipfsRpc)
  return Promise.all(
    IPFSCORS.map(({ key, value }) =>
      ipfsNode.config.set(key, value))
  )
}

module.exports = { startIPFSDaemon, isIPFSCORS, setIPFSCORS }