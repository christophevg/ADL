load( "lib/env-js/dist/env.rhino.js");

if( typeof console === "undefined" ) {
    var console = { log: function() { } };
}

load( "lib/ProtoJS/build/ProtoJS.js");

var testing = Class.extend( {
    init : function() {
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
	print( "FAIL: " + name + "\n" + info );
    },

    using : function( set ) {
	if( !this.testFunction ) {
	    print( "Please provide a function to test first..." );
	    return;
	}
	this.start();
	set.iterate(function(test) {
	    this.nextTest();
	    var outcome = this.testFunction( test.data, test.msg, test.result );
	    outcome.result == test.expected ? 
		this.success(test.name) : this.fail(test.name, outcome.info);
	}.scope(this) );
	this.showResults();
    }
} );

var tester = new testing();
