// ==========================================================================
// Project:   MySystem.ArrowDrawing
// Copyright: ©2010 Concord Consortium
// Author:    Parker Morse <pmorse@cantinaconsulting.com>
// Author:    Noa Paessel  <knowuh@gmail.com>
// ==========================================================================
/*globals MySystem */

/** @class

  Common functionality for MySystem views which draw arrows with Raphael.

*/

MySystem.ArrowDrawing = {
	
	/***
	*                   ^ <-------- angle  
	*
	*                   *   <------ tip (x,y)    ---
	*                  * *                          |
	*                 *   *                         |- len
	*                *     *                        |
	* baseA(x,y)--> ********* <---- baseB (x,y)  --- 
	*                   *
	*                   *
	*                   *
	*                   *
	*                   *
	*                   * <-------- start (x,y)
	*
    Returns two Raphael path strings,
      "tail" which draws the curved path, and 
      "head" which draws the arrow head.
    These are split into two so that one may be filled seperately
    
    Parameters should be actual screen coordinates, not dataset coordinates.
    
    Original from Noah Paessel, https://gist.github.com/550233
    
    @params startx {Number} X-coordinate of the start point
    @params starty {Number} Y-coordinate of the start point
    @params endx {Number} X-coordinate of the end point
    @params endy {Number} Y-coordinate of the end point
    @params len {Number} Length of the "tip" of the arrowhead
    @params angle {Number} Angle in degrees 
      between the line and each wing of the arrowhead. 
      Should be less than 90.
    @params curvature {Number} strength of the curve, 0.5 is an easy smooth curve, > 1 is very curved
  */
  arrowPath: function(startx,starty,endx,endy,_len,_angle,_curvature) { 
    var len   = _len || 15,
        angle = _angle || 20,
        curvature = _curvature || 0.5;
    arrowPathArrays = MySystem.ArrowDrawing.arrowPathArrays(startx,starty,endx,endy,len,angle,curvature);
		return {tail: arrowPathArrays[0].join(" "), head: arrowPathArrays[1].join(" ")};
	},

	/**
	
	Returns an array representation of the path elements for an arrow
  
	@params startx {Number} X-coordinate of the start point
    @params starty {Number} Y-coordinate of the start point
    @params endx {Number} X-coordinate of the end point
    @params endy {Number} Y-coordinate of the end point
    @params len {Number} Length of the "tip" of the arrowhead
    @params angle {Number} Angle in degrees 
      between the line and each wing of the arrowhead. 
      Should be less than 90.

	**/
  arrowPathArrays: function(startx,starty,endx,endy,len,angle,curvature) { 
    
    if (startx === endx && starty === endy){
      return [[""],[""]];
    }   
    
    var start = new this.coord(startx, starty),
        tip = new this.coord(endx, endy),
        pathData   = [],
        arrowHeadData = [];
    
    // calculate control points c2 and c3
    var curveDistance = (tip.x - start.x) * curvature;
    var c2 = new this.coord(start.x+curveDistance, start.y),
        c3 = new this.coord(tip.x-curveDistance, tip.y);
        
    // we could draw a curved path now using just this information:
    // pathData.push("M", start.x, start.y);  // move to start of line
    // pathData.push("C", c2.x, c2.y, c3.x, c3.y, end.x, end.y); // curve line to the tip
    
    // draw arrow head
    var percLengthOfHead = len / this.getLengthOfCubicBezier(start, c2, c3, tip),
        centerBaseOfHead = this.getPointOnCubicBezier(percLengthOfHead, start, c2, c3, tip),
        theta  = Math.atan2((tip.y-centerBaseOfHead.y),(tip.x-centerBaseOfHead.x)),
        baseAngleA = theta + angle * Math.PI/180,
        baseAngleB = theta - angle * Math.PI/180,
        baseA      = new this.coord(endx - len * Math.cos(baseAngleA), endy - len * Math.sin(baseAngleA)),
        baseB      = new this.coord(endx - len * Math.cos(baseAngleB), endy - len * Math.sin(baseAngleB));

    pathData.push("M", start.x, start.y);  // move to start of line
    pathData.push("C", c2.x, c2.y, c3.x, c3.y, tip.x, tip.y); // curve line to the tip
    
    arrowHeadData.push("M", tip.x, tip.y);
    arrowHeadData.push("L", baseA.x, baseA.y);  // line to baseA
    arrowHeadData.push("L", baseB.x, baseB.y);  // line to baseB
    arrowHeadData.push("L", tip.x,   tip.y  );  // line back to the tip

    return [pathData, arrowHeadData];
  },
  
  getPointOnCubicBezier: function (percent,C1,C2,C3,C4) {
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    var pos = new this.coord();
    pos.x = C1.x*this.B1(percent) + C2.x*this.B2(percent) + C3.x*this.B3(percent) + C4.x*this.B4(percent);
    pos.y = C1.y*this.B1(percent) + C2.y*this.B2(percent) + C3.y*this.B3(percent) + C4.y*this.B4(percent);
    return pos;
  },
  
  getLengthOfCubicBezier: function (C1,C2,C3,C4)
  {
    var precision = 10,
        length    = 0,
        t,
        currentPoint,
        previousPoint;
        
    for (i = 0; i<precision; i++){
      t = i/precision;
      currentPoint = this.getPointOnCubicBezier(t, C1,C2,C3,C4);
      if (i > 0){
        var xDif = currentPoint.x - previousPoint.x,
            yDif = currentPoint.y - previousPoint.y;
        length += Math.sqrt((xDif*xDif) + (yDif*yDif));
      }
      previousPoint = currentPoint;
    }
    return length;
  },
  
  coord: function (x,y) {
    if(!x) x = 0;
    if(!y) y = 0;
    /* 
    *   Limit precision of decimals for SVG rendering.
    *   otherwise we get really long SVG strings, 
    *   and webkit error messsages like of this sort:
    *   "Error: Problem parsing d='<svg string with long dec>'"
    */
    x = Math.round(x * 1000)/1000;
    y = Math.round(y * 1000)/1000;
    return {x: x, y: y};
  },
  
  B1: function(t) { return t*t*t; },
  B2: function(t) { return 3*t*t*(1-t); },
  B3: function(t) { return 3*t*(1-t)*(1-t); },
  B4: function(t) { return (1-t)*(1-t)*(1-t); }
};
