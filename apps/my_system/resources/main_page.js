// ==========================================================================
// Project:   MySystem - mainPage
// Copyright: ©2010 My Company, Inc.
// ==========================================================================
/*globals MySystem LinkIt SCUI */

sc_require('views/node');
sc_require('views/property_editor');

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
        layout: { top: 0, bottom: 0, left: 15 },
        childViews: 'addDecorator addClay addHand addBulb'.w(),

        addDecorator: SC.View.design({
          layout: { left: 20, right: 0, top: 0, height: 23, width: 80 },
          classNames: ['add-decorator']
        }),

        addClay: MySystem.AddButtonView.design({
          // TODO: These should be draggable, but on dropping they should come
          // back to their origin. If dropped on the main canvas, that should
          // fire the addNode controller method with the location of the drop.
          layout: { left: 10, right: 10, top: 33, width: 100, height: 120 },
          classNames: ['add-clay'],
          title: "Clay",
          image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/clay_red_tn.png'
        }),

        addHand: MySystem.AddButtonView.design({
          layout: { left: 10, right: 10, top: 163, width: 100, height: 120 },
          classNames: ['add-hand'],
          image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/hand_tn.png',
          title: "Hand"
        }),

        addBulb: MySystem.AddButtonView.design({
          layout: { left: 10, right: 10, top: 293, width: 100, height: 120 },
          classNames: ['add-bulb'],
          image: 'http://ccmysystem.appspot.com/images/At-Concord-Fall/lightbulb_tn.png',
          title: "Bulb"
        })
      }),
      dividerView: SC.SplitDividerView, // Divider for resizing right/left
      bottomRightView: SC.SplitView.design({ // Rest of app (right)
        defaultThickness: 120,
        layoutDirection: SC.LAYOUT_VERTICAL,
        topLeftView: SC.SplitView.design({ // Story section
          layoutDirection: SC.LAYOUT_HORIZONTAL,
          topLeftView: SC.LabelView.design({ // Assignment story
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
          bottomRightView: SC.View.design({
            childViews: 'toolbar sentencesView'.w(),
            toolbar: SC.ToolbarView.design({
              layout: { top: 0, left: 0, right: 0, height: 30 },
              childViews: 'addButton'.w(),
              anchorLocation: SC.ANCHOR_TOP,
              addButton: SC.ButtonView.design({
                layout: { centerY: 0, height: 20, width: 150 },
                title: "Add sentence to story",
                target: "MySystem.storySentenceController",
                action: "addStorySentence"
              })
            }),
            sentencesView: SC.ScrollView.design({
              hasHorizontalScroller: NO,
              layout: { top: 30, bottom: 0, left: 0, right: 0 },
              backgroundColor: 'white',
              contentView: SC.ListView.design({
                contentBinding: 'MySystem.storySentenceController.arrangedObjects',
                selectionBinding: 'MySystem.storySentenceController.selection',
                contentValueKey: "bodyText",
                rowHeight: 20,
                canEditContent: YES, // isEditable: YES, // FIXME: Neither of these are working
                canDeleteContent: YES
              })
            })
          })
        }),
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

  propertyViewPane: MySystem.PropertyEditorPane.design({})

});
