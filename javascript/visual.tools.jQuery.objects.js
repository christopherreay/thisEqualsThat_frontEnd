ThisEqualsThat = window.ThisEqualsThat || {};

ThisEqualsThat.jQueryObjects = 
function($)
{ $.fn.extend
  ( { "getBBox":
      function()
      { return this.get(0).getBBox();
      },

      "getTransformToElement":
      function(element)
      { return element.getScreenCTM().inverse().multiply(this.getScreenCTM());
      },

      "getMetrics":
      function(element)
      { 
      },

      "pointToLineDist":
      function(A, B, P) 
      { var nL =  Math.sqrt((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));
        return    Math.abs((P.x - A.x) * (B.y - A.y) - (P.y - A.y) * (B.x - A.x)) / nL;
      },

      "dist":
      function(point1, point2) 
      { var xs = 0;
        var ys = 0;
        xs = point2.x - point1.x;
        xs = xs * xs;
        ys = point2.y - point1.y;
        ys = ys * ys;
        return Math.sqrt(xs + ys);
      },

      "getMetrics": 
      function() 
      { var el          = this.get(0);

        var b           = el.getBBox();
        var objDOM      = el;
        var svgDOM      = objDOM.ownerSVGElement;
        // Get the local to global matrix
        var matrix      = svgDOM.getTransformToElement(objDOM).inverse();
        var oldp        = [[b.x, b.y], [b.x + b.width, b.y], [b.x + b.width, b.y + b.height], [b.x, b.y + b.height]];
        var pt, newp    = [];
        var obj         = {};
        var i, pos      = Number.POSITIVE_INFINITY;
        var neg         = Number.NEGATIVE_INFINITY;
        var minX        = pos;
        var minY        = pos;
        var maxX        = neg;
        var maxY        = neg;

        for (i = 3; i >= 0; i--) 
        { var pt = svgDOM.createSVGPoint();
          
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
        var obj         = {};

        obj.obj_newp        = newp; // array of corner points
        obj.obj_width       = $.pointToLineDist(newp[1], newp[2], newp[0]) || 0;
        obj.obj_height      = $.pointToLineDist(newp[2], newp[3], newp[0]) || 0;
        obj.obj_toplen      = $.dist(newp[0], newp[1]);
        obj.obj_rightlen    = $.dist(newp[1], newp[2]);
        obj.obj_bottomlen   = $.dist(newp[2], newp[3]);
        obj.obj_leftlen     = $.dist(newp[3], newp[0]);
        // The next refers to the transformed object's bounding box
        obj.x         = minX;
        obj.y         = minY;
        obj.x2        = maxX;
        obj.y2        = maxY;
        obj.width     = maxX - minX;
        obj.height    = maxY - minY;

        return obj;
    }
    }
  );
};

function PopupCenter(url, title, w, h)
{ // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft  = window.screenLeft != undefined ? window.screenLeft : screen.left;
  var dualScreenTop   = window.screenTop  != undefined ? window.screenTop : screen.top;

  var width   = window.innerWidth   ? window.innerWidth   : document.documentElement.clientWidth  ? document.documentElement.clientWidth  : screen.width;
  var height  = window.innerHeight  ? window.innerHeight  : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  var left = ((width / 2) - (w / 2)) + dualScreenLeft;
  var top = ((height / 2) - (h / 2)) + dualScreenTop;
  var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

  // Puts focus on the newWindow
  if (window.focus) {
      newWindow.focus();
  }
  return newWindow;
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function normalDistribution(namespace, reset=false)
{   var context = thisEqualsThat.memoise_normalDistribution;

    if (! context.hasOwnProperty(namespace) )
    { context[namespace] =
      { "counter": 0,
        "length":  0,
        "numbers": [],
      };
    }
    subContext = context[namespace];
    if (reset === true)
    { subContext.counter = 0;
      return;
    }

    if (subContext.counter < subContext.length)
    { return subContext.numbers[subContext.counter++];
    }

    var nsamples = 6
    var sigma = 1
    var mu=0

    var run_total = 0
    for(var i=0 ; i<nsamples ; i++){
       run_total += Math.random()
    }

    var toReturn = sigma*(run_total - nsamples/2)/(nsamples/2) + mu
    subContext.numbers.push(toReturn);
    subContext.length++;
    subContext.counter++;

    return toReturn;
}

function recolorPaths(paths, changeTinyColor, mixAmount, changedBy)
{ paths.each
  ( function()
    { var originalColor = null;
      var originalAlpha = null;

      if (! this.getAttribute("original_fill_color") )
      { var colorRGB  = $(this).css("fill");
        if (colorRGB == null)
          colorRGB = "rgb(128, 128, 128)";
        originalColor = tinycolor(colorRGB);
        this.setAttribute("original_fill_color",  originalColor );
        originalAlpha = originalColor.getAlpha();
        this.setAttribute("original_fill_alpha",  originalAlpha );
      }
      else
      { originalColor = this.getAttribute("original_fill_color");
        originalAlpha = this.getAttribute("original_fill_alpha");
      }


      changeTinyColor.setAlpha(originalAlpha);
      newColor = tinycolor.mix(originalColor, changeTinyColor, mixAmount );

      this.setAttribute("style", `fill: ${newColor.toString("rgb")};`);

      this.setAttribute(changedBy+"_protectedColor", true);
    }
  );
}

ThisEqualsThat.jQueryObjects(jQuery);