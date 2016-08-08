var NoteValue = function()
{
	this.HUNDRED=100;
	this.FIFTY=50;
	this.TWENTY=20;
	this.TEN=10;
	this.FIVE=5;
};

var USD = function()
{
	this.noteValue;
	this.length;
	this.width;
	this.img="";
};

USD.prototype.setNote= function(nv){
	nv = parseFloat(nv);
	
	this.noteValue = nv;
	switch (nv){
		case 100:
			
			this.length=125;
			this.width=55;
			this.img="img/USD_100.jpg";
			break;
		case 50:
			
			this.length=110;
			this.width=40;
			this.img="img/USD_50.jpg";			
			break;
		case 20:
			
			this.length=110;
			this.width=40;
			this.img="img/USD_20.jpg";			
			break;
		case 10:
			
			this.length=110;
			this.width=40;
			this.img="img/USD_10.jpg";			
			break;
		case 5:
			
			this.length=110;
			this.width=40;
			this.img="img/USD_5.jpg";			
			break;
	}
};


var EURO = function()
{
	this.noteValue;
	this.length;
	this.width;
	this.img="";
};
EURO.prototype.setNote= function(nv){
	nv = parseFloat(nv);
	
	this.noteValue = nv;
	switch (nv){
		case 100:
			
			this.length=125;
			this.width=55;
			this.img="img/EURO_100.jpg";
			break;
		case 50:
			
			this.length=110;
			this.width=40;
			this.img="img/EURO_50.jpg";			
			break;
		case 20:
			
			this.length=110;
			this.width=40;
			this.img="img/EURO_20.jpg";			
			break;
		case 10:
			
			this.length=110;
			this.width=40;
			this.img="img/EURO_10.jpg";			
			break;
		case 5:
			
			this.length=110;
			this.width=40;
			this.img="img/EURO_5.jpg";			
			break;
	}
};
var INR = function()
{
	this.noteValue;
	this.length;
	this.width;
	this.img="";
};
INR.prototype.setNote= function(nv){
	nv = parseFloat(nv);
	
	this.noteValue = nv;
	switch (nv){
		case 100:
			this.length=125;
			this.width=50;
			this.img="img/INR_100.jpg";
			break;
		case 50:
			
			this.length=110;
			this.width=35;
			this.img="img/INR_50.jpg";			
			break;
		case 20:
			
			this.length=110;
			this.width=35;
			this.img="img/INR_20.jpg";			
			break;
		case 10:
			
			this.length=110;
			this.width=35;
			this.img="img/INR_10.jpg";			
			break;
		case 5:
			
			this.length=110;
			this.width=35;
			this.img="img/INR_5.jpg";			
			break;
	}
};

var POUND = function()
{
	this.noteValue;
	this.length;
	this.width;
	this.img="";
};
POUND.prototype.setNote= function(nv){
	nv = parseFloat(nv);
	
	this.noteValue = nv;
	switch (nv){
		case 100:
			this.length=130;
			this.width=55;
			this.img="img/POUND_100.jpg";
			break;
		case 50:
			
			this.length=110;
			this.width=45;
			this.img="img/POUND_50.jpg";			
			break;
		case 20:
			
			this.length=110;
			this.width=45;
			this.img="img/POUND_20.jpg";			
			break;
		case 10:
			
			this.length=110;
			this.width=40;
			this.img="img/POUND_10.jpg";			
			break;
		case 5:
			
			this.length=110;
			this.width=40;
			this.img="img/POUND_5.jpg";			
			break;
	}
};