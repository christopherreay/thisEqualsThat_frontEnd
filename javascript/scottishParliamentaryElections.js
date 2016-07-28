window.thisEqualsThat = {};
thisEqualsThat.graphicLoadVersion = "0.0.0.3.addedGroupParentToConstituencyMap"

thisEqualsThat.svg = {};
thisEqualsThat.svgStore = {};

window.attachFunc = function(parent, name, functionContent)
{ if (!(hasOwnProperty(parent.prototype, name)))
  { var This = parent;
    parent.prototype[name] = functionContent;
  }
  return parent.prototype[name];
}
function PopupCenter(url, title, w, h) 
{ // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft  = window.screenLeft != undefined ? window.screenLeft  : screen.left;
  var dualScreenTop   = window.screenTop  != undefined ? window.screenTop   : screen.top;

  var width   = window.innerWidth   ? window.innerWidth   : document.documentElement.clientWidth  ? document.documentElement.clientWidth : screen.width;
  var height  = window.innerHeight  ? window.innerHeight  : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  var left  = ((width  / 2) - (w / 2)) + dualScreenLeft;
  var top   = ((height / 2) - (h / 2)) + dualScreenTop;
  var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

  // Puts focus on the newWindow
  if (window.focus) {
      newWindow.focus();
  }
  return newWindow;
}
thisEqualsThat.oop = function()
{ this.ThisEqualsThatScene = function(displayContainerDiv)
  { this.displayContainerDiv = displayContainerDiv;
    this.thisEqualsScene =       
      $("<div />",
      { "class": "thisEqualsScene"
      }
      );
    this.modelClassesContainerDiv = 
      $("<div />",
      { "class": "modelClasses"
      }
      );
    this.modelContainerDiv =
      $("<div />",
      { "class": "model"
      }
      );
    this.thisEqualsScene.append(this.modelClassesContainerDiv);
    this.thisEqualsScene.append(this.modelContainerDiv);
    this.displayContainerDiv.append(this.thisEqualsScene);
    
    this.referenceVisual = new ThisEqualsThat.ReferenceVisual();
    
    this.modelClasses = new ThisEqualsThat.ModelClasses(this);
  }
  this.ThisEqualsThatScene.prototype.setCurrentModel = function(modelInstance)
  { if (this.hasOwnProperty("currentModel"))
    { this.currentModel.hide();
    }
    this.currentModel = modelInstance.displayIntoTarget(thisEqualsThat.scene.modelContainerDiv);
  }
  
  this.ModelClasses = function(thisEqualsThatScene)
  { this.thisEqualsThatScene = thisEqualsThatScene;
    var This = this;
    var ajaxOptions = 
    { url: "getModelClasses",
      dataType: "json",
      success: function(data, status, request)
      { console.log(data, status, request);
        $.each(data, function(index, value)
          { This[value] = new ThisEqualsThat.ModelClass(value);
          }
        );
        This.display(This.thisEqualsThatScene)
      },
    };
    $.ajax(ajaxOptions);
  }
  this.ModelClasses.prototype.display = function(thisEqualsThatScene)
  { var modelClassesContainerDiv = thisEqualsThatScene.modelClassesContainerDiv;
    var modelClassList = 
      $("<ul/>",
        { id: "modelClassUL",
        }
      ).on("click", ".modelClassLI", 
          function(event) 
          { var modelClass = $(event.currentTarget).data("modelClass");
            console.log(modelClass);
            modelClass.getModelInstance(thisEqualsThat.scene.setCurrentModel);
          }
        );
    $.each( this,
      function (modelClassName, modelClass)
      { modelClassList.append(modelClass.modelClassListLI);
      }
    );
    modelClassesContainerDiv.append(modelClassList);
  }

  this.ModelClass = function(modelClassName)
  { this.name = modelClassName;
    this.imageURL = this.imageBaseURL+modelClassName+".jpg";
    this.modelClassListLI = 
      $("<li />", 
        { "class": "modelClassLI"
        }
       ).data("modelClass", this)
       .append($("<img />", { src: this.imageURL } ));
  }
  this.ModelClass.prototype.imageBaseURL =  "/graphics/thisEquals/modelClasses/";
  this.ModelClass.prototype.getModelInstance = function(successFunction)
  { if (this.hasOwnProperty("modelInstance"))
    { successFunction(this.modelInstance);
    }
    else
    { var This = this;
      var ajaxOptions = 
      { url: "getClassInstance",
        data: { modelClassName: this.name},
        success: function(data, status, request)
        { console.log(data, status, request);
          This.modelInstance = new ThisEqualsThat.ModelInstance(this, data[0]);
          This.modelInstance.modelPosition = "top";
          successFunction(This.modelInstance);
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
  }
  
  //REFERENCE VISUAL
  this.ReferenceVisual = function()
  { var This = this;
    this.svgStore = {};
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
              console.log("referenceVisual:" + referenceSVGData.fileHandle, importedNode);
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
  }
  this.ModelInstance.prototype.getFieldData = function(fieldAddress)
  { console.log("ModelInstance.getFieldData", fieldAddress);
    return this.data.fields[fieldAddress];
  }
  this.ModelInstance.prototype.getInputFields = function()
  { if (! this.hasOwnProperty("inputFieldData"))
    { var This = this;
      this.inputFieldData = {};
      this.inputFieldsSliders = $("<div />",     
             { 
             }
             ) ;
      this.inputFieldsSliders.on("change", ".inputFieldText", 
          this.inputFieldText_changed);
      this.inputFieldNames = [];
      $.each(
        this.data.fields, 
        function(fieldNameString, value)
        { value['fullAddress'] = fieldNameString
          This.inputFieldNames.append(fieldNameString);
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
  this.ModelInstance.prototype.getInputFieldsSelect = function(inputFieldSelectFunction)
  { if (! this.hasOwnProperty("inputFieldSelectList"))
    { var This = this.getInputFields();
      var inputFieldsSelect = $("<select/>", {"class": "inputFieldsSelect"});
      $.each(
        This.inputFieldNames,
        function(fieldNameString)
        { inputFieldsSelect.append($("<option/>"), {"value": fieldNameString, "text": fieldNameString});
        }
      );
      this.inputFieldSelectList = inputFieldSelect;
    }
    toReturn = $.clone(this.inputFieldsSelectList);
    // toReturn.on("change", inputFieldsSelectFunction);
    return toReturn

  }
  this.ModelInstance.prototype.inputFieldText_changed = function()
  { $this = $(this);
    var modelField = $(this).data("thisEquals.modelField");
    $modelField = $(modelField)
    modelField.uiSlider.data("thisEquals.disableWriteToTextField", true);
    modelField.uiSlider.slider("value", modelField.actualToSlider(modelField.uiValueText.val()));
    $modelField.data("thisEquals.oldValue", modelField.uiValueText.val());
    console.log($(modelField).data("thisEquals.oldValue"));

    modelField.modelInstance.inputFieldAltered(
              { inputField: modelField.fullAddress, 
                newValue:   modelField.uiValueText.val()
              });
  }
  this.ModelInstance.prototype.getOutputFields = function()
  { if (! this.hasOwnProperty("outputFieldData"))
    { var This = this;
      this.outputFieldData = {};
      this.outputFieldsSelect = 
          $("<select />"
          ).on(
            "change", 
            function(event)
            { console.log("outputFieldSelect ChangeEvent: ", event);
              selectedField = $(event.currentTarget.selectedOptions[0]).data("thisEqualsOutputField");
              This.lastAlteredOutputField = selectedField;
              This.inputFieldAltered(
                { outputField: selectedField.fullAddress
                }, 
                function(data, status, request)
                { This.setChoosableFields(data);
                }
              );
              
            }
          );
      /*This.outputFieldsSelect.append
      ( ThisEqualsThat.ModelFieldOutput.prototype.getChooseOutputFieldDropDownItem()
      );
      */
      this.outputFieldsSelect.append($("<option selected='selected' value=''>Select Output</option>"));
      $.each(
        this.data.fields,
        function(index, value)
        { if (value["outputField"] == true)
          { console.log("modelInstance: outputField: ", This, value);
            var outputField = new ThisEqualsThat.ModelFieldOutput(This, value);
            This.outputFieldData[value.toString()] = 
                outputField;
            This.outputFieldsSelect.append(outputField.getDropDownItem());
          }
        }
      );
    }
    return this;
  }

  this.ModelInstance.prototype.getVisualisationFields = function()
  { if (! this.hasOwnProperty("visualisationFieldData"))
    { var This = this;
      this.visualisationFieldData = {};
      this.visualisationFieldsSelect = 
          $("<select />"
          ).on(
            "change", 
            function(event)
            { console.log("visualisationFieldSelect ChangeEvent: ", event);
              selectedField = $(event.currentTarget.selectedOptions[0]).data("thisEqualsVisualisationField");
              This.lastAlteredVisualisationField = selectedField;
              This.inputFieldAltered(
                { visualisationField: selectedField.fullAddress
                }, 
                function(data, status, request)
                { //process SVG Datastuff;
                }
              );
              
            }
          );
      /*This.visualisationFieldsSelect.append
      ( ThisEqualsThat.ModelFieldVisualisation.prototype.getChooseVisualisationFieldDropDownItem()
      );
      */
      this.visualisationFieldsSelect.append($("<option value=''>Select Visualisation</option>"));
      $.each(
        this.data.fields,
        function(index, value)
        { if (value["visualisationField"] === true)
          { console.log("modelInstance: visualisationField: ", This, value);
            var visualisationField = new ThisEqualsThat.ModelFieldVisualisation(This, value);
            This.visualisationFieldData[value.toString()] = 
                visualisationField;
            This.visualisationFieldsSelect.append(visualisationField.getDropDownItem());
          }
        }
      );
    }
    //for Chaining of ModelInstance
    return this;
  }

  this.ModelInstance.prototype.inputFieldAltered = function(fieldChangeData, successFunction)
  { var This = this;
    fieldChangeData	= $.extend({modelInstanceID: this.id}, fieldChangeData);
    var ajaxOptions = 
      { url: "inputFieldAltered",
        dataType: "json",
        data: fieldChangeData,
        success: function (data, status, request)
        { console.log(data);
          This.lastAlteredOutputField.data.currentValue = data.newValue;
          This.lastAlteredVisualisationField.data.currentValue = data.svg3dDisplayJSON.svgFieldValue;
          This.svg3dDisplayJSON = data.svg3dDisplayJSON;
          This.displayCurrentOutput()
          if (    This.bottomModelInstance && data.bottomModelData 
              &&  This.bottomModelInstance.lastAlteredOutputField && This.bottomModelInstance.lastAlteredOutputField.data)
          { This.bottomModelInstance.lastAlteredOutputField.data.currentValue = data.bottomModelData.newValue
            This.bottomModelInstance.lastAlteredVisualisationField.data.currentValue = data.bottomModelData.svg3dDisplayJSON.svgFieldValue;
            This.bottomModelInstance.svg3dDisplayJSON = data.bottomModelData.svg3dDisplayJSON
            This.bottomModelInstance.displayCurrentOutput()
          }
          if (successFunction)
            successFunction(data, status, request);
        }
      };
    console.log(ajaxOptions);
    $.ajax(ajaxOptions);
  }
  this.ModelInstance.prototype.processInputFieldAlteredResponse = function(data)
  { this.lastAlteredOutputField.data.currentValue = data.newValue;
    this.lastAlteredVisualisationField.data.currentValue = data.svg3dDisplayJSON.svgFieldValue;
    this.svg3dDisplayJSON = data.svg3dDisplayJSON;
    this.displayCurrentOutput();
  }
  this.ModelInstance.prototype.setChoosableFields = function(data, status, response)
  { var currentOutputField = data.currentOutputField
    if (! this.hasOwnProperty("choosableFields"))
      this.choosableFields = {};
    var choosableFields = this.choosableFields;
    var currentOutputFieldName = data.lastAlteredOutput.toString();
    if (! choosableFields.hasOwnProperty(currentOutputFieldName))
    { choosableFields[currentOutputFieldName] = data.choosableFields;
    }
    var bottomModelLinkFieldList = choosableFields[currentOutputFieldName];
    if (! bottomModelLinkFieldList.hasOwnProperty("select"))
    { bottomModelLinkFieldList.select = $("<select />");
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
    console.log(topModelInstance.bottomModelInstance);
  }
  this.ModelInstance.prototype.displayIntoTarget = function(targetContainer)
  { if (! this.hasOwnProperty("display"))
    { This = this;
      this.display = {};
      var display = this.display;
      //var inputs = "inputs"
      //var outputsText = "outputs"
      display.displayElement = 
        $("<div />",
          { "id"    : "modelInstanceDiv."+this.modelClass+"."+this.id
          }
        );

      display.modelSliders          = $("<div class='modelSliders'      />");
      display.modelSliders.append(this.getInputFields().inputFieldsSliders);
          
      
      display.modelOutputDisplay        = $("<div class='modelOutputContainer'><div class='containerLabel'>Output</div></div>");
      
      display.modelOutputValue          = $("<div class='modelOutputValue'  />");
      display.outputFieldsSelect        = this.getOutputFields().outputFieldsSelect;
      display.modelOutputDisplay.append(display.modelOutputValue);
      display.modelOutputDisplay.append(display.outputFieldsSelect);


      display.visualisationOutputContainer       = $("<div class='visualisationOutputContainer'><div class='containerLabel'>Visualisation</div></div>");

      display.modelVisualisationValue   = $("<div class='modelVisualisationValue'  />");
      display.visualisationFieldsSelect = this.getVisualisationFields().visualisationFieldsSelect;
      display.visualisationOutputContainer.append(display.modelVisualisationValue);
      display.visualisationOutputContainer.append(display.visualisationFieldsSelect);
        
      display.svgOutput             = $("<div class='svgOutput'     />");
      display.svgSaveLink           = $("<div class='svgSaveLink'   />");
      display.svgTextInput          = $("<input type='text' class='svgTextDescription' />");
      display.svgModelRoot          = $("<div class='svgModelRoot'  />");              
      display.referenceSVG          = $("<div class='referenceSVG'  />");
      var containerSVG        = document.createElementNS(d3.ns.prefix.svg, "svg");
      $(containerSVG)
          .attr("xmlns",        "http://www.w3.org/2000/svg")
          .attr("xmlns:xlink",  "http://www.w3.org/1999/xlink")
          .attr("xmlns:z",      "http://debeissat.nicolas.free.fr/svg3d/svg3d.rng")
          .attr("id",           "svgHTMLElement_"+this.id)
          .attr("width",        "100%")
          .attr("height",       "100%")
          .attr("z:xInfinite",  "50")
          .attr("z:yInfinite",  "100")
          .attr("z:zRatio",     "5");
      
      var svgTextDescription          = d3.select(containerSVG)     .append("text").attr("id", "svgTextDescription_"+this.id).text("Enter Text Description").node();
      display.svgTextDescription      = svgTextDescription;
      
      //display.svgTextDescription.text("Hello World");
      var svgTranslatableG            = d3.select(containerSVG)     .append("g").attr("id", "svgTranslatableG_" +this.id) .node();
      display.svgTranslatableG        = svgTranslatableG;
      var svgHeightAxis               = d3.select(svgTranslatableG) .append("g").attr("id", "svgHeightAxis_"+this.id).node();
      display.svgHeightAxis           = svgHeightAxis;
      
      var svgVisualisationG           = d3.select(svgTranslatableG) .append("g").attr("id", "svgVisualisationG_"+this.id) .node();
      var svgReferenceGContainer      = d3.select(svgTranslatableG) .append("g").attr("id", "svgReferenceG_"    +this.id) .node();
      display.svgVisualisationG       = svgVisualisationG;
      display.svgReferenceGContainer  = svgReferenceGContainer;
      display.containerSVG            = containerSVG;
          
      display.svgOutput.append(display.svgModelRoot);
      display.svgOutput.append(display.svgSaveLink);
      display.svgOutput.append(display.svgTextInput);
      display.svgTextInput.on("change", function() { d3.select(display.svgTextDescription).text($(this).val()); This.svg_createSaveLink(This);});
      display.svgModelRoot.append(containerSVG);
      //display.svgOutput.append(display.referenceSVG);

      display.toggleFeatures = $("<div id='toggleFeatures_"+This.id+"' class='colorControl' />");
      display.toggle =
        { "axes":                 $("<input id  = 'toggle_axes_"  + This.id + "' type='checkbox'  checked='checked'    title='Show / Hide Axes'/>"),
          "axes.label":           $("<label/>").text("Axes"),
          "axes.changeEvent"  : 
              function(changeEvent)
              { $(display.svgHeightAxis).toggle();
                This.svg_createSaveLink(This);
              },
          "svgReferenceG":        $("<input id  = 'toggle_svgReferenceG_"   + This.id + "' type='checkbox'   checked='checked'   title='Show / Hide Frame of Reference'/>"),
          "svgReferenceG.label":  $("<label/>").text("Reference SVG"),
          "svgReferenceG.changeEvent":
              function(changeEvent)
              { $(display.svgReferenceG).toggle();
                This.svg_createSaveLink(This);
              },
          "svgTextDescription":        $("<input id  = 'toggle_svgTextDescription_"   + This.id + "' type='checkbox'   checked='checked'   title='Show / Hide Frame of Reference'/>"),
          "svgTextDescription.label":  $("<label/>").text("Text Description"),
          "svgTextDescription.changeEvent":
              function(changeEvent)
              { $(display.svgTextDescription).toggle();
                This.svg_createSaveLink(This);
              },
        };
      var controlList = ["axes", "svgReferenceG", "svgTextDescription"];
      for (var name of controlList)
      { display.toggle[name].on("change", display.toggle[name+".changeEvent"]);
        display.toggle[name].appendTo(display.toggle[name+".label"]);
        display.toggleFeatures.append(display.toggle[name+".label"]);
      }

      display.colorControl = $("<div id='colorControl_" + This.id + "' class='colorControl' />");
      display.ccSelector   = $("<input id='ccSelector_" + This.id + "' type='text'      title='# for id, . for class'/>");
      display.ccColor      = $("<input id='ccColor_"    + This.id + "' type='text'      title='yellow, red, or rgb(255,255,255) or rgba(255,255,255,1.0)'/>");
      display.ccSubmit     = $("<input id='ccSubmit_"   + This.id + "' type='submit'    />");
      display.ccSubmit.on("click", 
          function() 
          { $(containerSVG).find(display.ccSelector.val()).css("fill", display.ccColor.val())
          }
      );
      display.ccRandomiseColors = $("<input id='ccRandomise_"   + This.id + "' type='button' value='Random'/>");
      display.ccRandomiseColors.on("click",
          function()
          { $(svgVisualisationG).find("path")
                .each(  function()
                    { var colorRGB  = $(this).css("fill"); 
                      if (colorRGB == null)
                        colorRGB = "rgb(50, 50, 50)";
                      if (colorRGB.indexOf("rgb") === 0)
                      { var rgb       = colorRGB.match(/^rgb[a]?\((\d+),\s*(\d+),\s*(\d+)[,]?\s*(\d*[.]?\d*)\)$/);
                        r = Number(rgb[1]);
                        newR = Math.round(Math.max((((Math.random()* 10.0) - 5) ) + r, 0));
                        g = Number(rgb[2]);
                        newG = Math.round(Math.max((((Math.random()* 10.0) - 5) ) + g, 0));
                        b = Number(rgb[3]);
                        newB = Math.round(Math.max((((Math.random()* 10.0) - 5) ) + b, 0));
                        if (4 in rgb && rgb[4] != "")
                          newRGB = "fill: rgba("+newR+", "+newG+", "+newB+", "+rgb[4]+");";
                        else
                          newRGB = "fill: rgb("+newR+", "+newG+", "+newB+");"
                        //$(this).css("fill", newRGB);
                        //newStyle = this.getAttribute("style");
                        //if (newStyle)+newRGB;
                        this.setAttribute("style", newRGB);
                      }
                    }
                )
            This.svg_createSaveLink(This);
          }
      );
      display.ccRandomiseColorsByGroup = $("<input id='ccRandomiseGroup_"   + This.id + "' type='button' value='Random Group'/>");
      display.ccRandomiseColorsByGroup.on("click",
          function()
          { $(svgVisualisationG).find("g")
                .each(  function()
                    { 
                        
                        var changeR = Math.round((((Math.random()* 10.0) - 5) ));
                        var changeG = Math.round((((Math.random()* 10.0) - 5) ));
                        var changeB = Math.round((((Math.random()* 10.0) - 5) ));
                        
                        //$(this).css("fill", newRGB);
                        //newStyle = this.getAttribute("style");
                        //if (newStyle)+newRGB;
                        $(this).find("path").each(function()
                        {   var colorRGB  = $(this).css("fill");
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
                        )
                    }
                )
            This.svg_createSaveLink(This);
          }
      );
      display.ccRandomisePosition = $("<input id='ccRandomisePosition_"   + This.id + "' type='button' value='Random Position'/>");
      display.ccRandomisePosition.on("click",
          function()
          { $(svgVisualisationG).find("g")
                .each(  function()
                    { var gBBox = this.getBBox();
                      var maxXChange = gBBox.width  / 80;
                      var maxYChange = gBBox.height / 80;

                      var changeX = (((Math.random()* maxXChange * 2) - maxXChange) );
                      var changeY = (((Math.random()* maxYChange * 2) - maxYChange) );

                      var transform = this.getAttribute("transform");
                      if (transform === null)
                      { transform = "translate(0 0)";
                      }
                      var translate = transform.match(/^translate\(([-]?\d+[.]?\d*)\s*([-]?\d+[.]?\d*)\)$/);
                      var newX = Number(translate[1]) + changeX;
                      var newY = Number(translate[2]) + changeY;
                      var newTranslate = "translate("+newX+" "+newY+")";
                      this.setAttribute("transform", newTranslate);
                      //console.log(this, transform);
                    }
                )
            This.svg_createSaveLink(This);
          }
      );

      $(display.ccColor).colorpicker(
        { "alpha": true,
          "colorFormat": "RGBA",
          "select": function() 
              { $(containerSVG).find(display.ccSelector.val()).css("fill", display.ccColor.val());
                This.svg_createSaveLink(This);
              },
          //"parts": ["header", "map", "alpha", "bar"],
          //"draggable": true,
          //"position": $(display.ccColor).position({"my": "bottom right", "at": "bottom right", "of": $(window)})
          "inline": true
        });

      display.colorControl.append(display.ccSelector);
      display.colorControl.append(display.ccColor);
      display.colorControl.append(display.ccSubmit);
      display.colorControl.append(display.ccRandomiseColors);
      display.colorControl.append(display.ccRandomiseColorsByGroup);
      display.colorControl.append(display.ccRandomisePosition);


      display.bottomModelSelectDiv  = $("<div class='bottomModelSelectDiv bottomModelSelectDiv."+this.id+"' />");
      display.bottomModelDiv        = $("<div class='bottomModelDiv' />");

       
      var d = display.displayElement;

      display.topModelDiv = $("<div class='modelInstance topModelDiv modelInstance'"+this.modelPosition+" />");

      display.topModelDiv.append(display.modelSliders);
      display.topModelDiv.append(display.modelOutputDisplay);
      display.topModelDiv.append(display.bottomModelSelectDiv);
      display.visualisationOutputContainer.append(display.svgOutput);
      display.topModelDiv.append(display.visualisationOutputContainer);
      display.topModelDiv.append(display.toggleFeatures);
      display.topModelDiv.append(display.colorControl);
      
      d.append(display.topModelDiv);
      d.append(display.bottomModelDiv);
      

      targetContainer.append(this.display.displayElement);
      //display.bottomModelDiv = sceneContainer;
      


      //display.displayElement.append(display.textOutputLabel);
      // addOutdatafieldDiv
      //display.displayElement.append(display.OutputElement);
      display.customSVGPane =
        $("<div />",
          { "class": "customSVGPane makeDraggable"
          }          
        ).draggable().css("position", "absolute").css("right", "-100px");
        display.customSVGPane.append(
          $("<div class='customSVGPaneTitle'>Get SVG from File</div>"));
        display.customSVGTitle = 
          $("<input />",
             { "class" : 'custom_svgNameInput'
             }
            );
        display.customSVGPane.append(display.customSVGTitle);
          
        display.customSVGPane.append(
          $("<div />",
            { "class" : 'customSVGPaneSubmitButton'
            }
          ).on("click", function(event)
            { 
            }
          )
        );
        var referenceSVGSelectListContainer = $("<div class='referenceSVGSelectListContainer' />");
        referenceSVGSelectListContainer.append(thisEqualsThat.scene.referenceVisual.svgSelectList.clone().show());
        display.customSVGPane.append(referenceSVGSelectListContainer);
        display.customSVGPane.on("click", ".referenceSVGSelectListItem",
            function(clickEvent)
            { var selectedDiv = $(clickEvent.currentTarget) 
              var fileHandle = selectedDiv.attr("thisequals_filehandle");
              if (This.userSelectedReferenceSVG == fileHandle)
              { This.userSelectedReferenceSVG = "";
                // $(this).find(".referenceSVGSelectListItem").toggleClass("userSelectedReferenceSVG_selected", false);
                
              }
              else
              { This.userSelectedReferenceSVG = fileHandle;
                // $(this).find(".referenceSVGSelectListItem").toggleClass("userSelectedReferenceSVG_selected", false);
                // selectedDiv.toggleClass("userSelectedReferenceSVG_selected");
              }
              This.displayCurrentOutput()

            }
        );

        display.topModelDiv.append(display.customSVGPane);

        display.googleConnect = 
        $("<div />",
          { "class": "customSVGPane googleConnect makeDraggable"
          }          
        ).draggable().css("position", "absolute").css("top", "200px").css("right", "-100px");
        display.googleConnect.append(
          $("<div class='customSVGPaneTitle'>googleConnect</div>"));
        display.googleConnect_email= 
          $("<input />",
             { "class" : 'custom_svgNameInput'
             }
            );
        display.googleConnect.append(display.googleConnect_email);
          
        display.googleConnect_loginButton = 
            $("<a class='googleConnect_loginButton'>Login to Google</a>")
            .on("click", 
                function()
                { var pollingComplete = false;
                  var emailAddress = display.googleConnect_email.val();
                  var googleConnect_window = PopupCenter("googleConnect/login?emailAddress="+display.googleConnect_email.val()+"", "googleConnect", 200,200);
                  (function poll() 
                      { $.ajax(
                        { "url": "/googleConnect/gotCredentials",
                          "type": "POST",
                          "data": {"emailAddress": emailAddress},
                          "success": function(data) 
                          { debugger;
                            console.log("polling", data);
                            if (data.gotCredentials == true)
                            { googleConnect_window.close();
                              pollingComplete = true;
                              alert("install stuff");
                            }
                          },
                          "error": function(jqXHR ,textStatus, errorThrown){debugger;},
                          "dataType": "json",
                          "complete": function(){if (!pollingComplete) setTimeout(poll, 2000)},
                          "timeout": 2000,
                        });
                      }
                  )();
                }
             );

        display.googleConnect.append(display.googleConnect_loginButton);

        display.googleConnect_spreadsheetURL= 
            $("<input />",
             { "class" : 'googleConnect spreadsheetURL'
             }
            )
            .on("change", 
                function()
                { var ajaxOptions = 
                      { "url":  "/googleConnect/getSheets",
                        "type": "POST",
                        "data": { "emailAddress":   display.googleConnect_email.val(),
                                  "spreadsheetURL": display.googleConnect_spreadsheetURL.val(),
                                },
                        "success" : function(data){alert(data);},
                        "dataType": "json",
                      }    
                  $.ajax(ajaxOptions);
                }
            );
        display.googleConnect.append(display.googleConnect_spreadsheetURL);

        display.googleConnect_sheetSelect = 
            $("<select />",
             { "class" : 'googleConnect spreadsheetURL'
             }
            );
        display.googleConnect.append(display.googleConnect_sheetSelect);

        display.googleConnect_fieldSpecificationContainer = $("<div/>");
        display.googleConnect_fieldSelect = this.getInputFieldsSelect();



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
        display.topModelDiv.append(display.googleConnect)
    }
    this.display.displayElement.show();
    
    return this;
  }
  this.ModelInstance.prototype.hide = function()
  { this.display.displayElement.hide();
  }
  this.ModelInstance.prototype.displayBottomModel = function()
  { console.log("displayBottomModel");
  }
  this.ModelInstance.prototype.progress_translate3d = function(animation, progress, remainingMs, modelInstance)
  { //console.log(this, This);
    //Place the bottom of the scale axis at the bottom of svgVisualisationG, 10 px to the right
    var internalSize    = modelInstance.display.svgTranslatableG.getBBox();

    aspectScaleRatio = Math.max(internalSize.width, internalSize.height);
    var px20Height   = (aspectScaleRatio / 400.0) * 20;

    svgVisualisationGBBox = modelInstance.display.svgVisualisationG.getBBox();

    svgHeightAxisBBox     = modelInstance.display.svgMeasureY.getBBox();
    svgHeightAxisX        = svgVisualisationGBBox.x + svgVisualisationGBBox.width + (px20Height/2);
    svgHeightAxisY        = svgVisualisationGBBox.y + svgVisualisationGBBox.height - svgHeightAxisBBox.height;

    svgWidthAxisBBox      = modelInstance.display.svgMeasureX.getBBox();
    svgWidthAxisX         = svgVisualisationGBBox.x + svgVisualisationGBBox.width  - svgWidthAxisBBox.width;
    svgWidthAxisY         = svgVisualisationGBBox.y + svgVisualisationGBBox.height + (px20Height/2);
    
    modelInstance.display.svgMeasureAxisY.setAttribute("transform", "translate("+svgHeightAxisX+" "+svgHeightAxisY+")");
    modelInstance.display.svgMeasureAxisX.setAttribute("transform", "translate("+svgWidthAxisX +" "+svgWidthAxisY+")");


    var svgElement      = $(modelInstance.display.containerSVG);
    var externalWidth   = svgElement.css("width");
    var externalHeight  = svgElement.css("height");

    
    modelInstance.display.svgMeasureY_text.setAttribute("font-size", (px20Height * .75) + "px");
    modelInstance.display.svgMeasureY_text.setAttribute("x", (px20Height / 5) + "px");
    modelInstance.display.svgMeasureY.setAttribute("stroke-width", (px20Height) / 10);

    modelInstance.display.svgMeasureX_text.setAttribute("font-size", (px20Height * .75) + "px");
    modelInstance.display.svgMeasureX_text.setAttribute("y", (px20Height *.75) + "px");
    modelInstance.display.svgMeasureX.setAttribute("stroke-width", (px20Height) / 10);

    var internalSize    = modelInstance.display.svgTranslatableG.getBBox();

    aspectScaleRatio = Math.max(internalSize.width, internalSize.height);
    var px20Height   = (aspectScaleRatio / 400.0) * 20;

    var viewBoxString   = internalSize.x        + " " +
                          internalSize.y        + " " +
                          internalSize.width    + " " +
                          (internalSize.height  + px20Height + (px20Height * 0.2));

    //debugLevel1//console.log(viewBoxString);
    svgElement[0].setAttribute("viewBox", viewBoxString);
    
    d3.select(modelInstance.display.svgTextDescription)
        .attr("x", internalSize.x)
        .attr("y", internalSize.y + internalSize.height + px20Height)
        .attr("font-size", (px20Height)+"px");
        //.attr("transform", "scale(")
    

    
    //var modelInstance = $(this).data("thisEqualsThat")["modelInstance"];
    //console.log(modelInstance);
    //modelInstance.display.containerSVG.get()[0].setAttribute("viewBox", "0 0 1024 400");
    //modelInstance.display.containerSVG.get()[0].setAttribute("preserveAspectRatio", "none");
    //d3.select(modelInstance.display.containerSVG).attr("viewbox", "0 0 1024 400").attr("preserveAspectRatio", "none");
    //console.log(modelInstance.display.containerSVG.attr("viewbox", "0 0 1024 400").attr("preserveAspectRatio", "none"));//+This.display.svgTranslatableG.
  }
  this.ModelInstance.prototype.animateSVG = function()
  { var svg3dConfiguration = this.svg3dDisplayJSON.svg3dConfiguration; 
    var This = this;
    
    var svgClonableG = $(this.display.svgClonableG);
    svg3d.sortAlgo = svg3d.ONE_TO_ALL;

    svgClonableG.animate(
        { "svg3d":
             {"clone3d": this.svg3dDisplayJSON.svg3dConfiguration.clone3d}
        }, 
        { "queue"     : this.id,
          "duration"  : 0, 
          "easing"    : "easeInCubic",
          //"progress"  : This.progressCounter,
          "complete"  : function()
              { 

                //Add the Scale Axis to the right hand side of the clone group
                //  hopefully this should deal with position and that by itself
                This.display.svgHeightAxis.innerHTML="";
                This.display.svgMeasureAxisY = d3.select(This.display.svgHeightAxis)     
                    .append("g").attr("id", "svgMeasureAxisY_"+this.id).node();
                This.display.svgMeasureAxisX = d3.select(This.display.svgHeightAxis)     
                    .append("g").attr("id", "svgMeasureAxisX_"+this.id).node();
                var axisBBox = This.display.svgVisualisationG  .getBBox();
                //These threed coordinates do not seem to interact well with the SVG. They are also not translated by the translate3d code
                //var yAxisD = "m"+(axisBBox.x + axisBBox.width + 10)+","+(axisBBox.y)+ ",0 l0,"+axisBBox.height+",0";
                //This is the 2d version so it can be seen
                //var yAxisD = "m"+(axisBBox.x + axisBBox.width + 10)+","+(axisBBox.y)+ "l0,"+axisBBox.height+"";
                var yAxisD = "m0,0 "+ "l  0,"           +axisBBox.height+"";
                var xAxisD = "m0,0 "+ "l"+axisBBox.width+",0";
                //This.display.svgMeasureAxisY.setAttribute("transform", "translate("+(axisBBox.x + axisBBox.width + 10)+ " "+(axisBBox.y)+")");
                //This.display.svgMeasureAxisX.setAttribute("transform", "translate("+(axisBBox.x)+                       " "+(axisBBox.y + axisBBox.height + 10)+")");
                /*This.display.svgMeasureY = document.createElementNS("http://www.w3.org/2000/svg", "path");
                This.display.svgMeasureY.setAttribute("id", "svgMeasureY_"+This.id);
                This.display.svgMeasureY.setAttribute("d", yAxisD);
                This.display.svgMeasureY.setAttribute("stroke", "black");
                This.display.svgMeasureY.setAttribute("z:threeD", "true");
                This.display.svgMeasureAxis.appendChild(This.display.svgMeasureY);
                */
                This.display.svgMeasureY = d3.select(This.display.svgMeasureAxisY)     
                    .append("path")
                        .attr("id", "svgMeasureY_"+this.id)
                        .attr("d", yAxisD)
                        //.attr("z:threeD", "true")
                        .attr("stroke", "darkgrey")
                    .node();
                This.display.svgMeasureY.setAttribute("z:threeD", "true");
                This.display.svgMeasureX = d3.select(This.display.svgMeasureAxisX)     
                    .append("path")
                        .attr("id", "svgMeasureX_"+this.id)
                        .attr("d", xAxisD)
                        //.attr("z:threeD", "true")
                        .attr("stroke", "darkgrey")
                    .node();
                This.display.svgMeasureX.setAttribute("z:threeD", "true");
                
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

                This.display.svgMeasureY_text = d3.select(This.display.svgMeasureAxisY)     
                    .append("text")
                    .attr("id", "svgYAxis_"+this.id)
                    .text(unitNormalisedHeight.toPrecision(3)+heightUnit)
                    .attr("fill", "darkgrey")
                    .attr("font-weight", "bold")
                    .attr("x", 5)
                    .attr("y", (axisBBox.height / 2))
                    .node();

                 This.display.svgMeasureX_text = d3.select(This.display.svgMeasureAxisX)     
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
                $(This.display.svgClonableG).animate(
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
                var svgReferenceGBBox        = This.display.svgReferenceG[0]   .getBBox();
                

                var multiplier          = svgReferenceGBBox.height / ((thisEqualsThat.scene.referenceVisual.currentReferenceSVG.height / This.svg3dDisplayJSON.svgRelativeHighness) * (svgVisualisationGBBox["height"]));
                var svgGroundDifference = svgVisualisationGBBox.y + svgVisualisationGBBox.height - ((svgReferenceGBBox.y+svgReferenceGBBox.height) / multiplier);
                var svgHorizDifference  = svgVisualisationGBBox.x - ((svgReferenceGBBox.x+svgReferenceGBBox.width) / multiplier);
                
                This.display.svgReferenceG.attr("transform", "translate("+svgHorizDifference+" "+svgGroundDifference+") scale("+(1.0/multiplier)+")");
                
                var referenceSVG3dConfiguration = $.extend(true, {}, This.svg3dDisplayJSON.svg3dConfiguration.translate3d);                
                $.extend(referenceSVG3dConfiguration, {"x":referenceSVG3dConfiguration.x * multiplier, "y": referenceSVG3dConfiguration.y * multiplier});
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
                  { This.disable_createSaveLink = true; 
                    console.log(This.svg3dDisplayJSON.postProcessing);
                    var postProcessing  = This.svg3dDisplayJSON.postProcessing;
                    var postProcessingFunctions = {};
                    for (var ccThing in postProcessing)
                    { //var delay         = 2000.0 / postProcessing[ccThing]
                      var ccThingButton = This.display[ccThing];

                      var ccBuild = postProcessingFunctions[ccThing] = {};
                      ccBuild['counter']  = postProcessing[ccThing];

                      for (var counter = 0; counter < ccBuild['counter']; counter ++)
                      { ccThingButton.trigger("click");
                      }
                    } 
                    

                    if ("recolourClones" in This.svg3dDisplayJSON.svg3dConfiguration)
                    { //var clones                  = $(This.display.svgVisualisationG).find("> g:nth-child(n + 2)");
                      var clones                  = $(This.display.svgVisualisationG).data("svg3dclones");
                      var cloneCount              = clones.length;
                      var clonesNotChosenCount    = cloneCount;
                      var clonesNotChosenMemoise  = Array.apply(null, Array(cloneCount)).map(function (_, i) {return i;});

                      
                      var recolourClones = This.svg3dDisplayJSON.svg3dConfiguration.recolourClones;
                      
                      var randomLayout   = recolourClones[0].randomLayout == "Yes";
                      var ratios         = recolourClones[0].ratios;
                      var colours        = recolourClones[0].colours;
                      if (ratios.length != colours.length) debugger;
                      ratioCount         = ratios.length;
                      

                      for (var ratioCounter = 0; ratioCounter < ratioCount; ratioCounter ++)
                      { var clonesToChange  = [];

                        var ratio           = ratios [ratioCounter];
                        var changeColour    = colours[ratioCounter];

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
                          cloneToChangeCount --;
                          clonesToChange.push(clones[changeThisClone]);
                        }
                        

                        var changeRGB = changeColour.match(/^rgb[a]?\(([-]?\d+),\s*([-]?\d+),\s*([-]?\d+)[,]?\s*(\d*[.]?\d*)\)$/);
                        var changeR   = Number(changeRGB[1]);
                        var changeG   = Number(changeRGB[2]);
                        var changeB   = Number(changeRGB[3]);      

                        $.each( clonesToChange,
                              function()
                              { $(this).find("path").each(function()
                                {   var colorRGB  = $(this).css("fill");
                                    if (colorRGB == null)
                                      colorRGB = "rgb(50, 50, 50)";
                                    if (colorRGB.indexOf("rgb") === 0)
                                    { var rgb       = colorRGB.match(/^rgb[a]?\((\d+),\s*(\d+),\s*(\d+)[,]?\s*(\d*[.]?\d*)\)$/);
                                      var r = Number(rgb[1]);
                                      var newR = Math.min(Math.max(r + changeR, 0), 255);
                                      var g = Number(rgb[2]);
                                      var newG = Math.min(Math.max(g + changeG, 0), 255);
                                      var b = Number(rgb[3]);
                                      var newB = Math.min(Math.max(b + changeB, 0), 255);
                                      if (4 in changeRGB && changeRGB[4] != "")
                                        var newRGB = "fill: rgba("+newR+", "+newG+", "+newB+", "+rgb[4]+");";
                                      else
                                        var newRGB = "fill: rgb("+newR+", "+newG+", "+newB+");"
                                      this.setAttribute("style", newRGB);
                                    }
                                }
                                )
                              }
                            );
                      }
                                            
                    }
                    This.disable_createSaveLink = false;
                    This.svg_createSaveLink(This);
                  }
                }
                );



                This.display.svgClonableG.dequeue(This.id);
                This.display.svgReferenceG.dequeue(This.id);

                var svgVisualisationGBBox   = This.display.svgVisualisationG  .getBBox();
                var svgReferenceGBBox       = This.display.svgReferenceG[0]   .getBBox();
                

                var multiplier              = svgReferenceGBBox.height / ((thisEqualsThat.scene.referenceVisual.currentReferenceSVG.height / This.svg3dDisplayJSON.svgRelativeHighness) * (svgVisualisationGBBox["height"]));
                var svgGroundDifference     = svgVisualisationGBBox.y + svgVisualisationGBBox.height - ((svgReferenceGBBox.y+svgReferenceGBBox.height) / multiplier);
                var svgHorizDifference      = svgVisualisationGBBox.x - ((svgReferenceGBBox.x+svgReferenceGBBox.width) / multiplier);
                
                This.display.svgReferenceG.attr("transform", "translate("+svgHorizDifference+" "+svgGroundDifference+") scale("+(1.0/multiplier)+")");

                    
              }
       	}
    );
    svgClonableG.dequeue(this.id);
    svgClonableG.hide();
  }
  this.ModelInstance.prototype.svg_createSaveLink = function(This) 
  { if (This.disable_createSaveLink == true)
      console.log("svg_createSaveLink disabled");
    else
    { console.log("svg_createSaveLink", This);
      var savableContainerSVG  =  $(This.display.containerSVG).clone();
      savableContainerSVG
          .attr("width",          This.display.svgModelRoot.css("width"))
          .attr("height",         This.display.svgModelRoot.css("height"));
      
      This.display.svgSaveLink.html(
          $(  "<a href-lang='image/svg+xml'"
                + " href      ='data:image/svg+xml,\n" 
                    + savableContainerSVG.get(0).outerHTML + "'"
                + " title     ='svgRep.svg'"
                + " download  ='" + This.display.modelOutputValue.text() + ".svg'"
            + ">Click to Save SVG</a>"
          )
      );
    }
  };
  /*this.ModelInstance.prototype.progress_translate3d = function(animation, progress, remainingMs)
  { console.log(this.getBBox());
    console.log(this);
    var modelInstance = $(this).data("thisEqualsThat")["modelInstance"];
    //modelInstance.display.containerSVG.get()[0].setAttribute("viewBox", "0 0 1024 400");
    //modelInstance.display.containerSVG.get()[0].setAttribute("preserveAspectRatio", "none");
    //d3.select(modelInstance.display.containerSVG).attr("viewbox", "0 0 1024 400").attr("preserveAspectRatio", "none");
    //console.log(modelInstance.display.containerSVG.attr("viewbox", "0 0 1024 400").attr("preserveAspectRatio", "none"));//+This.display.svgTranslatableG.
  }*/
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
          //var svgReferenceVisual  = $(thisEqualsThat.scene.referenceVisual.getSVGData(This.svg3dDisplayJSON.svgRelativeHighness)).clone();
          //svgReferenceVisual.appendTo(This.display.svgReferenceG);
          //$(svgReferenceVisual).attr("transform", "scale(0.2)");
          
          console.log("importSVG file", importedRootG);
          thisEqualsThat.svgStore[svgFileName] = $(importedRootG);
          
          This.appendSVGToDisplay();
          This.animateSVG();
        }
      )
    }
    else
    { This.appendSVGToDisplay();
      This.animateSVG()
    }
                
    var gTET = thisEqualsThat;
    //$("#document").append("<script type='text/javascript' src='/svg/rg1024_metal_barrel' />);
    
    this.display.modelOutputValue.html
    ( outputField.data.displayFieldAddress.toString()+": "+outputField.data.unitPrefix+Number(outputField.data.currentValue).toPrecision(5)+outputField.data.unitSuffix
    );
    this.display.modelVisualisationValue.html
    ( visualisationField.data.displayFieldAddress.toString()+": "+visualisationField.data.unitPrefix+Number(visualisationField.data.currentValue).toPrecision(5)+visualisationField.data.unitSuffix
    );
  }
  this.ModelInstance.prototype.appendSVGToDisplay = function()
  { this.display.svgClonableG = thisEqualsThat.svgStore[this.svg3dDisplayJSON.svgFile].clone();
    $(this.display.svgVisualisationG).html(this.display.svgClonableG);
    if (this.userSelectedReferenceSVG)
    { this.display.svgReferenceG = $(thisEqualsThat.scene.referenceVisual.getSVGDataByName(this.userSelectedReferenceSVG)).clone();  
    }
    else
    { this.display.svgReferenceG = $(thisEqualsThat.scene.referenceVisual.getSVGData(this.svg3dDisplayJSON.svgRelativeHighness)).clone();
    }
    
    $(this.display.svgReferenceGContainer).html(this.display.svgReferenceG);
    
    var tG = this.display.svgTranslatableG[0];
    $(tG).data("thisEqualsThat", {"modelInstance": this});
  }
  
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
    this.data           = data;
    modelInstance.inputFields[data.fullAddress] = this;
  }
  
  this.ModelFieldInput.prototype.getTag = function()
  { if (! this.hasOwnProperty("uiElement"))
    { this["getTag_"+this.data.fieldType](); 
    }
    return this.uiElement;
  }
  this.ModelFieldInput.prototype.getTag_select = function()
  { var fieldData = this.data;
    
    this.uiElement    = 
        $("<div />", 
          { "class": "inputFieldElement"
          }
        );
      var uiLabel =
        $("<div />",
          { "class": "inputFieldLabel"
          }
         ).append(this.data.displayFieldAddress);
 
    var select = $("<select />", {"class": "inputFieldSelect"});
    select.data("ModelInputField", this);
    select.on("change", this, this.inputField_select_changeFunction);
    $.each(fieldData.selectableValues, 
                function(optionText, optionValue)
                { var selectOption = $("<option class='inputFieldSelectOption'value='"+optionValue+"'>"+optionText+"</option>");
                  if (fieldData.defaultValue == optionValue)
                  { selectOption.attr("selected", "selected");
                  }
                  select.append(selectOption);
                }
          )

    this.uiSelect = select;
    this.uiElement.append(uiLabel);

    this.uiElement.append(select);
    
    return this.uiElement;
  }
  this.ModelFieldInput.prototype.inputField_select_changeFunction = function(event)
  { console.debug(this);
    console.debug(event);
    var This  = $(this).data("ModelInputField");
    This = event.data;
    
    This.modelInstance.inputFieldAltered(
    { inputField: This.fullAddress, 
      newValue:   This.uiSelect.val()
    });
  }
  this.ModelFieldInput.prototype.getTag_text = function()
  {   var fieldData = this.data;
      
      this.uiElement    = 
        $("<div />", 
          { "class": "inputFieldElement"
          }
        );
      var uiLabel =
        $("<div />",
          { "class": "inputFieldLabel"
          }
         ).append(this.data.displayFieldAddress);
      var uiValueText =
        $("<input />",
          { "class": "inputFieldText",
            type: "text",
          }
        );
      uiValueText.val(fieldData.defaultValue);
      uiValueText .data("thisEquals.modelField", this);
      
      uiValueText.on("change", this, this.inputField_text_changeFunction);
      this.uiValueText  = uiValueText;

      this.uiElement.append(uiLabel);
      this.uiElement.append(uiValueText);

    return this.uiElement
  }
  this.ModelFieldInput.prototype.inputField_text_changeFunction = function(event)
  { var This  = $(this).data("ModelInputField");
    This = event.data;
    
    This.modelInstance.inputFieldAltered(
    { inputField: This.fullAddress, 
      newValue:   This.uiValueText.val()
    });
  }
  this.ModelFieldInput.prototype.getTag_slider = function()
  { var fieldData = this.data;

      var sliderOptions = this["slider_"+fieldData.rangeType+"SliderOptions"](); 
      sliderOptions["orientation"] = "vertical"
      console.debug("sliderOptions", sliderOptions);
      
      this.uiElement    = 
        $("<div />", 
          { "class": "inputFieldElement"
          }
        );
      var uiLabel =
        $("<div />",
          { "class": "inputFieldLabel"
          }
         ).append(this.data.displayFieldAddress);
      var uiValueText =
        $("<input />",
          { "class": "inputFieldText",
            type: "text",
          }
        );      
      var uiSlider =
        $("<div />",
          { "class": "inputFieldSlider"
          }
        ).slider(sliderOptions);
      uiSlider    .data("thisEquals.modelField", this);
      
      uiValueText.val(fieldData.defaultValue);
      uiValueText .data("thisEquals.modelField", this);
      
      this.uiValueText  = uiValueText;
      this.uiSlider     = uiSlider;

      this.uiElement.append(uiLabel);
      this.uiElement.append(uiValueText);
      this.uiElement.append(uiSlider);

    return this.uiElement
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
            This.updateValueText();
        },
        change: function(event, ui)
          { This.currentValue = ui.value;
            This.updateValueText();
            
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
          { This.currentValue = This.sliderToActual(ui.value);
            This.updateValueText(slideOrChange="slide");
          },
        change: function(event, ui)
          { This.currentValue = This.sliderToActual(ui.value);
            This.updateValueText("change");
          }
      };
    
    return sliderOptions;
  }
  this.ModelFieldInput.prototype.sliderToActual = function(sliderValue)
  { lSC = this.logSliderConstants;
    return Math.exp(lSC.minv + lSC.scale * (sliderValue-lSC.min));
  }
  this.ModelFieldInput.prototype.actualToSlider = function(actual)
  { lSC = this.logSliderConstants;
    return (Math.log(actual)-lSC.minv) / lSC.scale + lSC.min;
  }
  this.ModelFieldInput.prototype.setValueFromActual = function(actual)
  { this.currentValue = actual;
    this.updateValueSlider();
    this.updateValueText(); 
  }
  this.ModelFieldInput.prototype.updateValueSlider = function()
  { this.uiSlider.value(this.actualToSlider(currentValue));
  }
  this.ModelFieldInput.prototype.updateValueText = function(slideOrChange)
  { $this = $(this);
    $uiValueText = $(this.uiValueText);
    if (this.uiSlider.data("thisEquals.disableWriteToTextField") == true)
      this.uiSlider.data("thisEquals.disableWriteToTextField", false);
    else
    { $uiValueText.val(Number(this.currentValue).toPrecision(5));
      if (slideOrChange == "change" || slideOrChange == "")
        $uiValueText.change();
    }
    
    console.log(this.fullAddress, this.currentValue);
  }

  this.ModelFieldOutput = function(modelInstance, fieldData)
  { this.modelInstance  = modelInstance;
    this.data           = fieldData;
    this.fullAddress    = this.data.fullAddress;
    modelInstance.outputFields[this.fullAddress.toString()] = this;
  }
  this.ModelFieldOutput.prototype.getChooseOutputFieldDropDownItem = function()
  { var outputFieldOption = 
       $("<option />",
          { value: "__selectOutputField",
            text:  "__selectOutputField"
          }
        );
    outputFieldOption.data("thisEqualsOutputField", this);
    return outputFieldOption;
  }
  this.ModelFieldOutput.prototype.getDropDownItem = function()
  { var outputFieldOption = 
       $("<option />",
          { value: this.fullAddress,
            text:  this.data.displayFieldAddress
          }
        );
    if (this.data.defaultOutputField == true)
    { if (this.data['fullAddress'].indexOf(",") == -1)
      { outputFieldOption.attr("selected", "selected");
        this.modelInstance.lastAlteredOutputField = this;
      }
    }
    outputFieldOption.data("thisEqualsOutputField", this);
    return outputFieldOption;
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
  this.ModelFieldVisualisation.prototype.getDropDownItem = function()
  { var visualisationFieldOption = 
       $("<option />",
          { value: this.fullAddress,
            text:  this.data.displayFieldAddress
          }
        );
    if (this.data.defaultVisualisationField == true)
    { if (this.data['fullAddress'].indexOf(",") == -1)
      { visualisationFieldOption.attr("selected", "selected");
        this.modelInstance.lastAlteredVisualisationField = this;
      }
    }
    visualisationFieldOption.data("thisEqualsVisualisationField", this);
    return visualisationFieldOption;
  }
}
ThisEqualsThat = new thisEqualsThat.oop();
/*
thisEqualsThat.display = 
{ modelClassSelector: function()
  { console.log("display.modelClassSelector");
    var modelClassesDiv = $("#modelClassesDiv");
    var modelClassList = 
      $("<ul/>",
        { id: "modelClassUL",
        }
      ).on("click", ".modelClassLI", 
          function(event) 
          { var modelClass = $(event.currentTarget).data("modelClass");
            console.log(modelClass);
            modelClass.getModelInstance(thisEqualsThat.display.topModel);
          }
        );
    $.each( thisEqualsThat.modelClasses,
      function (modelClassName, modelClass)
      { modelClassList.append(modelClass.modelClassListLI);
      }
    );
    modelClassesDiv.append(modelClassList);
  },
  topModel: function(modelInstance)
  { modelInstance.display($("#topModelDisplayDiv"));
  },
  modelInstance: 
  { getSliders: function(modelInstance)
    { inputFieldData = modelInstance.getInputFields();
      $.each(
        inputFieldData,
        function(index, value)
        { console.log(index, value);
        }
      );
    }
  }
  
}

thisEqualsThat.SVG = function()
{ this.cloner = function(svgGroupTagToClone, settings)
  { var nX = settings.numberX;
    var nY = settings.numberY;
    var nZ = settings.numberZ;
    
    
    
    for (nZ = 0; nZ < settings.numberZ; nZ++)
    { while (nY >= 0)
      { nY--;
        while (nX >= 0)
        { nX--;
          
          
        }
      }
    }    
  }
  this.clonerDefaults =
  { numberX: 1,
    numberY: 1,
    numberZ: 1,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0
  }
}
*/

$().ready(
  function()
  { 
    // frameBuffer = $("<div style='display: hidden'>");
  //   frameBuffer.appendTo($(document.body));
    //thisEqualsThat.scene = new ThisEqualsThat.ThisEqualsThatScene($("#thisEqualsThatSceneDiv"));

    scottishParliamentaryElections = {};




    scottishParliamentaryElections.ModelFieldInput = function(modelInstance, data)
    { console.log(modelInstance, data);
      this.modelInstance  = modelInstance;
      this.fullAddress    = data.fullAddress;
      this.data           = data;
      modelInstance.inputFields[data.fullAddress] = this;
    }
    
    scottishParliamentaryElections.ModelFieldInput.prototype.getTag = function()
    { if (! this.hasOwnProperty("uiElement"))
      { this["getTag_"+this.data.fieldType](); 
      }
      return this.uiElement;
    }
    scottishParliamentaryElections.ModelFieldInput.prototype.getTag_select = function()
    { var fieldData = this.data;
      
      this.uiElement    = 
          $("<div />", 
            { "class": "inputFieldElement"
            }
          );
        var uiLabel =
          $("<div />",
            { "class": "inputFieldLabel"
            }
           ).append(this.data.displayFieldAddress);
   
      var select = $("<select />", {"class": "inputFieldSelect"});
      select.data("ModelInputField", this);
      select.on("change", this, this.inputField_select_changeFunction);
      $.each(fieldData.selectableValues, 
                  function(optionText, optionValue)
                  { var selectOption = $("<option class='inputFieldSelectOption'value='"+optionValue+"'>"+optionText+"</option>");
                    if (fieldData.defaultValue == optionValue)
                    { selectOption.attr("selected", "selected");
                    }
                    select.append(selectOption);
                  }
            )

      this.uiSelect = select;
      this.uiElement.append(uiLabel);

      this.uiElement.append(select);
      
      return this.uiElement;
    }
    scottishParliamentaryElections.ModelFieldInput.prototype.inputField_select_changeFunction = function(event)
    { console.debug(this);
      console.debug(event);
      var This  = $(this).data("ModelInputField");
      This = event.data;
      
      This.modelInstance.inputFieldAltered(
      { inputField: This.fullAddress, 
        newValue:   This.uiSelect.val()
      });
    }
    scottishParliamentaryElections.ModelFieldInput.prototype.getTag_text = function()
    {   var fieldData = this.data;
        
        this.uiElement    = 
          $("<div />", 
            { "class": "inputFieldElement"
            }
          );
        var uiLabel =
          $("<div />",
            { "class": "inputFieldLabel"
            }
           ).append(this.data.displayFieldAddress);
        var uiValueText =
          $("<input />",
            { "class": "inputFieldText",
              type: "text",
            }
          );
        uiValueText.val(fieldData.defaultValue);
        uiValueText .data("thisEquals.modelField", this);
        
        uiValueText.on("change", this, this.inputField_text_changeFunction);
        this.uiValueText  = uiValueText;

        this.uiElement.append(uiLabel);
        this.uiElement.append(uiValueText);

      return this.uiElement
    }
    scottishParliamentaryElections.ModelFieldInput.prototype.inputField_text_changeFunction = function(event)
    { var This  = $(this).data("ModelInputField");
      This = event.data;
      
      This.modelInstance.inputFieldAltered(
      { inputField: This.fullAddress, 
        newValue:   This.uiValueText.val()
      });
    }

    scottishParliamentaryElections.ModelFieldInput.prototype.getTag_slider = function()
    { var fieldData = this.data;

        var sliderOptions = this["slider_"+fieldData.rangeType+"SliderOptions"](); 
        sliderOptions["orientation"] = "horizontal"
        console.debug("sliderOptions", sliderOptions);
        
        this.uiElement    = 
          $("<div />", 
            { "class": "inputFieldElement"
            }
          );
        var uiLabel =
          $("<div />",
            { "class": "inputFieldLabel"
            }
           ).append(this.data.displayFieldAddress);
        var uiValueText =
          $("<input />",
            { "class": "inputFieldText",
              type: "text",
            }
          );      
        var uiSlider =
          $("<div />",
            { "class": "inputFieldSlider"
            }
          ).slider(sliderOptions);
        uiSlider    .data("thisEquals.modelField", this);
        
        uiValueText.val(fieldData.defaultValue);
        uiValueText .data("thisEquals.modelField", this);
        
        this.uiValueText  = uiValueText;
        this.uiSlider     = uiSlider;

        this.uiElement.append(uiLabel);
        this.uiElement.append(uiValueText);
        this.uiElement.append(uiSlider);

      return this.uiElement
    }

    scottishParliamentaryElections.ModelFieldInput.prototype.slider_linearSliderOptions = function()
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
              This.updateValueText();
          },
          change: function(event, ui)
            { This.currentValue = ui.value;
              This.updateValueText();
              
          }
        };
      return sliderOptions;
    }
    scottishParliamentaryElections.ModelFieldInput.prototype.slider_logSliderOptions  = function()
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
            { This.currentValue = This.sliderToActual(ui.value);
              This.updateValueText(slideOrChange="slide");
            },
          change: function(event, ui)
            { This.currentValue = This.sliderToActual(ui.value);
              This.updateValueText("change");
            }
        };
      
      return sliderOptions;
    }
    scottishParliamentaryElections.ModelFieldInput.prototype.sliderToActual = function(sliderValue)
    { lSC = this.logSliderConstants;
      return Math.exp(lSC.minv + lSC.scale * (sliderValue-lSC.min));
    }
    scottishParliamentaryElections.ModelFieldInput.prototype.actualToSlider = function(actual)
    { lSC = this.logSliderConstants;
      return (Math.log(actual)-lSC.minv) / lSC.scale + lSC.min;
    }
    scottishParliamentaryElections.ModelFieldInput.prototype.setValueFromActual = function(actual)
    { this.currentValue = actual;
      this.updateValueSlider();
      this.updateValueText(); 
    }
    scottishParliamentaryElections.ModelFieldInput.prototype.updateValueSlider = function()
    { this.uiSlider.value(this.actualToSlider(currentValue));
    }
    scottishParliamentaryElections.ModelFieldInput.prototype.updateValueText = function(slideOrChange)
    { $this = $(this);
      $uiValueText = $(this.uiValueText);
      if (this.uiSlider.data("thisEquals.disableWriteToTextField") == true)
        this.uiSlider.data("thisEquals.disableWriteToTextField", false);
      else
      { $uiValueText.val(Number(this.currentValue).toPrecision(5));
        if (slideOrChange == "change" || slideOrChange == "")
          $uiValueText.change();
      }
      
      console.log(this.fullAddress, this.currentValue);
    }


    function camelCase(str) 
    {  return str.replace(/[^A-Za-z0-9]/g, ' ').replace(/^\w|[A-Z]|\b\w|\s+/g, function (match, index) {
            if (+match === 0 || match === '-' || match === '.' ) {
                return ""; // or if (/\s+/.test(match)) for white spaces
            }
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }

    function output(inp) {
     var pre = document.createElement('pre');
     pre.innerHTML = inp;
     return pre
    }

    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    SVGElement.prototype.getTransformToElement = 
    SVGElement.prototype.getTransformToElement || function(elem)
    { 
      return elem.getScreenCTM().inverse().multiply(this.getScreenCTM()); 
    };


    var getMetrics = scottishParliamentaryElections.getMetrics =  function(el) 
    {  function pointToLineDist(A, B, P) {
            var nL = Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));
            return Math.abs((P.x - A.x) * (B.y - A.y) - (P.y - A.y) * (B.x - A.x)) / nL;
        }

        function dist(point1, point2) {
            var xs = 0,
                ys = 0;
            xs = point2.x - point1.x;
            xs = xs * xs;
            ys = point2.y - point1.y;
            ys = ys * ys;
            return Math.sqrt(xs + ys);
        }
        var b = el.getBBox(),
            objDOM = el,
            svgDOM = objDOM.ownerSVGElement;
        // Get the local to global matrix
        var matrix = svgDOM.getTransformToElement(objDOM).inverse(),
            oldp = [[b.x, b.y], [b.x + b.width, b.y], [b.x + b.width, b.y + b.height], [b.x, b.y + b.height]],
            pt, newp = [],
            obj = {},
            i, pos = Number.POSITIVE_INFINITY,
            neg = Number.NEGATIVE_INFINITY,
            minX = pos,
            minY = pos,
            maxX = neg,
            maxY = neg;

        for (i = 0; i < 4; i++) {
            pt = svgDOM.createSVGPoint();
            pt.x = oldp[i][0];
            pt.y = oldp[i][1];
            newp[i] = pt.matrixTransform(matrix);
            if (newp[i].x < minX) minX = newp[i].x;
            if (newp[i].y < minY) minY = newp[i].y;
            if (newp[i].x > maxX) maxX = newp[i].x;
            if (newp[i].y > maxY) maxY = newp[i].y;
        }
        // The next refers to the transformed object itself, not bbox
        // newp[0] - newp[3] are the transformed object's corner
        // points in clockwise order starting from top left corner
        obj.newp = newp; // array of corner points
        obj.width = pointToLineDist(newp[1], newp[2], newp[0]) || 0;
        obj.height = pointToLineDist(newp[2], newp[3], newp[0]) || 0;
        obj.toplen = dist(newp[0], newp[1]);
        obj.rightlen = dist(newp[1], newp[2]);
        obj.bottomlen = dist(newp[2], newp[3]);
        obj.leftlen = dist(newp[3], newp[0]);
        // The next refers to the transformed object's bounding box
        obj.BBx = minX;
        obj.BBy = minY;
        obj.BBx2 = maxX;
        obj.BBy2 = maxY;
        obj.BBwidth = maxX - minX;
        obj.BBheight = maxY - minY;
        return obj;
    }

    var convert_bBox_viewBox = scottishParliamentaryElections.convert_bBox_viewBox = 
        function(domNode, svgElement, x, y)
        { bBox = getMetrics(domNode);
          svgElement.setAttribute("viewBox", 
              bBox.BBx        + " " +
              bBox.BBy        + " " +
              bBox.BBwidth    + " " +
              bBox.BBheight
          );
        }

    var fileHandles = ['regions', 'constituencies', 'parliament', 'Central Scotland', 'Mid Scotland and Fife', 'Lothian', 'Highlands and Islands', 'North East Scotland', 'West Scotland', 'South Scotland', 'Glasgow'];
    var svgStore  = scottishParliamentaryElections.svgStore = {};
    var loadSVG   = scottishParliamentaryElections.loadSVG = 
        function(fileHandle, svgStore)
        { d3.xml
          ( "/static/scottishParliamentaryElections/2016/regions/" 
                + fileHandle
                + ".svg?ver=" 
                + thisEqualsThat.graphicLoadVersion, 
            'image/svg+xml',
            function(xml)
            { 
                  importedNode = document.importNode(xml.documentElement, true);
                  // console.log("referenceVisual:" + fileHandle, importedNode);
                  var referenceRootG = $(importedNode).find("g").first();
                  svgStore[fileHandle] = {"rootG": referenceRootG};
            }
          );
        };
    fileHandles.forEach( function(fileHandle) { loadSVG(fileHandle, svgStore) } );

    

    var tooltip = d3.select("body")
              .append("div")
              .classed("tooltip", true)
              .text("a simple tooltip");


    var displaySVG = scottishParliamentaryElections.displaySVG =
        function(fileHandle, selector, complete)
        { if (! svgStore.hasOwnProperty(fileHandle))
          { console.log("immediate: displaySVG");
            setTimeout(function(){displaySVG(fileHandle, selector, complete);}, 200);
          }
          else
          { var svgElement = 
                $(document.createElementNS(d3.ns.prefix.svg, "svg"))
                    .attr("xmlns",        "http://www.w3.org/2000/svg")
                    .attr("xmlns:xlink",  "http://www.w3.org/1999/xlink")
                    .attr("width",        "100%")
                    .attr("height",       "100%");
            var clonedG = scottishParliamentaryElections.svgStore[fileHandle].rootG.clone();
            svgElement.append(clonedG);
            $(selector).append(svgElement);

            convert_bBox_viewBox(clonedG.get(0), svgElement.get(0));

            complete();
          }
        };


    
    displaySVG('regions', "#regions", 
        function() 
        { $("#regions").find("path")
              .each( function()
              { 
                idSplit = this.getAttribute("id").split("_");
                this.classList.add(idSplit[0]);
                if (idSplit.length > 1)
                { this.classList.add(idSplit[1]);
                }
              });
          $("#regions > svg > g > g").each(function(){this.classList.add("region")});

          d3.selectAll("#regions .region")
              .on("mouseover", function(){ 
                    var tooltipText = this.getAttribute("id");
                    var d3Event = d3.event;
                    if (d3Event.target.id.indexOf("listSeat") != -1)
                    { tooltipText = d3Event.target.getAttribute("class").split(" ")[0] + " " +tooltipText;
                    }
                    tooltip.text(tooltipText); return tooltip.style("visibility", "visible"); } )
              .on("mousemove", function()
                  { return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                  })
              .on("mouseout", function(){return tooltip.style("visibility", "hidden"); } )
          ;


          displaySVG('constituencies', '#constituencies', 
              function() 
              { var regionsSVG        = $("#regions > svg");
                var constituenciesSVG = $("#constituencies > svg");
                
                $("#constituencies > svg > g > g").attr("opacity", 0.5);

                d3.selectAll("#constituencies >svg >g >g >*")
                    .on("mouseover", function() 
                        { d3this = d3.select(this);
                          if (d3this.classed("activeRegion"))
                          { d3this.classed("hoverConstituency", true);
                            //d3this.style("fill", "red");
                            // d3this.selectAll("*").classed("hoverConstituency", true);//("fill", "red");
                            tooltip.text(this.getAttribute("class").split(" ")[0]+" "+this.getAttribute("id")); 
                            return tooltip.style("visibility", "visible");
                          }
                        } 
                    )
                    .on("mousemove", function()
                        { return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                        })
                    .on("mouseout", function()
                        { d3this = d3.select(this);
                          d3this.classed("hoverConstituency", false);
                          return tooltip.style("visibility", "hidden"); 

                        } )
                    .on("click", 
                      function(data, index)
                      { console.log(data, index, d3.event);
                      }
                    )
                ;


                var selectRegion = function(event)
                { console.log(event);
                  
                  var activeRegionName    = scottishParliamentaryElections.activeRegionName     = event.target.id.split("_")[0];
                  var activeRegionElement = scottishParliamentaryElections.activeRegionElement  = $("#constituencies > svg #"+activeRegionName).attr("opacity", 1.0);

                  d3.select(activeRegionElement.get(0)).selectAll("*").classed("activeRegion", true);

                  convert_bBox_viewBox(
                    activeRegionElement.get(0), 
                    constituenciesSVG.get(0)
                  );

                  $("#regions") .velocity({"width":"18%",   "height":"18%"}, {"duration": 400});
                  $(".vote")    .velocity("fadeIn", {"duration": 800});

                  scottishParliamentaryElections.constituenciesMenu = returnRegions;
                }
                var returnRegions = function(event)
                { console.log(event);

                  $("#regions") .velocity({"width":"100%",  "height":"100%"}, {"duration": 400});
                  $(".vote")    .velocity("fadeOut", {"duration": 400});
                  scottishParliamentaryElections.activeRegionElement.attr("opacity", 0.5);
                  d3.select(scottishParliamentaryElections.activeRegionElement.get(0)).selectAll("path").classed("activeRegion", false);

                  scottishParliamentaryElections.constituenciesMenu = selectRegion;
                } 

                scottishParliamentaryElections.constituenciesMenu = selectRegion;
                $("#regions").on("click", ".region", function(event){return scottishParliamentaryElections.constituenciesMenu(event);});



                displaySVG('parliament', "#parliamentContainer",
                    function()
                    { 
                      d3.selectAll("#parliamentContainer > svg >g >g")
                          .on("mouseover", function(){ 
                                var tooltipText = this.getAttribute("class").split(" ")[0];
                                tooltip.text(tooltipText); return tooltip.style("visibility", "visible"); } )
                          .on("mousemove", function()
                              { return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                              })
                          .on("mouseout", function(){return tooltip.style("visibility", "hidden"); } )
                      ;


                      $(".vote").hide();

                      processSwingChange()
                    }
                );

              }
          );                
         
        }
    );

    var showResultsOnMap = function(data)
    { var totalSeatCounter = {};
      var indySeatCounter = {"SNP": 0, "RISE":0, "Green":0, "Solidarity":0};

      $.each(data.constituency, 
          function(partyName, party)
          { $.each(party.constituencies, 
                function(index, constituencyName)
                { d3.select("#"+camelCase(constituencyName)).attr("class", "").classed(camelCase(partyName), true);
                  if (indySeatCounter.hasOwnProperty(partyName)) indySeatCounter[partyName] +=1;
                  else 
                  { if (!totalSeatCounter.hasOwnProperty(partyName)) totalSeatCounter[partyName] = 0;
                    totalSeatCounter[partyName] += 1;
                  }
                }
            );
          }
      );

      regionParties = {}
      $.each(data.list, 
          function(partyName, party)
          { $.each(party, 
                function(regionName, region)
                { if (! regionParties.hasOwnProperty(regionName)) regionParties[regionName] = [];
                  seatsToAdd = region.calculatedSeats;
                  while ( seatsToAdd > 0)
                  { regionParties[regionName].push(camelCase(partyName));
                    d3.select("#"+camelCase(regionName)+"_listSeat_"+regionParties[regionName].length).attr("class", "").classed(camelCase(partyName), true);
                    seatsToAdd --;
                    if (indySeatCounter.hasOwnProperty(partyName)) indySeatCounter[partyName] +=1;
                    else 
                    { if (!totalSeatCounter.hasOwnProperty(partyName)) totalSeatCounter[partyName] = 0;
                      totalSeatCounter[partyName] += 1;
                    }
                  }
                }
            );
          }
      );

      seatIndex = 0;
      $.each(
          indySeatCounter,
          function(partyName, seatCount)
          {   while (seatCount > 0)
              { d3.select("#parliamentContainer > svg > g > g:nth-child("+(seatIndex+1)+")").attr("class", "").classed(camelCase(partyName), true);
                seatCount --;
                seatIndex ++;
              }
          }
      );
      $.each(
          totalSeatCounter,
          function(partyName, seatCount)
          {   while (seatCount > 0)
              { d3.select("#parliamentContainer > svg > g > g:nth-child("+(seatIndex+1)+")").attr("class", "").classed(camelCase(partyName), true);
                seatCount --;
                seatIndex ++;
              }
          }
      );
      
      var str = JSON.stringify(data, undefined, 4);
      $("#fullData").html(output(syntaxHighlight(str)));

    };

    var getData = function()
    { var ajaxOptions = 
          { "url": "/scottishParliament/data",
            "dataType": "json",
            "success": function(data, status, xjasj)
                { console.log(data);
                },
          };
      $.ajax(ajaxOptions);
    }
    getData();

    var processSwingChange = function()
    { var ajaxOptions = 
          { "url": "/scottishParliament/updateSwings",
            "type": "POST",
            "data": { "swingsConstituency": $("#constituencySwings > textarea").val(),
                      "swingsList":         $("#listSwings > textarea").val(),
                    },
            "dataType": "json",
            "success" : function(data, status, xjas)
                { console.log(data);

                  showResultsOnMap(data);
                },
          };
      $.ajax(ajaxOptions);
    }
    $("textarea").on("change", processSwingChange)
    
    
    


            //       // var referenceSVGSelectListItemDiv = $("<div class='referenceSVGSelectListItem' />").attr("thisEquals_fileHandle", referenceSVGData.fileHandle);
            //       // var referenceSVGSelectListItemLI  = $("<li />");
            //       var svgElement = 
            //           $(document.createElementNS(d3.ns.prefix.svg, "svg"))
            //               .attr("xmlns",        "http://www.w3.org/2000/svg")
            //               .attr("xmlns:xlink",  "http://www.w3.org/1999/xlink")
            //               .attr("xmlns:z",      "http://debeissat.nicolas.free.fr/svg3d/svg3d.rng")
            //               .attr("width",        "100%")
            //               .attr("height",       "100%")
            //       this[fileHandle] = referenceRootG.clone().appendTo(referenceSVGSelectListItemSVG);
                  

            //       referenceSVGSelectListItemDiv.append(referenceSVGSelectListItemSVG);
            //       referenceSVGSelectListItemLI.append(referenceSVGSelectListItemDiv);

            //       referenceVisual.svgSelectList.append(referenceSVGSelectListItemLI);

            //       var internalSize    = clonedG[0].getBBox();

            //       var viewBoxString   = internalSize.x        + " " +
            //                             internalSize.y        + " " +
            //                             internalSize.width    + " " +
            //                             internalSize.height;

            //       referenceSVGSelectListItemSVG[0].setAttribute("viewBox", viewBoxString);
            // }
      // };
      
    });