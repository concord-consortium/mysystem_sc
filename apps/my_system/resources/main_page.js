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
			topLeftView: SC.View.design({ // Node Palette (left)
				layout: { top: 0, bottom: 0, left: 0 },
	      childViews: 'addDecorator addClay addHand addBulb'.w(),

	      addDecorator: SC.View.design({
	        layout: { left: 0, right: 0, top: 0, height: 23 },
	        classNames: ['add-decorator']
	      }),

	      addClay: MySystem.AddButtonView.design({
	        layout: { left: 0, right: 0, top: 23, height: 65 },
	        classNames: ['add-clay'],
	        title: "Clay",
	        target: MySystem.nodesController,
	        action: 'addClay'
	      }),

	      addHand: MySystem.AddButtonView.design({
	        layout: { left: 0, right: 0, top: 88, height: 66 },
	        classNames: ['add-hand'],
	        title: "Hand",
	        target: MySystem.nodesController,
	        action: 'addHand'
	      }),

	      addBulb: MySystem.AddButtonView.design({
	        layout: { left: 0, right: 0, top: 154, height: 68 },
	        classNames: ['add-bulb'],
	        title: "Bulb",
	        target: MySystem.nodesController,
	        action: 'addBulb'
	      })
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
