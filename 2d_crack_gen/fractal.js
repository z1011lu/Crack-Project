let totalBranches = 0
//let totalTheta = 0
//let currentAngle = 0
let pointsArray = []
let indexBuffer = []


function setup() {
    createCanvas(1024, 1024)
    //getBranchValues(depth, length, theta), branchValues
    randomSeedNum = random(1000)
    angleMode(DEGREES)
}

function draw() {
    let depth = 3//How much recursion. Value should be 3 if branchProb is 10%. Too little and there is likely no branching. Too much and it starts to look like a fractal
    let branchProb = 0.07 //How likely is the crack to branch at the end of a segment. Should be 0.1 if depth is 3
    let theta = 70  //used for the upperlimit and lower limit of the random angle a new crack will be
    let maxTheta = 60 //Threshhold for how random/directional the angle of the entire crack is. More testing needed for what this value should be. Might be messed up because of recursion
    let length = 100 //Should be close to 30 so the crack sections are small enough to feel craggly
    let maxLength = 1000 //Should almost be canvas height if the crag want to take up most of the screen(would never be 100% because the crack curves)


    //TESTING PRESET
    //depth = 2
    //length = 150


    background(0)//make the background black

    translate(width / 2, height) //move drawing tool to bottom middle of the screen
    stroke(50, 250, 50)//make the pen green
    randomSeed(randomSeedNum) //seed
    push()
    drawCrack(depth, theta, maxTheta, maxLength, length, branchProb, 0, 0, 0, 0, false)
    pop()
    drawLines(pointsArray)
    //console.log(pointsArray)
    //console.log(currentAngle)
    console.log(indexBuffer)

    noLoop()
}

function drawCrack(depth, theta, maxTheta, maxLength, length, branchProb, x, y, currentAngle, index, branched){
    let totalLength = 0
    let totalTheta = 0//used in calculation of how directional the entire crack is. Might be screwed up because of recursion
    while(totalLength < maxLength && depth > 1){
        
        push()
        let savedX = x
        let savedY = y
        let savedTheta = currentAngle
        let randomTheta = random(-theta, theta)
        if(random(100) < branchProb * 100){//branching
            drawCrack(depth - 1, randomTheta, maxTheta, maxLength/4, length, branchProb, x, y, currentAngle, index, true)//max length and length are changed to make the subcracks smaller
        }
        
        index += 1
        pop()
        x = savedX
        y = savedY
        currentAngle = savedTheta

        
        randomTheta = random(-theta, theta)
        if(totalTheta + randomTheta > maxTheta || totalTheta + randomTheta < -maxTheta){
            randomTheta = -randomTheta
        }
        rotate(randomTheta)
        let randomLength = random(0.0, length)
        totalLength += abs(randomLength)
        line(0,0,0, -randomLength)
        
        translate(0,-randomLength)
        totalTheta += randomTheta
        currentAngle += randomTheta
        //console.log(currentAngle)
        let cartesianXY = polarToCartesian(randomLength, currentAngle)
        x += cartesianXY[0]
        y += cartesianXY[1]
        let height = random(0, -2)
        let width = -noise(x, y)
        append(pointsArray, [x, y, width, height])
        console.log(index)
        console.log(branched)
        if(branched == true){
            append(indexBuffer, [index, index -1])
        }
        branched = false
    }
}

function polarToCartesian(r, theta){
    x = r * cos(theta)
    y = r * sin(theta)
    return [x,y]
}

function drawCube(sideLength, width, height){
    stroke(255)//make color
    fill(150)
    let posY_u = width/2 - sideLength/2
    let posY_v =  height - sideLength
    rect(posY_u, posY_v, sideLength) //x and y coord for sideLength and to the left for next square
    let negZ_u = width/2 - sideLength/2
    let negZ_v = height - 2 * sideLength
    rect(negZ_u, negZ_v, sideLength)//draw -z side
    let negY_u = width/2 - sideLength/2
    let negY_v = height - 3 * sideLength
    rect(negY_u, negY_v, sideLength)
    let negX_u = width/2 - sideLength * 3/2
    let negX_v =height - 3 * sideLength
    rect(negX_u, negX_v, sideLength)
    let posX_u = width/2 - sideLength * -1/2
    let posX_v =height - 3 * sideLength
    rect(posX_u, posX_v, sideLength)

    
    let posZ_u = width/2 - sideLength/2
    let posZ_v = height - 4 * sideLength
    rect(posZ_u, posZ_v, sideLength)

    //translate left sidelength
    //draw -x side
    //translate right 2 * sidelength 
    //draw +x side
    //translate left sideLength, up sideLength
    //draw +z side
    //translate up sideLength
    //draw +y side

}

function drawLines(array){
    stroke(255, 255, 255)
    for(i = 0; i < array.length -1; i++){
        line(array[i][1], -array[i][0], array[i+1][1], -array[i+1][0])
        //console.log(-array[i][1], -array[i][0], -array[i+1][1], -array[i+1][0])
    }
}

function getPointsArray(){
    pointsArray.flat()
    return pointsArray
}

function getIndexBuffer(){
    return indexBuffer
}
/*
function branch(length){
    line(0,0,0, -length)
    translate(0, -length)
    if (length > 1) {
        push()
            rotate(PI / 4)
            branch(length * 0.75)
        pop()
        push()
            rotate(-PI/4)
            branch(length * 0.75)
        pop()
    }
}
*/
