window.thisEqualsThat = {};
thisEqualsThat.graphicLoadVersion = "0.0.9.20160726.1639";


thisEqualsThat.svg          = {};
thisEqualsThat.svgStore     = {};
thisEqualsThat.svgDefsStore = {};
thisEqualsThat.memoise_normalDistribution = {};


traverse = function(object, address, defaultList=[{}])
{ defaultCounter        = 0;
  defaultListTestIndex  = defaultList.length -1;

  var current = object;
  address = address.split(".");
  
  for (var wayPoint of address)
  { if (!current.hasOwnProperty(wayPoint) )
    { current[wayPoint] =  defaultList[defaultCounter]
    }
    current = current[wayPoint];
    
    if (defaultCounter < defaultListTestIndex)
    { defaultCounter ++;
    }
  }

  return current;
}
prettyPrint = function(field, value)
{ var currentValue;
  if (field.data.hasOwnProperty("fieldPrecisionFunction") )
  { currentValue = value;
    eval(field.data.fieldPrecisionFunction);
  }
  else
  { toReturn = thisEqualsThat.standardPrecision(value);
  }

  return unitsAroundOutput(field, toReturn);
}
unitsAroundOutput = function(field, output)
{ return field.data.unitPrefix+" "+output+" "+field.data.unitSuffix;
}

thisEqualsThat.standardPrecision = function(number)
{ return Number(number).toPrecision(5);
}

