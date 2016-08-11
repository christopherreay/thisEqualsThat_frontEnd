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

  // this.regex_namespace    = /^([^:]+/;
  this.regex_elementType  = /^([^.#@]+)/;
  this.regex_id           = /#([^.@]+)/;
  this.regex_classes      = /\.([^@]+)/;
  this.regex_chainCalls   = /@(.*)/;
  this.regex_dot          = /\./g;

  this.elementDefSequence = {"elementType": "div", "id":"", "classes":""};

  this.elementNamespaceDict = 
  { "xhtml"     : "http://www.w3.org/1999/xhtml",
    "svg"       : "http://www.w3.org/2000/svg",
  }

  this.create =
  function(listContents, targetDict=null, current=null, depth=0)
  { var toReturn = [];
    for (item of listContents)
    { if (! item) continue;

      // if (typeof(item) == "string")
      // { var itemSequentialList = item.split(" ");
      //   if (itemSequentialList.length > 1)
      //     item = itemSequentialList;
      // }

      if ( typeof(item) == "string" )
      { if ( item.startsWith("@") )
        { current.text( item.substring(1) );
          continue;
        }
        
        var elementDef = {};

        for (elementParamName in this.elementDefSequence)
        { var matchValue = item.match(this["regex_"+elementParamName]);
          if (matchValue !== null)
          { elementDef[elementParamName] = matchValue[1];
          }
          else
          { elementDef[elementParamName] = this.elementDefSequence[elementParamName];
          }
        }
        elementDef.classes = $.trim(elementDef.classes.replace(this.regex_dot, " "));

        elementTypeSplit = elementDef.elementType.split(":");
        if (elementTypeSplit.length > 1)
        { elementDef.elementType = elementTypeSplit[1];
          elementDef.namespace   = elementTypeSplit[0];
        }
        else
        { elementDef.namespace   = "xhtml"
        }
        var elemOptions = {};
        if (elementDef.id) elemOptions.id = elementDef.id;
        if (elementDef.classes) elemOptions.class = elementDef.classes;

        // var newElem = 
        //     $("<"+elementDef.elementType+"/>",
        //       elemOptions
        //     );
        
        var newElem = 
            $(document.createElementNS(O.elementNamespaceDict[elementDef.namespace], elementDef.elementType)).attr(elemOptions);

        var dictKey = elementDef.id || elementDef.classes.split(" ")[0];

        if (current === null) 
        { current = newElem;
        }
        else 
        { current.append(newElem);
          current = newElem;
        }
        targetDict[dictKey] = newElem;
        toReturn.push(current);
      }
      else if ( Object.prototype.toString.call(item) === "[object Array]" )
      { var subTree = [];
        for (subItem of item)
        { var child = O.create(subItem, targetDict, current, depth+1);
          subTree.push(child);
        }
        toReturn.push(subTree);
      }
      else if ( item instanceof jQuery )
      { if (current) current.append(item);

        current = item.slice(-1);
        
        var dictKey = item.attr("id")
        var classAttr = item.attr("class")
        if (classAttr) classAttr = classAttr.split(" ")[0];
        dictKey = dictKey || classAttr || "__blank";

        targetDict[ dictKey ] = item;

        toReturn.push(item);
      }
    }
    if (depth == 0) console.log("create", toReturn);
    return toReturn;
  }

  this.navbar_collapse_id_counter = 0;
  this.navbarFixedLeft =
  function(passThrough, appendTo, navbarUniqueClass, logo=".navbar-brand-logo", mainContent)
  { if (!navbarUniqueClass) navbarUniqueClass = "navbar-autoID-"+this.navbar_collapse_id_counter++;
    var toReturn =
        O.create( [".bs-component."+navbarUniqueClass, ".container-fluid", ".row", 
                    [ [ ".col-xs-12.col-sm-12.col-md-3.col-lg-2" ,  "bs-component", ".navbar.navbar-default.navbar-fixed-side", ".navbar-fixed-side-container", 
                        [ [ ".navbarHeader.navbar-header", 
                            [ [ $("<button type='button' class='navbar-toggle collapsed' data-toggle='collapse' data-target='."+navbarUniqueClass+"-collapse' aria-expanded='false'>"),
                                [ [ "span.icon-bar" ],
                                  [ "span.icon-bar" ], 
                                  [ "span.icon-bar" ],
                                ],
                              ],
                              [ "a.navbar-brand", logo, ".ripple-container"],
                            ],
                          ],
                          [ ".navbar-collapse.collapse."+navbarUniqueClass+"-collapse",
                            [ ["ul.navbarContent.nav.navbar-nav"],
                              ["ul.navbarContentLeft.nav.navbar-left"],
                              ["ul.navbarContentRight.nav.navbar-right"],
                            ]
                          ],
                        ],
                      ],
                      [ ".col-xs-12.col-sm-12.col-md-9.col-lg-10",  mainContent ]
                    ]
                  ],
                  passThrough,
                  appendTo
                );
    return toReturn[0];
  } 
  
  this.modalUniqueCounter = 0;
  this.modal =
  function(passThrough, appendTo, modalUniqueClass=null, modalHeader="", modalBody="", modalFooter="")
  { if (!modalUniqueClass) modalUniqueClass = "modal-autoID-"+this.modalUniqueCounter++;
    var toReturn =
        O.create
        ( ["."+modalUniqueClass+".modal.fade", ".modal-dialog", 
            ".modal-content",
            [ [ ".modal-header", 
                [ [ $("<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>×</button>") ],
                  [ "h4.modal-title", modalHeader ],
                ],
              ],
              [ ".modal-body",   modalBody   ],
              [ ".modal-footer", modalFooter ],
            ],
          ],
          passThrough,
          appendTo
        );
    // <div class="modal">
    //   <div class="modal-dialog">
    //     <div class="modal-content">
    //       <div class="modal-header">
    //         <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    //         <h4 class="modal-title">Modal title</h4>
    //       </div>
    //       <div class="modal-body">
    //         <p>One fine body…</p>
    //       </div>
    //       <div class="modal-footer">
    //         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    //         <button type="button" class="btn btn-primary">Save changes</button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    return toReturn[0];
  }

  this.openModal_aTag =
  function (passThrough, appendTo, modalUniqueClass=null, openModalClassString, openModalContent)
  { if (!modalUniqueClass) console.warn("openModal created without referenceID");
    var toReturn =
    O.create
    ( [ $(`<a href="#" class='${openModalClassString.replace(this.regex_dot, " ")}' data-toggle='modal' data-target='.${modalUniqueClass}' />`), 
        openModalContent 
      ],
      passThrough,
      appendTo
    );

   //  <a href="#" class="btn btn-lg btn-success" 
   // data-toggle="modal" 
   // data-target="#basicModal">Click to open Modal</a>

    return toReturn[0];
  }


  this.listGroupItem =
  function(passThrough, appendTo, listGroupItem_element, itemPrependList, sizeList, actionPrimary, actionSecondary, heading, text, cursorStyle="pointer")
  { O.create
    ( [ listGroupItem_element+itemPrependList+".col-lg-"+sizeList[0]+".col-md-"+sizeList[1]+".col-sm-"+sizeList[2]+".col-xs-"+sizeList[3]+".list-group-item", 
        [ [ ".row-action-primary", actionPrimary ], 
          [ ".row-content", 
            [ [ "action-secondary"          , actionSecondary ],
              [ ".list-group-item-heading"  , heading         ],
              [ ".list-group-item-text"     , text            ]
            ], 
          ],
        ],
      ],
      passThrough,
      appendTo
    );
  }

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


