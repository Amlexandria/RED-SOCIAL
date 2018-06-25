//VARIABLES
var $title = $("#poptitle");
var $comment = $("#commentsprofile");
var $tools = $("#tools");
var $proces = $("#process");
var $uploadImg = $('#img');



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
          name: $('#poptitle').val(),
          comment: $('#commentsprofile').val(),
          tools: $('#tools').val(),
          process: $('#process').val()

        };
        updates['/postImage/' + postKey] = postData;
        firebase.database().ref().update(updates);
        swal("Good job!", "Tu archivo fue cargado con exito!", "success");
        console.log('File available at', downloadURL);
      });
    });
});

//idRandom para que los modales no choquen
var $idModal = function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


// Retrieve new posts as they are added to our database
var dataImageRef = firebase.database().ref("postImage/");

dataImageRef.on("child_added", function (data) {
  var newdataImg = data.val();
  console.log("name: " + newdataImg.name);
  console.log("description: " + newdataImg.description);
  console.log("techniques: " + newdataImg.techniques);
  console.log("url: " + newdataImg.url);
});
var namePublication = $('#poptitle');
var description = $('#description');
var tools = $('#tools');
var process = $('#process');

$(document).ready(function () {
      //Comprobando que el usuario esté asignado
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          var token = firebase.auth().currentUser.uid;
          queryDatabase(token);
        } else {
          // No user is signed in.
          window.location = "index.html";
        };
      });

      //obteniendo los keys del objeto Post images
      function queryDatabase(token) {
        firebase.database().ref('/postImage/').once('value').then(function (snapshot) {
              var postObject = snapshot.val();
              var keys = Object.keys(postObject);

              for (var i = 0; i < keys.length; i++) {
                var currentObject = postObject[keys[i]];
                console.log(currentObject);

                var imageOfThePost = currentObject.url;
                namePublication = currentObject.name;
                techniques = currentObject.techniques;
                description = currentObject.description;
                console.log(postObject);
              }


                var template = `<div class="col s12 m4">
                  <div class="thumbnail  modal-trigger" href=__modalID__ >
                   <img class="responsive-img" height="200" width="300"  src="${popPicture}">
                    <span class="title">${namePublication}</span>
                  </div> 
              </div> 
                <div id="__modalID__" class="modal">
                  <div class="modal-content">
                    <div class="row">
                        <div class="col s12 m12">
                           <div class="card-image">
                              <img src="${popPicture}"> <!--Esto se cambiara por la imagen cargada-->
                              <span class="card-title"></span>
                              <div class="card-content"> //<!--inicio de la carta-->
                              <div>// inicio de cartatitulo
                                  <h3>${namePublication}</h3>
                              </div>//fin carta titulo
                              <div> //div contenedor de comentarios
                                  <p>${description} </p> <!--Se remplazara con el  comentario del artista-->
                              </div>
                              <div>//tools inicio
                                 <p>${tools}</p>
                              </div>//final tool
                              <div>//inicio de div de  proceso
                                  <p>${process}</p>
                              </div>
                            </div>//finalcard
                          </div>//finalcolumnws12
                      </div> //finalrow
                  </div> //final div modal
                  //COMMENTS SPACE
                  <div class="comment-section">
                      <div class="">
                          <textarea class="txt" id="text" rows="1" onkeydown="counter(this)" onkeyup="counter(this)" placeholder="¿Te gusta mi Pop? Comenta!"></textarea>
                          <button type="button" id="btn" class="btn">Post</button>
                         <span id="counter">140</span>
                      </div>
                  </div>
                  //FINAL COMMENTS
                <div class="modal-footer">
                  <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cerrar</a>
                </div>`

                var $Print = $("#sendImageToPrint");

                $Print.click(function () {
                  var template = "";
                  template = template.replace("__modalID__", $idModal)
                  $("#baseRow").append(template);

                });









                /*Dropdown de header*/


                $('.dropdown-trigger').dropdown();

                //modal
                $(document).ready(function () {
                  $('.modal').modal();
                  $("#add-contact").click(getContactData);
                  $('.materialboxed').materialbox();
                });

               