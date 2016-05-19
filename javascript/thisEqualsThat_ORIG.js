window.thisEqualsThat = {};

thisEqualsThat.svg = {};

thisEqualsThat.oop = function()
{ this.ThisEqualsThatScene = function(displayContainerDiv)
  { this.displayContainerDiv = displayContainerDiv;
    this.svgNameInput = 
      $("<div />",
      { "class": "svgName"
      }).append("<input />",
      { "id":   "svgNameInput",
        "type": "text"
      });
/*
LINE ABOVE NEEDS EDITING TO -- .append( $("<input />",  .....}));
*/
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
    this.thisEqualsScene.append(this.svgNameInput);
    this.thisEqualsScene.append(this.modelClassesContainerDiv);
    this.thisEqualsScene.append(this.modelContainerDiv);
    this.displayContainerDiv.append(this.thisEqualsScene);
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
        }
      }
      $.ajax(ajaxOptions);
    }
  }
  
  //MODEL INSTANCE
  this.ModelInstance = function(modelClass, modelInstanceData)
  { this.modelClass         = modelClass;
    this.data               = modelInstanceData;
    this.id                 = this.data['id'];
    
    this.inputFields        = {};
    this.outputFields       = {};
    
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
            This.inputFieldsSliders.append(inputField.getSlider());
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
          This.lastAlteredOutputField.data.currentValue = data.newValue
          This.displayCurrentOutput()
          if (This.bottomModelInstance && data.bottomModelData)
          { This.bottomModelInstance.lastAlteredOutputField.data.currentValue = data.bottomModelData.newValue
            This.bottomModelInstance.displayCurrentOutput()
          }
          if (successFunction)
            successFunction(data, status, request);
        }
      };
    console.log(ajaxOptions);
    $.ajax(ajaxOptions);
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
    if (! topModelInstance.bottomModelHistory.hasOwnProperty(data.__id))
    { var bottomModelInstance =  
        new ThisEqualsThat.ModelInstance(data.__modelClass, data);
      topModelInstance.bottomModelHistory[bottomModelInstance.id] = bottomModelInstance;
      bottomModelInstance.modelPosition = "bottom";
    }
    if (topModelInstance.hasOwnProperty("bottomModelInstance"))
    { topModelInstance.bottomModelInstance.hide();
    }
    topModelInstance.bottomModelInstance = topModelInstance.bottomModelHistory[data.__id];
    topModelInstance.bottomModelInstance.displayIntoTarget(topModelInstance.display.bottomModelDiv);
    console.log(topModelInstance.bottomModelInstance);
  }
  this.ModelInstance.prototype.displayIntoTarget = function(targetContainer)
  { if (! this.hasOwnProperty("displayElement"))
    { this.display = {};
      this.display.displayElement = 
        $("<div />",
          { id: "modelInstanceDiv."+this.modelClass+"."+this.id,
            "class": "modelInstance modelInstance"+this.modelPosition
          }
        ).append(
          $("<div />",
          { "class": "modelSliders"
          }
          ).append(
            this.getInputFields().inputFieldsSliders
            )
        );
      this.display.svgOutput =
        $("<div />",
          { "class": "svgOutput"
          }
        );
      this.display.modelOutputValue = 
        $("<div />",
          { "class": "modelOutputValue"
          }
        );
      this.display.bottomModelSelectDiv = $("<div />",
          { id: "bottomModelSelectDiv."+this.id
          }
        );
      this.display.bottomModelDiv = 
        $("<div />",
          { "class": "bottomModelDiv"
          }
        );
      this.display.displayElement
        .append(this.display.svgOutput)
        .append(this.display.modelOutputValue)
        .append(this.getOutputFields().outputFieldsSelect)
        .append(this.display.bottomModelSelectDiv)
        .append(this.display.bottomModelDiv)
      ;
    }
    this.display.displayElement.show();
    targetContainer.append(this.display.displayElement);
    return this;
  }
  this.ModelInstance.prototype.hide = function()
  { this.display.displayElement.hide();
  }
  this.ModelInstance.prototype.displayBottomModel = function()
  { console.log("displayBottomModel");
  }
  this.ModelInstance.prototype.displayCurrentOutput = function()
  { var outputField = this.lastAlteredOutputField;
    console.log("displayCurrentOutput", this, outputField)
    

    var svgOutput = $("div.svgOutput");
    var svgID = $("#svgNameInput").val();
    if (svgID == undefined || svgID == "")
    { svgID = "rg1024_metal_barrel";
    }
    //svgOutput.append($("<object type='image/svg+xml' data='/svg/rg1024_metal_barrel.svg' />"));
    d3.xml("/svg/"+svgID+".svg", 'image/svg+xml', 
        function(xml) 
        { importedNode = document.importNode(xml.documentElement, true);
          svgOutput.html($(importedNode));
        }
    );

    var gTET = thisEqualsThat;
    //$("#document").append("<script type='text/javascript' src='/svg/rg1024_metal_barrel' />);
    document.getElementById("layer1");    
    $.getScript("/svg/"+svgID+".js", function(){console.log("alksj"); console.log(gTET); rg1024_metal_barrel()});
    //svgOutput.svg();
    //var svg = svgOutput.svg("get");
    console.log($("div.svgOutput"));
    //console.log(svg);
    /*svg.load("/svg/rg1024_metal_barrel.svg", 
        { addTo: true, 
          changeSize: false, 
          onLoad: ()
        });
    */
    this.display.modelOutputValue.html
    ( outputField.fullAddress.toString()+": "+outputField.data.unitPrefix+Number(outputField.data.currentValue).toPrecision(5)+outputField.data.unitSuffix
    );
  }
  
  this.ModelFieldInput = function(modelInstance, data)
  { console.log(modelInstance, data);
    this.modelInstance  = modelInstance;
    this.fullAddress    = data.fullAddress;
    this.data           = data;
    modelInstance.inputFields[data.fullAddress] = this;
  }
  this.ModelFieldInput.prototype.getSlider = function()
  { if (! this.hasOwnProperty("uiSlider"))
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
         ).append(this.fullAddress);
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
    }
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
          { This.currentValue = ui.value;
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
            text:  this.fullAddress
          }
        );
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

$().ready(
  function()
  { thisEqualsThat.scene = new ThisEqualsThat.ThisEqualsThatScene($("#thisEqualsThatSceneDiv"));
  }
);
