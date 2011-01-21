
task :default => [:wise]
desc "build a wise-4 step from the standard sprout-core build"
task :wise do
  begin
    require 'resource_squasher'
    # clean and build release
    %x[sc-build -rc my_system]

    # remove the old build directory
    %x[rm -rf wise4]
    # compact and rewrite application for wise4
    %x[rezsquish squash --project_name=my_system --output_dir=vle/mysystem_sc]

    # add wrapper classes
    %x[cp -r wise4/mysystem_sc/* vle/mysystem_sc/]

    # rename the html file
    %x[mv vle/mysystem_sc/00*.html vle/mysystem_sc/mysystem_sc.html]

  rescue LoadError
    puts "You need to install the resource squasher gem like so:"
    puts "  gem install ./resource_squasher-0.0.1.gem"
  end

end

# builds mysystem for wise-4 TODO: Make this a rake task or something.
# The sc-build tool is pretty opaque to me after reading the source for 20 min.


