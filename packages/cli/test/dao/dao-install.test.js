import test from 'ava'
//
import { runAragonCLI } from '../util'

const daoAddressRegex = /Created DAO: (.*)$/

test('start IPFS', async t => {
  const { stdout: daoNewStdout } = await runAragonCLI(['dao', 'new', '--debug'])
  const daoAddress = daoNewStdout.match(daoAddressRegex)[1]

  const { stdout } = await runAragonCLI([
    'dao',
    'install',
    daoAddress,
    'vault',
    '--debug',
  ])

  t.assert(stdout.includes('Start IPFS'))
})
