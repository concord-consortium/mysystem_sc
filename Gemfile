source :gemcutter

# this fork is so the tests run in the correct order on our CI server
gem "sproutcore", "~> 1.6", :git => "git://github.com/concord-consortium/abbot", :branch => "sorted_tests"
gem "lebowski"
gem "daemon_controller"
gem "capybara"
gem "ci_reporter"
gem "rake"
gem "trollop"
gem "resource_squasher", "0.0.3", :git => "git://github.com/knowuh/resource_squasher.git"
gem "sc-testdriver", "0.1.1", :git => "git://github.com/concord-consortium/capybara-testrunner.git", :branch => "gem"
gem "cucumber"

gem "jasmine",  "1.2.0"

# FS Notification libraries for guard (non-polling)
gem 'rb-inotify', :require => false
gem 'rb-fsevent', :require => false
gem 'rb-fchange', :require => false

# build from Guardfile when source files change
gem 'guard'
gem 'guard-rake'
gem 'guard-shell'