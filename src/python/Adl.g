grammar Adl;

options {
    language=Python;
    backtrack=true;
}

compilationUnit : (statement)*
	;

statement : construct
          | directive
          ;

construct @init { 
  prefix_modifiers = {}
  suffix_modifiers = {}
}
          : annotations? prefix_modifiers=modifiers? type name? (suptype)* suffix_modifiers=modifiers? value? children {
  modifiers = {}
  modifiers.update(prefix_modifiers)
  modifiers.update(suffix_modifiers)
  print "construct \%s \%s \%s \%s" \% ( 
    " ".join($annotations.list) if $annotations.list != None else "", 
    " ".join(["\%s=\%s" \% (k,v) for k,v in modifiers.items()]),
    $type.value,
    $name.value if $name.value != None else ""
  )
};

annotations returns [list] @init { list = [] }
            : ( ANNOTATION { list.append($ANNOTATION.getText()) } )+
			;

modifiers returns [set set] @init { set = {} }
            : ( modifier { set[$modifier.name] = $modifier.value } )+
			;

directive :  INCLUDEDIRECTIVE STRING
	  ;

modifier returns [ name, value ] : '+' IDENTIFIER { $name = $IDENTIFIER.getText() }
         | '+' IDENTIFIER '=' literal { 
  $name = $IDENTIFIER.getText(); 
  $value = $literal.value; 
}
         ;

type returns [value] : IDENTIFIER {
	$value = $IDENTIFIER.getText();
};

name returns [value] : IDENTIFIER { 
	$value = $IDENTIFIER.getText();
};

suptype : ':' IDENTIFIER;

value : ':=' literal;

literal returns [ value ]
        : BOOLEAN { $value = True if $BOOLEAN.getText() == "true" else False }
		| INTEGER { $value = int($INTEGER.getText()) }
		| STRING  { $value = $STRING.getText() }
	    ;

children : '{' (statement)* '}'
	 | ';'
	 ;

// TOKENS
BOOLEAN : 'true'
	| 'false'
	;

IDENTIFIER : ('a'..'z'|'A'..'Z'|'_') ('a'..'z'|'A'..'Z'|'0'..'9'|'_')*
    	   ;

INTEGER : ('0'..'9')+
        ;

STRING :  '"' ~('"')+ '"'
       |  '\'' ~('\'')+ '\''
       ;

ANNOTATION : '[@' ~(']')* ']'
	   ;

INCLUDEDIRECTIVE : '#include'
		 ;
WS  :  (' '|'\r'|'\t'|'\u000C'|'\n') { $channel=HIDDEN }
    ;

COMMENT
    :   '/*' ( options {greedy=false;} : . )* '*/' { $channel=HIDDEN }
    ;

LINE_COMMENT
    : '//' ~('\n'|'\r')* '\r'? '\n' { $channel=HIDDEN }
    ;
 
