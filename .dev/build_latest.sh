docker build -t georgesg/flame -t "georgesg/flame:$1" -f .docker/Dockerfile . \
  && docker push georgesg/flame && docker push "georgesg/flame:$1"
