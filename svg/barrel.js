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
	$("#layer1").animate({
		svg3d: {
			translate3d : {x: 100, y: 300, z: 0},
			clone3d: {
				row: 18,
				x: 50,
                                surface: 4000,
				y: 50,
				z: 50,
				nb: 500

			},
		}
	}, {
		duration: 1000, 
		easing: "easeInCubic"
 	});
	
};
