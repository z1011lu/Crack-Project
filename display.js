// setup the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 
window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;
camera.position.x = -2
camera.position.y = 2

// add the light
var light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(10, 10, 10);
//scene.add(light);

var geometry1, material1, mesh1;

//the voxels
let voxelArray = []
//Initialise all the voxels
for(let i = 0; i < 100; i++){
    for(let j = 0; j <100; j++){
        voxelArray[100*i + j] = 20
    }
}

//Initialise 

function addShaderCube() {
	if(count == 2) {
  		geometry1 = new THREE.BoxGeometry(1, 1, 1);
  		var uniforms = {"voxels" : voxelArray};
  		material1 =  new THREE.ShaderMaterial({
			        		uniforms: uniforms,
			  			fragmentShader: fshader,
			          		vertexShader: vshader,
			  			precision: "mediump"});

  		mesh1 = new THREE.Mesh(geometry1, material1);
  		scene.add(mesh1);
	}
}



THREE.Cache.enabled = true;
var count = 0;
var loader = new THREE.FileLoader();
var fshader, vshader;


loader.load('shaders/vertexShader.vert',
    // onLoad callback
    function (data) {
        console.log(data); // output the text to the console
        vshader = data;
        count += 1;
        addShaderCube(); // we will write this method
    },
    // onProgress callback
    function (xhr) {
        console.log((xhr.loaded/xhr.total * 100)+ '% loaded');
    },
    // onError callback
    function (err) {
        console.error('An error happened');
    });

loader.load('shaders/fragmentShader.frag',
    // onLoad callback
    function (data) {
        console.log(data); // output the text to the console
        fshader = data;
        count += 1;
        addShaderCube(); // we will write this method
    },
    // onProgress callback
    function (xhr) {
        console.log((xhr.loaded/xhr.total * 100)+ '% loaded');
    },
    // onError callback
    function (err) {
        console.error('An error happened');
    });

var delta = 0.3;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //if (light.position.x > 10 || light.position.x < -10) {
    //    delta *= -1.0;
    //} 
    //light.position.x += delta;

}
animate();