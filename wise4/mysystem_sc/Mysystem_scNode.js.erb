/*globals Mysystem_scNode Node MYSYSTEM_SCSTATE NodeFactory NodeFactory eventManager createContent */

Mysystem_scNode.prototype = new Node();
Mysystem_scNode.prototype.constructor = Mysystem_scNode;
Mysystem_scNode.prototype.parentNode = Node.prototype;

/**
  Monkey patch Node.injectBaseRef()
  
  In order to display mysystem_sc.html, WISE4 loads its contents via synchronous xhr and inserts those contents into
  iframe#ifrm inside vle.html after performing some "surgery" on the text content of mysystem_sc.html.
  
  (This is how WISE4 displays the html of any step.)
  
  Because iframe's contents are set by dynamically inserting text into a pre-existing iframe, rather than by setting
  the 'src' attribute of the iframe and allowing the browser to update the iframe itself, one crucial piece of
  information that the browser does not have when interpreting the iframe's content is its origin URL.
  
  Therefore one of the "surgical" steps performed by WISE4 is to call this.injectBaseRef() on the html contents. This 
  method inserts a <base> element into the document's <head>. The <base> element causes relative urls inside 
  mysystem_sc.html to be calculated relative to the value of the <base> element's 'href' attribute.
  
  (Note that the href of a <base> element must be an absolute url, with hostname, or else it is ignored.)
  
  However, by default, injectBaseRef() inserts an href value something like 'http://localhost:8080/curriculum/8'
  
  In order for the relative paths in the SproutCore version of MySystem to resolve correctly, we need the href value to
  be "http://<host>/vlewrapper/vle/node/mysystem_sc/" instead.
  
  This monkey patch works by setting the 'ContentBaseUrl' of this Node object. This property is normally undefined for
  mysystem_sc, but injectBaseRef() will check that property first for the href value to use.
  
  Note that inserting a <base> element inside the precompiled version of mysystem_sc.html will cause injectBaseRef
  to skip inserting a <base> element. Since <base> elements must be absolute URLs, this would be inadvisable unless
  we also update the server to dynamically insert the correct hostname into the <base> element.
  
  @author Richard Klancer <rpk@pobox.com>
  5/3/2011
*/
Mysystem_scNode.prototype.injectBaseRef = function () {
  this.ContentBaseUrl = window.location.protocol + '//' + window.location.host + '/vlewrapper/vle/node/mysystem_sc/';
  return Node.prototype.injectBaseRef.apply(this, arguments);
};

/*
 * the name that displays in the authoring tool when the author creates a new step
 */
Mysystem_scNode.authoringToolName        = "MySystem System Diagram";
Mysystem_scNode.authoringToolDescription = "A system diagramming tool for describing energy flows through a system";

/**
 * This is the constructor for the Node
 * 
 * @param nodeType
 * @param view
 */
function Mysystem_scNode(nodeType, view) {
  this.view = view;
  
  // patch this.view.injectVleUrl (which attempts to rewrite relative urls found in our html) to make it a no-op
  this.view.injectVleUrl = function (text) {
    return text;
  };
  
  this.type = nodeType;
  this.prevWorkNodeIds = [];
}

/**
 * This function is called when the vle loads the step and parses
 * the previous student answers, if any, so that it can reload
 * the student's previous answers into the step.
 * 
 * @param stateJSONObj
 * @return a new state object
 */
Mysystem_scNode.prototype.parseDataJSONObj = function (stateJSONObj) {
  return MYSYSTEM_SCSTATE.prototype.parseDataJSONObj(stateJSONObj);
};

/**
 * This function is called if there needs to be any special translation
 * of the student work from the way the student work is stored to a
 * human readable form. For example if the student work is stored
 * as an array that contains 3 elements, for example
 * ["apple", "banana", "orange"]
 *  
 * and you wanted to display the student work like this
 * 
 * Answer 1: apple
 * Answer 2: banana
 * Answer 3: orange
 * 
 * you would perform that translation in this function.
 * 
 * Note: In most cases you will not have to change the code in this function
 * 
 * @param studentWork
 * @return translated student work
 */
Mysystem_scNode.prototype.translateStudentWork = function (studentWork) {
  return studentWork;
};

/**
 * This function is called when the student exits the step. It is mostly
 * used for error checking.
 * 
 * Note: In most cases you will not have to change anything here.
 */
Mysystem_scNode.prototype.onExit = function () {
  //check if the content panel has been set
  if (this.contentPanel) {
    try {
      /*
       * check if the onExit function has been implemented or if we
       * can access attributes of this.contentPanel. if the user
       * is currently at an outside link, this.contentPanel.onExit
       * will throw an exception because we aren't permitted
       * to access attributes of pages outside the context of our
       * server.
       */
      if (this.contentPanel.onExit) {
        try {
          // run the on exit cleanup
          this.contentPanel.onExit();         
        } catch (err1) {
          // error when onExit() was called, e.g. mysystem editor undefined
        }
      } 
    } catch (err2) {
      /*
       * an exception was thrown because this.contentPanel is an
       * outside link. we will need to go back in the history
       * and then trying to render the original node.
       */
      history.back();
    }
  }
};

/**
 * Renders the student work into the div. The grading tool will pass in a
 * div id to this function and this function will insert the student data
 * into the div.
 * 
 * @param divId the id of the div we will render the student work into
 * @param nodeVisit the student work
 * @param childDivIdPrefix (optional) a string that will be prepended to all the 
 * div ids use this to prevent DOM conflicts such as when the show all work div
 * uses the same ids as the show flagged work div
 * @param workgroupId the id of the workgroup this work belongs to
 * 
 * Note: you may need to add code to this function if the student
 * data for your step is complex or requires additional processing.
 * look at SensorNode.renderGradingView() as an example of a step that
 * requires additional processing
 *
 * TODO
 */
Mysystem_scNode.prototype.renderGradingView = function (divId, nodeVisit, childDivIdPrefix, workgroupId) {
  /*
   * Get the latest student state object for this step
   * 
   * e.g. if you are creating a quiz step you would change it to quizState
   */
  var diagramState = nodeVisit.getLatestWork();

  var studentWork = diagramState.getStudentWork();
  
  // put the student work into the div
  $('#' + divId).html(studentWork);
};

/**
 * Get the html file associated with this step that we will use to
 * display to the student.
 * 
 * @return a content object containing the content of the associated
 * html for this step type
 */
Mysystem_scNode.prototype.getHTMLContentTemplate = function () {
  return createContent('node/mysystem_sc/mysystem_sc.html');
};

/*
 * Add this node to the node factory so the vle knows it exists.
 */
NodeFactory.addNode('Mysystem_scNode', Mysystem_scNode);

//used to notify scriptloader that this script has finished loading
if (typeof eventManager !== 'undefined'){
  eventManager.fire('scriptLoaded', 'vle/node/mysystem_sc/Mysystem_scNode.js');
}