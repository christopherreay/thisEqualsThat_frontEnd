ThisEqualsThat = window.ThisEqualsThat || {};

ThisEqualsThat.mapppm = {}
ThisEqualsThat.mapppm.init = function()
{ L.mapbox.accessToken = 'pk.eyJ1IjoieW9nZXNodXByZXRpIiwiYSI6ImNpb3kzbmdlbjAxdnh1Y204YmhhYWNjd3YifQ.QJ1jXBHRbAz0PAnrG6cCLg';
  var map = L.mapbox.map('map', 'mapbox.streets')
      .setView([51.45997, -2.59676], 14);
  map.on('popupclose', function(e) {
    var marker = e.popup._source.feature.properties;
    console.log("popup close:"+marker);
  });
  var featureLayer = L.mapbox.featureLayer({
          type: 'FeatureCollection',
          features: [{
              type: 'Feature',
              properties: {
                  'canvasId': 'can1',
          'p1': '20',
          'p2': '10',
          'p3': '1',
                  'marker-color': '#548cba',
                  'marker-size': 'large',
                  'marker-symbol': 'ferry'
              },
              geometry: {
                  type: 'Point',
                  coordinates: [-2.59715, 51.45458]
              }
      },
      {
              type: 'Feature',
              properties: {
          'canvasId': 'can2',
          'p1': '2',
          'p2': '1',
          'p3': '10',
                  'marker-color': '#548cba',
                  'marker-size': 'large',
                  'marker-symbol': 'ferry'
              },
              geometry: {
                  type: 'Point',
                  coordinates: [-2.59015, 51.45058]
              }
          }]
      })
      .addTo(map);  
  // Note that calling `.eachLayer` here depends on setting GeoJSON _directly_
  // above. If you're loading GeoJSON asynchronously, like from CSV or from a file,
  // you will need to do this within a `featureLayer.on('ready'` event.
  featureLayer.eachLayer(function(layer) {
  console.log(layer.feature.properties.canvasId);
      // here you call `bindPopup` with a string of HTML you create - the feature
      // properties declared above are available under `layer.feature.properties`
      var content = '<h2>Particles PPM!<\/h2><br>' +
      '<div id=\"'+layer.feature.properties.canvasId+'\" style=\"width:200px\""><\/div>';
      layer.bindPopup(content);
    layer.on("popupclose", function(e) {
              e.target.feature.properties.renderer.destroy();
          });
    layer.on('click', function(e) {
    //document.getElementsByClassName("leaflet-popup-content").style.width="200 px";
    container = document.getElementById(layer.feature.properties.canvasId);
    layer.feature.properties.renderer = new GRenderer();
    layer.feature.properties.renderer.init(container,layer.feature.properties.p1,layer.feature.properties.p2,layer.feature.properties.p3);
    //var d = document.getElementById('myCanvas');
    //d.style.position = "relaive";
    /*d.style.left = (e.originalEvent.screenX-80)+'px';
    d.style.top = (e.originalEvent.screenY-250)+'px';*/
    //console.log(e.originalEvent.screenX,e.originalEvent.screenY)
    //alert(e.latlng);
    layer.feature.properties.renderer.startAnimation();
    });   
  }); 
}

$().ready
( function()
  { ThisEqualsThat.mapppm.init();
  }
)