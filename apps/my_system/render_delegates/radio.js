// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  Renders and updates the DOM representation of a radio button (a single button,
  not the group).
  
  Expected Properties
  -----------------------------------
  
   - `isSelected`
   - `isActive`
   - `isMixed`
   - `isEnabled`
   - `title`
  
  Optional Properties
  -----------------------------------
  
   - `width` -- an optional width of the radio button
   - `labelRenderDelegate` properties
  
*/
sc_require('theme');

MySystem.Theme.radioRenderDelegate = SC.RenderDelegate.create({
  className: 'radio',
  
  render: function(dataSource, context) {
    var color = dataSource.get('color');

    if (color) {
      context.css('background-color', color);
      context.css('color', "#FFFFFF");
    }

    context.css('font-weight', 'bold');

    // delegate the rest of the handling to the original
    // radioRenderDelegate
    SC.BaseTheme.radioRenderDelegate.render(dataSource, context);
  },

  update: function(dataSource, jquery) {
    var color = dataSource.get('color');
    jquery.css('background-color', color ? color : null);
    jquery.css('color', color ? "#FFFFFF" : null);

    SC.BaseTheme.radioRenderDelegate.update(dataSource, jquery);
  }
});
