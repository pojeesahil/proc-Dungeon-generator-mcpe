import { world,BlockLocation,ItemStack } from "mojang-minecraft";

let tickIndex = 0;
var roomCreated=[];
var room={"width":7,
  "height":5,
  "leng":9
};
var players = world.getDimension("overworld").getPlayers();
    var player=Array.from(players)[0];
function mainTick() {
  tickIndex++;

  if (tickIndex === 100) {
    world.getDimension("overworld").runCommand("say Hello starter! version:1.4");
   players=world.getDimension("overworld").getPlayers();
    player=Array.from(players)[0];
  }
}

world.events.tick.subscribe(mainTick);
world.events.beforeChat.subscribe(event =>{
  world.getDimension("overworld").runCommand("say "+event.message);
  if(event.message==="start"){
    eventstart();
  }
  if(event.message==="destroy"){
    world.getDimension("overworld").runCommand("say destroying dungeon..."+roomCreated.length+" "+roomCreated[0].z);
    for(var timed=0;timed<roomCreated.length;timed++){
      destroyRoom(roomCreated[timed]);
    }
    for(var timed=0;timed<roomCreated.length-1;timed++){
      var roomDif={"x":roomCreated[timed+1].x-roomCreated[timed].x,"z":roomCreated[timed+1].z-roomCreated[timed].z,"y":0};
      destroyPassage(roomCreated[timed],roomDif);
    }
  }
  
})
function indexToCoord(tindex){
    return {"x":(room.width+2)*tindex.x,"y":tindex.y,"z":(room.leng+2)*tindex.z};
  }
  function createRoom(tindex){
    var pos=indexToCoord(tindex);
    world.getDimension("overworld").runCommand("fill "+pos.x+" "+pos.y+" "+pos.z+" "+(pos.x+room.width)+" "+(pos.y+room.height)+" "+(pos.z+room.leng)+" stone 0 hollow");
  }
  function createPassage(tindex,tdiff){
    var pos=indexToCoord(tindex);
    var pos2;
    var posdif;
    var posdif2;
    var posd=indexToCoord(tdiff);
    pos.x+=posd.x;
    pos.y+=posd.y;
    pos.z+=posd.z;
    function setPassage(){
      var offsetX=1;
      var offsetZ=1;
      pos2=JSON.parse(JSON.stringify(pos));
      if(Math.abs(tdiff.z)===1){
      pos2.x+=3;
      pos2.y+=3;
      }
      if(Math.abs(tdiff.x)===1){
        pos2.z+=3;
        pos2.y+=3;
      }
      world.getDimension("overworld").runCommand("fill "+pos.x+" "+pos.y+" "+pos.z+" "+(pos2.x)+" "+(pos2.y)+" "+(pos2.z)+" stone 2 replace");
      posdif=JSON.parse(JSON.stringify(pos2));
      posdif2=JSON.parse(JSON.stringify(pos2));
      posdif.x=pos2.x-(pos2.x-pos.x)+offsetX;
      posdif.y=pos2.y-(pos2.y-pos.y)+1;
      posdif.z=pos2.z-(pos2.z-pos.z)+offsetZ;
      
      posdif2.x=pos.x+(pos2.x-pos.x)-offsetX;
      posdif2.y=pos.y+(pos2.y-pos.y)-1;
      posdif2.z=pos.z+(pos2.z-pos.z)-offsetZ;
      world.getDimension("overworld").runCommand("fill "+posdif.x+" "+posdif.y+" "+posdif.z+" "+(posdif2.x)+" "+(posdif2.y)+" "+(posdif2.z)+" air 0 replace");
    }
    if(tdiff.x===1){
      //-1 0 4
      pos.x-=1;
      pos.z+=((room.leng-1)/2)-1;
      setPassage();
    }
    if(tdiff.x===-1){
      //9 0 4
      pos.x+=room.width+1;
      pos.z+=((room.leng-1)/2)-1;
      setPassage();
    }
    if(tdiff.z===1){
      //-1 0 4
      pos.x+=((room.width-1)/2)-1;
      pos.z-=1;
      setPassage();
    }
    if(tdiff.z===-1){
      //3 0 10 [assumed value,not tested yet]
      pos.z+=(room.leng+1);
      pos.x+=((room.width-1)/2)-1;
      setPassage();
      
    }
      world.getDimension("overworld").runCommand("setblock "+pos.x+" "+pos.y+" "+pos.z+" stone 1");
    
  }
  function destroyPassage(tindex,tdiff){
    var pos=indexToCoord(tindex);
    var posd=indexToCoord(tdiff);
    pos.x+=posd.x;
    pos.y+=posd.y;
    pos.z+=posd.z;
    if(tdiff.x===1){
      //-1 0 4
      pos.x-=1;
      pos.z+=(room.leng-1)/2;
    }
    if(tdiff.x===-1){
      //9 0 4
      pos.x+=room.width+1;
      pos.z+=(room.leng-1)/2;
    }
    if(tdiff.z===1){
      //-1 0 4
      pos.x+=(room.width-1)/2;
      pos.z-=1;
    }
    if(tdiff.z===-1){
      //3 0 10 [assumed value,not tested yet]
      pos.z+=(room.leng+1);
      pos.x+=(room.width-1)/2;
    }
    world.getDimension("overworld").runCommand("setblock "+pos.x+" "+pos.y+" "+pos.z+" air 0");
  }
  function destroyRoom(tindex){
    try{
    var pos=indexToCoord(tindex);
    world.getDimension("overworld").runCommand("fill "+pos.x+" "+pos.y+" "+pos.z+" "+(pos.x+room.width)+" "+(pos.y+room.height)+" "+(pos.z+room.leng)+" air 0 replace stone -1");
    }catch(err){
      world.getDimension("overworld").runCommand("say DestroyRoom:"+err);
    }
  }
  
