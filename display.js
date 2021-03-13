// setup the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 
window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 1;

// add the light
var light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(10, 10, 10);
//scene.add(light);

var geometry1, material1, mesh1;

//the voxels
const size = 128;
const voxels = new Uint8Array( size * size * size );
//Initialise all the voxels
for(let i = 0; i < 100; i++){
    for(let j = 0; j <100; j++){
        for(let k = 0; k <100; k++){
            let index = 3*(size*size*i + size*j + k)
            voxels[index] = Math.max(0,100-k)
            voxels[index+1] = 100
            voxels[index+2] = 100
        }
           
    }
}

const voxTexture = new THREE.DataTexture3D( voxels, size, size, size );
//const shader = VolumeRenderShader1;
//Initialise 

function addShaderCube() {
	if(count == 2) {
  		geometry1 = new THREE.BoxGeometry(1, 1, 1);
  		var uniforms = {"voxels" : voxTexture};
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

//let testGeom = new THREE.BoxGeometry(1,1,1)
//let testMaterial = new THREE.MeshPhongMaterial({map:texture})
//let testCube = new THREE.Mesh(testGeom, testMaterial)
//scene.add(testCube)

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //if (light.position.x > 10 || light.position.x < -10) {
    //    delta *= -1.0;
    //} 
    //light.position.x += delta;

}
animate();