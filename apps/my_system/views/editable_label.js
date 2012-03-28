// ==========================================================================
// Project:   MySystem.EditableLabelView
// Copyright: ©2011 Concord Consortium
// Author:    Noah Paessel <knowuh@gmail.com>
// ==========================================================================
/*globals MySystem RaphaelViews */

/** @class

  RaphaelView for an editable label.


  @extends SC.View
  @extends RaphaelViews.RenderSupport
  @extends SC.Editable
*/
MySystem.EditableLabelView = RaphaelViews.RaphaelView.extend(SC.Editable, {
/** @scope MySystem.EditableLabelView.prototype */

  childViews: ['editBoxView'],
  displayProperties: 'displayText textColor centerX centerY fontSize'.w(),

  // PROPERTIES
  
  isEditing:     NO,
  isAllSelected: NO,
  fontSize:      12,
  text:          '',
  textColor:     '#000',
  centerX:       0,
  centerY:       0,

  displayText: function () {
    var txt = this.get('text');
    if (this.get('isEditing')) { 
      txt = txt + "_"; 
    }
    else {
      txt = (txt.replace(/\s+/g,"") === "") ? "«click to edit»" : txt;
    }
    return txt;
  }.property('text', 'isEditing').cacheable(),

  textBBox: function () {
    var raphaelText = this.get('raphaelObject');
    return raphaelText ? raphaelText.getBBox() : null;
  }.property('displayText', 'centerX', 'centerY', 'fontSize', 'raphaelObject'),  // don't make this .cacheable(), it doesn't work right
  
  acceptsFirstResponder: function () {
    return this.get('isEnabled');
  }.property('isEnabled').cacheable(),

  willLoseFirstResponder: function () {
    this.set('isEditing', NO);
    this.set('isAllSelected', NO);
  },

  renderCallback: function (raphaelCanvas, attrs) {
    return raphaelCanvas.text().attr(attrs);
  },

  render: function (context, firstTime) {
    var attrs = {
          x:             this.get('centerX'),
          y:             this.get('centerY'),
          fill:          this.get('textColor'),
          text:          this.get('displayText'),
          'font-size':   this.get('fontSize'),
          'text-anchor': 'middle'
        },
        
        raphaelText;

    if (firstTime) {
      context.callback(this, this.renderCallback, attrs);
      this.renderChildViews(context,firstTime);
    }
    else {
      raphaelText = this.get('raphaelObject');
      raphaelText.attr(attrs);
    }
  },

  toggle: function (paramName) {
    this.set(paramName, (! this.get(paramName)));
  },

  editFirstTime: function () {
    var item = this.get('item');
    
    if (this.get('isEditFirstTimePending')) {
      this.beginEditing();
      this.beginEditing(); // call twice to force selectAll
      // this.set('hasEditedFirstTime', YES);
    }
  }.observes('isEditFirstTimePending'),

  beginEditing: function () {
    if (!this.get('isEditable')) { return NO ; }
    this.becomeFirstResponder();
    if (this.get('isEditing')) {
      this.toggle('isAllSelected');
    }
    else {
      this.set('isEditing', YES);
    }
    return YES ;
  },

  discardEditing: function () {
    return this.commitEditing();
  },

  commitEditing: function () {
    this.resignFirstResponder();
    this.set('isEditing', NO) ;
    return YES ;
  },

  updateText: function (newtext) {
    this.beginPropertyChanges();
    this.set('isAllSelected', NO);
    this.set('text',newtext);
    this.endPropertyChanges();
  },

  keyDown: function (evt) {
    var chr = null;
    if (this.interpretKeyEvents(evt)) {
      return YES;
    }
    if (evt.type === 'keypress') {
      chr = evt.getCharString();
      if (chr) {
        this.appendText(chr);
        return YES;
      }
    }
    return NO;
  },

  appendText: function (chr) {
    if (this.get('isAllSelected')) {
      this.updateText(chr);
    }
    else {
      this.updateText(this.get('text') + chr);
    }
    return YES;
  },

  // @see frameworks/sproutcore/frameworks/desktop/system/key_bindings.js
  insertNewline: function () {
    this.commitEditing();
  },

  // @see frameworks/sproutcore/frameworks/desktop/system/key_bindings.js
  insertTab: function () {
    this.commitEditing();
  },

  // @see frameworks/sproutcore/frameworks/desktop/system/key_bindings.js
  cancel: function () {
    this.discardEditing();
  },

  // @see frameworks/sproutcore/frameworks/desktop/system/key_bindings.js
  selectAll: function() {
    this.set('isAllSelected', YES);
  },

  // @see frameworks/sproutcore/frameworks/desktop/system/key_bindings.js
  deleteBackward: function () {
    var t       = this.get('text'),
        newText = t.substr(0,t.length-1);

    if (this.get('isAllSelected')) {
      newText = "";
    }
    this.updateText(newText);
    return YES;
  },

    recentUp: function(up_now) {
      var now      = new Date().getTime(),// ms
          interval = 202,                 // ms
          maxTime  = 200;                 // ms

      if (typeof this.lastUp !== 'undefined' && this.lastUp) {
        interval  = now - this.lastUp;
        if (interval < maxTime) {
          return YES;
        }
      }
      if (up_now) {
        this.lastUp = now;
      }
      return NO;
    },

    mouseDown: function (evt) {
      // this.startDrag(evt);
      if (this.recentUp(NO)) {
        return YES;
      }
      return YES;
    },

    mouseUp: function(evt) {
      if (this.recentUp(YES)) {
        return this.doubleClick(evt);
      }
      return NO;
    },

    doubleClick: function(evt) {
      this.beginEditing();
      return YES;
    },

  // @see frameworks/sproutcore/frameworks/desktop/system/key_bindings.js
  // only problem is that deleteForward seems bound to "."
  // deleteForward: function () {
  //   return this.deleteBackward();
  // },

  editBoxView: RaphaelViews.RaphaelView.design({
    displayProperties:    'textBBox isAllSelected'.w(),
    
    textLabelView:        SC.outlet('parentView'),
    isVisibleBinding:     '.textLabelView.isEditing',
    isAllSelectedBinding: '.textLabelView.isAllSelected',
    textBBoxBinding:      '.textLabelView.textBBox',
    textBBoxBindingDefault: SC.Binding.oneWay(),

    minHeight:            18,
    minWidth:             20,
    margin:               2,  

    fill:                 '#FF5',
    strokeWidth:          1,
    stroke:               '#CCC',
    editingOpacity:       0.3,
    normalOpacity:        0.05,

    x: function () {
      var textBBox = this.get('textBBox');
      return textBBox ? textBBox.x - this.get('margin') : 0;
    }.property('textBBox').cacheable(),

    y: function () {
      var textBBox = this.get('textBBox');
      return textBBox ? textBBox.y - this.get('margin') : 0;
    }.property('textBBox').cacheable(),

    width: function () {
      var textBBox  = this.get('textBBox'),
          minWidth = this.get('minWidth'),
          width    = textBBox ? textBBox.width + 2 * this.get('margin') : 0;
          
      return (width >= minWidth) ? width : minWidth; 
    }.property('textBBox').cacheable(),

    height: function () {
      var textBBox  = this.get('textBBox'),
          minHeight = this.get('minHeight'),
          height    = textBBox ? textBBox.height + 2 * this.get('margin') : 0;
          
      return (height >= minHeight) ? height : minHeight;
    }.property('textBBox').cacheable(),

    renderCallback: function (raphaelCanvas, attrs) {
      return raphaelCanvas.rect().attr(attrs);
    },

    render: function (context, firstTime) {
      var raphaelRect,
          opacity = this.get('isAllSelected') ? this.get('editingOpacity') : this.get('normalOpacity'),
          attrs = {
             'fill':         this.get('fill'),
             'fill-opacity': opacity,
             'stroke-width': this.get('strokeWidth'),
             'stroke':       this.get('stroke'),
             'x':            this.get('x'),
             'y':            this.get('y'),
             'width':        this.get('width'),
             'height':       this.get('height')
          };

      if (firstTime) {
        context.callback(this, this.renderCallback, attrs);
      }
      else {
        raphaelRect = this.get('raphaelObject');
        raphaelRect.attr(attrs);
      }
    } // render

  })
});
