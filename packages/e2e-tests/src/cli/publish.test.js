import test from 'ava'
import fs from 'fs-extra'
const path = require('path')
import execa from 'execa'
import { startBackgroundProcess, normalizeOutput } from '../util'

const ARTIFACT_FILE = 'artifact.json'
const MANIFEST_FILE = 'manifest.json'

const testSandbox = './.tmp'
const projectName = 'foobar'

test('should publish an aragon app directory successfully', async t => {
  t.plan(3)

  const publishDirPath = path.resolve(`${testSandbox}/publish-dir`)

  // act
  const publishProcess = await startBackgroundProcess({
    cmd: 'aragon',
    args: [
      'apm',
      'publish',
      'major',
      '--build',
      'false',
      '--publish-dir',
      publishDirPath,
      '--debug',
    ],
    execaOpts: {
      cwd: `${testSandbox}/${projectName}`,
      /**
       * By default execa will run the aragon binary that is located at '.tmp/foobar/node_modules'.
       * That is coming from npm and is not the one we want to test.
       *
       * We need to tell it to use the one we just built locally and installed in the e2e-tests package
       */
      preferLocal: true,
      localDir: '.',
    },
    readyOutput: 'Successfully published'
  })

  // cleanup
  await publishProcess.exit()

  // check the generated artifact
  const artifactPath = path.resolve(publishDirPath, ARTIFACT_FILE)
  const artifact = JSON.parse(fs.readFileSync(artifactPath))
  // delete non-deterministic values
  delete artifact.deployment

  // check the generated manifest
  const manifestPath = path.resolve(publishDirPath, MANIFEST_FILE)
  const manifest = JSON.parse(fs.readFileSync(manifestPath))

  // delete some output sections that are not deterministic
  const appBuildOutput = publishProcess.stdout.substring(
    publishProcess.stdout.indexOf('Building frontend [started]'),
    publishProcess.stdout.indexOf('Building frontend [completed]')
  )

  const outputToSnapshot = publishProcess.stdout.replace(appBuildOutput, '')

  // assert
  t.snapshot(normalizeOutput(outputToSnapshot))
  t.snapshot(artifact)
  t.snapshot(manifest)
})
