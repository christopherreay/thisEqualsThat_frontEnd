xOrigin = 600;
yOrigin = 10;
xInfinite = 600;
yInfinite = 10;
//zRatio = 20;
sortAlgo = null;

rg1024_metal_barrel = function() {
	/*var shapeAxex = shapeFactory(document.getElementById("axex"));
	shapeAxex.transform([setTranslationMatrix(0, 0, 0)]);
	var shapeAxey = shapeFactory(document.getElementById("axey"));
	shapeAxey.transform([setTranslationMatrix(0, 0, 0)]);
	var shapeAxez = shapeFactory(document.getElementById("axez"));
	shapeAxez.transform([setTranslationMatrix(0, 0, 0)]);
  */
  console.log("running trees");
	$("#layer1").animate({
		svg3d: {
			translate3d : {x: 200, y: 600, z: -800},
			clone3d: {
				row: 4, //number of rows going backwards
				x: 600, //space left to right
      			  	surface: 4000, //no idea
				y: -600, //distance down the screen for each row
				z: 300,  // distance back for each row?
				nb: 16 //number of thingies
			},
		}
	}, {
		duration: 1000, 
		easing: "easeInCubic"
 	});
	
};
