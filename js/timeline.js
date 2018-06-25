var namePublication;
var techniques;
var tools;
var description;
var popPicture;

function getDataforPop () {
  namePublication = $('#pop-name').val();
  techniques = $('#tecnica').val();
  tools = $('.chip');
  console.log(tools);
  description = $('#textarea1').val();
  popPicture = $('#picture-input').val();

  creatingPost();

  //Limpiando inputs
  $('#pop-name').val("");
  $('#tecnica').val("");
  $('#tools').val("");
  $('#textarea1').val("");
  $('#picture-input').val("");
};

var openFile = function(event) {
  var input = event.target;

  var reader = new FileReader();
  reader.onload = function(){
    var dataURL = reader.result;
    var output = $('#output');
    output.src = dataURL;
  };
  reader.readAsDataURL(input.files[0]);
};


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

 $("main").append(templatePop);
};

 



$(document).ready(function(){
  $('.fixed-action-btn').floatingActionButton();
  $('.dropdown-trigger').dropdown();
  $('.modal').modal();
  $('.chips-placeholder').chips({
    placeholder: 'Enter a tag',
    secondaryPlaceholder: '+herramienta',
  });

  $('#publicar-pop').click(getDataforPop);

  // $('#textarea1').val();
M.textareaAutoResize($('#textarea1'));


});

    
     
    
 