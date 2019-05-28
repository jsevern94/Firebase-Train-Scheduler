var firebaseConfig = {
    apiKey: "AIzaSyC0ihGfnqh5f5pNBDu_ORL9ufUbOLWM4-I",
    authDomain: "train-schedule-10cd1.firebaseapp.com",
    databaseURL: "https://train-schedule-10cd1.firebaseio.com",
    projectId: "train-schedule-10cd1",
    storageBucket: "train-schedule-10cd1.appspot.com",
    messagingSenderId: "90345051722",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$('#submit-btn').on("click", function () {

    event.preventDefault();



    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $('#first-train-time').val().trim();
    var frequency = $('#frequency').val().trim();

    console.log(moment(firstTrainTime, "HH:mm", true).isValid());

    if (moment(firstTrainTime, "HH:mm", true).isValid() && trainName && destination && frequency) {

        database.ref().push({
            name: trainName,
            destination: destination,
            first: firstTrainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
        });

        $("#train-name").val("");
        $("#destination").val("");
        $('#first-train-time').val("");
        $('#frequency').val("");
    }
    else {
        alert("Please input all required data in the correct format")
    }

});

database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function (childSnapshot) {

    var sv = childSnapshot.val();

    var tableName = sv.name;
    var tableDest = sv.destination;
    var tableFreq = sv.frequency;
    var tableFirst = sv.first;

    var tableFirstConverted = moment(tableFirst, "HH:mm").format('LLL');

    // Difference between the times
    var timeDiff = Math.abs(moment().diff(moment(tableFirstConverted), "minutes"));
    
    //if first train is in the past
    if (moment().isAfter(tableFirstConverted)) {
        console.log(timeDiff);
        // Time apart (remainder)
        var remainder = timeDiff % tableFreq;
        // Minute Until Train
        var minutesAway = tableFreq - remainder;
        // Next Train
        var nextTrain = moment().add(minutesAway, "minutes").format("h:mm a");
    }
    //if first train is in the future
    else {
        var nextTrain = moment(tableFirstConverted).format("h:mm a");

        var minutesAway = timeDiff + 1;

    }
    var chooChoo = ("<tr><td>" + tableName + "</td><td>" + tableDest + "</td><td>" +
        tableFreq + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td></tr>");

    $("#main-train").append(chooChoo);
});
