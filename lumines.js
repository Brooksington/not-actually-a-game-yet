import { Block } from "./blocks.js";
import { Particle } from "./particles.js";
import { ControlBar } from "./control_bar.js";
//constructor(x,y,size,color), grow and diminish(), generateParticles(array=[],n)
let blockColor1=`hsla(191, 100%, 50%, 0.9)`;
let blockColor2=`hsla(312, 100%, 50%, 0.9)`;
let blockBorderColor=`hsla(264, 100%, 100%, 0.8)`;
const backgroundBoard = document.getElementById("canvas1");
const BBContext = backgroundBoard.getContext("2d");
backgroundBoard.width=window.innerWidth;
backgroundBoard.height=window.innerHeight;
let xCenter=Math.round(window.innerWidth/2);
let yCenter=Math.round(window.innerHeight/2);
let speed=2;
let hue=0;
let blockSize=Math.round(window.innerHeight*0.035);
const particles = [];


window.addEventListener('resize', () => {
    backgroundBoard.width=window.innerWidth;
    backgroundBoard.height=window.innerHeight;
    xCenter=Math.round(window.innerWidth/2);
    yCenter=Math.round(window.innerHeight/2);
    blockSize=Math.round(window.innerHeight*0.035);
    drawBlackground();
});

//generates a matrix of dimensions (width,height) for use as game board. Input values for lumines should be 32x20
const generateBoard = (width,height) => {
    const matrix = [];
    while(height--){
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}
const board=generateBoard(32,20);

//draws a low alpha solid black background with every single frame, the lower the value, you get more of the trailing effect/motion blur. Higher for a lesser effect.
const drawBlackground = () => {
    BBContext.fillStyle='rgba(0,0,0,0.3)';
    BBContext.fillRect(0,0,window.innerWidth,window.innerHeight);
}

const clearScreen = () =>{
    BBContext.clearRect(0,0,window.innerWidth,window.innerHeight);
}

const particleManipulation = () => {
    //Particle.generateParticles(particles,100,scanLinePos-2,undefined,undefined,hue);
    Particle.renderParticles(BBContext,particles);
    Particle.renderParticles(BBContext,rotationParticles);
    Particle.diminish(particles);
    Particle.grow(rotationParticles,blockSize*3,1.05);
    Particle.elminateParticles(particles);
    Particle.elminateParticles(rotationParticles,0.2,blockSize*3);
}

let gradientPosition=0.1;
let gradientIncrementer = 0.01;
//global variables denoting board position and bounds of game board.
const yOffset=25;
let lineStartXAxis=Math.round(xCenter-(blockSize*16));
let lineStopXAxis=Math.round(lineStartXAxis+(blockSize*32));
let lineStartYAxis=Math.round(yCenter-(blockSize*10)+yOffset);
let lineStopYAxis=Math.round(lineStartYAxis+(blockSize*20));
const renderBoard = () => {
    lineStopXAxis=lineStartXAxis+(blockSize*32);
    let newLineStartXAxis=lineStartXAxis;

    //board gradient definition and variables
    const gradient=BBContext.createLinearGradient(xCenter,window.innerHeight,xCenter,0);
    gradient.addColorStop(0,"hsla(264, 100%, 39%, 0.8)");
    gradient.addColorStop(gradientPosition, "hsla(179, 100%, 100%, 1)");
    gradient.addColorStop(1,"hsla(264, 100%, 39%, 0.8)");
    if(gradientPosition>0.96||gradientPosition<0.04) gradientIncrementer*=-1;
    gradientPosition+=gradientIncrementer;
    //draw vertical lines on board, spacing determined by blockSize variable
    for(let i=0;i<(board[0].length/2)+1;i++){
        BBContext.beginPath();
        BBContext.strokeStyle=gradient;
        BBContext.lineWidth=1.5;
        BBContext.moveTo(newLineStartXAxis,lineStartYAxis);
        BBContext.lineTo(newLineStartXAxis,lineStopYAxis);
        BBContext.stroke();
        newLineStartXAxis+=2*blockSize;
    }

    //draw horizontal line on bottom of board, location again determined by blockSize
    BBContext.beginPath();
    BBContext.strokeStyle=gradient;
    BBContext.lineWidth=1.5;
    BBContext.moveTo(lineStartXAxis,lineStopYAxis);
    BBContext.lineTo(lineStopXAxis,lineStopYAxis);
    BBContext.stroke();
    newLineStartXAxis=lineStartXAxis;
}

let playBlock = new Block(xCenter,lineStartYAxis-(2*blockSize));
const controlBar = new ControlBar(xCenter,blockSize,lineStartXAxis,lineStopXAxis,lineStartYAxis,true,xCenter,playBlock);

const upcomingBlockArray=[new Block(lineStartXAxis-(4*blockSize),lineStartYAxis)];
let updatedUpcomingBlockPosition=false;
const upcomingBlocks = () => {
    for(let i=upcomingBlockArray.length;i<3;i++){
        upcomingBlockArray.push(new Block((lineStartXAxis-(blockSize*4)),(lineStartYAxis)));
        updatedUpcomingBlockPosition=false;
    }
    if(!updatedUpcomingBlockPosition){
        upcomingBlockArray[0].yPos=lineStartYAxis;
        upcomingBlockArray[1].yPos=lineStartYAxis + blockSize*4;
        upcomingBlockArray[2].yPos=lineStartYAxis + blockSize*8;
        updatedUpcomingBlockPosition=true;
    }
    
}

let scanLinePos = lineStartXAxis-25;
const drawScanLine = () =>{
    BBContext.beginPath();
    BBContext.moveTo(scanLinePos,(lineStartYAxis-10));
    BBContext.lineTo(scanLinePos,window.innerHeight);
    BBContext.strokeStyle='hsl('+ hue +',100%,50%)';
    hue++;
    if(hue>360){hue=0;}
    BBContext.lineWidth=1;
    BBContext.stroke();
    scanLinePos+=speed;
    if(scanLinePos>lineStopXAxis+25){
        scanLinePos=lineStartXAxis-25;
    }
}

/*const cascade = () => {
    for(let i=0;i<board.length-1;i++){
        for(let j=0;j<board[i].length;j++){
            if(board[i][j]&&!board[i+1][j]){
                board[i+1][j]=board[i][j];
            }
        }
    }
}*/

const collide = () => {
    controlBar.toggleControl();
    playBlock = upcomingBlockArray.shift();
    playBlock.xPos = xCenter;
    playBlock.yPos = lineStartYAxis-(2*blockSize);
    upcomingBlocks();
    //cascade();
}

const draw = () => {
    drawBlackground();
    particleManipulation();
    renderBoard();
    controlBar.renderControlBar(BBContext);
    playBlock.renderBlock(BBContext,blockSize,blockColor1,blockColor2,blockBorderColor);
    upcomingBlocks();
    for(let i=0;i<upcomingBlockArray.length;i++){
        upcomingBlockArray[i].renderBlock(BBContext,blockSize,blockColor1,blockColor2,blockBorderColor);
    }
    drawScanLine();
    requestAnimationFrame(draw);
}

const rotationParticles = [];
document.addEventListener('keydown', (event) => {
    if(event.key===" "){
        playBlock.rotateClockwise();
        if(!controlBar.inControl) playBlock.updatePosition(board,blockSize,lineStartXAxis,lineStartYAxis);
        Particle.generateParticles(rotationParticles,1,playBlock.xPos+blockSize,playBlock.yPos+blockSize,blockSize,hue);
    } else if(event.key==="Control"){
        playBlock.rotateCounterClockwise();
        if(!controlBar.inControl) playBlock.updatePosition(board,blockSize,lineStartXAxis,lineStartYAxis);
        Particle.generateParticles(rotationParticles,1,playBlock.xPos+blockSize,playBlock.yPos+blockSize,blockSize,hue);
    } else if(event.key==="ArrowRight"){
        controlBar.moveRight();
        playBlock.moveRight(board,blockSize,lineStopXAxis,lineStartXAxis,lineStartYAxis,controlBar.inControl);
    } else if(event.key==="ArrowLeft"){
        controlBar.moveLeft();
        playBlock.moveLeft(board,blockSize,lineStartXAxis,lineStartYAxis,controlBar.inControl);
    } else if(event.key==="ArrowDown"){
        if(controlBar.inControl) controlBar.dropBlock(playBlock,board,blockSize,lineStartXAxis,lineStartYAxis);
        else playBlock.drop(board,blockSize,lineStopYAxis,lineStartXAxis,lineStartYAxis,collide);
    } else if(event.key==="ArrowUp"){
        playBlock.upDebug(board,blockSize,lineStartXAxis,lineStartYAxis);
    } else if(event.key==="Shift"){
        controlBar.toggleControl();
    }
});



drawBlackground();
draw();
console.log(backgroundBoard);
console.log(BBContext);
