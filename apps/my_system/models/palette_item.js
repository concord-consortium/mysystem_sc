// ==========================================================================
// Project:   MySystem.PaletteItem
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  Describes an option for the left-size menu of nodes which can be added to the diagram.

  @extends SC.Record
  @version 0.1
*/
MySystem.PaletteItem = SC.Record.extend(
/** @scope MySystem.PaletteItem.prototype */ {

  /** 
    A path to the icon to be displayed in the menu item. This icon will also be used by
    the nodes created from this menu item.
    
    @property {String}
  */
  image: SC.Record.attr(String),
  
  /**
    The string to display below the icon. This will also be inherited by the nodes created
    from this menu item.
    
    @property {String}
  */
  title: SC.Record.attr(String)

}) ;
