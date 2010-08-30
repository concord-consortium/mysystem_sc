# ===========================================================================
# Project:   MySystem Sproutcore implementation
# Copyright: ©2010 Concord Consortium
# ===========================================================================

# Add initial buildfile information here
config :all, :required => [:forms, :sproutcore]
config :my_system, :required => [:sproutcore, :scui, :forms]

# CORE FRAMEWORKS
config :scui, :required => [:sproutcore, :'scui/drawing', :'scui/linkit']
#config :forms, :required => [:sproutcore]

# SPECIAL FRAMEWORKS AND THEMES
# These do not require any of the built-in SproutCore frameworks
%w(testing debug standard_theme empty_theme).each do |target_name|
  config target_name, 
    :required => [], :test_required => [], :debug_required => []
end

# CONFIGURE THEMES
config :standard_theme, 
  :theme_name => 'linkit-theme',
  :test_required  => ['sproutcore/testing'],
  :debug_required => ['sproutcore/debug']

# This configuration section will be applied to all bundles used by your
# application, even bundles that come from other gems.
config :my_system do |c|
  c[:required] = [:sproutcore, :scui, :forms]
  c[:theme] = :standard_theme
  c[:load_fixtures] = true
end
