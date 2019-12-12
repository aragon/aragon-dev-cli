import test from 'ava'
import fetch from 'node-fetch'
import { startBackgroundProcess } from '../util'

const testSandbox = './.tmp'
const projectName = 'foobar'

// eslint-disable-next-line ava/no-skip-test
test.skip('should build an aragon app successfully', async t => {
  // act
  const appProcess = await startBackgroundProcess({
    cmd: 'npm',
    args: ['run', 'start:app'],
    execaOpts: {
      cwd: `${testSandbox}/${projectName}`,
      localDir: '.',
    },
    readyOutput: 'Server running at http://localhost:8001',
  })

  // fetch app
  const fetchApp = await fetch(`http://localhost:8001`)
  const fetchAppBody = await fetchApp.text()

  // cleanup
  await appProcess.exit()

  // assert
  t.snapshot(fetchApp.status)
  t.snapshot(fetchAppBody)
})