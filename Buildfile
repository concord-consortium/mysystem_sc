# ===========================================================================
# Project:   MySystem Sproutcore implementation
# Copyright: ©2011 Concord Consortium
# ===========================================================================

require File.expand_path('../frameworks/jasmine-sproutcore/builders/jasmine_builder', __FILE__)

# Add initial buildfile information here
config :all, 
       :required => [:sproutcore, "sproutcore/experimental/forms"],
       :load_fixtures => true,
       :layout => 'lib/index.rhtml',
       :theme => 'sproutcore/ace',
       :serve_public => true

# CORE FRAMEWORKS
config :scui, :required => [:sproutcore, :'scui/drawing', :'scui/linkit']

# This configuration section will be applied to all bundles used by your
# application, even bundles that come from other gems.
config :my_system,
  :required => [:sproutcore, :scui, "sproutcore/experimental/forms", 'raphael_views/raphael_views'],
  :css_theme => 'ace.mysystem-theme'

namespace :build do
  desc "builds a jasmine unit test"
  build_task :test do
    Jasmine::Builder::Test.build ENTRY, DST_PATH
  end
end

mode :no_minify
  config :all,
    :minify => false,
    :minify_css => false
