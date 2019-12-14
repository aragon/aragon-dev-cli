import { DEFAULT_APM_REGISTRY } from './constants'

// insert default apm if the provided name doesnt have the suffix
module.exports = name =>
  name.split('.').length > 1 ? name : `${name}.${DEFAULT_APM_REGISTRY}`
