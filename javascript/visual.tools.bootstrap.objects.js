ThisEqualsThat = window.ThisEqualsThat || {};

function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}

ThisEqualsThat.BootstrapObjects = new
function($)
{ O = this;
  var $window = $(window);

  O.windowResizeController = function()
  { var width = $window.width();
    $("body").toggleClass("xs", width < 400);
    $("body").toggleClass("sm", width < 768 && width > 400);
    $window.off("resize", O.windowResizeController);
    setTimeout(function () {$window.on("resize", O.windowResizeController); } , 300);
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

  this.elementDefSequence = {"id":"", "classes":"", "elementType": "div"};

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

        var elementDef  = {};
        var dictKey     = false;

        for (elementParamName in this.elementDefSequence)
        { var matchValue = item.match(this["regex_"+elementParamName]);
          if (matchValue !== null)
          { elementDef[elementParamName] = matchValue[1];
            if (! dictKey) dictKey = matchValue[1].split(".")[0];
          }
          else
          { elementDef[elementParamName] = this.elementDefSequence[elementParamName];
          }
        }
        elementDef.classes = $.trim(elementDef.classes.replace(this.regex_dot, " "));
        if (! dictKey) dictKey = "__blank";


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
        dictKey = dictKey || classAttr || item.prop("nodeName").toLowerCase();

        targetDict[ dictKey ] = item;

        toReturn.push(item);
      }
      else if ( isObject(item) )
      { for (functionName in item)
        { var parametersListList = item[functionName];
          for (parametersList of parametersListList)
          {
            current[functionName](...parametersList);
          }
        }
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
        O.create( [".bs-component."+navbarUniqueClass+".height100", ".container-fluid.height100", ".row.height100",
                    [ [ ".navBarColumn" ,  "bs-component", ".navbar.navbar-default.navbar-fixed-top",
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
                      [ ".mainContentColumn.col-sm-offset-1.col-xs-12.col-sm-12.col-md-10",  mainContent ]
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
  { var toReturn = O.create
    ( [ listGroupItem_element+itemPrependList+".col-lg-"+sizeList[0]+".col-md-"+sizeList[1]+".col-sm-"+sizeList[2]+".col-xs-"+sizeList[3]+".list-group-item",
        [ [ ".row-action-primary", actionPrimary ],
          [ ".row-content",
            [ [ ".action-secondary"          , actionSecondary ],
              [ ".list-group-item-heading"  , heading         ],
              [ ".list-group-item-text"     , text            ]
            ],
          ],
        ],
      ],
      passThrough,
      appendTo
    );

    return toReturn;
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

  this.hoverPanel = function()
  { //invisible panel over the top of what is beneath.
    //:hover z-indexes the panel to the back
    //click: so does a click
    //  click return bound to mouseout of parent container
  }

  this.carousel =
  function(passThrough, appendTo, carouselUniqueClass, carouselPrependList, listOfSlides)
  { O.create
    ( [ carouselUniqueClass+itemPrependList+".crousel.slide",
        [ [ "ol.carousel-indicators"  ],
          [ "carousel-inner"          ],
        ],
        passThrough,
        appendTo
      ]
    );

    // <div id="myCarousel" class="carousel slide" data-ride="carousel">
    //   <!-- Indicators -->
    //   <ol class="carousel-indicators">
    //     <li data-target="#myCarousel" data-slide-to="0" class=""></li>
    //     <li data-target="#myCarousel" data-slide-to="1" class="active"></li>
    //     <li data-target="#myCarousel" data-slide-to="2" class=""></li>
    //   </ol>
    //   <div class="carousel-inner" role="listbox">
    //     <div class="item">
    //       <img class="first-slide" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="First slide">
    //       <div class="container">
    //         <div class="carousel-caption">
    //           <h1>Example headline.</h1>
    //           <p>Note: If you're viewing this page via a <code>file://</code> URL, the "next" and "previous" Glyphicon buttons on the left and right might not load/display properly due to web browser security rules.</p>
    //           <p><a class="btn btn-lg btn-primary" href="#" role="button">Sign up today</a></p>
    //         </div>
    //       </div>
    //     </div>
    //     <div class="item active">
    //       <img class="second-slide" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Second slide">
    //       <div class="container">
    //         <div class="carousel-caption">
    //           <h1>Another example headline.</h1>
    //           <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
    //           <p><a class="btn btn-lg btn-primary" href="#" role="button">Learn more</a></p>
    //         </div>
    //       </div>
    //     </div>
    //     <div class="item">
    //       <img class="third-slide" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Third slide">
    //       <div class="container">
    //         <div class="carousel-caption">
    //           <h1>One more for good measure.</h1>
    //           <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
    //           <p><a class="btn btn-lg btn-primary" href="#" role="button">Browse gallery</a></p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
    //     <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    //     <span class="sr-only">Previous</span>
    //   </a>
    //   <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
    //     <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    //     <span class="sr-only">Next</span>
    //   </a>
    // </div>
  }
  this.carouselItem =
  function(passThrough, appendTo, itemUniqueClass, itemPrependList, slideImageSrc, slideImageClasList, carouselCaption)
  { O.create
    ( [ itemUniqueClass+itemPrependList+".item",
        [ [ $("<img class='"+slideImageClasList+"' src='"+slideImageSrc+"' />") ],
          [ "container",
            [ [ "carousel-caption", carouselCaption ]
            ],
          ],
        ],
      ],
      passThrough,
      appendTo
    );
    // <div class="item">
    //   <img class="first-slide" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="First slide">
    //   <div class="container">
    //     <div class="carousel-caption">
    //       <h1>Example headline.</h1>
    //       <p>Note: If you're viewing this page via a <code>file://</code> URL, the "next" and "previous" Glyphicon buttons on the left and right might not load/display properly due to web browser security rules.</p>
    //       <p><a class="btn btn-lg btn-primary" href="#" role="button">Sign up today</a></p>
    //     </div>
    //   </div>
    // </div>
  }

  this.dropdownUniqueCounter = 0;
  this.dropdown =
  function(passThrough={}, appendTo, dropdownUniqueSelector, buttonText)
  { var uniqueID_dropdown     = "dropdown_"+this.dropdownUniqueCounter;
    var uniqueID_dropdownMenu = "dropdownMenu_"+this.dropdownUniqueCounter;
    this.dropdownUniqueCounter++;

    O.create
    ( [ dropdownUniqueSelector+".dropdown",
        [ [ $('<button id="'+uniqueID_dropdown+'" class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' ), "@"+buttonText, "span.caret" ],
          [ "#"+uniqueID_dropdownMenu+".dropdown-menu", "ul.menuListItems" ],
        ],
      ],
      passThrough,
      appendTo
    );
    passThrough[uniqueID_dropdownMenu].attr("aria-labelledby", uniqueID_dropdown);
    // <div class="dropdown">
    //   <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
    //     Dropdown
    //     <span class="caret"></span>
    //   </button>
    //   <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
    //     <li><a href="#">Action</a></li>
    //     <li><a href="#">Another action</a></li>
    //     <li><a href="#">Something else here</a></li>
    //     <li role="separator" class="divider"></li>
    //     <li><a href="#">Separated link</a></li>
    //   </ul>
    // </div>
  }

  this.panelCollapsibleUniqueCounter = 0;
  this.panelCollapsible =
  function(passThrough, appendTo, panelCollapsiblePrependList, panelLinkTitle, panelBody, collapsed=true)
  { var uniqueID = "panelCollapsible_"+this.panelCollapsibleUniqueCounter;
    this.panelCollapsibleUniqueCounter ++;
    var toReturn =
    O.create
    ( [ panelCollapsiblePrependList+".panelCollapsible.panel.panel-default",
        [ [ $("<a class='collapseControl collapsed' data-toggle='collapse' data-target='#"+uniqueID+"' href='#"+uniqueID+"' />"),
            [ [ ".panel-heading", ".panel-title", panelLinkTitle ],
              [ $('<i class="material-icons">expand_more</i>') ]
            ],
          ],
          [ "#"+uniqueID+".panel-collapse collapse"+(collapsed?"":" in"), ".panelBody.panel-body", panelBody ],
        ],
      ],
      passThrough,
      appendTo
    );

    // <div class="panel panel-default" id="panel1">
    //     <div class="panel-heading">
    //          <h4 class="panel-title">
    //     <a data-toggle="collapse" data-target="#collapseOne"
    //        href="#collapseOne">
    //       Collapsible Group Item #1
    //     </a>
    //   </h4>

    //     </div>
    //     <div id="collapseOne" class="panel-collapse collapse in">
    //         <div class="panel-body">Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</div>
    //     </div>
    // </div>
    return toReturn;
  }

  this.tooltip =
  function(passThrough, appendTo, tooltipPrependList, tooltipContents, tooltipOptions)
  { var toReturn = 
    O.create
    ( [ tooltipPrependList+"",
        [ [ $("<a href=='#' class='tooltip' data-toggle='tooltip' title='"+tooltipContents+"' />"), 
          ],
        ],
      ],
      passThrough,
      appendTo
    );

    $(toReturn[1][0][0]).tooltip(tooltipOptions);

    return toReturn;
  }

}(jQuery);

window.O = ThisEqualsThat.BootstrapObjects;
