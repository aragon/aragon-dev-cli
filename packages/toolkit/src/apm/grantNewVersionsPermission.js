const APM = require('@aragon/apm')
const ACL = require('./util/acl')

module.exports = async (
  web3,
  apmRepoName,
  apmOptions,
  grantees,
  progressHandler = () => {},
  { gasPrice }
) => {
  if (grantees.length === 0) {
    throw new Error('No grantee addresses provided')
  }

  // Ensure the ens-registry property is present,
  // and available with the name "ensRegistryAddress".
  if (!apmOptions.ensRegistryAddress) {
    if (apmOptions['ens-registry']) {
      apmOptions.ensRegistryAddress = apmOptions['ens-registry']
    } else {
      throw new Error('ens-registry not found in given apm options.')
    }
  }

  const apm = await APM(web3, apmOptions)
  const acl = ACL(web3)

  progressHandler(1)

  const repo = await apm.getRepository(apmRepoName)
  if (repo === null) {
    throw new Error(
      `Repository ${apmRepoName} does not exist and it's registry does not exist`
    )
  }

  const receipts = []

  /* eslint-disable-next-line */
  for (const address of grantees) {
    progressHandler(2, address)

    // Decode sender
    const accounts = await web3.eth.getAccounts()
    const from = accounts[0]

    // Build transaction
    const transaction = await acl.grant(repo.options.address, address)

    transaction.from = from
    transaction.gasPrice = gasPrice
    // the recommended gasLimit is already calculated by the ACL module

    const receipt = await web3.eth.sendTransaction(transaction)
    progressHandler(3, receipt.transactionHash)

    receipts.push(receipt)
  }

  return receipts
}
