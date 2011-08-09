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
    this.addSizeClassName(dataSource, context);

    var theme = dataSource.get('theme');
    
    var isSelected = dataSource.get('isSelected'),
        width = dataSource.get('width'),
        color = dataSource.get('color'),
        labelId = SC.guidFor(dataSource) + '-label';

    context.setClass({
      active: dataSource.get('isActive'),
      mixed: dataSource.get('isMixed'),
      sel: dataSource.get('isSelected'),
      disabled: !dataSource.get('isEnabled')
    });

    //accessing accessibility
    context.attr('role', 'radio');
    context.attr('aria-checked', isSelected);
    context.attr('aria-labelledby', labelId);
    context.attr('aria-disabled', dataSource.get('isEnabled') ? 'false' : 'true');

    if (width) context.css('width', width);

    if (color) {
      context.css('background-color', color);
      context.css('color', "#FFFFFF");
    }

    context.css('font-weight', 'bold');
    context.push('<span class = "button"></span>');

    context = context.begin('span').addClass('sc-button-label').id(labelId);
    theme.labelRenderDelegate.render(dataSource, context);
    context = context.end();
  },

  update: function(dataSource, jquery) {
    this.updateSizeClassName(dataSource, jquery);

    var theme = dataSource.get('theme');

    var isSelected = dataSource.get('isSelected'),
        width = dataSource.get('width'),
        color = dataSource.get('color'),
        value = dataSource.get('value');

    jquery.setClass({
      active: dataSource.get('isActive'),
      mixed: dataSource.get('isMixed'),
      sel: dataSource.get('isSelected'),
      disabled: !dataSource.get('isEnabled')
    });

    jquery.attr('aria-disabled', dataSource.get('isEnabled') ? 'false' : 'true');
    jquery.attr('aria-checked', isSelected);
    jquery.css('width', width ? width : null);
    jquery.css('background-color', color ? color : null);
    jquery.css('color', color ? "#FFFFFF" : null);

    theme.labelRenderDelegate.update(dataSource, jquery.find('.sc-button-label'));
  }
});
