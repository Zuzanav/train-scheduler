$(document).ready(function (){

// FIREBASE CONFIGURATION ============================================================================
var config = {
    apiKey: "AIzaSyDTAaolNeCcRiHhrWsNbkZpwZcam3LghV8",
    authDomain: "train-schedule-ec3d7.firebaseapp.com",
    databaseURL: "https://train-schedule-ec3d7.firebaseio.com",
    projectId: "train-schedule-ec3d7",
    storageBucket: "gs://train-schedule-ec3d7.appspot.com"
  };

// INITIALIZE FIREBASE -------------------------
firebase.initializeApp(config);

// VARIABLE TO REFERENCE FIREBASE DATABASE -----
var database = firebase.database();

//=====================================================================================================

// GLOBAL INITIAL VALUES ----------------------
var ship = "";
var destination = "";
var time = 0;
var frequency = 0;

//------------------------------------------------------------------------------------
function populateTable() {
    database.ref().on("value", function(snapshot) {
        console.log("snapshot val: " + snapshot.val())


    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        
        // First Ship Time
        var shipTimeConverted = moment (time, "HH:mm").subtract(1, "years");
        console.log("FORMATTED TIME: " + moment (time, "HH:mm"))
        console.log("CONVERTED TIME: " + shipTimeConverted);
    
        // difference between times
        var diffTime = moment().diff(moment(shipTimeConverted), "minutes");
        console.log("diff time: " + diffTime);
    
        // Time apart 
        var remainder = diffTime % frequency;
        console.log("remainder: " + remainder);
    
        // MINUTES UNTIL NEXT SHIP
        var minutesTillShip = frequency - remainder;
        console.log("Minutes til next ship: " + minutesTillShip);
    
        // ARRIVAL DATE 
        var arrival_date = moment().add(minutesTillShip, "minutes").format('LLLL');
        console.log("Arrival Time: " + moment(arrival_date).format('LLLL'));

        // RETRIEVE AND DISPLAY DATA FROM FIREBASE ====================================================
        // ---------------------------------------------------------------------------------

        database.ref().on("child_added", function(childSnapshot) {
            $("#full-list").append("<tr class='well'><td> " 
                        + childSnapshot.val().ship +  
            " </td><td>" + childSnapshot.val().destination +
            " </td><td>" + childSnapshot.val().frequency + 
            " </td><td>" + arrival_date + // ARRIVAL DATE
            " </td><td>" + minutesTillShip + // MINUTES UNTIL NEXT SHIP
            " </td></tr>");

        }); // END OF childSnapshot FUNCTION


        database.ref().on("child_added", function(snapshot){
            $("#ship-col").text(snapshot.val().ship);
            $("#dest-col").text(snapshot.val().destination);
            $("#freq-col").text(snapshot.val().frequency);
            $("#arrival-col").text(minutesTillShip);
            $("#mins-away-col").text(snapshot.val().time);
        }); // END OF SNAPSHOT FUNCTION
        //---------------------------------------------------------------------------------

    }; // END OF FOR LOOP

}); // END OF "POPULATE-TABLE" FUNCTION
}

//-------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------


// ON CLICK EVENT ==============================================================================
// Submit Button Click Event ----------------------------------------------------------------

$("#submit-button").on("click", function(event, ship) {
    // prevent the page from refreshing on submit
    event.preventDefault();

    // assign the variables the value of the given inputs 
    ship = $("#ship-input").val().trim(); 
    destination = $("#destination-input").val().trim();
    time = $("#time-input").val().trim();
    frequency = $("#freq-input").val().trim();

    // push the input-data to Firebase
    database.ref().push({
        ship: ship,
        destination: destination,
        time: time,
        frequency: frequency
        });

    // RUN FUNCTION "POPULATE-TABLE" TO CALCULATE TIMES AND ADD TO SCHEDULE TABLE
    populateTable();

}); // END OF ON CLICK FUNCTION

}); // END OF DOCUMENT READY FUNCTION