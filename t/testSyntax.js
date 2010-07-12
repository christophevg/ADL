function parseADL(input, msg, expected ) {
  var output = "";
  var error  = null;
  msg        = msg || "";
  expected   = expected || input;

  try {
    var parser     = new ADL.Parser();
    var ast        = parser.parse(input);
    if( ! ast ) {
      error = parser.errors;
    } else {
    	var root       = ast.getRoot();
    	var constructs = root.getChildren();
    	var output     = constructs.toString();
		}
  } catch(e) {
    error = e;
  }

  if( error ) {
    error = error.toString();
  }
  if( error || output != expected ) {
    msg = "Expected :\n" + expected + "\nbut got :\n" + output + "\n" +
    ( error ? "Parsing error was: " + error + "\n" : "" ) + msg;
    return { result: false, info: msg };
  }

  return { result: true, info: "" };
}

ProtoJS.Test.Runner.test( parseADL ).using(
  [ 
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
    msg      : "prefix modifiers will be turned into postfix modifiers.",
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
  },{
    name     : "016",
    data     : "Construct\n\t\rf;",
    result   : "Construct f;",
    expected : true
  },{
		name     : "017",
		data     : "Construct X { Construct Y; }",
		result   : "Construct X {\n  Construct Y;\n}",
		expected : true
	},{
		name     : "018",
		data     : "[@annotation1] [@annotation2] Construct X;",
		result   : "[@annotation1]\n[@annotation2]\nConstruct X;",
		expected : true
	},{
		name     : "019",
		data     : "Construct X := \"some Value\";",
		expected : true
	},{
		name     : "020",
		data     : "Construct X := 123;",
		expected : true
	},{
		name     : "021",
		data     : "Construct X := true;",
		expected : true
	}
  ] 
);
