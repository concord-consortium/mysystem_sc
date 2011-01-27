// ==========================================================================
// Project:   MySystem.CanvasView
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals MySystem LinkIt SCUI SC*/

/** @class

  (Document Your View Here)

  @extends SC.View
*/
sc_require('views/node');
// sc_require('LinkIt.CanvasView');
sc_require('core');
MySystem.CanvasView = LinkIt.CanvasView.extend(SCUI.Cleanup, { 
  allowMultipleSelection: YES,
  isDropTarget: NO, // we will add this as a drop target when we're dragging a new node
  computeDragOperations: function(drag, evt) { return SC.DRAG_COPY; },
  performDragOperation: function(drag, op) { 
    var image = drag.data.image;
    var title = drag.data.title;
    var xpos = drag.location.x;
    var ypos = drag.location.y;
    var offsetX = this.parentView.get('frame').x;
    var offsetY = this.get('frame').y;
    var node = MySystem.nodesController.addNode(title, image, xpos - offsetX - drag.data.clickX, ypos - offsetY - drag.data.clickY);
    MySystem.nodesController.deselectObjects(MySystem.nodesController.get('allSelected'));
    MySystem.nodesController.selectObject(node);
    return SC.DRAG_COPY; 
  },
  didCreateLayer: function () {
    var frame = this.get('frame');
    var canvasElem = this.$('canvas.base-layer');
    if (canvasElem) {
      canvasElem.attr('width', frame.width);
      canvasElem.attr('height', frame.height);
      if (canvasElem.length > 0) {
        var cntx = canvasElem[0].getContext('2d'); // Get the actual canvas object context
        if (cntx) {
          cntx.clearRect(0, 0, frame.width, frame.height);
          this._drawLinks(cntx);
        } else {
          SC.Logger.warn("MySystem.CanvasView.render(): Canvas object context is not accessible.");
        }
      } else {
        SC.Logger.warn("MySystem.CanvasView.render(): Canvas element array length is zero.");
      }
    } else {
      SC.Logger.warn("MySystem.CanvasView.render(): Canvas element is not accessible.");
    }
    return sc_super();
  },

  /* Override selection behavior from CollectionView. */
  select: function(indexes, extend) {
    if (extend && (indexes === null || indexes.length === 0)) return;
    return sc_super();
  },
  
  /** @private
  Copied from CollectionView and modified.

    Handles mouse down events on the collection view or on any of its
    children.

    The default implementation of this method can handle a wide variety
    of user behaviors depending on how you have configured the various
    options for the collection view.

    @param ev {Event} the mouse down event
    @returns {Boolean} Usually YES.
  */
  collectionViewMouseDown: function(ev) {

    // When the user presses the mouse down, we don't do much just yet.
    // Instead, we just need to save a bunch of state about the mouse down
    // so we can choose the right thing to do later.


    // find the actual view the mouse was pressed down on.  This will call
    // hitTest() on item views so they can implement non-square detection
    // modes. -- once we have an item view, get its content object as well.
    var itemView      = this.itemViewForEvent(ev),
        content       = this.get('content'),
        contentIndex  = itemView ? itemView.get('contentIndex') : -1,
        info, anchor, sel, isSelected, modifierKeyPressed,
        allowsMultipleSel = content.get('allowsMultipleSelection');

    info = this.mouseDownInfo = {
      event:        ev,  
      itemView:     itemView,
      contentIndex: contentIndex,
      at:           Date.now()
    };

    // become first responder if possible.
    this.becomeFirstResponder() ;

    // Toggle the selection if selectOnMouseDown is true
    if (this.get('useToggleSelection')) {
      if (this.get('selectOnMouseDown')) {
        if (!itemView) return ; // do nothing when clicked outside of elements

        // determine if item is selected. If so, then go on.
        sel = this.get('selection') ;
        isSelected = sel && sel.containsObject(itemView.get('content')) ;

        if (isSelected) {
          this.deselect(contentIndex) ;
        } else if (!allowsMultipleSel) {
          this.select(contentIndex, NO) ;
        } else {
          this.select(contentIndex, YES) ;
        }
      }
      return YES;
    }

    // recieved a mouseDown on the collection element, but not on one of the
    // childItems... unless we do not allow empty selections, set it to empty.
    // MODIFIED to not deselect if the modifier key is pressed and we select an empty item
    if (!itemView) {
      modifierKeyPressed = ev.ctrlKey || ev.metaKey;
      if (this.get('allowDeselectAll') && !modifierKeyPressed) this.select(null, false);
      return YES ;
    }
    
    // collection some basic setup info
    sel = this.get('selection');
    if (sel) sel = sel.indexSetForSource(content);
    
    isSelected = sel ? sel.contains(contentIndex) : NO;
    info.modifierKeyPressed = modifierKeyPressed = ev.ctrlKey || ev.metaKey ;
    
    
    // holding down a modifier key while clicking a selected item should 
    // deselect that item...deselect and bail.
    if (modifierKeyPressed && isSelected) {
      info.shouldDeselect = contentIndex >= 0;

    // if the shiftKey was pressed, then we want to extend the selection
    // from the last selected item
    } else if (ev.shiftKey && sel && sel.get('length') > 0 && allowsMultipleSel) {
      sel = this._findSelectionExtendedByShift(sel, contentIndex);
      anchor = this._selectionAnchor ; 
      this.select(sel) ;
      this._selectionAnchor = anchor; //save the anchor
      
    // If no modifier key was pressed, then clicking on the selected item 
    // should clear the selection and reselect only the clicked on item.
    } else if (!modifierKeyPressed && isSelected) {
      info.shouldReselect = contentIndex >= 0;
      
    // Otherwise, if selecting on mouse down,  simply select the clicked on 
    // item, adding it to the current selection if a modifier key was pressed.
    } else {
    
      if((ev.shiftKey || modifierKeyPressed) && !allowsMultipleSel){
        this.select(null, false);
      }
    
      if (this.get("selectOnMouseDown")) {
        this.select(contentIndex, modifierKeyPressed);
      } else {
        info.shouldSelect = contentIndex >= 0 ;
      }
    }
    
    // saved for extend by shift ops.
    info.previousContentIndex = contentIndex;

    return YES;
  },
  
  mouseDown: function(evt) {
    var pv, frame, globalFrame, canvasX, canvasY, itemView, menuPane, menuOptions;
    var linkSelection;

    this.collectionViewMouseDown(evt);

    // init the drag data
    this._dragData = null;

    if (evt && (evt.which === 3) || (evt.ctrlKey && evt.which === 1)) {
      var selectedLinks = this.get('selectedLinks');
      if (selectedLinks && !this.getPath('selection.length')) {
        menuOptions = [
          { title: "Delete Selected Links".loc(), target: this, action: 'deleteLinkSelection', isEnabled: YES }
        ];

        menuPane = SCUI.ContextMenuPane.create({
          contentView: SC.View.design({}),
          layout: { width: 194, height: 0 },
          itemTitleKey: 'title',
          itemTargetKey: 'target',
          itemActionKey: 'action',
          itemSeparatorKey: 'isSeparator',
          itemIsEnabledKey: 'isEnabled',
          items: menuOptions
        });
        
        menuPane.popup(this, evt);
      }
    }
    else {
      var multiSelect = evt.metaKey && this.get('allowMultipleSelection');
      pv = this.get('parentView');
      frame = this.get('frame');
      globalFrame = pv ? pv.convertFrameToView(frame, null) : frame;
      canvasX = evt.pageX - globalFrame.x;
      canvasY = evt.pageY - globalFrame.y;
      this._selectLink( {x: canvasX, y: canvasY}, multiSelect );

      itemView = this.itemViewForEvent(evt);
      if (itemView) {
        this._dragData = SC.clone(itemView.get('layout'));
        this._dragData.startPageX = evt.pageX;
        this._dragData.startPageY = evt.pageY;
        this._dragData.view = itemView;
        this._dragData.didMove = NO; // hasn't moved yet; drag will update this
      }
    }
    
    return YES;
  },

  selectLink: function(link) {
     link.set('isSelected', true);
     this.set('linkSelection', link);
     this.set('selectedLinks', [link]);
  }
});
