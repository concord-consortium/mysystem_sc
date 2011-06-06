(function(){var a="standard_theme";if(!SC.BUNDLE_INFO){throw"SC.BUNDLE_INFO is not defined!"
}if(SC.BUNDLE_INFO[a]){return}SC.BUNDLE_INFO[a]={requires:[],styles:["css/01_my_system_stylesheet-packed.css","css/01_my_system_stylesheet.css"],scripts:["js/01_my_system_javascript-packed.js"]}
})();MySystem=SC.Application.create({NAMESPACE:"MySystem",VERSION:"0.1.0",canvasView:null,NOVICE_STUDENT:"novice",ADVANCED_STUDENT:"advanced",updateFromDOM:function(){SC.run(function(){var a=SC.$("#my_system_state").text();
MySystem.store.setStudentStateDataHash(JSON.parse(a))})},});MySystem.activityController=SC.ObjectController.create({});
MySystem.nodePaletteController=SC.ArrayController.create({contentBinding:"MySystem.activityController.paletteItems"});
MySystem.nodesController=SC.ArrayController.create(SC.CollectionViewDelegate,{selectedLinksBinding:"MySystem.canvasView.selectedLinks",allSelected:function(){var a=MySystem.canvasView.get("selectedLinks");
var b=this.get("selection").clone();b=b.addObjects(a.map(function(c){return c.get("model")
}));return b}.property("selectedLinks","selection").cacheable(),unselectAll:function(){if(this.selectedLinks){this.set("selectedLinks",[]);
MySystem.canvasView.linksDidChange()}var a=this.get("selection").clone();this.deselectObjects(a)
},collectionViewDeleteContent:function(a,b,c){var d=c.map(function(e){return this.objectAt(e)
},this);d.invoke("destroy")},collectionViewSelectionForProposedSelection:function(a,b){if(a.get("mouseDownInfo")&&a.get("mouseDownInfo").event.shiftKey){return null
}else{return b}},propertyEditing:function(){MySystem.statechart.sendEvent("diagramSelectionChanged",{})
}.observes("allSelected")});MySystem.storyController=SC.ObjectController.create({contentBinding:"MySystem.activityController.assignmentText"});
MySystem.storySentenceController=SC.ArrayController.create(SC.CollectionViewDelegate,{allowsMultipleSelection:NO,editingSentence:null,collectionViewDeleteContent:function(a,e,d){var c=d.map(function(f){return this.objectAt(f)
},this);c.invoke("destroy");var b=d.get("min")-1;if(b<0){b=0}this.selectObject(this.objectAt(b));
return YES},collectionViewPerformDragOperation:function(b,d,f,c,a){var e=d.get("source").get("selection").firstObject();
e.set("order",c);this.incrementOrderValues(c);return SC.DRAG_REORDER},addStorySentence:function(){var a;
a=this.addStorySentenceNoEdit();this.selectObject(a);this.invokeLater(function(){var d=this.indexOf(a);
var c=MySystem.mainPage.getPath("mainPane.topView.bottomRightView.topLeftView.bottomRightView.sentencesView.contentView");
var b=c.itemViewForContentIndex(d);b.get("sentenceText").beginEditing()});return a
},addStorySentenceNoEdit:function(){var a;this._incrementOrderValues(0);a=MySystem.store.createRecord(MySystem.StorySentence,{guid:MySystem.StorySentence.newGuid(),order:0,bodyText:"Describe a new step in the story."});
return a},createSentence:function(a){var b=this.addStorySentence();this.addLinksAndNodesToSentence([a],b);
this.addLinksAndNodesToSentence(a.get("links").map(function(c){return c.model}),b)
},_incrementOrderValues:function(a){this.content.forEach(function(d,c,b){if(d.get("order")>=a){d.set("order",d.get("order")+1)
}})}});MySystem.transformationsController=SC.ArrayController.create({selectedLinksBinding:"MySystem.transformationsCanvasView.selectedLinks",openTransformationBuilder:function(c){MySystem.nodesController.deselectObject(c);
var a=MySystem.getPath("mainPage.transformationBuilderPane");var b=a.get("contentView").get("childViews").objectAt(2);
this.set("content",c.get("colorObjects"));a.set("node",c);if(!a.isPaneAttached){a.append()
}},closeTransformationBuilder:function(){var a=MySystem.getPath("mainPage.transformationBuilderPane");
var b=a.get("contentView").get("childViews").objectAt(2);var c=a.get("node");if(a.isPaneAttached){a.remove()
}a.set("node",null);this.set("content",[]);MySystem.nodesController.selectObject(c);
b.linksDidChange()},openTransformationAnnotater:function(b){var a=MySystem.getPath("mainPage.transformationAnnotaterPane");
a.set("transformation",b);if(!a.isPaneAttached){a.append()}},closeTransformationAnnotater:function(){var a=MySystem.getPath("mainPage.transformationAnnotaterPane");
if(a.isPaneAttached){a.remove()}},linkSelectionMonitor:function(){if(this.get("selectedLinks").get("length")>0){MySystem.getPath("mainPage.transformationBuilderPane.contentView.annotateButton").set("isEnabled",YES)
}else{MySystem.getPath("mainPage.transformationBuilderPane.contentView.annotateButton").set("isEnabled",NO)
}}.observes("selectedLinks"),annotate:function(){var a=this.get("selectedLinks").firstObject().model;
if(a.get("annotation")===null){a.set("annotation",MySystem.storySentenceController.addStorySentenceNoEdit())
}this.openTransformationAnnotater(a);this.invokeLater(function(){MySystem.transformationAnnotaterPane.get("contentView").get("storySentenceField").beginEditing()
})}});MySystem.MergedHashDataSource=SC.DataSource.extend({handledRecordTypes:[],dataHash:function(){return this._dataHash
}.property(),init:function(){arguments.callee.base.apply(this,arguments);var d=this.get("handledRecordTypes"),c={},e,b,a;
for(b=0,a=d.get("length");b<a;b++){e=d.objectAt(b);c[e.toString()]={}}this._dataHash=c;
this.notifyPropertyChange("dataHash")},handlesType:function(a){return this.get("handledRecordTypes").indexOf(a)>=0
},dataStoreDidUpdateDataHash:function(){},fetch:function(b,f){var h=f.get("recordType"),d=f.get("recordTypes"),e=this.get("dataHash"),a,g,c=[];
self=this;if(d){d.forEach(function(i){if(self.handlesType(i)){throw"MergedHashDataSource does not yet support queries with multiple recordTypes"
}});return NO}if(!this.handlesType(h)){return NO}a=e[h.toString()];if(a){for(g in a){if(!a.hasOwnProperty(g)){continue
}c.push(SC.copy(a[g],YES))}b.loadRecords(h,c)}b.dataSourceDidFetchQuery(f);return YES
},retrieveRecord:function(c,e){var f=c.recordTypeFor(e),d=this.get("dataHash"),b,a;
if(!this.handlesType(f)){return NO}b=d[f.toString()];if(!b){c.dataSourceDidError(e);
return YES}a=b[c.idFor(e)];if(!a){c.dataSourceDidError(e);return YES}c.dataSourceDidComplete(e,SC.copy(a,YES));
return YES},createOrUpdateRecord:function(c,e){var f=c.recordTypeFor(e),d=this.get("dataHash"),a,b;
if(!this.handlesType(f)){return NO}a=f.toString();d[a]=d[a]||{};b=d[a];b[c.idFor(e)]=SC.copy(c.readDataHash(e),YES);
c.dataSourceDidComplete(e);this.dataStoreDidUpdateDataHash();this.notifyPropertyChange("dataHash");
return YES},createRecord:function(a,b){return this.createOrUpdateRecord(a,b)},updateRecord:function(a,b){return this.createOrUpdateRecord(a,b)
},destroyRecord:function(a,c){var d=a.recordTypeFor(c),b=this.get("dataHash");if(!this.handlesType(d)){return NO
}delete b[d.toString()][a.idFor(c)];a.dataSourceDidDestroy(c);this.dataStoreDidUpdateDataHash();
this.notifyPropertyChange("dataHash");return YES},getRecordTypeFromName:function(a){return SC.objectForPropertyPath(a)
},setDataHash:function(c,a){var g=this.get("dataHash"),d={},b,f,e;for(b in g){if(!g.hasOwnProperty(b)){continue
}f=this.getRecordTypeFromName(b);for(e in g[b]){if(!g[b].hasOwnProperty(e)){continue
}if(!a[b]||!a[b][e]){c.pushDestroy(f,e)}}}for(b in a){if(!a.hasOwnProperty(b)){continue
}f=this.getRecordTypeFromName(b);if(!this.handlesType(f)){continue}d[b]={};for(e in a[b]){if(!a[b].hasOwnProperty(e)){continue
}c.pushRetrieve(f,e,SC.copy(a[b][e],YES));d[b][e]=SC.copy(a[b][e],YES)}}this._dataHash=d;
this.notifyPropertyChange("dataHash")}});MySystem.Activity=SC.Record.extend({paletteItems:SC.Record.toMany("MySystem.PaletteItem"),assignmentText:SC.Record.attr(String),energyTypes:SC.Record.toMany("MySystem.EnergyType")});
MySystem.Activity.GuidCounter=100;MySystem.Activity.newGuid=function(a){return a+MySystem.Activity.GuidCounter++
};MySystem.Activity.fromWiseStepDef=function(e){var g=MySystem.Activity.newGuid("actvitiy");
var d=e.modules;var c=null;var b=MySystem.store.createRecord(MySystem.Activity,{assignmentText:e.prompt,guid:MySystem.Activity.newGuid("activity")});
var k=d.length;var f=0;for(f=0;f<k;f++){module=d[f];c=MySystem.store.createRecord(MySystem.PaletteItem,{title:module.name,image:module.image},MySystem.Activity.newGuid("palette_item"));
b.get("paletteItems").pushObject(c)}var a=e.energy_types;k=a.length;var h="";var j=null;
for(f=0;f<k;f++){h=a[f];j=MySystem.store.createRecord(MySystem.EnergyType,{label:h.label,color:h.color,isEnabled:YES},MySystem.Activity.newGuid("energyType"));
b.get("energyTypes").pushObject(j)}return b};sc_require("models/activity");MySystem.Activity.FIXTURES=[{guid:"assign1",paletteItems:["pi1","pi2","pi3"],assignmentText:"<p>Make a diagram and story to help explain how <i>both</i> the sun and people's actions affect the Earth's climate.</p><ul><li>Where does the energy originally come from?</li><li>How does the energy move through the system?</li><li>How does the energy change as it moves through the system?</li><li>Where does the energy go in the end?</li></ul>",energyTypes:["et1","et2","et3","et4","et5"]}];
MySystem.EnergyType=SC.Record.extend({label:SC.Record.attr(String,{isRequired:YES,defaultValue:"Energy Flow"}),color:SC.Record.attr(String,{isRequired:YES}),isEnabled:SC.Record.attr(Boolean,{isRequired:YES,defaultValue:YES})});
sc_require("models/energy_type");MySystem.EnergyType.FIXTURES=[{guid:"et1",label:"infrared radiation",color:"#490A3D",isEnabled:YES},{guid:"et2",label:"thermal energy",color:"#BD1550",isEnabled:YES},{guid:"et3",label:"solar radiation",color:"#E97F02",isEnabled:YES},{guid:"et4",label:"kinetic energy",color:"#F8CA00",isEnabled:YES},{guid:"et5",label:"light energy",color:"#8A9B0F",isEnabled:YES}];
MySystem.PaletteItem=SC.Record.extend({image:SC.Record.attr(String),title:SC.Record.attr(String)});
sc_require("models/palette_item");MySystem.PaletteItem.FIXTURES=[{guid:"pi1",title:"Clay",image:"images/00_my_system_clay_red_tn.png"},{guid:"pi2",title:"Hand",image:"images/00_my_system_hand_tn.png"},{guid:"pi3",title:"Bulb",image:"images/00_my_system_lightbulb_tn.png"}];
MySystem.StudentState=SC.Record.extend({content:SC.Record.attr(String),timestamp:SC.Record.attr(Number),formFields:[]});
MySystem._tempStudentData=[{containers:[{terminals:[{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal1",direction:[0,-1],offsetPosition:{left:20,top:-25},ddConfig:{type:"input",allowedTypes:["input","output"]}},{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal2",direction:[0,1],offsetPosition:{left:20,bottom:-50},ddConfig:{type:"output",allowedTypes:["input","output"]}}],draggable:true,position:["375px","430px"],className:"WireIt-Container WireIt-ImageContainer",ddHandle:false,ddHandleClassName:"WireIt-Container-ddhandle",resizable:false,resizeHandleClassName:"WireIt-Container-resizehandle",close:true,closeButtonClassName:"WireIt-Container-closebutton",icon:"./images/cleardemo/earth.png",preventSelfWiring:true,image:"./images/cleardemo/earth.png",xtype:"MySystemContainer",fields:{name:"Earth",energy:100,efficiency:1,energy_transform:true},name:"Earth",has_sub:false},{terminals:[{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal1",direction:[0,-1],offsetPosition:{left:20,top:-25},ddConfig:{type:"input",allowedTypes:["input","output"]}},{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal2",direction:[0,1],offsetPosition:{left:20,bottom:-50},ddConfig:{type:"output",allowedTypes:["input","output"]}}],draggable:true,position:["605px","426px"],className:"WireIt-Container WireIt-ImageContainer",ddHandle:false,ddHandleClassName:"WireIt-Container-ddhandle",resizable:false,resizeHandleClassName:"WireIt-Container-resizehandle",close:true,closeButtonClassName:"WireIt-Container-closebutton",icon:"./images/cleardemo/atmosphere.png",preventSelfWiring:true,image:"./images/cleardemo/atmosphere.png",xtype:"MySystemContainer",fields:{name:"Atmosphere",efficiency:1},name:"Atmosphere",has_sub:false},{terminals:[{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal1",direction:[0,-1],offsetPosition:{left:20,top:-25},ddConfig:{type:"input",allowedTypes:["input","output"]}},{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal2",direction:[0,1],offsetPosition:{left:20,bottom:-50},ddConfig:{type:"output",allowedTypes:["input","output"]}}],draggable:true,position:["171px","434px"],className:"WireIt-Container WireIt-ImageContainer",ddHandle:false,ddHandleClassName:"WireIt-Container-ddhandle",resizable:false,resizeHandleClassName:"WireIt-Container-resizehandle",close:true,closeButtonClassName:"WireIt-Container-closebutton",icon:"./images/cleardemo/ggases.png",preventSelfWiring:true,image:"./images/cleardemo/ggases.png",xtype:"MySystemContainer",fields:{name:"Gasses",energy:100,efficiency:1,energy_store:true},name:"Gasses",has_sub:false},{terminals:[{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal1",direction:[0,-1],offsetPosition:{left:20,top:-25},ddConfig:{type:"input",allowedTypes:["input","output"]}},{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal2",direction:[0,1],offsetPosition:{left:20,bottom:-50},ddConfig:{type:"output",allowedTypes:["input","output"]}}],draggable:true,position:["327px","223px"],className:"WireIt-Container WireIt-ImageContainer",ddHandle:false,ddHandleClassName:"WireIt-Container-ddhandle",resizable:false,resizeHandleClassName:"WireIt-Container-resizehandle",close:true,closeButtonClassName:"WireIt-Container-closebutton",icon:"./images/cleardemo/sun.png",preventSelfWiring:true,image:"./images/cleardemo/sun.png",xtype:"MySystemContainer",fields:{name:"Sun",energy:100,efficiency:1,energy_transform:true},name:"Sun",has_sub:false},{terminals:[{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal1",direction:[0,-1],offsetPosition:{left:20,top:-25},ddConfig:{type:"input",allowedTypes:["input","output"]}},{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal2",direction:[0,1],offsetPosition:{left:20,bottom:-50},ddConfig:{type:"output",allowedTypes:["input","output"]}}],draggable:true,position:["540px","216px"],className:"WireIt-Container WireIt-ImageContainer",ddHandle:false,ddHandleClassName:"WireIt-Container-ddhandle",resizable:false,resizeHandleClassName:"WireIt-Container-resizehandle",close:true,closeButtonClassName:"WireIt-Container-closebutton",icon:"./images/cleardemo/space.png",preventSelfWiring:true,image:"./images/cleardemo/space.png",xtype:"MySystemContainer",fields:{name:"Space",energy:100,efficiency:1,energy_make:true},name:"Space",has_sub:false},{terminals:[{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal1",direction:[0,-1],offsetPosition:{left:20,top:-25},ddConfig:{type:"input",allowedTypes:["input","output"]}},{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal2",direction:[0,1],offsetPosition:{left:20,bottom:-50},ddConfig:{type:"output",allowedTypes:["input","output"]}}],draggable:true,position:["114px","267px"],className:"WireIt-Container WireIt-ImageContainer",ddHandle:false,ddHandleClassName:"WireIt-Container-ddhandle",resizable:false,resizeHandleClassName:"WireIt-Container-resizehandle",close:true,closeButtonClassName:"WireIt-Container-closebutton",icon:"./images/cleardemo/lowalbedo.png",preventSelfWiring:true,image:"./images/cleardemo/lowalbedo.png",xtype:"MySystemContainer",fields:{name:"Low Albedo",energy:100,efficiency:1,energy_make:true},name:"Low Albedo",has_sub:false},{terminals:[],draggable:true,position:["675px","203px"],className:"MySystemNote",ddHandle:true,ddHandleClassName:"WireIt-Container-ddhandle",resizable:true,resizeHandleClassName:"WireIt-Container-resizehandle",close:true,closeButtonClassName:"WireIt-Container-closebutton",title:"Note",preventSelfWiring:true,fields:{content:"I have no idea how the energy \u000atransfers.\u000a"},xtype:"MySystemNote",name:"Note"},{terminals:[{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal1",direction:[0,-1],offsetPosition:{left:20,top:-25},ddConfig:{type:"input",allowedTypes:["input","output"]}},{wireConfig:{drawingMethod:"bezierArrows"},name:"Terminal2",direction:[0,1],offsetPosition:{left:20,bottom:-50},ddConfig:{type:"output",allowedTypes:["input","output"]}}],draggable:true,position:["494px","422px"],className:"WireIt-Container WireIt-ImageContainer",ddHandle:false,ddHandleClassName:"WireIt-Container-ddhandle",resizable:false,resizeHandleClassName:"WireIt-Container-resizehandle",close:true,closeButtonClassName:"WireIt-Container-closebutton",icon:"./images/cleardemo/clouds.png",preventSelfWiring:true,image:"./images/cleardemo/clouds.png",xtype:"MySystemContainer",fields:{name:"Clouds",energy:100,efficiency:1,energy_store:true},name:"Clouds",has_sub:false}],wires:[{src:{moduleId:3,terminal:"Terminal2"},tgt:{moduleId:2,terminal:"Terminal1"},options:{className:"WireIt-Wire",coeffMulDirection:100,drawingMethod:"bezierArrows",cap:"round",bordercap:"round",width:5,borderwidth:1,color:"rgb(233, 127, 2)",bordercolor:"#000000",fields:{name:"To greenhouse",width:5,color:"rgb(233, 127, 2)"},selected:true,name:"To greenhouse",last_color:"rgb(233, 127, 2)"}},{src:{moduleId:3,terminal:"Terminal2"},tgt:{moduleId:1,terminal:"Terminal1"},options:{className:"WireIt-Wire",coeffMulDirection:100,drawingMethod:"bezierArrows",cap:"round",bordercap:"round",width:5,borderwidth:1,color:"rgb(233, 127, 2)",bordercolor:"#000000",fields:{name:"(type-here)",width:5,color:"rgb(233, 127, 2)"},selected:false,last_color:"rgb(233, 127, 2)",name:"(type-here)"}},{src:{moduleId:3,terminal:"Terminal2"},tgt:{moduleId:0,terminal:"Terminal1"},options:{className:"WireIt-Wire",coeffMulDirection:100,drawingMethod:"bezierArrows",cap:"round",bordercap:"round",width:5,borderwidth:1,color:"rgb(233, 127, 2)",bordercolor:"#000000",fields:{name:"Solar radiation to Earth",width:5,color:"rgb(233, 127, 2)"},selected:true,name:"Solar radiation to Earth",last_color:"rgb(233, 127, 2)"}},{src:{moduleId:0,terminal:"Terminal2"},tgt:{moduleId:2,terminal:"Terminal1"},options:{className:"WireIt-Wire",coeffMulDirection:100,drawingMethod:"bezierArrows",cap:"round",bordercap:"round",width:5,borderwidth:1,color:"rgb(189, 21, 80)",bordercolor:"#000000",fields:{name:"Entrapment",width:5,color:"rgb(189, 21, 80)"},selected:true,name:"Entrapment",last_color:"rgb(189, 21, 80)"}},{src:{moduleId:3,terminal:"Terminal2"},tgt:{moduleId:4,terminal:"Terminal1"},options:{className:"WireIt-Wire",coeffMulDirection:100,drawingMethod:"bezierArrows",cap:"round",bordercap:"round",width:5,borderwidth:1,color:"rgb(233, 127, 2)",bordercolor:"#000000",fields:{name:"To space",width:5,color:"rgb(233, 127, 2)"},selected:false,name:"To space",last_color:"rgb(233, 127, 2)"}},{src:{moduleId:0,terminal:"Terminal2"},tgt:{moduleId:7,terminal:"Terminal1"},options:{className:"WireIt-Wire",coeffMulDirection:100,drawingMethod:"bezierArrows",cap:"round",bordercap:"round",width:5,borderwidth:1,color:"rgb(189, 21, 80)",bordercolor:"#000000",fields:{name:"To clouds",width:5,color:"rgb(189, 21, 80)"},selected:true,name:"To clouds"}}]}];
sc_require("models/student_state");sc_require("resources/student_data_example.js");
MySystem.StudentState.FIXTURES=[{guid:1,content:JSON.stringify(MySystem._tempStudentData),timestamp:1281630733000}];
MySystem.Transformation=SC.Record.extend({node:SC.Record.toOne("MySystem.Node",{inverse:"transformations",isMaster:YES}),annotation:SC.Record.toOne("MySystem.StorySentence",{inverse:"transformation",isMaster:YES}),inLinkColor:SC.Record.attr(String),outLinkColor:SC.Record.attr(String),_linkObject:null,inLinks:function(){var c=[];
var b=this.get("node");var a=this;b.get("inLinks").forEach(function(f,e,d){if(f.get("color")==a.get("inLinkColor")){c.pushObject(f)
}});return c}.property(),outLinks:function(){var c=[];var b=this.get("node");var a=this;
b.get("outLinks").forEach(function(f,e,d){if(f.get("color")==a.get("outLinkColor")){c.pushObject(f)
}});return c}.property(),isAnnotated:function(){if(this.annotation){return YES}else{return NO
}}.property("annotation").cacheable(),isComplete:function(){var a=YES;if(!this.get("node")){a=NO
}else{if(this.get("inLinks").get("length")<1){a=NO}else{if(this.get("outLinks").get("length")<1){a=NO
}}}return a}.property("node",".inLinks.[]",".outLinks.[]").cacheable(),makeLinkItLink:function(){var a={};
a.startNode=this.get("node").inColorMap[this.get("inLinkColor")];a.startTerminal=this.get("startTerminal");
a.endNode=this.get("node").outColorMap[this.get("outLinkColor")];a.endTerminal=this.get("endTerminal");
a.label="";a.linkStyle={};a.model=this;return SC.Object.create(LinkIt.Link,a)}});
MySystem.Transformation.GuidCounter=0;MySystem.Transformation.newGuid=function(){return"trans"+MySystem.Transformation.GuidCounter++
};MySystem.Transformation.hashFromLinkItLink=function(a){var b={};b.startNode=a.get("startNode");
b.startTerminal=a.get("startTerminal");b.endNode=a.get("endNode");b.endTerminal=a.get("endTerminal");
return b};sc_require("models/transformation");MySystem.Transformation.FIXTURES=[];
MySystem.EnergyFlow=SC.Object.extend(LinkIt.Node,{color:null,side:"in",position:{},node:null,linksKey:"transformations",transformations:function(){var a=this.get("node").get("transformations");
var c=[];var b=this;a.forEach(function(d){if(d.get("isComplete")){c.pushObject(d.makeLinkItLink())
}});return c}.property("node.transformations","node.inColorMap","node.outColorMap"),didCreateLink:function(c){var d=MySystem.Transformation.hashFromLinkItLink(c);
var f=null,h;var b=d.startNode,i=d.startTerminal,a=d.endNode,g=d.endTerminal;if(SC.none(this.get("guid"))){SC.Logger.warn("No guid found for %@".fmt(this));
return}if(b&&i&&a&&g){var e=MySystem.Transformation.newGuid();d.guid=e;if(b===this){d.startNode=null;
d.endNode=null;f=MySystem.store.createRecord(MySystem.Transformation,d,e);f.set("inLinkColor",b.get("color"));
f.set("outLinkColor",a.get("color"));f.set("node",this.get("node"));this.propertyDidChange("transformations");
MySystem.transformationsCanvasView.selectObjects([c])}else{if(a===this){}}}},willDeleteLink:function(f){var h=f.get("startNode"),d=f.get("startTerminal");
var c=f.get("endNode"),g=f.get("endTerminal");var e=f.model;if(e){var b=e.get("startNode");
var a=e.get("endNode");if(b&&b==this){b.get("outLinks").removeObject(e);b.get("inLinks").removeObject(e);
a.get("outLinks").removeObject(e);a.get("inLinks").removeObject(e);e.destroy();f=null
}}}});MySystem.EnergyFlow.GuidCounter=100;MySystem.EnergyFlow.newGuid=function(){return"ef"+MySystem.EnergyFlow.GuidCounter++
};(function(){MySystem.parseOldFormatJson=function(f){var e,g;var d=[];containers=f[0].containers;
wires=f[0].wires;for(e=0;e<containers.length;++e){g=c(containers[e],"node-"+e);d.push(g)
}for(e=0;e<wires.length;++e){b(wires[e],d,"link-"+e)}};var c=function(d,e){return MySystem.store.createRecord(MySystem.Node,{title:d.name,image:a(d.image),position:{x:d.position[0],y:d.position[1]}},e)
};var b=function(i,e,g){var f=e[Number(i.src.moduleId)];var d=e[Number(i.tgt.moduleId)];
var h=MySystem.store.createRecord(MySystem.Link,{startNode:f.get("id"),endNode:d.get("id"),startTerminal:i.src.terminal==="Terminal1"?"a":"b",endTerminal:i.tgt.terminal==="Terminal1"?"a":"b",text:i.options.fields.name},g);
f.get("outLinks").pushObject(h);d.get("inLinks").pushObject(h);return h};var a=function(d){return"http://ccmysystem.appspot.com/"+d
}})();MySystem.ImprovedRadioView=SC.FieldView.extend({classNames:["sc-radio-view"],value:null,layoutDirection:SC.LAYOUT_VERTICAL,escapeHTML:YES,items:[],itemTitleKey:null,itemValueKey:null,itemIsEnabledKey:null,itemIconKey:null,displayItems:function(){var e=this.get("items"),b=this.get("localize"),o=this.get("itemTitleKey"),n=this.get("itemValueKey"),c=this.get("itemIsEnabledKey"),l=this.get("itemIconKey");
var d=[],g=(e)?e.get("length"):0;var m,h,k,j,a,i,f;for(j=0;j<g;j++){m=e.objectAt(j);
if(SC.typeOf(m)===SC.T_ARRAY){h=m[0];k=m[1]}else{if(m){if(o){h=m.get?m.get(o):m[o]
}else{h=(m.toString)?m.toString():null}if(n){k=m.get?m.get(n):m[n]}else{k=m}if(c){i=m.get?m.get(c):m[c]
}else{i=YES}if(l){f=m.get?m.get(l):m[l]}else{f=null}}else{h=k=f=null;i=NO}}if(b){h=h.loc()
}d.push([h,k,i,f])}return d}.property("items","itemTitleKey","itemValueKey","itemIsEnabledKey","localize","itemIconKey").cacheable(),itemsDidChange:function(){if(this._items){this._items.removeObserver("[]",this,this.itemContentDidChange)
}this._items=this.get("items");if(this._items){this._items.addObserver("[]",this,this.itemContentDidChange)
}this.itemContentDidChange()}.observes("items"),itemContentDidChange:function(){this.notifyPropertyChange("displayItems")
},$input:function(){return this.$("input")},displayProperties:["value","displayItems"],render:function(e,a){var p,o,k,c,q,d,j,g,f,l,b,i=this.get("displayItems"),n=this.get("value"),h=SC.isArray(n);
e.addClass(this.get("layoutDirection"));if(h&&n.length<=0){n=n[0];h=NO}if(a){c=SC.guidFor(this);
q=i.length;for(o=0;o<q;o++){p=i[o];k=p[3];if(k){d=(k.indexOf("/")>=0)?k:SC.BLANK_IMAGE_URL;
j=(d===k)?"":k;k='<img src="%@" class="icon %@" alt="" />'.fmt(d,j)}else{k=""}b=this._getSelectionState(p,n,h,false);
g=(!p[2])||(!this.get("isEnabled"))?'disabled="disabled" ':"";f=this.escapeHTML?SC.RenderContext.escapeHTML(p[0]):p[0];
var m=!h&&n===p[1]?'checked="checked"':"";e.push('<label class="sc-radio-button ',b,'" style="background-color: ',p[1],';">');
e.push('<input type="radio" value="',p[1],'" name="',c,'" ',g," ",m,"/>");e.push('<span class="button"></span>');
e.push('<span class="sc-button-label">',k,f,"</span></label>")}this._field_setFieldValue(this.get("value"))
}else{if(i.length!=this.$input().length){this.render(e,YES)}else{this.$input().forEach(function(r){r=this.$(r);
i.forEach(function(s){if(s[1]==r){p=s}});if(p){r.attr("disabled",(!p[2])?"disabled":null);
l=this._getSelectionState(p,n,h,true);r.parent().setClass(l)}r=o=l=null},this)}}},_getSelectionState:function(d,f,a,b){var e,h,c;
if(d){e=(a)?(f.indexOf(d[1])>=0):(f===d[1])}else{e=NO}h={sel:(e&&!a),mixed:(e&&a),disabled:(!d[2])};
if(b){return h}else{var g=[];for(c in h){if(!h.hasOwnProperty(c)){continue}if(h[c]){g.push(c)
}}return g.join(" ")}},getFieldValue:function(){var b=this.$input().filter(function(){return this.checked
}).val();var a=this.get("displayItems");b=a[parseInt(b,0)];return b?b[1]:this._mixedValue
},setFieldValue:function(c){if(SC.isArray(c)){if(c.get("length")>1){this._mixedValue=c;
c=undefined}else{c=c.objectAt(0)}}var b,a;if(c===undefined){a=-1}else{b=this.get("displayItems");
a=b.indexOf(b.find(function(d){return d[1]===c}))}this.$input().forEach(function(d){d=SC.$(d);
d.attr("checked",parseInt(d.val(),0)===a);d=null});return this},didCreateLayer:function(){this.setFieldValue(this.get("fieldValue"));
var c=this.$input();for(var a=0,b=c.length;a<b;a++){SC.Event.add(c[a],"click",this,this._field_fieldValueDidChange)
}},willDestroyLayer:function(){var c=this.$input();for(var a=0,b=c.length;a<b;a++){SC.Event.remove(this.$input()[a],"click",this,this._field_fieldValueDidChange)
}},mouseDown:function(a){var c=a.target;while(c){if(c.className&&c.className.indexOf("sc-radio-button")>-1){break
}var b=c.value;c=c.parentNode}if(!c){return NO}c=this.$(c);c.addClass("active");this._activeRadioButton=c;
this.set("value",b);this._field_isMouseDown=YES;return YES},mouseUp:function(a){var b=this._activeRadioButton;
if(b){b.removeClass("active");this._activeRadioButton=null}}});require("views/improved_radio.js");
MySystem.Link=SC.Record.extend({color:SC.Record.attr(String),text:SC.Record.attr(String),startNode:SC.Record.toOne("MySystem.Node",{inverse:"outLinks"}),endNode:SC.Record.toOne("MySystem.Node",{inverse:"inLinks"}),sentences:SC.Record.toMany("MySystem.StorySentence",{inverse:"links",isMaster:NO}),linkStyle:{lineStyle:LinkIt.VERTICAL_CURVED,width:6,color:"#00ff00",cap:LinkIt.ROUND,arrows:LinkIt.ARROW_END},label:{text:"label",fontSize:12,fontFamily:"sans-serif",fontStyle:"normal",backgroundColor:"#ffffff"},startTerminal:SC.Record.attr(String),endTerminal:SC.Record.attr(String),formFields:[Forms.FormView.row(MySystem.ImprovedRadioView,{layout:{width:160,height:85},fieldKey:"color",fieldLabel:"Energy Type:",itemsBinding:"MySystem.energyTypes",itemTitleKey:"label",itemValueKey:"color",itemIsEnabledKey:"isEnabled",layoutDirection:SC.LAYOUT_VERTICAL}),Forms.FormView.row(SC.TextFieldView,{fieldKey:"text",fieldLabel:"Label:"})],isDimmed:NO,init:function(){arguments.callee.base.apply(this,arguments)
},isComplete:function(){var a=this.get("startNode");var c=this.get("endNode");var d=this.get("startTerminal");
var b=this.get("endTerminal");if(this.isDestroyed()){return false}if(SC.none(a)){return false
}if(SC.none(c)){return false}if(SC.none(d)){return false}if(SC.none(b)){return false
}if(a.isDestroyed()){return false}if(c.isDestroyed()){return false}return true},makeLinkItLink:function(){var a={};
this._setLabel();this._setLinkStyle();a.startNode=this.get("startNode");a.startTerminal=this.get("startTerminal");
a.endNode=this.get("endNode");a.endTerminal=this.get("endTerminal");a.label=this.get("label");
a.linkStyle=this.get("linkStyle");a.selectionWidth=this.get("linkStyle").width+4;
a.model=this;return SC.Object.create(LinkIt.Link,a)},_textChanged:function(){this.invokeOnce(this._setLabel);
if(this.get("startNode")){this.get("startNode").notifyPropertyChange("links")}if(this.get("endNode")){this.get("endNode").notifyPropertyChange("links")
}}.observes(".text"),_colorChanged:function(){this.invokeOnce(this._setLinkStyle);
if(this.get("startNode")){this.get("startNode").notifyPropertyChange("links")}if(this.get("endNode")){this.get("endNode").notifyPropertyChange("links")
}}.observes(".color"),_setLabel:function(){var a={text:this.get("text"),fontSize:12,fontFamily:"sans-serif",fontStyle:"normal",backgroundColor:"#ffffff"};
this.set("label",a)},_setLinkStyle:function(){var a={lineStyle:this.get("linkStyle").lineStyle,width:this.get("linkStyle").width,color:this.get("color"),cap:this.get("linkStyle").cap,arrows:this.get("linkStyle").arrows};
this.set("linkStyle",a)},dimColor:function(){if(this.get("isDimmed")===YES){var g,b,a;
g=this.get("color");b={};var h=MySystem.Link.COLOR_DEFS;for(var c=0;c<h.length;c++){var e=h[c].re;
var d=h[c].process;var f=e.exec(g);if(f){a=d(f);b.r=a[0];b.g=a[1];b.b=a[2];b.a=(a[3]?a[3]:1);
b.ok=true}}if(b.r!==undefined){b.a=b.a*0.2;this.set("color","rgba("+b.r.toString()+", "+b.g.toString()+", "+b.b.toString()+", "+b.a.toString()+")");
return YES}else{SC.Logger.log("No matching color pattern found.");return NO}}}.observes("isDimmed"),unDimColor:function(){if(!this.get("isDimmed")){var g,b,a;
g=this.get("color");b={};var h=MySystem.Link.COLOR_DEFS;for(var c=0;c<h.length;c++){var e=h[c].re;
var d=h[c].process;var f=e.exec(g);if(f){a=d(f);b.r=a[0];b.g=a[1];b.b=a[2];b.a=(a[3]?a[3]:1);
b.ok=true}}if(b.r!==undefined){b.a=b.a*5;if(b.a>1){b.a=1}if(!this.get("isDestroyed")){this.set("color","rgba("+b.r.toString()+", "+b.g.toString()+", "+b.b.toString()+", "+b.a.toString()+")")
}return YES}else{SC.Logger.log("No matching color pattern found.");return NO}}}.observes("isDimmed"),fixSelectionDimming:function(){if(this.get("isSelected")&&this.get("isDimmed")){this.set("isDimmed",NO)
}}});MySystem.Link.GuidCounter=100;MySystem.Link.newGuid=function(){return"link"+MySystem.Link.GuidCounter++
};MySystem.Link.hashFromLinkItLink=function(a){var b={};b.startNode=a.get("startNode");
b.startTerminal=a.get("startTerminal");b.endNode=a.get("endNode");b.endTerminal=a.get("endTerminal");
b.label=SC.clone(a.get("label"));return b};MySystem.Link.COLOR_DEFS=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(a){return[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10)]
}},{re:/^\#?(\w{2})(\w{2})(\w{2})$/,example:["#00ff00","336699"],process:function(a){return[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]
}},{re:/^\#?(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function(a){return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)]
}},{re:/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([\d.]+)\)$/,example:["rgba(123, 234, 45, 1.0)","rgb(255,234,245,0.3333333)"],process:function(a){return[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),parseInt(a[4],10)]
}}];MySystem.Node=SC.Record.extend(LinkIt.Node,{image:SC.Record.attr(String),title:SC.Record.attr(String),transformer:SC.Record.attr(Boolean,{defaultValue:true}),toolTip:SC.Record.attr(String,{defaultValue:null}),outLinks:SC.Record.toMany("MySystem.Link",{inverse:"startNode",isMaster:YES}),inLinks:SC.Record.toMany("MySystem.Link",{inverse:"endNode",isMaster:YES}),position:SC.Record.attr(Object),sentences:SC.Record.toMany("MySystem.StorySentence",{inverse:"nodes",isMaster:NO}),transformations:SC.Record.toMany("MySystem.Transformation",{inverse:"node",isMaster:YES}),terminals:["a","b"],formFields:[Forms.FormView.row(SC.TextFieldView,{fieldKey:"image",fieldLabel:"Image:"}),Forms.FormView.row(SC.TextFieldView,{fieldKey:"title",fieldLabel:"Title:"})],inColorMap:[],outColorMap:[],links:function(){var e=[],d;
var a=this.get("inLinks"),f=this.get("outLinks");for(var b=0,c=a.get("length");b<c;
b++){d=a.objectAt(b);if(d&&d.isComplete()){e.pushObject(d.makeLinkItLink())}}for(b=0,c=f.get("length");
b<c;b++){d=f.objectAt(b);if(d&&d.isComplete()){e.pushObject(d.makeLinkItLink())}}return e
}.property(".outlinks.[]",".inLinks.[]"),init:function(){arguments.callee.base.apply(this,arguments)
},destroy:function(){var a=this.get("outLinks");var b=this.get("inLinks");a.invoke("destroy");
a.invoke("destroy");this.set("outLinks",[]);this.set("inLinks",[]);SC.Logger.log("destroy called on ",this);
arguments.callee.base.apply(this,arguments)},intersection:function(g,f){if(g===null){return f
}if(f===null){return g}var a=[];for(var e=0;e<g.length;e+=1){var d=g[e];for(var c=0;
c<f.length;c+=1){var b=f[c];if(d==b){a.push(d)}}}return a},canLink:function(c){if(!c){return NO
}var e=c.get("startNode"),b=c.get("startTerminal");var a=c.get("endNode"),d=c.get("endTerminal");
if(!e.instanceOf(MySystem.Node)||!a.instanceOf(MySystem.Node)){return NO}if(e===a){return NO
}if(this._hasLink(c)){return NO}return YES},_hasLink:function(d){var b=this.get("links")||[];
var a=b.get("length");var f;var e=LinkIt.genLinkID(d);for(var c=0;c<a;c++){f=b.objectAt(c);
if(LinkIt.genLinkID(f)===e){return YES}}},didCreateLink:function(c){var d=MySystem.Link.hashFromLinkItLink(c);
var f=null,h;var b=d.startNode,i=d.startTerminal,a=d.endNode,g=d.endTerminal;if(SC.none(this.get("guid"))){SC.Logger.warn("No guid found for %@".fmt(this));
return}if(b&&i&&a&&g){var e=MySystem.Link.newGuid();d.guid=e;if(b===this){d.startNode=null;
d.endNode=null;f=MySystem.store.createRecord(MySystem.Link,d,e);f.set("startNode",b);
f.set("endNode",a);MySystem.canvasView.selectLink(f)}else{if(a===this){}}}},willDeleteLink:function(f){var h=f.get("startNode"),d=f.get("startTerminal");
var c=f.get("endNode"),g=f.get("endTerminal");var e=f.model;if(e){var b=e.get("startNode");
var a=e.get("endNode");if(b&&b==this){b.get("outLinks").removeObject(e);b.get("inLinks").removeObject(e);
a.get("outLinks").removeObject(e);a.get("inLinks").removeObject(e);e.destroy();f=null
}}},acceptableOutLinkColors:function(){if(MySystem.studentMode==MySystem.ADVANCED_STUDENT){return null
}else{if(MySystem.studentMode==MySystem.NOVICE_STUDENT){if(this.get("transformer")){return null
}if(this.get("inLinks").get("length")===0){return null}var b=[];var e=this.get("inLinks");
var a=e.get("length");for(var c=0;c<a;c+=1){var d=e.objectAt(c);b.push(d.get("color"))
}return b}else{SC.Logger.warn("Invalid student mode "+MySystem.studentMode);return null
}}},acceptableInLinkColors:function(){if(MySystem.studentMode==MySystem.ADVANCED_STUDENT){return null
}else{if(MySystem.studentMode==MySystem.NOVICE_STUDENT){if(this.get("transformer")){return null
}if(this.get("outLinks").get("length")===0){return null}var b=[];var e=this.get("outLinks");
var a=e.get("length");for(var c=0;c<a;c+=1){var d=e.objectAt(c);b.push(d.get("color"))
}return b}else{SC.Logger.warn("Invalid student mode "+MySystem.studentMode);return null
}}},linkColor:function(){if(this.get("transformer")){return null}if(this.get("links").get("length")===0){return null
}return this.get("links").firstObject().get("model").get("color")}.property(".outlinks.[]",".inLinks.[]"),inLinkColors:function(){return this.get("inLinks").getEach("color")
}.property(".inLinks.[]"),outLinkColors:function(){return this.get("outLinks").getEach("color")
}.property(".inLinks.[]"),colorObjects:function(){var b=[],a=15;var d=this.uniqueColors(this.get("inLinkColors"));
var c=this;d.forEach(function(g){var f=MySystem.EnergyFlow.create({color:g,side:"in",position:{x:10,y:a},node:c,guid:MySystem.EnergyFlow.newGuid()});
b.pushObject(f);c.get("inColorMap")[g]=f;a=a+25});a=15;var e=this.uniqueColors(this.get("outLinkColors"));
c=this;e.forEach(function(g){var f=MySystem.EnergyFlow.create({color:g,side:"out",position:{x:450,y:a},node:c,guid:MySystem.EnergyFlow.newGuid()});
b.pushObject(f);c.get("outColorMap")[g]=f;a=a+25});return b}.property(".inLinkColors.[]",".outLinkColors.[]"),uniqueColors:function(b){var a=[];
b.forEach(function(c){if(a.indexOf(c)<0){a.push(c)}});return a},inLinkColorsWithTransformations:function(){return this.get("transformations").getEach("inLinkColor")
}.property(".transformations.[]"),outLinkColorsWithTransformations:function(){return this.get("transformations").getEach("outLinkColor")
}.property(".transformations.[]"),allLinksHaveTransformations:function(){var a=true;
var c=this.get("outLinkColorsWithTransformations");var b=this.get("outLinkColors");
b.forEach(function(f,e,d){if(c.indexOf(f)<0){a=false}});if(a){c=this.get("inLinkColorsWithTransformations");
b=this.get("inLinkColors");b.forEach(function(f,e,d){if(c.indexOf(f)<0){a=false}})
}if(a){return YES}else{return NO}}.property(),transformationIcon:function(){var a=this.get("transformations").get("length");
if(a>0){if(this.get("transformationsAreAllAnnotated")&&this.get("allLinksHaveTransformations")){this.set("toolTip","All transformations are annotated.");
return"images/00_my_system_gotTransformationIcon.png"
}else{this.set("toolTip","This node has at least one unexplained link or transformation which needs explanation.");
return"images/00_my_system_transformationNeededIcon.gif"
}}else{if(this.get("hasImpliedTransformations")){this.set("toolTip","This node has at least one unexplained link or transformation which needs explanation.");
return"images/00_my_system_transformationNeededIcon.gif"
}else{this.set("toolTip",null);return"images/00_my_system_noTransformationNeededIcon.gif"
}}}.property(),hasImpliedTransformations:function(){var h=this.get("inLinks");var g=this.get("outLinks");
if((h.get("length")<1)||(g.get("length")<1)){return NO}else{var b=NO;var c=null;var a=h.get("length");
var e=g.get("length");var f,d;for(f=0;f<a;f++){c=h.objectAt(f).get("color");for(d=0;
d<e;d++){if(c!=g.objectAt(d).get("color")){b=YES;break}}if(b){break}}return b}}.property(".outlinks.[]",".inLinks.[]"),transformationsAreAllAnnotated:function(){var a=YES;
this.get("transformations").forEach(function(d,c,b){if(!d.get("isAnnotated")==NO){a=NO
}});return a}.property("transformations").cacheable(),hasTransformationWithOutgoingColor:function(b){var c=this.get("transformations");
var a=c.get("length");for(var d=0;d<a;d+=1){var e=c.objectAt(d);if(e.get("outLinkColor")==b){return YES
}}return NO},hasIncomingLinksWithColor:function(c){var b=this.get("inLinks");var a=b.get("length");
for(var d=0;d<a;d+=1){var e=b.objectAt(d);if(e.get("color")==c){return YES}}return NO
}});MySystem.Node.GuidCounter=100;MySystem.Node.newGuid=function(){return"node"+MySystem.Node.GuidCounter++
};MySystem.Story=SC.Record.extend({storyHtml:SC.Record.attr(String),formFields:[Forms.FormView.row(SC.TextFieldView,{fieldKey:"storyHtml",fieldLabel:"Story",isTextArea:YES})]});
MySystem.StorySentence=SC.Record.extend({order:SC.Record.attr(Number),bodyText:SC.Record.attr(String),nodes:SC.Record.toMany("MySystem.Node",{inverse:"sentences",isMaster:NO}),links:SC.Record.toMany("MySystem.Link",{inverse:"sentences",isMaster:NO}),transformation:SC.Record.toOne("MySystem.Transformation",{inverse:"annotation",isMaster:NO}),diagramObjects:function(){var a=[],c=this.get("nodes"),b=this.get("links");
c.forEach(function(f,e,d){this.pushObject(f)},a);b.forEach(function(f,e,d){this.pushObject(f)
},a);return a}.property().cacheable(),_diagramObjectsDidChange:function(){this.notifyPropertyChange("diagramObjects")
}.observes(".nodes.[]",".links.[]")});MySystem.StorySentence.GuidCounter=100;MySystem.StorySentence.newGuid=function(){return"ss"+MySystem.Node.GuidCounter++
};MySystem.statechart=Ki.Statechart.create({rootState:Ki.State.design({initialSubstate:"DIAGRAM_EDITING",DIAGRAM_EDITING:Ki.State.plugin("MySystem.DIAGRAM_EDITING"),DIAGRAM_OBJECT_EDITING:Ki.State.plugin("MySystem.DIAGRAM_OBJECT_EDITING"),SENTENCE_EDITING:Ki.State.design({commitEdits:function(){this.gotoState("DIAGRAM_EDITING")
},enterState:function(){SC.Logger.log("Entering state %s",this.get("name"))},exitState:function(){SC.Logger.log("Leaving state %s",this.get("name"))
}}),SENTENCE_OBJECT_LINKING_SETUP:Ki.State.plugin("MySystem.SENTENCE_OBJECT_LINKING_SETUP"),SENTENCE_OBJECT_LINKING:Ki.State.plugin("MySystem.SENTENCE_OBJECT_LINKING"),checkDiagramAgainstConstraints:function(){var a=MySystem.store.find(MySystem.Node),b=0;
a.forEach(function(c){if(/clay/.test(c.get("image"))){b++}});if(b>2){SC.AlertPane.warn("You may have too many clay nodes in your diagram.")
}else{SC.AlertPane.info("Your diagram has no obvious problems.")}}})});MySystem.DIAGRAM_EDITING=Ki.State.design({enterState:function(){SC.Logger.log("Entering state %s",this.get("name"))
},exitState:function(){SC.Logger.log("Leaving state %s",this.get("name"))},addNode:function(a){var c;
var b=MySystem.Node.newGuid();c=MySystem.store.createRecord(MySystem.Node,{title:a.title,image:a.image,position:{x:a.x,y:a.y},guid:b},b);
MySystem.nodesController.deselectObjects(MySystem.nodesController.get("allSelected"));
MySystem.nodesController.selectObject(c);return YES},diagramSelectionChanged:function(){var a=MySystem.nodesController.get("allSelected");
if((a.get("length")==1)&&a.firstObject().get("linkStyle")){this.gotoState("DIAGRAM_OBJECT_EDITING")
}return YES},editSentence:function(){this.gotoState("SENTENCE_EDITING");return YES
},sentenceDiagramConnect:function(a){MySystem.storySentenceController.set("editingSentence",a.sentence);
this.gotoState("SENTENCE_OBJECT_LINKING_SETUP");return YES}});MySystem.DIAGRAM_OBJECT_EDITING=Ki.State.design({setUpPropertyPane:function(){var a=MySystem.getPath("mainPage.propertyViewPane");
var b=MySystem.nodesController.get("allSelected").firstObject();if(!a.isPaneAttached){a.append()
}a.set("objectToEdit",b)},deleteObject:function(){var a=MySystem.getPath("mainPage.propertyViewPane");
a.get("objectToEdit").destroy();return YES},tearDownPropertyPane:function(){var a=MySystem.getPath("mainPage.propertyViewPane");
if(a.isPaneAttached){a.remove()}a.set("objectToEdit",null)},enterState:function(){SC.Logger.log("Entering state %s",this.get("name"));
this.setUpPropertyPane()},exitState:function(){SC.Logger.log("Leaving state %s",this.get("name"));
this.tearDownPropertyPane()},diagramSelectionChanged:function(){var a=MySystem.nodesController.get("allSelected");
if(a.get("length")!==1){this.gotoState("DIAGRAM_EDITING")}else{if(!a.firstObject().get("linkStyle")){this.gotoState("DIAGRAM_EDITING")
}else{this.setUpPropertyPane()}}return YES}});MySystem.SENTENCE_OBJECT_LINKING=Ki.State.design({sentenceDiagramConnect:function(a){MySystem.storySentenceController.set("editingSentence",a.sentence);
this.gotoState("SENTENCE_OBJECT_LINKING_SETUP");return YES},dimAll:function(){MySystem.nodesController.unselectAll();
MySystem.canvasView.get("classNames").push("sentence-linking");var a=MySystem.store.find("MySystem.Link");
a.forEach(function(b){SC.Logger.log("Dimming link %s",b.get("id"));b.set("isDimmed",YES)
});return YES},updateHighlighting:function(){var b=function(d){return d.kindOf(MySystem.Link)
};var a=MySystem.store.find("MySystem.Link");var c=MySystem.nodesController.get("allSelected").filter(b);
a.forEach(function(d){if(c.indexOf(d)>-1){SC.Logger.log("Un-dimming link %s",d.get("id"));
d.set("isDimmed",NO)}else{SC.Logger.log("Dimming link %s",d.get("id"));d.set("isDimmed",YES)
}});return YES},diagramSelectionChanged:function(){var a=MySystem.nodesController.get("allSelected");
var b=MySystem.storySentenceController.get("editingSentence");b.get("links").removeObjects(b.get("links"));
b.get("nodes").removeObjects(b.get("nodes"));a.forEach(function(c){if(c.instanceOf(MySystem.Link)){b.get("links").pushObject(c)
}else{if(c.instanceOf(MySystem.Node)){b.get("nodes").pushObject(c)}else{SC.Logger.log("Bad item type "+c)
}}});this.updateHighlighting();return YES},tearDownSentenceLinkPane:function(){var a=MySystem.getPath("mainPage.sentenceLinkPane");
if(a.isPaneAttached){a.remove()}MySystem.nodesController.unselectAll()},closeButton:function(){SC.Logger.log("Got the closeButton event");
MySystem.storySentenceController.set("editingSentence",null);this.gotoState("DIAGRAM_EDITING");
return YES},enterState:function(){SC.Logger.log("Entering state %s",this.get("name"));
this.updateHighlighting()},exitState:function(){SC.Logger.log("Leaving state %s",this.get("name"));
var a=MySystem.store.find(MySystem.Link);this.tearDownSentenceLinkPane();a.forEach(function(b){b.set("isDimmed",NO)
});if(MySystem.canvasView.get("classNames").indexOf("sentence-linking")===MySystem.canvasView.get("classNames").get("length")-1){MySystem.canvasView.get("classNames").pop()
}else{if(MySystem.canvasView.get("classNames").indexOf("sentence-linking")>-1){MySystem.canvasView.get("classNames").splice(MySystem.canvasView.get("classNames").indexOf("sentence-linking"))
}}}});MySystem.SENTENCE_OBJECT_LINKING_SETUP=Ki.State.design({diagramSelectionChanged:function(){return YES
},dimAll:function(){MySystem.nodesController.unselectAll();if(MySystem.canvasView.get("classNames").indexOf("sentence-linking")<0){MySystem.canvasView.get("classNames").push("sentence-linking")
}var a=MySystem.store.find("MySystem.Link");a.forEach(function(b){b.set("isDimmed",YES)
});return YES},setUpSentenceLinkPane:function(c){var b=MySystem.getPath("mainPage.sentenceLinkPane");
if(c===null){c=MySystem.storySentenceController.get("editingSentence")}SC.Logger.log("Now editing linked nodes and links for %s",c.get("id"));
var a=c.get("links");if(!b.isPaneAttached){b.append();b.becomeFirstResponder()}MySystem.canvasView.selectObjects(a,true);
MySystem.nodesController.selectObjects(c.get("nodes"),true)},enterState:function(){SC.Logger.log("Entering state %s",this.get("name"));
var a=MySystem.storySentenceController.get("editingSentence");this.dimAll();this.setUpSentenceLinkPane(a);
this.gotoState("SENTENCE_OBJECT_LINKING")},exitState:function(){SC.Logger.log("Leaving state %s",this.get("name"))
}});MySystem.ExceptionHandler={handleException:function(a){if(this.isShowingErrorDialog){return
}this._displayErrorDialog(a)},_displayErrorDialog:function(b){var a=this._errorDialogHTMLForException(b),c=document.createElement("div");
c.style.cssText="left: 0px; right: 0px; top: 0px; bottom: 0px; position: absolute; background-color: white; background-color: rgba(255,255,255,0.6); z-index:100;";
c.innerHTML=a;document.body.appendChild(c);this.isShowingErrorDialog=YES},_errorDialogHTMLForException:function(b){var a;
a=['<div id="sc-error-dialog" style="position: absolute; width: 500px; left: 50%; top: 50%; margin-left: -250px; background-color: white; border: 1px solid black; font-family: Monaco, monospace; font-size: 9px; letter-spacing: 1px; padding: 10px">',"An error has occurred which prevents the application from running:","<br><br>",b.message,'<div id="sc-error-dialog-reload-button" onclick="window.location.reload();" style="float: right; font-family: Monaco, monospace; font-size: 9px; letter-spacing: 1px; border: 1px solid black; padding: 3px; clear: both; margin-top: 20px; cursor: pointer;">',"Reload","</div>","</div>"];
return a.join("")},isShowingErrorDialog:NO};sc_require("core");MySystem.AddButtonView=SC.View.extend({layout:{top:10,left:20,right:10,width:100},padding:10,displayProperties:"content isSelected".w(),content:null,isSelected:false,childViews:"frame icon label".w(),render:function(a){arguments.callee.base.apply(this,arguments);
if(this.get("isSelected")){a.addClass("selected")}},frame:SC.View.design({classNames:"node addbutton".w(),layout:{top:12,bottom:10,height:122}}),icon:SC.ImageView.design({classNames:"image",useImageCache:true,layout:{top:30,width:50,height:70,centerX:0},valueBinding:".parentView.content.image"}),label:SC.LabelView.design({layout:{bottom:5,centerX:0,width:100,height:25},classNames:["name"],textAlign:SC.ALIGN_CENTER,valueBinding:".parentView.content.title",isEditable:NO}),dragDataForType:function(b,a){return null
},mouseDown:function(d){var a=this;var e=MySystem.getPath("mainPage.mainPane.childViews").objectAt(0).getPath("bottomRightView.bottomRightView");
SC.Drag.addDropTarget(e);var c=d.clientX-20;var b=d.clientY-this.layout.top-10;var f={event:d,source:a,ghost:NO,slideBack:NO,data:{title:this.get("content").get("title")||"title",image:this.get("content").get("image")||"image",clickX:c,clickY:b}};
SC.Drag.start(f)},mouseUp:function(a){arguments.callee.base.apply(this,arguments);
var b=MySystem.getPath("mainPage.mainPane.childViews").objectAt(0).getPath("bottomRightView.bottomRightView");
SC.Drag.removeDropTarget(b)}});sc_require("core");MySystem.BadgeButtonView=SC.View.extend({layout:{top:0,left:0,width:100,height:120},classNames:"".w(),displayProperties:"content isSelected".w(),content:null,isSelected:false,childViews:"icon".w(),render:function(a){arguments.callee.base.apply(this,arguments);
if(this.get("isSelected")){a.addClass("selected")}},icon:SC.ImageView.design({classNames:"image",useImageCache:true,layout:{top:20,width:68,height:68,centerX:0},value:"images/00_my_system_badge.png"}),mouseDown:function(d){var e=MySystem.getPath("mainPage.mainPane.childViews").objectAt(0).getPath("bottomRightView.bottomRightView");
var g=e.get("childViews");var a=g.get("length");for(var c=0;c<a;c+=1){SC.Drag.addDropTarget(g.objectAt(c))
}var b=this;var f={event:d,source:b.get("parentView"),dragView:b,ghost:NO,slideBack:NO,data:{Boolean:true}};
SC.Drag.start(f)},mouseUp:function(b){arguments.callee.base.apply(this,arguments);
var d=MySystem.getPath("mainPage.mainPane.childViews").objectAt(0).getPath("bottomRightView.bottomRightView");
var e=d.get("childViews");var a=e.get("length");for(var c=0;c<a;c+=1){SC.Drag.removeDropTarget(e.objectAt(c))
}}});MySystem.Terminal=SC.View.extend(LinkIt.Terminal,{layout:{left:45,top:+5,width:10,height:10},linkClass:"MySystem.Link",canDragLink:function(){return YES
},canDropLink:function(){return YES},computeDragOperations:function(b,a){return this.canDropLink()?SC.DRAG_LINK:SC.DRAG_NONE
}});sc_require("models/link");sc_require("views/terminal");MySystem.NodeView=SC.View.extend(SCUI.Cleanup,LinkIt.NodeView,{layout:{top:0,left:0,width:100,height:120},classNames:"node".w(),displayProperties:"content isSelected".w(),content:null,isSelected:false,childViews:"icon label aTerminal bTerminal".w(),_runAction:function(a){var b=this.get("action"),c=this.get("target")||null;
if(b){this.getPath("pane.rootResponder").sendAction(b,c,this,this.get("pane"))}},render:function(a){arguments.callee.base.apply(this,arguments);
if(this.get("isSelected")){a.addClass("selected")}},icon:SC.ImageView.design({classNames:"image",useImageCache:true,layout:{top:20,width:50,height:70,centerX:0},valueBinding:".parentView*content.image"}),label:SC.LabelView.design({layout:{bottom:12,centerX:0,width:100,height:25},classNames:["name"],textAlign:SC.ALIGN_CENTER,valueBinding:".parentView*content.title",isEditable:YES}),aTerminal:MySystem.Terminal.design({nodeBinding:".parentView*content",classNames:"input terminal".w(),terminal:"a"}),bTerminal:MySystem.Terminal.design({layout:{left:45,bottom:+5,width:10,height:10},nodeBinding:".parentView*content",classNames:"output terminal".w(),terminal:"b"}),terminalViewFor:function(a){return this[a+"Terminal"]
},dragStarted:function(b,a){},dragEntered:function(b,a){},dragUpdated:function(b,a){},dragExited:function(b,a){},dragEnded:function(b,a){},computeDragOperations:function(c,a,b){if(c.hasDataType("Boolean")){return SC.DRAG_LINK
}else{return SC.DRAG_NONE}},acceptDragOperation:function(b,a){return true},performDragOperation:function(b,a){this.content.set("transformer",true);
return a}});sc_require("views/node");sc_require("core");MySystem.CanvasView=LinkIt.CanvasView.extend(SCUI.Cleanup,{allowMultipleSelection:YES,isDropTarget:NO,computeDragOperations:function(b,a){return SC.DRAG_COPY
},performDragOperation:function(b,e){var d=b.location.x-this.parentView.get("frame").x-b.data.clickX;
var c=b.location.y-this.get("frame").y-b.data.clickY;var a={title:b.data.title,image:b.data.image,x:d,y:c};
MySystem.statechart.sendEvent("addNode",a);return SC.DRAG_COPY},didCreateLayer:function(){var c=this.get("frame");
var b=this.$("canvas.base-layer");if(b){b.attr("width",c.width);b.attr("height",c.height);
if(b.length>0){var a=b[0].getContext("2d");if(a){a.clearRect(0,0,c.width,c.height);
this._drawLinks(a)}else{SC.Logger.warn("MySystem.CanvasView.render(): Canvas object context is not accessible.")
}}else{SC.Logger.warn("MySystem.CanvasView.render(): Canvas element array length is zero.")
}}else{SC.Logger.warn("MySystem.CanvasView.render(): Canvas element is not accessible.")
}return arguments.callee.base.apply(this,arguments)},select:function(a,b){if(b&&(a===null||a.length===0)){return
}return arguments.callee.base.apply(this,arguments)},collectionViewMouseDown:function(i){var g=this.itemViewForEvent(i),f=this.get("content"),e=g?g.get("contentIndex"):-1,c,d,b,a,j,h=f.get("allowsMultipleSelection");
c=this.mouseDownInfo={event:i,itemView:g,contentIndex:e,at:Date.now()};this.becomeFirstResponder();
if(this.get("useToggleSelection")){if(this.get("selectOnMouseDown")){if(!g){return
}b=this.get("selection");a=b&&b.containsObject(g.get("content"));if(a){this.deselect(e)
}else{if(!h){this.select(e,NO)}else{this.select(e,YES)}}}return YES}if(!g){j=i.ctrlKey||i.metaKey;
if(this.get("allowDeselectAll")&&!j){this.select(null,false)}return YES}b=this.get("selection");
if(b){b=b.indexSetForSource(f)}a=b?b.contains(e):NO;c.modifierKeyPressed=j=i.ctrlKey||i.metaKey;
if(j&&a){c.shouldDeselect=e>=0}else{if(i.shiftKey&&b&&b.get("length")>0&&h){b=this._findSelectionExtendedByShift(b,e);
d=this._selectionAnchor;this.select(b);this._selectionAnchor=d}else{if(!j&&a){c.shouldReselect=e>=0
}else{if((i.shiftKey||j)&&!h){this.select(null,false)}if(this.get("selectOnMouseDown")){this.select(e,j)
}else{c.shouldSelect=e>=0}}}}c.previousContentIndex=e;return YES},mouseDown:function(k){var l,a,g,f,e,i,d,c;
var j;this.collectionViewMouseDown(k);this._dragData=null;if(k&&(k.which===3)||(k.ctrlKey&&k.which===1)){var h=this.get("selectedLinks");
if(h&&!this.getPath("selection.length")){c=[{title:"Delete Selected Links".loc(),target:this,action:"deleteLinkSelection",isEnabled:YES}];
d=SCUI.ContextMenuPane.create({contentView:SC.View.design({}),layout:{width:194,height:0},itemTitleKey:"title",itemTargetKey:"target",itemActionKey:"action",itemSeparatorKey:"isSeparator",itemIsEnabledKey:"isEnabled",items:c});
d.popup(this,k)}}else{var b=k.metaKey&&this.get("allowMultipleSelection");l=this.get("parentView");
a=this.get("frame");g=l?l.convertFrameToView(a,null):a;f=k.pageX-g.x;e=k.pageY-g.y;
this._selectLink({x:f,y:e},b);i=this.itemViewForEvent(k);if(i){this._dragData=SC.clone(i.get("layout"));
this._dragData.startPageX=k.pageX;this._dragData.startPageY=k.pageY;this._dragData.view=i;
this._dragData.didMove=NO}}return YES},selectLink:function(a){a.set("isSelected",true);
this.set("linkSelection",a);this.set("selectedLinks",[a])}});sc_require("core");MySystem.ColorChooserView=SC.View.extend({layout:{top:0,left:0,width:120,height:120},classNames:"".w(),displayProperties:"content isSelected".w(),content:null,isSelected:false,childViews:"chooser".w(),render:function(a){arguments.callee.base.apply(this,arguments);
if(this.get("isSelected")){a.addClass("selected")}},createChildViews:function(){arguments.callee.base.apply(this,arguments);
this.childViews[0].childViews[0].childViews[0].childViews[1].bind("value",this,"content")
},chooser:Forms.FormView.design({fields:"color".w(),color:Forms.FormView.row(MySystem.ImprovedRadioView,{layout:{width:160,height:120},value:null,fieldKey:"color",fieldLabel:"Color:",items:[{title:"Thermal Energy",value:"red",enabled:YES},{title:"Light Energy",value:"green",enabled:YES},{title:"Mechanical Energy",value:"blue",enabled:YES}],itemTitleKey:"title",itemValueKey:"value",itemIsEnabledKey:"enabled",layoutDirection:SC.LAYOUT_VERTICAL})})});
MySystem.EnergyColorView=SC.View.extend(LinkIt.NodeView,{layout:{top:0,left:0,width:40,height:25},classNames:"energy-type".w(),displayProperties:"content isSelected".w(),content:null,isSelected:NO,childViews:"color terminal".w(),color:SC.View.design({layout:{height:25,width:80},backgroundColorBinding:".parentView*content.color"}),terminal:MySystem.Terminal.design({layout:{centerY:0,centerX:0,width:10,height:10},nodeBinding:".parentView*content",classNames:"transformation-terminal".w(),terminal:"a"}),terminalViewFor:function(a){return this.terminal
}});sc_require("core");MySystem.NodePaletteView=SC.ListView.extend({layout:{top:0,bottom:0,left:15},contentBinding:"MySystem.nodePaletteController.content",exampleView:MySystem.AddButtonView,rowHeight:140});
require("views/improved_radio");MySystem.PatchedFormRadioView=Forms.FormFieldView.extend({displayValue:"",init:function(){this.fieldClass=this.fieldClass.extend({itemHeight:18,autoResize:NO,autoResizeDidChange:function(){this.measure()
}.observes("autoResize"),didUpdateLayer:function(){arguments.callee.base.apply(this,arguments);
this.measure()},layoutChildViews:function(){arguments.callee.base.apply(this,arguments);
this.measure()},measure:function(){if(this.get("autoResize")){var e=this.get("layer");
if(!e){return}var c=e.offsetHeight,b=e.offsetWidth;e.style.height="0px";e.style.width="0px";
var a=e.scrollHeight;var d=e.scrollWidth+14;e.style.height=c+"px";e.style.width=b+"px";
if(a!=this.get("layout").height){this.adjust("height",a).updateLayout()}if(d!=this.get("layout").width){this.adjust("width",d).updateLayout()
}}}});arguments.callee.base.apply(this,arguments)},setupLabelView:function(){this.labelView=this.createChildView(this.get("labelView"));
this.labelView.bind("value",[this,"displayValue"]);this.labelView.bind("autoResize",[this,"autoResize"]);
this.appendChild(this.labelView)},valueDidChange:function(){var f=this.get("items");
var g=this.get("value");if(!f){this.set("displayValue",g);return}var e,b=f.length;
var a=this.get("itemValueKey"),j=this.get("itemTitleKey");for(e=0;e<b;e++){var h=f.objectAt(e);
var c="",d="";if(SC.typeOf(h)===SC.T_ARRAY){d=h[0];c=h[1]}else{if(h){if(j){d=h.get?h.get(j):h[j]
}else{d=(h.toString)?h.toString():null}if(a){c=h.get?h.get(a):h[a]}else{c=h}}}if(!d){d=c
}if(g==c){this.set("displayValue",d);return}}}.observes("value","itemValueKey","itemTitleKey","items")});
Forms.FormFieldView.registerSpecialization(MySystem.ImprovedRadioView,MySystem.PatchedFormRadioView);
sc_require("core");MySystem.PropertyEditorPane=SC.PalettePane.create({defaultResponder:"MySystem.statechart",layout:{top:150,right:5,width:250,height:240},classNames:"property-editor".w(),displayProperties:"objectToEdit isSelected".w(),objectToEdit:null,childViews:"".w(),propertiesForm:Forms.FormView.create({fields:"".w(),findField:function(b){var a=null;
this.fields.forEach(function(e,d,c){if(e.get("fieldKey")==b){a=e}});return a}}),indexOf:function(b,c){for(var a=0;
a<c.length;a+=1){if(b==c[a]){return a}}return -1},update_everything:function(){var f=this.get("propertiesForm");
var g=this.get("deleteButton");var c=this.get("objectToEdit");if(c===null){if(f.parentView!==null){f.set("fields",[]);
f.removeAllChildren()}}else{if(f.parentView===null){this.appendChild(f)}f.set("content",c);
f.set("fields",[]);f.removeAllChildren();f.set("fields",c.get("formFields"));if(c.kindOf(MySystem.Link)){var d=f.get("_displayFields").objectAt(0).get("_displayFields").objectAt(0).get("field");
var a=d.get("items");for(var b=0;b<a.get("length");b+=1){var e=a.objectAt(b);e.enabled=true
}}}}.observes("objectToEdit"),fieldChanged:function(f,b,c,a){var e=f;var d=e.get("value");
this.get("objectToEdit").set(b,d)}});MySystem.SentenceView=SC.View.extend({childViews:"sentenceText linkButton".w(),classNames:"story-sentence",sentenceText:SC.LabelView.design({layout:{left:5,right:50},valueBinding:".parentView*content.bodyText",canEditContent:YES,canDeleteContent:YES,isEditable:YES}),linkButton:SC.ButtonView.design({layout:{right:5,width:40},titleMinWidth:45,value:NO,contentBinding:".parentView*content",buttonBehavior:SC.TOGGLE_BEHAVIOR,icon:"images/00_my_system_icon_link.gif",toolTip:"Link this sentence with part of the diagram",pushButton:function(){if(this.value){MySystem.statechart.sendEvent("sentenceDiagramConnect",{sentence:this.content});
this.set("value",NO)}}.observes("value")})});MySystem.SentenceConnectPane=SC.PalettePane.create({defaultResponder:"MySystem.statechart",layout:{top:150,right:5,width:150,height:150},classNames:"sentence-connect-pane".w(),contentView:SC.View.design({childViews:"labelView doneButton".w(),labelView:SC.LabelView.design({layout:{left:5,right:5,top:5,width:140,height:80},value:"Select the nodes and links your sentence describes, then click the 'Done' button.",canEditContent:YES,canDeleteContent:YES,isEditable:NO,isEnabled:YES}),doneButton:SC.ButtonView.design({buttonBehavior:SC.PUSH_BEHAVIOR,layout:{left:10,right:10,bottom:10,height:20},title:"Done",toolTip:"Click to link and close this window",action:"closeButton",theme:"capsule",isEnabled:YES})})});
sc_require("views/sentence");MySystem.UserStoryView=SC.View.extend({childViews:"sentencesView addButtonView".w(),backgroundColor:"#eeefff",sentencesView:SC.ScrollView.design({hasHorizontalScroller:NO,layout:{top:5,right:5,bottom:30,left:5},contentView:SC.ListView.design({contentBinding:"MySystem.storySentenceController.arrangedObjects",selectionBinding:"MySystem.storySentenceController.selection",contentValueKey:"bodyText",rowHeight:20,exampleView:MySystem.SentenceView,canEditContent:YES,canDeleteContent:YES,canReorderContent:YES})}),addButtonView:SC.ButtonView.design({layout:{bottom:10,right:15,height:20,width:150},title:"Add sentence to story",target:"MySystem.storySentenceController",action:"addStorySentence",toolTip:"Add a sentence to the story"})});
sc_require("views/user_story");MySystem.StoriesView=SC.SplitView.extend({layoutDirection:SC.LAYOUT_HORIZONTAL,topLeftView:SC.View.design({childViews:"assignmentView checkButtonView".w(),backgroundColor:"#eeefff",canCollapse:YES,assignmentView:SC.LabelView.design({valueBinding:"MySystem.storyController.content",anchorLocation:SC.ANCHOR_TOP,layout:{top:5,right:5,bottom:5,left:5},tagName:"div",escapeHTML:NO,textAlign:SC.ALIGN_LEFT}),checkButtonView:SC.ButtonView.design({layout:{right:15,bottom:10,height:20,width:80},title:"Check",toolTip:"Check your diagram",action:"checkDiagramAgainstConstraints"})}),dividerView:SC.SplitDividerView,bottomRightView:MySystem.UserStoryView});
MySystem.TransformationView=SC.View.extend(LinkIt.Link,{startNode:null,endNode:null,startTerminal:"a",endTerminal:"a"});
sc_require("views/energy_color");MySystem.TransformationAnnotationPane=SC.PalettePane.extend({isModal:YES,classNames:"transformationAnnotation".w(),transformation:null,layout:{centerX:0,centerY:100,width:500,height:200},contentView:SC.View.design({childViews:"label storySentenceField doneButton".w(),label:SC.LabelView.design({layout:{top:0,left:0,width:150,height:20},displayValue:"Explanation"}),storySentenceField:SC.LabelView.design({layout:{top:20,left:5,right:5,height:20},displayValueBinding:".parentView.parentView*transformation.annotation.bodyText",canEditContent:YES,canDeleteContent:YES,isEditable:YES}),doneButton:SC.ButtonView.design({acceptsFirstResponder:YES,buttonBehavior:SC.PUSH_BEHAVIOR,layout:{centerX:80,width:150,bottom:10,height:20},title:"Done",toolTip:"Click to finish and close this window",target:"MySystem.transformationsController",action:"closeTransformationAnnotater",theme:"capsule",isEnabled:YES})})});
sc_require("core");MySystem.TransformationCanvas=LinkIt.CanvasView.extend(SCUI.Cleanup,{isDropTarget:NO,didCreateLayer:function(){var c=this.get("frame");
var b=this.$("canvas.base-layer");if(b){b.attr("width",c.width);b.attr("height",c.height);
if(b.length>0){var a=b[0].getContext("2d");if(a){a.clearRect(0,0,c.width,c.height);
this._drawLinks(a)}else{SC.Logger.warn("MySystem.CanvasView.render(): Canvas object context is not accessible.")
}}else{SC.Logger.warn("MySystem.CanvasView.render(): Canvas element array length is zero.")
}}else{SC.Logger.warn("MySystem.CanvasView.render(): Canvas element is not accessible.")
}return arguments.callee.base.apply(this,arguments)}});sc_require("views/energy_color");
sc_require("views/transformation_canvas");MySystem.TransformationBuilderPane=SC.PalettePane.extend({isModal:YES,classNames:"transformation-builder".w(),node:null,layout:{centerX:0,centerY:0,width:500,height:400},contentView:SC.View.design({childViews:"inLabel outLabel connect annotateButton doneButton".w(),inLabel:SC.LabelView.design({layout:{top:0,left:0,width:150,height:20},displayValue:"Inbound energy flows"}),outLabel:SC.LabelView.design({layout:{top:0,right:0,width:150,height:20},displayValue:"Outbound energy flows"}),connect:MySystem.TransformationCanvas.design({layout:{top:20,left:0,width:500,height:330},exampleView:MySystem.EnergyColorView,allowMultipleSelection:NO,contentBinding:SC.Binding.from("MySystem.transformationsController")}),annotateButton:SC.ButtonView.design({acceptsFirstResponder:YES,buttonBehavior:SC.PUSH_BEHAVIOR,layout:{centerX:-80,width:150,bottom:10,height:20},title:"Annotate",toolTip:"Describe selected transformation",target:"MySystem.transformationsController",action:"annotate",theme:"capsule",isEnabled:NO}),doneButton:SC.ButtonView.design({acceptsFirstResponder:YES,buttonBehavior:SC.PUSH_BEHAVIOR,layout:{centerX:80,width:150,bottom:10,height:20},title:"Done",toolTip:"Click to finish and close this window",target:"MySystem.transformationsController",action:"closeTransformationBuilder",theme:"capsule",isEnabled:YES})})});
sc_require("views/node");sc_require("views/property_editor");sc_require("views/node_palette");
sc_require("views/sentence");sc_require("views/sentence_connect_pane");MySystem.mainPage=SC.Page.design({mainPane:SC.MainPane.design({defaultResponder:"MySystem.statechart",childViews:"topView".w(),topView:SC.SplitView.design({defaultThickness:140,topLeftView:MySystem.NodePaletteView.design({layout:{top:0,bottom:0,left:15}}),dividerView:SC.SplitDividerView,bottomRightView:SC.SplitView.design({defaultThickness:150,layoutDirection:SC.LAYOUT_VERTICAL,topLeftView:MySystem.StoriesView,dividerView:SC.SplitDividerView,bottomRightView:MySystem.CanvasView.design({layout:{top:120,left:0,right:0,bottom:0},contentBinding:SC.Binding.from("MySystem.nodesController"),selectionBinding:"MySystem.nodesController.selection",linkSelectionBinding:"MySystem.nodesController.linkSelection",exampleView:MySystem.NodeView})})})}),propertyViewPane:MySystem.PropertyEditorPane,sentenceLinkPane:MySystem.SentenceConnectPane,transformationBuilderPane:MySystem.TransformationBuilderPane.design({}),transformationAnnotaterPane:MySystem.TransformationAnnotationPane.design({})});
sc_require("lib/old_format_json_parser");MySystem.studentMode=MySystem.ADVANCED_STUDENT;
MySystem.main=function main(){MySystem.dataSource=SC.CascadeDataSource.create({dataSources:["studentStateDataSource","fixturesDataSource"],studentStateDataSource:MySystem.MergedHashDataSource.create({handledRecordTypes:[MySystem.Link,MySystem.Node,MySystem.Story,MySystem.StorySentence],dataStoreDidUpdateDataHash:function(){var f=JSON.stringify(this.get("dataHash"),null,2);
SC.$("#my_system_state").text(f)}}),fixturesDataSource:SC.FixturesDataSource.create({commitRecords:function(){return YES
}})});MySystem.store=SC.Store.create({commitRecordsAutomatically:YES,setStudentStateDataHash:function(f){this.dataSource.studentStateDataSource.setDataHash(this,f)
},getStudentStateDataHash:function(){var f=this.dataSource.studentStateDataSource.dataHash();
return JSON.stringify(f,null,2)}}).from(MySystem.dataSource);MySystem.updateFromDOM();
MySystem.getPath("mainPage.mainPane").append();SC.ExceptionHandler=MySystem.ExceptionHandler;
var b=MySystem.store.find(MySystem.Node);MySystem.nodesController.set("content",b);
var e=MySystem.store.find(MySystem.Activity,"assign1");MySystem.activityController.set("content",e);
MySystem.energyTypes=[];e.get("energyTypes").forEach(function(f){MySystem.energyTypes.push({label:f.get("label"),color:f.get("color"),isEnabled:f.get("isEnabled")})
});var a=SC.Query.local(MySystem.StorySentence,{orderBy:"order"});var d=MySystem.store.find(a);
MySystem.storySentenceController.set("content",d);var c=MySystem.store.find(MySystem.Transformation);
MySystem.canvasView=MySystem.mainPage.mainPane.topView.bottomRightView.bottomRightView;
MySystem.transformationsCanvasView=MySystem.getPath("mainPage.transformationBuilderPane").get("childViews").objectAt(0).get("childViews").objectAt(2);
MySystem.transformationAnnotaterPane=MySystem.getPath("mainPage.transformationAnnotaterPane");
MySystem.statechart.initStatechart()};function main(){MySystem.main()}MySystem.clearCanvas=function(){var c;
var b=MySystem.store.find(MySystem.Node);for(c=0;c<b.get("length");++c){b.objectAt(c).destroy()
}var a=MySystem.store.find(MySystem.Link);for(c=0;c<a.get("length");++c){a.objectAt(c).destroy()
}};MySystem.loadCanvas=function(){MySystem.clearCanvas();var b=MySystem.store.find(MySystem.StudentState).objectAt(0);
var a=JSON.parse(b.get("content"));MySystem.parseOldFormatJson(a)};MySystem.loadWiseConfig=function(b,a){SC.run(function(){var c=MySystem.Activity.fromWiseStepDef(b);
MySystem.activityController.set("content",c);MySystem.energyTypes=[];c.get("energyTypes").forEach(function(d){MySystem.energyTypes.push({label:d.get("label"),color:d.get("color"),isEnabled:d.get("isEnabled")})
});MySystem.updateFromDOM()})};
if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/node/mysystem/js/03_my_system_javascript.js');};
