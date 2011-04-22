// ==========================================================================
// Project:   MySystem.MergedHashDataSource
// Copyright: ©2011 Concord Consortium
// Author:    Richard Klancer <rpk@pobox.com>
// ==========================================================================
/*globals MySystem */

/** @class

  This data source manages a subset of records in MySystem and reads/writes all record hashes to the single hash
  available as the 'dataHash' property.

  @extends SC.DataSource
*/
MySystem.MergedHashDataSource = SC.DataSource.extend(
/** @scope MySystem.MergedHashDataSource.prototype */ {
  
  /**
    @property
    
    List of recordTypes we handle. Can be set only once, on initialization.
  */
  handledRecordTypes: [],
  
  /**
    @property
    
    The dataHash stores the serialized records we manage.
  */
  dataHash: null,
  
  init: function () {
    sc_super();
    
    // initialize the dataHash property to contain an empty array per handledRecordType
    var handledRecordTypes = this.get('handledRecordTypes'),
        dataHash = {},
        recordType,
        i, len;
        
    for (i = 0, len = handledRecordTypes.get('length'); i < len; i++) {
      recordType = handledRecordTypes.objectAt(i);
      dataHash[recordType.toString()] = {};
    }
    
    this.set('dataHash', dataHash);
  },  
  
  /**
    Returns YES if we manage the passed recordType, NO otherwise.
    
    @param recordType
  */
  handlesType: function (recordType) {
    return this.get('handledRecordTypes').indexOf(recordType) >= 0;
  },

  // ..........................................................
  // QUERY SUPPORT
  // 

  fetch: function (store, query) {
    var recordType = query.get('recordType'),
        recordTypes = query.get('recordTypes'),
        dataHash = this.get('dataHash'),
        recordsById,
        id,
        hashes = [];
        self = this;

    if (recordTypes) { 
      recordTypes.forEach( function (type) {
        if (self.handlesType(type)) throw "MergedHashDataSource does not yet support queries with multiple recordTypes";
      });
      return NO;
    }

    if (!this.handlesType(recordType)) return NO;
    
    // NB: we can get away with indexing by recordType.toString() because we know WISE4 doesn't run in IE
    recordsById = dataHash[recordType.toString()];
    
    if (recordsById) {
      for (id in recordsById) {
        if (!recordsById.hasOwnProperty(id)) continue;
        hashes.push(SC.copy(recordsById[id], YES));
      }
      store.loadRecords(recordType, hashes);
    }
    
    store.dataSourceDidFetchQuery(query);
    return YES;
  },

  // ..........................................................
  // RECORD SUPPORT
  // 
  
  retrieveRecord: function (store, storeKey) {
    var recordType = store.recordTypeFor(storeKey),
        dataHash = this.get('dataHash'),
        recordsById,
        recordHash;
    
    if (!this.handlesType(recordType)) return NO;

    recordsById = dataHash[recordType.toString()];
    
    if (!recordsById) {
      store.dataSourceDidError(storeKey);
      return YES;
    }

    recordHash = recordsById[store.idFor(storeKey)];
      
    if (!recordHash) {
      store.dataSourceDidError(storeKey);
      return YES;
    }
    
    store.dataSourceDidComplete(storeKey, SC.copy(recordHash, YES));
    return YES;
  },
  
  
  createOrUpdateRecord: function (store, storeKey) {
    var recordType = store.recordTypeFor(storeKey),
        dataHash = this.get('dataHash'),
        recordTypeName,
        recordsById;
     
    if (!this.handlesType(recordType)) return NO;
        
    recordTypeName = recordType.toString();
    dataHash[recordTypeName] = dataHash[recordTypeName] || {};
    recordsById = dataHash[recordTypeName];

    // save a deep copy of the record's data hash
    recordsById[store.idFor(storeKey)] = SC.copy(store.readDataHash(storeKey), YES);
    store.dataSourceDidComplete(storeKey);
    return YES;
  },
  
  
  createRecord: function (store, storeKey) {
    return this.createOrUpdateRecord(store, storeKey);
  },
  
  
  updateRecord: function (store, storeKey) {
    return this.createOrUpdateRecord(store, storeKey);
  },
  
  
  destroyRecord: function (store, storeKey) {
    var recordType = store.recordTypeFor(storeKey),
        dataHash = this.get('dataHash');
     
    if (!this.handlesType(recordType)) return NO;
    
    delete dataHash[recordType.toString()][store.idFor(storeKey)];
    store.dataSourceDidDestroy(storeKey);
    return YES;
  }
  
}) ;
