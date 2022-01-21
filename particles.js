export class Particle{
    constructor(xPos,yPos,size,color){
        this.xPos=xPos;
        this.yPos=yPos;
        this.size=size;
        this.color=color;
    }

    static diminish(particleArray,minSize=0.2,rateOfChange=1.1){
        for(let i=0;i<particleArray.length;i++){
            if(particleArray[i].size<minSize){
                continue;
            }
            particleArray[i].size/=rateOfChange;
        }
        
    }

    static grow(particleArray,maxSize=5,rateOfChange=1.1){
        for(let i=0;i<particleArray.length;i++){
            if(particleArray[i].size>=maxSize){
                continue;
            }
            particleArray[i].size*=rateOfChange;
        }
    }

    static moveParticles(particleArray,xDir=0,yDir=0,speed){
        
    }

    static generateParticles(particleArray = [], n, x, y, size, color){
        if(particleArray.length<n){
            for(let i=particleArray.length;i<n;i++){
                if(y===undefined) y=(Math.random()*window.innerHeight);
                if(size===undefined) size=(Math.random()*3)+1;
                particleArray.push(new Particle(x,y,size,color));
            }
        }
        return particleArray;
    }

    static elminateParticles(particleArray,min=0.2,max=5){
        for(let i=0;i<particleArray.length;i++){
            if(particleArray[i].size<min||particleArray[i].size>max){
                particleArray.splice(i,1);
            }
        }
        return particleArray;
    }

    static renderParticles(context,particleArray){
        for(let i=0;i<particleArray.length;i++){
            context.beginPath();
            context.arc(particleArray[i].xPos,particleArray[i].yPos,particleArray[i].size,0,Math.PI*2);
            context.fillStyle='hsl('+ particleArray[i].color +',100%,50%)';
            context.fill();
        }
    }
}