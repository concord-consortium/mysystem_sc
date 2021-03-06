# ===========================================================================
# Project:   MySystem Sproutcore implementation
# Copyright: ©2011 Concord Consortium
# Sproutcore build file ... for building sproutcore app.
# MySystem Sproutcore build will happen with 'bundle exec rake'
# or 'bundle exec sc-build' .  The former will also create WISE4 glue.
# ===========================================================================

require File.expand_path('../frameworks/jasmine-sproutcore/builders/jasmine_builder', __FILE__)

# Add initial buildfile information here
config :all, 
       :required => [:sproutcore, "sproutcore/experimental/forms"],
       :layout => 'lib/index.rhtml',
       :theme => 'sproutcore/ace',
       :serve_public => true

# This configuration section will be applied to all bundles used by your
# application, even bundles that come from other gems.
config :my_system,
  :required => [:sproutcore, "sproutcore/experimental/forms", 'raphael_views/raphael', 'raphael_views/raphael_views'],
  :css_theme => 'ace.mysystem-theme'

# Proxies  
# this is odd, and actually proxies /mysystem_designs to couchdb.cosmos.concord.org/mysystem_designs
proxy '/mysystem_designs', :to => 'couchdb.cosmos.concord.org'


namespace :build do
  desc "builds a jasmine unit test"
  build_task :test do
    Jasmine::Builder::Test.build ENTRY, DST_PATH
  end
end

mode :no_minify do
  config :all,
    :minify => false,
    :minify_css => false
end

mode :demo do
  config :my_system,
    :load_fixtures => true
end