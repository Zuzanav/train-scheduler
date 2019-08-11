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

//=====================================================================================================

// RETREIVE CURRENT DATA FROM FIREBASE ----------------------------------------------

database.ref().on("child_added", function(snapshot) { 
        //console.log("SNAPSHOT: " + snapshot.key);

    // RETRIEVE TIME AND FREQUENCY VARIABLES ----------------------------------------    
    var time = snapshot.val().time;
    var frequency = snapshot.val().frequency;

        // console.log("TIME: " + time);
        // console.log("FREQUENCY: " + frequency);


    // MOMENT.JS TIME CONVERSIONS --------------------------------------------------
    
    // First Ship Time
    var shipTimeConverted = moment (time, "HH:mm").subtract(1, "years");
        //console.log("FORMATTED TIME: " + moment (time, "HH:mm"))
        // console.log("CONVERTED TIME: " + shipTimeConverted);
    
    // difference between times
    var diffTime = moment().diff(moment(shipTimeConverted), "minutes");
        // console.log("diff time: " + diffTime);
    
    // Time apart 
    var remainder = diffTime % frequency;
        // console.log("remainder: " + remainder);
    
    // MINUTES UNTIL NEXT SHIP
    var minutesTillShip = frequency - remainder;
        // console.log("Minutes til next ship: " + minutesTillShip);
    
    // ARRIVAL DATE 
    var arrival_date = moment().add(minutesTillShip, "minutes").format('LLLL');
        // console.log("Arrival Time: " + moment(arrival_date).format('LLLL'));
 

    // APPEND DATA TO TABLE ----------------------------------------------------------

    $("#full-list").append("<tr class='well'><td> " 
                + snapshot.val().ship +  
    " </td><td>" + snapshot.val().destination +
    " </td><td>" + snapshot.val().frequency + 
    " </td><td>" + arrival_date + // ARRIVAL DATE
    " </td><td>" + minutesTillShip + // MINUTES UNTIL NEXT SHIP
    " </td></tr>");


        // database.ref().on("child_added", function(snapshot){
        //     $("#ship-col").text(snapshot.val().ship);
        //     $("#dest-col").text(snapshot.val().destination);
        //     $("#freq-col").text(snapshot.val().frequency);
        //     $("#arrival-col").text(minutesTillShip);
        //     $("#mins-away-col").text(snapshot.val().time);
        // }); // END OF SNAPSHOT FUNCTION
}); 

//=====================================================================================================

// ON CLICK EVENT - Submit Button Click Event ------------------------------------------

$("#submit-button").on("click", function(event) {
   
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

    $("form")[0].reset(); 


}); // END OF ON CLICK FUNCTION

}); // END OF DOCUMENT READY FUNCTION