#!/bin/sh
# Install CasperJS 1.1.0 and launch the site to http://localhost:8080/ to run frontend tests
casperjs test --includes=lib/default_base_url.js,lib/test_helpers.js *.js
