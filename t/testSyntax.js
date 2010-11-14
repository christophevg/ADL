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

print( "Testing Parser" );
eval( "tests = " + readFile("t/testSyntax.json") );
ProtoJS.Test.Runner.test( parseADL ).using( tests );