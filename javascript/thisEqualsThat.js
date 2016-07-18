window.thisEqualsThat = {};
thisEqualsThat.graphicLoadVersion = "0.1.1.3.20151102.newReferenceSVGs.womanPainting3.0"

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
  var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
  var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  var left = ((width / 2) - (w / 2)) + dualScreenLeft;
  var top = ((height / 2) - (h / 2)) + dualScreenTop;
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

            var ink, d, x, y;

                if($(this).find(".ink").length === 0){
                    $(this).prepend("<span class='ink'></span>");
                }

                ink = $(this).find(".ink");
                ink.removeClass("animate");

                if(!ink.height() && !ink.width()){
                    d = Math.max($(this).outerWidth(), $(this).outerHeight());
                    ink.css({height: d, width: d});
                }

                x = event.pageX - $(this).offset().left - ink.width()/2;
                y = event.pageY - $(this).offset().top - ink.height()/2;

                ink.css({top: y+'px', left: x+'px'}).addClass("animate");

          }
        );

    $.each( this,
      function (modelClassName, modelClass)
      { modelClassList.append(modelClass.modelClassListLI);
      }
    );
    modelClassesContainerDiv.append(modelClassList);
    modelClassList.append('<div class="modelClassLI ripplelink cyan">' +
              '<img src="/static/graphics/thisEquals/icons/map.svg">' +
              '<h3>Map</h3>' +
              '</div>'
      ).on('click', function () {
        console.debug('obj');
      });
  }
  this.ModelClass = function(modelClassName)
  { this.name = modelClassName;
    this.imageURL = this.imageBaseURL+modelClassName+".svg";
    this.modelClassListLI =
      $("<li />",
        { "class": "modelClassLI ripplelink cyan"
        }
       ).data("modelClass", this)
       .append($("<img />", { src: this.imageURL } ))
       .append($("<h3 />", { text: this.name } ));
  }
  this.ModelClass.prototype.imageBaseURL =  "/static/graphics/thisEquals/modelClasses/";
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

      display.modelSliders              = $("<div class='modelSliders model_options'  />");
      display.modelSliders.append(this.getInputFields().inputFieldsSliders);

      display.modelOutputTest           = $("<div class='modelOutputTest model_options' />");

      display.modelCustomSvg            = $("<div class='modelCustomSvg model_options' />");

      var models = [ display.modelSliders, display.modelOutputTest, display.modelCustomSvg ];
      $.each( models, function ( i, elem ) {
            elem.on('click', function () {

                                    var self = $(this),
                                        wWidth = $(window).outerWidth(),
                                        body = $('body'),
                                        modelSvg = $('.modelSvgOutput'),
                                        googleConnect = $('.googleConnect'),
                                        openMenu = $('.open-menu');

                                          if ( wWidth <= 768 ) {
                                            self.addClass('active');
                                              if ( self.hasClass('active') ) {
                                                var selfHeight = self.outerHeight();
                                                openMenu.show();
                                                body.addClass('open');  modelSvg.css({'z-index': '505', 'top': selfHeight + 40});  googleConnect.hide();
                                                openMenu.on('click', function () {
                                                    self.removeClass('active');
                                                    openMenu.hide();
                                                    body.removeClass('open');  modelSvg.css({'z-index': '1', 'top': '20px'});  googleConnect.show();
                                                });
                                                console.debug( selfHeight );
                                              } else {
                                                openMenu.hide();
                                                body.removeClass('open');  modelSvg.css({'z-index': '1', 'top': '20px'});  googleConnect.show();
                                              }
                                          }
                                      });
                                    });

      display.modelSvgOutput            = $("<div class='modelSvgOutput' />");

      display.modelOutputDisplay        = $("<div class='modelOutputContainer'><div class='containerLabel'></div></div>");

      display.modelOutputValue          = $("<div class='modelOutputValue'  />");
      display.outputFieldsSelect        = this.getOutputFields().outputFieldsSelect;
      // display.modelOutputDisplay.append(display.modelOutputValue);
      display.modelOutputDisplay.append(display.outputFieldsSelect);


      display.visualisationOutputContainer       = $("<div class='visualisationOutputContainer'><div class='containerLabel'></div></div>");

      display.modelVisualisationValue   = $("<div class='modelVisualisationValue'  />");

      display.visualisationFieldsSelect = this.getVisualisationFields().visualisationFieldsSelect;
      // display.visualisationOutputContainer.append(display.modelVisualisationValue);
      display.visualisationOutputContainer.append(display.visualisationFieldsSelect);

      display.svgOutput             = $("<div class='svgOutput'  />");

      display.svgTextInput          = $("<input type='text' class='svgTextDescription' placeholder='Enter Text Description'/>");
      display.svgSaveLink           = $("<div class='svgSaveLink btn'   />");
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

      display.svgOutput.append(display.svgTextInput);
      display.svgTextInput.on("change", function() { d3.select(display.svgTextDescription).text($(this).val()); This.svg_createSaveLink(This);});
      display.svgModelRoot.append(containerSVG);
      //display.svgOutput.append(display.referenceSVG);

      display.toggleFeatures = $("<div id='toggleFeatures_"+This.id+"' class='colorControl toggleFeatures' />");
      display.toggle =
        { "axes":                 $("<input class='checkbox' id = 'toggle_axes_" + This.id + "' type='checkbox'  checked='checked'title='Show / Hide Axes' /><span class='checkbox_ui ch_axis'><span class='check'><i class='fa fa-check'></i></span></span>"),
          "axes.label":           $("<label/>").append('<div id="axis"></div>'),
          "axes.changeEvent"  :
              function(changeEvent)
              { $(display.svgHeightAxis).toggle();
                This.svg_createSaveLink(This);
              },
          "svgReferenceG":        $("<input class='checkbox' id  = 'toggle_svgReferenceG_"   + This.id + "' type='checkbox'   checked='checked'   title='Show / Hide Frame of Reference'/><span class='checkbox_ui ch_reference'><span class='check'><i class='fa fa-check faAligned'></i></span></span>"),
          "svgReferenceG.label":  $("<label/>").append('<div id="reference"></div>'),
          "svgReferenceG.changeEvent":
              function(changeEvent)
              { $(display.svgReferenceG).toggle();
                This.svg_createSaveLink(This);
              },
          "svgTextDescription":        $("<input class='checkbox' id  = 'toggle_svgTextDescription_"   + This.id + "' type='checkbox'   checked='checked'   title='Show / Hide Frame of Reference'/><span class='checkbox_ui ch_description'><span class='check'><i class='fa fa-check faAligned'></i></span></span>"),
          "svgTextDescription.label":  $("<label/>").append('<div id="text_description"></div>'),
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
          "colorFormat": "RGB",
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
      display.bottomModelSelectLable  = $("<div class='bottomModelSelectLable'/>");
      display.bottomModelSelectDiv.append(display.bottomModelSelectLable);
      display.bottomModelDiv        = $("<div class='bottomModelDiv' />");

      var d = display.displayElement;

      display.topModelDiv = $("<div class='modelInstance topModelDiv modelInstance'"+this.modelPosition+" />");

      display.topModelDiv.append(display.modelSliders);
      display.topModelDiv.append(display.modelOutputTest);
      display.topModelDiv.append(display.modelCustomSvg);
      display.topModelDiv.append(display.modelSvgOutput);
      display.modelSvgOutput.append(display.svgOutput);
      display.modelOutputTest.append(display.modelOutputDisplay);
      display.modelOutputTest.append(display.visualisationOutputContainer);
      display.modelOutputTest.append(display.toggleFeatures);
      display.modelOutputTest.append(display.colorControl);
      display.modelCustomSvg.append(display.svgSaveLink);
      display.modelCustomSvg.append(display.svgTextInput);


      d.append(display.topModelDiv);
      d.append(display.bottomModelDiv);


      targetContainer.append(this.display.displayElement).coloPick();
      //display.bottomModelDiv = sceneContainer;

      //display.displayElement.append(display.textOutputLabel);
      // addOutdatafieldDiv
      //display.displayElement.append(display.OutputElement);
      display.customSVGPane =
        $("<div />",
          { "class": "customSVGPane makeDraggable customSVGList"
          }
        );
        // display.customSVGPane.append(
        //   $("<div class='customSVGPaneTitle'>Get SVG from File</div>"));
        display.customSVGTitle =
          $("<input />",
             { "class" : 'custom_svgNameInput',
               "type"  : 'file',
               'placeholder' : 'Get SVG from File',
               'accept' : 'image/svg+xml'
             }
            );
        display.customSVGPane.append(display.customSVGTitle);

        display.customSVGPane.append(
          $("<div />",
              { "class" : 'customSVGPaneSubmitButton btn'
            }
          ).on("click", function(event)
            { var svgFile = $('input.custom_svgNameInput').val();

             if( svgFile === "" || svgFile === undefined){
               alert('.svg file not uploaded!');
             } else {
               alert(svgFile + ' ' + 'uploaded');
             }
              console.log($('input.custom_svgNameInput').val());
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

        display.modelCustomSvg.append(display.customSVGPane);
        display.modelOutputTest.append(display.bottomModelSelectDiv);

        display.googleConnect =
        $("<div />",
          { "class": "customSVGPane googleConnect makeDraggable"
          }
        ).draggable().css({
          'position' : 'absolute',
          'top'      : '104%',
          'left'     : '0',
          'right'    : '0'
        });
        display.googleConnect.append(
          $("<div class='customSVGPaneTitle'>googleConnect</div>"));
        display.googleConnect_email=
          $("<input />",
             { "class" : 'custom_svgNameInput',
               "placeholder" : 'Placeholder text'
             }
            );
        display.googleConnect.append(display.googleConnect_email);


        display.googleConnect_spreadsheetURL=
            $("<input />",
             { "class" : 'googleConnect spreadsheetURL custom_svgNameInput',
               "placeholder" : 'Placeholder text'
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
             { "class" : 'googleConnect spreadsheetURL custom_svgNameInput'
             }
            );
        display.googleConnect.append(display.googleConnect_sheetSelect);

        display.googleConnect_loginButton =
            $("<a class='googleConnect_loginButton btn'>Login to Google</a>")
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
        display.modelSvgOutput.append(display.googleConnect)
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
            + ">" + "</a>"
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
    { this["getTag_"+this.data.fieldType]()
     .addClass("modelClass_"+this.data.displayFieldAddress.split(":")[0])
     .addClass("type_"+this.data.fieldType)
     .addClass("name_"+this.data.name)
     .addClass("unit_"+this.data.unit);
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
        );
        //  .append(this.data.displayFieldAddress);

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
        );
        //  .append(this.data.displayFieldAddress);
      var uiValueText =
        $("<input />",
          { "class": "inputFieldText",
            type: "text",
          }
        ).addClass("unit_"+this.data.unit);

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
      sliderOptions["orientation"] = "horizontal",
      sliderOptions["animate"] = "fast",
      sliderOptions["range"] = "min"
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
        );
        // .append(this.data.displayFieldAddress);
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

//function colorPickerdef() {
//    $('.colorPickerElement:first').find('input.inputFieldText').addClass('colorPickerInput');
//}

$().ready(
  function()
  { frameBuffer = $("<div style='display: hidden'>");
    frameBuffer.appendTo($(document.body));
    thisEqualsThat.scene = new ThisEqualsThat.ThisEqualsThatScene($("#thisEqualsThatSceneDiv"));
  }
);

$().ready(function(){



    $('body').append('<div class="copyrightContainer"><p>© This Equals ltd 2016</div></p>')
             .append('<div class="open-menu"></div>');
    $('.modelClasses').append('<button class="hamburger hamburger--spin-r" type="button" aria-label="Menu" aria-controls="navigation"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>');

    $.fn.coloPick = function() {
        console.info('CP created');
        $('input.unit_rgb').colorpicker({
            inline: false,
            alpha: false,
            colorFormat: "RGB",
            buttonClass: 'btn',
            color: 'rgb(123,45,67)',
            altField: 'input.colorPickerInput',
            close: function(){
                $('input.unit_rgb').change();
            }
        });
    };




    $('.hamburger').on('click', function(){

          var menuBtn = $(this),
              openMenu = $('.open-menu'),
              menuWrap = $('.modelClasses'),
              menuItemList = $('#modelClassUL'),
              body = $('body');

          menuBtn.toggleClass('is-active');

          if ( menuBtn.hasClass('is-active') ) {

              openMenu.show();
              body.addClass('open');
              menuWrap.addClass('active');
              setTimeout(function(){
                menuItemList.css('width', '100%');
              }, 600);

              openMenu.on('click', function(){
                  menuItemList.css('width', '0');
                  body.removeClass('open');
                  $('.hamburger').removeClass('is-active');
                  setTimeout(function(){
                    menuWrap.removeClass('active');
                    openMenu.hide();
                  }, 600);
              });

          } else {
            body.removeClass('open');
            $('.hamburger').removeClass('is-active');
            menuItemList.css('width', '0');
            setTimeout(function(){
              menuWrap.removeClass('active');
              openMenu.hide();
            }, 600);

          }

    });


});





$('head').append('<script src="https://use.fontawesome.com/cee7f18682.js"></script>');
$('head').append('<script src="/static/javascript/jquery.ui.touch-punch.min.js"></script>');
$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">');
$('head').find('link[href="//static/pylons.css"]').attr('href', '/static/pylons.css');
$('head').append('<link rel="stylesheet" href="/static/css/menu.css" type="text/css" media="screen" charset="utf-8">');
