# ===========================================================================
# Project:   MySystem Sproutcore implementation
# Copyright: ©2011 Concord Consortium
# ===========================================================================

require File.expand_path('../frameworks/jasmine-sproutcore/builders/jasmine_builder', __FILE__)

# Add initial buildfile information here
config :all, 
       :required => [:forms, :sproutcore],
       :load_fixtures => true #

# CORE FRAMEWORKS
config :scui, :required => [:sproutcore, :'scui/drawing', :'scui/linkit']

# SPECIAL FRAMEWORKS AND THEMES
# These do not require any of the built-in SproutCore frameworks
%w(testing debug standard_theme empty_theme).each do |target_name|
  config target_name, 
    :required       => [],
    :test_required  => [],
    :debug_required => []
end

# CONFIGURE THEMES
config :standard_theme, 
  :theme_name     => 'linkit-theme',
  :test_required  => ['sproutcore/testing'],
  :debug_required => ['sproutcore/debug']

# This configuration section will be applied to all bundles used by your
# application, even bundles that come from other gems.
config :my_system,
  :required => [:sproutcore, :scui, :forms, :ki],
  :theme    => :standard_theme

namespace :build do
  desc "builds a jasmine unit test"
  build_task :test do
    Jasmine::Builder::Test.build ENTRY, DST_PATH
  end
end
