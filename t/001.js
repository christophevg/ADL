load( "t/testing.js" );
load( "build/ADL.cli.js" );

function parseADL(src, result) {
    var retval = "";
    try {
	retval = new ADL.Parser().parse(src).getRoot().children.toString();
    } catch(e) {
	result = "Expected : '" + src + "', but got : '" + retval + "'\n" +
	    "The error was: " + e.toString();
    }
    return { result: ( result ? retval == result : retval == src ),
	     info: result || "" };
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
	data     : "TestConstruct myTest +x=10 +y=+11 +z=-12;",
	expected : true
    },{
	name     : "005",
	data     : "TestConstruct myTest +bool=true +bool2=false;",
	expected : true
    },{
	name     : "006",
	data     : "+prefixModifier TestConstruct myTest;",
	result   : "TestConstruct myTest +prefixModifier;",
	expected : true
    },{
	name     : "007",
	data     : "+prefixModifier +prefixModifier2=\"test\" TestConstruct myTest;",
	result   : "TestConstruct myTest +prefixModifier +prefixModifier2=\"test\";",
	expected : true
    },{
	name     : "008",
	data     : "+prefixModifier TestConstruct myTest +suffixModifier=\"test\";",
	result   : "TestConstruct myTest +prefixModifier +suffixModifier=\"test\";",
	expected : true
    },{
	name     : "009",
	data     : "TestConstruct<T> myTest;",
	result   : "TestConstruct<T> myTest;",
	expected : true
    },{
	name     : "010",
	data     : "TestConstruct<T> myTest : SuperConstruct;",
	result   : "TestConstruct<T> myTest : SuperConstruct;",
	expected : true
    },{
	name     : "011",
	data     : "TestConstruct<T> myTest : SuperConstruct<T>;",
	result   : "TestConstruct<T> myTest : SuperConstruct<T>;",
	expected : true
    },{
	name     : "012",
	data     : "TestConstruct myTest : SuperConstruct<T>;",
	result   : "TestConstruct myTest : SuperConstruct<T>;",
	expected : true
    },{
	name     : "013",
	data     : "TestConstruct<X, Y> myTest : SuperConstruct<X>;",
	result   : "TestConstruct<X,Y> myTest : SuperConstruct<X>;",
	expected : true
    },{
	name     : "014",
	data     : "TestConstruct myTest<X> : SuperConstruct;",
	expected : true
    },{
	name     : "015",
	data     : "TestConstruct<> myTest : SuperConstruct;",
	expected : false
    }
] );
