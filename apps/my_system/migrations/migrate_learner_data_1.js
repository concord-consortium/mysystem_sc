// ==========================================================================
// Project:   MySystem.migrations
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

sc_require('migrations/migrations');

/** @scope MySystem.migrations 
  
    Migrate learner data from format 1 to format 2  
*/
MySystem.migrations.migrateLearnerData1 = function (data) {

  // TODO it would be nice to define these transformations declaratively with a JSONPath type syntax rather than 
  // imperatively
  
  var ret       = SC.copy(data, YES),       // YES => deep copy
      dataNodes = data["MySystem.Node"],
      retNodes  = ret["MySystem.Node"],
      dataLinks = data["MySystem.Link"],
      retLinks  = ret["MySystem.Link"],
      p;
  
  for (p in dataNodes) {
    if (!dataNodes.hasOwnProperty(p)) continue;

    // some versions of version 1 already had no position property
    if(retNodes[p].position){
      delete retNodes[p].position;               // to be replaced by x, y
      retNodes[p].x = dataNodes[p].position.x;
      retNodes[p].y = dataNodes[p].position.y;
    }
    
    delete retNodes[p].transformer;           // no actual students used this field, don't save it for later
    delete retNodes[p].transformations;       // no actual students used this field, don't save it for later
  }
  
  for (p in dataLinks) {
    if (!dataLinks.hasOwnProperty(p)) continue; 

    delete retLinks[p].label;
    delete retLinks[p].isSelected;
  }
  
  ret.version = 2;
  return ret;
};
