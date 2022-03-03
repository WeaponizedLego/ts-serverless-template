#!/bin/bash
function prepare_node_modules_lambda_layer() {
  echo "Cleaning up workspace ..."
  rm -rf ../layers/layerRuntime

  echo "Creating layer ..."
  mkdir -p ../layers/layerRuntime/nodejs

  echo "Prepare server node_modules lambda layer ..."
  cp -r ../node_modules ../layers/layerRuntime/nodejs

  echo "Compressing ..."
  pushd ../layers/layerRuntime && tar -zcf /tmp/nodejs.tar.gz . && mv /tmp/nodejs.tar.gz ./nodejs.tar.gz

  echo "Remove unzipped files ..."
  rm -rf nodejs

  echo "Stats:"
  ls -lh nodejs.tar.gz

  popd
}
prepare_node_modules_lambda_layer
