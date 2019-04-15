class AWSCNPrincipal {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options
    this.hooks = {
      // https://gist.github.com/HyperBrain/bba5c9698e92ac693bb461c99d6cfeec#lifecycle-events-outer-events-in-bold-complete-graph-1
      // https://github.com/serverless/serverless/blob/master/lib/plugins/deploy/deploy.js#L21
      'package:compileEvents': () => {
        // https://github.com/serverless/serverless/blob/master/lib/plugins/aws/package/compile/events/apiGateway/lib/permissions.js#L53
        const rs = this.serverless.service.provider.compiledCloudFormationTemplate.Resources

        Object.keys(rs).forEach(key => {
          const it = rs[key]
          if (it.Properties && it.Properties.Principal) {
            it.Properties.Principal = JSON.parse(
              JSON.stringify(it.Properties.Principal)
                .replace('{"Ref":"AWS::URLSuffix"}', '"amazonaws.com"')
            )
          }
        })
      }
    }
  }
}

module.exports = AWSCNPrincipal
