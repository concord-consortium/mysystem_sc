/**
 *jslint browser: true, maxerr: 50, indent: 4

 * @author npaessel
*/

M2A = {};
M2A.ruleList = [];
M2A.selectedRule = null;

M2A.makeRule = function(name) {
  var rule                                     = {};
  rule.name = name;
  rule.id = M2A.ruleList.size;
  rule.preamble                                = "The diagram contains";
  rule.count_assertion                         = {};
  rule.count_assertion.qualifier               = "EXATLY";               // [ EXACTLY | MORE_THAN | LESS_THAN ]
  rule.count_assertion.number                  = 1;
  rule.node_selector                           =  "NODE_ANY";             // or node type name
  rule.connection_assertion                    = {};
  rule.connection_assertion.type               = "NONE";                 // [ NONE | CONNECTED | NOT_CONNECTED ]
  rule.connection_assertion.node_selector      = "NODE_ANY";             // or node type name
  rule.connection_assertion.energy_selector    = "ENERGY_ANY";           // or energy type name

  return rule;
};

M2A.buildEditor = function(rule) {
  var elm = $('<div>');
  elm.addClass('edit_rule');
  elm.append('<p>').text(rule.preamble);

  var count_assertion_qualifier_elm = $('<select>');
  count_assertion_qualifier_elm.addClass('count_assertion_qualifier_elm');
  var count_assertion_qualifier_types = ['EXACTLY','MORE_THAN', 'LESS_THAN'];
  var i = 0;
  var option;
  for (i = 0; i < count_assertion_qualifier_types.length; i++) {
    option = $('<option>');
    option.attr('value',count_assertion_qualifier_types[i]);
    option.attr('name',count_assertion_qualifier_types[i]);
    option.text = count_assertion_qualifier_types[i];
    if (rule.count_assertion.qualifier == count_assertion_qualifier_types[i]) {
      option.attr('selected','true');
    }
    count_assertion_qualifier_elm.append(option);
  }
  count_assertion_qualifier_elm.bind('change', function(evt) {rule.count_assertion.qualifier = evt.currentTarget.value; rule.update();});
  elm.append(count_assertion_qualifier_elm);
  
  var count_assertion_number_elm = $('<input>');
  count_assertion_number_elm.attr('width','2');
  count_assertion_number_elm.attr('name', 'counter_assertion_number');
  count_assertion_number_elm.bind('change', function(evt) { rule.count_assertion_number = evt.currentTarget.value; rule.update(); });
  elm.append(count_assertion_number_elm);

  var nodes = M2A.listNodeTypes();
  var node_selector_elm = $('<select>');
  for(i=0; i < nodes.length; i++) {
    node_name = nodes[i];
    option = $('<option>');
    option.attr('name',nodes[i]);
    option.attr('value',nodes[i]);
    option.text(nodes[i]);
    if(rule.node_selector == nodes[i]) {
      option.attr('selected', 'true');
    }
    node_selector_elm.append(option);
  }
  node_selector_elm.bind('change', function(evt)  {rule.node_selector = evt.currentTarget.value; rule.update(); } );
  elm.append(node_selector);
  return elm;
}

M2A.viewHeierarchy = [
    'count_assertion_modifier',
    'count_assertion',
    'node_selector',
    'connection_assertion'
];

M2A.addRule = function() {
  var rule = M2A.addRule(M2A.makeRule());
  M2A.selectedRule = M2A.renderRule(rule);
};

M2A.createOption = function(opts) {
  var name = opts.name;
  var claz = opts.claz;
  var elem = $('<option></option>');
};

// explicitly creates
M2A.createSelect = function(opts) {
  var elem = $('<select></select>');
  var claz = opts.claz;
  var i = 0;
  if (claz) { elem.addClass(claz); }
  var options = opts.options || [];
  for(i=0; i <options.length; i++) {
    M2A.addOptionToSelect(elem, options[i]);
  }
};

View.prototype.Mysystem2Node = M2A;
View.prototype.Mysystem2Node.generatePage = function(view){ };

