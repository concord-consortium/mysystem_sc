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
	childViews: 'topView'.w(),
		topView: SC.SplitView.design({
			defaultThickness: 120,
			topLeftView: SC.LabelView.design({ // Node Palette (left)
				layout: { top: 0, bottom: 0, left: 0 },
				anchorLocation: SC.ANCHOR_LEFT,
				textAlign: SC.ALIGN_LEFT,
				fontWeight: SC.BOLD_WEIGHT,
				backgroundColor: '#F2F2F2',
				value: "Placeholder for node palette",
				canCollapse: YES
			}),
			dividerView: SC.SplitDividerView, // Divider for resizing right/left
			bottomRightView: SC.SplitView.design({ // Rest of app (right)
				defaultThickness: 120,
				layoutDirection: SC.LAYOUT_VERTICAL,
				topLeftView: SC.LabelView.design({ // Story section
					layout: { top: 0, right: 0, left: 0 },
					anchorLocation: SC.ANCHOR_TOP,
					textAlign: SC.ALIGN_LEFT,
					backgroundColor: '#CCCCFF',
					tagName: "div",
					escapeHTML: NO,
					valueBinding: 'MySystem.storyController.content.storyHtml',
					canCollapse: YES
				}),
				dividerView: SC.SplitDividerView, // Divider for resizing up/down
		    bottomRightView: LinkIt.CanvasView.design( SCUI.Cleanup, { // Workspace
					layout: { top: 120, left: 0, right: 0, bottom: 0 },
		      contentBinding: SC.Binding.from('MySystem.nodesController').oneWay(),
		      selectionBinding: 'MySystem.nodesController.selection',
		      exampleView: MySystem.NodeView
		    })
			})
		})
  })

});
