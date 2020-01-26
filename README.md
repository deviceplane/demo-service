# Deviceplane Demo Service

This repo represents the simplest of deployment patterns where pushing to master automatically deploys to a Deviceplane application. Although CircleCI is used here, the same concepts should apply to most other CI systems.

## How it works

CircleCI will be triggered whenever a new commit is pushed to master. When this happens CircleCI will execute a series of steps defined in `.circleci/config.yml`.

### Build steps
The build steps are responsible for building a Docker image containing the application and then pushing that image to Docker Hub.

1.

```
docker run --rm --privileged multiarch/qemu-user-static:register --reset
```

This command enables execution of different multi-architecture containers. In simpler terms, this allows us to build Docker images for other architectures on x86 servers. More information on this can be found [here](https://github.com/multiarch/qemu-user-static).

If you're building x86 Docker images then this step isn't necessary.

2.

```
docker build -t deviceplane/demo:$CIRCLE_SHA1 .
```

This command tells the Docker daemon to build an image by following the steps in `Dockerfile`. Notice that we tag the image with `$CIRCLE_SHA1`. CircleCI will replace this variable with the git SHA from the latest commit on master.

3.

```
echo $DOCKER_PASSWORD | docker login -u $DOCKER_USER --password-stdin
```

Login to Docker so that we're authorized to push images to Docker Hub. `$DOCKER_USER` and `$DOCKER_PASSWORD` are [environment variables](https://circleci.com/docs/2.0/env-vars/) specified in CircleCI ahead of time.

4.

```
docker push deviceplane/demo:$CIRCLE_SHA1
```

Push the image we built previously to Docker Hub.

### Deploy step
Now that the newly built Docker image is available in Docker Hub we can deploy to Deviceplane.

```
deviceplane deploy demo deviceplane.yml
```

This command requires three [environment variables](https://circleci.com/docs/2.0/env-vars/) to be setup ahead of time. These are setup as [environment variables](https://circleci.com/docs/2.0/env-vars/) in CircleCI.

- `DEVICEPLANE_ACCESS_KEY` - An access key for either a user or service account that has permission to release to this deployment.
- `DEVICEPLANE_PROJECT` - The name or ID of the project we're deploying to.

The file `deviceplane.yml` contains the specification for an application in Deviceplane. The image that's used is based on the image that was pushed to Docker Hub in the build step.

```
demo:
  image: deviceplane/demo:$CIRCLE_SHA1
  ports:
  - 3000:3000
```
