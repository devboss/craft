#!/usr/bin/env bash

# Setup docker build - clean up old containers/images
setupDocker() {
	echo "Setting up pipelines docker..."
	export
	export DOCKER_TLS_VERIFY=
	export
}

# login to AWS ECR
loginToEcr() {
	aws ecr get-login | source /dev/stdin
}

# docker build, tag and push
dockerBuild() {
    cd $BITBUCKET_CLONE_DIR
	docker build -t laplanduk/craft:latest .
	docker tag laplanduk/craft:latest 309363696441.dkr.ecr.eu-west-1.amazonaws.com/laplanduk/craft:latest
	export CURRENT_COMMIT_TAG=$(git describe --tags --exact-match --abbrev=0)
	echo $CURRENT_COMMIT_TAG
	if [ "$CURRENT_COMMIT_TAG" ]; then
	    docker tag laplanduk/craft:latest 309363696441.dkr.ecr.eu-west-1.amazonaws.com/laplanduk/craft:$CURRENT_COMMIT_TAG
		docker tag laplanduk/craft:latest 309363696441.dkr.ecr.eu-west-1.amazonaws.com/laplanduk/craft:latest-release
	fi
	docker push 309363696441.dkr.ecr.eu-west-1.amazonaws.com/laplanduk/craft:latest
	if [ "$CURRENT_COMMIT_TAG" ]; then
	    docker push 309363696441.dkr.ecr.eu-west-1.amazonaws.com/laplanduk/craft:$CURRENT_COMMIT_TAG
	    docker push 309363696441.dkr.ecr.eu-west-1.amazonaws.com/laplanduk/craft:latest-release
	fi
}