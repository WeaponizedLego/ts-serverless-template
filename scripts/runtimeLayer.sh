#!/bin/bash
function prepare_node_modules_lambda_layer() {
  echo "Cleaning up workspace ..."
  rm -rf node_modules
  rm -rf ./layers/layerRuntime.zip

  echo "Installing node modules -- production ..."
  yarn install

  echo "Creating layer ..."
  mkdir -p layers/layerRuntime
  mkdir -p layers/layerRuntime/nodejs

  echo "Prepare server node_modules lambda layer ..."
  cp -r node_modules layers/layerRuntime/nodejs

  echo "Compressing ..."
  #pushd layers/layerRuntime && tar -zcf /tmp/layerRuntime.tar.gz . && mv /tmp/layerRuntime.tar.gz ./layerRuntime.tar.gz
  pushd layers/layerRuntime && zip -r /tmp/layerRuntime * -x .* -x "package.json" -x "*.log" -x *.md -1 -q && mv /tmp/layerRuntime.zip ../layerRuntime.zip

  echo "Remove unzipped files and folders ..."
  rm -rf ./layers/layerRuntime

  echo "Stats:"
  ls -lh ./layers/layerRuntime.zip

  echo "Installing node modules -- development ..."
  yarn install

  popd

  echo "Done."
}
prepare_node_modules_lambda_layer
