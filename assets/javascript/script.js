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

$(() => {
    console.log("Running");

    console.log(database);

    database.ref().set({ ping: true});

    database.ref().on("value", (snap) => {
        console.log(snap.val());
    }, (err) => {
        console.log(err);
    })
});