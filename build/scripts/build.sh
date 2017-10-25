#!/usr/bin/env bash

source libs/build_helper.sh

echo "Starting build process..."
setupDocker
loginToEcr
cd $BITBUCKET_CLONE_DIR
if npm install ; then
    if composer install --ignore-platform-reqs ; then
        cd $BITBUCKET_CLONE_DIR/craft/plugins/aurora
        if composer install --ignore-platform-reqs ; then
            cd $BITBUCKET_CLONE_DIR/craft/plugins/realex
            if composer install --ignore-platform-reqs ; then
                cd $BITBUCKET_CLONE_DIR
                if yarn run $TARGET_ENVIRONMENT ; then
                    dockerBuild
                    echo "Build complete."
                else
                    exit
                fi
            else
                exit
            fi
        else
            exit
        fi
    else
        exit
    fi
else
    exit
fi
