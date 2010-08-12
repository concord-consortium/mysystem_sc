# require '../../../../lib/lebowski/spec'
require './support/linkit.rb'
# require './support/linkit/mixins/link_support.rb'
#require './support/linkit/mixins/node_item_view_support.rb'
#require './support/linkit/mixins/terminal_view_support.rb'
#require './support/linkit/views/linkit.rb'

require 'node_view'

Spec::Matchers.define :have_node_item_view_support do |sig|
  match do |obj|
    obj.respond_to? :has_node_item_view_support
  end
end

include Lebowski::Foundation
include Lebowski::SCUI::Views
include MySystem::Views

ProxyFactory.proxy NodeView

App = MainApplication.new :app_root_path => "/my_system", :app_name => "MySystem", :browser => :firefox

App.start
App.define 'canvas', 'mainPage.mainPane.topView.bottomRightView.bottomRightView', CanvasView

describe "VIEW: canvas" do
  describe "TEST: setting up" do
    before(:all) do
      @canvas = App['canvas']
    end

    it "will have at least 3 nodes loaded from the fixtures" do
      @canvas.should_not be_empty
      @canvas.nodes.count.should be 3
    end
  end
    
  describe "TEST: clicking and dragging" do
    before(:all) do
      @canvas = App['canvas']
      @node_0 = @canvas.nodes[0]
      @node_1 = @canvas.nodes[1]
      @node_2 = @canvas.nodes[2]
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
    
    it "will drag the second node above the first node (by the index)" do 
      @node_1.drag_above 0
      @node_1.should be_positioned_above 0
    end
  end
  
  describe "TEST: linking" do
    before(:all) do
      @canvas = App['canvas']
      @node_0 = @canvas.nodes[0]
      @node_1 = @canvas.nodes[1]
      @node_2 = @canvas.nodes[2]      
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
      @node_2.terminal_by_name('b').link_to @node_1.terminal_by_name('b'), 3, 3
      wait 20
      @node_2.should be_linked_to 1
    end
  end
  
end
