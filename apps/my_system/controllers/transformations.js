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

  selectedLinksBinding: "MySystem.transformationsCanvasView.selectedLinks",

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
    canvas.linksDidChange();
  },

  openTransformationAnnotater: function(transformation) {
    var transformationAnnotater = MySystem.getPath('mainPage.transformationAnnotaterPane');
    transformationAnnotater.set('transformation', transformation);
    if (!transformationAnnotater.isPaneAttached) {
      transformationAnnotater.append();
    }
  },

  closeTransformationAnnotater: function() {
    var transformationAnnotater = MySystem.getPath('mainPage.transformationAnnotaterPane');
    if (transformationAnnotater.isPaneAttached) {
      transformationAnnotater.remove();
    }
  },

  linkSelectionMonitor: function() {
    if (this.get('selectedLinks').get('length') > 0) {
      MySystem.getPath('mainPage.transformationBuilderPane.contentView.annotateButton').set('isEnabled', YES);
    } else {
      MySystem.getPath('mainPage.transformationBuilderPane.contentView.annotateButton').set('isEnabled', NO);
    }
  }.observes('selectedLinks'),

  annotate: function() {
    var selectedTransformation = this.get('selectedLinks').firstObject().model;
    if (selectedTransformation.get('annotation') === null) {
      selectedTransformation.set('annotation', MySystem.storySentenceController.addStorySentenceNoEdit());
    }
    this.openTransformationAnnotater(selectedTransformation);

    // Activate the editor once the UI repaints
    this.invokeLater(function() {
      MySystem.transformationAnnotaterPane.get('contentView').get('storySentenceField').beginEditing();
    });
  }
}) ;
