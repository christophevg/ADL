import sys

import adl

print "\n".join(["%s" % (s) for s in adl.parse(open(sys.argv[1]).read())])
