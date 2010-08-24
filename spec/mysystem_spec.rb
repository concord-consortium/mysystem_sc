require "#{File.dirname(__FILE__)}/support/ms_spec_helper.rb"
require 'rubygems'
require 'lebowski'


describe "MySystem" do
  before(:all) do
    start_testing_servers
    @test = new_test
    @canvas = @test['canvas']
    @node_0 = @canvas.nodes[0]
    @node_1 = @canvas.nodes[1]
    @node_2 = @canvas.nodes[2]
    @palette = @test['palette']
    @add_bulb = @palette.addBulb
  end

  after(:all) do
    stop_testing_servers
  end

  # This seems to prove that we have the chrome, but I think it just proves
  # that there are views in the appropriate places in the view stack
  it "will have two chrome views supporting the canvas" do
    @canvas.parentView.childViews[0].should_not be nil
    @canvas.parentView.childViews.count.should be 3 # StoryView, divider, Canvas
    @canvas.parentView.childViews[0].layout.top.should be 0 # StoryView at the top
    @canvas.parentView.childViews[0].layout.left.should be 0
    @canvas.parentView.parentView.childViews[0].should_not be nil
    @canvas.parentView.parentView.childViews.count.should be 3 # Palette, divider, story-and-canvas
    @canvas.parentView.parentView.childViews[0].layout.top.should be 0
    @canvas.parentView.parentView.childViews[0].layout.left.should be 0
  end
  
  it "will have at least one add-node button in the palette" do
    @palette.childViews.count.should be >1 # Label view at top shouldn't count
  end

  it "will have at least 3 nodes loaded from the fixtures" do
    @canvas.should_not be_empty
    @canvas.nodes.count.should be 3
  end

  it "will verify that there are 3 nodes on the canvas" do
    # Dependent on fixture state
    @node_0.should be_a_kind_of NodeView
    @node_0.should have_node_item_view_support
  end
  
  it "will have at least 2 links loaded from the fixtures" do
    @canvas.links.count.should be 4 # Apparently the link array is *2?
  end

  it "will click each of the nodes, one by one" do
    @canvas.nodes.each do |node|
      node.click
      node.should be_selected
    end
  end

  it "will drag the first node to coordinates (400, 150)" do
    @node_0.drag_in_canvas(400, 150)
    @node_0.layout.top.should be 150
    @node_0.layout.left.should be 400
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
  # as of 17 August 2010
  it "will have some nodes loaded from fixtures linked" do
    @node_0.should be_linked_to 1
    @node_1.should be_linked_to 0
    
    @node_0.should be_linked_to 2
    @node_2.should be_linked_to 0

    @node_1.should_not be_linked_to 2
    @node_2.should_not be_linked_to 1
  end
  
  it "will click each link, one by one" do
  #   @canvas.links.each do |link|
  #     link.click
  #     link.should be_selected
  #   end
  end
  # The "click" action here appears to get pretty deep in LinkIt, deeper
  # than I've been able to get with Lebowski so far, so this is commented
  # for the time being.

  it "will link node_1 to node_2" do      
    @node_2.terminal_by_name('a').link_to @node_1.terminal_by_name('a'), 8, 8 
    @node_2.should be_linked_to 1
  end

  it "will delete the newly-created link" do
    # Count links
    # Click the link to select it (not yet in our power)
    # Delete the selected link
    # Count of links should be reduced by one
  end

  it "will create a new node" do
    @add_bulb.drag_in_canvas(300, 200)
    @canvas.nodes.count.should be 4
  end

  it "will appropriately adjust the location of the new node" do
    @canvas.nodes[3].layout.top.should be 73 # 200 minus the 127 of the story view
    @canvas.nodes[3].layout.left.should be 173 # 300 minus the 127 of the palette view
  end
end

