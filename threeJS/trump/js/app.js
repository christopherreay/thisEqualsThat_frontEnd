/**
 * @author mrdoob / http://mrdoob.com/
 */

var APP = {

	Player: function () {

		var loader = new THREE.ObjectLoader();
		var camera, scene, renderer, json;

		var events = {};

		var dom = document.createElement( 'div' );

		this.dom = dom;

		this.width = 500;
		this.height = 500;

		this.load = function ( jsonVal ) {
			json = jsonVal;

			this.renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer = this.renderer;
			this.renderer.gammaOutput = true;
			this.renderer.setClearColor( 0x000000 );
			this.renderer.setPixelRatio( window.devicePixelRatio );

			var project = json.project;

			if ( project.shadows ) this.renderer.shadowMap.enabled = true;
			if ( project.vr ) this.renderer.vr.enabled = true;

			dom.appendChild( this.renderer.domElement );

			this.setScene( loader.parse( json.scene ) );
			this.camera = loader.parse( json.camera );
			this.setCamera( this.camera );

		};

		this.setCamera = function ( value ) {

			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

			if ( renderer && renderer.vr.enabled ) {

				dom.appendChild( WEBVR.createButton( renderer ) );

			}

		};

		this.setScene = function ( value ) {

			scene = value;

		};

		this.setSize = function ( width, height ) {

			this.width = width;
			this.height = height;

			if ( camera ) {

				camera.aspect = this.width / this.height;
				camera.updateProjectionMatrix();

			}

			if ( renderer ) {

				renderer.setSize( width, height );

			}

		};

		function dispatch( array, event ) {

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				array[ i ]( event );

			}

		}

		function animate() {
			if (scene.children.length <= nbClone) {
				var clone = _.cloneDeep(json.scene.object.children[json.scene.object.children.length - 1]);
				clone.matrix[12] -= 100;
				json.scene.object.children.push(clone);
				scene = loader.parse( json.scene );
			}
			renderer.render( scene, camera );
		}

		this.play = function () {

			renderer.setAnimationLoop( animate );

		};

		this.dispose = function () {

			while ( dom.children.length ) {

				dom.removeChild( dom.firstChild );

			}

			renderer.dispose();

			camera = undefined;
			scene = undefined;
			renderer = undefined;

		};

	}

};
