#TODO: Use thore for this instead of RAKE and use erb templates?

@sc_project_name    = "my_system"
@wise_setp_name     = "mysystem_sc"
@template_directory = "wise4/#{@wise_setp_name}"
@output_directory   = "vle/#{@wise_setp_name}"

task :default => [:wise]
desc "build a wise-4 step from the standard sprout-core build"
task :wise do
  begin
    require 'resource_squasher'
    # clean and build the release
    %x[sc-build -rc #{@sc_project_name}]

    # remove the old build directory
    %x[rm -rf #{@output_directory}]
    # compact and rewrite application for wise4
    %x[rezsquish squash --project_name=#{@sc_project_name} --output_dir=#{@output_directory}]

    # add wrapper classes
    %x[cp -r #{@template_directory}/* #{@output_directory}]

    # rename the html file
    %x[mv #{@output_directory}/00*.html #{@output_directory}/#{@wise_setp_name}.html]

  rescue LoadError
    puts "You need to install the resource squasher gem like so:"
    puts "  gem install ./resource_squasher-0.0.1.gem"
  end

end

