PROTOTYPE-DIST=prototype-1.6.0.3.js
PROTOTYPE-URL=http://www.prototypejs.org/assets/2008/9/29/${PROTOTYPE-DIST}

ENVJS-DIST=lib/env-js/dist/env.rhino.js
ENVJS-URL=git://github.com/thatcher/env-js.git

APP=ADL
SRCS=src/js/${APP}.par
LIBS=lib/${PROTOTYPE-DIST}
VERSION=$(shell git describe --tags | cut -d'-' -f1,2)

TARGETS=build/${APP}.standalone.min.js build/${APP}.shared.min.js build/${APP}.cli.js

GIT-FETCH=git clone -q
FETCH=wget -q
ZIP=zip -qr
UNZIP=unzip -q
UNTAR=tar -zxf
RHINO-JAR=lib/rhino1_7R1/js.jar
RHINO=java -jar ${RHINO-JAR}
JSEXEC=${RHINO} -w -debug
COMPRESS=java -jar ${COMPRESS-JAR} --type js
PATCH=patch -N -s

RHINO-DIST=rhino1_7R1.zip
RHINO-URL=ftp://ftp.mozilla.org/pub/mozilla.org/js/${RHINO-DIST}

JSCC-DIST=jscc-0.30.tar.gz
JSCC-URL=http://jscc.jmksf.com/release/${JSCC-DIST}

COMPRESSOR-VERSION=2.4.2
COMPRESSOR-DIST=yuicompressor-${COMPRESSOR-VERSION}.zip
COMPRESS-JAR=lib/yuicompressor-${COMPRESSOR-VERSION}/build/yuicompressor-${COMPRESSOR-VERSION}.jar
COMPRESSOR-URL=http://www.julienlecomte.net/yuicompressor/${COMPRESSOR-DIST}

DIST=${APP}-${VERSION}.zip
DISTSRCS=${TARGETS} examples/*.html LICENSE README doc/MyVisitor.js

DIST-SRC=${APP}-${VERSION}-src.zip
DIST-SRCSRCS=LICENSE README examples Makefile src doc patches

PUB=moonbase:~/dist/

all: build

build: .check-deps ${TARGETS}

update-libs:

.check-deps:
	@echo "*** checking dependencies"
	@echo "    (if you get errors in this section the cmd right before"
	@echo "     the error, is not found in your PATH)"
	@echo "    - touch"; which touch >/dev/null
	@echo "    - git";   which git >/dev/null
	@echo "    - tar";   which tar >/dev/null
	@echo "    - zip";   which zip >/dev/null
	@echo "    - unzip"; which unzip >/dev/null
	@echo "    - wget";  which wget >/dev/null
	@echo "    - java";  which java >/dev/null
	@echo "*** FOUND all required commands on your system"
	@touch $@

dist: dist/${DIST} dist/${DIST-SRC}

${RHINO-JAR}:
	@echo "*** importing $@"
	@mkdir -p lib
	@(cd lib; ${FETCH} ${RHINO-URL}; ${UNZIP} ${RHINO-DIST})

${COMPRESS-JAR}:
	@echo "*** importing $@"
	@mkdir -p lib
	@(cd lib; ${FETCH} ${COMPRESSOR-URL}; ${UNZIP} ${COMPRESSOR-DIST})
	@(cd lib/yuicompressor-${COMPRESSOR-VERSION}; ant > /dev/null)

lib/${PROTOTYPE-DIST}:
	@echo "*** importing $@"
	@mkdir -p lib
	@(cd lib; ${FETCH} ${PROTOTYPE-URL})

${ENVJS-DIST}:
	@echo "*** importing $@"
	@mkdir -p lib
	@(cd lib; ${GIT-FETCH} ${ENVJS-URL})
	@(cd lib/env-js; ant 2>&1 > /dev/null)
	@(cd lib/env-js/dist; ${PATCH} < ../../../patches/env.js.diff)

lib/jscc/jscc.js: lib/jscc
lib/jscc/driver_web.js_: lib/jscc

lib/jscc:
	@echo "*** importing $@"
	@mkdir -p lib
	@(cd lib; ${FETCH} ${JSCC-URL})
	@(cd lib; ${UNTAR} ${JSCC-DIST})

build/${APP}.shared.min.js: build/${APP}.shared.js ${COMPRESS-JAR}
	@echo "*** building $@"
	@${COMPRESS} build/${APP}.shared.js > $@

build/${APP}.standalone.min.js: build/${APP}.standalone.js ${COMPRESS-JAR}
	@echo "*** building $@"
	@${COMPRESS} build/${APP}.standalone.js > $@

build/${APP}.standalone.js: build/${APP}.shared.js ${LIBS}
	@echo "*** building $@"
	@mkdir -p build
	@cat ${LIBS} build/${APP}.shared.js > $@

build/${APP}.shared.js: ${SRCS} lib/jscc/jscc.js lib/jscc/driver_web.js_ ${RHINO-JAR}
	@echo "*** generating ${APP} parser"
	@mkdir -p build
	@${JSEXEC} lib/jscc/jscc.js -o $@ -t lib/jscc/driver_web.js_ ${SRCS}
	@echo "\nADL.version = \"${VERSION}\";\n" >> $@;

build/${APP}.cli.js: ${SRCS} lib/jscc/jscc.js lib/jscc/driver_rhino.js_ ${RHINO-JAR}
	@echo "*** generating ${APP} cli parser"
	@mkdir -p build
	@${JSEXEC} lib/jscc/jscc.js -o $@ -t lib/jscc/driver_rhino.js_ ${SRCS}
	@echo "\nADL.version = \"${VERSION}\";\n" >> $@;

publish: dist/${DIST} dist/${DIST-SRC}
	@echo "*** publishing distributions to ${PUB}"
	@scp dist/${DIST} dist/${DIST-SRC} ${PUB}

dist/${DIST}: ${DISTSRCS}
	@echo "*** packaging ${APP} distribution"
	@mkdir -p dist/js/${APP}/{examples,build,doc}
	@for f in ${DISTSRCS}; do \
	    cat $$f | sed -e 's/\.\.\/build/../' > dist/js/${APP}/$$f; done
	@mv dist/js/${APP}/build/* dist/js/${APP}/; rm -rf dist/js/${APP}/build
	@(cd dist/js; ${ZIP} ../${DIST} ${APP})

dist/${DIST-SRC}: ${DIST-SRCSRCS}
	@echo "*** packaging ${APP} src distribution"
	@mkdir -p dist/src/${APP}
	@cp -r ${DIST-SRCSRCS} dist/src/${APP}
	@(cd dist/src; ${ZIP} ../${DIST-SRC} ${APP})

test: build ${ENVJS-DIST}
	@echo "*** running tests"
	@${JSEXEC} -f t/*.js

clean:
	@find . | grep "~$$" | xargs rm -f
	@rm -rf build dist

mrproper: clean
	@rm -rf lib
