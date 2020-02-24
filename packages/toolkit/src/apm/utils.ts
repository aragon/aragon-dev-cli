import { ethers } from 'ethers'
import semver from 'semver'
import fetch from 'node-fetch'
import { ApmVersion, ApmVersionReturn } from './types'

const DEFAULT_APM_REGISTRY = 'aragonpm.eth'

/**
 * Parse a raw version response from an APM repo
 */
export function parseApmVersionReturn(res: ApmVersionReturn): ApmVersion {
  return {
    version: res.semanticVersion.join('.'),
    contractAddress: res.contractAddress,
    contentUri: ethers.utils.toUtf8String(res.contentURI),
  }
}

/**
 * Return a semantic version string into the APM version array format
 * @param version "0.2.4"
 */
export function toApmVersionArray(version: string): [number, number, number] {
  const semverObj = semver.parse(version)
  if (!semverObj) throw Error(`Invalid semver ${version}`)
  return [semverObj.major, semverObj.minor, semverObj.patch]
}

/**
 * Return evenly spaced numbers over a specified interval.
 * @param from 1
 * @param to 5
 * @param step 2
 * @return [1, 3, 5]
 */
export function linspace(from: number, to: number, step = 1): number[] {
  const arr: number[] = []
  for (let i = from; i <= to; i += step) arr.push(i)
  return arr
}

/**
 * Return a fetchable URL to get the resources of a contentURI
 * @param contentUri "ipfs:QmaT4Eef..."
 * @param options
 */
export function getFetchUrlFromContentUri(
  contentUri: string,
  options?: { ipfsGateway: string }
): string {
  const [protocol, location] = contentUri.split(/:(.+)/)
  switch (protocol) {
    case 'http':
    case 'https':
      return contentUri
    case 'ipfs':
      if (!options || !options.ipfsGateway)
        throw Error(`Must provide an ipfsGateway for protocol 'ipfs'`)
      return `${options.ipfsGateway}/ipfs/${location}`
    default:
      throw Error(`Protocol '${protocol}' not supported`)
  }
}

/**
 * Fetch and parse JSON from an HTTP(s) URL
 * @param url
 */
export async function fetchJson<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json())
}

/**
 * Insert default apm if the provided name doesnt have the suffix
 * @param name "finance"
 * @return "finance.aragonpm.eth"
 */
export function getDefaultApmName(name: string): string {
  return name.includes('.') ? name : `${name}.${DEFAULT_APM_REGISTRY}`
}
