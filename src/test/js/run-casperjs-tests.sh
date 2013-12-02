#!/bin/bash
# Install latest CasperJS and PhantomJS to $HOME/bin or globally and launch the site to http://localhost:8080/ to run the frontend tests
# Alternatively specify PATH to casperjs and phantomjs as $1 and site URL as $2

export PATH=$PATH:$HOME/bin
if [ -n "$1" ]; then
	export PATH=$1:$PATH
fi
if [ -n "$2" ]; then
	trap '[ -e "$tmp_file" ] && rm "$tmp_file"' EXIT
	tmp_file=`mktemp --tmpdir casperjs_url.XXXXX.js`
	echo 'const URL="'$2'";' > $tmp_file
	url_include=",$tmp_file"
else
	url_include=""
fi
casperjs test --includes=lib/default_base_url.js,lib/test_helpers.js$url_include --xunit=../../../target/surefire-reports/casperjs.xml *.js
