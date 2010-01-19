all: Construct.dll

test: text.exe
	mono test.exe

text.exe: test.cs Construct.dll
	gmcs -r:Construct.dll -r:Modifier.dll test.cs

Construct.dll: Construct.cs Modifier.dll
	gmcs -target:library -out:$@ -r:Modifier.dll $<

Modifier.dll: Modifier.cs
	gmcs -target:library -out:$@ $<
	
clean:
	@rm -f *.dll *.exe
