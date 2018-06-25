var namePublication;
var techniques;
var tools;
var description;
var popPicture;
var reader;
var imageData;

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

  // Retrieve new posts as they are added to our database
    firebase.database().ref("postImage").on("child_added", function(snapshot) {
    var newPost = snapshot.val();
    console.log(newPost);
    
    
   });


 
  
  //ARCHIVO, CARGA A FIREBASE
  
  var dataBaseTable = firebase.database().ref('imagenes');
  
  var $fileButton = $('#picture-file-input');
  
  
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
            name: $('#pop-name').val(),
            techniques: $('#tecnica').val(),
            description: $('#textarea1').val(),
            tools: $('#tools').val(),
   
          };
          updates['/postImage/' + postKey] = postData;
          firebase.database().ref().update(updates);
          swal("Good job!", "Tu archivo fue cargado con exito!", "success");
          console.log('File available at', downloadURL);
        });
      });
   });
  

// function getDataforPop () {
//   namePublication = $('#pop-name').val();
//   techniques = $('#tecnica').val();
//   tools = $('#tools');
//   console.log(tools);
//   description = $('#textarea1').val();
//   popPicture = $('#picture-input').val();

//   // reader = new FileReader();
//   // reader.onload = function() {
//   //   imageData = reader.result;
//   //   console.log(imageData);
//   //   $('#output').attr('src', imageData);
//   // }

//   // reader.readAsDataURL($('#picture-file-input')[0].files[0]);

//   creatingPost();

//   //Limpiando inputs
//   $('#pop-name').val("");
//   $('#tecnica').val("");
//   $('#tools').val("");
//   $('#textarea1').val("");
//   $('#picture-input').val("");
// };


function imgUrl(fileInput) {
  reader = new FileReader();
  reader.onload = function(evt) {
    dataURL = evt.target.result;
    // addPostData();
    savePostData();
  }

  reader.readAsDataURL(fileInput.files[0]);
}

function creatingPost (){
  var templatePop = `<section class="row">
  <div class="card offset-s1 col s10 offset-m2 col m8 offset-l4 col l4">
      <div class="row cont-img-profile">
          <div class="image-profile col s2">
              <img id="profile-picture" class="circle responsive-img" src="../assets/images/profile.jpg" alt="">
          </div>
          <p id="user-name" class="col s7 m8 l8">Nombre de Usuario</p>
      </div>
      <div class="card-image waves-effect waves-block waves-light">
          <img id="output" class="activator" src="">
      </div>
      <div class="card-content">
          <span id="title-card" class="card-title activator grey-text text-darken-4">${namePublication}<i class="material-icons right">more_vert</i></span>
          <p class="col s4 go-to-profile"><a href="#">Ir a perfil</a></p>
          <a class="btn-delete waves-effect waves-light btn-small offset-s10 col s2 "><i class="material-icons center">delete</i></a>
      </div>
      <div class="card-reveal">
          <span id="title-card-inside" class="card-title grey-text text-darken-4">${namePublication}<i class="material-icons right">close</i></span>
          <h6><strong>${techniques}</strong></h6>
          <p id="description">${description}</p> 
          <div class="container-tools">${tools}</div>
      </div>
  </div>
 </section>`

 $("main").prepend(templatePop);
};


var namePublication = $('#pop-name');
var techniques = $('#tecnica');
var description = $('#textarea1');



$(document).ready(function(){
    //Comprobando que el usuario esté asignado
    firebase.auth().onAuthStateChanged(function(user) {
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
    function queryDatabase (token) {
        firebase.database().ref('/postImage/').once('value').then(function(snapshot) {
            var postObject = snapshot.val();
            var keys = Object.keys(postObject);

            for(var i = 0; i < keys.length; i++){
                var currentObject = postObject[keys[i]];
                console.log(currentObject);

                var imageOfThePost = currentObject.url;
                namePublication = currentObject.name;
                techniques = currentObject.techniques;
                description = currentObject.description;
                console.log(postObject);
    
                var templatePop = `<section class="row">
                    <div class="card offset-s1 col s10 offset-m2 col m8 offset-l4 col l4">
                        <div class="row cont-img-profile">
                            <div class="image-profile col s2">
                                <img id="profile-picture" class="circle responsive-img" src="../assets/images/profile.jpg" alt="">
                            </div>
                            <p id="user-name" class="col s7 m8 l8">Nombre de Usuario</p>
                        </div>
                        <div class="card-image waves-effect waves-block waves-light">
                            <img id="output" class="activator" src="${imageOfThePost}">
                        </div>
                        <div class="card-content">
                            <span id="title-card" class="card-title activator grey-text text-darken-4">${namePublication}<i class="material-icons right">more_vert</i></span>
                            <p class="col s4 go-to-profile"><a href="#">Ir a perfil</a></p>
                            <a class="btn-delete waves-effect waves-light btn-small offset-s10 col s2 "><i class="material-icons center">delete</i></a>
                    </div>
                        <div class="card-reveal">
                            <span id="title-card-inside" class="card-title grey-text text-darken-4">${namePublication}<i class="material-icons right">close</i></span>
                            <h6><strong>${techniques}</strong></h6>
                            <p id="description">${description}</p> 
                            <div class="container-tools">${tools}</div>
                        </div>
                    </div>
                    </section>`
    
            $("main").append(templatePop);
            };
            
           
        });
    };//cierra función queryDatabase

    $('.fixed-action-btn').floatingActionButton();
    $('.dropdown-trigger').dropdown();
    $('.modal').modal();
    $('.chips-placeholder').chips({
        placeholder: 'Enter a tag',
        secondaryPlaceholder: '+herramienta',
    });

    // $('#publicar-pop').click(getDataforPop);

  // $('#textarea1').val();
    M.textareaAutoResize($('#textarea1'));


});

    
     
    
 