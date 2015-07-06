//we'll want a theatre class
//the theatre object will take a constructor target to inject into the dom
//it will have it's own camera, lightsource, scene, renderer, and controlls...
//
//we'll also want a few props classes
//if we do the robots (which I think we maybe should) that and a floor prop and a controls prop would be about enough.
//


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
