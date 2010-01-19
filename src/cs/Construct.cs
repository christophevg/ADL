using System;
using System.Collections.Generic;

namespace TSF.ADL {
  public class Construct {
    private String type;
    private String name;
    private List<String> annotations = new List<String>();
    private List<String>      supers = new List<String>();
    private List<Modifier> modifiers = new List<Modifier>();
    private List<Construct> children = new List<Construct>();

    public Construct setType(String type) {
      this.type = type.ToLower();
      return this;
    }

    public Construct setName(String name) {
      this.name = name;
      return this;
    }

    public Construct addAnnotation(String annotation) {
      this.annotations.Add(annotation);
      return this;
    }

    public Construct addSuper(String name) {
      this.supers.Add(name);
      return this;
    }

    public Construct addModifier(Modifier modifier) {
      this.modifiers.Add(modifier);
      return this;
    }

    public Construct addChild(Construct construct) {
      this.children.Add(construct);
      return this;
    }

    public String getType() {
      return this.type;
    }

    public String getName() {
      return this.name;
    }

    public String getAnnotationsAsString(String prefix) {
      String s = "";
      foreach( String annotation in this.annotations ) {
        s += prefix + "[@" + annotation + "]\r\n";
      }
      return s;
    }

    public String getSuperAsString() {
      String s = "";
      foreach( String zuper in this.supers ) {
        s += " :" + zuper;
      }
      return s;
    }

    public String getModifiersAsString() {
      String s = "";
      foreach( Modifier modifier in this.modifiers ) {
        s += modifier.toString() + " ";
      }
      return s;
    }

    public String getChildrenAsString(String prefix) {
      if( this.children.Count < 1 ) { return ";"; }
      String s = " {\r\n";
      foreach( Construct child in this.children ) {
        s += child.toString(prefix + "  ") + "\r\n";
      }
      s += prefix + "}";
      return s;
    }

    public List<String> getDependencies() {
      List<String> deps = new List<String>();
      foreach( Construct child in this.children ) {
        deps.AddRange(child.getDependencies());
      }
      deps.AddRange(this.supers);
      return deps;
    }

    public String toString(String prefix) {
      return this.getAnnotationsAsString(prefix) 
          + prefix + this.type + " " + this.name
          + this.getSuperAsString()
          + this.getModifiersAsString()
          + this.getChildrenAsString(prefix);
    }
    
    public String toString() {
      return this.toString("");
    }
  }
}
