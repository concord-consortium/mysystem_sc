var snapshots = [];

function getMySystemJSON() {
  return $("#mysystem").contents().find("#my_system_state").text();
}

function setMySystemJSON(jsonString) {
  var MySystem = window.frames["mysystem"].MySystem;
  
  // put the json string into the DOM element MySystem can read.
  $("#mysystem").contents().find("#my_system_state").text(jsonString);

  // call back to MySystem so it updates its state
  if (MySystem && MySystem.updateFromDOM) MySystem.updateFromDOM();
}

$(function () {
  
  $("#snapshot-button").click(function () {
    var snapshot = getMySystemJSON(),
        index = snapshots.length,
        now = new Date(),
        timeString = now.toLocaleTimeString();
        
    snapshots.push(snapshot);

    $("#snapshot-select").append("<option value='"+index+"'>"+timeString+"</option>");
    $("#snapshot-select").val(index);
  });
  
  $("#snapshot-select").change( function () {
    var index = parseInt($(this).val(), 10);
    setMySystemJSON(snapshots[index]);
  });
  
});
