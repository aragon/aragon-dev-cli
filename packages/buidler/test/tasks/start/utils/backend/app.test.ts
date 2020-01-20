import { assert } from 'chai'
import { isAddress } from '~/test/test-helpers/isAddress'
import { deployImplementation } from '~/src/tasks/start/utils/backend/app'

describe('app.ts', () => {
  describe('when deploying an implementation of an app', () => {
    let implementation: Truffle.ContractInstance

    before('deploy an implementation of an app', async () => {
      implementation = await deployImplementation()
    })

    it('deploys a contract with a valid address', async () => {
      assert.equal(
        isAddress(implementation.address),
        true,
        'Invalid contract address.'
      )
    })
  })
})