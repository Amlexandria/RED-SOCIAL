


$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDCa10dK_5xcHkIitNoEEoHvH5NiQ0M83o",
    authDomain: "popartistic-75cf0.firebaseapp.com",
    databaseURL: "https://popartistic-75cf0.firebaseio.com",
    projectId: "popartistic-75cf0",
    storageBucket: "popartistic-75cf0.appspot.com",
    messagingSenderId: "1074769704168"
  };
  firebase.initializeApp(config);

  // LOGIN
var provider = new firebase.auth.GoogleAuthProvider();
$('#login').click(function () {
  console.log('CLICKED');
      firebase.auth().signInWithPopup(provider).then(function(result) {
        window.location = "view/timeline.html?LOGIN=SUCCESSFUL";
    })
    .catch(error => console.log(error));
});

    M.updateTextFields(); 
    
  });