function eventstart(){
  try{
  world.getDimension("overworld").runCommand("say Making dungeon");
  var startPos=player.location;
  var arrayRadius=15;
  var currentX=Math.floor(Math.random()*(arrayRadius));
  var currentY=Math.floor(Math.random()*(arrayRadius));
  var currentIndex={"x":(arrayRadius-1)/2,"y":0,"z":(arrayRadius-1)/2}
  var blockmap=[];
  for(var tim=0;tim<arrayRadius;tim++){
    blockmap.push([]);
  }
  
  world.getDimension("overworld").runCommand("say a"+currentIndex.x);
  for(var timed=0;timed<arrayRadius;timed++){
    var isCreated=false;
  var rng=Math.floor(Math.random()*4);
  
  switch(rng){
    case 0:
      if(currentIndex.x!==0&&blockmap[currentIndex.z][currentIndex.x-1]!==1){
        currentIndex.x--;
        createRoom(currentIndex);
        isCreated=true;
      }else{
        continue;
      }
      break;
    case 1:
      if(currentIndex.z!==0&&blockmap[currentIndex.z-1][currentIndex.x]!==1){
        currentIndex.z--;
        createRoom(currentIndex);
        isCreated=true;
      }else{
        continue;
      }
      break;
    case 2:
      if(currentIndex.x!==arrayRadius-1&&blockmap[currentIndex.z][currentIndex.x+1]!==1){
        currentIndex.x++;
        createRoom(currentIndex);
        isCreated=true;
      }else{
        continue;
      }
      break;
    case 3:
      if(currentIndex.z!==arrayRadius-1&&blockmap[currentIndex.z+1][currentIndex.x]!==1){
        currentIndex.z++;
        createRoom(currentIndex);
        isCreated=true;
      }else{
        continue;
      }
      break;
  }
  if(isCreated===true){
    blockmap[currentIndex.z][currentIndex.x]=1;
  roomCreated.push({"z":currentIndex.z,"x":currentIndex.x,"y":0});
  }
  }
  //Connecting all rooms
  for(var timed=0;timed<roomCreated.length-1;timed++){
  
    var roomDif={"x":roomCreated[timed+1].x-roomCreated[timed].x,"z":roomCreated[timed+1].z-roomCreated[timed].z,"y":0};
      createPassage(roomCreated[timed],roomDif);
  }
  }catch(err){
    world.getDimension("overworld").runCommand("say Error:"+err);
  }
}


   
       
       
     ated[timed+1].x-roomCreated[timed].x,"z":roomCreated[timed+1].z-roomCreated[timed].z,"y":0};
      createPassage(roomCreated[timed],roomDif);
  }
  }catch(err){
    world.getDimension("overworld").runCommand("say Error:"+err);
  }
}


   
       
       
     