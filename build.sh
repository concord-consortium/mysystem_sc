#/bin/bash

# expects: 
# $PROJECT_DIR to point at filesystem directory published at $PROJECT_URL (no trailing slash)
# correct gems set up for sproutcore-abbot

echo "Building MySystem for release to $PROJECT_DIR/"

# get the commit #
export COMMIT_HASH=`git log -1 --format=%H`

rm -rf build_folder
rm -rf tmp
# clean out *tracked* files that might have been modified. 
# Leaves, e.g., abbot/ and frameworks/sproutcore/ alone if present.
git checkout -f

# setup raphael-git. Include the --recursive in case we end up adding submodules that have their own submodules
# (a la Smartgraphs including MySystem which in turn includes RaphaelJS)
# git submodule update --init --recursive

# make sure we're using the latest abbot
#if [ ! -d abbot ] ; then
#  git clone git://github.com/sproutit/sproutcore-abbot.git abbot ;
#else
#  cd abbot
#  git checkout -f master
#  git pull
#  cd .. ;
#fi

# make sure we're using the correct sproutcore framework ... Since we're distributing a framework to be used
# with a users' own Sproutcore install, we (probably) don't want to include sproutcore as a git submodule
#if ! git submodule | grep 'frameworks/sproutcore' ; then
#
#  if [ ! -d frameworks/sproutcore ] ; then
#    git clone git://github.com/sproutit/sproutcore frameworks/sproutcore ;
#  fi
#
#  cd frameworks/sproutcore
#  git checkout -f master
#  git pull
#  git checkout `cat ../../sproutcore.commit`
#  cd ../.. ;
#fi

echo
echo "********************************************"
echo
echo "              Building tests"
echo 
echo "********************************************"
echo

cat >>Buildfile <<END
# (leave this line blank in case Buildfile lacks trailing whitespace/newline)
config :all,
  :url_prefix => '/my_system/test/$COMMIT_HASH/'
END

# add testswarm's inject.js to the debug folder of my_system, so it's included in all my_system tests
mkdir -p apps/my_system/debug
curl http://github.com/concord-consortium/testswarm/raw/cc/js/inject.js -o apps/my_system/debug/HUDSON-inject.js

# build the project in debug mode, to get tests
sc-build --languages=en -c --mode=debug --buildroot="build_folder"

# leave the repo happy for the next pull
git checkout -f apps/my_system/debug

# copy tests over to release site
cp -r build_folder/my_system/test/$COMMIT_HASH $PROJECT_DIR/test/

# point capybara-testrunner at tests...
echo "this is where capybara-testrunner would go."

echo
echo "********************************************"
echo
echo "    Building demo apps for distribution"
echo 
echo "********************************************"
echo

# cleanup the repo, including the Buildfile
git checkout -f

# build a release of the demos
cat >>Buildfile <<END
# (leave this line blank in case Buildfile lacks trailing whitespace/newline)
config :all,
  :url_prefix => '/my_system/demos/$COMMIT_HASH/'
END

sc-build --languages=en -c --buildroot="build_folder"
cp -r build_folder/my_system/demos/$COMMIT_HASH $PROJECT_DIR/demos/

# for each demo app, publish the commit as 'latest'
for appname in `ls apps` ; do
  export SC_BUILD_NUMBER=`sc-build-number $appname`
  export APP_PATH=demos/$COMMIT_HASH/$appname/en/$SC_BUILD_NUMBER/index.html
  if [ -e  $PROJECT_DIR/$APP_PATH ] ; then
    mkdir -p $PROJECT_DIR/demos/$appname/latest/
    ln -sf $PROJECT_DIR/$APP_PATH $PROJECT_DIR/demos/$appname/latest/index.html
  fi ;
done

