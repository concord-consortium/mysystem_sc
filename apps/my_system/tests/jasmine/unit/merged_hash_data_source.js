/*globals MySystem defineJasmineHelpers describe it expect xit xdescribe beforeEach afterEach spyOn runs waits waitsFor runAfterEach runBeforeEach */

defineJasmineHelpers();

describe("MergedHashDataSource", function () {

  var dataSource;

  describe("an instance", function () {

    beforeEach( function () {
      dataSource = MySystem.MergedHashDataSource.create();
    });

    it("should be a DataSource", function () {
      expect(dataSource).toBeA(SC.DataSource);
    });
  });


  describe("handlesType() method", function () {

    var handledRecordType    = SC.Record.extend(),
        notHandledRecordType = SC.Record.extend();

    beforeEach( function () {
      dataSource = MySystem.MergedHashDataSource.create({
        handledRecordTypes: [handledRecordType]
      });
    });

    it("should return YES for handledRecordType", function () {
      expect( dataSource.handlesType(handledRecordType) ).toEqual(YES);
    });

    it("should return NO for notHandledRecordType", function () {
      expect( dataSource.handlesType(notHandledRecordType) ).toEqual(NO);
    });

  });

  describe("Given handled types MyApp.HandledRecordType1, MyApp.HandledRecordType2, and and not-handled type MyApp.NotHandledRecordType", function () {
    var handledRecordType1, handledRecordType2, notHandledRecordType;

    beforeEach( function () {
      handledRecordType1 = MySystem.AutoGuidRecord.extend();
      handledRecordType1._object_className = "MyApp.HandledRecordType1"; // normally set by SC on app init

      handledRecordType2 = MySystem.AutoGuidRecord.extend();
      handledRecordType2._object_className = "MyApp.HandledRecordType2";

      notHandledRecordType = MySystem.AutoGuidRecord.extend();
      notHandledRecordType._object_className = "MyApp.NotHandledRecordType";

      dataSource = MySystem.MergedHashDataSource.create({
        handledRecordTypes: [handledRecordType1, handledRecordType2]
      });

      spyOn(dataSource, 'getRecordTypeFromName').andCallFake(function (recordTypeName) {
        if (recordTypeName === "MyApp.HandledRecordType1") return handledRecordType1;
        if (recordTypeName === "MyApp.HandledRecordType2") return handledRecordType2;
        if (recordTypeName === "MyApp.NotHandledRecordType") return notHandledRecordType;
        throw "record type not understood: " + recordTypeName;
      });
    });

    describe("the initial value of the dataHash property", function () {

      var dataHash;

      beforeEach( function () {
        dataHash = dataSource.get('dataHash');
      });

      it("should have a key for each handled record type", function () {
        expect(dataHash["MyApp.HandledRecordType1"]).toBeDefined();
        expect(dataHash["MyApp.HandledRecordType2"]).toBeDefined();
      });

      it("should not have a key for not-handled record types", function () {
        expect(dataHash["MyApp.NotHandledRecordType"]).not.toBeDefined();
      });

      describe("The value of dataHash['MyApp.HandledRecordType1']", function () {

        var value;

        beforeEach( function () {
          value = dataHash["MyApp.HandledRecordType1"];
        });

        it("should be an empty datahash", function () {
          expect(value).toEqual({});
        });

        it("should not be the same object as dataHash['MyApp.HandledRecordType2']", function () {
          expect(value).not.toBe(dataHash["MyApp.HandledRecordType2"]);
        });
      });
    });

    describe('the dataHash property', function () {

      it("should be read-only", function () {
        expect(dataSource.get('dataHash')).not.toEqual({});
        dataSource.set('dataHash', {});
        expect(dataSource.get('dataHash')).not.toEqual({});
      });
    });

    describe("methods called by the data store", function () {

      var store;

      beforeEach( function () {
        store = SC.Object.create({
          recordTypeFor: function () {},
          idFor: function () {},
          readDataHash: function () {},
          loadRecords: function () {},
          dataSourceDidComplete: function () {},
          dataSourceDidFetchQuery: function () {},
          dataSourceDidDestroy: function () {},
          dataSourceDidError: function () {}
        });
      });

      describe("fetch() method", function () {

        var query;

        beforeEach( function () {
          query = SC.Object.create();
        });

        describe("when the query's recordType is not one that the data source handles", function () {

          it("should return NO", function () {
            query.recordType = notHandledRecordType;
            expect( dataSource.fetch(store, query) ).toEqual(NO);
          });
        });

        describe("when the query's recordType is one that the data source handles", function () {

          var firstRecordHash =  { which: 'first record', nestedObj: { key: 'value' } },
              secondRecordHash = { which: 'second record', nestedObj: { key: 'value' } },
              returnValue;

          beforeEach( function () {
            dataSource._dataHash = {
              "MyApp.HandledRecordType1": {
                "firstRecord": firstRecordHash,
                "secondRecord": secondRecordHash
              }
            };
          });

          describe("when there are records of the query's recordType in the hash", function () {

            beforeEach( function () {
              query.recordType = handledRecordType1;
              spyOn(store, 'loadRecords');
              spyOn(store, 'dataSourceDidFetchQuery');

              returnValue = dataSource.fetch(store, query);
            });

            it("should call store.loadRecords, specifying the correct recordType", function () {
              expect(store.loadRecords.mostRecentCall.args[0]).toBe(query.recordType);
            });

            describe("the array of hashes passed to store.loadRecords", function () {

              it("should contain a deep copy of the first record hash", function () {
                var hash = store.loadRecords.mostRecentCall.args[1][0];

                if (hash.which !== 'first record') hash = store.loadRecords.mostRecentCall.args[1][1];

                expect(hash).toEqual(firstRecordHash);
                expect(hash).not.toBe(firstRecordHash);
                expect(hash.nestedObj).not.toBe(firstRecordHash.nestedObj);
              });

              it("should contain a deep copy of the second record hash", function () {
                var hash = store.loadRecords.mostRecentCall.args[1][0];

                if (hash.which !== 'second record') hash = store.loadRecords.mostRecentCall.args[1][1];

                expect(hash).toEqual(secondRecordHash);
                expect(hash).not.toBe(secondRecordHash);
                expect(hash.nestedObj).not.toBe(secondRecordHash.nestedObj);
              });

            });

            it("should call store.dataSourceDidFetchQuery with the passed query object", function () {
              expect(store.dataSourceDidFetchQuery).toHaveBeenCalledWith(query);
            });

            it("should return YES", function () {
              expect(returnValue).toEqual(YES);
            });
          });

          describe("when there are no records of the query's recordType in the hash", function () {

            beforeEach( function () {
              query.recordType = handledRecordType2;
              spyOn(store, 'loadRecords');
              spyOn(store, 'dataSourceDidFetchQuery');

              returnValue = dataSource.fetch(store, query);
            });

            it("should not call loadRecords", function () {
              expect(store.loadRecords).not.toHaveBeenCalled();
            });

            it("should call store.dataSourceDidFetchQuery with the passed query object", function () {
              expect(store.dataSourceDidFetchQuery).toHaveBeenCalledWith(query);
            });

            it("should return YES", function () {
              expect(returnValue).toEqual(YES);
            });
          });
        });
      });

      describe("retrieveRecord() method", function () {

        describe("when the record type is not handled", function () {

          it("should return NO", function () {
            spyOn(store, 'recordTypeFor').andReturn(notHandledRecordType);
            expect( dataSource.retrieveRecord(store, 1) ).toEqual(NO);
          });
        });

        describe("when the record type is handled", function () {

          var recordHash = { nestedObj: { key: "value" } },
              returnValue;

          beforeEach( function () {
            dataSource._dataHash = {
              "MyApp.HandledRecordType1": {
                "recordIdInHash": recordHash
              }
            };
          });

          describe("and the record type is not found in the dataHash property", function () {

            beforeEach( function () {
              spyOn(store, 'recordTypeFor').andReturn(handledRecordType2);
              spyOn(store, 'dataSourceDidError');
              returnValue = dataSource.retrieveRecord(store, 12345);
            });

            it("should call store.dataSourceDidError with the passed storeKey", function () {
              expect(store.dataSourceDidError).toHaveBeenCalledWith(12345);
            });

            it("should return YES", function () {
              expect(returnValue).toEqual(YES);
            });
          });

          describe("and the record type is found in the dataHash property", function () {

            beforeEach( function () {
              spyOn(store, 'recordTypeFor').andReturn(handledRecordType1);
              spyOn(store, 'dataSourceDidComplete');
              spyOn(store, 'dataSourceDidError');
            });

            describe("and the record id is not found in the record hashes", function () {

              beforeEach( function () {
                spyOn(store, 'idFor').andReturn('recordIdNotInHash');
                returnValue = dataSource.retrieveRecord(store, 23456);
              });

              it("should call store.dataSourceDidError with the passed storeKey", function () {
                expect(store.dataSourceDidError).toHaveBeenCalledWith(23456);
              });

              it("should return YES", function () {
                expect(returnValue).toEqual(YES);
              });
            });

            describe("and the record id is found in the record hashes", function () {

              beforeEach( function () {
                spyOn(store, 'idFor').andReturn('recordIdInHash');
                returnValue = dataSource.retrieveRecord(store, 34567);
              });

              it("should call store.dataSourceDidComplete with the passed storeKey", function () {
                expect(store.dataSourceDidComplete.mostRecentCall.args[0]).toEqual(34567);
              });

              it("should call store.dataSourceComplete with a deep copy of the record hash", function () {
                expect(store.dataSourceDidComplete.mostRecentCall.args[1]).toEqual(recordHash);
                expect(store.dataSourceDidComplete.mostRecentCall.args[1].nestedObj).not.toBe(recordHash.nestedObj);
              });

              it("should return YES", function () {
                expect(returnValue).toEqual(YES);
              });
            });
          });
        });
      });

      describe("createOrUpdateRecord() method", function () {

        describe("when the record type is not handled", function () {

          it("should return NO", function () {
            spyOn(store, 'recordTypeFor').andReturn(notHandledRecordType);
            expect( dataSource.createOrUpdateRecord(store, 1) ).toEqual(NO);
          });
        });

        describe("when the record type is handled", function () {

          var preexistingRecordHash = { key: "value" },
              newRecordHash         = { nestedKey: { key: "value" } },
              returnValue,
              recordsHash,
              itShouldSaveTheDataHash;

          beforeEach( function () {
            dataSource._dataHash = {
              "MyApp.HandledRecordType1": {
                "preexistingRecord": preexistingRecordHash
              }
            };
            spyOn(store, 'dataSourceDidComplete');
            spyOn(dataSource, 'dataStoreDidUpdateDataHash');
          });

          itShouldSaveTheDataHash = function () {

            it("should pass the storeKey to recordTypeFor", function () {
              expect(store.recordTypeFor).toHaveBeenCalledWith(12345);
            });

            it("should pass the storeKey to idFor", function () {
              expect(store.idFor).toHaveBeenCalledWith(12345);
            });

            it("should pass the storeKey to readDataHash", function () {
              expect(store.readDataHash).toHaveBeenCalledWith(12345);
            });

            it("should call store.dataSourceDidComplete with the storeKey", function () {
              expect(store.dataSourceDidComplete).toHaveBeenCalledWith(12345);
            });

            it("should call its dataStoreDidUpdateDataHash method", function () {
              expect(dataSource.dataStoreDidUpdateDataHash).toHaveBeenCalled();
            });

            it("shoud return YES", function () {
              expect(returnValue).toEqual(YES);
            });

            describe("the records hash for the record type of the passed record", function () {

              it("should have an entry for the record id", function () {
                expect( recordsHash.recordIdForNewRecord ).toBeDefined();
              });

              describe("the new record hash under the new record id", function () {

                it("should be equal in value to the hash returned by store.readDataHash", function () {
                  expect( recordsHash.recordIdForNewRecord ).toEqual(newRecordHash);
                });

                it("should be a deep copy of the hash returned by store.readDataHash()", function () {
                  expect( recordsHash.recordIdForNewRecord ).not.toBe(newRecordHash);
                  expect( recordsHash.recordIdForNewRecord.nestedKey ).not.toBe(newRecordHash.nestedKey);
                });
              });
            });
          };

          describe("and the record type is not found in the dataHash property", function () {

            beforeEach( function () {
              spyOn(store, 'recordTypeFor').andReturn(handledRecordType2);
              spyOn(store, 'idFor').andReturn('recordIdForNewRecord');
              spyOn(store, 'readDataHash').andReturn(newRecordHash);
              returnValue = dataSource.createOrUpdateRecord(store, 12345);

              recordsHash = dataSource.get('dataHash')['MyApp.HandledRecordType2'];
            });

            it("should create an entry for the new record type in the dataHash", function () {
              expect(dataSource.get('dataHash')['MyApp.HandledRecordType2']).toBeDefined();
            });

            itShouldSaveTheDataHash();
          });

          describe("and the record type is found in the dataHash property", function () {

            beforeEach( function () {
              spyOn(store, 'recordTypeFor').andReturn(handledRecordType1);
              spyOn(store, 'idFor').andReturn('recordIdForNewRecord');
              spyOn(store, 'readDataHash').andReturn(newRecordHash);
              returnValue = dataSource.createOrUpdateRecord(store, 12345);

              recordsHash = dataSource.get('dataHash')['MyApp.HandledRecordType1'];
            });

            it("should not over- or re-write the other records in the existing records hash", function () {
              expect(recordsHash.preexistingRecord).toBe(preexistingRecordHash);
            });

            itShouldSaveTheDataHash();
          });
        });
      });

      describe("createRecord() and updateRecord() methods", function () {
        var store = {},
            returnValue;

        function itShouldPassThroughToCreateOrUpdateRecord() {
          it("should pass its arguments to createOrUpdateRecord", function () {
            expect(dataSource.createOrUpdateRecord).toHaveBeenCalledWith(store, 123);
          });

          it("should return the value returned by createOrUpdateRecord", function () {
            expect(returnValue).toEqual('value from createOrUpdateRecord');
          });
        }

        beforeEach( function () {
          spyOn(dataSource, 'createOrUpdateRecord').andReturn('value from createOrUpdateRecord');
        });

        describe('createRecord()', function () {
          beforeEach( function () {
            returnValue = dataSource.createRecord(store, 123);
          });

          itShouldPassThroughToCreateOrUpdateRecord();
        });

        describe('updateRecord() method', function () {
          beforeEach( function () {
            returnValue = dataSource.updateRecord(store, 123);
          });

          itShouldPassThroughToCreateOrUpdateRecord();
        });
      });

      describe("destroyRecord() method", function () {
        describe("when the record type is not handled", function () {

          it("should return NO", function () {
            spyOn(store, 'recordTypeFor').andReturn(notHandledRecordType);
            expect( dataSource.createOrUpdateRecord(store, 1) ).toEqual(NO);
          });
        });

        describe("when the record type is handled", function () {

          var recordToKeepHash =      { key: 'value' },
              otherRecordToKeepHash = { key: 'value' },
              updatedDataHash,
              returnValue;

          beforeEach( function () {
            dataSource._dataHash = {
              "MyApp.HandledRecordType1": {
                "recordToKeep": recordToKeepHash,
                "recordToDelete": { key: 'value' }
              },
              "MyApp.HandledRecordType2": {
                "otherRecordToKeep": otherRecordToKeepHash
              }
            };

            spyOn(store, 'recordTypeFor').andReturn(handledRecordType1);
            spyOn(store, 'idFor').andReturn('recordToDelete');
            spyOn(store, 'dataSourceDidDestroy');
            spyOn(dataSource, 'dataStoreDidUpdateDataHash');

            returnValue = dataSource.destroyRecord(store, 23456);
            updatedDataHash = dataSource.get('dataHash');
          });

          it("should pass the storeKey to store.recordTypeFor", function () {
            expect(store.recordTypeFor).toHaveBeenCalledWith(23456);
          });

          it("should pass the storeKey to store.idFor", function () {
            expect(store.idFor).toHaveBeenCalledWith(23456);
          });

          it("should delete the hash for the recordToDelete", function () {
            expect( updatedDataHash["MyApp.HandledRecordType1"].recordToDelete ).not.toBeDefined();
          });

          it("should not touch the hash for the other record with the same type", function () {
            expect( updatedDataHash["MyApp.HandledRecordType1"].recordToKeep ).toBe(recordToKeepHash);
          });

          it("should not touch the hash for the record of the other type", function () {
            expect( updatedDataHash["MyApp.HandledRecordType2"].otherRecordToKeep ).toBe( otherRecordToKeepHash);
          });

          it("should call store.dataSourceDidDestroy with the passed storeKey", function () {
            expect(store.dataSourceDidDestroy).toHaveBeenCalledWith(23456);
          });

          it("should call its dataStoreDidUpdateDataHash method", function () {
            expect(dataSource.dataStoreDidUpdateDataHash).toHaveBeenCalled();
          });

          it("should return YES", function () {
            expect( returnValue ).toEqual(YES);
          });
        });
      });
    });

    describe("setDataHash method", function () {

      var store,
          newDataHash;

      beforeEach( function () {
        store = SC.Object.create({
          pushRetrieve: function () {},
          pushDestroy: function () {}
        });
        spyOn(store, 'pushRetrieve');
        spyOn(store, 'pushDestroy');
      });

      describe("when the passed hash contains records of a record type the data source does not handle", function () {

        beforeEach( function () {
          newDataHash = {
            "MyApp.HandledRecordType1": {
              "id of record of handled type": { key: "value" }
            },
            "MyApp.NotHandledRecordType": {
              "id of record of not-handled type": { key: "value" }
            }
          };

          dataSource.setDataHash(store, newDataHash);
        });

        it("should call pushRetrieve only for the records of the type it does handle", function () {
          expect(store.pushRetrieve.callCount).toEqual(1);
          expect(store.pushRetrieve.mostRecentCall.args).toEqual([handledRecordType1, "id of record of handled type", { key: "value" } ]);
        });

        it("should copy only the handled record type to its dataHash", function () {
          expect(dataSource.get('dataHash')).toEqual({
            "MyApp.HandledRecordType1": newDataHash["MyApp.HandledRecordType1"]
          });
        });
      });

      describe("when the passed hash contains only records of types the data source does handle", function () {

        var oldDataHash;

        describe("for those (record type, id) pairs in the passed hash that are not currently in the data source's dataHash", function () {

          beforeEach( function () {
            oldDataHash = {
              "MyApp.HandledRecordType1": {
              }
            };
            dataSource._dataHash = oldDataHash;
          });

          describe("when the new datahash contains an id of the same record type already found in the old datahash", function () {

            var newRecordHash = { nestedField: { key: "value" } };

            beforeEach( function () {
              newDataHash = {
                "MyApp.HandledRecordType1": {
                  "id only in new datahash": newRecordHash
                }
              };
              dataSource.setDataHash(store, newDataHash);
            });

            it("should call pushRetrieve with the new record", function () {
              expect(store.pushRetrieve).toHaveBeenCalled();
              expect(store.pushRetrieve.mostRecentCall.args).toEqual([handledRecordType1, "id only in new datahash", newRecordHash ]);
            });

            describe("the hash passed to pushRetrieve", function () {

              it("should be a deep copy of the passed-in hash", function () {
                var nestedFieldPassedToRetrieve = store.pushRetrieve.mostRecentCall.args[2]['nestedField'],
                    nestedFieldPassedIn = newRecordHash['nestedField'];

                expect(nestedFieldPassedToRetrieve).toEqual(nestedFieldPassedIn);
                expect(nestedFieldPassedToRetrieve).not.toBe(nestedFieldPassedIn);

              });
            });
          });

          describe("when the new datahash contains a record type not found in the old datahash", function () {

            beforeEach( function () {
              newDataHash =  {
                "MyApp.HandledRecordType2": {
                  "id and record type only in new datahash": { key: "value" }
                }
              };
              dataSource.setDataHash(store, newDataHash);
            });

            it("should call pushRetrieve with the new record", function () {
              expect(store.pushRetrieve).toHaveBeenCalled();
              expect(store.pushRetrieve.mostRecentCall.args).toEqual([handledRecordType2, "id and record type only in new datahash", { key: "value"}]);
            });
          });
        });

        describe("for those (record type, id) pairs in the passed hash that are already in the data source's dataHash", function () {

          beforeEach( function () {
            oldDataHash = {
              "MyApp.HandledRecordType1": {
                "id in both old and new datahashes": { key: "old value" }
              }
            };
            newDataHash = {
              "MyApp.HandledRecordType1": {
                "id in both old and new datahashes": { key: "new value" }
              }
            };
            dataSource._dataHash = oldDataHash;
            dataSource.setDataHash(store, newDataHash);
          });

          it("should call pushRetrieve with the new record", function () {
            expect(store.pushRetrieve).toHaveBeenCalled();
            expect(store.pushRetrieve.mostRecentCall.args).toEqual([handledRecordType1, "id in both old and new datahashes", { key: "new value" }]);
          });
        });

        describe("for those (record type, id) pairs currently in the data source's dataHash and are not found in the passed hash", function () {

          describe("when new record hash contains the same record types as in the old datahash", function () {

            beforeEach( function () {
              oldDataHash = {
                "MyApp.HandledRecordType1": {
                  "id in old and new datahashes": { key: "value" },
                  "id only in old datahash": { key: "value to be destroyed" }
                }
              };
              newDataHash = {
                "MyApp.HandledRecordType1": {
                  "id in old and new datahashes": { key: "value" }
                }
              };
              dataSource._dataHash = oldDataHash;
              dataSource.setDataHash(store, newDataHash);
            });

            it("should call pushDestroy on the now-gone record", function () {
              expect(store.pushDestroy).toHaveBeenCalled();
              expect(store.pushDestroy.mostRecentCall.args).toEqual([handledRecordType1,  "id only in old datahash"]);
            });
          });

          describe("when the new record hash is missing a record type found in the old datahash", function () {

            beforeEach( function () {
              oldDataHash = {
                "MyApp.HandledRecordType1": {
                  "id in old and new datahashes": { key: "value" }
                },
                "MyApp.HandledRecordType2": {
                  "id and record type only in old datahash": { key: "value to be destroyed" }
                }
              };
              newDataHash = {
                "MyApp.HandledRecordType1": {
                  "id in old and new datahashes": { key: "value" }
                }
              };
              dataSource._dataHash = oldDataHash;
              dataSource.setDataHash(store, newDataHash);
            });

            it("should call pushDestroy on the now-gone record", function () {
              expect(store.pushDestroy).toHaveBeenCalled();
              expect(store.pushDestroy.mostRecentCall.args).toEqual([handledRecordType2,  "id and record type only in old datahash"]);
            });
          });
        });

        describe("the new value of the dataHash property", function () {

          beforeEach( function () {
            newDataHash = {
              "MyApp.HandledRecordType1": {
                "new id 1": { key: { nestedKey: "value" } }
              },
              "MyApp.HandledRecordType2": {
                "new id 2": { key: { nestedKey: "value" } }
              }
            };
            dataSource._dataHash = {};
            dataSource.setDataHash(store, newDataHash);
          });

          it("should be a deep copy of the passed data hash", function () {
            var dataHashProperty = dataSource.get('dataHash');

            expect(dataHashProperty).toEqual(newDataHash);
            expect(dataHashProperty["MyApp.HandledRecordType1"]["new id 1"]["key"]).not.toBe(newDataHash["MyApp.HandledRecordType1"]["new id 1"]["key"]);
          });
        });

        describe("the next id for the record types", function () {
          beforeEach( function () {
            newDataHash = {
              "MyApp.HandledRecordType1": {
                "MyApp.HandledRecordType1-1": { key: { nestedKey: "value" } }
              },
              "MyApp.HandledRecordType2": {
                "MyApp.HandledRecordType2-999": { key: { nestedKey: "value" } }
              }
            };
            dataSource._dataHash = {};
            dataSource.setDataHash(store, newDataHash);
          });

          it("should be one more than maxium id of type", function () {
             expect(handledRecordType1.getNextId()).toBe("MyApp.HandledRecordType1-2");
             expect(handledRecordType2.getNextId()).toBe("MyApp.HandledRecordType2-1000");
          });
        });
      });
    });

    describe("with a real DataStore", function () {
      var dataStore;
      
      beforeEach( function () {
        dataStore = SC.Store.create().from(dataSource);
      });
      
      it("a record created without an id should have an id after commitRecords", function () {
        var record = dataStore.createRecord(handledRecordType1, {name: "hello"});
        expect(record.get('id')).toBe('MyApp.HandledRecordType1-1');
      });
    });
  });
});
