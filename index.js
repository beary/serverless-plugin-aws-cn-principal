const { resolve } = require('path')
const { readFileSync, writeFileSync } = require('fs')

class AWSCNPrincipal {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options
    this.hooks = {
      // https://github.com/serverless/serverless/blob/master/lib/plugins/aws/package/index.js#L68
      'package:finalize': () => {
        // https://github.com/serverless/serverless/blob/master/lib/plugins/aws/package/lib/saveCompiledTemplate.js#L10
        const serverlessDirPath = resolve(this.serverless.config.servicePath, '.serverless')
        const serviceStateFileName = this.serverless.providers.aws.naming.getServiceStateFileName()
        const compiledTemplateFileName = this.serverless.providers.aws.naming.getCompiledTemplateFileName()

        const serviceStateFileNamePath = resolve(serverlessDirPath, serviceStateFileName)
        const compiledTemplateFileNamePath = resolve(serverlessDirPath, compiledTemplateFileName)

        const serviceStateFileJson = JSON.parse(readFileSync(serviceStateFileNamePath, { encoding: 'utf8' }))
        const compiledTemplateFileJson = JSON.parse(readFileSync(compiledTemplateFileNamePath, { encoding: 'utf8' }))


        const serviceStateResources = serviceStateFileJson.service.provider.compiledCloudFormationTemplate.Resources

        Object.keys(serviceStateResources).forEach(key => {
          const it = serviceStateResources[key]
          if (it.Properties && it.Properties.Principal)
            it.Properties.Principal = JSON.parse(
              JSON.stringify(it.Properties.Principal)
                .replace('{"Ref":"AWS::URLSuffix"}', '"amazonaws.com"')
            )
        })
        writeFileSync(serviceStateFileNamePath, JSON.stringify(serviceStateFileJson, null, 2))


        Object.keys(compiledTemplateFileJson.Resources).forEach(key => {
          const it = compiledTemplateFileJson.Resources[key]
          if (it.Properties && it.Properties.Principal)
            it.Properties.Principal = JSON.parse(
              JSON.stringify(it.Properties.Principal)
                .replace('{"Ref":"AWS::URLSuffix"}', '"amazonaws.com"')
            )
        })
        writeFileSync(compiledTemplateFileNamePath, JSON.stringify(compiledTemplateFileJson, null, 2))
      }
    }
  }
}

module.exports = AWSCNPrincipal
