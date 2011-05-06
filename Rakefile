
require 'erb'

@tomcat_dir         = ENV['CATALINA_HOME']
@sc_project_name    = "my_system"
@project_title      = "My System"
@wise_step_name     = "mysystem_sc"
@template_directory = "wise4/#{@wise_step_name}"
@output_directory   = "vle/node/#{@wise_step_name}"
@template_suffix    = ".erb"

task :default => [:wise]

desc "package sproutcore for for a wise4 deployment"
task :wise => [:repackage, :inject_javascript, :copy_templates, :copy_files] 

desc "copy the files to the apache dir"
task :copy_files do
  dest_dir = "#{@tomcat_dir}/webapps/vlewrapper/vle/node/#{@wise_step_name}" 
  src_dir = @output_directory
  %x[ rm -rf #{dest_dir}]
  %x[ cp -r #{src_dir} #{dest_dir}]
end

  
desc "clean the output directory"
task :clean do
    # remove the old build directory
    %x[rm -rf #{@output_directory}]
end

desc "add script loader callback to javascript files"
task :inject_javascript do
  javascript_files = Dir.glob(File.join(@output_directory,'js','*.js'))
  javascript_files.each do |file|
    File.open(file,'a') do |f|
      f.puts # lets add a newline
      javascript = "if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', '#{file}');};"
      f.puts javascript
    end
  end
end

desc "build wise-4 files from standard sprout-core build"
task :repackage => [:clean] do
  begin
    require 'resource_squasher'
    # clean and build the release
    %x[sc-build -rc #{@sc_project_name}]

    # compact and rewrite application for wise4
    puts "rezsquish squash --project_name=#{@sc_project_name} --output_dir=#{@output_directory} --index_file=#{@wise_step_name}"
    %x[rezsquish squash --project_name=#{@sc_project_name} --output_dir=#{@output_directory} --index_file=#{@wise_step_name}]

    # rename the html file
    # Now we use the <stepname>.html.erb template for this
    #%x[mv #{@output_directory}/00*.html #{@output_directory}/#{@wise_step_name}.html]

  rescue LoadError
    puts "ensure that you are using bundler, and that resource_squasher gem is"
    puts "defined in your Gemfil. Then do 'bundle install'"
    puts "Invoke rake using 'bundle exec rake'"
  end
end


desc  "Copy vle wrapper classes using template files with variable substition"
task :copy_templates do
  templates = Dir.glob(File.join(@template_directory, "**", "*#{@template_suffix}"))
  js        = Dir.glob(File.join(@output_directory,"js","*.js"))

  js_files = []
  js_files += js.map do |j|
    filename = j.gsub("vle/#{@wise_step_name}/","vle/node/#{@wise_step_name}/")
    "'#{filename}'"
  end

  js_files = js_files.join(",\n\t")

  css       = Dir.glob(File.join(@output_directory,"css","*.css"))
  css_files = css.map do |j|
    filename = j.gsub("vle/#{@wise_step_name}/","vle/node/#{@wise_step_name}/")
    "'#{filename}'"
  end
  css_files = css_files.join(",\n\t")

  templates.each do |filename|
    content = ERB.new(::File.read(filename)).result(binding)
    resultname = File.basename(filename).gsub(/#{@template_suffix}$/,'')
    resultpath = File.join(@output_directory, resultname)
    File.open(resultpath,'w') do |f|
      f.write(content)
      puts "translated #{filename} to #{resultpath}"
    end
  end
end

namespace :demos do
	base_dir = File.join(File.dirname(__FILE__),'debug')
	desc "snapshot demo"
	task :snapshot_demo do
		dest_dir = File.join(base_dir,'snapshot_demo/app/')
		src_dir = @output_directory
		%x[ mkdir -p #{dest_dir}]
		%x[ cp -r #{src_dir} #{dest_dir}]
	end
end
