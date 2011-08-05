// ==========================================================================
// Project:   MySystem.Link
// Copyright: ©2010 My Concord Consrtium, Inc.
// ==========================================================================
/*globals MySystem Forms LinkIt SC*/

/** @class 
  
  @extends SC.Record
  @version 0.1
*/

require('views/improved_radio.js');

MySystem.Link = SC.Record.extend(

/** @scope MySystem.Link.prototype */ {
  color: SC.Record.attr(String),
  text: SC.Record.attr(String),

  // uuid taken from the energy type of this
  // TODO figure out where this is setup
  energyType: SC.Record.attr(String),

  startNode: SC.Record.toOne('MySystem.Node', {
    inverse: 'outLinks'
  }),

  endNode:  SC.Record.toOne('MySystem.Node', {
    inverse: 'inLinks'
  }),

  sentences: SC.Record.toMany('MySystem.StorySentence', {
    inverse: 'links', isMaster: NO
  }),

  // It might be better to use some of the sproutcore SC.Record.toOne here
  // however that will require:
  //  1. dealing with the form below used for editing the energyType field
  //     the radio button control used there only works currently works with string values
  //  2. protecting the model so it will work when the energyType it isn't loaded
  //  3. checking the serialized state of the model: should the guid of EnergyTypes be the uuid?
  //     if the guid isn't the uuid then an guid will start showing up in the saved state
  energyTypeObj: function() {
    var energyTypeUUID = this.get('energyType');
    if(SC.none(energyTypeUUID)) {
      return null;
    }
    
    // HACK, this can go away when we start passing around real objects
    // the activityController is used instead of a general SC.Query, because the authoring interaction causes a new
    // instance of each EnergyType to be created whenever the authored content is updated
    return MySystem.getPath('activityController.energyTypes').findProperty('uuid', this.get('energyType'));
  }.property('energyType'),

  energyTypeObjDidChange: function() {
    var energyType = this.get('energyTypeObj');
    
    if(SC.none(energyType)){
      return;
    }
    
    this.set('color', energyType.get('color'));
  }.observes('energyTypeObj'),

  // Parameters for LinkIt:Link styles:
  //   lineStyle, one of:
      // LinkIt.HORIZONTAL_CURVED
      // LinkIt.VERTICAL_CURVED
      // LinkIt.STRAIGHT (default)
  //   width (in pixels, 6 by default)
  //   color (HTML RGB color, '#ADD8E6' by default)
  //   cap, (an un-arrowed line end) one of:
      // LinkIt.ROUND (default)
  //   arrows, one of:
      // LinkIt.ARROW_END (default)
      // LinkIt.ARROW_START
      // LinkIt.ARROW_BOTH
      // LinkIt.ARROW_NONE
  //   arrowAngle (the width of the arrow "tip", 40 degress by default)
  //   arrowLength (the length of the arrowhead, 5px by default)
  linkStyle: {
    lineStyle: LinkIt.VERTICAL_CURVED,
    width: 6,
    color: '#00ff00',
    cap: LinkIt.ROUND,
    arrows: LinkIt.ARROW_END
  },

  // Parameters for LinkIt:Link labels:
  //   text
  //   fontSize
  //   fontFamily
  //   fontStyle
  //   backgroundColor
  //   padding
  label: {
    text: "label",
    fontSize: 12,
    fontFamily: 'sans-serif',
    fontStyle: 'normal',
    backgroundColor: "#ffffff"
  },

  startTerminal: SC.Record.attr(String),
  endTerminal: SC.Record.attr(String),

  // return a hash of editable attributes for the property editor
  formFields: [
    // fields: "color text".w(),
    // color: 
    // Forms.FormView.row(SC.RadioView, {
    Forms.FormView.row(MySystem.ImprovedRadioView, {
      layout: { width: 160, height: 85 }, // TODO: Hardwired height. Ugh.
      fieldKey: "energyType",
      fieldLabel: "Energy Type:",
      itemsBinding: 'MySystem.activityController.energyTypes',
      itemTitleKey: 'label',
      itemValueKey: 'uuid',
      itemColorKey: 'color',
      itemIsEnabledKey: 'isEnabled',
      layoutDirection: SC.LAYOUT_VERTICAL
    }),
    //text: 
    Forms.FormView.row(SC.TextFieldView, {
      fieldKey: "text",
      fieldLabel: "Label:"
    })
  ],
  
  isDimmed: NO,

  init: function () {
    sc_super();
    // setup the links property initially
    //this.invokeLater(this._calculateLinks);
  },
  
  // sanitation check on the link:
  isComplete: function() {
    var sNode = this.get('startNode');
    var eNode = this.get('endNode');
    var sTerm = this.get('startTerminal');
    var eTerm = this.get('endTerminal');
    
    if (this.isDestroyed()) return false;
    if (SC.none(sNode)) return false;
    if (SC.none(eNode)) return false;
    if (SC.none(sTerm)) return false;
    if (SC.none(eTerm)) return false;
    if (sNode.isDestroyed()) return false;
    if (eNode.isDestroyed()) return false;
    
    return true;
  },
  
  makeLinkItLink: function() {
    var tempHash = {};
    this._setLabel();
    this._setLinkStyle();
    tempHash.startNode = this.get('startNode');
    tempHash.startTerminal = this.get('startTerminal');
    tempHash.endNode = this.get('endNode');
    tempHash.endTerminal = this.get('endTerminal');
    tempHash.label = this.get('label');
    tempHash.linkStyle = this.get('linkStyle');
    tempHash.selectionWidth = this.get('linkStyle').width + 4;
    tempHash.model = this; // reference back to this
    return SC.Object.create( LinkIt.Link, tempHash);
  },
  
  _textChanged: function() {
    this.invokeOnce(this._setLabel);
    if (this.get('startNode')) this.get('startNode').notifyPropertyChange('links');
    if (this.get('endNode')) this.get('endNode').notifyPropertyChange('links');
  }.observes('.text'),
  
  _colorChanged: function() {
    this.invokeOnce(this._setLinkStyle);
    if (this.get('startNode')) this.get('startNode').notifyPropertyChange('links');
    if (this.get('endNode')) this.get('endNode').notifyPropertyChange('links');
  }.observes('.color'),
  
  _setLabel: function() {
    var newLabel = {
      text: this.get('text'),
      fontSize: 12,
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      backgroundColor: "#ffffff"
    };
    this.set("label", newLabel);
  },
  
  _setLinkStyle: function() {
    var newLinkStyle = {
      lineStyle: this.get('linkStyle').lineStyle,
      width: this.get('linkStyle').width,
      color: this.get('color'),
      cap: this.get('linkStyle').cap,
      arrows: this.get('linkStyle').arrows
    };
    this.set("linkStyle", newLinkStyle);
  },
  
  // FIXME color should be a computed property of some kind
  dimColor: function() { // If we're selecting links in some states, we want un-selected links to be dimmed.
    if (this.get('isDimmed') === YES) {
      var oldColor, newColor, channels;
      oldColor = this.get('color');
      newColor = {};
      // array of color definition objects
      var color_defs = MySystem.Link.COLOR_DEFS;
      // search through the definitions to find a match
      // reformat color string so we can manipulate it
      for (var i = 0; i < color_defs.length; i++) {
          var re = color_defs[i].re;
          var processor = color_defs[i].process;
          var bits = re.exec(oldColor);
          if (bits) {
            channels = processor(bits);
            newColor.r = channels[0];
            newColor.g = channels[1];
            newColor.b = channels[2];
            newColor.a = (channels[3] ? channels[3] : 1.0);
            newColor.ok = true;
          }
      }

      if (newColor.r !== undefined) {
        // dial down alpha
        newColor.a = newColor.a * 0.2;
        // set new color
        this.set("color", "rgba(" + newColor.r.toString() + ", " + newColor.g.toString() + ", " + newColor.b.toString() + ", " + newColor.a.toString() + ")");
        return YES;
      }
      else {
        SC.Logger.log("No matching color pattern found.");
        return NO;
      }
    }
  }.observes('isDimmed'),
  
  unDimColor: function() { // Leaving a dimmed state, restore alpha.
    if (!this.get('isDimmed')) {
      var oldColor, newColor, channels;
      oldColor = this.get('color');
      newColor = {};
      // array of color definition objects
      var color_defs = MySystem.Link.COLOR_DEFS;

      // search through the definitions to find a match
      // reformat color string so we can manipulate it
      for (var i = 0; i < color_defs.length; i++) {
          var re = color_defs[i].re;
          var processor = color_defs[i].process;
          var bits = re.exec(oldColor);
          if (bits) {
            channels = processor(bits);
            newColor.r = channels[0];
            newColor.g = channels[1];
            newColor.b = channels[2];
            newColor.a = (channels[3] ? channels[3] : 1.0);
            newColor.ok = true;
          }
      }

      if (newColor.r !== undefined) {
        // reset alpha
        newColor.a = newColor.a * 5;
        if (newColor.a > 1.0) newColor.a = 1.0;

        // temporary fix for the fact that this observer can fire after the underlying record is destroyed, throwing an error
        // FIXME however, 'color' ought to be a computed property and should not rely on an observer to be changed.
        if (!this.get('isDestroyed')) {
          // set new color
          this.set("color", "rgba(" + newColor.r.toString() + ", " + newColor.g.toString() + ", " + newColor.b.toString() + ", " + newColor.a.toString() + ")");
        }
        return YES;
      }
      else {
        SC.Logger.log("No matching color pattern found.");
        return NO;
      }
    }
  }.observes('isDimmed'),
  
  fixSelectionDimming: function() {
    if (this.get('isSelected') && this.get('isDimmed')) {
      this.set('isDimmed', NO);
    }
  }
}) ;
MySystem.Link.GuidCounter = 100;
MySystem.Link.newGuid = function() { return "link" + MySystem.Link.GuidCounter++;};
MySystem.Link.hashFromLinkItLink = function(linkItLinks) {
  var linkItLink = linkItLinks[0];
  var tempHash = {};
  tempHash.startNode = linkItLink.get('startNode');
  tempHash.startTerminal = linkItLink.get('startTerminal');
  tempHash.endNode = linkItLink.get('endNode');
  tempHash.endTerminal = linkItLink.get('endTerminal');
  tempHash.label = SC.clone(linkItLink.get('label'));
  return tempHash;
};

