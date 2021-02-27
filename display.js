var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,
	window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

var light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(10, 10, 10);
scene.add(light);

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
var cube = new THREE.Mesh(geometry, material); 
scene.add(cube);