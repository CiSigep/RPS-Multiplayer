$(() => {
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
    var gameRef = database.ref("/game");

    function errorOnFirebase(err) {
        console.log(err);
    }

    function compareSelections(ours, theirs) {

        if(ours.selected === "Rock" && theirs.selected === "Scissors"
        || ours.selected === "Scissors" && theirs.selected === "Paper"
        || ours.selected === "Paper" && theirs.selected === "Rock"){
           
            wins++;
            return "You Win!"
        }
        else if(ours.selected === "Scissors" && theirs.selected === "Rock"
        || ours.selected === "Paper" && theirs.selected === "Scissors"
        || ours.selected === "Rock" && theirs.selected === "Paper"){
            
            losses++;
            return "You Lose."
        }
        else{
            draws++;
            return "Draw."
        }
    }

    var playing = false;
    var username = "";
    var wins = 0;
    var losses = 0;
    var draws = 0;

    // Reference to remove the play when the player disconnects or the round ends
    var playRef;

    var ourPlay;
    var opposingPlay;

    // Add our new connection
    connectedRef.on("value", (snap) => {
        if(snap.val()){
            var con = connectionsRef.push(true);

            con.onDisconnect().remove();
        }
    }, errorOnFirebase);

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

    }, errorOnFirebase);

    // Callback when the value changes in the player database
    playerRef.on("value", (snap) => {
        if(playing && snap.numChildren() == 2){
            $("#waitingSpan").addClass("d-none");
            $("#gameBlock").removeClass("d-none");
        }
    }, errorOnFirebase);

    // Callback when a play value is added to the game.
    gameRef.on("child_added", (snap) => {
        // Opposing player's play
        if(playing && snap.val().user !== username)
            opposingPlay = snap.val();

        // We have both, compare and show the results.
        if(typeof ourPlay !== "undefined" && !ourPlay.played
        && typeof opposingPlay !== "undefined" && !opposingPlay.played){

            $("#waitingSpan").addClass("d-none");

            var status = compareSelections(ourPlay, opposingPlay);
            ourPlay.played = true;
            opposingPlay.played = true;

            $("#gameStatusSpan").text(status);
            $("#gameStatusSpan").removeClass("d-none");
            setTimeout(() => {
                $("#gameStatusSpan").text("");
                $("#gameStatusSpan").addClass("d-none");
                $("#gameBlock").removeClass("d-none");
                playRef.remove();
            }, 5000);
        }

    }, errorOnFirebase);


    // Click event for our name button
    $("#nameButton").click(() => {
        if(!playing)
            return;

        $("#waitingSpan").removeClass("d-none");
        username = $("#nameInput").val();
        var name = playerRef.push({name: username});
        name.onDisconnect().remove();
        
        $("#nameInput").val("");
        $("#formBlock").addClass("d-none");
    });

    // Click events for our game buttons
    $(".game-btn").click((e) => {
        if(!playing)
            return;

        var selection = $(e.currentTarget).attr("value");

        $("#gameBlock").addClass("d-none");
        $("#waitingSpan").removeClass("d-none");

        ourPlay = {
            user: username,
            selected: selection,
            played: false 
        };

        playRef = gameRef.push(ourPlay);

        playRef.onDisconnect().remove();
    });

});