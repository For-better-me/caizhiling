jQuery(".banner").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"fold",  autoPlay:true, autoPage:true, interTime:6000, trigger:"click" ,delayTime:1000 }); 

// 头部特效


function move(obj,speed){
      var timer=setInterval(function(){
        $(obj).stop(true).animate({left:Math.random()*60,top:Math.random()*(-20)},speed,"swing")
      },speed);


}
function move2(obj,speed){
      var timer=setInterval(function(){
        $(obj).stop(true).animate({left:Math.random()*60},speed,"swing")
      },speed);


}
// move2(".tx1",1000);
// move(".tx2",1500);

