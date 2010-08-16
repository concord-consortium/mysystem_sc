require 'rubygems'
require 'lebowski'

dir = File.dirname(__FILE__) 
Dir.glob(dir + '/linkit/**/*.rb') {|file| require file}
require "#{dir}/node_view.rb"

include Lebowski::Foundation
include Lebowski::SCUI::Views
include MySystem::Views


ProxyFactory.proxy NodeView

TEST_PORT =  ENV[:TEST_PORT] || 4022;
SELENIUM_PORT = ENV[:SELENIUM_PORT] || 4244;
TEST_SETTINGS = {
  :app_root_path => "/my_system",
  :app_name => "MySystem",
  :app_server_port => TEST_PORT,
  :selenium_server_port => SELENIUM_PORT,
  :browser => :firefox
}


$commands = {
  :sproutcore => {
    :path => "sc-server --port #{TEST_PORT}",
    :name => "sproutcore server",
    :pid => nil
  },
  :lebowski => {
    :path => "lebowski-start-server -port #{SELENIUM_PORT}",
    :name => "lebowski",
    :pid => nil
  }
}

Spec::Matchers.define :have_node_item_view_support do |sig|
  match do |obj|
    obj.respond_to? :has_node_item_view_support
  end
end


# create a new started test applicaion 
# configured with mysystem settings

def new_test
  app =  MainApplication.new TEST_SETTINGS
  app.start
  app.maximize  # TODO: Seems like dragging doesn't work unless we are maximized.
  sleep 1       # TODO: hackish pause, CanvasView is not ready otherwise..
  app.define 'canvas', 'mainPage.mainPane.topView.bottomRightView.bottomRightView', CanvasView
  return app
end

def start_command(name)
  command = $commands[name.to_sym]
  unless command[:pid]
    command[:pid] = fork do
      puts "Starting process  #{command[:name] || name} with #{command[:path]} #{command[:args]}"
      Signal.trap("HUP") do
        puts "Stopping process #{command[:name] || name}"
        exit
      end
      if (command[:args])
        exec(command[:path] || name, command[:args])
      else
        exec(command[:path])
      end
    end
    puts "Started  #{command[:name] || name} with PID: #{command[:pid]}" 
  else
    puts "WARNING: process  #{command[:name] || name} already started with #{command[:pid]}"
  end
  sleep 1 # Hackish pause to spin up job.
end


def stop_command(name)
  command = $commands[name.to_sym]
  if command && command[:pid]
    Process.kill('TERM',command[:pid])
    Process.wait(command[:pid])
    command[:pid] = nil;
    puts "#{command[:name] || name} stopped"
  else
    puts "WARNING: #{command[:name] || name} does not seem to be running"
  end
end

def start_testing_servers
  $commands.keys.each do |command|
    start_command(command)
  end
end

def stop_testing_servers
  $commands.keys.each do |command|
    stop_command(command)
  end
end

def with_lebowsk_server (&block)
  start_testing_servers
  sleep 2 #shouldn't have to wait, but there ya-go.
  yield
  stop_testing_servers
end
