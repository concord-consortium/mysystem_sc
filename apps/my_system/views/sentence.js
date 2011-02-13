// ==========================================================================
// Project:   MySystem.SentenceView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
MySystem.SentenceView = SC.View.extend(
/** @scope MySystem.SentenceView.prototype */ {
  childViews: "sentenceText linkButton".w(),
  classNames: "story-sentence",
  sentenceText: SC.LabelView.design({
    layout: { left: 5, right: 50 },
    valueBinding: '.parentView*content.bodyText',
    canEditContent: YES,
    canDeleteContent: YES,
    isEditable: YES
  }),
  linkButton: SC.ButtonView.design({
    layout: { right: 5, width: 40 },
    titleMinWidth: 45,
    value: NO,
    contentBinding: '.parentView*content',
    buttonBehavior: SC.TOGGLE_BEHAVIOR,
    icon: sc_static('resources/icon_link.gif'),
    toolTip: "Link this sentence with part of the diagram",
    
    pushButton: function() {
      if (this.value) { 
        MySystem.statechart.sendEvent('sentenceDiagramConnect', { 'sentence': this.content });
        this.set('value', NO);
      }
    }.observes('value')
  })
});
