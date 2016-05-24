window.thisEqualsThat = {};

thisEqualsThat.svg = {};
thisEqualsThat.svgStore = {};

window.attachFunc = function(parent, name, functionContent)
{ if (!(hasOwnProperty(parent.prototype, name)))
  { var This = parent;
    parent.prototype[name] = functionContent;
  }
  return parent.prototype[name];
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
    
    this.ModelClasses = new ThisEqualsThat.ModelClasses(this);
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
          //This.modelInstance.inputFieldAltered({});
        }
      }
      $.ajax(ajaxOptions);
    }
  }
  
  //REFERENCE VISUAL
  this.ReferenceVisual = function()
  { var This = this;
    this.svgStore = {}
    this.svgReferenceDefs = 
    [ { "heightThreshold": 0.03,  "fileHandle": "Ant",        "height": 0.002},
      { "heightThreshold": 8.96,  "fileHandle": "SuperBlonde",     "height": 1.72},
      //{ "heightThreshold": 33.0,  "fileHandle": "Bus",        "height": 4.40},
      { "heightThreshold": 132.0, "fileHandle": "EiffelTower","height": 301.0}
    ];
    ThisEqualsThat.ReferenceVisualLoader(this.svgReferenceDefs, this, 0);

    this.getSVGData = function(height)
    { for (var counter=0; counter < this.svgReferenceDefs.length; counter ++)
      { var currentReferenceDef = this.svgReferenceDefs[counter];
        if (height < currentReferenceDef.heightThreshold || counter == this.svgReferenceDefs.length - 1)
        { This.currentReferenceSVG = currentReferenceDef;
          return this.svgStore[currentReferenceDef['fileHandle']];
        }
      }
    }
  }
  //this.ReferenceVisual.prototype.
  this.ReferenceVisualLoader = function(referenceSVGDataList, referenceVisualDefs, index)
  { if (index >= referenceSVGDataList.length)
    { return;      
    }
    else
    { ThisEqualsThat.ReferenceVisualLoader(referenceSVGDataList, referenceVisualDefs, index+1)
    }
    var referenceSVGData = referenceSVGDataList[index]
    var importedNode;
    d3.xml("/svg/"+"reference"+referenceSVGData.fileHandle+".svg", 'image/svg+xml',function(xml)
    { 
          importedNode = document.importNode(xml.documentElement, true);
          console.log("referenceVisual:" + referenceSVGData.fileHandle, importedNode);
          referenceVisualDefs.svgStore[referenceSVGData.fileHandle] = $(importedNode).find("g").first();
        }
  );
  }
  //MODEL INSTANCE
  this.ModelInstance = function(modelClass, modelInstanceData)
  { this.modelClass         = modelClass;
    this.data               = modelInstanceData;
    this.id                 = this.data['id'];
    
    this.inputFields        = {};
    this.outputFields       = {};
    
    this.svgStore           = {};
    this.svgJSFromFile      = {};
    this.svgAnimations      = {};
    
    this.bottomModelHistory = {};
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
              This.lastAlteredOutputField = selectedField
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
          This.svg3dDisplayJSON = data.svg3dDisplayJSON;
          This.displayCurrentOutput()
          if (This.bottomModelInstance && data.bottomModelData)
          { This.bottomModelInstance.lastAlteredOutputField.data.currentValue = data.bottomModelData.newValue
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
      for (var i = 0; i < bottomModelLinkFieldList.length; i++)
      { var bottomModelLinkField = bottomModelLinkFieldList[i];
        bottomModelLinkField.modelInstance = this;
        var optionString = bottomModelLinkField.bottomModelClass+": "+bottomModelLinkField.boundInputField.toString()
        $("<option />",
          { value: optionString,
            text: optionString 
          }
        ).data("bottomModelLinkField", bottomModelLinkField)
        .appendTo(bottomModelLinkFieldList.select);
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
    console.log(topModelInstance.bottomModelInstance);
  }
  this.ModelInstance.prototype.displayIntoTarget = function(targetContainer)
  { if (! this.hasOwnProperty("display"))
    { this.display = {};
      var display = this.display;
      //var inputs = "inputs"
      //var outputsText = "outputs"
      display.displayElement = 
        $("<div />",
          { id: "modelInstanceDiv."+this.modelClass+"."+this.id,
            "class": "modelInstance modelInstance"+this.modelPosition
          }
        );

      display.modelSliders          = $("<div class='modelSliders'      />");
      display.modelSliders.append(this.getInputFields().inputFieldsSliders);
          
      display.modelOutputDisplay    = $("<div class='modelOutputContainer' />");
      display.modelOutputValue      = $("<div class='modelOutputValue'  />");
      display.outputFieldsSelect    = this.getOutputFields().outputFieldsSelect;
      display.modelOutputDisplay.append(display.modelOutputValue);
      display.modelOutputDisplay.append(display.outputFieldsSelect);

      display.bottomModelSelectDiv  = $("<div class='bottomModelSelectDiv bottomModelSelectDiv."+this.id+"' />");

        
      display.svgOutput             = $("<div class='svgOutput'     />");
      display.svgSaveLink           = $("<div class='svgSaveLink'   />");
      display.svgModelRoot          = $("<div class='svgModelRoot'  />");              
      display.referenceSVG          = $("<div class='referenceSVG'  />");
      var containerSVG        = document.createElementNS(d3.ns.prefix.svg, "svg");
      $(containerSVG)
          .attr("xmlns",        "http://www.w3.org/2000/svg")
          .attr("xmlns:xlink",  "http://www.w3.org/1999/xlink")
          .attr("xmlns:z",      "http://debeissat.nicolas.free.fr/svg3d/svg3d.rng")
          .attr("width",        "100%")
          .attr("height",       "100%")
          .attr("z:xInfinite",  "300")
          .attr("z:yInfinite",  "200")
          .attr("z:zRatio",     "2");
      
      var svgTranslatableG            = d3.select(containerSVG)     .append("g").attr("id", "svgTranslatableG_" +this.id) .node();
      display.svgTranslatableG        = svgTranslatableG;
      var svgVisualisationG           = d3.select(svgTranslatableG) .append("g").attr("id", "svgVisualisationG_"+this.id) .node();
      var svgReferenceGContainer      = d3.select(svgTranslatableG) .append("g").attr("id", "svgReferenceG_"    +this.id) .node();
      display.svgVisualisationG       = svgVisualisationG;
      display.svgReferenceGContainer  = svgReferenceGContainer;
      display.containerSVG            = containerSVG;
          
      display.svgOutput.append(display.svgModelRoot);
      display.svgOutput.append(display.svgSaveLink);
      display.svgModelRoot.append(containerSVG);
      //display.svgOutput.append(display.referenceSVG);
      
      display.bottomModelDiv        = $("<div class='bottomModelDiv modelInstance modelInstanceBottom' />");
       
      var d = display.displayElement;
      d.append(display.modelSliders);
      d.append(display.modelOutputDisplay);
      d.append(display.bottomModelSelectDiv);
      d.append(display.svgOutput);
      
      var sceneContainer = $("<div class='sceneContainer' />");
      sceneContainer.append(this.display.displayElement);
      display.bottomModelDiv = sceneContainer;
      targetContainer.append(sceneContainer);
      
      //display.displayElement.append(display.textOutputLabel);
      // addOutdatafieldDiv
      //display.displayElement.append(display.OutputElement);
      /*display.customSVGPane =
        $("<div />",
          { "class": "customSVGPane makeDraggable"
          }          
        ).draggable().css("position", "absolute");
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
        );*/
        //thisEqualsThat.scene.modelContainerDiv.append(display.customSVGPane);
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
  this.ModelInstance.prototype.animateSVG = function()
  { var svg3dConfiguration = this.svg3dDisplayJSON.svg3dConfiguration; 
    
    /*var customSVGTitle = this.display.customSVGTitle.val()
    if ( customSVGTitle != "")
    { $.extend(true, svg3dConfiguration, this.svgJSFromFile[customSVGTitle]);        
    }
    */
    var This = this;
    
    if (!(this.constructor.prototype.hasOwnProperty("progress_translate3d")))
    { this.constructor.prototype.progress_translate3d = 
          function(animation, progress, remainingMs, modelInstance)
          { //console.log(this, This);
            var svgElement      = $(modelInstance.display.containerSVG);
            var externalWidth   = svgElement.css("width");
            var externalHeight  = svgElement.css("height");

            var internalSize    = modelInstance.display.svgTranslatableG.getBBox();
            var viewBoxString   = internalSize.x      + " " +
                                  internalSize.y      + " " +
                                  internalSize.width  + " " +
                                  internalSize.height + " ";
            console.log(viewBoxString);
            svgElement[0].setAttribute("viewBox", viewBoxString);
            //var modelInstance = $(this).data("thisEqualsThat")["modelInstance"];
            //console.log(modelInstance);
            //modelInstance.display.containerSVG.get()[0].setAttribute("viewBox", "0 0 1024 400");
            //modelInstance.display.containerSVG.get()[0].setAttribute("preserveAspectRatio", "none");
            //d3.select(modelInstance.display.containerSVG).attr("viewbox", "0 0 1024 400").attr("preserveAspectRatio", "none");
            //console.log(modelInstance.display.containerSVG.attr("viewbox", "0 0 1024 400").attr("preserveAspectRatio", "none"));//+This.display.svgTranslatableG.
          }
    }
    
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
              { //Animate Clones/Main SVG
                $(This.display.svgClonableG).animate(
                { "svg3d":{"translate3d": This.svg3dDisplayJSON.svg3dConfiguration.translate3d}
                },
                { queue: This.id,
                  duration: 1000, 
                  easing: "easeInCubic",
                }
                );
                
                //Animate Reference SVG
                var svgVisualisationGBBox    = This.display.svgVisualisationG  .getBBox();
                var svgReferenceGBBox   = This.display.svgReferenceG[0] .getBBox();
                

                var multiplier = svgReferenceGBBox.height / ((thisEqualsThat.scene.referenceVisual.currentReferenceSVG.height / This.svg3dDisplayJSON.svgRelativeHighness) * (svgVisualisationGBBox["height"]));
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
                  

                  complete: function() { This.svg_createSaveLink(This);}
                }
                );

                This.display.svgClonableG.dequeue(This.id);
                This.display.svgReferenceG.dequeue(This.id);

                var svgVisualisationGBBox    = This.display.svgVisualisationG  .getBBox();
                    var svgReferenceGBBox   = This.display.svgReferenceG[0] .getBBox();
                    

                    var multiplier = svgReferenceGBBox.height / ((thisEqualsThat.scene.referenceVisual.currentReferenceSVG.height / This.svg3dDisplayJSON.svgRelativeHighness) * (svgVisualisationGBBox["height"]));
                    var svgGroundDifference = svgVisualisationGBBox.y + svgVisualisationGBBox.height - ((svgReferenceGBBox.y+svgReferenceGBBox.height) / multiplier);
                    var svgHorizDifference  = svgVisualisationGBBox.x - ((svgReferenceGBBox.x+svgReferenceGBBox.width) / multiplier);
                    
                    This.display.svgReferenceG.attr("transform", "translate("+svgHorizDifference+" "+svgGroundDifference+") scale("+(1.0/multiplier)+")");

                    
              }
       	}
    );
    svgClonableG.dequeue(this.id);
  }
  this.ModelInstance.prototype.svg_createSaveLink = function(This) 
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
  { var outputField = this.lastAlteredOutputField;
    console.log("displayCurrentOutput", this, outputField)
    
    
    
    var This = this;
    
    /*var customSVGTitle = this.display.customSVGTitle.val()
    if ( customSVGTitle != "")
    { this.svg3dDisplayJSON.svgFile = customSVGTitle+".svg"; 
    }
    */
    var svgFileName = this.svg3dDisplayJSON.svgFile;
    if (!(thisEqualsThat.svgStore.hasOwnProperty(svgFileName)))
    { d3.xml("/svg/"+svgFileName, 'image/svg+xml', 
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
  }
  this.ModelInstance.prototype.appendSVGToDisplay = function()
  { this.display.svgClonableG = thisEqualsThat.svgStore[this.svg3dDisplayJSON.svgFile].clone();
    $(this.display.svgVisualisationG).html(this.display.svgClonableG);
    this.display.svgReferenceG = $(thisEqualsThat.scene.referenceVisual.getSVGData(this.svg3dDisplayJSON.svgRelativeHighness)).clone();
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
                { select.append($("<option class='inputFieldSelectOption'value='"+optionValue+"'>"+optionText+"</option>"));
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
      uiSlider.data("thisEquals.modelField", this);
      
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
            This.modelInstance.inputFieldAltered(
              { inputField: This.fullAddress, 
                newValue:   This.currentValue
              });
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
            This.updateValueText();
          },
        change: function(event, ui)
          { This.currentValue = This.sliderToActual(ui.value);
            This.updateValueText();
            This.modelInstance.inputFieldAltered(
              { inputField: This.fullAddress, 
                newValue:   This.currentValue
              });
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
  this.ModelFieldInput.prototype.updateValueText = function()
  { $(this.uiValueText).val(Number(this.currentValue).toPrecision(5));
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
    { //outputFieldOption.attr("selected", "selected");
      //this.modelInstance.lastAlteredOutputField = this.data;
    }
    outputFieldOption.data("thisEqualsOutputField", this);
    return outputFieldOption;
  }
}
ThisEqualsThat = new thisEqualsThat.oop();

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

$().ready(
  function()
  { frameBuffer = $("<div style='display: hidden'>");
    frameBuffer.appendTo($(document.body));
    thisEqualsThat.scene = new ThisEqualsThat.ThisEqualsThatScene($("#thisEqualsThatSceneDiv"));
  }
);
