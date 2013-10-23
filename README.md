Sulka
=====

Uusi käyttöliittymä rengastustietojen syöttöön.

Installing
==========
Should work out of the box with Maven and Java 7 (versions as of fall 2013) with following extras:

Oracle DB module
----------------
Oracle .jar is found in the repo, but before Maven can find it you must run the following command on top-level:
    mvn install:install-file -Dfile=other_files/ojdbc7.jar \
    	-DgroupId=com.oracle -DartifactId=ojdbc7 -Dversion=12.1.0.1 \
    	-Dpackaging=jar

Frontend tests
--------------
Frontend tests are launched with ```mvn exec:exec``` and require the git-latest [CasperJS](http://casperjs.org/) and 
version 1.9 of [PhantomJS](http://phantomjs.org/) in PATH. Also, they obviously require that the server is running in
the localhost (or in the URL specified as the second argument to the test runner at
```src/test/js/run-casperjs-tests.sh```. The first argument can be used to specify an alternate location for CasperJS 
and PhantomJS.)
