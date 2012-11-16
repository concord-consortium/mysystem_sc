# More info at https://github.com/guard/guard#readme

interactor :off

guard 'rake', :task => 'build', :run_on_start => false do 
  watch(%r{^apps/my_system/.*})
end

guard 'rake', :task => 'copy_templates', :run_on_start => false do
  watch(%r{^wise4/mysystem2/.*})
end

# optionally rsync files to our remote server 
guard :shell do
  watch(%r{^vle/node/mysystem2/version_info.html$}) do 
    command = ENV['WISE_RSYNC_COMMAND']
    if command
      %x[#{command}]
    else
      puts "export WISE_RSYNC_COMMAND='something' to rsync"
      puts "or have a look at ./rvmrc.sample for one approach"
    end
  end
end