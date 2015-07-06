(function(){

  var state = {

  };

  var stochastic = function(min, max){
    return min + ( (max-min) * Math.random() );
  }

  var grey = function(lightOrDark){
    lightOrDark = lightOrDark || "dark";
    var grey = lightOrDark.toLowerCase()==="light" ? Math.floor(100+(Math.random()*155)) : Math.floor(50+Math.random()*100);

    return "rgb("+grey+","+grey+","+grey+")";
  };

  var color = function(){
    return "rgb("+Math.floor(stochastic(0,255))+","+Math.floor(stochastic(0,255))+","+Math.floor(stochastic(0,255))+")";
  };

  var extend = function(to, from){
    for (var key in from){
      to[key] = from[key];
    }
  };

  var CreateTorsoTexture = function(opts){
    var primaryColor = opts.primaryColor || grey();
    var w = opts.w || 1000;
    var h = opts.h || 1000;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.fillStyle = grey();
    context.fillRect(0,0,2*w,2*h);
    bilateralPaint(context,w,h);
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  var davis = {
    random:function (x){return (Math.floor(Math.random()*x));},

    bell: function (x)
      {
        var i=Math.round((davis.random(x)+davis.random(x)+davis.random(x))/3);
        return i;
      },

    randomColor:function (x,full){
      if (x){ x=x.toLowerCase();}
      else{x=="none"}
      if (!full){var full=false;}

      var red=davis.random(255);
      var green=davis.random(255);
      var blue=davis.random(255);
      if (x=="grey" || x=="gray" || x=="fullgrey" || x=="fullgray"){
        blue=red;
        green=red;
        }
      if (x=='warm' || x=='hot'){
        red=200+davis.random(55);
        blue=davis.random(30);
      }
      if (x=='cool' || x=='cold'){
        blue=100+davis.random(155);
        red=davis.random(50);
      }
      if (x=="mammal" || x=="mammalian"){
        red=160+davis.random(85);
        green=red-40;
        blue=green/2;
      }
      var color="rgb("+red+","+green+","+blue+")";

      if (full==true){
        var text="#eee";
        var alpha0="rgba("+red+","+green+","+blue+",0)";
        var alpha1="rgba("+red+","+green+","+blue+",1)";
        if ((red+green+blue)>400){text="#111";}
        return {red:red,green:green,blue:blue,rgb:color,text:text,alpha0:alpha0,alpha1:alpha1};
        }
      else{
        return color;
        } 
      },

    alpha:function(colorString,number){
      colorString=colorString.replace(/rgb/,"rgba");
      colorString=colorString.replace(/[)]/,(","+number+")"));
      return colorString;
    },

    pick: function (x)
      {return x[davis.random(x.length)];},


    maybe:function(n,d,f){
      var d=davis.random(d);
      if (d<n){
        f.call();
      }
      else{return false;}
    },



    };

  var bilateralPaint = function(ctx,width,height){
    var color=davis.randomColor();
    var strokeStyle=davis.alpha(davis.randomColor("grey"),(0.5+(Math.random()/2)));
    var fillStyle=davis.alpha(color,Math.random());
    for (var i=0;i<4;i++){
      davis.maybe(1,2,function(){

        var lineWidth=1+davis.random(width/100);
        var r=davis.random(width/3);

        var x=r+lineWidth+davis.random((width/2)-r-lineWidth);
        var y=r+lineWidth+davis.random((height)-(2*(r+lineWidth)));
        ctx.beginPath();
        ctx.strokeStyle=strokeStyle;
        ctx.arc(x,y,r,0,2*Math.PI);
        ctx.lineWidth=lineWidth;
        ctx.fillStyle=fillStyle;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        x=width/2+(width/2)-x;
        ctx.arc(x,y,r,0,2*Math.PI);
        ctx.fillStyle=fillStyle;
        ctx.fill();
        ctx.stroke();
      });
    }
    for (var i=0;i<3;i++){
      davis.maybe(1,2,function(){
        var lineWidth=1+davis.random(width/100);
        var r=davis.random(width/3);
        var x=width/2;
        var y=r+lineWidth+davis.random((height)-(2*(r+lineWidth)));
        ctx.beginPath();
        ctx.strokeStyle=strokeStyle;
        ctx.arc(x,y,r,0,2*Math.PI);
        ctx.lineWidth=lineWidth;
        ctx.fillStyle=fillStyle;
        davis.maybe(1,3,function(){ctx.fill();});
        ctx.stroke();
      })
    }
  };

  var CreateTexture = function(opts){
    var primaryColor = opts.primaryColor || grey();
    var w = opts.w || 1000;
    var h = opts.h || 1000;
    var steps = opts.steps || 10;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.fillStyle = primaryColor;
    context.fillRect(0,0,2*w,2*h);
    context.fillStyle = grey();
    for (var i=0;i<Math.floor(h/steps);i++){
      context.fillRect(0,i*steps,2*w,2);
    }
    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  var props = {};

  props.RobotHead = function(group,opts){
    var centerX = 0;
    var w = stochastic(180,240);
    var h = stochastic(0.5*w, 1.2*w);
    var depth = stochastic(0.8*w, 1.2*w);
    var leftSide = centerX - (w/2);
    var rightSide = centerX + (w/2);
    var eyeX = leftSide+(w/4);
    var eyeRadius = stochastic(0.15*w, 0.05*w);
    var earRadius = stochastic(0.2*w, 0.1*w);
    var eyeY = stochastic(-0.3*h, 0.3*h);
    var headColor = grey("light");
    var earColor = grey();
    var lowerLidCurve = stochastic(1.2, 2);
    var upperLidCurve = stochastic(1.8, 2.4);
    var noseY = stochastic(eyeY-h/2, eyeY);
    var eyeColor = 0xffffff;

    group = group || new THREE.Object3D(headColor);
    

    var mat = new THREE.MeshPhongMaterial({color:headColor});
    var geom = new THREE.BoxGeometry(w, h, depth);
    var mesh = new THREE.Mesh(geom, mat);
    mesh.position.x = opts.x;
    mesh.position.y = opts.y;
    mesh.position.z = opts.z; 
    //csg experiment
    var bsp = new ThreeBSP( mesh );
    var subtraction_mesh = new THREE.Mesh( new THREE.BoxGeometry(w,h,depth) );
    extend(subtraction_mesh.position,opts);    
    subtraction_mesh.rotation.x = Math.PI/4;
    subtraction_mesh.position.y -= 0.7*h;
    subtraction_mesh.position.z -= 0.7*depth;

    //var subtraction_bsp = new ThreeBSP( subtraction_mesh );
    bsp = bsp.subtract( new ThreeBSP( subtraction_mesh)  );
    ///////////////////////
    var subtraction_mesh = new THREE.Mesh( new THREE.BoxGeometry(w,h,depth) );
    extend(subtraction_mesh.position, opts);
    subtraction_mesh.rotation.z = Math.PI/3;
    subtraction_mesh.position.x += 1*w;
    subtraction_mesh.position.y -= 0.5*h;
    bsp = bsp.subtract( new ThreeBSP( subtraction_mesh) );
    //////////////////
    var subtraction_mesh = new THREE.Mesh( new THREE.BoxGeometry(w,h,depth) );
    extend(subtraction_mesh.position, opts);
    subtraction_mesh.rotation.z = -Math.PI/3;
    subtraction_mesh.position.x -= 1*w;
    subtraction_mesh.position.y -= 0.5*h;
    bsp = bsp.subtract( new ThreeBSP( subtraction_mesh) );
    //////////////////

    var mesh = bsp.toMesh( new THREE.MeshPhongMaterial({ color:headColor }) );
    mesh.geometry.computeVertexNormals();

    //end experiment
    group.add(mesh);


    //eye
    var mat = new THREE.MeshBasicMaterial({color:eyeColor});
    var geom = new THREE.CylinderGeometry(eyeRadius, eyeRadius, 1, 20);
    var eye = new THREE.Mesh(geom, mat);
    eye.position.x = eyeX + opts.x;
    eye.position.y = opts.y + eyeY;
    eye.position.z = depth/2+opts.z;
    eye.rotation.x = Math.PI/2;

    //group.add(eye);

    //lower eyelid
    var mat = new THREE.MeshPhongMaterial({color:0xffffff});
    var geom = new THREE.CylinderGeometry(1.1*eyeRadius, 1.1*eyeRadius, 3, 20);
    var mesh = new THREE.Mesh(geom, mat); 
    mesh.position.x = eyeX + opts.x;
    mesh.position.y = opts.y + eyeY;
    mesh.position.z = depth/2+opts.z;
    mesh.rotation.x = Math.PI/2;
    //csg experiment
    var bsp = new ThreeBSP( mesh );
    var subtraction_mesh = new THREE.Mesh( new THREE.SphereGeometry(lowerLidCurve*eyeRadius) );
    extend(subtraction_mesh.position,opts);    
    subtraction_mesh.position.x = eyeX + opts.x;
    subtraction_mesh.position.y = opts.y + eyeY + eyeRadius;
    subtraction_mesh.position.z = depth/2+opts.z;
    var subtraction_bsp = new ThreeBSP( subtraction_mesh );
    var subtract_bsp = bsp.subtract( subtraction_bsp );

    var eyeBSP = new ThreeBSP(eye);
    eyeBSP = eyeBSP.subtract(subtract_bsp);
    var mesh = eyeBSP.toMesh( new THREE.MeshBasicMaterial({ color:eyeColor}) );
    mesh.geometry.computeVertexNormals();

    //end experiment
    group.add(mesh);


    //upper eyelid
    var mat = new THREE.MeshPhongMaterial();
    var geom = new THREE.CylinderGeometry(1.1*eyeRadius, 1.1*eyeRadius, 3, 20);
    var mesh = new THREE.Mesh(geom, mat); 
    mesh.position.x = eyeX + opts.x;
    mesh.position.y = opts.y + eyeY;
    mesh.position.z = depth/2+opts.z;
    mesh.rotation.x = Math.PI/2;
    //csg experiment
    var bsp = new ThreeBSP( mesh );
    var subtraction_mesh = new THREE.Mesh( new THREE.SphereGeometry(upperLidCurve*eyeRadius) );
    extend(subtraction_mesh.position,opts);    
    subtraction_mesh.position.x = eyeX + opts.x;
    subtraction_mesh.position.y = opts.y + eyeY - eyeRadius;
    subtraction_mesh.position.z = depth/2+opts.z;
    var subtraction_bsp = new ThreeBSP( subtraction_mesh );
    var subtract_bsp = bsp.subtract( subtraction_bsp );
    var mesh = subtract_bsp.toMesh( new THREE.MeshPhongMaterial({ color:headColor}) );
    mesh.geometry.computeVertexNormals();
    //end experiment
    group.add(mesh);

    //left eye
    var mat = new THREE.MeshBasicMaterial({color:eyeColor});
    var geom = new THREE.CylinderGeometry(eyeRadius, eyeRadius, 1, 20);
    var eye = new THREE.Mesh(geom, mat);
    eye.position.x = centerX-eyeX+opts.x;
    eye.position.y = opts.y + eyeY;
    eye.position.z = depth/2+opts.z;
    eye.rotation.x = Math.PI/2; 

    //lower eyelid
    var mat = new THREE.MeshPhongMaterial({color:0xffffff});
    var geom = new THREE.CylinderGeometry(1.1*eyeRadius, 1.1*eyeRadius, 3, 20);
    var mesh = new THREE.Mesh(geom, mat); 
    mesh.position.x = centerX-eyeX + opts.x;
    mesh.position.y = opts.y + eyeY;
    mesh.position.z = depth/2+opts.z;
    mesh.rotation.x = Math.PI/2;
    //csg experiment
    var bsp = new ThreeBSP( mesh );
    var subtraction_mesh = new THREE.Mesh( new THREE.SphereGeometry(lowerLidCurve*eyeRadius) );
    extend(subtraction_mesh.position,opts);    
    subtraction_mesh.position.x = centerX - eyeX + opts.x;
    subtraction_mesh.position.y = opts.y + eyeY + eyeRadius;
    subtraction_mesh.position.z = depth/2+opts.z;
    var subtraction_bsp = new ThreeBSP( subtraction_mesh );
    var subtract_bsp = bsp.subtract( subtraction_bsp );
    var eyeBSP = new ThreeBSP(eye);
    subtract_bsp = eyeBSP.subtract(subtract_bsp);
    var mesh = subtract_bsp.toMesh( new THREE.MeshBasicMaterial({ color:eyeColor}) );
    mesh.geometry.computeVertexNormals();

    //end experiment
    group.add(mesh);

    //upper eyelid
    var mat = new THREE.MeshPhongMaterial();
    var geom = new THREE.CylinderGeometry(1.1*eyeRadius, 1.1*eyeRadius, 3, 20);
    var mesh = new THREE.Mesh(geom, mat); 
    mesh.position.x = centerX - eyeX + opts.x;
    mesh.position.y = opts.y + eyeY;
    mesh.position.z = depth/2+opts.z;
    mesh.rotation.x = Math.PI/2;
    //csg experiment
    var bsp = new ThreeBSP( mesh );
    var subtraction_mesh = new THREE.Mesh( new THREE.SphereGeometry(upperLidCurve*eyeRadius) );
    extend(subtraction_mesh.position,opts);    
    subtraction_mesh.position.x = centerX - eyeX + opts.x;
    subtraction_mesh.position.y = opts.y + eyeY - eyeRadius;
    subtraction_mesh.position.z = depth/2+opts.z;
    var subtraction_bsp = new ThreeBSP( subtraction_mesh );
    var subtract_bsp = bsp.subtract( subtraction_bsp );
    var mesh = subtract_bsp.toMesh( new THREE.MeshPhongMaterial({ color:headColor}) );
    mesh.geometry.computeVertexNormals();
    //end experiment
    group.add(mesh);


    var mat = new THREE.MeshPhongMaterial({color:earColor});
    var geom = new THREE.SphereGeometry(earRadius);
    var mesh = new THREE.Mesh(geom,mat);
    extend(mesh.position, opts);
    mesh.position.y += eyeY;
    mesh.position.x -= w/2;
    group.add(mesh);

    var mat = new THREE.MeshPhongMaterial({color:earColor});
    var geom = new THREE.SphereGeometry(earRadius);
    var mesh = new THREE.Mesh(geom,mat);
    extend(mesh.position, opts);
    mesh.position.y += eyeY;
    mesh.position.x +=w/2;
    group.add(mesh);

    return group;
  };

  props.RobotTorso = function(group, opts){
    group = group || new THREE.Object3D();

    var w = stochastic(200,300);
    var h = stochastic(0.5*w, 1.5*w);
    var d = stochastic(0.8*w, 1.2*w);

    var shoulderRadius = stochastic(0.1*w, 0.3*w);
    var handRadius = stochastic(0.1*w, 0.2*w);
    var elbowRadius = stochastic(0.05*w, 0.15*w);
    var armAngle = Math.PI / stochastic(1.15, 1.5) ;
    var lightRadius = stochastic(0.05*w, 0.2*w);
    var spinalColumnRadius = stochastic(0.1*w, 0.25*w);
    var thickTorsoColor = grey();
    var collarWidth = stochastic(0.1*w, 0.4*w);

    //the actual torso
    var mat = new THREE.MeshPhongMaterial({color:thickTorsoColor});
    var geom = new THREE.SphereGeometry(0.5*w);
    var mesh = new THREE.Mesh(geom,mat);
    extend(mesh.position,opts);
    //csg 
    var bsp = new ThreeBSP( mesh );
    var subtraction_mesh = new THREE.Mesh( new THREE.CylinderGeometry(0.5*w, 0.1*w, 2*w, 20) );
    extend(subtraction_mesh.position,opts);    
    subtraction_mesh.rotation.x = Math.PI/3;
    subtraction_mesh.position.y -= 0.8*w;
    var subtraction_bsp = new ThreeBSP( subtraction_mesh );
    bsp = bsp.subtract( subtraction_bsp );
    //the collar cylinder addition
    var addition_mesh = new THREE.Mesh( new THREE.CylinderGeometry(collarWidth, collarWidth, 0.5*w, 5) );
    extend(addition_mesh.position, opts);
    addition_mesh.position.y += 0.3*w;
    bsp = bsp.union( new ThreeBSP(addition_mesh));
    //the collar cylindar removal
    var subtraction_mesh = new THREE.Mesh( new THREE.CylinderGeometry(0.5*w, 0.1*w, 2*w, 20) );
    extend(subtraction_mesh.position,opts);    
    subtraction_mesh.rotation.x = -Math.PI/3;
    subtraction_mesh.position.y += 0.8*w;
    var subtraction_bsp = new ThreeBSP( subtraction_mesh );
    bsp = bsp.subtract( subtraction_bsp );
    var mesh = bsp.toMesh( new THREE.MeshPhongMaterial({ map: CreateTorsoTexture({primaryColor:color(), w:w, h:h, steps:50 }) }) );
    mesh.geometry.computeVertexNormals();
    //end csg
    group.add(mesh);

    //iron man light
    var lightEdges = Math.floor(stochastic(3,20));
    var mat = new THREE.MeshPhongMaterial({color:0x333333});
    var geom = new THREE.CylinderGeometry(1.3*lightRadius, lightRadius, d/2, lightEdges);
    var mesh = new THREE.Mesh(geom, mat);
    extend(mesh.position,opts);
    mesh.position.z = (0.25*w)+opts.z;
    mesh.position.y += 0.2*w;
    mesh.rotation.x = Math.PI/2.2;
    group.add(mesh);
    var mat = new THREE.MeshBasicMaterial({color:0xeeeeee});
    var geom = new THREE.CylinderGeometry(lightRadius, lightRadius, d/2, lightEdges);
    var mesh = new THREE.Mesh(geom, mat);
    extend(mesh.position,opts);
    mesh.position.y += 0.2*w;
    mesh.position.z = (0.26*w)+opts.z;
    mesh.rotation.x = Math.PI/2.2;
    group.add(mesh);

    //spinal column
    var mat = new THREE.MeshPhongMaterial( {map:CreateTexture({primaryColor:"#dddddd", w:w, h:h}) } );
    var geom = new THREE.CylinderGeometry(spinalColumnRadius, spinalColumnRadius, 150);
    var mesh = new THREE.Mesh(geom, mat);
    extend(mesh.position, opts);
    mesh.position.y -= 0.5*w;
    mesh.rotation.x = -Math.PI/16;
    group.add(mesh);

    //arm ring
    var mat = new THREE.MeshPhongMaterial({color:thickTorsoColor});
    var geom = new THREE.TorusGeometry(0.6*w, elbowRadius)
    var mesh = new THREE.Mesh(geom, mat);
    var bsp = new ThreeBSP(mesh);
    var subtraction_mesh = new THREE.Mesh( new THREE.SphereGeometry(0.5*w) );
    subtraction_mesh.position.y += 0.7*w;
    bsp = bsp.subtract(new ThreeBSP(subtraction_mesh) );
    mesh = bsp.toMesh( new THREE.MeshPhongMaterial({ color:0x555555}) );
    mesh.geometry.computeVertexNormals();    
    extend(mesh.position, opts);
    mesh.rotation.x = armAngle;
    mesh.position.y -= 0.15*w;
    mesh.position.z += 0.3*w;
    group.add(mesh);

    props.RobotHead(group,{x:0+opts.x,y:w+opts.y,z:0});

    return group;
  };

  props.RobotHips = function(group, opts){
    group = group || new THREE.Object3D();

    var w = stochastic(100,130);
    var h = stochastic(0.2*w, 0.5*w);

    var mat = new THREE.MeshPhongMaterial({color:0x333333});
    var geom = new THREE.TorusGeometry(w,0.2*w,10,20);
    var mesh = new THREE.Mesh(geom,mat);
    extend(mesh.position, opts);
    mesh.position.y = opts.y+(2*h);    
    mesh.rotation.x = Math.PI/2;
    group.add(mesh);

    props.RobotTorso(group,{x:0+opts.x,y:opts.y+h+250,z:0});

    return group;
  };

  props.RobotLegs = function(group, opts){
    group = group || new THREE.Object3D();
    var w = stochastic(100,150);

    var mat = new THREE.MeshPhongMaterial({color:0x555555});
    var geom = new THREE.SphereGeometry(w,10,10);
    var mesh = new THREE.Mesh(geom,mat);
    extend(mesh.position, opts);
    mesh.position.y = opts.y+w;
    group.add(mesh);

    props.RobotHips(group,{x:0+opts.x,y:opts.y+w,z:opts.z});

    return group;
  };

  props.Ground = function(y){
    var y = y || 0;
    var group = new THREE.Object3D();
    var x, y, z;

    var maxSize = maxSize >= 1000 ? maxSize : 500;
    var interval = maxSize / 5;
    var material = new THREE.LineBasicMaterial( { color: 0x333333 } );

    // back horizontal
    y = -maxSize; // +yMod;
    while (y < maxSize) {
      var geometry = new THREE.Geometry();
      z = -2 * maxSize;
      y += interval; 

      geometry.vertices.push( new THREE.Vector3( -4*maxSize, y, z ) );
      geometry.vertices.push( new THREE.Vector3( 4 * maxSize, y, z  ) );
      
      var line = new THREE.Line( geometry, material );
      group.add(line);
    }

    // back  & bottom vertical
    x = 4*-maxSize - interval;
    while (x < 4 * maxSize) {
      var geometry = new THREE.Geometry();
      z = -2 * maxSize;
      x += interval; 

      geometry.vertices.push( new THREE.Vector3( x, -maxSize, maxSize));   // +yMod (3)
      geometry.vertices.push( new THREE.Vector3( x, -maxSize, z ) );
      geometry.vertices.push( new THREE.Vector3( x, maxSize, z ) );
      
      var line = new THREE.Line( geometry, material );
      group.add(line);
    }


    // bottom horizontal
    z = maxSize + interval;
    while (z > -2 * maxSize) {
      var geometry = new THREE.Geometry();
      y = -maxSize;   // +yMod
      z -= interval; 

      geometry.vertices.push( new THREE.Vector3( -4*maxSize, y, z ) );
      geometry.vertices.push( new THREE.Vector3( 4 * maxSize, y, z ) );
      
        var line = new THREE.Line( geometry, material );
        group.add(line);
      }
      return group;
  };

  props.Robot = function(opts){
    var group = new THREE.Object3D();
    group.animations = {};
    props.RobotLegs(group,{x:0+opts.x,y:-500,z:0});
    return group;
  };

  window.props = props;

})();