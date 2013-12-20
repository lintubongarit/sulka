#!/bin/bash
# Install latest CasperJS and PhantomJS to $HOME/bin or globally and launch the site to http://localhost:8080/. Then you can use this script to run individual tests (specify test JavaScript filename as $1). You can specify the site to test against as $2.

export PATH=$PATH:$HOME/bin
if [ -z "$1" ]; then
	echo "Specify test to run as first argument"
	exit 1
fi
if [ -n "$2" ]; then
	trap '[ -e "$tmp_file" ] && rm "$tmp_file"' EXIT
	tmp_file=`mktemp --tmpdir casperjs_url.XXXXX.js`
	echo 'const URL="'$2'";' > $tmp_file
	url_include=",$tmp_file"
else
	url_include=""
fi
casperjs test --includes=lib/default_base_url.js,lib/test_helpers.js$url_include "$1"
