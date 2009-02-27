load( "lib/env-js/dist/env.rhino.js");
load( "lib/prototype-1.6.0.3.js" );

var testing = Class.create( {
    initialize : function() {
	this.start();
    },
    
    showResults : function () {
	print( this.count    + " tests run." );
	print( this.failure  + " failed." );
    },
    
    start : function () {
	this.count   = 0;
	this.failure = 0;
    },
    
    test : function( fnc ) {
	this.testFunction = fnc;
	return this;
    },

    nextTest : function() {
	this.count++;
    },

    success : function( name ) {
	// nothing todo ;-)
    },

    fail : function( name, info ) {
	this.failure++;
	print( "FAIL: " + name );
	var infoLines = info.split("\n");
	infoLines.each( function(line) {
	    print( "      " + line );
	} );
    },

    using : function( set ) {
	if( !this.testFunction ) {
	    print( "Please provide a function to test first..." );
	    return;
	}
	this.start();
	set.each(function(test) {
	    this.nextTest();
	    var outcome = this.testFunction( test.data );
	    outcome.result == test.expected ? 
		this.success(test.name) : this.fail(test.name, outcome.info);
	}.bind(this) );
	this.showResults();
    }
} );

var tester = new testing();
