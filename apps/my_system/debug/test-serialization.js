/*globals MySystem */

// Quick hand-test of whether nodes can be serialized and unserialized. Not meant to be permanent. 
// Richard Klancer <rpk@pobox.com> 4-15-2011
// updated 4-21-2011 to generate json in the format needed by MergedHashesDataSource

var stateAsJsonString;
var stateForNewDataSource;


function saveState() {
  var store = MySystem.store,
      jsObjects;
  
  function serialize(rec) {
    return rec.get('store').readDataHash(rec.get('storeKey'));
  }
  
  jsObjects = {
    links:          store.find(MySystem.Link).map( serialize ),
    nodes:          store.find(MySystem.Node).map( serialize ),
    stories:        store.find(MySystem.Story).map( serialize ),
    storySentences: store.find(MySystem.StorySentence).map( serialize )
  };
  
  stateAsJsonString = JSON.stringify(jsObjects, null, 2);
}


function clearState() {
  var store = MySystem.store;
  
  function destroyRecs(recs) {
    var i, rec, asString, 
        recsArray = recs.map( function (rec) { return rec; } );
    
    for (i = 0; i < recsArray.length; i++) {
      rec = recsArray[i];
      asString = rec.toString();
      try {
        SC.run( function () { rec.destroy(); });
        console.log("destroyed: %s", asString);
      }
      catch (e) {
        console.error('error caught: %s', e.toString ? e.toString() : e);
      }
    }
  }

  destroyRecs(store.find(MySystem.Link));
  destroyRecs(store.find(MySystem.Node));
  destroyRecs(store.find(MySystem.Story));
  destroyRecs(store.find(MySystem.StorySentence));
  
  store.commitRecords();
}


function restoreState() {
  var store = MySystem.store,
      s     = JSON.parse(stateAsJsonString);
  
  s.storySentences.forEach( function (hash) {
    store.pushRetrieve(MySystem.StorySentence, hash.guid, hash);
  });
  
  s.stories.forEach( function (hash) {
    store.pushRetrieve(MySystem.Story, hash.guid, hash);
  });
  
  s.links.forEach( function (hash) {
    store.pushRetrieve(MySystem.Link, hash.guid, hash);
  });
  
  s.nodes.forEach( function (hash) {
    store.pushRetrieve(MySystem.Node, hash.guid, hash);
  });

  SC.run();
}

function saveStateForNewDataSource() {
  var store = MySystem.store,
      jsObjects;
  
  function hashesFor(records) {
    var ret = {},
        i, len, rec;
        
    for(i = 0, len = records.get('length'); i < len; i++) {
      rec = records.objectAt(i);
      ret[rec.get('id')] = store.readDataHash(rec.get('storeKey'));
    }

    return ret;
  }
  
  jsObjects = {
    "MySystem.Link":           hashesFor(store.find(MySystem.Link)),
    "MySystem.Node":           hashesFor(store.find(MySystem.Node)),
    "MySystem.Story":          hashesFor(store.find(MySystem.Story)),
    "MySystem.StorySentence":  hashesFor(store.find(MySystem.StorySentence))
  };
  
  stateForNewDataSource = JSON.stringify(jsObjects, null, 2);
}
