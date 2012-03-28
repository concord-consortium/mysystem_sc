/**
 * See also frameworks/jasmine-sproutcore/jasmin-sproutcore.js which provides other
 * Event helper macros.
 *
 **/
function fireEvent(view, eventName, eventAttributes) {
 var layer = view.get('layer'),
     evt = SC.Event.simulateEvent(layer, eventName, eventAttributes);

 SC.Event.trigger(layer, eventName, evt);
}


function firePointerEvent(view, eventName, x, y) {
  var offset = view.$().offset(),
      leftX  = offset.left,
      topY   = offset.top;
      
  fireEvent(view, eventName, { pageX: leftX + x, pageY: topY + y });
}

function simulateKeyPressWithAttributes(view, attribs) {
  fireEvent(view,  'keydown',  attribs);
  fireEvent(view,  'keypress', attribs);
  fireEvent(view,  'keyup',    attribs);
}

// see also frameworks/jasmine-sproutcore/jasmin-sproutcore.js  fillin() function
// which probably works better for non-raphael form fields.
function simulateKeyPress(view, letter) {
  simulateKeyPressWithAttributes(view, { charCode: letter, which: letter });
}

function simulateBackspace(view) {
  simulateKeyPressWithAttributes(view, { keyCode: SC.Event.KEY_BACKSPACE });
}

// see also frameworks/jasmine-sproutcore/jasmin-sproutcore.js  fillin() function
// which probably works better for non-raphael form fields.
function simulateTextEntry(view, text) {
  var i = 0;
  for (i = 0; i < text.length; i++) {
    simulateKeyPress(view,text.charCodeAt(i));
  }
}

// This is a modified version of what is in jasmin-sproutcore
// that version uses jasmine's asynchronous api but doing that appears unnecessary and 
// would complicate the use of this function
function simulateClickOnSelector(selector,selectorB) {
  var target = SC.CoreQuery(selector);
  var error  = 'Could not find ' + selector + ' on the page';
  if(target.length === 0 && selectorB) {
    target = SC.CoreQuery(selectorB);
    if (target.length === 0) {
      error  = error + 'Could not find ' + selectorB + ' on the page';
    }
  }
  if(target.length === 0) {
    throw new Error(error);
  }
  SC.Event.trigger(target, 'mouseover');
  SC.Event.trigger(target, 'mousedown');
  SC.Event.trigger(target, 'focus');
  SC.Event.trigger(target, 'mouseup');
}

function simulateClick(view, offX, offY) {
  if(!!!offX) { offX = 10; }
  if(!!!offY) { offY = 10; }
  firePointerEvent(view, 'mousedown', offX, offY);
  firePointerEvent(view, 'mouseup',   offX, offY);
}

function simulateDoubleClick(view, offX, offY) {
  simulateClick(view, offX, offY);
  simulateClick(view, offX, offY);
}