thisEqualsThat.oop = function()
{ this.init = function()
  { //ThisEqualsThat.componentCookieManager = new ThisEqualsThat.ComponentCookieManager(this);
    // ThisEqualsThat.modelClasses           = new ThisEqualsThat.ModelClasses(this);

    // ThisEqualsThat.display                = $("body");
    // ThisEqualsThat.welcome                = new ThisEqualsThat.Welcome(ThisEqualsThat.display);
    var highlighter = rangy.createHighlighter();
    
    var highlightApplier = rangy.createClassApplier("highlight");
    highlighter.addClassApplier(highlightApplier);

    commentsList = [];
    currentlySelectedCommentSet = null;

    $(".mainContent").on("mouseup", 
      function(event) 
      { var selection = document.getSelection();
        console.log(selection);

        var selection;
        if (selection.anchorOffset == selection.focusOffset)
        { console.log("event", event)
          selection = highlighter.getHighlightForElement(event.target);
        }
        else
        { selection = highlighter.highlightSelection("highlight", {"containerElementId": "mainContent"} )[0];
        }

        console.log("selection", selection);

        if (selection)
        { debugger;
          var selectionID = selection.id
          var currentCommentSet = commentsList[selectionID];

          console.log(currentCommentSet);
          if (! currentCommentSet)
          { if (currentlySelectedCommentSet) commentsList[currentlySelectedCommentSet].hide();
            commentsList[selectionID] = $("<div id='commentContainer_"+selectionID+"' class='commentContainer'> </div>");
            $("body").append(commentsList[selectionID]);
            commentsList[selectionID].comments
            ( { "enableSynthesis": true,
              }
            );
            
          }
          else if(currentlySelectedCommentSet != selectionID)
          { commentsList[currentlySelectedCommentSet].hide();
            commentsList[selectionID].show();
          }

          currentlySelectedCommentSet = selectionID; 
        } 
        
        
      } 
    );

  }

  this.Welcome = function(display)
  { O.create( [ "#welcomeOver.wrapper.fullScreenOverlay.smoothMove", 
                [ [ ".centerBackgroundImage.visualToolsLogo" ],
                ],
              ],
              display,
              display
            );

    setTimeout
    ( function() 
      { display.welcomeOver.toggleClass("opacityZero", true);
 
        setTimeout
        ( function()
          { ThisEqualsThat.displayInterface(display);
          },
          500
        );
      },
      // 2000
      10
    );
  }

  this.displayInterface = function(display)
  { display.navbar = {};

    O.create( [ "#pageWrapper.height100",
                [ [ O.navbarFixedLeft(display.navbar, null, "mainNav", ".navLogo.centerBackgroundImage.visualToolsLogoWords", ".thisEqualsThatScene") ],
                  //[ ".thisEqualsThatScene.panel.panel-default" ],
                  [ $("<div class='copyrightContainer' />").text("© This Equals ltd 2016") ],
                ],
              ],
              display,
              display
            );
    O.create( [ "#doubleBuffer", "#modals" ], display, display );

    this.mainNavigation                   (display.navbar);
    this.constructBlueprint               (display.modals);
    this.constructBlueprint_inDevelopment (display.modals);

    ThisEqualsThat.referenceVisual  = new ThisEqualsThat.ReferenceVisual    ( display.doubleBuffer);
    ThisEqualsThat.scene            = new ThisEqualsThat.ThisEqualsThatScene( display.navbar.thisEqualsThatScene );
  };

  this.mainNavigation = function(navbar)
  { O.create( [ ".bs-component",
                [ 
                  [ O.openModal_aTag
                    ( navbar, null, "profileModal",                
                        ".createConstruct.panel.row", 
                        O.listGroupItem ( navbar,
                                          null, 
                                          "button", ".blueprintItem", [12, 12, 6, 6], $("<img class='blueprintIcon' src='/static/graphics/user/profilePic.jpg' />"), "", "@Profile", ""
                                        )[0]
                    )
                  ],
                  // [ ".square92.marginAuto", ".editProfile.panel.row"       ],
                  [ O.openModal_aTag
                    ( navbar, null, "constructBlueprint",                
                        ".createConstruct.panel.row", 
                        O.listGroupItem ( navbar,
                                          null, 
                                          "button", ".blueprintItem", [12, 12, 6, 6], $("<img class='blueprintIcon' src='/static/graphics/thisEquals/icons/blueprint.svg' />"), "", "@Construct", ""
                                        )[0]
                    )
                  ],
                                        // ".createConstructImage.square92") ],this.
                  //[ ".square92.marginAuto", O.openModal_aTag(navbar, null, "constructBlueprint_inDevelopment",  ".createConstruct.panel.row", ".createConstructImage_inDevelopment") ],
                ],
              ],
              navbar,
              navbar.navbarContent
            );
  };

  this.constructBlueprint               = function(modals)
  { O.modal(  modals,
              modals,
              "constructBlueprint",
              $("<span>Construct Blueprint</span>"),
              ".constructBlueprintContainer.row",
              ""
            );

    O.create( [ "#blueprintTutorialPlayer", "i.fafa-spinner" ], modals, modals["modal-content"] );
    O.create( [ ".playerMenu", 
                [ [ ".closeButton", "i.fa.fa-times" ],
                  [ ".swipeButton", ],
                ]
              ],              
              modals, 
              modals["modal-content"] 
            );

    var modelClassOrder = [ "HowMany", "VolMassDen", "LightBulb", "CO2", "Wood", "Coal", "PeopleRatioPlay", "Earth", "Money", "Air Quality", "Seesaw"];
    var modelClassData  = { "HowMany"     : { "tutorialVideo": "je_M6gB8nZw" } , 
                            "VolMassDen"  : { "tutorialVideo": "z0LKAOowf9c" } ,
                            "LightBulb"   : { "tutorialVideo": "NnUqU9_hrrg" } ,
                          };

    $.each( modelClassOrder,
      function (index, key)
      { var blueprintItem = ThisEqualsThat.modelClasses[key].getBlueprintItem(modals.constructBlueprint, modals.constructBlueprintContainer)[0];
        var modelClass    = blueprintItem.data("thisEquals_blueprint");
        if ( modelClassData.hasOwnProperty(key) )
        { O.create( [ ".videoOverlay.smoothMove" ], {}, blueprintItem );
          modelClass.tutorialVideo = modelClassData[key].tutorialVideo;
        }
        modelClass.tutorialIndex = index;
      }
    );

    modals.constructBlueprint
    .on("click", ".blueprintItem",
        function(event)
        { var modelClass = $(event.currentTarget).data("thisEquals_blueprint");
          modelClass.getModelInstance(ThisEqualsThat.scene.constructContainer);
          ThisEqualsThat.scene.setCurrentModelClass(modelClass);
          $(this).closest(".modal").modal("hide");
        }
      );
    

    var tutorialPlayerStateChange =
      function(event)
      { console.log("tutorial player state change event", event);

        if (event.data == 0) //ended
        { $("body").toggleClass("playingTutorial", false);
        }
      }
    modals.constructBlueprint
    .on("click", ".videoOverlay",
        function(event)
        { var modelClass = $(event.currentTarget).closest(".blueprintItem").data("thisEquals_blueprint");

          if (! modals.constructBlueprint.hasOwnProperty("tutorialPlayer") )
          { modals.constructBlueprint.tutorialPlayer
              = new YT.Player
              ( 'blueprintTutorialPlayer', 
                { height:   modals.blueprintTutorialPlayer.height() - 15,
                  width:    modals.blueprintTutorialPlayer.width()  - 15,
                  videoId:  modelClass.tutorialVideo,
                  events: 
                  { 'onReady': 
                      function()
                      { modals.constructBlueprint.tutorialPlayer
                            .loadPlaylist
                            ( { "playlist": ["je_M6gB8nZw", "z0LKAOowf9c", "NnUqU9_hrrg"],
                                "index":    modelClass.tutoralIndex, 
                              }
                            )
                      },
                    'onStateChange': tutorialPlayerStateChange
                  }
                }
              );
          }
          else
          { modals.constructBlueprint.tutorialPlayer
              .loadPlaylist
              ( { "playlist": "PLvcKSclDckD0GLGEqdladfF0AS6wdysLk",
                  "index":    modelClass.tutoralIndex, 
                }
              )
          }
          $("body").toggleClass("playingTutorial", true);

          modelClass.getModelInstance(ThisEqualsThat.scene.constructContainer);
          ThisEqualsThat.scene.setCurrentModelClass(modelClass);

          event.stopPropagation();
        }
      );
    modals.constructBlueprint
    .on
    ( "hidden.bs.modal", 
      function() 
      {
      } 
    );
    modals.closeButton
    .on
    ( "click",
      function()
      { $("body").toggleClass("playingTutorial", false);
        modals.constructBlueprint.tutorialPlayer.pauseVideo();
        modals.constructBlueprint.toggleClass("force-redraw");
      }
    );
  }
  this.constructBlueprint_inDevelopment = function(modals)
  { O.modal(  modals,
              modals.constructBlueprintContainer_inDevelopment,
              "constructBlueprint_inDevelopment",
              $("<span>In Development</span>"),
              ".constructBlueprintContainer_inDevelopment.row",
              ""
            );
  }

  this.ThisEqualsThatScene = function(displayScene)
  { this.displayScene = displayScene;
    O.create( [ ".thisEqualsScene", ".constructContainer" ],
              this,
              displayScene
            );
  }
  this.ThisEqualsThatScene.prototype.setCurrentModelClass = function(modelClass)
  { if (this.hasOwnProperty("currentModelClass"))
    { this.currentModelClass.modelInstance.hide();
    }
    this.currentModelClass = modelClass;
  }


  this.ModelClasses = function()
  { var This = this;

    var ajaxOptions =
    { url: "getModelClasses",
      dataType: "json",
      success: function(data, status, request)
      { $.each(data.standard, 
            function(index, value)
            { This[value] = new ThisEqualsThat.ModelClass(value);
            }
        );
        $.each
        ( data.iframe, 
            function(key, value)
            { value["jsonKey"] = key;
              This[key] = new ThisEqualsThat.ModelClass_iframe(value);
            }
        );
      },
    };
    $.ajax(ajaxOptions);
  }


  this.ModelClass = function(modelClassName)
  { this.name       = modelClassName;
    this.imageURL   = this.imageBaseURL+modelClassName+".svg";
  }
  this.ModelClass.prototype.imageBaseURL      = "/static/graphics/thisEquals/modelClasses/";
  this.ModelClass.prototype.getBlueprintItem  = 
      function(passThrough, appendTo)
      { if (! this.hasOwnProperty("blueprintItem") )
        { this.blueprintItem = 
              O.listGroupItem
              ( passThrough, 
                appendTo, 
                "button", ".blueprintItem.ripplelink", [4, 6, 6, 12], $("<img class='blueprintIcon smoothMove' src='"+this.imageURL+"' />"), "", "@"+this.name, "@Description Text");
          passThrough.blueprintItem.data("thisEquals_blueprint", this);
          //O.create( [ ".videoOverlay.smoothMove" ], passThrough, passThrough.blueprintItem );
        }
        return this.blueprintItem;
      }
  this.ModelClass.prototype.getModelInstance = function(displayContainer)
  { if (! this.hasOwnProperty("modelInstance"))
    { var This = this;
      var ajaxOptions =
      { url: "getClassInstance",
        data: { modelClassName: this.name},
        success: function(data, status, request)
        { console.log("getInstance:", this.name);
          This.modelInstance = new ThisEqualsThat.ModelInstance(This, data[0]);
          This.modelInstance.modelPosition = "top";
          This.modelInstance.displayIntoTarget(displayContainer);
          This.modelInstance.inputFieldAltered(
              { "outputField": This.modelInstance.lastAlteredOutputField.data.fullAddress
              },
              function(data, status, request)
              { This.modelInstance.setChoosableFields(data);
              }
          );
        }
      }
      $.ajax(ajaxOptions);
    }
    else
    { this.modelInstance.displayIntoTarget(displayContainer);
    }
  }
 

  this.ModelClass_iframe = function(modelClassData)
  { this.name     = modelClassData.name || modelClassData.jsonKey;
    this.imageURL = this.imageBaseURL+modelClassData.icon;
    this.data     = modelClassData;
  }
  this.ModelClass_iframe.prototype.imageBaseURL =  "/static/graphics/thisEquals/icons/";
  this.ModelClass_iframe.prototype.getBlueprintItem = 
      this.ModelClass.prototype.getBlueprintItem;
  this.ModelClass_iframe.prototype.getModelInstance = function(displayContainer)
  { var This = this;

    if (! this.hasOwnProperty("modelInstance" ) )
    { this.modelInstance = this.data;
      this.modelInstance.display = $("<div class='iframeFullScreen'><iframe src='"+this.data.src+"?nocache="+Date.now()+"' /></iframe>");
      
      if (! This.modelInstance.appended )
      { $(".mainContentColumn").append(This.modelInstance.display);
        This.modelInstance.appended = true;
      }

      this.modelInstance.hide = function()
      { This.modelInstance.display.toggleClass("invisible", true);
      }
    } 
    this.modelInstance.display.toggleClass("invisible", false);
  }


  //MODEL INSTANCE
  this.ModelInstance = function(modelClass, modelInstanceData)
  { this.modelClass         = modelClass;
    this.data               = modelInstanceData;
    this.id                 = this.data['id'];

    this.inputFields          = {};
    this.outputFields         = {};
    this.visualisationFields  = {};

    this.svgStore             = {};
    this.svgJSFromFile        = {};
    this.svgAnimations        = {};

    this.bottomModelHistory   = {};

    this.disable_createSaveLink = false;

    this.ifa_queue = [];
    this.ifa_queueState = "ready";

    this.inputFieldHUD  = new ThisEqualsThat.InputFieldHUD(this);
    this.svgHUD         = new ThisEqualsThat.SVGHUD(this);
  }
  this.ModelInstance.prototype.getInputFields = function(appendTo)
  { if (! this.hasOwnProperty("inputFieldData"))
    { var This = this;
      this.inputFieldData = {};
      this.inputFieldsSliders = $("<div />");
      $.each(
        this.data.fields,
        function(fieldNameString, value)
        { value['fullAddress'] = fieldNameString
          if (value['inputField'] == true)
          { console.log("modelInstance: inputField: ", This, value);
            value['currentValue'] = This.data.fieldValues[fieldNameString]
            var inputField = new ThisEqualsThat.ModelFieldInput(This, value);
            This.inputFieldData[fieldNameString] = inputField;
            This.inputFieldsSliders.append(inputField.getTag());
          }
        }
      );
    }
    return this;
  }

  this.ModelInstance.prototype.getOutputFields = function(appendTo)
  { if (! this.hasOwnProperty("outputFieldData"))
    { var This = this;
      this.outputFieldData = {};
      this.outputFieldSelect = {};
      
      O.panelCollapsible( this.outputFieldSelect, appendTo, 
        ".outputFieldSelectPanel.width100",
        [ [ ".displayFlex.spaceBetween",
            [ [ ".chooseOutputField.selectedField", "@Output: "], 
              [ ".modelOutputValue" ],
            ]
          ],
        ],
        ".menuListItems"
      );
      this.display.modelOutputDisplayName = this.outputFieldSelect.chooseOutputField;
      this.display.modelOutputValue = this.outputFieldSelect.modelOutputValue;

      // O.dropdown( this.outputFieldSelect, appendTo, "dropdown", "What to Calculate?" );

      this.outputFieldSelect.menuListItems.on
      ( "click",
        "button",
        function(event)
        { var selectedField = $(event.currentTarget).data("thisEquals.modelFieldOutput");
          This.lastAlteredOutputField = selectedField;
          
          This.outputFieldSelect.menuListItems.find(".dropdownItem").toggleClass("selected", false);
          selectedField.display.dropdownItem.toggleClass("selected", true);

          This.inputFieldAltered
          ( { outputField: selectedField.fullAddress
            },
            function(data, status, request)
            { This.setChoosableFields(data);
            }
          );
        }
      );

      $.each(
        this.data.fields,
        function(index, value)
        { if (value["outputField"] == true)
          { console.log("modelInstance: outputField: ", This, value);
            var outputField = new ThisEqualsThat.ModelFieldOutput(This, value);
            This.outputFieldData[value.toString()] = outputField;
            outputField.getDropDownItem(This.outputFieldSelect.menuListItems);
          }
        }
      );
    }
    return this;
  }

  this.ModelInstance.prototype.getVisualisationFields = function(appendTo)
  { if (! this.hasOwnProperty("visualisationFieldData"))
    { var This = this;
      this.visualisationFieldData = {};
      this.visualisationFieldSelect = {};
      
      O.panelCollapsible( this.visualisationFieldSelect, appendTo, 
        ".visualisationFieldSelectPanel.width100",
        [ [ ".displayFlex.spaceBetween",
            [ [ ".chooseVisualisationField.selectedField", "@Visualise: "], 
              [ ".modelVisualisationValue" ],
            ]
          ],
        ],
        ".menuListItems"
      );
      this.display.modelVisualisationDisplayName  = this.visualisationFieldSelect.chooseVisualisationField;
      this.display.modelVisualisationValue        = this.visualisationFieldSelect.modelVisualisationValue;

      // O.dropdown( this.visualisationFieldSelect, appendTo, "dropdown", "What to Calculate?" );

      this.visualisationFieldSelect.menuListItems.on
      ( "click",
        "button",
        function(event)
        { var selectedField = $(event.currentTarget).data("thisEquals.ModelFieldVisualisation");
          This.lastAlteredVisualisationField = selectedField;
          
          This.visualisationFieldSelect.menuListItems.find(".dropdownItem").toggleClass("selected", false);
          selectedField.display.dropdownItem.toggleClass("selected", true);

          This.inputFieldAltered
          ( { visualisationField: selectedField.fullAddress
            },
            function(data, status, request)
            { //This.setChoosableFields(data);
            }
          );
        }
      );

      $.each(
        this.data.fields,
        function(index, value)
        { if (value["visualisationField"] == true)
          { console.log("modelInstance: visualisationField: ", This, value);
            var visualisationField = new ThisEqualsThat.ModelFieldVisualisation(This, value);
            This.visualisationFieldData[value.toString()] = visualisationField;
            visualisationField.getDropDownItem(This.visualisationFieldSelect.menuListItems);
          }
        }
      );
    }
    return this;

    // if (! this.hasOwnProperty("visualisationFieldData"))
    // { var This = this;
    //   this.visualisationFieldData = {};
    //   this.visualisationFieldsSelect =
    //       $("<select />"
    //       ).on(
    //         "change",
    //         function(event)
    //         { console.log("visualisationFieldSelect ChangeEvent: ", event);
    //           selectedField = $(event.currentTarget.selectedOptions[0]).data("thisEqualsVisualisationField");
    //           This.lastAlteredVisualisationField = selectedField;
    //           This.inputFieldAltered(
    //             { visualisationField: selectedField.fullAddress
    //             },
    //             function(data, status, request)
    //             { //process SVG Datastuff;
    //             }
    //           );

    //         }
    //       );
    //   this.visualisationFieldsSelect.append($("<option value=''>Select Visualisation</option>"));
    //   $.each(
    //     this.data.fields,
    //     function(index, value)
    //     { if (value["visualisationField"] === true)
    //       { console.log("modelInstance: visualisationField: ", This, value);
    //         var visualisationField = new ThisEqualsThat.ModelFieldVisualisation(This, value);
    //         This.visualisationFieldData[value.toString()] =
    //             visualisationField;
    //         This.visualisationFieldsSelect.append(visualisationField.getDropDownItem());
    //       }
    //     }
    //   );
    // }
    // //for Chaining of ModelInstance
    // return this;
  }

  this.ModelInstance.prototype.inputFieldAltered = function(fieldChangeData, successFunction, doNotUpdateUI)
  { console.log("inputFieldAltered", arguments, this.ifa_queue);
    if (arguments == this.ifa_currentlyProcessing)
      return;
    if (this.ifa_queueState == "ready")
    { this.ifa_currentlyProcessing = arguments;
      this.ifa_queueState = "Sending Request";
      this.display.topModelDiv.find(".inputFieldAlteredSpinner").toggleClass("spinner", true);
      this.display.topModelDiv.find(".calculationSpinner").toggleClass("spinner", true);

      var This = this;
      fieldChangeData	= $.extend({modelInstanceID: this.id}, fieldChangeData);
      var ajaxOptions =
        { "url": "inputFieldAltered",
          "dataType": "json",
          "data": fieldChangeData,
          "success": function (data, status, request)
          { console.log(data);
            This.svg3dDisplayJSON   = data.svg3dDisplayJSON;

            // This.lastAlteredOutputField.data.currentValue = data.newValue;
            // This.lastAlteredVisualisationField.data.currentValue = data.svg3dDisplayJSON.svgFieldValue;

            // changed data. Now it has all the values of all the fields in it. Going to try to update the UI accordingly
            for (var fieldName in data.fieldValues)
            { if (This.inputFields.hasOwnProperty(fieldName) )
              { var inputField  = This.inputFields[fieldName];
                var newValue    = data.fieldValues[fieldName];item.replace(/\./g, " ")

                if (newValue != inputField.data.currentValue)
                { inputField.setValue(newValue);
                }
              }
              //catch (e)
              //{}
            }


            if (! This.doNotUpdateUI) This.displayCurrentOutput()
            if (    This.bottomModelInstance && data.bottomModelData
                &&  This.bottomModelInstance.lastAlteredOutputField && This.bottomModelInstance.lastAlteredOutputField.data)
            { This.bottomModelInstance.lastAlteredOutputField.data.currentValue = data.bottomModelData.newValue
              This.bottomModelInstance.lastAlteredVisualisationField.data.currentValue = data.bottomModelData.svg3dDisplayJSON.svgFieldValue;
              This.bottomModelInstance.svg3dDisplayJSON = data.bottomModelData.svg3dDisplayJSON
              if (! This.doNotUpdateUI) This.bottomModelInstance.displayCurrentOutput()
            }

            if (successFunction)
              successFunction(data, status, request);

          },
          "complete": function()
          { console.log("ajax complete", This.ifa_queue[0]);

            This.ifa_queueState = "receivedResponse";

            if (This.doNotUpdateUI)
            { This.doNotUpdateUI = false;
              This.ifa_queueState = "ready";

              if (This.ifa_queue.length > 0)
              { var ifa_item = This.ifa_queue.shift()
                setImmediate
                ( function() { This.inputFieldAltered(ifa_item[0], ifa_item[1], ifa_item[2]) }
                );
              }
              else
              { This.display.topModelDiv.find(".inputFieldAlteredSpinner").toggleClass("spinner", false);
                This.display.topModelDiv.find(".calculationSpinner").toggleClass("spinner", false);
                This.svg_createSaveLink(This)
              }
            }
            else
            { This.display.topModelDiv.find(".calculationSpinner").toggleClass("spinner", false);
              This.display.topModelDiv.find(".visualisationSpinner").toggleClass("spinner", true);
            }
          },
        };
      console.log(ajaxOptions);
      $.ajax(ajaxOptions);
    }
    else
    { console.log("pushing to queue", this.ifa_queue[0], arguments);
      this.ifa_queue.push(arguments);
    }
  }
  this.ModelInstance.prototype.setChoosableFields = function(data, status, response)
  { 

    if (! this.hasOwnProperty("choosableFields"))
      this.choosableFields = {};
    var choosableFields = this.choosableFields;
    var currentOutputFieldName = data.lastAlteredOutput.toString();
    if (! choosableFields.hasOwnProperty(currentOutputFieldName))
    { choosableFields[currentOutputFieldName] = data.choosableFields;
    }
    var bottomModelLinkFieldList = choosableFields[currentOutputFieldName];
    if (! bottomModelLinkFieldList.hasOwnProperty("select"))
    { bottomModelLinkFieldList.select = $("<select class='fullWidthPlusMargins' />" );
      var placeHolder = $("<option />",
                          {"value": "0",
                           "text" : "That Model"
                          }
                        );
      placeHolder.appendTo(bottomModelLinkFieldList.select);
      for (var i = 0; i < bottomModelLinkFieldList.length; i++)
      { var bottomModelLinkField = bottomModelLinkFieldList[i];
        bottomModelLinkField.modelInstance = this;
        var optionString = bottomModelLinkField.bottomModelClass+": "+bottomModelLinkField.boundInputField.toString()
        var option = $("<option />",
          { value: optionString,
            text: optionString
          }
        ).data("bottomModelLinkField", bottomModelLinkField)
        .appendTo(bottomModelLinkFieldList.select);
        if (bottomModelLinkField.selected == "selected")
          option.attr("selected", "selected")
      }
      bottomModelLinkFieldList.select.on("change", this.bottomModelLinkSelectChangeFunction);
    }
    this.display.bottomModelSelectDiv.html(bottomModelLinkFieldList.select);
    console.log(choosableFields);
  }
  this.ModelInstance.prototype.bottomModelLinkSelectChangeFunction = function(event)
  { var bottomModelLinkField = $(event.currentTarget.selectedOptions[0]).data("bottomModelLinkField");
    console.log(event, bottomModelLinkField);
    if (! bottomModelLinkField.hasOwnProperty("setBottomModelAjaxOptions"))
    { bottomModelLinkField.setBottomModelAjaxOptions =
      { url: "setBottomModel",
        dataType: "json",
        data:
          { topModelID: bottomModelLinkField.modelInstance.id,
            bottomModelClass: bottomModelLinkField.bottomModelClass,
            boundOutputField: JSON.stringify(bottomModelLinkField.boundOutputField),
            boundInputField: JSON.stringify(bottomModelLinkField.boundInputField)
          },
        modelInstance: bottomModelLinkField.modelInstance,
        success: bottomModelLinkField.modelInstance.setBottomModelSuccessFunction
      }
    }
    $.ajax(bottomModelLinkField.setBottomModelAjaxOptions);
  }
  this.ModelInstance.prototype.setBottomModelSuccessFunction = function(data, status, request)
  { console.log(data, this);
    topModelInstance = this.modelInstance;
    if (! topModelInstance.bottomModelHistory.hasOwnProperty(data.id))
    { var bottomModelInstance =
          new ThisEqualsThat.ModelInstance(data.__modelClass, data);
      topModelInstance.bottomModelHistory[bottomModelInstance.id] = bottomModelInstance;
      bottomModelInstance.modelPosition = "bottom";
    }
    if (topModelInstance.hasOwnProperty("bottomModelInstance"))
    { topModelInstance.bottomModelInstance.hide();
    }
    topModelInstance.bottomModelInstance = topModelInstance.bottomModelHistory[data.id];
    topModelInstance.bottomModelInstance.displayIntoTarget(topModelInstance.display.bottomModelDiv);
    topModelInstance.bottomModelInstance.inputFieldAltered(
              { "outputField": topModelInstance.bottomModelInstance.lastAlteredOutputField.data.fullAddress
              },
              function(data, status, request)
              { topModelInstance.bottomModelInstance.setChoosableFields(data);
              }
          );

    topModelInstance.display.topModelDiv.toggleClass("bottomModelReshuffle", true);

    console.log(topModelInstance.bottomModelInstance);
  }
  this.ModelInstance.prototype.displayIntoTarget = function(targetContainer)
  { if (! this.hasOwnProperty("display"))
    { This = this;
      this.display = {};
      var display = this.display;

      var toCreate = 
        O.create
        ( [ ".modelInstanceDiv."+this.modelClass.name+"."+this.id,
            ".topModelDiv",
            [ //[ ".row", ".col-lg-12", ".panel.panel-default", ".visualisationOutputContainer.panel-body" ],
              // [ ".row", ".col-lg-4", ".panel.panel-default", 
              //   [ [ ".modelOutputValue.panel-body" ],
              //     [ ".outputFieldSelect", this.getOutputFields().outputFieldSelect, ],
              //   ],
              // ],
              [ ".row", 
                [ [".calculationColumn.col-lg-4.col-xs-12", ".calculationPanel.panel.panel-default", 
                    [ [ ".panel-heading", ".panel-title.displayFlex.spaceBetween", 
                        [ [ "div.calculationSpinner", 
                            [ [ $("<i class='fa fa-calculator' aria-hidden='true'></i>") ],
                              [ ".chooseOutputField.smallCaps.color_visualTools" ],
                            ],
                          ],
                          [ ".modelOutputValue.color_visualTools" ],
                        ],
                      ],
                      [ ".panel-body.paddingZero_v",
                        [ [ ".row",
                            [ [ ".modelSliders.row.width100.displayBlock", this.getInputFields().inputFieldsSliders ],
                              [ ".row.width100", this.getOutputFields().outputFieldSelect.outputFieldSelectPanel ],
                            ],
                          ],
                        ],
                      ],
                      [ ".row.col-xs-12",
                        [ [ ".bottomModelSelectDiv.col-lg-12", ".bottomModelSelectLable" ],
                        ],
                      ],
                    ],
                  ],
                  [".visualisationColumn.col-lg-8.col-xs-12", ".visualisationPanel.panel.panel-default", 
                    [ [ ".panel-heading", ".panel-title.displayFlex.spaceBetween", 
                        [ [ "div.visualisationSpinner", 
                            [ [ $("<img class='' src='/static/graphics/visualTools/visualise.height_18px.png'>") ],
                              [ ".chooseVisualisationField.smallCaps.color_visualTools" ],
                            ],
                          ],
                          [ ".modelVisualisationValue.color_visualTools" ],
                        ],
                      ],
                      [ ".row",
                        [ [ ".svgDiv.panel.panel-default.col-lg-12", 
                            [ [ $(document.createElementNS(d3.ns.prefix.svg, "svg"))
                                .attr("xmlns",        "http://www.w3.org/2000/svg")
                                .attr("xmlns:xlink",  "http://www.w3.org/1999/xlink")
                                .attr("xmlns:z",      "http://debeissat.nicolas.free.fr/svg3d/svg3d.rng")
                                .attr("width",        "100%")
                                .attr("height",       "100%")
                                .attr("z:xInfinite",  "50")
                                .attr("z:yInfinite",  "100")
                                .attr("z:zRatio",     "5")

                                .attr("class", "rootSVG id_"+this.id),
                                [ [ "svg:defs.svgDefs" ],
                                  [ "svg:text.svgTextDescription", "@Click to Enter Text" ],
                                  [ "svg:g.svgTranslatableG" ,
                                    [ [ "svg:g.svgHeightAxis"         ],
                                      [ "svg:g.svgVisualisationG"     ],
                                      [ "svg:g.svgReferenceGContainer", "svg:g.svgReferenceG" ],
                                    ],
                                  ],
                                ],
                              ],
                              [ ".toggleFeatures" ,
                              ],
                              [ ".svgSaveLink.bg_visualTools" ,
                              ],
                              [ "a.editableTextPlaceholder", "@Click to Enter Text",
                              ],
                            ],
                          ],
                        ],
                      ],
                      [ ".visualisationOutputPanel.panel-body",
                        [ [ ".row",
                            [ [ ".row.width100", this.getVisualisationFields().visualisationFieldSelect.visualisationFieldSelectPanel ],
                            ],
                          ],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
              [ ".row.col-xs-12",
                ".bottomModelDiv.col-lg-12"
              ],
            ],
          ],
          display,
          targetContainer
        );

      display.calculationPanel.on
      ( "click", 
        ".panel-title",
        function()
        { display.outputFieldSelectPanel.find("a").first().click();
        }
      );

      display.modelSliders.on
      (   "focusin", "input.inputFieldText",
          function()
          { var $this = $(this);
            $this.val( $this.closest(".inputFieldElement").data("thisEquals.modelFieldInput").data.currentValue );
            $this.select();
          }
      );
      display.modelSliders.on
      (   "focusout", "input.inputFieldText",
          function()
          { var $this = $(this);
            var modelFieldInput = $this.closest(".inputFieldElement").data("thisEquals.modelFieldInput");
            $this.val( prettyPrint( modelFieldInput, $this.val() ) );
          }
      );


      display.modelSliders
        .on
        ( "change", ".uiValue_slider",
          function()
          { var $this = $(this);
            var modelField = $this.data("thisEquals.modelField");
            modelField.data.currentValue = $this.val();
            modelField.slider_userUpdatesText()

            setImmediate
            ( function()
              { modelField.inputFieldAltered();
              }
            );
          }
        );

      display.visualisationPanel.on
      ( "click",
        ".panel-title",
        function()
        { display.visualisationFieldSelectPanel.find("a").first().click();
        }
      );

      display.svgTranslatableG.data("thisEqualsThat", {"modelInstance": this});
      display.rootSVG.on
      ( "blur focus focusin focusout load resize scroll unload click "        +
        "dblclick mousedown mouseup mousemove mouseover mouseout mouseenter " + 
        "mouseleave change select submit keydown keypress keyup error",
        function(e)
        { e.stopPropagation();
        }
      );
      // display.svgTextDescription.text("Hello World");
      // display.svgTextInput.on("change", function() { display.svgTextDescription.text($(this).val()); This.svg_createSaveLink(This);});

      display.toggle =
        { "axes":                 $("<input class='checkbox' id = 'toggle_axes_" + This.id + "' type='checkbox'  checked='checked'title='Show / Hide Axes' /></span>"),
          "axes.label":           $("<label/>").append('<div id="axis"></div>'),
          "axes.changeEvent"  :
              function(changeEvent)
              { display.svgHeightAxis.toggle();
                This.svg_createSaveLink(This);
              },
          "svgReferenceG":        $("<input class='checkbox' id  = 'toggle_svgReferenceG_"   + This.id + "' type='checkbox'   checked='checked'   title='Show / Hide Frame of Reference'/></span>"),
          "svgReferenceG.label":  $("<label/>").append('<div id="reference"></div>'),
          "svgReferenceG.changeEvent":
              function(changeEvent)
              { display.svgReferenceG.toggle();
                This.svg_createSaveLink(This);
              },
          "svgTextDescription":        $("<input class='checkbox' id  = 'toggle_svgTextDescription_"   + This.id + "' type='checkbox'   checked='checked'   title='Show / Hide Text Description'/></span>"),
          "svgTextDescription.label":  $("<label/>").append('<div id="text_description"></div>'),
          "svgTextDescription.changeEvent":
              function(changeEvent)
              { display.svgTextDescription.toggle();
                This.svg_createSaveLink(This);
              },
        };
      var controlList = ["axes", "svgReferenceG", "svgTextDescription"];
      for (var name of controlList)
      { display.toggle[name].on("change", display.toggle[name+".changeEvent"]);
        display.toggle[name].appendTo(display.toggle[name+".label"]);
        display.toggleFeatures.append(display.toggle[name+".label"]);
      }
    }

    this.display.editableTextPlaceholder
        .editable
        ( { type: 'text',
            title: 'Enter Text',
            "placement": "top",
            "mode": "inline",
            "toggle": "manual",
            success: function(response, newValue) 
            { if (newValue == "")
              { setImmediate
                ( function()
                  { display.toggle.svgTextDescription[0].click();
                    This.svg_createSaveLink(This);
                  }
                );
                This.display.editableTextPlaceholder.editable("toggle");

              }
              else
              { setImmediate
                ( function()
                  { This.display.svgTextDescription.text(newValue);
                    This.svg_createSaveLink(This);
                  }
                );
              }
              
            }
        });
    this.display.svgTextDescription.on
    ( "click",
      function(event)
      { event.stopPropagation();
        
        This.display.editableTextPlaceholder.editable("toggle");
      }
    )

    this.display.modelInstanceDiv.show();

    return this;
  }
  this.ModelInstance.prototype.hide = function()
  { this.display.modelInstanceDiv.hide();
  }
  this.ModelInstance.prototype.progress_translate3d = function(animation, progress, remainingMs, modelInstance)
  { //console.log(this, This);
    //Place the bottom of the scale axis at the bottom of svgVisualisationG, 10 px to the right
    var internalSize    = modelInstance.display.svgTranslatableG.getBBox();

    var aspectScaleRatio = Math.max(internalSize.width, internalSize.height);
    var px20Height   = (aspectScaleRatio / 400.0) * 20;

    var svgVisualisationGBBox = modelInstance.display.svgVisualisationG.getBBox();

    var svgHeightAxisBBox     = modelInstance.display.svgMeasureY.getBBox();
    var svgHeightAxisX        = svgVisualisationGBBox.x + svgVisualisationGBBox.width + (px20Height/2);
    var svgHeightAxisY        = svgVisualisationGBBox.y + svgVisualisationGBBox.height - svgHeightAxisBBox.height;

    var svgWidthAxisBBox      = modelInstance.display.svgMeasureX.getBBox();
    var svgWidthAxisX         = svgVisualisationGBBox.x + svgVisualisationGBBox.width  - svgWidthAxisBBox.width;
    var svgWidthAxisY         = svgVisualisationGBBox.y + svgVisualisationGBBox.height + (px20Height/2);

    modelInstance.display.svgMeasureAxisY.attr("transform", "translate("+svgHeightAxisX+" "+svgHeightAxisY+")");
    modelInstance.display.svgMeasureAxisX.attr("transform", "translate("+svgWidthAxisX +" "+svgWidthAxisY+")");


    var svgElement      = modelInstance.display.rootSVG;
    var externalWidth   = svgElement.css("width");
    var externalHeight  = svgElement.css("height");


    modelInstance.display.svgMeasureY_text.setAttribute("font-size", (px20Height * .75) + "px");
    modelInstance.display.svgMeasureY_text.setAttribute("x", (px20Height / 5) + "px");
    modelInstance.display.svgMeasureY.attr("stroke-width", (px20Height) / 10);

    modelInstance.display.svgMeasureX_text.setAttribute("font-size", (px20Height * .75) + "px");
    modelInstance.display.svgMeasureX_text.setAttribute("y", (px20Height *.75) + "px");
    modelInstance.display.svgMeasureX.attr("stroke-width", (px20Height) / 10);

    var internalSize    = modelInstance.display.svgTranslatableG.getBBox();

    var aspectScaleRatio = Math.max(internalSize.width, internalSize.height);
    var px20Height   = (aspectScaleRatio / 400.0) * 20;

    var viewBoxString   = internalSize.x        + " " +
                          internalSize.y        + " " +
                          internalSize.width    + " " +
                          (internalSize.height  + px20Height + (px20Height * 0.2));

    //debugLevel1//console.log(viewBoxString);
    svgElement.get(0).setAttribute("viewBox", viewBoxString);

    d3.select(modelInstance.display.svgTextDescription.get(0))
        .attr("x", internalSize.x)
        .attr("y", internalSize.y + internalSize.height + px20Height)
        .attr("font-size", (px20Height)+"px");
  }

  this.ModelInstance.prototype.animateSVG = function()
  { var svg3dConfiguration = this.svg3dDisplayJSON.svg3dConfiguration;
    var This = this;

    var svgClonableG = this.display.svgClonableG;
    svg3d.sortAlgo = svg3d.ONE_TO_ALL;

    This.inputFieldHUD.renderHUD("preClone");
    This.svgHUD       .renderHUD("preClone");

    svgClonableG.animate(
        { "svg3d":
             {"clone3d": this.svg3dDisplayJSON.svg3dConfiguration.clone3d}
        },
        { "queue"     : this.id,
          "duration"  : 0,
          "easing"    : "easeInCubic",
          //"progress"  : This.progressCounter,
          "complete"  : function()
              { This.inputFieldHUD.renderHUD("postClone");
                This.svgHUD       .renderHUD("postClone");

                //Add the Scale Axis to the right hand side of the clone group
                //  hopefully this should deal with position and that by itself
                This.display.svgHeightAxis.empty();
                O.create( ["svg:g",
                            [ [ "svg:g.svgMeasureAxisY", "svg:path.svgMeasureY"],
                            ],
                            [ [ "svg:g.svgMeasureAxisX", "svg:path.svgMeasureX"],
                            ],
                          ],
                          This.display,
                          This.display.svgHeightAxis
                        );

                var axisBBox = This.display.svgVisualisationG  .getBBox();

                var yAxisD = "m0,0 "+ "l  0,"           +axisBBox.height+"";
                var xAxisD = "m0,0 "+ "l" +axisBBox.width+",0";

                This.display.svgMeasureY
                    .attr("d", yAxisD)
                    .attr("stroke", "darkgrey")
                This.display.svgMeasureY.get(0).setAttribute("z:threeD", "true");
                
                This.display.svgMeasureX 
                      .attr("d", xAxisD)
                      .attr("stroke", "darkgrey")
                This.display.svgMeasureX.get(0).setAttribute("z:threeD", "true");

                var unitNormalisedHeight = This.svg3dDisplayJSON.svgRelativeHighness;
                var unitNormalisedWidth  = (unitNormalisedHeight / axisBBox.height) * axisBBox.width
                var heightUnit = "m";
                var widthUnit  = "m";

                if (unitNormalisedHeight > 1000)
                { unitNormalisedHeight = unitNormalisedHeight / 1000;
                  heightUnit = "km";
                }
                else if (unitNormalisedHeight < 0.01)
                { unitNormalisedHeight = unitNormalisedHeight * 1000;
                  heightUnit = "mm";
                }
                else if (unitNormalisedHeight < 1)
                { unitNormalisedHeight = unitNormalisedHeight * 100.0;
                  heightUnit = "cm"
                }

                if (unitNormalisedWidth > 1000)
                { unitNormalisedWidth = unitNormalisedWidth / 1000;
                  widthUnit = "km";
                }
                else if (unitNormalisedWidth < 0.01)
                { unitNormalisedWidth = unitNormalisedWidth * 1000;
                  widthUnit = "mm";
                }
                else if (unitNormalisedWidth < 1)
                { unitNormalisedWidth = unitNormalisedWidth * 100.0;
                  widthUnit = "cm"
                }

                This.display.svgMeasureY_text = d3.select(This.display.svgMeasureAxisY.get(0))
                    .append("text")
                    .attr("id", "svgYAxis_"+this.id)
                    .text(unitNormalisedHeight.toPrecision(3)+heightUnit)
                    .attr("fill", "darkgrey")
                    .attr("font-weight", "bold")
                    .attr("x", 5)
                    .attr("y", (axisBBox.height / 2))
                    .node();

                 This.display.svgMeasureX_text = d3.select(This.display.svgMeasureAxisX.get(0))
                    .append("text")
                    .attr("id", "svgXAxis_"+this.id)
                    .text(unitNormalisedWidth.toPrecision(3)+widthUnit)
                    .attr("fill", "darkgrey")
                    .attr("font-weight", "bold")
                    .attr("x", (axisBBox.width / 2))
                    .attr("y", 5)
                    .node();
                This.display.svgMeasureX_text.setAttribute("x", ((axisBBox.width)/2 - (This.display.svgMeasureX_text.getBBox().width / 2)));

                //Animate Clones/Main SVG
                This.display.svgClonableG.animate(
                { "svg3d":{"translate3d": This.svg3dDisplayJSON.svg3dConfiguration.translate3d}
                },
                { "queue"   : This.id,
                  "duration": 1000,
                  "easing"  : "easeInCubic",
                  "complete": function()
                      {
                      }
                });

                //Animate Reference SVG
                var svgVisualisationGBBox    = This.display.svgVisualisationG  .getBBox();
                var svgReferenceGBBox        = This.display.svgReferenceG      .getBBox();


                var multiplier          = svgReferenceGBBox.height / ((ThisEqualsThat.referenceVisual.currentReferenceSVG.height / This.svg3dDisplayJSON.svgRelativeHighness) * (svgVisualisationGBBox["height"]));
                var svgGroundDifference = svgVisualisationGBBox.y + svgVisualisationGBBox.height - ((svgReferenceGBBox.y+svgReferenceGBBox.height) / multiplier);
                var svgHorizDifference  = svgVisualisationGBBox.x - ((svgReferenceGBBox.x+svgReferenceGBBox.width) / multiplier);

                This.display.svgReferenceG.attr("transform", "translate("+svgHorizDifference+" "+svgGroundDifference+") scale("+(1.0/multiplier)+")");

                var referenceSVG3dConfiguration = $.extend(true, {}, This.svg3dDisplayJSON.svg3dConfiguration.translate3d);
                $.extend(referenceSVG3dConfiguration, {"x":referenceSVG3dConfiguration.x * multiplier, "y": referenceSVG3dConfiguration.y * multiplier});



                if ("recolorClones" in This.svg3dDisplayJSON.svg3dConfiguration)
                { //var clones                  = $(This.display.svgVisualisationG).find("> g:nth-child(n + 2)");
                  //if (!This.hasOwnProperty("recolorClones") )
                  { This.recolorClones =
                        { "messages": [],

                          "changeTinyColors": [],
                          "mixAmount": [],

                          "clones": [],
                          "paths": [],
                        };
                  }

                  var clones                  = $(This.display.svgVisualisationG).data("svg3dclones");
                  var cloneCount              = clones.length;
                  var clonesNotChosenCount    = cloneCount;
                  var clonesNotChosenMemoise  = Array.apply(null, Array(cloneCount)).map(function (_, i) {return i;});


                  var recolorClones = This.svg3dDisplayJSON.svg3dConfiguration.recolorClones;

                  var randomLayout   = recolorClones[0].randomLayout == "Yes";
                  var ratios         = recolorClones[0].ratios;
                  var colors        = recolorClones[0].colors;

                  This.recolorClones.ratios = ratios;
                  This.recolorClones.colors = colors;

                  if (ratios.length != colors.length)
                  { debugger;
                    This.recolorClones.messages.push({"warning": `ratios length: ${ratios.length}, colors length: ${colors.length}`});
                  }
                  ratioCount         = ratios.length;



                  for (var ratioCounter = 0; ratioCounter < ratioCount; ratioCounter ++)
                  { var clonesToChange  = [];

                    var ratio           = ratios [ratioCounter];
                    var changeColor    = colors[ratioCounter];

                    var cloneToChangeCount = Math.round(ratio * cloneCount);

                    while(cloneToChangeCount > 0 && clonesNotChosenCount > 0)
                    { var changeThisClone;

                      var indexOfChosenClone = 0;
                      if (randomLayout)
                      { indexOfChosenClone = Math.floor(Math.random() * clonesNotChosenCount);
                      }

                      changeThisClone = clonesNotChosenMemoise[indexOfChosenClone];
                      clonesNotChosenMemoise.splice(indexOfChosenClone,1);
                      clonesNotChosenCount--;
                      cloneToChangeCount  --;
                      clonesToChange.push(clones[changeThisClone]);
                    }


                    var changeTinyColor =  tinycolor(changeColor);
                    var mixAmount       =  changeTinyColor.getAlpha() * 100;
                    changeTinyColor.setAlpha(1.0);

                    This.recolorClones.changeTinyColors.push(changeTinyColor);
                    This.recolorClones.mixAmount       .push(mixAmount);

                    // var changeRGB = changeColor.match(/^rgb[a]?\(([-]?\d+),\s*([-]?\d+),\s*([-]?\d+)[,]?\s*(\d*[.]?\d*)\)$/);
                    // var changeR   = Number(changeRGB[1]);
                    // var changeG   = Number(changeRGB[2]);
                    // var changeB   = Number(changeRGB[3]);

                    paths = $(clonesToChange).find("path");
                    recolorPaths(paths, changeTinyColor, mixAmount, "recolorClones");

                    This.recolorClones.clones.push(clonesToChange);
                    This.recolorClones.paths .push(paths);

                  }



                }

                This.display.svgReferenceG.animate(
                { "svg3d":{"translate3d": referenceSVG3dConfiguration}
                },
                { queue: This.id,
                  duration: 1000,
                  easing: "easeInCubic",
                  progress: function(animation, progress, remainingMs) { //Animate Reference SVG
                    This.progress_translate3d(animation, progress, remainingMs, This);
                  },
                  complete: function()
                  {  This.svgHUD.renderHUD("preColor");

                    This.inputFieldHUD.renderHUD("postColor");
                    This.svgHUD.renderHUD("postColor");


                    console.log("animationQueue complete", This.ifa_queue[0]);
                    if (This.ifa_queue.length > 0)
                    { var ifa_item = This.ifa_queue.shift()
                      This.ifa_queueState = "ready";
                      setImmediate
                      ( function()
                        { This.inputFieldAltered(ifa_item[0], ifa_item[1], ifa_item[2])
                        }
                      );
                    }
                    else
                    { This.ifa_queueState = "ready";
                      This.display.topModelDiv.find(".inputFieldAlteredSpinner").toggleClass("spinner", false);
                    }
                    This.display.topModelDiv.find(".visualisationSpinner").toggleClass("spinner", false);

                    This.svg_createSaveLink(This);
                  },
                }
                );


                // This.display.svgClonableG .finish (This.id);
                // This.display.svgReferenceG.finish (This.id);

                This.display.svgClonableG .dequeue(This.id);
                This.display.svgReferenceG.dequeue(This.id);

                var svgVisualisationGBBox   = This.display.svgVisualisationG  .getBBox();
                var svgReferenceGBBox       = This.display.svgReferenceG[0]   .getBBox();


                var multiplier              = svgReferenceGBBox.height / ((ThisEqualsThat.referenceVisual.currentReferenceSVG.height / This.svg3dDisplayJSON.svgRelativeHighness) * (svgVisualisationGBBox["height"]));
                var svgGroundDifference     = svgVisualisationGBBox.y + svgVisualisationGBBox.height - ((svgReferenceGBBox.y+svgReferenceGBBox.height) / multiplier);
                var svgHorizDifference      = svgVisualisationGBBox.x - ((svgReferenceGBBox.x+svgReferenceGBBox.width) / multiplier);

                This.display.svgReferenceG.attr("transform", "translate("+svgHorizDifference+" "+svgGroundDifference+") scale("+(1.0/multiplier)+")");


              }
       	}
    );

    // This.display.svgClonableG .finish (This.id);
    svgClonableG.dequeue(this.id);
    svgClonableG.hide();
  }
  this.ModelInstance.prototype.svg_createSaveLink = function(This)
  { if (This.disable_createSaveLink == true)
      console.log("svg_createSaveLink disabled");
    else
    { console.log("svg_createSaveLink", This);

      var savableContainerSVG = $(This.display.rootSVG).clone();
      savableContainerSVG
          .attr("width",          This.display.rootSVG.css("width"))
          .attr("height",         This.display.rootSVG.css("height"))
      ;
      var removeTheseAttributes = ["xmlns:xlink", "xmlns:z", "z:xInfinite", "z:yInfinite", "z:zRatio"];
      for (attributeToRemove  of removeTheseAttributes)
      { savableContainerSVG.removeAttr(attributeToRemove)
      }


      var svgString             = savableContainerSVG.get(0).outerHTML;
      regex_zThreeD             = /z:threeD=\"true\"/g;
      var removeTheseStrings    = [regex_zThreeD];
      for (stringToRemove of removeTheseStrings)
      { svgString = svgString.replace(stringToRemove, "");
      }

      This.display.savableSVGString = svgString;


      This.display.svgSaveLink.html(
          $(   `<a
                    href-lang ='image/svg+xml'
                    href      =
                        ' data:image/svg+xml,\n
                          ${svgString}
                        '
                    title     = 'Save SVG Image' 
                    download  = '${This.display.svgTextDescription.text()}_${This.display.modelOutputValue.text()}.svg'
                ><i class="fa fa-download" aria-hidden="true"></i></a>`
          )
      );
    }
  };
  this.ModelInstance.prototype.displayCurrentOutput = function()
  { var outputField         = this.lastAlteredOutputField;
    var visualisationField  = this.lastAlteredVisualisationField;
    console.log("displayCurrentOutput", this, outputField)



    var This = this;

    /*var customSVGTitle = this.display.customSVGTitle.val()
    if ( customSVGTitle != "")
    { this.svg3dDisplayJSON.svgFile = customSVGTitle+".svg";
    }
    */
    var svgFileName = this.svg3dDisplayJSON.svgFile;
    if (!(thisEqualsThat.svgStore.hasOwnProperty(svgFileName)))
    { d3.xml("/static/svg/"+svgFileName+"?ver="+thisEqualsThat.graphicLoadVersion, 'image/svg+xml',
        function(xml)
        { var importedNode    = document.importNode(xml.documentElement, true);
          var importedRootG   = importedNode.getElementsByTagNameNS(d3.ns.prefix.svg, "g")[0];
          var importedDefs    = importedNode.getElementsByTagNameNS(d3.ns.prefix.svg, "defs")[0];

          //var svgReferenceVisual  = $(thisEqualsThat.scene.referenceVisual.getSVGData(This.svg3dDisplayJSON.svgRelativeHighness)).clone();
          //svgReferenceVisual.appendTo(This.display.svgReferenceG);
          //$(svgReferenceVisual).attr("transform", "scale(0.2)");

          console.log("importSVG file", importedRootG);
          thisEqualsThat.svgStore[svgFileName]      = $(importedRootG);
          thisEqualsThat.svgDefsStore[svgFileName]  = $(importedDefs);

          This.displayCurrentOutput_2(This);
        }
      )
    }
    else
    { this.displayCurrentOutput_2(this)
    }

    var gTET = thisEqualsThat;
    //$("#document").append("<script type='text/javascript' src='/svg/rg1024_metal_barrel' />);

    this.display.topModelDiv.find(".chooseOutputField").html(outputField.data.displayName);
    this.display.topModelDiv.find(".modelOutputValue").html
    ( prettyPrint(outputField, outputField.data.currentValue)
    );
    this.display.topModelDiv.find(".chooseVisualisationField").html(visualisationField.data.displayName);
    this.display.topModelDiv.find(".modelVisualisationValue").html
    ( prettyPrint(visualisationField, visualisationField.data.currentValue)
    );

    // Add HUD interface


  }
  this.ModelInstance.prototype.displayCurrentOutput_2 = function(This)
  { this.inputFieldHUD.renderHUD("init");

    This.svgHUD.renderHUD("init");

    This.appendSVGToDisplay();
    This.animateSVG();
  }

  this.ModelInstance.prototype.appendSVGToDisplay = function()
  { this.display.svgClonableG = thisEqualsThat.svgStore[this.svg3dDisplayJSON.svgFile].clone();

    $(this.display.svgVisualisationG).html(this.display.svgClonableG);

    if (! this.display.addedSVGDefs)
    { this.display.svgDefsFromFile = thisEqualsThat.svgDefsStore[this.svg3dDisplayJSON.svgFile].clone();
      $(this.display.svgDefs).html(this.display.svgDefsFromFile);
      this.display.addedSVGDefs = true;
    }

    if (this.userSelectedReferenceSVG)
    { this.display.svgReferenceG = ThisEqualsThat.referenceVisual.getSVGDataByName  (this.userSelectedReferenceSVG            ).clone();
    }
    else
    { this.display.svgReferenceG = ThisEqualsThat.referenceVisual.getSVGData        (this.svg3dDisplayJSON.svgRelativeHighness).clone();
    }

    this.display.svgReferenceGContainer.html(this.display.svgReferenceG);

    
  }

//REFERENCE VISUAL
  this.ReferenceVisual = function(displayReferenceVisual)
  { var This = this;

    this.svgStore = {};
    // O.create( [ ".
    
    this.masterReferenceSVGSelectList = $("<div class='masterReferenceSVGSelectList'/>");
    this.svgSelectList = $("<ul/>");
    this.masterReferenceSVGSelectList.append(this.svgSelectList);
    $("body").append(this.masterReferenceSVGSelectList);
    // this.svgSelectList.hide();


    this.svgReferenceDefs =
    [ { "heightThreshold": 0.03,  "fileHandle": "Ant",          "height": 0.002},
      { "heightThreshold": 17.2,  "fileHandle": "SuperBlonde",  "height": 1.72},
      //{ "heightThreshold": 33.0,  "fileHandle": "Bus",        "height": 4.40},
      { "heightThreshold": 132.0, "fileHandle": "EiffelTower",  "height": 301.0}
    ];
    this.svgReferenceDefsByName = {};
    for (var counter=0; counter < this.svgReferenceDefs.length; counter ++)
    { var currentReferenceDef     = this.svgReferenceDefs[counter];
      this.svgReferenceDefsByName[currentReferenceDef.fileHandle] = currentReferenceDef;
    }


    var peopleReferenceSVGs =
        [ "MeganPeople3/_C4_mansign",
          "MeganPeople3/_C9_manwriting",
          "MeganPeople3/_C8_manwaiting",
          "MeganPeople3/_C1_manhappy",
          "MeganPeople3/_C3_mancamera",
          "MeganPeople3/_C5_manrunning",
          "MeganPeople3/_C2_manbored",
          "MeganPeople3/_C7_manbooks",
          ["MeganPeople3/_C10_mansad", 0.9],
          "MeganPeople3/_C6_manidea",

          "MeganPeople4/D6_gransign",
          "MeganPeople4/D5_granangry",
          "MeganPeople4/D4_granlookingup",
          "MeganPeople4/D1_granhappy",
          "MeganPeople4/D2_granchatting",
          ["MeganPeople4/D9_granreading", 1.35],
          "MeganPeople4/D10_granthinking",
          ["MeganPeople4/D3_grannapping", 1.35],
          "MeganPeople4/D7_granworried",
          ["MeganPeople4/D8_grancat", 1.68],

          ["MeganPeople2/_B3_boysign", 1.2],
          ["MeganPeople2/_B10_boysearching", 1.0],
          ["MeganPeople2/_B6_boyresting", 0.34],
          ["MeganPeople2/_B1_boyhappy", 1.2],
          ["MeganPeople2/_B9_boytantrum", 1.2],
          ["MeganPeople2/_B2_boysad", 1.2],
          ["MeganPeople2/_B7_boysuprised", 1.2],
          ["MeganPeople2/_B5_boypointing", 1.2],
          ["MeganPeople2/_B8_boylaughing", 1.2],
          ["MeganPeople2/_B4_boyreading", 0.7],

          ["MeganPeople5/E9_womanresting", 0.9],
          "MeganPeople5/E6_womansign",
          "MeganPeople5/E2_womanconfused",
          "MeganPeople5/E3_womanangry",
          "MeganPeople5/E1_womanhappy",
          "MeganPeople5/E7_womanchatting",
          ["MeganPeople5/E10_womanpainting", 1.4],
          ["MeganPeople5/E4_womantired", 1.65],
          ["MeganPeople5/E5_womanreading", 0.6],
          "MeganPeople5/E8_womanyoga",

          "MeganPeople1/_A2_hippylaughing",
          "MeganPeople1/_A3_hippychatting",
          "MeganPeople1/_A7_hippyidea",
          ["MeganPeople1/_A6_hippybored", 0.9],
          "MeganPeople1/_A1_hippychuffed",
          "MeganPeople1/_A8_hippystressed",
          ["MeganPeople1/_A4_hippycandle", 0.9],
          "MeganPeople1/_A5_hippyjuggling",
          ["MeganPeople1/_A9_hippyworking", 0.9],
          "MeganPeople1/_A10_hippysign"
        ];
    for (var svg of peopleReferenceSVGs)
    { if (svg instanceof Array)
      { this.svgReferenceDefsByName[svg[0]] = { "heightThreshold": svg[1],  "fileHandle": svg[0],  "height": svg[1]};
      }
      else
      { this.svgReferenceDefsByName[svg] = { "heightThreshold": 17.2,  "fileHandle": svg,  "height": 1.72};
      }
    }

    refKeys = Object.keys(this.svgReferenceDefsByName);
    ThisEqualsThat.ReferenceVisualLoader(This, this.svgReferenceDefsByName, refKeys, this, refKeys.length-1);

    this.getSVGData = function(height)
    { for (var counter=0; counter < this.svgReferenceDefs.length; counter ++)
      { var currentReferenceDef = this.svgReferenceDefs[counter];
        if (height < currentReferenceDef.heightThreshold || counter == this.svgReferenceDefs.length - 1)
        { This.currentReferenceSVG = currentReferenceDef;
          return this.svgStore[currentReferenceDef['fileHandle']];
        }
      }
    }
    this.getSVGDataByName = function(fileHandle)
    { This.currentReferenceSVG = this.svgReferenceDefsByName[fileHandle];
      return this.svgStore[fileHandle];
    }
  }
  //this.ReferenceVisual.prototype.
  this.ReferenceVisualLoader = function(referenceVisual, referenceSVGDataDict, refKeys, referenceVisualDefs, index)
  { if (index == -1)
    { return;
    }
    else
    { this.ReferenceVisualLoader(referenceVisual, referenceSVGDataDict, refKeys, referenceVisualDefs, index-1);
    }

    var referenceSVGData = referenceSVGDataDict[refKeys[index]];
    var importedNode;
    d3.xml("/static/svg/referenceSVGs/"+referenceSVGData.fileHandle+".svg?ver=" + thisEqualsThat.graphicLoadVersion, 'image/svg+xml',
        function(xml)
        {
              importedNode = document.importNode(xml.documentElement, true);
              console.log("referenceVisual:" + referenceSVGData.fileHandle);//, importedNode);
              var referenceRootG = $(importedNode).find("g").first();
              referenceVisualDefs.svgStore[referenceSVGData.fileHandle] = referenceRootG;

              var referenceSVGSelectListItemDiv = $("<div class='referenceSVGSelectListItem' />").attr("thisEquals_fileHandle", referenceSVGData.fileHandle);
              var referenceSVGSelectListItemLI  = $("<li />");
              var referenceSVGSelectListItemSVG = $(document.createElementNS(d3.ns.prefix.svg, "svg"))
                  .attr("xmlns",        "http://www.w3.org/2000/svg")
                  .attr("xmlns:xlink",  "http://www.w3.org/1999/xlink")
                  .attr("xmlns:z",      "http://debeissat.nicolas.free.fr/svg3d/svg3d.rng")
                  .attr("width",        "100%")
                  .attr("height",       "100%")
              var clonedG = referenceRootG.clone().appendTo(referenceSVGSelectListItemSVG);
              referenceSVGSelectListItemDiv.append(referenceSVGSelectListItemSVG);
              referenceSVGSelectListItemLI.append(referenceSVGSelectListItemDiv);

              referenceVisual.svgSelectList.append(referenceSVGSelectListItemLI);

              var internalSize    = clonedG[0].getBBox();

              var viewBoxString   = internalSize.x        + " " +
                                    internalSize.y        + " " +
                                    internalSize.width    + " " +
                                    internalSize.height;

              referenceSVGSelectListItemSVG[0].setAttribute("viewBox", viewBoxString);
        }
    );
  };


  this.InputFieldHUD = function(modelInstance)
  { this.plugins          = {};
    this.contextData      = {};

    this.modelInstance            = modelInstance;
    modelInstance.inputFieldHUD   = this;
  }
  this.InputFieldHUD.prototype.display = function()
  { var modelInstance = this.modelInstance;

    this.display                  = modelInstance.display.modelSliders
  }
  this.InputFieldHUD.prototype.renderHUD = function(tagHook)
  { if (! this.hasOwnProperty("display") )
    { this.display();
    }

    var inputFieldHUDJSON  = this.modelInstance.data.inputFieldHUDJSON;

    for (hudDescriptor in  inputFieldHUDJSON)
    { var hudAddress    = hudDescriptor.split(".");
      var hudComponent  = hudAddress[0];
      var hudTagHooks   = $(hudAddress).slice(1).get();
      if (tagHook == "init")
      { if (! this.contextData[hudComponent])
        { this.contextData[hudComponent] = {};
          this.plugins[hudComponent] = new this[hudComponent](this, this.contextData[hudComponent], tagHook);
        }
      }
      if ($.inArray(tagHook, hudTagHooks) >= 0)
      { this.plugins[hudComponent].display(inputFieldHUDJSON[hudDescriptor], tagHook)
      }
    }
  }

  this.InputFieldHUD.prototype.FieldOrder = function(inputFieldHUD, context, tagHook)
  { this.inputFieldHUD            = inputFieldHUD;
    this.context                  = context;
    // this.context.byVisualisation  = {};

  }
  this.InputFieldHUD.prototype.FieldOrder.prototype.display =function(orderDefinition, tagHook)
  { // html and behaviour a widget for a  colorPicker widhet. Use the code defined in the colorPickerData to run when the colorPicker exits.
    //    it defines code which generates CSS to change the colors of shit in a visualisation specific way.
    console.log("FieldOrder", this.inputFieldHUD.modelInstance.inputFields);
    var This    = this;
    var context = this.context;

    if (! context.doOnce)
    { var elementList = [];

      for (orderItem of orderDefinition.orderList)
      { console.log("  "+`["${orderItem.replace(", ", "\", \"")}"]`); //"
        if (orderItem == "spacer")
        { elementList.push($(`<div class='inputFieldElement spacer' />`) );
        }
        else if (orderItem.startsWith("groupHeader") )
        { elementList.push($(`<div class="inputFieldElement groupHeader">${orderItem.substring(12)}</div>` ) )
        }
        else
        { elementList.push(this.inputFieldHUD.modelInstance.inputFields[`["${orderItem.replace(", ", "\", \"")}"]`].uiElement); //"
        }
      }

      for (var index = elementList.length; index > 0; index --)
      { this.inputFieldHUD.modelInstance.display.modelSliders.prepend(elementList[index-1]);
      }

      context.doOnce = true;
    }
  }

  this.InputFieldHUD.prototype.Remove = function(inputFieldHUD, context, tagHook)
  { this.inputFieldHUD            = inputFieldHUD;
    this.context                  = context;
    // this.context.byVisualisation  = {};

  }
  this.InputFieldHUD.prototype.Remove.prototype.display =function(replaceDict, tagHook)
  { // html and behaviour a widget for a  colorPicker widhet. Use the code defined in the colorPickerData to run when the colorPicker exits.
    //    it defines code which generates CSS to change the colors of shit in a visualisation specific way.
    var This = this;

    for (replaceConfigName in replaceDict)
    { var replaceConfig = replaceDict[replaceConfigName];
      console.log(replaceConfig, replaceConfigName);

      if (! This.context.hasOwnProperty(replaceConfigName) )
      { This.context[replaceConfigName] =
            { "fields": {},
            };
      }
      var localContext = this.context[replaceConfigName];

      for (fieldToHide of ( replaceConfig.fieldsToHide || [] ) )
      { if (! localContext.fields.hasOwnProperty(fieldToHide) )
        { localContext.fields[fieldToHide] = {};
        }

        This.inputFieldHUD.modelInstance.inputFields[fieldToHide].uiElement.toggleClass("displayNone", true);
        localContext.fields[fieldToHide].hidden = true;
      }

    }
  }

  this.InputFieldHUD.prototype.RatioColor = function(inputFieldHUD, localContext, tagHook)
  { this.inputFieldHUD    = inputFieldHUD;
    this.context          = localContext;
    this.context.inputFieldHUD = inputFieldHUD;


    localContext.initContainer = function(inputFieldHUD, localContext)
    { var container =
          $(` <div class='ratioColorTotal'>
                <div class='inputFieldElement total hudCollection'          />
                <div class='ratioColorList'     />
                <div class='inputFieldElement addRatio hudItem fa fa-plus-circle'       />
              </div>
            `);
      inputFieldHUD.modelInstance.display.modelSliders.prepend(container);

      localContext.container      = container;
      localContext.ratioColorList = container.find(".ratioColorList");

      inputFieldHUD.modelInstance.inputFields['[\"numberOfClones\"]'].uiElement.appendTo(container.find('.total') );

      container.on("click", ".addRatio",
          function(event)
          { localContext.createRatioInput(0.1, tinycolor.random().setAlpha(0.7).saturate(50));
            localContext.writeChanges(true);

            localContext.inputFieldHUD.modelInstance.doNotUpdateUI = true;
            localContext.inputFieldHUD.modelInstance.inputFields[`["ratios"]` ].uiValue_text.trigger("change");
            localContext.inputFieldHUD.modelInstance.inputFields[`["colors"]` ].uiValue_text.trigger("change");
          }
      );
      container.on("click", ".closeBox",
          function(event)
          { debugger;
            //get the target and find the hud_position and the $ of the original element.
            localContext.destroyRatioInput($(this).parent(".ratioColor"));
          }
      );
      container.on("change", ".percentageSpinner",
          function(event)
          { localContext.writeChanges();

            localContext.inputFieldHUD.modelInstance.inputFields[`["ratios"]` ].uiValue_text.trigger("change");
          }
      );

      // container.on("move.spectrum", ".ratioColor",
      //     function(event)
      //     { debugger;
      //       console.log("move.spectrum", $(this).data("hud_position") );

      //       var clonesToColor = inputFieldHUD.modelInstance.recolorClones;
      //     }
      // );
    };

    localContext.createRatioInput =
        function(initialRatio, initialColor)
        { if (!initialRatio) initialRatio = 0.0;
          if (!initialColor) initialColor = tinycolor("rgb(128,128,128, 0.8");

          if (! localContext.hasOwnProperty("ratioInputFieldCount") )
          { localContext.ratioInputFieldCount = 0;
            localContext.ratioInputFields     = [];
          }
          var toReturn =
                $(` <div class='ratioColor inputFieldElement'>
                      <div    class="hudItem inputFieldLabel" />
                      <input  class='hudItem percentageSpinner' type='number' min='0' max='100' step='0.1' value ='${initialRatio * 100}' />
                      <div    class="hudItem textLabel percentLabel">%</div>
                      <input  class='hudItem spectrumColorPickerInput' value='${initialColor.toString("rgb")}' />
                      <span   class="hudItem closeBox    fa fa-times-circle" />
                    </div>
                  `
                 );
          toReturn.data("hud_position", localContext.ratioInputFieldCount++);

          localContext.ratioColorList.append(toReturn);
          toReturn
              .find(".spectrumColorPickerInput")
              .spectrum
              ( { "showPalette"     : true,
                  "showAlpha"       : true,
                  "preferredFormat" : "rgb",

                  "color"           : initialColor,
                  "replacerClassName": "hudItem colorPicker",


                  "move"            : localContext.spectrumMove,
                  "change"          : localContext.spectrumChange,
                }
              );

          localContext.markDirty();

          return toReturn
        };
    localContext.destroyRatioInput =
        function(inputFieldElement)
        { delete localContext.ratioInputFields[inputFieldElement.data("hud_position")];

          inputFieldElement.remove();
          localContext.markDirty();
        };
    localContext.markDirty =
        function()
        {
        };
    localContext.writeChanges =
        function(triggerUpdate)
        { var newRatiosValArray = [];
          var newColorsValArray = [];
          localContext.ratioColorList
                        .children()
                        .each
                        ( function()
                          { newRatiosValArray.push( ($(this).find(".percentageSpinner"        ).val() ) / 100 );
                            newColorsValArray.push(  $(this).find(".spectrumColorPickerInput" ).val()         );
                          }
                        );

          inputFieldHUD.modelInstance.inputFields[`["ratios"]` ].setValue(newRatiosValArray.join("|") );
          inputFieldHUD.modelInstance.inputFields[`["colors"]` ].setValue(newColorsValArray.join("|") );


        };
    localContext.spectrumMove =
        function(color)
        { mixAmount = color.getAlpha() * 100;
          color.setAlpha(1.0);

          recolorPaths(inputFieldHUD.modelInstance.recolorClones.paths[$(this).parent(".ratioColor").data("hud_position")], color, mixAmount, "recolorClones" );
        };
    localContext.spectrumChange =
        function(color)
        { setImmediate
          ( function()
            { localContext.inputFieldHUD.modelInstance.doNotUpdateUI = true;
              localContext.writeChanges();
              localContext.inputFieldHUD.modelInstance.inputFields[`["colors"]` ].uiValue_text.trigger("change");
            }
          );
        };
    localContext.initContainer(inputFieldHUD, localContext);
  };

  this.InputFieldHUD.prototype.RatioColor.prototype.display = function(config, tagHook)
  {

    var inputFieldHUD     = this.inputFieldHUD;
    var localContext      = this.context;
    localContext.ratioColorList.empty();
    delete localContext.ratioInputFieldCount;

    var recolorClones     = inputFieldHUD.modelInstance.recolorClones;
    var pathSetCount      = recolorClones.paths.length;
    for (var index = 0; index < pathSetCount; index ++)
    { var initialColor  = recolorClones.changeTinyColors[index].setAlpha(recolorClones.mixAmount[index] / 100.0);
      ratioInput        = localContext.createRatioInput(recolorClones.ratios[index], initialColor);
      //recolorPaths(recolorClones.paths[index], recolorClones.changeTinyColors[index], recolorClones.mixAmount[index], "recolorClones")
    }

  }



  this.SVGHUD = function(modelInstance)
  { this.plugins          = {};
    this.contextData      = {};

    this.modelInstance    = modelInstance;
    // modelInstance.svgHUD  = this;
  }
  this.SVGHUD.prototype.display = function()
  { var modelInstance = this.modelInstance;

    this.divForHUD = O.create( [ ".svgHUD" ], modelInstance.display, null )[0];
    modelInstance.display.svgDiv.prepend(this.divForHUD);
    
    
  }
  this.SVGHUD.prototype.renderHUD = function(tagHook)
  { if (! this.hasOwnProperty("divForHUD") )
    { this.display();
    }

    if (tagHook == "init")
    { for ( hudComponent in this.plugins )
      { this.plugins[hudComponent].hide();
      }
    }

    var defaultDict =
        { "svg3dCloneTimer.preClone.postColor":
          {
          }
        }
    for (hudDescriptor in defaultDict)
    { var hudAddress    = hudDescriptor.split(".");
      var hudComponent  = hudAddress[0];
      var hudTagHooks   = hudAddress.slice(1);

      if (! this.contextData.hasOwnProperty(hudComponent) )
      { this.contextData[hudComponent] = {};
        this.plugins[hudComponent] = new this[hudComponent](this, this.contextData[hudComponent], tagHook);
      }

      if ($.inArray(tagHook, hudTagHooks) >-1 )
      { this.plugins[hudComponent][tagHook](defaultDict[hudDescriptor], this.contextData[hudComponent]);
      }
    }

    var svg3dDisplayJSON  = this.modelInstance.svg3dDisplayJSON;

    for (hudDescriptor in svg3dDisplayJSON.svgHUD)
    { var hudAddress    = hudDescriptor.split(".");
      var hudComponent  = hudAddress[0];
      var hudTagHooks   = hudAddress.slice(1);

      if (! this.contextData.hasOwnProperty(hudComponent) )
      { this.contextData[hudComponent] = {};
        this.plugins[hudComponent] = new this[hudComponent](this, this.contextData[hudComponent], tagHook);
      }
      if ($.inArray(tagHook, hudTagHooks) >-1 )
      { this.plugins[hudComponent][tagHook](svg3dDisplayJSON.svgHUD[hudDescriptor], this.contextData[hudComponent]);
      }
    }
  }

  this.SVGHUD.prototype.svg3dCloneTimer = function(svgHUD, context)

  { var This = this;

    this.svgHUD                       = svgHUD;
    this.context                      = context;

    this.context.cookieManager        = ThisEqualsThat.componentCookieManager.register("svg3dCloneTimer");

    this.context.totalClonesRendered  = 0;
    this.context.totalTimeTaken       = 0;

    this.context.display              = $("<div class='renderTimer' />");
    this.context.display.appendTo(this.svgHUD.divForHUD);

    // this.context.countDown = function(millis)
    // { This.context.display.text(This.context.estimatedFinishTime - Date.now() );
    //   if (! This.context.cancelCountdown )
    //   { setTimeout(This.context.countDown, 50);
    //   }
    // }
  }
  this.SVGHUD.prototype.svg3dCloneTimer.prototype.hide = function()
  { //do nothing... yet :)
  }
  this.SVGHUD.prototype.svg3dCloneTimer.prototype.preClone = function(svgHUD, context)
  { var representationName    = this.svgHUD.modelInstance.svg3dDisplayJSON.representationName;
    var clonesToBeRendered    = this.svgHUD.modelInstance.svg3dDisplayJSON.svg3dConfiguration.clone3d.nb;

    
    this.context.totalTimeTaken       = parseInt(this.context.cookieManager(representationName+".totalTimeTaken"     )) || this.context.totalTimeTaken;
    this.context.totalClonesRendered  = parseInt(this.context.cookieManager(representationName+".totalClonesRendered")) || this.context.totalClonesRendered;
    
    var averageTimePerClone   = this.context.totalTimeTaken / this.context.totalClonesRendered;
    var estimatedTimeToRender = clonesToBeRendered * averageTimePerClone;

    if (estimatedTimeToRender > 5000)
    { var render = window.confirm("Estimated time to render: "+ thisEqualsThat.standardPrecision( (estimatedTimeToRender / 1000) ) +" seconds");
      if (! render)
      { clonesToBeRendered = this.svgHUD.modelInstance.svg3dDisplayJSON.svg3dConfiguration.clone3d.nb = 1;
      }
    }
    this.context.totalClonesRendered += clonesToBeRendered;
    this.context.startTime            = Date.now();
    this.context.estimatedFinishTime  = this.context.startTime + estimatedTimeToRender;
    // this.context.cancelCountdown = false;
    // this.context.countDown();
  }
  this.SVGHUD.prototype.svg3dCloneTimer.prototype.postColor = function(svgHUD, context)
  { this.context.totalTimeTaken += Date.now() - this.context.startTime;

    
    var representationName      = this.svgHUD.modelInstance.svg3dDisplayJSON.representationName;
    this.context.cookieManager( representationName+".totalTimeTaken"     , this.context.totalTimeTaken       );
    this.context.cookieManager( representationName+".totalClonesRendered", this.context.totalClonesRendered  );


    this.context.cancelCountdown = true;
  }


  this.SVGHUD.prototype.fillManager = function(svgHUD, context)
  { this.svgHUD     = svgHUD;
    this.context    = context;
  }
  this.SVGHUD.prototype.fillManager.prototype.display   = function()
  { this.context.fillManagersDiv = $("<div class='fillManagers hudCollection' />");
    this.svgHUD.divForHUD.append(this.context.fillManagersDiv);
  }
  this.SVGHUD.prototype.fillManager.prototype.hide      = function()
  { if ( this.context.hasOwnProperty("fillManagersDiv") )
    { this.context.fillManagersDiv.hide();
    }
  }
  this.SVGHUD.prototype.fillManager.prototype.postClone = function(fillManagersDict, context)
  { // html and behaviour a widget for a  fillManager widhet. Use the code defined in the fillManagerData to run when the fillManager exits.
    //    it defines code which generates CSS to change the colors of shit in a visualisation specific way.
    var This = this;

    if (! context.hasOwnProperty("fillManagersDiv") )
    { this.display();
    }
    this.context.fillManagersDiv.show();

    for (fillManagerSelector in fillManagersDict)
    { var fillManagerData = fillManagersDict[fillManagerSelector];
      console.log("fillManager", fillManagerSelector, fillManagerData);

      var selectorContext = null;
      if (! this.context.hasOwnProperty(fillManagerSelector) )
      { selectorContext = context[fillManagerSelector] = { "byVisualisation": {} };

        selectorContext.fillManagerDiv = $("<div class='fillManager hudItem' />");
        context.fillManagersDiv.append(selectorContext.fillManagerDiv);

        var fillManagerDiv = selectorContext.fillManagerDiv;
        fillManagerDiv
          .spectrum
          ({  "color":            tinycolor(fillManagerData.initialColorString),
              "showAlpha":        true,
              "preferredFormat": "rgba",
              "show": function()
              { fillManagerDiv.spectrum("set", fillManagerDiv.data("thisEquals.svgHUD.fillManager.localContext").currentColor);
              },
              "hide": function()
              { This.svgHUD.modelInstance.svg_createSaveLink(This.svgHUD.modelInstance);
              },
              "move": function(spectrumOutput)
              { fillManagerDiv.data("thisEquals.svgHUD.fillManager.localContext").rep_onColorChange(spectrumOutput);
              },
            });
      }
      else
      { selectorContext = context[fillManagerSelector];
      }

      var lastAlteredVisualisationField = this.svgHUD.modelInstance.lastAlteredVisualisationField.fullAddress;
      var localContext = null;
      if (! selectorContext.byVisualisation.hasOwnProperty(lastAlteredVisualisationField) )
      { localContext = selectorContext.byVisualisation[lastAlteredVisualisationField] = { "currentColor": tinycolor(fillManagerData.initialColorString) };

        localContext.rep_onColorChange =
            function(color)
            { var toReturn    = null;

              for (var elementSelector in fillManagerData.fillSmasher)
              { var pickedColor = tinycolor(color.toString("rgb"));
                localContext.memoisedElements[elementSelector].attr("fill", eval(fillManagerData.fillSmasher[elementSelector]) );
              }

              localContext.currentColor = color;
            };
      }
      else
      { localContext = selectorContext.byVisualisation[lastAlteredVisualisationField];
        console.log("localContext", localContext);
      }

      localContext.memoisedElements = {};
      for (var elementSelector in fillManagerData.fillSmasher)
      { localContext.memoisedElements[elementSelector] = $(This.svgHUD.modelInstance.display.rootSVG).find(elementSelector);
      }

      selectorContext.fillManagerDiv.data("thisEquals.svgHUD.fillManager.localContext", localContext);
      localContext.rep_onColorChange(localContext.currentColor);
    }
  }


  this.SVGHUD.prototype.RandomiseClones= function(svgHUD, context)
  { this.svgHUD     = svgHUD;
    this.context    = context;
    this.context.byVisualisation = {};
  }
  this.SVGHUD.prototype.RandomiseClones.prototype.hide      = function()
  { this.context.collectionDiv.hide();
  }
  this.SVGHUD.prototype.RandomiseClones.prototype.postColor = function(randomiseClonesDict, context)
  { // html and behaviour a widget for a  colorPicker widhet. Use the code defined in the colorPickerData to run when the colorPicker exits.
    //    it defines code which generates CSS to change the colors of shit in a visualisation specific way.

    if (! context.hasOwnProperty("hudItems") )
    { context.collectionDiv = $("<div class='randomiseClones hudCollection' />");
      this.svgHUD.divForHUD.append(this.context.collectionDiv);

      context.hudItems = {};

      context.randomiseFunctions = {};
      context.randomiseFunctions.randomisePosition      = function(degreeOfRandom)
      { if (degreeOfRandom != 0)
        { normalDistribution("randomisePosition", true);
          $(This.svgHUD.modelInstance.display.svgVisualisationG)
              .children("g") //cghange to children or correct selector for children
              .each(
                  function()
                  { var gBBox = this.getBBox();
                    var maxXChange = gBBox.width  / 80;
                    var maxYChange = gBBox.height / 80;

                    var changeX = ((normalDistribution("randomisePosition")  * degreeOfRandom * maxXChange) );
                    var changeY = ((normalDistribution("randomisePosition")  * degreeOfRandom * maxYChange) );

                    var transform;

                    if (! this.getAttribute("svgHUD_initial_transform") )
                    { transform = this.getAttribute("transform");
                      if (transform === null)
                      { transform = "translate(0 0)";
                      }
                      this.setAttribute("svgHUD_initial_transform", transform);
                    }
                    else
                    { transform = this.getAttribute("svgHUD_initial_transform");
                    }

                    var translate = transform.match(/^translate\(([-]?\d+[.]?\d*)\s*[,]?\s*([-]?\d+[.]?\d*)\)$/);
                    var newX = Number(translate[1]) + changeX;
                    var newY = Number(translate[2]) + changeY;
                    var newTranslate = "translate("+newX+" "+newY+")";
                    this.setAttribute("transform", newTranslate);
                    //console.log(this, transform);
                  }
              );
        }
      };
      context.randomiseFunctions.randomiseColors = function(degreeOfRandom)
      { if (degreeOfRandom != 0)
        { normalDistribution("randomiseColors", true);

          $(This.svgHUD.modelInstance.display.svgVisualisationG)
              .find("path")
              .each(
                  function()
                  { if (this.getAttribute("recolorClones_protectedColor") )
                    { return;
                    }


                    if (! this.getAttribute("initial_fill_path") )
                    { this.setAttribute("initial_fill_path", $(this).css("fill") );
                    }
                    var colorRGB = this.getAttribute("initial_fill_path");
                    if (colorRGB == null)
                      colorRGB = "rgb(50, 50, 50)";
                    if (colorRGB.indexOf("rgb") === 0)
                    { var rgb       = colorRGB.match(/^rgb[a]?\((\d+),\s*(\d+),\s*(\d+)[,]?\s*(\d*[.]?\d*)\)$/);
                      r = Number(rgb[1]);
                      newR = Math.round(Math.max((((degreeOfRandom * normalDistribution("randomiseColors") * 10.0) - 5) ) + r, 0));
                      g = Number(rgb[2]);
                      newG = Math.round(Math.max((((degreeOfRandom * normalDistribution("randomiseColors") * 10.0) - 5) ) + g, 0));
                      b = Number(rgb[3]);
                      newB = Math.round(Math.max((((degreeOfRandom * normalDistribution("randomiseColors") * 10.0) - 5) ) + b, 0));
                      if (4 in rgb && rgb[4] != "")
                        newRGB = "fill: rgba("+newR+", "+newG+", "+newB+", "+rgb[4]+");";
                      else
                        newRGB = "fill: rgb("+newR+", "+newG+", "+newB+");"
                      //$(this).css("fill", newRGB);
                      //newStyle = this.getAttribute("style");
                      //if (newStyle)+newRGB;
                      this.setAttribute("style", newRGB);
                      this.setAttribute("initial_fill_group", newRGB.substring(6).replace(";", ""));
                    }
                  }
              );
        }

        context.randomiseFunctions.randomiseColorsByGroup(contextByVisualisation.randomiseColorsByGroup.degreeOfRandom, true);
      }
      context.randomiseFunctions.randomiseColorsByGroup = function(degreeOfRandom)
      {
        if (degreeOfRandom != 0)
        { normalDistribution("randomiseColorsByGroup", true);
          { $(This.svgHUD.modelInstance.display.svgVisualisationG)
                .children("g")
                .each(
                    function()
                    {

                        var changeR = Math.round( 5 *  degreeOfRandom * normalDistribution("randomiseColorsByGroup") );
                        var changeG = Math.round( 5 *  degreeOfRandom * normalDistribution("randomiseColorsByGroup") );
                        var changeB = Math.round( 5 *  degreeOfRandom * normalDistribution("randomiseColorsByGroup") );

                        //$(this).css("fill", newRGB);
                        //newStyle = this.getAttribute("style");
                        //if (newStyle)+newRGB;
                        $(this)
                            .find("path")
                            .each(
                                function()
                                { if (this.getAttribute("recolorClones_protectedColor") )
                                  { return;
                                  }

                                  if (! this.getAttribute("initial_fill_group") )
                                  { this.setAttribute("initial_fill_group", $(this).css("fill"));
                                  }
                                  var colorRGB = this.getAttribute("initial_fill_group");

                                  if (colorRGB == null)
                                    colorRGB = "rgb(50, 50, 50)";
                                  if (colorRGB.indexOf("rgb") === 0)
                                  { var rgb       = colorRGB.match(/^rgb[a]?\((\d+),\s*(\d+),\s*(\d+)[,]?\s*(\d*[.]?\d*)\)$/);
                                    var r = Number(rgb[1]);
                                    var newR = Math.max(r + changeR, 0);
                                    var g = Number(rgb[2]);
                                    var newG = Math.max(g + changeG, 0);
                                    var b = Number(rgb[3]);
                                    var newB = Math.max(b + changeB, 0);
                                    if (4 in rgb && rgb[4] != "")
                                      var newRGB = "fill: rgba("+newR+", "+newG+", "+newB+", "+rgb[4]+");";
                                    else
                                      var newRGB = "fill: rgb("+newR+", "+newG+", "+newB+");"
                                    this.setAttribute("style", newRGB);
                                  }
                                }
                            );
                    }
                );
          }

        };
      };

      context.spectrumFunction = function(randomiseItem, functionToCall)
      { randomiseItem.spectrum
        ( { "color":            `rgba(0,0,0, ${randomiseItem.data("localContext").degreeOfRandom / (localContext.randomMultiplier || 32)})`,
            "containerClassName": "spectrumAlphaOnly",
            "showAlpha":        true,
            "preferredFormat": "rgba",
            "show": function()
            { //$(This.svgHUD.modelInstance.display.rootSVG).find(colorPickerSelector).toggleClass("highlightSVGPath", true);
              randomiseItem.spectrum("set", `rgba(0,0,0, ${randomiseItem.data("localContext").degreeOfRandom / (randomiseItem.data("localContext").randomMultiplier || 32) })`);
            },
            "hide": function()
            { This.svgHUD.modelInstance.svg_createSaveLink(This.svgHUD.modelInstance);
            },
            "move": function(spectrumOutput)
            { randomiseItem.data("localContext").degreeOfRandom = spectrumOutput.getAlpha() * ( randomiseItem.data("localContext").randomMultiplier || 32 );
              functionToCall(randomiseItem.data("localContext").degreeOfRandom);
            },
        });
      }
    }

    this.context.collectionDiv.show();

    var processingOrder = ["randomisePosition", "randomiseColors", "randomiseColorsByGroup"];

    var This = this;

    var lastAlteredVisualisationField = this.svgHUD.modelInstance.lastAlteredVisualisationField.fullAddress;
    if (! this.context.byVisualisation[lastAlteredVisualisationField] )
    { this.context.byVisualisation[lastAlteredVisualisationField] = {};
    }
    var contextByVisualisation = this.context.byVisualisation[lastAlteredVisualisationField];

    for (randomiseProperty of processingOrder)
    { var randomiseConfig;
      if (!randomiseClonesDict.hasOwnProperty(randomiseProperty) )
      { randomiseConfig = { "degreeOfRandom": 0 };
      }
      else
      { randomiseConfig = randomiseClonesDict[randomiseProperty];
      }
      console.log(randomiseProperty, randomiseConfig);

      if (!contextByVisualisation[randomiseProperty] )
      { contextByVisualisation[randomiseProperty] =  randomiseConfig
      }
      var localContext = contextByVisualisation[randomiseProperty];

      if (! context.hudItems.hasOwnProperty(randomiseProperty) )
      { var randomiseItem   = context.hudItems[randomiseProperty] =   $("<div class='randomiseProperty hudItem' />");
        var icon            = $(`<img src='/static/graphics/thisEquals/svgHUD/${randomiseProperty}.png' />`);

        randomiseItem.append(icon);
        context.collectionDiv.append(randomiseItem);

        context.hudItems[randomiseProperty].data("localContext", localContext);
        context.spectrumFunction(randomiseItem, context.randomiseFunctions[randomiseProperty]);
      }
    }

    for (randomiseProperty of processingOrder)
    { context.hudItems[randomiseProperty].data("localContext", contextByVisualisation[randomiseProperty]);
      context.randomiseFunctions[randomiseProperty](context.hudItems[randomiseProperty].data("localContext").degreeOfRandom );
    }
  };


  //SVG STORE
  this.SVGStore = function()
  { this.svgStore = {};
  }
  this.SVGStore.prototype.getFile = function(svgFileName, onSuccess)
  { if (!(this.svgStore.hasOwnProperty(svgFileName)))
    {
    }
  }


  this.ModelFieldInput = function(modelInstance, data)
  { console.log(modelInstance, data);
    this.modelInstance  = modelInstance;
    this.fullAddress    = data.fullAddress;
    this.simpleName     = this.fullAddress.replace(/[\[\]\",]/g, "");
    this.simpleNameUnits = data.unitPrefix + " " + this.simpleName + " " + data.unitSuffix;
    this.data           = data;
    modelInstance.inputFields[data.fullAddress] = this;
  }

  this.ModelFieldInput.prototype.setValue = function(newValue, trigger)
  { fieldType = this.data.fieldType;
    if (fieldType == "select" || fieldType == "text")
    { this.data.currentValue = newValue;
      this["uiValue_" + fieldType].val(newValue);
    }
    if (fieldType == "slider")
    { this.data.currentValue = newValue;
      this.slider_ifaUpdatesCurrentValue();
    }

    // if (fieldType == "text" || fieldType == "slider")
    // { var uiInputText = this["uiValue_" + fieldType];
    //   if (! uiInputText.is(":focus"))
    //   { uiInputText.val( this.unitsAroundOutput(this.data.currentValue) );
    //   }
    // }
  }
  this.ModelFieldInput.prototype.inputFieldAltered = function(This)
  { if (!This) var This = this;
    This.modelInstance.inputFieldAltered
    ( { "inputField": this.fullAddress,
        "newValue"  : this.data.currentValue,
      }
    );
  }
  

  this.ModelFieldInput.prototype.getTag = function(passThrough, appendTo)
  { if (! this.hasOwnProperty("uiElement"))
    { this.uiElement =
          this["getTag_"+this.data.fieldType](passThrough, appendTo)
             .addClass("modelClass_"  + this.data.displayFieldAddress.split(":")[0])
             .addClass("fullAddress_" + this.fullAddress)
             .addClass("type_"        + this.data.fieldType)
             .addClass("name_"        + this.data.name)
             .addClass("unit_"        + this.data.unit)
             .data("thisEquals.modelFieldInput", this)
             ;
    }
    return this.uiElement;
  }
  this.ModelFieldInput.prototype.getTag_select = function(passThrough, appendTo)
  { var fieldData = this.data;
    var display = this.display = {};

    var This = this;
    // O.create
    // ( [ ".inputFieldElement", 
    //     [ [ ".inputFieldLabel", "@"+this.data.displayName ],
    //       [ O.dropdown(this.display, null, ".inputFieldSelect", this.simpleName) ],
    //     ],
    //   ],
    //   this.display,
    //   null
    // );
    // this.uiElement = this.display.inputFieldElement;
    O.create
    ( [ ".uiElement.inputFieldElement.inputField.displayFlex.spaceBetween.width100",
        [ [ ".inputFieldLabel.floatLeft.smallCaps", "@"+this.data.displayName ],
          [ ".slideAndValue",
            [ [ "select.uiValue_select.inputFieldSelect" ],
            ],
          ],
        ],
      ],
      this,
      appendTo
    );

    
    // ( [ ".uiElement.inputFieldElement.displayFlex.spaceBetween",
    //     [ [ ".inputFieldLabel", "@"+this.data.displayName,
    //         ,
    //       ],
    //     ],
    //   ],
    //   this,
    //   appendTo
    // );

    // this.uiElement    =
    //     $("<div />",
    //       { "class": "inputFieldElement"
    //       }
    //     );
    //   var uiLabel =
    //     $("<div />",
    //       { "class": "inputFieldLabel"
    //       }
    //     ).text(this.data.displayName);

        //  .append(this.data.displayFieldAddress);

    // var select = $("<select />", {"class": "inputFieldSelect"});
    this.uiValue_select.data("ModelInputField", this);
    this.uiValue_select.on("change", this, this.inputField_select_changeFunction);
    $.each(fieldData.selectableValues,
                function(optionText, optionValue)
                { var selectOption = $("<option class='inputFieldSelectOption'value='"+optionValue+"'>"+optionText+"</option>");
                  if (fieldData.defaultValue == optionValue)
                  { selectOption.attr("selected", "selected");
                  }
                  This.uiValue_select.append(selectOption);
                }
          )

    // this.uiValue_select = select;

    // this.uiElement.append(uiLabel);
    // this.uiElement.append(this.uiValue_select);

    return this.uiElement;
  }
  this.ModelFieldInput.prototype.inputField_select_changeFunction = function(event)
  { console.debug(this);
    console.debug(event);
    var This  = $(this).data("ModelInputField");
    This = event.data;

    This.data.currentValue = $(this).val();

    This.inputFieldAltered();
  }
  this.ModelFieldInput.prototype.getTag_text = function(passThrough, appendTo)
  {   var fieldData = this.data;
      O.create
      ( [ ".uiElement.inputFieldElement.displayFlex.spaceBetween",
          [ [ ".inputFieldLabel", "@"+this.displayName],
            [ "input.uiValue_text.inputFieldText"+".unit_"+this.data.unit ],
          ],
        ],
        this,
        null
      );

      // this.uiElement    =
      //   $("<div />",
      //     { "class": "inputFieldElement"
      //     }
      //   );
      // var uiLabel =
      //   $("<div />",
      //     { "class": "inputFieldLabel"
      //     }
      //   ).append(this.simpleNameUnits);
      //   //  .append(this.data.displayFieldAddress);
      // var uiValue_text =
      //   $("<input />",
      //     { "class": "inputFieldText",
      //       type: "text",
      //     }
      //   ).addClass("unit_"+this.data.unit);

      
      this.uiValue_text.val(unitsAroundOutput( this, fieldData.defaultValue ));
      this.uiValue_text.data("thisEquals.modelField", this);

      this.uiValue_text.on("change", this.inputField_text_changeFunction);

    return this.uiElement
  }
  this.ModelFieldInput.prototype.inputField_text_changeFunction = function(event)
  { var This  = $(this).data("thisEquals.modelField");
    This      = event.data;

    This.data.currentValue = $(this).val();
    setImmediate
    ( function()
      { This.inputFieldAltered(This);
      }
    );
  }
  this.ModelFieldInput.prototype.getTag_slider = function(passThrough, appendTo)
  { var sliderOptions             = this["slider_"+this.data.rangeType+"SliderOptions"]();
    sliderOptions["orientation"]  = "horizontal",
    sliderOptions["animate"]      = "fast",
    sliderOptions["range"]        = "min"

    O.create
    ( [ ".inputFieldElement.inputField.displayInlineBlock.width100",
        [ [ ".inputFieldLabel.floatLeft.smallCaps", "@"+this.data.displayName ],
          [ ".slideAndValue",
            [ [ $("<input type='text' class='uiValue_slider inputFieldText' />"), ],
              [ ".uiSlider.inputFieldSlider", ],
            ],
          ],
        ],
      ],
      traverse(this, "display"),
      null
    );

    this.display.uiSlider.slider(sliderOptions);
    this.display.uiSlider.data("thisEquals.modelField", this);

    this.display.uiValue_slider.val(unitsAroundOutput(this, this.data.defaultValue));
    this.display.uiValue_slider.data("thisEquals.modelField", this);

    return this.display.inputFieldElement;
  }
  this.ModelFieldInput.prototype.slider_linearSliderOptions = function()
  { console.debug("linear");
    var fieldData = this.data;
    var This = this;
    var sliderOptions =
      { max: fieldData.rangeTop,
        min: fieldData.rangeBottom,
        value: fieldData.currentValue,
        step: (fieldData.rangeTop - fieldData.rangeBottom) / 200.0,
        slide: function(event, ui)
          {
            This.currentValue = ui.value;
            This.slider_sliderUpdatesText;
        },
        change: function(event, ui)
          { if (! event.originalEvent) return true;
            This.currentValue = ui.value;
            This.slider_sliderUpdatesText;
            This.inputFieldAltered(This);
        }
      };
    return sliderOptions;
  }
  this.ModelFieldInput.prototype.slider_logSliderOptions  = function()
  { console.debug("log");
    var fieldData = this.data;
    var max = fieldData.rangeTop
    var halfMax = max / 2;
    var min = fieldData.rangeBottom;
    var maxv = Math.log(max);
    var minv = Math.log(min);

    this.logSliderConstants =
      { minv: minv,
        min:  min,
        // calculate adjustment factor
        scale: (maxv-minv) / (halfMax-min)
      };

    var This = this;
    var sliderOptions =
      { max: halfMax,
        min: min,
        value: this.actualToSlider(fieldData.currentValue),
        slide: function(event, ui)
          { This.data.currentValue = This.logSliderToValue(ui.value);
            This.slider_sliderUpdatesText();
          },
        change: function(event, ui)
          { if (! event.originalEvent) return true;

            This.data.currentValue = This.logSliderToValue(ui.value);
            This.slider_sliderUpdatesText();

            This.inputFieldAltered(This);
          }
      };

    return sliderOptions;
  }
  this.ModelFieldInput.prototype.logSliderToValue = function(sliderValue)
  { lSC = this.logSliderConstants;
    return Math.exp(lSC.minv + lSC.scale * (sliderValue-lSC.min));
  }

  this.ModelFieldInput.prototype.actualToSlider = function()
  { var currentValue = this.data.currentValue;
    
    var toReturn;
    if (this.hasOwnProperty("logSliderConstants") )
    { var lSC = this.logSliderConstants;
      toReturn = (Math.log(currentValue)-lSC.minv) / lSC.scale + lSC.min;
    }
    else
    { toReturn = currentValue;
    }
    return toReturn;
  }

  this.ModelFieldInput.prototype.slider_ifaUpdatesCurrentValue = function(newValue)
  { this.slider_sliderUpdatesText();
    this.slider_userUpdatesText();
  }
  this.ModelFieldInput.prototype.slider_userUpdatesText = function()
  { this.display.uiSlider.slider("option", "value", this.actualToSlider());
    // if (! this.display.uiValue_slider.is(":focus") )
    // { this.display.uiValue_slider.val(this.prettyPrint(this.data.currentValue));
    // }
  }
  this.ModelFieldInput.prototype.slider_sliderUpdatesText = function(slideOrChange)
  { if (this.data.hasOwnProperty("fieldPrecisionFunction") )
    { var currentValue = this.data.currentValue;
      eval(this.data.fieldPrecisionFunction);
    }
    else
    { toReturn = thisEqualsThat.standardPrecision( Number(this.data.currentValue) );
    }
    this.display.uiValue_slider.val(unitsAroundOutput(this, toReturn));
  }

  this.ModelFieldOutput = function(modelInstance, fieldData)
  { this.modelInstance  = modelInstance;
    this.data           = fieldData;
    this.fullAddress    = this.data.fullAddress;
    modelInstance.outputFields[this.fullAddress.toString()] = this;
  }
  
  
  this.ModelFieldOutput.prototype.getDropDownItem = function(appendTo)
  { var outputFieldSelectButton = {};
    O.create
        ( ["button.dropdownItem.modelFieldOutput.btn.displayFlex.width100.spaceBetween", 
            [ [ ".buttonText", "@" + this.data.displayName ],
              [ "span.modelClassIndicator", 
                [ [ ".square20" , "img.createConstructImage.centerBackgroundImage"  ], 
                  [ "span"      , "@"+this.data.modelClass            ],
                ],
              ],
              // [ "span.modelFieldInputIndicator",
              //   [ [ ".square20", "img.modelField.centerBackgroundImage" ], 
              //     [ "span", "@"+this.data.name ],
              //   ],
              // ],
            ],
          ],
          outputFieldSelectButton,
          appendTo
        );
       // $("<option />",
       //    { value: this.fullAddress,
       //      text:  "Calculate: "+this.data.displayFieldAddress
       //    }
       //  );
    if (this.data.defaultOutputField == true)
    { if (this.data['fullAddress'].indexOf(",") == -1)
      { outputFieldSelectButton.dropdownItem.toggleClass("selected", true);
        this.modelInstance.lastAlteredOutputField = this;
      }
    }
    outputFieldSelectButton.dropdownItem.data("thisEquals.modelFieldOutput", this);
    this.display = outputFieldSelectButton;
    return outputFieldSelectButton;
  }

  this.ModelFieldVisualisation = function(modelInstance, fieldData)
  { this.modelInstance  = modelInstance;
    this.data           = fieldData;
    this.fullAddress    = this.data.fullAddress;
    modelInstance.visualisationFields[this.fullAddress.toString()] = this;
  }
  this.ModelFieldVisualisation.prototype.getChooseVisualisationFieldDropDownItem = function()
  { var visualisationFieldOption =
       $("<option />",
          { value: "__selectVisualisationField",
            text:  "__selectVisualisationField"
          }
        );
    visualisationFieldOption.data("thisEqualsVisualisationField", this);
    return visualisationFieldOption;
  }
  this.ModelFieldVisualisation.prototype.getDropDownItem = function(appendTo)
  { var visualisationFieldSelectButton = {};
    O.create
        ( ["button.dropdownItem.modelFieldVisualisation.btn.displayFlex.width100.spaceBetween", 
            [ [ ".buttonText", "@" + this.data.displayName ],
              [ "span.modelClassIndicator", 
                [ [ ".square20" , "img.createConstructImage.centerBackgroundImage"  ], 
                  [ "span"      , "@"+this.modelInstance.modelClass.name            ],
                ],
              ],
              // [ "span.modelFieldInputIndicator",
              //   [ [ ".square20", "img.modelField.centerBackgroundImage" ], 
              //     [ "span", "@"+this.data.name ],
              //   ],
              // ],
            ],
          ],
          visualisationFieldSelectButton,
          appendTo
        );
       // $("<option />",
       //    { value: this.fullAddress,
       //      text:  "Calculate: "+this.data.displayFieldAddress
       //    }
       //  );
    if (this.data.defaultVisualisationField == true)
    { if (this.data['fullAddress'].indexOf(",") == -1)
      { visualisationFieldSelectButton.dropdownItem.toggleClass("selected", true);
        this.modelInstance.lastAlteredVisualisationField = this;
      }
    }
    visualisationFieldSelectButton.dropdownItem.data("thisEquals.ModelFieldVisualisation", this);
    this.display = visualisationFieldSelectButton;
    return visualisationFieldSelectButton;

    // var visualisationFieldOption =
    //    $("<option />",
    //       { value: this.fullAddress,
    //         text:  this.data.displayFieldAddress
    //       }
    //     );
    // if (this.data.defaultVisualisationField == true)
    // { if (this.data['fullAddress'].indexOf(",") == -1)
    //   { visualisationFieldOption.attr("selected", "selected");
    //     this.modelInstance.lastAlteredVisualisationField = this;
    //   }
    // }
    // visualisationFieldOption.data("thisEqualsVisualisationField", this);
    // return visualisationFieldOption;
  }


  this.ComponentCookieManager = function()
  { this.context = {};
  }
  this.ComponentCookieManager.prototype.register = function(componentName, expires=null, domain=null, path=null)
  { var componentCookieName = "visual.tools."+componentName;

    var defaultCookieSettings;
    try
    { defaultCookieSettings = JSON.parse(Cookies.get(componentCookieName+".defaultCookieSettings") ) || {};
    }
    catch (e)
    { defaultCookieSettings = {};
    }

    var localContext = this.context[componentName] = 
        { "componentCookieName":    componentCookieName,
          "userPermissionGranted" : Cookies.get(componentCookieName) || false,
        };
    
    var parameterDefaults =
        { "expires": 3650,
          "domain": null,
          "path": null,
        };
    for (parameterName in parameterDefaults )
    { eval
      ( `if (${parameterName} !== null) 
          defaultCookieSettings.${parameterName} = ${parameterName}
        ` 
      );
      if (defaultCookieSettings[parameterName] == null) 
        defaultCookieSettings[parameterName] = parameterDefaults[parameterName];
    }

    Cookies.set(componentCookieName+".defaultCookieSettings", JSON.stringify(defaultCookieSettings) );
    localContext.defaultCookieSettings = defaultCookieSettings;


    var This = this;

    var toReturn =
      function(cookieName, value)
      { return This.cookie(componentName, cookieName, value);
      };

    return toReturn;
  }
  this.ComponentCookieManager.prototype.cookie = function(componentName, cookieName, value=null)
  { var localContext        = this.context[componentName];
    var componentCookieName = localContext.componentCookieName;

    if (value !== null)
    { if (localContext.userPermissionGranted == false)
      { localContext.userPermissionGranted = window.confirm("The component "+componentName+" has requested to store cookies on this device");

        Cookies.set(componentCookieName, true, localContext.defaultCookieSettings);
        Cookies.set(componentCookieName+".defaultCookieSettings", localContext.defaultCookieSettings);
      } 
      if (localContext.userPermissionGranted)
      { Cookies.set(componentCookieName+"."+cookieName, value, localContext.defaultCookieSettings);
        return true;
      }
      else
      { return false;
      }
    }
    else
    { return Cookies.get(componentCookieName+"."+cookieName, localContext.defaultCookieSettings);
    }
  }

  this.IFAQueue = function(modelInstance)
  { this.modelInstnace = modelInstance;
    this.state = "ready";
  }
  this.IFAQueue.prototype.ready = function()
  { return this.state == "ready";
  }
  this.IFAQueue.prototype.enqueueItem = function(parameters)
  { if (this.ready())
    { this.modelInstance.inputFieldAltered(      );
    }
  }
}



$().ready(
  function()
  { window.ThisEqualsThat = new thisEqualsThat.oop();

    ThisEqualsThat.init();
  }
);

// $().ready(function()
// {
//     $("body").append($("<div class='chat' />").html(
// `Visual Tools : Pre-launch, Alpha release 0.6<br />
// <br />
// Visuals for your minds’aye :)<br />
// <br />
// Visualisation and data modelling tools<br />
// For communication, learning and fun <br />
// <br />
// For anyone interested in communicating information in visual form. <br />
// A cutting edge toolkit for when you would like to create information rich visuals.<br />
// <br />
// (For us, a visual tool is something that helps us unlock our understanding of something through a visual channel.)<br />
// <br />
// If you have a specific task in mind, or are interested explore and play around. Click on the menu icon, top left corner of this webpage, and have a play with our set of dynamic data visualisation blueprints. <br />
// <br />
// See how much coal you would need to burn to power x many lightbulbs, show amounts of money, numbers of particles, numbers of trees etc..<br />
// <br />
// Toolkit is in Alpha phase - the core behavior is solid, but there are a few (ONE!) glitches, and the interface is not yet as we want it, but we feel it is good enough to give people a sense of what could and can be done with data modelling and visualisation, and open up our development process to a wider community. Only select group of people have been invited to review and contribute. <br />
// <br />
// (For legal purposes, the toolkit should be considered for entertainment only at this stage. Quality assurance protocols are in development. <br />
// <br />
// Over about 5 years a data modelling toolkit has been twice fully rewritten and many, many times refined.  People have put time and effort into developing a set of data modelling and visualisation blueprints that people can use to stimulate engagement with important data that might otherwise be ignored completely or poorly presented.<br />
// <br />
// The tools are being developed with hope to support effective public engagement with important issues. There will soon be a proper forum as part of a website - for sharing of thoughts, data models, images and dynamic visualisation blueprints. Making it as easy as possible for easy, integrated design, data modelling and communications channels. Spreadseet hookup (googlesheets / socrata) and T= data modelling environment are already plugged in to the visual tools, but in the alpha release spreadsheet integration is not activated. <br />
// <br />
// BETA release coming soon.<br />
// <br />
// <strong>Get in contact:</strong><br />
// We hope to make this toolkit practical and of immediate value to people. <br />
// <br />
// You can use the tools for free if you are not trying to make a financial profit from them. Please get in contact in any event with: <br />
//  <a href='board@thisEquals.net'>board@thisequals.net</a> <br />
//  If you have any feedback, or would like to do some heavy lifting with us -  and further advance the tools get involved; or if you would like to discuss prospects of a commercial license.<br />
// <br />
// ------<br />
// <br />
// Kudos and credit to Christopher Reay and John Kellas for design of the tools. And Nicolas Debessiat for SVG3D and various advices <br />
// <br />
// Love and Respect.<br />
// <br />
// And with thanks to the many people that have helped get it this far. <3
// Full credits page will be released at BETA launch!
// `));

//     // $('body').append('<div class="copyrightContainer"><p>© This Equals ltd 2016</div></p>')
//     //          .append('<div class="open-menu"></div>');
//     // $('body').append('<button class="hamburger hamburger--spin-r" type="button" aria-label="Menu" aria-controls="navigation"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>');

//     $.fn.coloPick = function() {
//         console.info('CP created');
//         $('input.unit_rgb').colorpicker({
//             inline: false,
//             alpha: false,
//             colorFormat: "RGB",
//             buttonClass: 'btn',
//             color: 'rgb(123,45,67)',
//             altField: 'input.colorPickerInput',
//             close: function(){
//                 $('input.unit_rgb').change();
//             }
//         });
//     };

//   }
// );

// function closeMenu(b, m, w, o) {
//   b.removeClass('open');
//   m.removeClass('is-active');
//   w.removeClass('active');
//   o.removeClass('active');
// }

// function showMenu(b, w, o) {
//   b.addClass('open');
//   w.addClass('active');
//   o.addClass('active');
// }


// ThisEqualsThat.display.hamburger.on('click', function() {

    //     var menuBtn = $(this),
    //         wWidth = $(window).outerWidth(),
    //         openMenu = $('.open-menu'),
    //         menuWrap = $('.modelClasses'),
    //         menuItemList = $('#modelClassUL'),
    //         modelClassLI = $('.modelClassLI'),
    //         body = $('body');

    //     menuBtn.toggleClass('is-active');

    //     modelClassLI.on('dblclick', function() {
    //         closeMenu(body, menuBtn, menuWrap, openMenu);
    //     });

    //     if (wWidth <= 768) {
    //         modelClassLI.on('click', function() {
    //             closeMenu(body, menuBtn, menuWrap, openMenu);
    //         });
    //     }

    //     if (menuBtn.hasClass('is-active')) {

    //         showMenu(body, menuWrap, openMenu);

    //         openMenu.on('click', function() {
    //             closeMenu(body, menuBtn, menuWrap, openMenu);
    //         });

    //     } else {
    //         closeMenu(body, menuBtn, menuWrap, openMenu);
    //     }

    // });




// displayIntoTarget = function
// display.customSVGPane =
      //   $("<div />",
      //     { "class": "customSVGPane makeDraggable customSVGList"
      //     }
      //   );
      //   // display.customSVGPane.append(
      //   //   $("<div class='customSVGPaneTitle'>Get SVG from File</div>"));
      //   display.customSVGTitle =
      //     $("<input />",
      //        { "class" : 'custom_svgNameInput',
      //          "type"  : 'file',
      //          'placeholder' : 'Get SVG from File',
      //          'accept' : 'image/svg+xml'
      //        }
      //       );
      //   display.customSVGPane.append(display.customSVGTitle);

      //   display.customSVGPane.append(
      //     $("<div />",
      //         { "class" : 'customSVGPaneSubmitButton btn'
      //       }
      //     ).on("click", function(event)
      //       { var svgFile = $('input.custom_svgNameInput').val();

      //        if( svgFile === "" || svgFile === undefined){
      //          alert('.svg file not uploaded!');
      //        } else {
      //          alert(svgFile + ' ' + 'uploaded');
      //        }
      //         console.log($('input.custom_svgNameInput').val());
      //       }
      //     )
      //   );
      //   var referenceSVGSelectListContainer = $("<div class='referenceSVGSelectListContainer' />");
      //   referenceSVGSelectListContainer.append(thisEqualsThat.scene.referenceVisual.svgSelectList.clone().show());
      //   display.customSVGPane.append(referenceSVGSelectListContainer);
      //   display.customSVGPane.on("click", ".referenceSVGSelectListItem",
      //       function(clickEvent)
      //       { var selectedDiv = $(clickEvent.currentTarget)
      //         var fileHandle = selectedDiv.attr("thisequals_filehandle");
      //         if (This.userSelectedReferenceSVG == fileHandle)
      //         { This.userSelectedReferenceSVG = "";
      //           // $(this).find(".referenceSVGSelectListItem").toggleClass("userSelectedReferenceSVG_selected", false);

      //         }
      //         else
      //         { This.userSelectedReferenceSVG = fileHandle;
      //           // $(this).find(".referenceSVGSelectListItem").toggleClass("userSelectedReferenceSVG_selected", false);
      //           // selectedDiv.toggleClass("userSelectedReferenceSVG_selected");
      //         }
      //         This.displayCurrentOutput()

      //       }
      //   );

      //   display.modelCustomSvg.append(display.customSVGPane);
      //   display.modelOutputCtrl.append(display.bottomModelSelectDiv);

      //   display.googleConnect =
      //   $("<div />",
      //     { "class": "customSVGPane googleConnect makeDraggable"
      //     }
      //   ).draggable().css({
      //     'position' : 'absolute',
      //     'top'      : '104%',
      //     'left'     : '0',
      //     'right'    : '0'
      //   });

      //   var wWidth = $(window).outerWidth();
      //   if ( wWidth <= 768 )
      //   {
      //     display.googleConnect.draggable('disable')
      //                          .css({
      //                            'opacity': '1',
      //                            'filter' : 'Alpha(Opacity=100)'
      //                          });
      //     display.topModelDiv.append(display.googleConnect);
      //   }
      //   else
      //   {
      //     display.modelSvgOutput.append(display.googleConnect);
      //   }

      //   display.googleConnect.append(
      //     $("<div class='customSVGPaneTitle'>googleConnect</div>"));
      //   display.googleConnect_email=
      //     $("<input />",
      //        { "class" : 'custom_svgNameInput',
      //          "placeholder" : 'Placeholder text'
      //        }
      //     )
      //     .val(Cookies.get("TET.googleConnect.email"))
      //     .on("change", function(){Cookies.set("TET.googleConnect.email", display.googleConnect_email.val(), {"expires": 9999})})
      //     ;
      //   display.googleConnect.append(display.googleConnect_email);

      //   display.googleConnect_loginButton =
      //       $("<a class='googleConnect_loginButton'>Login to Google</a>")
      //       .on("click",
      //           function()
      //           { var pollingComplete       = false;
      //             var googleConnect_window  = false;
      //             var emailAddress = display.googleConnect_email.val();
      //             (function poll()
      //                 { $.ajax(
      //                   { "url": "/googleConnect/gotCredentials",
      //                     "type": "POST",
      //                     "data": {"emailAddress": emailAddress},

      //                     "success": function(data)
      //                     { console.log("polling", data);
      //                       if (googleConnect_window == false)
      //                       { googleConnect_window = PopupCenter("googleConnect/login?emailAddress="+display.googleConnect_email.val()+"", "googleConnect", 400,200);
      //                       }
      //                       else if (data.gotCredentials == true)
      //                       { googleConnect_window.close();
      //                         pollingComplete = true;
      //                       }
      //                     },
      //                     "error": function(jqXHR ,textStatus, errorThrown){debugger;},
      //                     "dataType": "json",
      //                     "complete": function(){console.log("polling status: ", pollingComplete); if (!pollingComplete) setTimeout(poll, 2000)},
      //                     "timeout": 2000,
      //                   });
      //                 }
      //             )();
      //           }
      //        );

      //   display.googleConnect.append(display.googleConnect_loginButton);

      //   display.googleConnect_spreadsheetURL=
      //       $("<input />",
      //        { "class" : 'googleConnect spreadsheetURL'
      //        }
      //       )
      //       .on("change",
      //           function()
      //           { alert("change spreadsheetURL");
      //             var ajaxOptions =
      //                 { "url":  "/googleConnect/getSheets",
      //                   "type": "POST",
      //                   "data": { "emailAddress":   display.googleConnect_email.val(),
      //                             "spreadsheetURL": display.googleConnect_spreadsheetURL.val(),
      //                           },
      //                   "success" :
      //                       function(data)
      //                       { console.log(data);
      //                         display.googleConnect_sheetSelect.empty()
      //                         display.googleConnect_sheetSelect.append($("<option value='Select Sheet'>Select Sheet</option>"));
      //                         $.each
      //                         ( data.sheetNames,
      //                           function(index)
      //                           { display.googleConnect_sheetSelect.append($("<option value='"+index+"'>"+this+"</option>"));
      //                           }
      //                         )
      //                       },
      //                   "dataType": "json",
      //                 }
      //             $.ajax(ajaxOptions);
      //           }
      //       );
      //   display.googleConnect.append(display.googleConnect_spreadsheetURL);

      //   display.googleConnect_sheetSelect =
      //       $("<select />",
      //        { "class" : 'googleConnect spreadsheetURL'
      //        }
      //       );
      //   display.googleConnect.append(display.googleConnect_sheetSelect);

      //   display.googleConnect_cellRange =
      //       $("<input />",
      //         { "class": 'googleConnect cellRange',
      //         }
      //       )
      //   display.googleConnect.append(display.googleConnect_cellRange);

      //   display.googleConnect_requestRangeData =
      //       $("<a />",
      //         { "class": "googleConnect requestRangeData"
      //         }
      //       ).text("Request Range Data")
      //       .on
      //       ( "click",
      //         function()
      //         { alert("request range data");
      //             var ajaxOptions =
      //                 { "url":  "/googleConnect/getCellRange",
      //                   "type": "POST",
      //                   "data": { "emailAddress":   display.googleConnect_email.val(),
      //                             "spreadsheetURL": display.googleConnect_spreadsheetURL.val(),
      //                             "sheetName":      display.googleConnect_sheetSelect.val(),
      //                             "cellRange":      display.googleConnect_cellRange.val(),
      //                           },
      //                   "success" :
      //                       function(data)
      //                       { console.log(data);
      //                         // debugger;

      //                         var dataRow     = data.cellRangeData.values[0];
      //                         var colorRow    = data.cellRangeData.backgrounds[0];
      //                         var columnCount = dataRow.length;
      //                         ratioString     = dataRow.join("|");
      //                         colorChangeString =
      //                             $.map
      //                             ( colorRow,
      //                               function(hex, i)
      //                               { rgb = hexToRgb(hex);
      //                                 return "rgb("+(rgb.r-125)+","+(rgb.g-125)+","+(rgb.b-125)+")";
      //                               }
      //                             );
      //                         colorChangeString = colorChangeString.join("|");
      //                         This.inputFields['["colors"]'].uiValueText.val(colorChangeString);
      //                         This.inputFields[ '["ratios"]'].uiValueText.val(ratioString)      ;

      //                         var alterField = This.inputFields['["colors"]'];
      //                         This.inputFieldAltered(
      //                         { inputField: alterField.fullAddress,
      //                           newValue:   alterField.uiValueText.val()
      //                         },
      //                         function()
      //                         { var alterField = This.inputFields['["ratios"]'];
      //                           This.inputFieldAltered(
      //                               { inputField: alterField.fullAddress,
      //                                 newValue:   alterField.uiValueText.val()
      //                               }
      //                           )
      //                         },
      //                         true
      //                         );
      //                       },
      //                   "dataType": "json",
      //                 }
      //             $.ajax(ajaxOptions);
      //         }
      //       );
      //   display.googleConnect.append(display.googleConnect_requestRangeData)

          // on("click", function(event)
          //   { var ajaxOptions =
          //         { "url": "/googleConnect/login",
          //           "data": {"emailAddress": display.googleConnect_email.val()},
          //           "dataType": "json",
          //           "method": "POST",
          //           "success": function(data, a, b)
          //                         { debugger;
          //                           console.log(data);
          //                         }
          //         };
          //     $.ajax(ajaxOptions);
          //   }
          // )
        // );
        //thisEqualsThat.scene.modelContainerDiv.append(display.customSVGPane);