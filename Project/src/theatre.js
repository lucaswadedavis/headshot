(function(){

  var utils = {};

  utils.uid = function(){
    var count = 0;
    utils.uid = function(){
      return "_"+count++;
    };
    return utils.uid();
  };

  utils.injectTarget = function(targetID){
    var targetElement = document.createElement("DIV");
    targetElement.id = targetID || utils.uid();
    document.body.appendChild(targetElement);
  };
 
///////////////////////////////////////////////////////////////////////////////

  var Theatre = function(targetID){
    if (targetID === undefined){
      targetID = utils.uid();
      utils.injectTarget(targetID);
    }

    this.targetElementID = targetID;

    var camera, scene, renderer, controls;

    cast = [];

    this.addMesh = function(mesh){
      cast.push(mesh);
      scene.add(mesh);
    };

    this.init = function() {

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000;
      camera.lookAt(0,0,0);
      scene = new THREE.Scene();
      controls = new THREE.OrbitControls(camera);
      controls.damping = 0.2;
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      var targetElement = document.getElementById(targetID);
      targetElement.appendChild(renderer.domElement);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1) );
      controls.addEventListener('change',renderer.render)
    }

    var animate = function() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    this.animate = animate;

  };

  window.Theatre = Theatre;

})();
