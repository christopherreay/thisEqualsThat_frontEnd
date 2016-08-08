var Money = function(scene, camera)
{
	this.scene = scene; this.sceneObjects=[];
	this.camera = camera;
	this.noteT; this.currency;
	this.camz=1500; this.camy=250;
	this.M = 1000000;
	this.B = 1000000000;
	this.T = 1000000000000;
	this.amtArray=[100,10000,this.M,100*this.M];
	this.funArray=["hundred","tenThousands","million","million100"];
};
		Money.prototype.show = function(currency, amount){
			this.clearScene();
			this.currency = currency;
			this.noteT = new THREE.TextureLoader().load(currency.img);
			var showAmtArray=[0,0,0,0];
			camy=200;
			camz = 1250;
			var zfactor=1;
			var yfactor=1;
			amount = parseInt(amount);
			for (var i=this.amtArray.length-1;i>=0;i--)
			{
				var numberofbundels = parseInt(amount/this.amtArray[i]);
				if( numberofbundels >0){
					showAmtArray[i] = numberofbundels*(100/this.currency.noteValue);
					amount = amount% - (numberofbundels*this.amtArray[i]);
				}
			}
			console.log(showAmtArray);
			var position={x:-3200,z:1200};
			lookat= new THREE.Vector3(-3200,0,1200);
			var foundnonzero = false;
			for (var i=0;i<showAmtArray.length;i++)
				{
				if(foundnonzero==false && showAmtArray[i]==0){
					continue;
					}
				else
					foundnonzero=true;
					
				if(foundnonzero && showAmtArray[i]==0) {
					position.x +=200;
					continue;
					}
					zfactor +=(i*i*150);
					yfactor += (i*i*150);
					camz +=(zfactor);
					camy +=(yfactor);
				position = this[this.funArray[i]](showAmtArray[i],position);
				}	
				camera.position.z =camz;
				camera.position.y =camy;
				return lookat;
		}
		
		Money.prototype.million=function(noofbundels,inp){
			var position={x:0,z:0};
			var initialposition={x:inp.x,y:0,z:inp.z};
			initialposition.x+=100;
			var sizex=this.currency.length*2,sizez=this.currency.width*5;
			var rowsize= parseInt(Math.sqrt(noofbundels));
			var noteT1 = new THREE.TextureLoader().load(this.currency.img);
			noteT1.wrapS = noteT1.wrapT = THREE.RepeatWrapping;
			noteT1.repeat.set( 2, 5 );
			var noteS = new THREE.TextureLoader().load('img/noteside.png');
			noteS.wrapS = noteS.wrapT = THREE.RepeatWrapping;
			noteS.repeat.set( 2, 10 );
			var noteS1 = new THREE.TextureLoader().load('img/noteside.png');
			noteS1.wrapS = noteS1.wrapT = THREE.RepeatWrapping;
			noteS1.repeat.set( 5, 10 );
			var materials =new THREE.MeshFaceMaterial( [
			   new THREE.MeshBasicMaterial({
				   map: noteS1
			   }),
			   new THREE.MeshBasicMaterial({
				   map: noteS1
			   }),
			   new THREE.MeshBasicMaterial({
				   map: noteT1
			   }),
			   new THREE.MeshBasicMaterial({
				   map: new THREE.TextureLoader().load('img/noteside.png')
			   }),
			   new THREE.MeshBasicMaterial({
				   map: noteS
			   }),
			   new THREE.MeshBasicMaterial({
				   map: noteS1
				})
				]);
			for (var i=0;i<noofbundels;i++){
				position.x =((i%rowsize)*sizex) + initialposition.x;
					position.z=(parseInt((i/rowsize))*sizez) + initialposition.z;
					var cube1 = new THREE.Mesh(
				new THREE.CubeGeometry(this.currency.length*2, 0.1*1000, this.currency.width*5),  materials);
				cube1.position.x= position.x;
				cube1.position.z= position.z;
				cube1.position.y=0.1*1000/2;
				var strip = new THREE.Mesh(
							new THREE.CubeGeometry(10, (0.1*1000)+10, this.currency.width*5+10),  new THREE.MeshBasicMaterial({color:0xFAF082}));
							strip.position.x=-50;
				cube1.add(strip);
				strip = new THREE.Mesh(
							new THREE.CubeGeometry(10, (0.1*1000)+10, this.currency.width*5+10),  new THREE.MeshBasicMaterial({color:0xFAF082}));
							strip.position.x=50;
				cube1.add(strip);
				this.scene.add( cube1 );
				this.sceneObjects.push(cube1);
			}
			return {x:initialposition.x+(this.currency.length*2*rowsize)+100,z:initialposition.z};
		};
		
		Money.prototype.million100 = function(noofbundels,inp){
			var initialposition={x:inp.x,y:0,z:inp.z};
			initialposition.x+=this.currency.length*2*2;
			var sizex=this.currency.length*2.25*4,sizez=this.currency.width*5*3;// to add the gap between the bundles
			var rowsize= parseInt(Math.sqrt(noofbundels));
			var position={x:0,z:0};
			var noteT1 = new THREE.TextureLoader().load(this.currency.img);
			noteT1.wrapS = noteT1.wrapT = THREE.RepeatWrapping;
			noteT1.repeat.set( 8, 12 );
			var noteS = new THREE.TextureLoader().load('img/noteside.png');
			noteS.wrapS = noteS.wrapT = THREE.RepeatWrapping;
			noteS.repeat.set( 8, 50 );
			var noteS1 = new THREE.TextureLoader().load('img/noteside.png');
			noteS1.wrapS = noteS1.wrapT = THREE.RepeatWrapping;
			noteS1.repeat.set( 12, 50);
			var materials =new THREE.MeshFaceMaterial( [
			   new THREE.MeshBasicMaterial({
				   map: noteS1
			   }),
			   new THREE.MeshBasicMaterial({
				   map: noteS1
			   }),
			   new THREE.MeshBasicMaterial({
				   map: noteT1
			   }),
			   new THREE.MeshBasicMaterial({
				   map: new THREE.TextureLoader().load('img/noteside.png')
			   }),
			   new THREE.MeshBasicMaterial({
				   map: noteS
			   }),
			   new THREE.MeshBasicMaterial({
				   map: noteS
				})
				]);
			for (var i=0;i<noofbundels;i++){
				position.x =((i%rowsize)*sizex) + initialposition.x;
				position.z=(parseInt((i/rowsize))*sizez) + initialposition.z;
				var cube1 = new THREE.Mesh(
				new THREE.CubeGeometry(this.currency.length*2*4, 0.07*1000*10, this.currency.width*5*5/2),  materials);
				cube1.position.x= position.x;
				cube1.position.z= position.z;
				cube1.position.y=0.07*1000*10/2;
				this.scene.add( cube1 );
				var stposition=-350;
				for(var st=0;st<8;st++){
				var strip = new THREE.Mesh(
							new THREE.CubeGeometry(10, (0.07*1000*10)+10, (this.currency.width*5*5/2)+10),  new THREE.MeshBasicMaterial({color:0xFAF082}));
							strip.position.x=stposition;
							stposition+=100;
							cube1.add(strip);
							this.sceneObjects.push(cube1);
					}
				}
				return {x:initialposition.x+(this.currency.length*4*rowsize)+100,z:initialposition.z};
		}
		
		Money.prototype.tenThousands = function(noofbundels,initialposition){
			var rowsize= parseInt(Math.sqrt(noofbundels));
			var sizex=this.currency.length,sizez=this.currency.width;
			var position={x:0,z:0};
			var noteS = new THREE.TextureLoader().load('img/noteside.png');
			noteS.wrapS = noteS.wrapT = THREE.RepeatWrapping;
			noteS.repeat.set( 1, 100 );
				   var materials =new THREE.MeshFaceMaterial( [
				   new THREE.MeshBasicMaterial({
					   map: noteS
				   }),
				   new THREE.MeshBasicMaterial({
					   map: new THREE.TextureLoader().load('img/noteside.png')
				   }),
				   new THREE.MeshBasicMaterial({
					   map: this.noteT
				   }),
				   new THREE.MeshBasicMaterial({
					   map: new THREE.TextureLoader().load('img/noteside.png')
				   }),
				   new THREE.MeshBasicMaterial({
					   map: noteS
				   }),
				   new THREE.MeshBasicMaterial({
					   map: new THREE.TextureLoader().load('img/noteside.png')
				   })
				]);
			for (var i=0;i<noofbundels;i++){
				position.x =((i%rowsize)*sizex) + initialposition.x;
				position.z=(parseInt((i/rowsize))*sizez) + initialposition.z;
			var cube1 = new THREE.Mesh(
			new THREE.CubeGeometry(this.currency.length, 0.1*100, this.currency.width),materials);
			cube1.position.x= position.x;
			cube1.position.z= position.z;
			cube1.position.y= 0.1*100/2;
			this.scene.add( cube1 );
			this.sceneObjects.push(cube1);
				}		
			return {x:initialposition.x+(this.currency.length*(rowsize))+100,z:initialposition.z};
			}
			
		Money.prototype.hundred = function(noofbundels,initialposition){
			var notesinGroup =10;
			var rowsize= parseInt(Math.sqrt(parseInt(noofbundels/notesinGroup)));
			var tmpnoofbundels = parseInt(noofbundels/notesinGroup);
			if(noofbundels%notesinGroup > 0){
				tmpnoofbundels++;
				rowsize++;
			}
			var sizex=this.currency.length+50,sizez=this.currency.width+100;
			var position={x:0,z:0};
			position.x = initialposition.x;
			position.z = initialposition.z;
			position.y = 0;
			for (var i=0;i<tmpnoofbundels;i++){
				position.x =((i%rowsize)*sizex) + initialposition.x;
				position.z=(parseInt((i/rowsize))*sizez) + initialposition.z;
				if(i==0 && noofbundels%notesinGroup>0)
					this.bundle10Notes(noofbundels%notesinGroup, position);
				else
					this.bundle10Notes(notesinGroup, position);
				}
			return {x:initialposition.x+(sizex*rowsize)+100,z:initialposition.z};
			//return {x:position.x+(this.currency.length+90),z:initialposition.z};
		};
	
	Money.prototype.bundle10Notes= function(number, initialposition){
					console.log("in bundle10Notes", number);
					var position={x:0,y:0,z:0};
					position.x = initialposition.x;
					position.z = initialposition.z;
					position.y = 0;
					var rot=0;
					var materials =new THREE.MeshFaceMaterial( [
				   new THREE.MeshBasicMaterial({
					   map: new THREE.TextureLoader().load('img/noteside.png')
				   }),
				   new THREE.MeshBasicMaterial({
					   map: new THREE.TextureLoader().load('img/noteside.png')
				   }),
				   new THREE.MeshBasicMaterial({
					   map: this.noteT
				   }),
				   new THREE.MeshBasicMaterial({
					   map: new THREE.TextureLoader().load('img/noteside.png')
				   }),
				   new THREE.MeshBasicMaterial({
					   map: new THREE.TextureLoader().load('img/noteside.png')
				   }),
				   new THREE.MeshBasicMaterial({
					   map: new THREE.TextureLoader().load('img/noteside.png')
				   })
				]);
				for(var i=0;i<number;i++){
					var geo = new THREE.CubeGeometry(this.currency.length, 0.1, this.currency.width);
					geo.applyMatrix( new THREE.Matrix4().makeTranslation( 50, 0, 0) );
					var cube1 = new THREE.Mesh(
					//new THREE.CubeGeometry(100, 0.1, 50),materials);
					geo,materials);
					
					cube1.position.x= position.x;
					cube1.position.z= position.z;
					cube1.position.y= position.y;
					cube1.rotation.y = rot;
					rot+=0.08;
					position.y+=0.08;
					this.scene.add(cube1);
					this.sceneObjects.push(cube1);
					console.log("adding..", position);
				}
				//return {x:position.x+(this.currency.length),z:initialposition.z};
	}

	Money.prototype.clearScene = function(){
	for( var i = this.sceneObjects.length - 1; i >= 0; i--) { 
		 this.scene.remove(this.sceneObjects[i]);
	}
	};