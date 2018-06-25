//VARIABLES
var $title= $("#poptitle");
var $comment= $("#commentsprofile");
var $tools= $("#tools");
var $proces = $("#process");
var $uploadImg =$('#img');



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


//ARCHIVO, CARGA A FIREBASE

var dataBaseTable = firebase.database().ref('imagenes');

var $fileButton = $('#fichero');


//revisar seleccion de archivo
$fileButton.change('change', function (e) {
  //obtener objeto
  var file = e.target.files[0];
  //crear storage ref
  var storageRef = firebase.storage().ref('mis-fotos/' + file.name);
  //subir archivo
  var uploadTask = storageRef.put(file);



  //errores y  subida exitosa
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function (snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    },
    function (error) {

      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          swal(":(", "User doesn't have permission to access the object", "error");

          break;

        case 'storage/canceled':
          // User canceled the upload
          swal(":(", "User canceled the upload", "error");

          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          swal("Try Again later", "Unknown error occurred, inspect error.serverResponse", "error");

          break;
      }
    },
    function () {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        //Aqui se empiezan a crear los nodos en firebase, dandoles un parkey value ya tomando data de el modal
        var postKey = firebase.database().ref("postImages/").push().key;
        var updates = {};
        var postData = {
          url: downloadURL,
          name: $('#poptitle').val()
        };
        updates['/postImage/' + postKey] = postData;
        firebase.database().ref().update(updates);
        swal("Good job!", "Tu archivo fue cargado con exito!", "success");
        console.log('File available at', downloadURL);
      });
    });
});

$(document).ready(function(){
  firebase.auth().onAuthStateChanged(function(user){
  if (user){
    //si el usuario esta conectado
    var token = firebase.auth().currentUser.uid;
    queryDatabase(token);
  }else{
    //No user signed in 
    window.location = "../index.html"
    }
  });
});
function queryDatabase(token){
  firebase.database().ref('/postImage/').once('value').then(function(snapshot){
    var postObject = snapshot.val();
    var keys = Object.keys(postObject);
    var currentRow;
    for (var i = 0; i< keys.length; i++){
      var currentObject = postObject[keys[i]];
      if(i % 3 = 0){
        currentRow =
      };
    };
  });
};







/*Dropdown de header*/


$('.dropdown-trigger').dropdown();

//modal
$(document).ready(function () {
  $('.modal').modal();
  $("#add-contact").click(getContactData);
});

//img
$(document).ready(function () {
  $('.materialboxed').materialbox();
});