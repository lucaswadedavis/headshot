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
 
  // below this is the Theatre class

  var Theatre = function(targetID){
    if (targetID === undefined){
      targetID = utils.uid();
      utils.injectTarget(targetID);
    }

    this.targetElementID = targetID;

    // private properties
    var camera, scene, renderer, controls;

    this.addMesh = function(mesh){
      scene.add(mesh);
    };

    this.init = function() {

      scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1) );

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.z = 1000;
      camera.lookAt(0,0,0);

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      var targetElement = document.getElementById(targetID);
      targetElement.appendChild(renderer.domElement);

      controls = new THREE.OrbitControls(camera);
      controls.damping = 0.2;
      controls.addEventListener('change',renderer.render)
    };

    var animate = function() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    this.animate = animate;

  };

  window.Theatre = Theatre;

})();
