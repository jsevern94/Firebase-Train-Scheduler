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

});

database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function (childSnapshot) {

    var sv = childSnapshot.val();

    var tableName = sv.name;
    var tableDest = sv.destination;
    var tableFreq = sv.frequency;
    var tableFirst = sv.first;

    // //Making the employee start date look correct
    // var datePretty = moment(dateA).format("MM/DD/YYYY");

    // //Calculate the months worked
    var now = moment().format('LLL');

    var tableFirstConverted = moment(tableFirst, "HH:mm").subtract(1, "days").format('LLL');
    // Difference between the times
    var timeDiff = moment().diff(moment(tableFirstConverted), "minutes");
    console.log(timeDiff);
    // Time apart (remainder)
    var remainder = timeDiff % tableFreq;
    // Minute Until Train
    var minutesAway = tableFreq - remainder;
    // Next Train
    var nextTrain = moment().add(minutesAway, "minutes").format("h:mm a");

    console.log(now);

    var chooChoo = ("<tr><td>" + tableName + "</td><td>" + tableDest + "</td><td>" +
        tableFreq + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td></tr>");

    $("#main-train").append(chooChoo);
});




