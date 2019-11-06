// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyDof1xWe1uwZr0-0cjO-fs28rkqKRFx6Uw",
  authDomain: "train-scheduler-1eca0.firebaseapp.com",
  databaseURL: "https://train-scheduler-1eca0.firebaseio.com",
  projectId: "train-scheduler-1eca0",
  storageBucket: "train-scheduler-1eca0.appspot.com",
  messagingSenderId: "352005790270",
  appId: "1:352005790270:web:f259bb5a39c9182de68f6f"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);

let database = firebase.database();
//--Fill the Firebase with initial data when button is clicked--//

$("#addTrain").on("click", function(event) {
  event.preventDefault();

  //--Get the usr input from the fields and assign them variables--//

  let trainName = $("#name")
    .val()
    .trim();

  let destination = $("#destination")
    .val()
    .trim();

  let firstTrain = $("#firstTrain")
    .val()
    .trim();

  let frequency = $("#frequency")
    .val()
    .trim();

  //--Creating local storage to operate on the train data--//

  let tempTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  //--Now to upload the train data to the database/Firebase--//

  database.ref().push(tempTrain);

  //--Test in console--//

  console.log("The following values were pushed to the Firebase");
  console.log(tempTrain.name);
  console.log(tempTrain.destination);
  console.log(tempTrain.firstTrain);
  console.log(tempTrain.frequency);

  alert("Train Successfuly Added");

  //--Now we reset the input boxes--//

  $("#name").val("");
  $("destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");
});

//--Now create the firebase event that pulls the data back down onto the html and formats it correctly--//
database.ref().on("child_added", function(snapshot, prevChildKey) {
  console.log(snapshot.val());

  //--Store everything in the variable--//

  let snapName = snapshot.val().name;
  let snapDestination = snapshot.val().destination;
  let snapFirstTrain = snapshot.val().firstTrain;
  let snapFrequency = snapshot.val().frequency;

  let timeArr = snapFirstTrain.split(":");
  let trainTime = moment()
    .hours(timeArr[0])
    .minutes(timeArr[1]);

  let maxMoment = moment.max(moment(), trainTime);
  let tMinutes;
  let tArrival;

  //If the first train is later than the current time, send Arrival to the first train time--//

  if (maxMoment === trainTime) {
    tArrival = train.Time.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } else {
    //--Here we need to calculate the minutes until arrival--//

    let differenceTimes = moment().diff(trainTime, "minutes");
    let tRemainder = differenceTimes % snapFrequency;
    tMinutes = snapFrequency - tRemainder;

    //--Calculating the arrival time of the train, and adding the tMinutes to the current time--//

    tArrival = moment()
      .add(tMinutes, "m")
      .format("hh:mm A");
  }

  console.log("tMinutes ", tMinutes);
  console.log("tArrival ", tArrival);

  //Add each piece of data to its appropriate column on the table

  $("#train-list").append(`
  <tr>
    <th scope="row"> ${snapName}</th>
    <td>${snapDestination}</td>
    <td>${snapFrequency}</td>
    <td>${tArrival}</td>
    <td>${tMinutes}</td>
    </tr>
    
    `);
});
