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


### More information: ###

* [Current feature](http://bit.ly/bhGHKR) being worked on.
* DEMO: <http://mysystem_sc.dev.concord.org/>
* GITHUB <https://github.com/concord-consortium/mysystem_sc/>
* CI server at: <http://hudson.dev.concord.org/hudson/job/MySystem_SproutCore/>

Related projects:

* LinkIt <http://github.com/etgryphon/linkit-demo/>
* SCUI <http://github.com/etgryphon/sproutcore-ui/>
* SproutCore <http://github.com/sproutit/sproutcore/>
* Lebowski <http://github.com/FrozenCanuck/Lebowski>
* Previous mysystem effort: <http://github.com/knowuh/mysystem/>


