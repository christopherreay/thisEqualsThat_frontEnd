GRenderer = function(){
			this.container; this.stats; this.program; this.gui;this.anm=true;this.anmc=true;this.sprite;
			this.contr;this.n2=50;this.o2=10;this.co2=1;
			//var cameraControl;
			//var clock= new THREE.Clock();
			this.camera; this.scene;this.renderer; this.group; this.particle;this.camz=400; this.direction=0; this.touchstart=false;
			this.currentControlCounter = 3; this.cubesize=100; this.boundingCube,this.box;
			this.mouseX = 0; this.mouseY = 0;
			this.pg0=[]; this.pg1=[]; this.pg2=[]; this.pg3=[]; this.pg4=[];this.pg5=[];
			this.pg6=[]; this.pg7=[]; this.pg8=[]; this.pg9=[]; this.pg10=[];
			this.windowHalfX = window.innerWidth / 2;
			this.windowHalfY = window.innerHeight / 2;
			this.startAnimationFlag =true;
		/*var Datcontrol = function() {
		  this.User = 'Control';
		  this.size=1;
		  
		};
		
		window.onload = function() {
			  contr = new Datcontrol();
			  gui = new dat.GUI();
			  gui.add(contr, 'User');
			  gui.add(contr,"size",0.5,2).onChange(function(value) {
				scale=value;
			});*/
}

GRenderer.prototype.boundingBox=function(){
	var f=new THREE.CubeGeometry(this.cubesize+5,this.cubesize+5,this.cubesize+5);
	var d=new THREE.MeshBasicMaterial({color:0x000000,transparent:false,opacity:0.1});
	this.box=new THREE.Mesh(f,d);
	this.scene.add(this.box);
	this.boundingCube=new THREE.BoxHelper(this.box);
	this.boundingCube.material=new THREE.LineBasicMaterial({color:0x000000,transparent:false,opacity:0.1});
	this.scene.add(this.boundingCube);
	};
	
GRenderer.prototype.update = function(i,count,size,color){
	addParticles(i,Math.round(count),size,color);
}

GRenderer.prototype.addParticles = function(ini,count,size,color){
				console.log("in addParticles");
				var store;
				//count = Math.round(count/400);
				store = this['pg'+ini];
				console.log("store.length "+store.length);
				if(store.length>0){
					for(var i=0;i<store.length;i++){
						this.group.remove(store[i]);
					}
				}
				switch(ini){
				case 1:
					this.pg1=[];store=this.pg1;break;
				case 2:	
					this.pg2=[];store=this.pg2;break;
				case 3:
					this.pg3=[];store=this.pg3; break;
				case 4:
					this.pg4=[];store=this.pg4; break;
				case 5:
					pg5=[];store=pg5; break;
				case 6:
					pg6=[];store=pg6; break;
				case 7:
					pg7=[];store=pg7; break;
				case 8:
					pg8=[];store=pg8; break;
				case 9:
					pg9=[];store=pg9; break;
				case 10:
					pg10=[];store=pg10; break;
				default:
				}		
				
			var material = new THREE.SpriteCanvasMaterial( {
						color: color,
						program: program
					} );
					
				var blueposition = -this.cubesize/2;
				if (ini==0){
					for ( var ii = 0; ii < this.cubesize; ii++ ) {
						particle = new THREE.Sprite( material );
						particle.position.x = blueposition;
						particle.position.y = 0;
						particle.position.z = 0;
						//particle.scale.x = particle.scale.y = Math.random() * 1 + r;
						particle.scale.x = particle.scale.y =  size;
						this.group.add( particle );
						
						//store.push(particle);
						particle = new THREE.Sprite( material );
						particle.position.x = 0;
						particle.position.y = blueposition;
						particle.position.z = 0;
						//particle.scale.x = particle.scale.y = Math.random() * 1 + r;
						particle.scale.x = particle.scale.y =  size;
						this.group.add( particle );
						//store.push(particle);
						particle = new THREE.Sprite( material );
						particle.position.x = 0;
						particle.position.y = 0;
						particle.position.z = blueposition;
						//particle.scale.x = particle.scale.y = Math.random() * 1 + r;
						particle.scale.x = particle.scale.y =  size;
						this.group.add( particle );
						//store.push(particle);
						//console.log(particle.position.x);
						blueposition=blueposition+1;
						}
					return;
					}

				for ( var ii = 0; ii < count; ii++ ) {
					particle = new THREE.Sprite( material );
					particle.position.x = Math.random() * this.cubesize - this.cubesize/2;
					particle.position.y = Math.random() * this.cubesize - this.cubesize/2;
					particle.position.z = Math.random() * this.cubesize - this.cubesize/2;
					//particle.scale.x = particle.scale.y = Math.random() * 1 + r;
					particle.scale.x = particle.scale.y =  size;
					var velocity ={x:Math.random(),y:Math.random(),z:Math.random()};
					particle.velocity = velocity;
					this.group.add( particle );
					store.push(particle);
				}
				
				console.log("out addParticles");
}

