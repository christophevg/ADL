load( "t/testing.js" );
load( "build/ADL.cli.js" );

function parseADL(src) {
    var result = "";
    try {
	result = new ADL.Parser().parse(src).getRoot().children.toString();
    } catch(e) {
	result = "Expected : '" + src + "', but got : '" + result + "'\n" +
	    "The error was: " + e.toString();
    }
    return { result: src == result, info: result };
}

tester.test( parseADL ).using( [ 
    { 
	name     : "001",
	data     : "TestConstruct myTest;",
	expected : true 
    },{ 
	name     : "002",
	data     : "TestConstruct myTest : MyTestParent1 : MyTestParent2;",
	expected : true 
    },{
	name     : "003",
	data     : "TestConstruct",
	expected : false
    },{
	name     : "004",
	data     : "TestConstrcut myTest +x=10 +y=+11 +z=-12;",
	expected : true
    }
] );
