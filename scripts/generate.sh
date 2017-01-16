#!/bin/bash

for vars_file in $(find config/ -name "*.vars"); do
  (
    source ${vars_file}
    echo "Generating converter for ${PLATFORM}..."
    envsubst < ./config/template.html > ./${PLATFORM_LOWER}_ynab.html
  )
done