GRenderer.prototype.init = function(container,p1,p2,p3) {
	this.n2=p1;
	this.o2=p2;
	this.co2=p3;
				//container = document.createElement( 'div' );
				//document.body.appendChild( container );

				this.camera = new THREE.PerspectiveCamera(25,200/200,1,5000 );
				//camera.position.z = 0;
				//camera.position.x = 400;
				//camera.position.y = 400;

				this.scene = new THREE.Scene();

				/*var map = new THREE.TextureLoader().load( "img/fog-240075_1280.jpg" );
                var material = new THREE.SpriteMaterial( { map: map, fog: false } );
                sprite = new THREE.Sprite( material );
				sprite.position.set(0,0,-1000);
				sprite.scale.set(1500,1500,1500);
				scene.add( sprite );*/
				var PI2 = Math.PI * 2;
				program = function ( context ) {

					context.beginPath();
					context.arc( 0, 0, 0.5, 0, PI2, true );
					context.fill();

				};

				this.group = new THREE.Group();
				
				//addParticles(0,100,1,'#0000ff');
				this.addParticles(1,this.n2,5,'#0000ff');
				this.addParticles(2,this.o2,5,'#00ff00');
				this.addParticles(3,this.co2,5,'#ff0000');
				
				this.scene.add( this.group );
				//addParticles(4,0.5,2.5,'#000000');
				this.renderer = new THREE.CanvasRenderer({ alpha: true });
				//renderer.setClearColor( 0xa9db8b );
				//renderer = new THREE.WebGLRenderer({ alpha: true });
				this.renderer.setPixelRatio( window.devicePixelRatio );
				this.renderer.setSize( 200, 200 );
				//renderer.setSize( 200,100);
				container.appendChild( this.renderer.domElement );
				//window.addEventListener( 'mousedown', onDocumentTouchStart, false );
				this.boundingBox();
			}
			
GRenderer.prototype.startAnimation = function() {
				//console.log(" startAnimation");
			    //var delta = clock.getDelta();
				if(this.startAnimationFlag){
					this.render();
					requestAnimationFrame(this.startAnimation.bind(this));
				}
				//cameraControl.update(delta);	
			}
			
GRenderer.prototype.stopAnimation = function() {
	this.startAnimationFlag = false;
}

GRenderer.prototype.destroy = function() {
	var that = this;
	console.log(" Destroy");
	this.scene.remove(this.group);
				for(var ii=1;ii<=this.currentControlCounter;ii++){
					this.group.remove(this['pg'+ii]);
					this['pg'+ii]=[];
			}
	//this.scene.remove(this.group);
	setTimeout(function(){ that.startAnimationFlag = false;
	this.scene=null;
	this.camera=null;
	}, 100);
}
	
GRenderer.prototype.render = function() { 
				//console.log(" render");  
				//camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				//camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
				this.camera.position.z = this.camz;
				this.camera.lookAt( this.scene.position );
				if(this.touchstart){
					if(this.direction==1)
						this.camz+=10;
					else
						this.camz-=10;
				}
				
				if(this.anm){
					this.updateVelocity();
					}
				
				if(this.boundingCube){
					this.group.rotation.x += 0.005;
					this.group.rotation.y += 0.005;
					
					this.box.rotation.x += 0.005;
					this.box.rotation.y += 0.005;
					this.boundingCube.rotation.x += 0.005;
					this.boundingCube.rotation.y += 0.005;
				}
				this.renderer.render( this.scene, this.camera );
				
			}
GRenderer.prototype.updateVelocity = function(){
			//console.log("currentControlCounter "+currentControlCounter);
			//console.log(this);
			for(var ii=1;ii<=this.currentControlCounter;ii++){
				var store = this['pg'+ii];
				//console.log(store.length);
				if(store.length>0){
					for (var j=0;j<store.length;j++){
						store[j].position.set(store[j].position.x+store[j].velocity.x,store[j].position.y+store[j].velocity.y,store[j].position.z+store[j].velocity.z);
						if (store[j].position.x>=this.cubesize/2) store[j].velocity.x=-store[j].velocity.x;
						if (store[j].position.y>=this.cubesize/2) store[j].velocity.y=-store[j].velocity.y;
						if (store[j].position.z>=this.cubesize/2) store[j].velocity.z=-store[j].velocity.z;
						if (store[j].position.x<=-this.cubesize/2) store[j].velocity.x=-store[j].velocity.x;
						if (store[j].position.y<=-this.cubesize/2) store[j].velocity.y=-store[j].velocity.y;
						if (store[j].position.z<=-this.cubesize/2) store[j].velocity.z=-store[j].velocity.z;
					}
				}
			}
}	