export class ControlBar{
    constructor(center,blockSize,startX,endX,startY,inControl,currentPos,controlledBlock){
        this.center=center;
        this.blockSize=blockSize;
        this.startX=startX;
        this.endX=endX;
        this.startY=startY;
        this.inControl=inControl;
        this.currentPos=currentPos;
        this.controlledBlock=controlledBlock;
    }

    toggleControl(){
        this.inControl=!this.inControl;
        if(this.inControl){
            this.currentPos=this.center;
        }
        return this.inControl;
    }

    moveLeft(){
        if(this.inControl){
            if(this.currentPos<=this.startX){
                this.currentPos=this.startX;
                return;
            }
            this.currentPos-=this.blockSize;
        }
    }

    moveRight(){
        if(this.inControl){
            if(this.currentPos+(2*this.blockSize)>=this.endX){
                this.currentPos=this.endX-(2*this.blockSize);
                return;
            }
            this.currentPos+=this.blockSize;
        }
    }

    dropBlock(droppedBlock,gameBoard,blockSize,minX,minY){
        this.inControl=!this.inControl;
        droppedBlock.xPos=this.currentPos;
        droppedBlock.yPos=this.startY
        droppedBlock.updatePosition(gameBoard,blockSize,minX,minY);

    }

    renderControlBar(context){
        if(this.inControl){
            context.beginPath();
            const gradient=context.createLinearGradient(this.center,this.startY+50,this.center,0);
            gradient.addColorStop(0,"hsla(264, 100%, 39%, 0.5)");
            gradient.addColorStop(0.5,"hsla(179, 100%, 100%, 1)");
            gradient.addColorStop(1,"hsla(264, 100%, 39%, 0.5)");
            context.strokeStyle=gradient;
            context.moveTo(this.currentPos-5,this.startY+15);
            context.lineTo(this.currentPos-5,this.startY-(3.5*this.blockSize));
            context.moveTo(this.currentPos+5+(this.blockSize*2),this.startY+15);
            context.lineTo(this.currentPos+5+(this.blockSize*2),this.startY-(3.5*this.blockSize));
            context.stroke();
        }
    }
}