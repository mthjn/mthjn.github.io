var nodes = new Array();
var text = new Array();
var tumble = new Array();
var maxsize = 0;
var count = 0;

function Is(){
  this.ver=navigator.appVersion;
  this.agent=navigator.userAgent;
  this.dom=document.getElementById?1:0;
  this.opera5=this.agent.indexOf("Opera 5")>-1;
  this.ie5=(this.ver.indexOf("MSIE 5")>-1 && this.dom && !this.opera5)?1:0;
  this.ie6=(this.ver.indexOf("MSIE 6")>-1 && this.dom && !this.opera5)?1:0;
  this.ie4=(document.all && !this.dom && !this.opera5)?1:0;
  this.ie=this.ie4||this.ie5||this.ie6;
  this.mac=this.agent.indexOf("Mac")>-1;
  this.safari = (this.ver.indexOf("Safari")>-1 && this.dom)?1:0;
  this.ns6=(this.dom && parseInt(this.ver) >= 5) ?1:0;
  this.ns4=(document.layers && !this.dom)?1:0;
  this.bw=(this.ie6||this.ie5||this.ie4||this.ns4||this.ns6||this.opera5);
  return this;
}

var is = new Is();

function spin() {
	var root = document.getElementsByTagName('body').item(0);
	if(is.dom && !(is.mac && (is.ie || is.safari))) godeep(root);
	root.style.visibility = 'visible';
	if(is.dom && !(is.mac && is.ie)) sponge();
	}

function finished() {
	nodes = null;
	text = null;
	tumble = null;
	}

var chartype = Math.floor(Math.random()*3);

function MakeArray(n){
    this.length=n;
    for(var i=1; i<=n; i++) this[i]=i-1;
    return this
}

hex=new MakeArray(16);
hex[11]="A"; hex[12]="B"; hex[13]="C"; hex[14]="D";
hex[15]="E"; hex[16]="F";

function ToHex(x){  // Changes a int to hex (in the range 0 to 255)
    var right=hex[x+1]; // right part of the hex-value
    var string=right; // add the high and low together
    return string;
}

function digit() {
	if(chartype == 0)
		return ToHex(Math.floor(Math.random()*16));
	else if(chartype == 1)
		return '_';
	else if (chartype == 2)
		return Math.floor(Math.random()*2);
	else
		return ' ';
	}

var reg = new RegExp ("\r|\n", "g");
function haschars(s) {
	s = s.replace(reg,'');
	return s.length;
	}

function godeep(o) {
	for (var i = 0; i < o.childNodes.length; i++) {
		if(o.childNodes[i].childNodes) {
			godeep(o.childNodes[i]);
			}
	  if(o.childNodes[i].nodeName == '#text' && haschars(o.childNodes[i].nodeValue)) {
	  	var p = nodes.length;
			nodes[p] = o.childNodes[i];
			text[p] = o.childNodes[i].nodeValue;//new Array();
			tumble[p] = new Array();
			for(var u = 0; u < o.childNodes[i].nodeValue.length; u++) {
				tumble[p][u] = u;
				}
			if(o.childNodes[i].nodeValue.length > maxsize) {
				maxsize = o.childNodes[i].nodeValue.length;
				}
			tumble[p].sort(randomSort);
			o.childNodes[i].nodeValue = '';
			}
		}
	}

function randomSort(w1,w2) {
	return Math.floor(Math.random()*3)-1;
	}

function sponge() {
	for (var i = 0; i < nodes.length; i++) {
		if(count < tumble[i].length) {
    	nodes[i].nodeValue += digit(1);
    	}
    }
 	count++;
 	if(count < maxsize) {
  	setTimeout('sponge()',20);
  	}
 	else {
 		count = 0;
  	setTimeout('unsponge()',350);
  	}
	}

function repchar(str, ch, pos) {
	var out = '';
	for(var i = 0; i < str.length; i++) {
		if(i == pos) out += ch;
		else out += str.charAt(i);
		}
	return out;
	}

function unsponge() {
	for (var i = 0; i < nodes.length; i++) {
		if(count <= tumble[i].length) {
    	nodes[i].nodeValue = repchar(nodes[i].nodeValue, text[i].charAt(tumble[i][count]), tumble[i][count]);
    	}
		}
  count++;
  if(count < 10) setTimeout('unsponge()',30);
	else if(count < maxsize) setTimeout('unsponge()',5);
	else finished();
	}

window.onload = spin;
