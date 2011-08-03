# ===========================================================================
# Project:   MySystem Sproutcore implementation
# Copyright: ©2011 Concord Consortium
# ===========================================================================

require File.expand_path('../frameworks/jasmine-sproutcore/builders/jasmine_builder', __FILE__)

# Add initial buildfile information here
config :all, 
       :required => [:forms, :sproutcore],
       :load_fixtures => true,
       :layout => 'lib/index.rhtml'

# CORE FRAMEWORKS
config :scui, :required => [:sproutcore, :'scui/drawing', :'scui/linkit']

# This configuration section will be applied to all bundles used by your
# application, even bundles that come from other gems.
config :my_system,
  :required => [:sproutcore, :scui, :forms, :ki],
  :theme => 'my_system_theme'

namespace :build do
  desc "builds a jasmine unit test"
  build_task :test do
    Jasmine::Builder::Test.build ENTRY, DST_PATH
  end
end
