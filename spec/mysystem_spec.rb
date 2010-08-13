require "#{File.dirname(__FILE__)}/support/ms_spec_helper.rb"

describe "MySystem" do
  before(:all) do
    start_testing_servers
    @test = new_test
    @canvas = @test['canvas']
    @node_0 = @canvas.nodes[0]
    @node_1 = @canvas.nodes[1]
    @node_2 = @canvas.nodes[2]
  end

  after(:all) do
    stop_testing_servers
  end

  it "will have at least 3 nodes loaded from the fixtures" do
    @canvas.should_not be_empty
    @canvas.nodes.count.should be 3
  end
      
  it "will verify that there are 3 nodes on the canvas" do
    @node_0.should be_a_kind_of NodeView
    @node_0.should have_node_item_view_support
  end
  
  it "will click each of the nodes, one by one" do
    @canvas.nodes.each do |node|
      node.click
      node.should be_selected
    end
  end

  it "will drag the first node to coordinates (400, 150)" do
    @node_0.drag_in_canvas(400, 150)
  end
  
  it "will drag the second node below the first node (by the index)" do 
    @node_1.drag_below 0
    @node_1.should be_positioned_below 0
  end

  it "will drag the third node to the right of the second node (by index)" do
    @node_2.drag_right_of 1
    @node_2.should be_positioned_right_of 1
  end

  # tricky & brittle! relies on fixture state
  # as of 
  it "some nodes loaded from fixtures should be linked" do
    @node_0.should be_linked_to 1
    @node_1.should be_linked_to 0
    
    @node_0.should be_linked_to 2
    @node_2.should be_linked_to 0

    @node_1.should_not be_linked_to 2
    @node_2.should_not be_linked_to 1
  end

  it "will link node_1 to node_2" do      
    @node_2.terminal_by_name('a').link_to @node_1.terminal_by_name('a'), 8, 8 
    @node_2.should be_linked_to 1
  end
end

