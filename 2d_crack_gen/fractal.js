let totalBranches = 0
//let totalTheta = 0

function setup() {
    createCanvas(800, 600)
    //getBranchValues(depth, length, theta), branchValues
    randomSeedNum = random(1000)
}

function draw() {
    let depth = 3//How much recursion. Value should be 3 if branchProb is 10%. Too little and there is likely no branching. Too much and it starts to look like a fractal
    let branchProb = 0.07 //How likely is the crack to branch at the end of a segment. Should be 0.1 if depth is 3
    let theta = 1  //used for the upperlimit and lower limit of the random angle a new crack will be
    let maxTheta = .4 //Threshhold for how random/directional the angle of the entire crack is. More testing needed for what this value should be. Might be messed up because of recursion
    let length = 30 //Should be close to 30 so the crack sections are small enough to feel craggly
    let maxLength = 600 //Should almost be canvas height if the crag want to take up most of the screen(would never be 100% because the crack curves)

    background(0)//make the background black
    translate(width / 2, height) //move drawing tool to bottom middle of the screen
    stroke(50, 250, 50)//make the pen green
    randomSeed(randomSeedNum) //seed
    drawCrack(depth, theta, maxTheta, maxLength, length, branchProb)
}


function drawCrack(depth, theta, maxTheta, maxLength, length, branchProb){
    let totalLength = 0
    let totalTheta = 0//used in calculation of how directional the entire crack is. Might be screwed up because of recursion
    while(totalLength < maxLength && depth > 1){
        push()
        let randomTheta = random(-theta, theta)
        if(random(100) < branchProb * 100){//branching
            drawCrack(depth - 1, randomTheta, maxTheta, maxLength/4, length/2)//max length and length are changed to make the subcracks smaller
        }
        pop()

        let randomLength = random(0, length)
        totalLength += randomLength
        line(0,0,0, -randomLength)
        
        translate(0,-randomLength)
        randomTheta = random(-theta, theta)
        if(totalTheta + randomTheta > maxTheta || totalTheta + randomTheta < -maxTheta){
            randomTheta = -randomTheta
        }
        rotate(randomTheta)
        totalTheta += randomTheta
    }
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
