# billing-app-web


## Project description
billing-app web client

## Branch Naming

Same as billing-app/README.md

## Running server

### With docker

    $ docker run --name baw -it --rm -v ${PWD}:/billing-app-web  -v /billing-app-web/node_modules -p 3000:3000  -e CHOKIDAR_USEPOLLING=true baw
        --name: container name to be used instead of id
        -it: interactive mode
        -v: volumes
        -p: port exposed
        -e: env variable for hot reloading
        baw: name of the image used to run container

### No docker

    $ npm run start