MySystem.Link.COLOR_DEFS = [
    {
      're': /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
      'example': ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
      'process': function (bits){
        return [
          parseInt(bits[1], 10),
          parseInt(bits[2], 10),
          parseInt(bits[3], 10)
        ];
      }
    },
    {
      're': /^\#?(\w{2})(\w{2})(\w{2})$/,
      'example': ['#00ff00', '336699'],
      'process': function (bits){
        return [
          parseInt(bits[1], 16),
          parseInt(bits[2], 16),
          parseInt(bits[3], 16)
        ];
      }
    },
    {
      're': /^\#?(\w{1})(\w{1})(\w{1})$/,
      'example': ['#fb0', 'f0f'],
      'process': function (bits){
        return [
          parseInt(bits[1] + bits[1], 16),
          parseInt(bits[2] + bits[2], 16),
          parseInt(bits[3] + bits[3], 16)
        ];
      }
    },
    {
      're': /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([\d.]+)\)$/,
      'example': ['rgba(123, 234, 45, 1.0)', 'rgb(255,234,245,0.3333333)'],
      'process': function (bits){
        return [
          parseInt(bits[1], 10),
          parseInt(bits[2], 10),
          parseInt(bits[3], 10),
          parseInt(bits[4], 10)
        ];
      }
    }
];
