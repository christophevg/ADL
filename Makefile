APP          = ADL

GRAMMAR      = src/js/${APP}.par
SRCS         = build/${APP}.parser.js
CLI_SRCS     = ${SRCS}

LIBS         = lib/ProtoJS/build/ProtoJS.js

JSCC-WEB     = ${JSEXEC} lib/jscc.js -t lib/driver_web.js_ -o
JSCC-RHINO   = ${JSEXEC} lib/jscc.js -t lib/river_rhino.js_ -o

UPDATE_LIBS  = lib/ProtoJS

#############################################################################
# boilerplate to kickstart common.make

have-common := $(wildcard lib/common.make/Makefile.inc)
ifeq ($(strip $(have-common)),)
all:
	@echo "*** one-time initialization of common.make"
	@git submodule -q init
	@git submodule -q update
	@$(MAKE) -s $@
endif

-include lib/common.make/Makefile.inc

#############################################################################

${SRCS}: ${GRAMMAR}
	@echo "*** generating ${APP} parser"
	@mkdir -p build
	@${JSCC-WEB} $@ $<
