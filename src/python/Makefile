ANTLR=java -cp lib/antlr-3.1.jar org.antlr.Tool
PARSEADL=python parse.py
RM=rm -f

all: AdlParser.py

AdlParser.py: adl.g
	@${ANTLR} $<

run: test.adl AdlParser.py
	@${PARSEADL} $<

clean:
	@${RM} Adl.tokens AdlLexer.py AdlParser.py *.pyc

mrproper:
