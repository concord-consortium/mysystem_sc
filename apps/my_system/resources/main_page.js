// ==========================================================================
// Project:   MySystem - mainPage
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem LinkIt SCUI */

sc_require('views/node');
sc_require('views/node_palette');
sc_require('views/sentence');
sc_require('views/sentence_connect_pane');

// This page describes the main user interface for your application.  
MySystem.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    defaultResponder: 'MySystem.statechart',
    childViews: 'topView'.w(),
    
    canvasView: SC.outlet('topView.bottomRightView.bottomRightView'),
    
    topView: SC.SplitView.design({
      defaultThickness: 140,
      topLeftView: SC.ScrollView.design({
        contentView: MySystem.NodePaletteView.design({
          layout: { top: 0, bottom: 0, left: 0 }
        }) 
      }),
      dividerView: SC.SplitDividerView, // Divider for resizing right/left
      bottomRightView: SC.SplitView.design({ // Rest of app (right)
        defaultThickness: 150,
        layoutDirection: SC.LAYOUT_VERTICAL,
        topLeftView: MySystem.InstructionView, // Top instructions
        dividerView: SC.SplitDividerView, // Divider for resizing up/down
        bottomRightView: MySystem.CanvasView.design({
          layout: { top: 120, left: 0, right: 0, bottom: 0 },
          contentBinding: SC.Binding.from('MySystem.nodesController'),
          selectionBinding: 'MySystem.nodesController.selection',
          linkSelectionBinding: 'MySystem.nodesController.linkSelection',
          exampleView: MySystem.NodeView
        })
      })
    })
  }),

  inspectorPane: MySystem.InspectorPane,

  sentenceLinkPane: MySystem.SentenceConnectPane,

  transformationBuilderPane: MySystem.TransformationBuilderPane.design({}),

  transformationAnnotaterPane: MySystem.TransformationAnnotationPane.design({})
});
