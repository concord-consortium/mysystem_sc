When /^I drag the following onto the canvas:$/ do |table|
  table.hashes.each do |hash|
    item = case hash['type']
           when 'light bulb'
             @add_bulb
           when 'clay'
             @add_clay
           when 'hand'
             @add_hand
           else
             puts "Unrecognized palette item type: #{hash['type']}"
             next
           end
    item.drag_in_canvas(hash['x'].to_i, hash['y'].to_i)
  end
end

When /^I create the following links:$/ do |table|
  table.hashes.each do |hash|
    source = @canvas.nodes[hash['source_node'].to_i - 1]
    dest = @canvas.nodes[hash['dest_node'].to_i - 1]
    source.terminal_by_name(hash['source_terminal']).link_to dest.terminal_by_name(hash['dest_terminal']), 8, 8
  end
end

Then /^the canvas should have (\d+) nodes$/ do |num|
  @canvas.nodes.count.should == num.to_i
end

Then /^the canvas should have (\d+) links$/ do |num|
  @canvas.links.count.should == (num.to_i * 2) # for whatever reason, the link count is doubled
end

Then /^the following nodes should be linked:$/ do |table|
  table.hashes.each do |hash|
    source = @canvas.nodes[hash['source_node'].to_i - 1]
    source.should be_linked_to(hash['dest_node'].to_i - 1)
  end
end
