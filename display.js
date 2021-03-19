//CMPM 163-lab7 was the basis for much of the scene setup here + the initial shader code

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

let totalBranches = 0
let pointsArray = [0,1.0,0.5]
let indexBuffer = []
let globalIndex = 0

//Code modified from fractal.js, with the drawing parts removed
function drawCrack(depth, theta, maxTheta, maxLength, length, branchProb, x, y, currentAngle){
    let totalLength = 0
    let totalTheta = 0//used in calculation of how directional the entire crack is. Might be screwed up because of recursion
    while(totalLength < maxLength && depth > 1){
        
        let savedX = x
        let savedY = y
        let savedTheta = currentAngle
        let randomTheta = (Math.random()-0.5) * theta *2
        let priorIndex = globalIndex;
        if(Math.random(100) < branchProb * 100){//branching
            drawCrack(depth - 1, randomTheta, maxTheta, maxLength/4, length, branchProb, x, y, currentAngle)//max length and length are changed to make the subcracks smaller
        }
        
        globalIndex += 1
        x = savedX
        y = savedY
        currentAngle = savedTheta

        
        randomTheta = Math.random(-theta, theta)
        if(totalTheta + randomTheta > maxTheta || totalTheta + randomTheta < -maxTheta){
            randomTheta = -randomTheta
        }
        let randomLength = Math.random() * length
        totalLength += Math.abs(randomLength)
        
        totalTheta += randomTheta
        currentAngle += randomTheta
        //console.log(currentAngle)
        let cartesianXY = polarToCartesian(randomLength, currentAngle)
        x += cartesianXY[0]
        y += cartesianXY[1]
        let height = Math.random()*2
        let width = Math.random()
        pointsArray.push( [x, y, width, height])
        //console.log(index)
        //console.log(branched)
        
        indexBuffer.push([globalIndex, priorIndex])
        
    }
}

function polarToCartesian(r, theta){
    x = r * Math.cos(theta)
    y = r * Math.sin(theta)
    return [x,y]
}

function getPointsArray(){
    pointsArray.flat()
    return pointsArray
}

function getIndexBuffer(){
    indexBuffer.flat()
    return indexBuffer
}
drawCrack(3, 70, 60, 1000, 100, .07, 0, 0, 0)
//Need to process the points array
let flatPointsArray = getPointsArray().flat();
let actPointsArray = []
for(let i = 0; i < flatPointsArray.length/4; i++){
    //Both x and y need to be scaled significantly
    actPointsArray.push(flatPointsArray[i*4]/50-0.5)
    //Y also need to be negated (will become z)
    actPointsArray.push(-flatPointsArray[i*4+1]/50-1.0)
    //And we only need the depth now, so will average depth/height
    actPointsArray.push((flatPointsArray[i*4+2] + flatPointsArray[i*4+3])/10)
}
console.log(getIndexBuffer())
//Initialise 

function addShaderCube() {
	if(count == 2) {
          geometry1 = new THREE.BoxGeometry(2, 1, 1);
        var tempPointsArray = actPointsArray.slice(0, 50)
        var tempConnections = indexBuffer.flat().slice(0,20)
        var uniforms = {points: {type:"fv", value:tempPointsArray},
                        connections: {type: "fv", value: tempConnections},
                        numConnections: {type: "int", value: 5}};
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


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //if (light.position.x > 10 || light.position.x < -10) {
    //    delta *= -1.0;
    //} 
    //light.position.x += delta;

}
animate();