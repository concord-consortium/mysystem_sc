// ==========================================================================
// Project:   MySystem - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem LinkIt SCUI */

sc_require('views/node');

// This page describes the main user interface for your application.  
MySystem.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    childViews: 'systemView'.w(),
    
    systemView: LinkIt.CanvasView.design( SCUI.Cleanup, {
      contentBinding: SC.Binding.from('MySystem.nodesController').oneWay(),
      selectionBinding: 'MySystem.nodesController.selection',
      exampleView: MySystem.NodeView
    })
  })

});
