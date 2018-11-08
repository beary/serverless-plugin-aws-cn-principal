# serverless-plugin-aws-cn-principal
Resolve [serverless invalid principal issue](https://github.com/serverless/serverless/issues/5365) when deploying in China region.

## Usage
```bash
$ npm i serverless-plugin-aws-cn-principal -D
```
```javascript
/* serverless.yml */
# ...
plugins:
  - serverless-plugin-aws-cn-principal

provider:
  name: aws
  region: cn-north-1
  endpointType: regional
# ...
```
```bash
$ serverless deploy -v
```
