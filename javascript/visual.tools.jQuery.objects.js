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

ThisEqualsThat.jQueryObjects(jQuery);