require 'rubygems'
require 'lebowski'

dir = File.expand_path(File.join(File.dirname(__FILE__), '..', '..', 'spec', 'support'))
Dir.glob(dir + '/linkit/**/*.rb') {|file| require file}
Dir.glob(dir + '/*_view.rb') {|viewfile| require viewfile}
require dir + '/link.rb'

include Lebowski::Foundation
include Lebowski::SCUI::Views
include MySystem::Views

ProxyFactory.proxy NodeView
ProxyFactory.proxy AddButtonView
ProxyFactory.proxy Link

TEST_PORT =  ENV[:TEST_PORT.to_s] || 4022;
SELENIUM_PORT = ENV[:SELENIUM_PORT.to_s] || 4244;
TEST_SETTINGS = {
  :app_root_path => "/my_system",
  :app_name => "MySystem",
  :app_server_host => "127.0.0.1",
  :app_server_port => TEST_PORT,
  :selenium_server_host => "127.0.0.1",
  :selenium_server_port => SELENIUM_PORT,
  :browser => :firefox
}


$commands = {
  :sproutcore => {
    :path => "sc-server --port #{TEST_PORT}",
    :name => "sproutcore server",
    :port => TEST_PORT,
    :pid => nil
  },
  :lebowski => {
    :path => "lebowski-start-server -port #{SELENIUM_PORT}",
    :name => "lebowski",
    :port => SELENIUM_PORT,
    :pid => nil
  }
}

RSpec::Matchers.define :have_node_item_view_support do |sig|
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
  sleep 2       # TODO: hackish pause, CanvasView is not ready otherwise..
  app.define_path 'canvas', 'mainPage.mainPane.topView.bottomRightView.bottomRightView', CanvasView
  app.define_path 'palette', 'mainPage.mainPane.topView.topLeftView.contentView', View
  app.define_path 'story', 'mainPage.mainPane.topView.bottomRightView.topLeftView', LabelView
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
  if command[:port]
    if is_port_open?("127.0.0.1", command[:port])
      puts "Server port opened!"
    else
      puts "WARNING: server port never opened!"
    end
  end
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

require 'socket'
require 'timeout'

def is_port_open?(ip, port)
  begin
    count = 0
    Timeout::timeout(16) do
      begin
        raise Timeout::Error.new if count > 15
        count += 1
        s = TCPSocket.new(ip, port)
        s.close
        return true
      rescue Errno::ECONNREFUSED, Errno::EHOSTUNREACH
        sleep 1
        retry
      end
    end
  rescue Timeout::Error
  end

  return false
end

at_exit do
  stop_testing_servers
end

# start the servers at the start of testing
start_testing_servers

