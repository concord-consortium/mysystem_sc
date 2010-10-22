// ==========================================================================
// Project:   MySystem.transformationsController
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  This controller drives the Transformation Builder pane. The builder is a
  LinkIt canvas with energy flow types (colors, actually) as nodes and 
  MySystem.Transformations as links. 

  @extends SC.Object
*/
MySystem.transformationsController = SC.ArrayController.create(
/** @scope MySystem.transformationsController.prototype */ {

  openTransformationBuilder: function(node) {
    MySystem.nodesController.deselectObject(node);
    var transformationBuilder = MySystem.getPath('mainPage.transformationBuilderPane');
    if (!transformationBuilder.isPaneAttached) {
      transformationBuilder.append();
    }
    transformationBuilder.set('node', node);
  },

  closeTransformationBuilder: function() {
    var transformationBuilder = MySystem.getPath('mainPage.transformationBuilderPane');
    var node = transformationBuilder.get('node');
    if (transformationBuilder.isPaneAttached) {
      transformationBuilder.remove();
    }
    transformationBuilder.set('node', null);
    MySystem.nodesController.selectObject(node);
  }

}) ;
