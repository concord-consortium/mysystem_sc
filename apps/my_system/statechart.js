// ==========================================================================
// Project:   MySystem.SentenceView
// Copyright: ©2010 Concord Consortium
// @author    Parker Morse <pmorse@cantinaconsulting.com>
// ==========================================================================
/*globals MySystem Ki */

MySystem.statechart = Ki.Statechart.create({
  rootState: Ki.State.design({
    
    initialSubstate: 'diagramEditing',
    
    diagramEditing: Ki.State.design({
      
    }),
    
    diagramObjectEditing: Ki.State.design({
      
    }),
    
    sentenceEditing: Ki.State.design({
      
    }),
    
    sentenceObjectLinking: Ki.State.design({
      
    })
  })
});