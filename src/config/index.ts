import * as _ from 'lodash'
import genConf from '@src/config/config.json'
import devConf from '@src/config/config.dev.json'
import prodConf from '@src/config/config.prod.json'

// include all when import this file because AWS Lambda have some optimization and preload all explicit requires.
const confFiles = {
  general: genConf,
  env: {
    dev: devConf,
    prod: prodConf
  }
}

export const init = () => {
  const { STAGE } = process.env

  console.log(process.env.STAGE)

  console.log('STAGE::', STAGE)

  // @ts-ignore: we do this to make the compiler happy
  const stageEnvs = confFiles.env[STAGE]
  const settings: Record<string, any> = _.merge(confFiles.general, stageEnvs)

  // console.log(settings)
  return settings
}
