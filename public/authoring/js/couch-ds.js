msaPreview = {};

msaPreview.CouchDS = function(authoredDocId) {
  $.couch.urlPrefix = "/mysystem_designs";
  this.db = $.couch.db('');
};

msaPreview.CouchDS.prototype =
{
  db: null,
  authoredDocId: null,
  authorContentWindow: null,
  
  loadAuthoredData: function (authoredDocId) {
    this.authoredDocId = authoredDocId
    var self = this;
    this.loadData(function(ret){
      if (ret.authored_data){
        self.authorContentWindow.MSA.loadData(ret.authored_data)
      }
    });
  },
  
  loadData: function (callback) {
    this.db.openDoc(this.authoredDocId, 
      {
        success: function (response) {
          callback(response);
        }
      }
    );
  },
  
  setAuthorContentWindow: function (contentWindow) {
    this.authorContentWindow = contentWindow;
  }
  
}

// 
// (function (){
//     sparks.CouchDS = function (){
//         this.saveDocUID = null;
//         this.saveDocRevision = null;
//         this.user = null;
//         
//         this.dbPath = "/couchdb/mysystem_designes";
//     };
// 
//     sparks.CouchDS.prototype =
//     {
//       
//         loadActivity: function(id, callback) {
//           $.couch.urlPrefix = this.activityPath;
//           $.couch.db('').openDoc(id, 
//             {
//               success: function (response) {
//                 console.log("Loaded "+response._id);
//                 callback(response);
//               }
//             }
//           );
//         },
//         
//         setUser: function(_user) {
//           this.user = _user;
//         },
//         
//         // write the data
//         save: function (_data) {
//           if (!this.user){
//             return;
//           }
//           
//           $.couch.urlPrefix = this.saveDataPath;
//           
//           _data.user = this.user;
//           _data.runnable_id = this.runnableId;
//           _data.save_time = new Date().valueOf();
//           
//           if (!!this.saveDocUID){
//             console.log("saving with known id "+this.saveDocUID);
//             _data._id = this.saveDocUID;
//           }
//           if (!!this.saveDocRevision){
//             _data._rev = this.saveDocRevision;
//           }
//           
//           var self = this;
//           $.couch.db('').saveDoc(  
//             _data,  
//             { success: function(response) { 
//               console.log("Saved ok, id = "+response.id);
//               self.saveDocUID = response.id;
//               self.saveDocRevision = response.rev;
//              }}  
//           );
//           
//         },
//         
//         // saves and does not try to modify _rev or other data
//         saveRawData: function(_data) {
//           $.couch.urlPrefix = this.saveDataPath;
//           $.couch.db(this.db).saveDoc(  
//             _data,  
//             { success: function(response) { 
//               console.log("Saved ok, id = "+response.id);
//              }}  
//           );
//         },
//     
//         loadStudentData: function (activity, studentName, success, failure) {
//           $.couch.urlPrefix = this.saveDataPath;
//           if (!studentName){
//             studentName = this.user.name;
//           }
//           var self = this;
//           $.couch.db('').view(
//             "session_scores/Scores%20per%20activity", 
//             {
//               key:[studentName, activity],
//               success: function(response) { 
//                 console.log("success loading");
//                 console.log(response);
//                 if (response.rows.length > 0){
//                   sparks.couchDS.saveDocUID = response.rows[response.rows.length-1].value._id;
//                   sparks.couchDS.saveDocRevision = response.rows[response.rows.length-1].value._rev;
//                   console.log("setting id to "+sparks.couchDS.saveDocUID);
//                   success(response);
//                 } else {
//                   failure();
//                 }
//             }}
//           );
//         },
//         
//         handleData: function (id) {
//           $.couch.db(this.db).openDoc(id,
//             { success: function(response) { 
//               sparks.sparksReportController.loadReport(response);
//              }}
//           );
//         }
//     };
//     
//     sparks.couchDS = new sparks.CouchDS();
// })();