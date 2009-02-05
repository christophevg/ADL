var Prototype = {
  Version: 'specific-standalone-version-for-ADL',
  
  Browser: {
    IE:     !!(window.attachEvent &&
      navigator.userAgent.indexOf('Opera') === -1),
    Opera:  navigator.userAgent.indexOf('Opera') > -1,
    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
    Gecko:  navigator.userAgent.indexOf('Gecko') > -1 && 
      navigator.userAgent.indexOf('KHTML') === -1,
    MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
  },

  BrowserFeatures: {
    XPath: !!document.evaluate,
    SelectorsAPI: !!document.querySelector,
    ElementExtensions: (function() {
      if (window.HTMLElement && window.HTMLElement.prototype)
        return true;      
      if (window.Element && window.Element.prototype)
        return true;
    })(),
    SpecificElementExtensions: (function() {      
      // First, try the named class
      if (typeof window.HTMLDivElement !== 'undefined')
        return true;
        
      var div = document.createElement('div');
      if (div['__proto__'] && div['__proto__'] !== 
       document.createElement('form')['__proto__']) {
        return true;
      }
      
      return false;      
    })()
  },

  ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
  JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,  
  
  emptyFunction: function() { },
  K: function(x) { return x }
};

if (Prototype.Browser.MobileSafari)
  Prototype.BrowserFeatures.SpecificElementExtensions = false;
  
var Abstract = { };

/**
 * == lang ==
 * Language extensions.
**/

/** section: lang
 * Try
**/

/**
 *  Try.these(function...) -> ?
 *  - function (Function): A function that may throw an exception.
 *  Accepts an arbitrary number of functions and returns the result of the
 *  first one that doesn't throw an error.
 **/
var Try = {
  these: function() {
    var returnValue;
    
    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) { }
    }
    
    return returnValue;
  }
};
