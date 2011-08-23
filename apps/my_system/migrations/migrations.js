// ==========================================================================
// Project:   MySystem.migrations
// Copyright: ©2011 Concord Consortium
// ==========================================================================
/*globals MySystem */

MySystem.migrations = {
  
  migrateLearnerData: function (data) {
    var mySystemVersion = MySystem.learnerDataVersion,
        dataVersion = (typeof data.version === 'undefined') ? this.detectLegacyLearnerDataVersion(data) : data.version,
        v;
    
    if (mySystemVersion === MySystem.DEVELOPMENT_HEAD) {
      if (dataVersion === MySystem.DEVELOPMENT_HEAD) {
        return data;
      }
      else {  
        // Serially apply all the migrations that have been defined so far. If that's not good enough (i.e., the 
        // current, development version of the app requires some additional migration that hasn't yet been written)
        // then the app or test will choke and the developer can go fix it.

        if (!this.isPositiveInteger(dataVersion)) {
          throw new TypeError("data version '%@' is not a positive integer".fmt(dataVersion));
        }
        
        v = dataVersion;
        while (MySystem.migrations["migrateLearnerData"+v]) {
          data = MySystem.migrations["migrateLearnerData"+v](data);
          v++;
        }
        return data;
      }
    }
    else {
      // MySystem.learnerDataVersion is a "release" version
            
      if (!this.isPositiveInteger(dataVersion)) {
        throw new TypeError("data version '%@' is not a positive integer".fmt(dataVersion));
      }
      if (!this.isPositiveInteger(mySystemVersion)) {
        throw new TypeError("MySystem learnerDataVersion '%@' is not a positive integer".fmt(mySystemVersion));
      }
      
      if (dataVersion < mySystemVersion) {
        // serially convert to current learnerDataVersion
        for (v = dataVersion; v < mySystemVersion; v++) {
          data = MySystem.migrations["migrateLearnerData"+v](data);
        }
        return data;
      }
      else if (dataVersion === mySystemVersion) {
        return data;
      }
      else {
        throw new RangeError("Current MySystem.learnerDataVersion '%@' is behind the learner-data version '%@'. Down-migrations are not supported.".fmt(MySystem.learnerDataVersion, dataVersion));
      }
    }
  },
  
  // assume any legacy version is version 1
  detectLegacyLearnerDataVersion: function (data) {
    return 1;
  },
  
  isPositiveInteger: function (v) {
    return (typeof v === 'number' && Math.round(v) === v && v > 0);
  },
  
  isValidReleaseVersion: function (v) {
    return this.isPositiveInteger(v);
  }

};
