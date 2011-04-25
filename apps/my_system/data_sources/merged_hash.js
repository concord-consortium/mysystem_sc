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
    
    The dataHash stores the serialized records we manage. Read-only.
  */
  dataHash: function () {
    return this._dataHash;
  }.property(),

 
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
    
    this._dataHash = dataHash;
    this.notifyPropertyChange('dataHash');    
  },
  
  /**
    Returns YES if we manage the passed recordType, NO otherwise.
    
    @param recordType
  */
  handlesType: function (recordType) {
    return this.get('handledRecordTypes').indexOf(recordType) >= 0;
  },

  /**
    Override this at will. Called by createRecord, updateRecord, destroyRecord to indicate that the dataHash value has
    changed because of a change to the underlying record in the store.
  */
  dataStoreDidUpdateDataHash: function () {},
  
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
    this.dataStoreDidUpdateDataHash();
    this.notifyPropertyChange('dataHash');
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
    this.dataStoreDidUpdateDataHash();
    this.notifyPropertyChange('dataHash');    
    return YES;
  },
  
  getRecordTypeFromName: function (recordTypeName) {
    return SC.objectForPropertyPath(recordTypeName);
  },
  
  /**
    Set the merged hash to the new value passed. Calls pushRetrieve() and pushDestroy() on the store to and, change, or
    remove records to reflect the difference between the current data hash and the new data hash.
  */
  setDataHash: function (store, newDataHash) {
    var oldDataHash = this.get('dataHash'),
        newDataHashCopy = {},
        recordTypeName,
        recordType,
        id;
    
    // destroys
    for (recordTypeName in oldDataHash) {
      if (!oldDataHash.hasOwnProperty(recordTypeName)) continue;

      recordType = this.getRecordTypeFromName(recordTypeName);
    
      for (id in oldDataHash[recordTypeName]) {
        if (!oldDataHash[recordTypeName].hasOwnProperty(id)) continue;
          
        if (!newDataHash[recordTypeName] || !newDataHash[recordTypeName][id]) {
          store.pushDestroy(recordType, id);
        }
      }
    }
    
    // updates/creates
    for (recordTypeName in newDataHash) {
      if (!newDataHash.hasOwnProperty(recordTypeName)) continue;
      
      recordType = this.getRecordTypeFromName(recordTypeName);
      
      if (!this.handlesType(recordType)) continue;
      
      newDataHashCopy[recordTypeName] = {};
      
      for (id in newDataHash[recordTypeName]) {
        if (!newDataHash[recordTypeName].hasOwnProperty(id)) continue;
        
        store.pushRetrieve(recordType, id, SC.copy(newDataHash[recordTypeName][id], YES));
        newDataHashCopy[recordTypeName][id] = SC.copy(newDataHash[recordTypeName][id], YES);
      }
    }
    
    this._dataHash = newDataHashCopy;
    this.notifyPropertyChange('dataHash');    
  }
  
});