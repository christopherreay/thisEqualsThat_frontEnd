ThisEqualsThat = window.ThisEqualsThat || {};

ThisEqualsThat.BootstrapObjects = new
function($)
{ O = this;
  var $window = $(window);

  this.windowResizeController = function()
  { $("body").toggleClass("xs", $(window).width() < 400);
    $window.off("resize", O.windowResizeController);
    setTimeout(function () {$window.on("resize", O.windowResizeController); } , 100);
  }
  $window.on("resize", O.windowResizeController);

  this.onePageApp =
  function()
  { 
  };

  this.div = 
  function(attributes)
  { var toReturn = null;
    if (typeof(attributes) == "string")
      toReturn = $("<div />", { "class": attributes } );
    else
      toReturn = $("<div>", attributes);
    return toReturn;
  };


  this.backgroundImageDiv =
  function(img, padding)
  { var toReturn = O.div().append(O.div);
  };

  this.create =
  function(listContents, current=null, depth=0)
  { var toReturn = [];
    for (item of listContents)
    { if ( typeof(item) == "string" )
      { var newElem = O.div(item);
        if (current === null) 
        { current = newElem;
        }
        else 
        { current.append(newElem);
          current = newElem;
        }
        toReturn.push(current);
      }
      else if ( Object.prototype.toString.call(item) === "[object Array]" )
      { var subTree = [];
        for (subItem of item)
        { var child = O.create(subItem, current, depth+1);
          subTree.push(child);
        }
        toReturn.push(subTree);
      }
      else
      { var subDict = {};
        for (key in item)
        { subDict[key] = O.create(item[key], current, depth+1);
          current.append(subDict[key]);
          toReturn.push(subDict);
        }
      }

    }
    if (depth == 0) console.log("create", toReturn);
    return toReturn;
  }

  this.wrap =
  function (object, classes)
  { return O.div({"class": classes }).append(object);
  };
  this.row = 
  function(classes)
  { toReturn = O.div( {"class": row+" "+classes } );
  }
  this.col =
  function(colSize, classes)
  { return O.div({"class": "col-"+colSize+" "+classes } );
  }

        // <div class="bs-component">
        //   <div class="list-group">
        //     <div class="list-group-item">
        //       <div class="row-action-primary">
        //         <div class="visualEye" />
        //       </div>
        //       <div class="row-content">
        //         <div class="least-content">15m</div>
        //         <h4 class="list-group-item-heading">Tile with a label</h4>

        //         <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus.</p>
        //       </div>
        //     </div>
        //     <div class="list-group-separator"></div>
        //   </div>
        // </div>

  this.listGroups =
  { /*<div class="bs-component">
          <div class="list-group">
            <div class="list-group-item">
              <div class="row-action-primary">
                <i class="material-icons">folder</i>
              </div>
              <div class="row-content">
                <div class="least-content">15m</div>
                <h4 class="list-group-item-heading">Tile with a label</h4>

                <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus.</p>
              </div>
            </div>
            <div class="list-group-separator"></div>
            <div class="list-group-item">
              <div class="row-action-primary">
                <i class="material-icons">folder</i>
              </div>
              <div class="row-content">
                <div class="least-content">10m</div>
                <h4 class="list-group-item-heading">Tile with a label</h4>

                <p class="list-group-item-text">Maecenas sed diam eget risus varius blandit.</p>
              </div>
            </div>
            <div class="list-group-separator"></div>
            <div class="list-group-item">
              <div class="row-action-primary">
                <i class="material-icons">folder</i>
              </div>
              <div class="row-content">
                <div class="least-content">8m</div>
                <h4 class="list-group-item-heading">Tile with a label</h4>

                <p class="list-group-item-text">Maecenas sed diam eget risus varius blandit.</p>
              </div>
            </div>
            <div class="list-group-separator"></div>
          </div>
        </div>*/
  }

}(jQuery);

window.O = ThisEqualsThat.BootstrapObjects;


