#!/usr/bin/env ruby

# Example of a configurable script for use on a CI system such as Hudson. A best practice is to make sure this runs on
# developer machines as well.

require "trollop"                   # install this gem   
require "bundler/setup"             # if using sc-testdriver as a "git gem"
require "sc-server-controller"      # sc-testdriver provides sc-server-controller

puts "********************************************"
puts "    Running SproutCore unit tests"
puts "********************************************"

# to keep this simple only include the command options that are being used
# Process command-line options
@options = Trollop::options do
  opt :tests_dir, "Tests directory", :short => 't', :type => :string, :default => "{apps}"
  opt :results_dir, "Results directory", :short => 'o', :type => :string, :default => "results"
  opt :sc_server_path, "Path to sc-server command", :short => 'p', :type => :string, :default => "sc-server"
  opt :sc_server_host, "SC Server Host", :short => 's', :type => :string, :default => "localhost"
  opt :runner, "Browser runner", :short => 'b', :type => String, :default => "capybara"
  opt :image, "Save a png snapshot of the test page(doesn't work in all browser runners)", :short => 'i', :default => false
  opt :root, "Test directory root", :short => 'r', :type => String, :default => "."
end

# NOTE the sc_server_host is not used when starting up the sc-server it is only used by the browser runner
# to access the tests.  This way cloud based testing can be used to access the local sc-serve

port = ENV['SC_SERVER_PORT'] ? ENV['SC_SERVER_PORT'].to_i : 4020

sc_server = SCServerController.new(@options[:sc_server_path], port)

# remove old test results rm reports/*.xml
system("git clean -f #{@options[:results_dir]}")

sc_server.start
run_tests_cmd = ["bundle", "exec", "sc-testdriver",
                 "-p #{port}",
                 "-r #{@options[:root]}", # set the root for looking for the tests to be this directory
                 "#{'-i' if @options[:image]}",
                 "-h",
                 # "-x apps/my_system/tests/jasmine",
                 "-t #{@options[:tests_dir]}",
                 "-o #{@options[:results_dir]}",
                 "-s #{@options[:sc_server_host]}",
                 "-b #{@options[:runner]}"]
puts run_tests_cmd.join(' ')
system(run_tests_cmd.join(' '))
run_test_result = $?
sc_server.stop
exit(run_test_result.exitstatus)
