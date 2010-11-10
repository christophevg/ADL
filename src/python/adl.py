import sys
import antlr3
from AdlLexer import AdlLexer
from AdlParser import AdlParser

cStream = antlr3.StringStream(open(sys.argv[1]).read())
lexer   = AdlLexer(cStream)
tStream = antlr3.CommonTokenStream(lexer)
parser  = AdlParser(tStream)
parser.compilationUnit()
