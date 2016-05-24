this.ModelFieldInput = function(modelInstance, data)
  { this.modelInstance  = modelInstance;
    this.fullAddress    = data.fullAddress;
    this.stringName     = this.fullAddress.toString();
    this.data           = data;
  }
  this.ModelFieldInput.prototype.getSlider = function()
  { if (! this.hasOwnProperty("uiSlider"))
    { var fieldData = this.data;

      var sliderOptions = this["slider_"+fieldData.rangeType+"SliderOptions"]();
      sliderOptions["orientation"] = "horizontal"
      console.debug("sliderOptions", sliderOptions);

      this.uiElement    =
        $("<div />",
          { class: "inputFieldElement"
          }
        );
      var uiLabel =
        $("<div />",
          { class: "inputFieldLabel"
          }
         ).append(this.stringName);
      var uiValueText =
        $("<input />",
          { class: "inputFieldText",
            type: "text",
          }
        );
      var uiSlider =
        $("<div />",
          { class: "inputFieldSlider"
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
        slide: function(event, ui)
          { This.currentValue = ui.value;
            This.updateDisplayValue();
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
              { inputField: JSON.stringify(This.fullAddress),
                newValue: This.currentValue
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
