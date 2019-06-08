var firebaseConfig = {
    apiKey: "AIzaSyC8rNA-p9VjqL3zd6rEimb1JChBocI_aH0",
    authDomain: "bcprj-e07e7.firebaseapp.com",
    databaseURL: "https://bcprj-e07e7.firebaseio.com",
    projectId: "bcprj-e07e7",
    storageBucket: "bcprj-e07e7.appspot.com",
    messagingSenderId: "77927070757",
    appId: "1:77927070757:web:efccb6d6de978f6e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var playerRef = database.ref("/players");

$(() => {

    var playing = false;

    // Add our new connection
    connectedRef.on("value", (snap) => {
        if(snap.val()){
            var con = connectionsRef.push(true);

            con.onDisconnect().remove();
        }
    },
    (err) => {
        console.log(err);
    });

    // Event for our added connections
    connectionsRef.on("value", (snap) => {
        var numConnected = snap.numChildren();

        // Show if we're a player who hasn't added their name yet.
        if(numConnected <= 2 && !playing){
            playing = true;
            $("#formBlock").removeClass("d-none");
            $("#gameInSession").addClass("d-none");
        }
        else if(numConnected > 2 && !playing){
            $("#formBlock").addClass("d-none");
            $("#gameInSession").removeClass("d-none");
        }

    },
    (err) => {
        console.log(err);
    });

    // Click event for our name button
    $("#nameButton").click(() => {
        if(!playing)
            return;

        var name = playerRef.push({name: $("#nameInput").val()});
        name.onDisconnect().remove();

        $("#nameInput").val("");
        $("#formBlock").addClass("d-none");
    });

});