import sys

from adl import FileParser

print "\n".join(["%s" % (s) for s in FileParser.parse(sys.argv[1])])
