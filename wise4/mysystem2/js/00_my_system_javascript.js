SC.stringsFor("English",{});Forms=SC.Object.create({NAMESPACE:"Forms",VERSION:"0.1.0"});
if(SC.Animatable){Forms._DefaultAnimation={visibleState:{opacity:1,display:"block"},hiddenState:{opacity:0,display:"none"},labelVisibleState:{opacity:1,display:"block"},labelHiddenState:{opacity:0,display:"none"},fieldVisibleState:{opacity:1,display:"block"},fieldHiddenState:{opacity:0,display:"none"},fieldTransitions:{opacity:0.125,display:0.5},labelTransitions:{opacity:0.125,display:0.5},transitions:{opacity:{duration:0.125,timing:SC.Animatable.TIMING_EASE_IN_OUT},top:{duration:0.25,timing:SC.Animatable.TIMING_EASE_IN_OUT},left:0.25,display:0.5},show:function(){this.resetAnimation();
this.set("isHidden",NO);this.set("needsDisplay",YES);this.layoutDidChange()},display:function(){this.adjust(this.visibleState)
},hide:function(){this.adjust(this.hiddenState);this.set("isHidden",YES);this.layoutDidChange()
},showLabel:function(){var a=this.get("labelView");a.adjust(this.labelVisibleState);
if(a.sizeMayChange){a.sizeMayChange()}},hideLabel:function(){this.get("labelView").adjust(this.labelHiddenState)
},showField:function(){var a=this.get("field");a.adjust(this.fieldVisibleState);if(a.sizeMayChange){a.sizeMayChange()
}},hideField:function(){this.get("field").adjust(this.fieldHiddenState)}};Forms.FormAnimation={};
Forms.FormAnimationHacks={};if(SC.browser.mozilla){SC.mixin(Forms.FormAnimationHacks,{initMixin:function(){if(SC.browser.mozilla){this._cssTransitionFor.top=NO;
this._cssTransitionFor.left=NO;this._original_animateTickPixel=this._animateTickPixel;
this._animateTickPixel=this._replace_animateTickPixel}},_animation_getTextFields:function(g){if(!g){g={}
}var a=this.get("_displayFields"),b=a.length,c;var f=null;for(c=0;c<b;c++){var e=a[c];
if(e._animation_getTextFields){var d=e._animation_getTextFields(g);if(!f){f=g.next_field
}g=d}}this.start_field=f;this.last_field=g;return g},_replace_animateTickPixel:function(){this.holder._original_animateTickPixel.apply(this,arguments);
var a=this.holder.start_field;while(a){a._applyFirefoxCursorFix();if(a==this.last_field){break
}a=a.next_field}},_relayout_hacks:function(){this._animation_getTextFields()}})}Forms._FormFieldAnimation={preInitMixin:function(){this.fieldClass=this.fieldClass.extend(SC.Animatable,{transitions:this.fieldTransitions});
this.labelView=this.labelView.extend(SC.Animatable,{transitions:this.labelTransitions})
},transitions:{left:null,top:null,opacity:0.25,display:0.5}};SC.mixin(Forms.FormAnimation,{formMixin:[SC.Animatable,Forms._DefaultAnimation,Forms.FormAnimationHacks],rowMixin:[SC.Animatable,Forms._DefaultAnimation,Forms.FormAnimationHacks]});
Forms.DemoTransitions={transitions:{opacity:0.75,top:0.75,left:0.75,display:1.25}};
Forms.FormAnimation.DemoMode={formMixin:[Forms.DemoTransitions],rowMixin:[Forms.DemoTransitions]}
}Forms.FormView=SC.View.extend(SC.Editable,{concatenatedProperties:["fields","rowMixin","fieldMixin","formMixin"],fields:[],rowSpacing:10,regularLabelWidth:200,fieldsDidChange:function(){this._updateFields()
}.observes("fields"),autoHide:NO,editsByDefault:YES,isEmpty:NO,isHidden:NO,firstKeyView:null,lastKeyView:null,needsDisplay:NO,_displayFields:[],_displayFieldsDidChange:function(){this.relayoutFields()
}.observes("_displayFields"),_fieldPositions:[],_invalidateFrom:null,init:function(){if(this.get("editsByDefault")){this.set("isEditing",YES)
}arguments.callee.base.apply(this,arguments)},createChildViews:function(){arguments.callee.base.apply(this,arguments);
this._updateFields()},_createChildField:function(c,d){d=this.applyMixins(d);var b=this.createChildView(d);
var a;if(c){a=c}if(!SC.none(b.get("fieldKey"))){a=b.fieldKey}b.set("contentValueKey",a);
if(SC.none(b.contentBinding)){b.bind("content",[this,"content"])}b.bind("regularLabelWidth",[this,"regularLabelWidth"]);
if(SC.none(b.get("fieldLabel"))){b.set("fieldLabel",c.humanize().capitalize())}return b
},applyMixins:function(b){if(SC.none(b.prototype.mixinDesign)){return b}var a=null;
if(b.kindOf(Forms.FormRowView)){a=this.rowMixin}else{if(b.kindOf(Forms.FormFieldView)){a=this.fieldMixin
}else{if(b.kindOf(Forms.FormView)){a=this.formMixin}}}a=SC.A(a);a.unshift({fieldMixin:this.fieldMixin,rowMixin:this.rowMixin,formMixin:this.formMixin});
if(b.prototype.mixinDesign){a=a.concat(SC.A(b.prototype.mixinDesign))}return b.extend.apply(b,a)
},beginEditing:function(){if(this.get("isEditing")){return YES}var a=this.get("_displayFields"),c=a.length;
for(var b=0;b<c;b++){var d=a[b];d.beginEditing()}this.set("isEditing",YES);return YES
},commitEditing:function(){if(!this.get("isEditing")){return YES}var a=this.get("_displayFields"),c=a.length;
for(var b=0;b<c;b++){var d=a[b];d.commitEditing()}this.set("isEditing",NO);return YES
},_updateFields:function(){var b=this.get("fields");var a=[];this.beginPropertyChanges();
var c,e,f=b.length;for(var d=0;d<f;d++){e=c=b[d];if(!e){continue}if(typeof e===SC.T_STRING){c=this[e]
}if(!c){console.error("No view found for "+e);continue}if(c.isClass){c=this._createChildField(e,c);
this.appendChild(c);this[e]=c}a.push(c);if(this.get("isEditing")){c.beginEditing()
}}this.set("_displayFields",a);this.endPropertyChanges()},emptinessDidChangeFor:function(a){this._calculateEmptiness()
},_calculateEmptiness:function(){var e=this.get("_displayFields"),a=e.length;var c=YES;
for(var b=0;b<a;b++){var d=e[b];if(!d.get("isEmpty")&&!d.get("isHidden")){c=NO;break
}}this.setIfChanged("isEmpty",c)}.observes("_displayFields"),emptinessDidChange:function(){var a=this.get("parentView");
if(a&&a.emptinessDidChangeFor){a.emptinessDidChangeFor(this)}}.observes("isEmpty"),didUpdateLayer:function(){arguments.callee.base.apply(this,arguments);
this.relayoutFields()},layoutChildViews:function(){this.relayoutFields();arguments.callee.base.apply(this,arguments)
},hiddenCouldChange:function(){var a=NO;if(this.get("autoHide")&&this.get("isEmpty")){a=YES
}if(a!==this.get("isHidden")){if(a){this.hide()}else{this.show()}this.relayoutFields()
}}.observes("autoHide","isEmpty"),hide:function(){this.set("isVisible",NO);this.set("isHidden",YES);
this.layoutDidChange()},show:function(){this.set("isHidden",NO);this.set("isVisible",YES);
this.layoutDidChange()},relayoutFields:function(){var a=0,b=0,f=this.get("_displayFields"),e=f.length,k=this._fieldPositions,g=null;
var c=this.get("regularLabelWidth");var n=0;for(var l=0;l<e;l++){var j=f[l];if(j.get("isHidden")){continue
}if(j.getActualLabelWidth){n=Math.max(n,j.getActualLabelWidth())}}this.setIfChanged("regularLabelWidth",n);
for(var d=0;d<e;d++){var o=f[d];if(o.get("isHidden")){continue}if(o.firstKeyView){if(g){g.nextValidKeyView=o.firstKetView
}o.firstKeyView.previousValidKeyView=g;o.lastKeyView.nextValidKeyView=null;g=o.lastKeyView
}o.adjust("top",b);if(o.get("needsDisplay")){o.display()}k[d]=b;var m=o.get("layout").height||0;
b+=m;var h=o.get("rowSpacing");if(SC.none(h)){h=this.get("rowSpacing")}if(h&&m>0){b+=h
}}this.set("lastKeyView",g)}});SC.mixin(Forms.FormView,{row:function(b,a){return Forms.FormRowView.row(b,a)
},field:function(b,a){return Forms.FormFieldView.field(b,a)}});Forms.FormLabelView=SC.LabelView.extend({classNames:["forms-label"],measuredWidth:0,measuredHeight:0,autoResize:YES,sizeMayChange:function(){if(this.get("autoResize")&&this.get("isVisible")){this.measure()
}}.observes("isVisible","autoResize"),didUpdateLayer:function(){arguments.callee.base.apply(this,arguments);
if(this.get("autoResize")){this.measure()}},measure:function(){var a=this.get("layer");
if(!a){return}var b=SC.metricsForString(this.get("value"),a);var c=this.get("layout");
if(!c){c={}}if(c.width!=b.width||c.height!=b.height){this.adjust({width:b.width+1,height:b.height}).updateLayout()
}}});require("views/form_label");Forms.FormFieldView=SC.View.extend(SC.Editable,SC.Control,{concatenatedProperties:["applyMixins"],autoHide:NO,autoResize:YES,emptyValues:[undefined,null,""],isEmpty:function(){if(this.get("isEditing")){return NO
}var a=this.get("emptyValues");if(a.indexOf(this.get("value"))>=0){return YES}return NO
}.property("emptyValues","value","isEditing").cacheable(),isHidden:NO,stealsFocus:NO,classNames:["sc-form-field-view"],fieldClass:SC.TextFieldView,field:null,activeView:null,labelView:Forms.FormLabelView.design({layout:{top:0,left:0},autoResize:YES}),preInitMixin:function(){},init:function(){var b=SC.$A(this.preInitMixin);
var c=0,a=b.length;for(c=0;c<a;c++){b[c].call(this)}arguments.callee.base.apply(this,arguments)
},createChildViews:function(){arguments.callee.base.apply(this,arguments);this.setupLabelView();
this.setupFieldView();this.updateEditingState();this.set("activeView",this.get("labelView"));
this.set("firstKeyView",this.field);this.set("lastKeyView",this.field)},setupLabelView:function(){this.labelView=this.createChildView(this.get("labelView"));
this.labelView.bind("value",[this,"value"]);this.labelView.bind("autoResize",[this,"autoResize"]);
this.appendChild(this.labelView)},setupFieldView:function(){this.field=this.createChildView(this.get("fieldClass"));
this.field.bind("value",[this,"value"]);this.field.bind("autoResize",[this,"autoResize"]);
this.appendChild(this.field)},layoutDidChangeFor:function(a){arguments.callee.base.apply(this,arguments);
if(a==this.get("activeView")){this._updateActiveLayout()}},_updateActiveLayout:function(){var c=this.get("activeView");
if(!c){return}var d=c.computeFrameWithParentFrame(null);var a=this.get("layer");if(a){var b=null;
if(document.defaultView&&document.defaultView.getComputedStyle){b=document.defaultView.getComputedStyle(a,null)
}else{b=a.currentStyle}if(b.paddingLeft){d.width+=parseInt(b.paddingLeft)}if(b.paddingTop){d.height+=parseInt(b.paddingTop)
}if(b.paddingRight){d.width+=parseInt(b.paddingRight)}if(b.paddingBottom){d.height+=parseInt(b.paddingBottom)
}}this.adjust({width:d.width,height:d.height});this.layoutDidChange()}.observes("activeView"),isEmptyDidChange:function(){var a=this.get("parentView");
if(!a){return}if(a.emptinessDidChangeFor){a.emptinessDidChangeFor(this)}}.observes("isEmpty"),calculateHiddenness:function(){var a=this.get("isHidden");
var b=NO;if(this.get("isEmpty")&&this.get("autoHide")){b=YES}if(this.get("isEditing")){b=NO
}if(a!==b){this.setIfChanged("isHidden",b);this.setIfChanged("isVisible",!b);this.layoutDidChange()
}}.observes("autoHide","isEmpty"),beginEditing:function(){if(this.get("isEditing")){return YES
}this.set("activeView",this.get("field"));this.set("isEditing",YES);this.calculateHiddenness();
if(this.stealsFocus){SC.Timer.schedule({interval:1,target:this,action:"stealFocus"})
}},stealFocus:function(){try{this.get("field").beginEditing()}catch(a){}},discardEditing:function(){return !this.get("isEditing")
},commitEditing:function(){if(!this.get("isEditing")){return YES}this.set("activeView",this.get("labelView"));
this.set("isEditing",NO);this.calculateHiddenness()},isEditingDidChange:function(){this.updateEditingState()
}.observes("isEditing"),updateEditingState:function(){var a=this.get("isEditing");
if(!a){this.hideField();this.showLabel()}else{this.showField();this.hideLabel()}},showField:function(){this.get("field").set("isVisible",YES)
},hideField:function(){this.get("field").set("isVisible",NO)},showLabel:function(){this.get("labelView").set("isVisible",YES)
},hideLabel:function(){this.get("labelView").set("isVisible",NO)}});Forms.FormFieldView.mixin({_specializations:{},field:function(g,e){var f={};
var b=this._specializations[SC.guidFor(g)];if(!b){b=Forms.FormFieldView;SC.mixin(f,{layout:{left:0,width:200,height:22,top:0}})
}SC.mixin(f,e);var c=SC.clone(f);var a=["autoResize","fieldKey","classNames","emptyValue","autoHide","stealsFocus"];
for(var d=0;d<a.length;d++){if(!SC.none(f[a[d]])){delete f[a[d]]}}c.fieldClass=g.design(f);
return b.design({mixinDesign:c})},specialize:function(c,b){var a=this.extend(b);this.registerSpecialization(c,a);
return a},registerSpecialization:function(a,b){this._specializations[SC.guidFor(a)]=b
}});require("views/form_field");Forms.FormCheckboxView=Forms.FormFieldView.extend({layout:{height:16,width:120},setupLabelView:function(){},setupFieldView:function(){arguments.callee.base.apply(this,arguments);
this.labelView=this.field},updateEditingState:function(){if(this.get("isEditing")){this.field.set("isEnabled",YES)
}else{this.field.set("isEnabled",NO)}}});Forms.FormFieldView.registerSpecialization(SC.CheckboxView,Forms.FormCheckboxView);
require("views/form_field");Forms.FormRadioView=Forms.FormFieldView.extend({displayValue:"",init:function(){this.fieldClass=this.fieldClass.extend({itemHeight:18,autoResize:NO,autoResizeDidChange:function(){this.measure()
}.observes("autoResize"),didUpdateLayer:function(){arguments.callee.base.apply(this,arguments);
this.measure()},layoutChildViews:function(){arguments.callee.base.apply(this,arguments);
this.measure()},measure:function(){if(this.get("autoResize")){var e=this.get("layer");
if(!e){return}var c=e.offsetHeight,b=e.offsetWidth;e.style.height="0px";e.style.width="0px";
var a=e.scrollHeight;var d=e.scrollWidth;e.style.height=c+"px";e.style.width=b+"px";
if(a!=this.get("layout").height){this.adjust("height",a).updateLayout()}if(d!=this.get("layout").width){this.adjust("width",d).updateLayout()
}}}});arguments.callee.base.apply(this,arguments)},setupLabelView:function(){this.labelView=this.createChildView(this.get("labelView"));
this.labelView.bind("value",[this,"displayValue"]);this.labelView.bind("autoResize",[this,"autoResize"]);
this.appendChild(this.labelView)},valueDidChange:function(){var f=this.get("items");
var g=this.get("value");if(!f){this.set("displayValue",g);return}var e,b=f.length;
var a=this.get("itemValueKey"),j=this.get("itemTitleKey");for(e=0;e<b;e++){var h=f.objectAt(e);
var c="",d="";if(SC.typeOf(h)===SC.T_ARRAY){d=h[0];c=h[1]}else{if(h){if(j){d=h.get?h.get(j):h[j]
}else{d=(h.toString)?h.toString():null}if(a){c=h.get?h.get(a):h[a]}else{c=h}}}if(!d){d=c
}if(g==c){this.set("displayValue",d);return}}}.observes("value","itemValueKey","itemTitleKey","items")});
Forms.FormFieldView.registerSpecialization(SC.RadioView,Forms.FormRadioView);Forms.FormRowView=Forms.FormView.extend({editsByDefault:NO,fieldLabel:null,classNames:["sc-form-row-view"],regularLabelWidth:200,rowSpacing:null,labelVerticalAlign:"smart-center",labelVerticalOffset:0,rowOrientation:"left-to-right",labelSpacing:10,labelView:Forms.FormLabelView.design({layout:{right:0,top:0},classNames:["form-row-label"],autoResize:YES}),labelContainer:SC.View.design({layout:{left:0,width:150,height:18,top:0}}),layout:{left:0,right:0,height:32},_labelLayoutDidChange:function(){this.layoutDidChange()
}.observes("labelOrientation","labelVerticalAlign","labelVerticalOffset","labelSpacing","fieldLabel"),_regularLabelWidthDidChange:function(){this.relayoutFields()
}.observes("regularLabelWidth"),getActualLabelWidth:function(){var b=this.get("labelView");
var a=b.get("layout").width;if(!a){return 0}return a},createChildViews:function(){arguments.callee.base.apply(this,arguments);
if(this.labelContainer.isClass){this.labelContainer=this.createChildView(this.labelContainer);
this.labelView=this.labelContainer.createChildView(this.labelView);this.labelView.bind("value",[this,"fieldLabel"]);
this.labelContainer.appendChild(this.labelView);this.appendChild(this.labelContainer)
}this._updateFields()},layoutDidChangeFor:function(a){arguments.callee.base.apply(this,arguments);
if(a===this.labelView){this._labelLayoutDidChange()}},didUpdateLayer:function(){arguments.callee.base.apply(this,arguments);
var a=this.get("labelView");if(a.measure){a.measure()}},relayoutFields:function(){if(this.labelView.isClass){return
}if(this.get("isHidden")){return}var j=this.get("labelContainer");var r=this.get("labelView").get("frame"),e=this.get("rowOrientation"),m=this.get("labelVerticalAlign"),n=this.get("regularLabelWidth"),d=r.height,u=this.get("fieldLabel");
var q=0,p=0,b=this.get("frame").width,f=d,t=null,a=null;if(u!==NO){if(e=="left-to-right"){q=n+this.get("labelSpacing")
}b-=n}else{j.set("isVisible",NO);d=0}var o=this.get("_displayFields"),k=o.length;
for(var s=0;s<k;s++){var c=o[s];if(c.get("isHidden")){continue}if(c.firstKeyView){if(t){t.nextValidKeyView=c.firstKeyView
}c.firstKeyView.previousValidKeyView=t;c.lastKeyView.nextValidKeyView=null;t=c.lastKeyView;
if(!a){a=c.firstKeyView}}var l=c.get("layout");var g=c.computeFrameWithParentFrame(null);
if(g){if(g.x!=q||g.y!=p){c.adjust({left:q,top:p})}if(c.get("needsDisplay")){c.display()
}var h=c.get("fieldSpacing");if(SC.none(h)){h=0}q+=g.width+h;f=Math.max(p+g.height,f)
}}if(m=="smart-center"){if(f<2*d){j.adjust({top:null,centerY:0})}else{j.adjust({top:this.get("labelVerticalOffset"),centerY:null})
}}else{if(m=="center"){j.adjust({top:null,centerY:this.get("labelVerticalOffset")})
}else{if(m=="top"){j.adjust({top:this.get("labelVerticalOffset"),centerY:null})}}}j.adjust({width:n,height:d});
this.adjust("height",f);this.set("firstKeyView",a);this.set("lastKeyView",t);this.layoutDidChange()
}});Forms.FormRowView.mixin({row:function(c,b){if(!b){b=c;c=null}if(c){var d=b;var e=d.fieldLabel;
var a=NO;if(b.autoHide){a=b.autoHide;b.autoHide=NO}b={fields:["autoField"],fieldLabel:e,autoField:Forms.FormView.field(c,d),autoHide:a}
}return Forms.FormRowView.design({mixinDesign:b})}});Forms.FormTextFieldView=Forms.FormFieldView.extend({init:function(){var a=this;
this.fieldClass=this.fieldClass.extend({_topOffsetForFirefoxCursorFix:0,init:function(){arguments.callee.base.apply(this,arguments)
},keyDown:function(b){a.keyDown(b,this.$input()[0]);return arguments.callee.base.apply(this,arguments)
},keyUp:function(b){a.keyUp(b,this.$input()[0]);return arguments.callee.base.apply(this,arguments)
},beginEditing:function(){arguments.callee.base.apply(this,arguments);var b=this.$input()[0];
if(b){SC.Timer.schedule({interval:1,target:this,action:"performAutoSelect"})}},performAutoSelect:function(){var b=this.$input()[0];
if(b){b.select()}},didUpdateLayer:function(){arguments.callee.base.apply(this,arguments);
this._applyFirefoxCursorFix()},_animation_getTextFields:function(b){b.next_field=this;
this.next_field=null;return this}});arguments.callee.base.apply(this,arguments)},sizeMayChange:function(){if(this.get("autoResize")&&this.get("isVisible")){this.measure()
}}.observes("isVisible","autoResize"),didUpdateLayer:function(){arguments.callee.base.apply(this,arguments);
if(this.get("autoResize")){this.measure(null)}},keyDown:function(b,a){arguments.callee.base.apply(this,arguments);
if(b.metaKey||b.ctrlKey){return}var c=b.getCharString();if(b.keyCode==13&&this.get("field").get("isTextArea")){c="\nx"
}if(c){this.measure(a.value+c)}},keyUp:function(b,a){if(a){this.measure(a.value)}},_animation_getTextFields:function(a){return this.get("field")._animation_getTextFields(a)
},measure:function(h){var f=!this.get("field").get("isTextArea");if(typeof h!="string"){h=this.get("value")
}var e=this.get("field").$input()[0];if(!e){return}if(!h||h===""){h=this.getPath("field.hint")
}else{var b=h.lastIndexOf("\n");if(b==h.length-1){h+="x"}}var i=SC.metricsForString(h,e);
var g=6,c=9;if(SC.browser.webkit){g+=3}var a={width:i.width+g,height:i.height+c};
var d=this.get("layout");if(!d){d={}}if(f){this.field.adjust("width",a.width);e.style.width=(3+i.width)+"px"
}e.style.height=(3+i.height)+"px";this.field.adjust({height:a.height}).updateLayout();
this.field._applyFirefoxCursorFix()}.observes("value")});Forms.FormTextFieldView.registerSpecialization(SC.TextFieldView,Forms.FormTextFieldView);
Forms.ModelFormView=Forms.FormView.extend({classNames:["forms-model-view"],autoHide:NO,autogenerateWith:null,autogenerated:YES,init:function(){this._rebuildFields();
arguments.callee.base.apply(this,arguments)},recordTypeDidChaged:function(){console.log("Changed. Rebuild...");
this._rebuildFields()}.observes("autogenerateWith"),_rebuildFields:function(){console.log("Rebuilding");
var a=this.get("fields"),g=this.get("autogenerateWith"),e,b,c;if(SC.typeOf(g)===SC.T_STRING){g=SC.objectForPropertyPath(g)
}if(!g){console.error("No such record",g);return}if(g&&g.prototype){e=g.prototype.attributeFields
}else{e=g.attributeFields}console.log(e);for(var d in e){var f;b=g.prototype?g.prototype.primaryKey:g.primaryKey;
if(d==b||d=="contentValueKey"){continue}f=this._mapField(e[d],d);this[d]=f;a.push(d)
}this.set("fields",a)},_mapField:function(f,a){var g=this.get("autogenerateWith"),b=f.get("type"),d,e;
console.log(f,a);if(SC.instanceOf(f,SC.RecordAttribute)){if(g&&SC.typeOf(g)===SC.T_OBJECT){d=g.get(a);
if(!d){d=f.get("defaultValue")}}else{d=f.get("defaultValue")}console.log(d);switch(b){case"Text":e=this.textField(a,d);
break;case"Boolean":e=this.booleanField(a,d);break;case"File":e=this.fileField(a,d);
break;default:e=this.defaultField(a,d)}}else{if(SC.instanceOf(f,SC.ManyAttribute)){if(g&&SC.typeOf(g)===SC.T_OBJECT){d=g.get(a)
}var c=this.manyToManyField(a,d);console.log("M2M",c,"value:",d);e=c}}return e},defaultField:function(b,c){var a={autoResize:NO,autoHide:NO,layout:{left:0,right:0,top:0,bottom:0,width:200,height:21},value:c,fieldLabel:b.titleize()};
return Forms.FormView.row(SC.TextFieldView,a)},manyToManyField:function(b,e){var a={content:e};
console.log("M2M value:",e);var d={autoResize:NO,fieldKey:b,layout:{height:100,width:200,top:0,left:0}};
var c=SC.ScrollView.design({contentView:SC.ListView.design(a)});return Forms.FormView.row(c,d)
},booleanField:function(b,c){var a={autoResize:NO,layout:{height:21,left:120,right:20,centerY:0,width:200},fieldKey:b,fieldLabel:NO,value:c,displayTitle:b.titleize(),contentValueKey:NO,parentView:this};
return Forms.FormView.row(SC.CheckboxView,a)},textField:function(b,c){var a={autoResize:NO,layout:{height:100,left:120,right:20,centerY:0},fieldKey:b,value:c,displayTitle:b.titleize(),isTextArea:YES,parentView:this};
return Forms.FormView.row(SC.TextFieldView,a)},fileField:function(b,c){var a={autoResize:NO,layout:{height:21,left:120,right:20,centerY:0},fieldKey:b,value:c,parentView:this};
return Forms.FormView.row(SC.FileFieldView,a)},isDirty:NO,errors:function(){},isValid:function(){return this.get("errors").length===0
}.property("errors"),validate:function(){},commit:function(){},isCommitting:NO,canCommit:function(){return this.get("isValid")&&this.get("isEnabled")
}.property("isValid","isEnabled"),reset:function(){}});Forms.FormView.transforms={};
Forms.FormView.registerTransform=function(a,b){Forms.FormView.transforms[SC.guidFor(a)]=b
};Forms.FormView.registerTransform(Boolean,{fieldData:{autoResize:NO,layout:{height:21,left:120,right:20,centerY:0,width:200},contentValueKey:NO,parentView:this}});
if((typeof SC!=="undefined")&&SC&&SC.bundleDidLoad){SC.bundleDidLoad("forms")};
if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/node/mysystem2/js/00_my_system_javascript.js');};
