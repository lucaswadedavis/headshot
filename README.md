# Bot Hangar

The Bot Hangar is a proof-of-concept demonstration of procedurally generated, parametrically designed robot avatars. Reloading the page will create 7 more.

## The Code

The two interesting files will be theatre.js and props.js. Theatre is the class for creating the scene, handling camera and lighting, the render loop and any other functionality not specific to things in the scene itself.

Props holds a few publicly available methods (most of which have to do with creating a new Robot - one creates the wireframe floor), and several private utility methods, hidden within the scope of the iife.

The robot is built from the ground up, with each of a series of methods calling the next in the chain for body parts progressively farther from the ground. The methods are long, but they're responsible for procedurally generating the meshes of the robot - including some binary space partitioning magic to handle additions and subtractions to individual meshes along the way. This all progressively constructs a 15 member instance of the THREE.Object3D class (a single robot).

## Todo Later

I'd like to 
- separate the arms (at the moment, they're a hacked apart torus) and extract them into their own method.  
- make the eyes blink
- add fingers
- add some ornaments to the head
- figure out how to fit my bilaterally symetrical canvas drawing to the sphericalish torsos so it actually looks bilaterally symetrical

All in all, I'm not terribly ashamed of this as a weekend project.


