var canvDiv,flow,nodes=[],curTime=0,fps=60,sps=120,dragging=!1,mouse=[0,0],wiring,play=!0,socket,localSocket={},examples=[{name:"plot sines",scn:{nodes:[{type:"Logger",x:500,y:200},{type:"Summer",x:200,y:100},{type:"Mouse",x:100,y:180},{type:"Time",x:50,y:410},{type:"Sine",x:50,y:300,i:{freq:0.5}},{type:"Sine",x:200,y:300,i:{freq:4.05}},{type:"Scope",x:500,y:350},{type:"Custom",x:200,y:400},{type:"X2",x:350,y:150}],wires:[{n1:4,p1:"y",n2:5,p2:"amp",color:100},{n1:5,p1:"y",n2:6,p2:"y1",color:220},
{n1:1,p1:"c",n2:8,p2:"a",color:0},{n1:8,p1:"b",n2:0,p2:"msg",color:100},{n1:3,p1:"t",n2:7,p2:"a",color:320},{n1:3,p1:"t",n2:6,p2:"x",color:320},{n1:7,p1:"x",n2:6,p2:"y2",color:0},{n1:7,p1:"y",n2:6,p2:"y3",color:100}]}},{name:"SR latch",scn:{nodes:[{type:"button",title:"",x:218,y:178,i:{}},{type:"button",title:"",x:216,y:260,i:{}},{type:"NOR",title:"NOR",x:384,y:179,i:{a:!1,b:!1}},{type:"NOR",title:"NOR",x:384,y:259,i:{a:!0,b:!1}}],wires:[{n1:"0",p1:"o",n2:"2",p2:"a",color:"hsl(200, 50%, 55%)"},{n1:"3",
p1:"y",n2:"2",p2:"b",color:"hsl(200, 50%, 55%)"},{n1:"1",p1:"o",n2:"3",p2:"b",color:"hsl(200, 50%, 55%)"},{n1:"2",p1:"y",n2:"3",p2:"a",color:"hsl(200, 50%, 55%)"}]}}];function init(){canvDiv=document.getElementById("container");socket=io.connect("http://login.sccs.swarthmore.edu:8201");makeTypes();step();(function c(){requestAnimFrame(c);draw()})();var a=localStorage.getItem("tmpScene");a&&loadScene(JSON.parse(a));makeLibrary()}
var draw=function(){if(play)for(var a in nodes)nodes[a].draw()},step=function step(){if(play){curTime+=1/sps;for(var b in nodes)nodes[b].eval();for(b in nodes)nodes[b].progress()}window.setTimeout(step,1E3/sps)};function unloading(){localStorage.setItem("tmpScene",JSON.stringify(exportNodes(nodes)))}Math.dist=function(a,b,c,d){return Math.sqrt((a-c)*(a-c)+(b-d)*(b-d))};objectSize=function(a){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b};
window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();var Node=function(a,b){this.inputs={};this.outputs={};var c={},d={};this.type=a.type;this.vars={};for(var e in a.i)c[e]=a.i[e];for(e in a.o)d[e]=a.o[e];for(e in b.i)c[e]=b.i[e];for(e in b.o)d[e]=b.o[e];var g=a.init||null,h=a.step||null,i=a.f||function(){};if(a.vars)for(e in a.vars)this.vars[e]=a.vars[e];if(b.vars)for(e in b.vars)this.vars[e]=b.vars[e];for(e in c)this.inputs[e]={src:{val:c[e],flag:-1}};for(e in d)this.outputs[e]={node:this,val:d[e],flag:!1};this.newCode=function(a){a=new Function("i",
"o","that",a);a(c,d,this);i=a};e=new Widget(this);e.title=b.title||a.title||"";e.resize();b.x&&b.y&&e.upLoc(b.x,b.y);this.widget=e;var j=!0;g&&g(c,d,this);this.doExport=function(){var a={};a.type=this.type;a.title=this.widget.title;a.x=this.widget.x;a.y=this.widget.y;a.i={};for(var b in this.inputs){var c=this.inputs[b].src.val;isFinite(c)||(c=c.toString());a.i[b]=c}for(b in this.vars)a.vars||(a.vars={}),a.vars[b]=this.vars[b];return a};this.draw=function(){j&&(a.draw&&a.draw(c,d,this),this.widget.upLabels(),
j=!1)};this.eval=function(){var a=!1,b;for(b in c)this.inputs[b].src.flag&&(a=!0,c[b]=this.inputs[b].src.val,-1==this.inputs[b].src.flag&&(this.inputs[b].src.flag=!1),j=!0);a&&i(c,d,this);h&&(h(c,d,this),j=!0)};this.progress=function(){for(var a in d)this.outputs[a].flag=!1,d[a]!=this.outputs[a].val&&(this.outputs[a].val=d[a],j=this.outputs[a].flag=!0)};this.remove=function(){a.remove&&a.remove(c,d,this);for(var b in this.widget.inWires)rmWire(this,b);for(var e in nodes){b=nodes[e];for(var g in b.inputs)b.inputs[g].src.node&&
b.inputs[g].src.node==this&&rmWire(b,g)}nodes.splice(nodes.indexOf(this),1);this.widget.remove()};this.widget.upLoc();this.widget.redraw();nodes.push(this)};var selectStart,selectBox,selected=[];
function makeLibrary(){var a="Examples:<ul>",b;for(b in examples)a+='<li><a href="#" onclick="loadScene(examples['+b+'].scn);return false;">'+examples[b].name+"</a></li>";a+="</ul>Add:<ul>";for(b in types)a+='<li><a href="#" onmousedown="dragging=[makeNode({type:\''+types[b].type+'\',x:event.clientX-30,y:event.clientY-10})];return false;" onclick="return false;" title="'+(types[b].info?types[b].info:"")+'">'+types[b].type+"</a></li>";document.getElementById("library").innerHTML=a+"</ul>"}
function togglePlay(){play=!play;document.getElementById("playPause").innerHTML=play?"pause":"play"}function saveLocal(){localStorage.setItem("scene",JSON.stringify(exportNodes(nodes)))}function openLocal(){loadScene(JSON.parse(localStorage.getItem("scene")))}function loadScene(a){deleteNodes(nodes);importNodes(a);curTime=0}
document.onkeydown=function(a){if("textarea"!=a.target.type&&"text"!=a.target.type)switch(a.which){case 8:case 46:a.preventDefault();deleteNodes(selected);break;case 32:a.preventDefault();togglePlay();break;case 68:duplicate();break;case 67:copyNodes(selected);break;case 86:pasteNodes();break;case 88:cutNodes(selected);break;case 79:openLocal();break;case 83:saveLocal()}};
document.onmousedown=function(a){mouse=getMouse(a);if("container"==a.target.id||"HTML"==a.target.nodeName)selectBox||(selectBox=document.createElement("div"),canvDiv.appendChild(selectBox),selectBox.className="selectBox"),selectStart=getMouse(a),doSelectBox()};function select(a){selected.push(a);a.widget.redraw()}function deselect(a){if(a)selected.splice(selected.indexOf(a),1),a.widget.redraw();else for(a=selected.length-1;0<=a;a--)deselect(selected[a])}
document.onmouseup=function(a){mouse=getMouse(a);dragging=null;wiring&&(wiring[2].remove(),wiring=null);selectStart&&(doSelectBox(),selectStart=!1,selectBox.style.visibility="hidden")};
document.onmousemove=function(a){newMouse=getMouse(a);if(window.dragging){var a=newMouse[0]-mouse[0],b=newMouse[1]-mouse[1],c;for(c in dragging)dragging[c].widget.x+=a,dragging[c].widget.y+=b,dragging[c].widget.upLoc()}window.wiring&&(wiring[3][0]=newMouse[0],wiring[3][1]=newMouse[1],wiring[2].redraw());window.selectStart&&(selectBox.style.width=Math.abs(newMouse[0]-selectStart[0])+"px",selectBox.style.height=Math.abs(newMouse[1]-selectStart[1])+"px",selectBox.style.left=Math.min(newMouse[0],selectStart[0])+
"px",selectBox.style.top=Math.min(newMouse[1],selectStart[1])+"px",selectBox.style.visibility="visible",doSelectBox());mouse=newMouse};document.onblur=function(){dragging=null;selectStart&&(selectStart=!1,selectBox.style.visibility="hidden")};
function doSelectBox(){var a=Math.min(mouse[0],selectStart[0]),b=Math.max(mouse[0],selectStart[0]),c=Math.min(mouse[1],selectStart[1]),d=Math.max(mouse[1],selectStart[1]),e;for(e in nodes){var g=nodes[e],h=g.widget;(h=h.x<b&&h.x+h.w>a&&h.y<d&&h.y+h.h>c)&&-1==selected.indexOf(g)?select(g):!h&&-1!=selected.indexOf(g)&&deselect(g)}}function deleteNodes(a){for(var b=a.length-1;0<=b;b--){var c=a[b];deselect(c);c.remove()}}function cutNodes(a){copyNodes(a);deleteNodes(a)}
function copyNodes(a){var a=exportNodes(a),b;for(b in a.nodes)a.nodes[b].x-=mouse[0],a.nodes[b].y-=mouse[1];localStorage.setItem("pasteboard",JSON.stringify(a))}function pasteNodes(){var a=JSON.parse(localStorage.getItem("pasteboard")),b;for(b in a.nodes)a.nodes[b].x+=mouse[0],a.nodes[b].y+=mouse[1];a=importNodes(a);deselect();for(b in a)select(a[b])}
function exportNodes(a){var b=[],c=[],d;for(d in a){var e=a[d];b.push(e.doExport());for(var g in e.widget.inWires){var h=e.widget.inWires[g],i;for(i in a){var j=a[i],k;for(k in j.widget.outWires)for(var n in j.widget.outWires[k])h==j.widget.outWires[k][n]&&c.push({n1:i,p1:k,n2:d,p2:g,color:h.color})}}}return{nodes:b,wires:c}}function importNodes(a){var b=[],c;for(c in a.nodes)b[c]=makeNode(a.nodes[c]);for(var d in a.wires)c=a.wires[d],mkWire(b[c.n1],c.p1,b[c.n2],c.p2,c.color);return b}
function makeNode(a){return new nodeTypes[a.type](a)}function duplicate(){var a=exportNodes(selected);deselect();var a=importNodes(a),b;for(b in a)select(a[b]);dragging=selected}function getMouse(a){var b=0,c=0;a||(a=window.event);if(a.pageX||a.pageY)b=a.pageX,c=a.pageY;else if(a.clientX||a.clientY)b=a.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,c=a.clientY+document.body.scrollTop+document.documentElement.scrollTop;return[b,c]};var Widget=function(a){this.title="";this.x=20;this.y=40;this.w=120;this.h=80;var b=document.createElement("div");canvDiv.appendChild(b);b.className="node";var c=document.createElement("canvas");b.appendChild(c);var d;c.style["pointer-events"]="none";var e=!1;this.box=document.createElement("div");b.appendChild(this.box);this.box.className="nodeBox";this.box.style.position="absolute";this.box.style.top="20px";this.box.style.left="10px";this.inWires={};this.outWires={};var g={},h={};this.makeLabels=
function(){for(var c in a.inputs){var d=document.createElement("div");d.className="iLabel";b.appendChild(d);d.innerHTML=c;g[c]=d}for(c in a.outputs)d=document.createElement("div"),d.className="oLabel",b.appendChild(d),d.innerHTML=c,h[c]=d};this.upLabels=function(){for(var b in a.inputs)g[b].firstChild.data=b+":"+(!isFinite(a.inputs[b].src.val)?a.inputs[b].src.val:~~(100*a.inputs[b].src.val)/100);for(b in a.outputs)h[b].firstChild.data=b+":"+(!isFinite(a.outputs[b].val)?a.outputs[b].val:~~(100*a.outputs[b].val)/
100)};this.makeLabels();this.resize=function(){var e=15*(Math.max(objectSize(a.inputs),objectSize(a.outputs))+1)+(this.title?14:0);this.h=e+this.box.clientHeight+(this.box.clientHeight?10:0);this.w=Math.max(120,this.box.clientWidth+20);this.box.style.top=e;b.style.width=this.w;b.style.height=this.h;c.width=this.w;c.height=this.h;d=c.getContext("2d");this.width&&this.redraw()};var i=this,j=function(b){var c=getMouse(b);if("textarea"!=b.target.type&&"range"!=b.target.type)if(b.altKey)-1==selected.indexOf(a)&&
select(a),duplicate();else{if(b=k(a.inputs,c)){var d=a.inputs[b];if(d.src.node){var e=new Wire(c,d.src.pt);e.redraw();wiring=[d.src.node,d.srcPort,e,c];rmWire(a,b);return}}else if(b=k(a.outputs,c)){d=a.outputs[b];e=new Wire(c,d.pt,"#555");wiring=[a,b,e,c];return}if(-1==selected.indexOf(a)){c=selected;selected=[];for(e in c)c[e].widget.redraw();selected.push(a);i.redraw()}dragging=selected}};b.onmousedown=j;b.ontouchmove=function(a){j(a.targetTouches[0])};b.onmouseup=function(b){if(wiring&&(b=getMouse(b),
b=k(a.inputs,b)))a.inputs[b].src.node&&rmWire(a,b),mkWire(wiring[0],wiring[1],a,b,200),wiring[2].remove(),wiring=!1};b.onclick=function(b){var b=getMouse(b),c;if(c=k(a.inputs,b))b=a.inputs[c],b.src.node||new EditBox(b.pt,a.inputs[c].src.val,function(b){try{var d=eval(b);a.inputs[c].src.val=d;a.inputs[c].src.flag=-1}catch(e){}})};var k=function(a,b){for(var c in a){var d=a[c];if(5.5>=Math.dist(d.pt[0],d.pt[1],b[0],b[1]))return c}return!1};this.upLoc=function(c,d){this.x=c||this.x;this.y=d||this.y;
b.style.top=this.y+"px";b.style.left=this.x+"px";var j=12,k=15+(this.title?14:0),l;for(l in a.inputs){var m=a.inputs[l];m.pt||(m.pt=[]);m.pt[0]=[j+this.x];m.pt[1]=[k+this.y];g[l]&&(g[l].style.left=j+"px",g[l].style.top=k+"px");k+=15}j=this.w-j;k=15+(this.title?14:0);for(l in a.outputs)m=a.outputs[l],m.pt||(m.pt=[]),m.pt[0]=j+this.x,m.pt[1]=k+this.y,h[l]&&(h[l].style.right="12px",h[l].style.top=k+"px"),k+=15;e||i.redraw();this.redrawWires()};this.redraw=function(){var b=-1!=selected.indexOf(a);d.clearRect(0,
0,this.w,this.h);d.fillStyle="hsla(200, 80%, 90%,.8)";d.strokeStyle="hsl(200, 70%, "+(b?35:40)+"%)";d.lineWidth=b?4:2;roundRect(d,3,3,this.w-6,this.h-6,7,!0,!0);d.lineWidth=2;this.title&&(d.fillStyle="hsla(200, 80%, 97%,.9)",roundRect(d,3,3,this.w-6,14,7,!0,!1),d.font="11px sans-serif",d.textBaseline="top",d.textAlign="center",d.fillStyle="black",d.fillText(this.title,this.w/2,4));d.font="10px sans-serif";for(var c in a.inputs){var b=a.inputs[c].pt[0]-this.x,g=a.inputs[c].pt[1]-this.y;d.fillStyle=
i.inWires[c]?i.inWires[c].color:"hsl(200, 80%, 95%)";circle(d,b,g,3.5)}for(c in a.outputs)b=a.outputs[c].pt[0]-this.x,g=a.outputs[c].pt[1]-this.y,d.fillStyle=i.outWires[c]&&i.outWires[c].length?i.outWires[c][0].color:"hsl(200, 80%, 95%)",circle(d,b,g,3.5);e=!0};this.redrawWires=function(){for(var a in i.inWires)i.inWires[a].redraw();for(a in i.outWires)for(var b in i.outWires[a])i.outWires[a][b].redraw()};this.remove=function(){canvDiv.removeChild(b)}};
function EditBox(a,b,c){var d=document.createElement("div");d.className="editBox";var e=document.createElement("input");d.appendChild(e);d.style.left=a[0]+"px";d.style.top=a[1]+"px";d.style.width="50px";e.style.width="100%";canvDiv.appendChild(d);ths=this;e.value=b;e.select();e.focus();this.removed=!1;e.onchange=function(){this.removed||(ths.remove(),c(e.value))};e.onkeydown=function(a){switch(a.which){case 27:ths.remove();break;case 13:e.onchange()}};this.remove=function(){this.removed=!0;if(canvDiv.contains(d))try{canvDiv.removeChild(d)}catch(a){}};
e.onblur=function(){ths.remove()}}function circle(a,b,c,d){a.beginPath();a.arc(b,c,d,0,2*Math.PI,!1);a.stroke();a.fill()}function roundRect(a,b,c,d,e,g,h,i){"undefined"==typeof i&&(i=!0);"undefined"===typeof g&&(g=5);a.beginPath();a.moveTo(b+g,c);a.lineTo(b+d-g,c);a.quadraticCurveTo(b+d,c,b+d,c+g);a.lineTo(b+d,c+e-g);a.quadraticCurveTo(b+d,c+e,b+d-g,c+e);a.lineTo(b+g,c+e);a.quadraticCurveTo(b,c+e,b,c+e-g);a.lineTo(b,c+g);a.quadraticCurveTo(b,c,b+g,c);a.closePath();i&&a.stroke();h&&a.fill()};var types=[{type:"Buffer",title:"",info:"output=input",i:{in_:0},o:{out:0},f:function(a,b){b.out=a.in_}},{type:"Logger",title:"console.log()",info:"Prints the input to the browser console.",i:{msg:""},f:function(a){console.log(a.msg)}},{type:"Summer",title:"Sum",info:"c=a+b",i:{a:1,b:2},o:{c:3},f:function(a,b){b.c=1*a.a+1*a.b}},{type:"Multiply",title:"Multiply",info:"c=a*b",i:{a:1,b:2},o:{c:3},f:function(a,b){b.c=a.a*a.b}},{type:"Sine",title:"Sine",info:"Generates a sine wave",i:{freq:2,amp:1,phase:0},
o:{y:0},step:function(a,b){b.y=Math.sin(2*(curTime*Math.PI)*parseFloat(a.freq)+parseFloat(a.phase))*a.amp}},{type:"Square",title:"Square",info:"Generates a square wave",i:{freq:2,amp:1,phase:0},o:{y:0},step:function(a,b){b.y=((0<Math.sin(2*(curTime*Math.PI)*parseFloat(a.freq)+parseFloat(a.phase)))-0.5)*a.amp}},{type:"IIR Lowpass",title:"IIR Lowpass",info:"A simple lowpass filter",i:{x:0,factor:1},o:{y:0},step:function(a,b){a.factor=parseFloat(a.factor);b.y=(b.y*a.factor+a.x)/(1+a.factor)}},{type:"Time",
title:"Time",info:"The current simulation time",o:{t:0},step:function(a,b){b.t=curTime}},{type:"Mouse",title:"Mouse",info:"The current mouse position",o:{x:0,y:0},init:function(a,b,c){c.handleMove=function(a){a=getMouse(a);c.widget.upLabels();b.x=a[0];b.y=a[1]};document.addEventListener("mousemove",c.handleMove,!1)},remove:function(){}},{type:"Scope",info:"Plots y vs. x",i:{x:0,y1:0,y2:0,y3:0},init:function(a,b,c){c._={};var d=c._,e=c.widget.box,d=c._;d.w=300;d.h=150;e.style.width=d.w+"px";e.style.height=
d.h+"px";e.style.backgroundColor="rgb(255,255,251)";e.style.minWidth="20px";d.canv=document.createElement("canvas");d.ctx=d.canv.getContext("2d");e.appendChild(d.canv);e.style.resize="both";e.style.overflow="hidden";d.canv.style["pointer-events"]="none";d.newDat=!1;var g=0,h=0;e.onmousemove=function(){if(e.clientWidth!=g||e.clientHeight!=h)g=e.clientWidth,h=e.clientHeight,c.widget.resize(),c.widget.upLoc(),c.widget.redraw(),g=e.clientWidth,h=e.clientHeight,d.w=g,d.h=h,d.canv.width=d.w,d.canv.height=
d.h};d.buffer=[];d.dMin=1E5;d.dMax=-1E5;d.colors=["#00A","#A00","#0A0"];e.ondblclick=function(){d.buffer=[];d.dMin=1E5;d.dMax=-1E5;c.eval()};c.widget.resize()},f:function(a,b,c){var b=c._,c=[],d;for(d in a)c.push(a[d]),"x"!=d&&(b.dMax=Math.max(a[d],b.dMax),b.dMin=Math.min(a[d],b.dMin));b.buffer.push(c)},draw:function(a,b,c){b=c._;c=b.ctx;c.clearRect(0,0,b.w,b.h);var d=1,e;for(e in a){c.beginPath();for(var g=0,h=Math.max(b.buffer.length-20*sps+1,0);h<b.buffer.length;h++){var i=b.buffer[h][0]*b.w/2%
b.w,j=(1-(b.buffer[h][d]-b.dMin)/(b.dMax-b.dMin))*b.h;i<g?c.moveTo(i,j):c.lineTo(i,j);g=i}c.strokeStyle=b.colors[(d-1)%b.colors.length];c.lineWidth=".6";c.stroke();d++}}},{type:"Custom",title:"custom",info:"Evaluates Javascript code. Inputs are in (i), outputs go in (o).",i:{a:1,b:0,c:0},o:{x:0,y:0,z:0},vars:{txt:"o.x=Math.sin(3.1*Math.PI*i.a)\n\t+Math.sin(7*Math.PI*i.a)/2-3;\n\no.y=Math.random()-6;\no.z=i.a % 1;"},init:function(a,b,c){a=c.widget.box;c._={};b=c._;b.w=200;b.h=80;var d=document.createElement("textarea");
d.style.width=b.w+"px";d.style.height=b.h+"px";a.style["pointer-events"]="auto";a.appendChild(d);c.widget.resize();d.onkeyup=function(){c.vars.txt=d.value;try{c.newCode(c.vars.txt),d.style.backgroundColor=""}catch(a){ERR=a,d.style.backgroundColor="#FDD"}};d.value=c.vars.txt;d.onkeyup();var e=0,g=0;d.onmousemove=function(){if(d.clientWidth!=e||d.clientHeight!=g)e=d.clientWidth,g=d.clientHeight,c.widget.resize(),c.widget.upLoc(),c.widget.redraw(),e=d.clientWidth,g=d.clientHeight}}},{type:"hSlider",
info:"Horizontal Slider",i:{i:0,min:0,max:1},o:{o:0},vars:{value:0},init:function(a,b,c){var d=document.createElement("input");d.type="range";d.setRange=function(a,b){var c=this.value;this.min=a;this.max=b;this.step=(b-a)/1E3;this.value=c};d.setRange(a.min,a.max);c.widget.box.appendChild(d);c.widget.resize();d.value=c.vars.value;d.onchange=function(){c.vars.value=d.value;b.o=d.value;c.widget.upLabels()};c.inp=d},f:function(a,b,c){c.inp.setRange(a.min,a.max);c.inp.value=a.i;c.inp.onchange()}},{type:"Accel",
title:"Accelerometer",info:"Accelerometer data (if avalable)",o:{x:0,y:0},init:function(a,b,c){c.tilt=function(a){b.x=a[0];b.y=a[1]};window.DeviceOrientationEvent?window.addEventListener("deviceorientation",function(){c.tilt([event.beta,event.gamma])},!0):window.DeviceMotionEvent?window.addEventListener("devicemotion",function(){c.tilt([2*event.acceleration.x,2*event.acceleration.y])},!0):window.addEventListener("MozOrientation",function(){c.tilt([50*orientation.x,50*orientation.y])},!0)}},{type:"check",
title:"",info:"A Checkbox. Push to toggle.",i:{i:!1},o:{o:!1},vars:{checked:!1},init:function(a,b,c){var d=document.createElement("input");d.type="checkbox";c.widget.box.appendChild(d);c.widget.resize();d.checked=c.vars.checked;d.onchange=function(){c.vars.checked=d.checked;b.o=d.checked;c.widget.upLabels()};c.inp=d},f:function(a,b,c){c.inp.checked=a.i;c.inp.onchange();b.o=a.i}},{type:"button",title:"",info:"A Button. On when pressed.",o:{o:!1},init:function(a,b,c){a=document.createElement("input");
a.type="button";a.value="press";c.widget.box.appendChild(a);c.widget.resize();a.onmousedown=function(){b.o=!0;c.widget.upLabels()};a.onmouseup=function(){b.o=!1;c.widget.upLabels()}}},{type:"AND",title:"AND",info:"y = a && b",i:{a:0,b:0},o:{y:0},f:function(a,b){b.y=a.a&&a.b}},{type:"OR",title:"OR",info:"y = a || b",i:{a:0,b:0},o:{y:0},f:function(a,b){b.y=a.a||a.b}},{type:"NAND",title:"NAND",info:"y = !( a && b )",i:{a:0,b:0},o:{y:0},f:function(a,b){b.y=!(a.a&&a.b)}},{type:"NOR",title:"NOR",info:"y = !( a || b )",
i:{a:0,b:0},o:{y:0},f:function(a,b){b.y=!(a.a||a.b)}},{type:"NOT",title:"NOT",info:"y = !a",i:{a:0},o:{y:0},f:function(a,b){b.y=!a.a}},{type:"XOR",title:"XOR",info:"y = ( a != b )",i:{a:0,b:0},o:{y:0},f:function(a,b){b.y=0>=a.a!=0>=a.b}},{type:"Topic",title:"Topic",info:"Sends data to ANY other node with the same 'Topic Name'",i:{val:0},o:{val:0},vars:{topic:""},init:function(a,b,c){var d=document.createElement("input");d.type="input";d.value=c.vars.topic;d.placeholder="Topic Name";c.widget.box.appendChild(d);
c.widget.resize();c.joinTopic=function(){if(c.vars.topic){var a=c.vars.topic;socket.emit("joinTopic",a);socket.on("connect",function(){socket.emit("joinTopic",a)});socket.on("disconnect",function(){d.style.backgroundColor="#FED"});socket.on("joined",function(b){a==b&&(d.style.backgroundColor="#DFD",d.blur())});socket.on(a,function(a){b.val=a});localSocket[a]||(localSocket[a]=[]);localSocket[a].push(function(a){b.val=a})}};c.joinTopic();c.leaveTopic=function(){c.vars.topic&&socket.emit("leaveTopic",
c.vars.topic)};d.onchange=function(){d.style.backgroundColor="#FFF";c.leaveTopic();d.value&&(c.vars.topic=d.value,c.joinTopic())}},remove:function(a,b,c){c.leaveTopic()},f:function(a,b,c){if(c.vars.topic&&(socket.emit(c.vars.topic,a.val),b=localSocket[c.vars.topic]))for(f in b)b[f](a.val)}}],nodeTypes={};function makeTypes(){for(var a in types)nodeType(types[a])}function nodeType(a){nodeTypes[a.type]=function(b){this.inherit=Node;this.inherit(a,b)}};var Wire=function(a,b,c){var d=document.createElement("canvas");canvDiv.appendChild(d);var e;d.style["pointer-events"]="none";d.style.zIndex="-1";this.p1=a;this.p2=b;this.color=c;this.redraw=function(){var g=Math.min(a[0],b[0])-4,h=Math.min(a[1],b[1])-4,i=Math.abs(a[0]-b[0])+8,j=Math.abs(a[1]-b[1])+8;d.style.top=h;d.style.left=g;d.width=i;d.height=j;i=i/3*(a[1]>b[1]?1:2);e=d.getContext("2d");e.strokeStyle=c;e.lineCap="round";e.lineWidth=3.3;e.beginPath();e.moveTo(a[0]-g,a[1]-h);e.bezierCurveTo(i,
a[1]-h,i,b[1]-h,b[0]-g,b[1]-h);e.stroke()};this.remove=function(){canvDiv.removeChild(d)}};function mkWire(a,b,c,d,e){a.outputs[b]&&c.inputs[d]&&(isFinite(e)&&(e="hsl("+e+", 50%, 55%)"),c.inputs[d].src=a.outputs[b],c.inputs[d].srcPort=b,e=new Wire(c.inputs[d].pt,a.outputs[b].pt,e),a.outputs[b].flag=1,c.widget.inWires[d]=e,a.widget.outWires[b]||(a.widget.outWires[b]=[]),a.widget.outWires[b].push(e),a.widget.redraw(),c.widget.redraw(),e.redraw())}
function rmWire(a,b){if(a.inputs[b]){var c=a.inputs[b].src.node,d=a.inputs[b].srcPort,e=a.widget.inWires[b];delete a.widget.inWires[b];e.remove();for(var g in c.widget.outWires[d])c.widget.outWires[d][g]==e&&c.widget.outWires[d].splice(g,1);a.inputs[b].src={val:a.inputs[b].src.val,flag:-1};c.widget.redraw();a.widget.redraw()}};