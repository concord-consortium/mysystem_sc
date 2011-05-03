  MySystem ©2010 [Concord Consortium](http://concord.org), 
  [MIT License](http://www.opensource.org/licenses/mit-license.php). 
  See file "LICENSE" for more information


-----------------

### MySystem. A system diagraming tool. ###

![what we are working on](http://dl.dropbox.com/u/73403/mysystem_sc/mysystem_sc.png "feature being worked on")

-----------------

### Getting started: ###

1. git clone git://github.com/concord-consortium/mysystem_sc.git mysystem_sc
2. cd mysystem_sc
3. git submodule init
4. git submodule update
5. bundle install
6. bundle exec sc-server
7. if you get an error about 'iconv' see this [rvm page](http://rvm.beginrescueend.com/packages/iconv/)


### Initial student data

The app saves the "student data" state (i.e., the nodes, links, and stories) into a div with id my_system_state, which is defined in apps/my_system/lib/index.rhtml. To update the default initial student state, serialize the dataHash property of the studentStateDataSource, escape the serialized JSON it for inclusion in an html document, and put it inside the my_system_state div in that element.

### Lebowski testing: ###

TODO: Looks like lebowski tests might be wedged.

0. the Gemfile stipulates dependencies on lebowski
1. cd to your sproutcore directory: <code> cd /path/to/mysystem_sc </code>
2. run the test! <code>bundle exec lebowski-spec spec/mysystem_spec.rb</code> (where mysystem_spec.rb is your test)



### Running SproutCore QUnit tests with capybara-testrunner ###
1. From the top-level mysystem_sc directory:
`rvm gemset import`

1. don't abort on first error
`set +e`

2. remove cached files:
`rm -rf tmp`

3. remove old reports
`rm reports/*.xml`

4. `$SC_SERVER_PORT` is usually 4020. That environment variable is used so multiple ci server (such as Husdon) job instances don't use the same port
`sc-server --port=$SC_SERVER_PORT --host=0.0.0.0 & sleep 1`

5. Go into the capybara-testrunner directory and run the tests
`pushd capybara-testrunner
ruby -rubygems run-tests.rb -p $SC_SERVER_PORT -i -h -t apps -o ../reports
EXIT_STATUS=$?`

6. Leave the capybara-testrunner directory
`popd`

7. send a control-c to sc-server
`kill -s 2 %1

exit $EXIT_STATUS`


### Building as WISE4 step ###


0. Install WISE4. See http://code.google.com/p/wise4/wiki/StableWISEDeploymentModel for the gory details. Check with the wise4-dev google group http://groups.google.com/group/wise4-dev if you run into problems.
1. Make sure $CATALINA_HOME is points to the directory where Tomcat is installed.
2. run the default rake task: `bundle exec rake` (This will invoke sc-build and resource_squasher from http://github.com/knowuh/resource_squasher and create the 
3. run the 'copy_files' rake task: `bundle exec rake copy_files`. This will copy the MySystem files to $CATALINA_HOME/webapps/vlewrapper/vle/node/mysystem_sc/
4. Startup the WISE4 server: `cd $CATALINA_HOME; bin/startup.sh`
5. Verify that you can visit the MySystem app directly: http://localhost:8080/vlewrapper/vle/mysystem_sc/mysystem_sc.html
6. Login to http://localhost:8080/webapp/ as a teacher and attempt to create a project with MySystem as an active step. Then create a 'project run' based on that project. 
7. Login to http://localhost:8080/webapp/ as a student in the class you specified when creating the project run. Verify that you can start the project with the MySystem step. Manipulate the MySystem system diagram and leave the activity. Verify that your manipulation is reloaded when you login and visit the MySystem step again.

The files put into $CATALINA_HOME/webapps/vlewrapper/vle/node/mysystem_sc are derived from the files in this repository in the folders wise4/mysystem_sc and apps/my_system/lib/index.rhtml via the default Rake task. See the Rakefile in the root of this repo. These template files created in accordance with the directions at http://code.google.com/p/wise4/wiki/HowToCreateANewWise4Step as of 5/2/2011

### More information: ###

* Slightly outdated demo: <http://mysystem_sc.dev.concord.org/>
* GITHUB <https://github.com/concord-consortium/mysystem_sc/>
* CI server at: <http://hudson.dev.concord.org/hudson/job/MySystem_SproutCore/>
* To understand user interaction with the application, understand the Ki statechart system (see link below).
* Build JSDoc documentation using `sc-docs`.

Related projects:

* SproutCore <http://github.com/sproutit/sproutcore/>
* SCUI <http://github.com/etgryphon/sproutcore-ui/>
* LinkIt <http://github.com/etgryphon/linkit-demo/>
* Lebowski <http://github.com/FrozenCanuck/Lebowski>
* Ki <http://github.com/FrozenCanuck/Ki>
* Previous mysystem effort: <http://github.com/knowuh/mysystem/>


