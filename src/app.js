(function(){

  var app = {};

  app.init = function(){
    app.setScene();
    app.theatre.init();
    app.theatre.animate();

    for (var i=0;i<7;i++){
      app.theatre.addMesh(props.Robot({x:-1500+i*500}));
    }
    app.theatre.addMesh(props.Ground(-50));

  };

  app.setScene = function(){
    var mainTheatre = document.createElement("DIV");
    mainTheatre.id = "main-theatre";
    document.body.appendChild(mainTheatre);
  };

  app.theatre = new Theatre("main-theatre");

  window.onload = app.init;

})();
