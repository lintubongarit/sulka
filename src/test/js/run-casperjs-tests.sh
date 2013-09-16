#!/bin/sh
# Install CasperJS 1.1.0 to $HOME/bin and launch the site to http://localhost:8080/ to run frontend tests
export PATH=$PATH:$HOME/bin
casperjs test --includes=lib/default_base_url.js,lib/test_helpers.js --xunit=../../../target/surefire-reoprts/casperjs.xml --no-colors *.js
