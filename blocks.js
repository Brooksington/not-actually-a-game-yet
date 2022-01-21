export class Block {
    constructor(xPos=0,yPos=0){
        //builds the array of blocks used during block creation and transformation/rotation
        this._arrayOfBlocks=[
            //    0
            [[2,2],[2,2]],
            //    1             2             3             4
            [[1,2],[2,2]],[[2,1],[2,2]],[[2,2],[2,1]],[[2,2],[1,2]],
            //    5             6             7             8
            [[2,1],[2,1]],[[2,2],[1,1]],[[1,2],[1,2]],[[1,1],[2,2]],
            //    9             10 
            [[2,1],[1,2]],[[1,2],[2,1]],
            //    11            12            13            14
            [[2,1],[1,1]],[[1,2],[1,1]],[[1,1],[1,2]],[[1,1],[2,1]],
            //    15
            [[1,1],[1,1]]];

        const randNum=Math.floor(Math.random()*16);
        
        this.xPos=xPos;
        this.yPos=yPos;

        this._type=randNum;
        this._shape=this._arrayOfBlocks[randNum];

        this.boardPositionX=null;
        this.boardPositionY=null;
    }

    get arrayOfBlocks() {return this._arrayOfBlocks;}
    get type() {return this._type;}
    get shape() {return this._shape;}

    

    clearPreviousPosition(gameBoard,blockSize,minX,minY){
        this.boardPositionX=Math.round((this.xPos-minX)/blockSize);
        this.boardPositionY=Math.round((this.yPos-minY)/blockSize);
        for(let i=0;i<this._shape.length;i++){
            for(let j=0;j<this._shape[0].length;j++){
                gameBoard[this.boardPositionY+i][this.boardPositionX+j]=0;
            }
        }
    }

    updatePosition(gameBoard,blockSize,minX,minY){
        this.boardPositionX=Math.round((this.xPos-minX)/blockSize);
        this.boardPositionY=Math.round((this.yPos-minY)/blockSize);
        console.log(`${this.boardPositionX},${this.boardPositionY}`);
        

        for(let i=0;i<this._shape.length;i++){
            for(let j=0;j<this._shape[0].length;j++){
                gameBoard[this.boardPositionY+i][this.boardPositionX+j]=this._shape[i][j];
            }
        }
        console.clear();
        console.table(gameBoard);
    }

    rotateClockwise(){
        switch(this._type){
            case 0:
            case 15: break;
            case 4: this._type=1;break;
            case 8: this._type=5;break;
            case 10: this._type=9;break;
            case 14: this._type=11;break;
            default: this._type++;break;
        }
        this._shape=this._arrayOfBlocks[this._type];
        return this._shape;
    }

    rotateCounterClockwise(){
        switch(this._type){
            case 0:
            case 15: break;
            case 1: this._type=4;break;
            case 5: this._type=8;break;
             case 9: this._type=10;break;
            case 11: this._type=14;break;
            default: this._type--;break;
        }
        this._shape=this._arrayOfBlocks[this._type];
        return this._shape;
    }

    moveRight(gameBoard,blockSize,maxX,minX,minY,inControl){
        if(this.xPos+(2*blockSize)>maxX+2) return;
        if(!inControl&&gameBoard[this.boardPositionY][this.boardPositionX+2]) return;
        if(!inControl) this.clearPreviousPosition(gameBoard,blockSize,minX,minY);
        this.xPos+=blockSize;
        if(!inControl) this.updatePosition(gameBoard,blockSize,minX,minY);
    }

    moveLeft(gameBoard,blockSize,minX,minY,inControl){
        if(this.xPos-blockSize<minX-2) return;
        if(!inControl&&gameBoard[this.boardPositionY][this.boardPositionX-1]) return;
        if (!inControl) this.clearPreviousPosition(gameBoard,blockSize,minX,minY);
        this.xPos-=blockSize;
        if (!inControl) this.updatePosition(gameBoard,blockSize,minX,minY);
    }

    drop(gameBoard,blockSize,maxY,minX,minY,collide){
        if(this.yPos+blockSize*6>maxY+2){
            this.clearPreviousPosition(gameBoard,blockSize,minX,minY);
            this.yPos=maxY-2*blockSize;
            this.updatePosition(gameBoard,blockSize,minX,minY);
            collide();
            return;
        }
        this.clearPreviousPosition(gameBoard,blockSize,minX,minY);
        this.yPos+=blockSize*5;
        this.updatePosition(gameBoard,blockSize,minX,minY);
    }

    upDebug(gameBoard,blockSize,minX,minY){
        if(this.yPos-blockSize<minY-2){
            this.yPos=minY;
            return;
        }
        this.clearPreviousPosition(gameBoard,blockSize,minX,minY);
        this.yPos-=blockSize;
        this.updatePosition(gameBoard,blockSize,minX,minY);
    }

    renderBlock(context,blockSize,color1,color2,color3){
        for(let i=0;i<this._shape.length;i++){
            for(let j=0;j<this._shape[i].length;j++){
                if(this._shape[i][j]===1) context.fillStyle=color1;
                else context.fillStyle=color2;
                context.strokeStyle=color3;
                context.beginPath();
                context.rect(this.xPos+1+(blockSize*j),this.yPos+(blockSize*i),blockSize-2,blockSize-2);
                context.stroke();
                context.fill();
            }
        }
    }
}

/*const block=new Block();
console.log(block.shape);
block.rotate();
console.log(block.shape);*/
