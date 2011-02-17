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
5. sc-server


### Lebowski testing: ###

TODO: we should script lebowski testing...

0. use the rvm gemset for mysystem, or make a new one for lebowski.
1. Install prerequisit gems:
  1. gem install rspec
  2. gem install selenium
  3. gem install hoe
2. clone lebowski repo & build:
  1. git clone http://github.com/FrozenCanuck/Lebowski.git
  2. rake install_gem
  3. (if you are using rvm, DONT let sudo install run, hit <C-t> to stop rake task, and run this:
    <code>gem install --local pkg/lebowski-0.1.1.gem </code>

After Lebowski is installed in your current rvm gemset, time to test!

1. cd to your sproutcore directory: <code> cd /path/to/mysystem_sc </code>
2. run the test! <code>lebowski-spec spec/mysystem_spec.rb</code> (where mysystem_spec.rb is your test)


### Running SproutCore QUnit tests with capybara-testrunner ###
1. From the top-level mysystem_sc directory:
rvm gemset import

1. don't abort on first error
`set +e`

2. remove cached files:
`rm -rf tmp`

3. remove old reports
`rm reports/*.xml`

4. $SC_SERVER_PORT is usually 4020. That environment variable is used so multiple ci server (such as Husdon) job instances don't use the same port
<pre>
sc-server --port=$SC_SERVER_PORT --host=0.0.0.0 &
sleep 1
</pre>

5. Go into the capybara-testrunner directory and run the tests
<pre>
pushd capybara-testrunner
ruby -rubygems run-tests.rb -p $SC_SERVER_PORT -i -h -t apps -o ../reports
EXIT_STATUS=$?
</pre>

6. Leave the capybara-testrunner directory
`popd`

7. send a control-c to sc-server
<pre>
kill -s 2 %1`

exit $EXIT_STATUS
</pre>

### Building as WISE4 step ###

1. install the resource_squasher `gem intall ./resource_squasher-0.0.1.gem`
2. run the default rake task `rake` (invokes sc-build and wise4 squash)
3. open wise4/00_*.html -- you should be able to preview the static
   files.
4. TODO: There is still some work to be done here: here is where we are:


* wise4 integration demo: http://www.screencast.com/t/1FhY2Nb0
* about the rake tasks: http://screencast.com/t/lCxysMoEaT


### More information: ###

* [Current feature](http://bit.ly/bhGHKR) being worked on.
* DEMO: <http://mysystem_sc.dev.concord.org/>
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


