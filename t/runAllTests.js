load( "lib/common.make/env.rhino.js" );
load( "lib/ProtoJS/build/ProtoJS.js" );
load( "build/ADL.cli.min.js" );

load( "t/testSyntax.js"    );	

print( "-----------------------" );
print( ProtoJS.Test.Runner.getResults().total   + " tests run." );
print( ProtoJS.Test.Runner.getResults().failed  + " failed." );
print();
