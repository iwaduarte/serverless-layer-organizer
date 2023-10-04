# Serverless Layer Organizer

[![GitHub license](https://img.shields.io/github/license/iwaduarte/cross-post)](./LICENSE) [![NPM version](https://img.shields.io/npm/v/serverless-layer-organizer)](https://www.npmjs.com/package/serverless-layer-organizer)

Serverless Layer Organizer is a plugin for the Serverless Framework that helps you to better organize your layers.  

_Create the structure you want and let us take care of the rest!_

## Installation

```bash
npm install serverless-layer-organizer --save-dev
```
or
```bash
yarn add serverless-layer-organizer --dev
```

## Configuration

Add the plugin to your `serverless.yml` file:

```yaml
plugins:
  - serverless-layer-organizer
```

Define your custom layer organization under the `custom` key:

```yaml
custom:
  serverless-layer-organizer:
    layers:
      YourLayerName:
        pathPrefix: 'your/path/prefix'
```

## Usage

This plugin is designed to reorganize the structure of your Serverless layers. Specifically, it allows you to set a custom path prefix for each of your layers, so that you can group and manage them more efficiently within your Serverless application.

### Example: Standard layer

Assume you have a layer named `commonLayer` located at `./layers/common`. You want the layer to be prefixed with `utilities`. Update your `serverless.yml` as follows:

```yaml
custom:
  serverless-layer-organizer:
    layers:
      commonLayer:
        pathPrefix: 'utilities'
```

After packaging, your `commonLayer` will be reorganized under `utilities`.


### Example: node_modules layer
```
├── lambda.js
├── node_modules
├── package.json
├── package-lock.json
└── .gitignore
```

### Serverless.yaml

```yaml

service: my-serverless

package:
individually: true

#... other configurations

layers:
  nodeModules:
    path: node_modules
    description: Node.js modules for my service


custom:
  serverless-lambda-layer-packager:
    layers:
      nodeModules:
        pathPrefix: nodejs

plugins:
- serverless-layer-organizer
```

### Output ( zip folder):
```
// nodeModules.zip
├── nodejs
│   ├── node_modules

```

## Limitations

- Only supports AWS as a cloud provider.
- Only supports Node.js runtimes.


## License

MIT


### 