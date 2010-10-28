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
		var canvas = transformationBuilder.get('contentView').get('childViews').objectAt(2);
    this.set('content', node.get('colorObjects'));
    transformationBuilder.set('node', node);
    if (!transformationBuilder.isPaneAttached) {
      transformationBuilder.append();
    }
  },

  closeTransformationBuilder: function() {
    var transformationBuilder = MySystem.getPath('mainPage.transformationBuilderPane');
		var canvas = transformationBuilder.get('contentView').get('childViews').objectAt(2);
    var node = transformationBuilder.get('node');
    if (transformationBuilder.isPaneAttached) {
      transformationBuilder.remove();
    }
    transformationBuilder.set('node', null);
		this.set('content', []);
    MySystem.nodesController.selectObject(node);
  }
}) ;
