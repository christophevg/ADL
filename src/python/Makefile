all: AdlParser.py run

AdlParser.py: Adl.g
	java -cp lib/antlr-3.1.jar org.antlr.Tool $<

run:
	python adl.py test.adl

clean:
	rm -f Adl.tokens AdlLexer.py AdlParser.py *.pyc
