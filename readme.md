# Url Migration Tester

It can be very frustrating to check all the urls when you have migrated a website. This tool will help you make it easier.

## Installation
We are not on npmjs.org, so you'll have to do this locally.

You will have to decide how you want to run this application. 
There are several options available:

|How|Pros|Cons|
|---|---|---|
|native node|runs faster, way less command line arguments than docker|requires node:12 on your machine|
|docker|only requires docker|requires docker, slower than native, requires lots of command line arguments|
|docker-compose|only requires docker, less command line arguments than native docker|slower than native, still requires some extra command line arguments|

Basically run native if you have node on your machine in the correct version, otherwise use one of the docker options.

### Directly on your machine
```bash
# enter src directory
cd src

# install dependencies
npm install
```

#### Install as a package
```bash
# install as a linked package
sudo npm link
```

### With docker
```bash
docker run -i -v '/path/to/src:/home/node/app' node:12 npm install 
```

### With docker-compose
If you must use docker this is slightly easier because the configuration is in the docker-compose.yml file.
```bash

# from within the repository
docker-compose run node npm install

# from somewhere else
docker-compose -f /path/to/repository/docker-compose.yml run node npm install
```

## Run the application
When you're done with your configuration, or if you want to see if it really works.

### Run from the repository
```bash
cd /path/to/anywhere
node /path/to/repository/src/bin/index.js [command ] [arguments] [--max-failures=<N>] [--concurrency=<N>] [-v|-vv|-vvv]
```

### As a linked package
```bash
url-tester [command] [arguments] [--max-failures=<N>] [--concurrency=<N>] [-v|-vv|-vvv]
```
See? That was a lot shorter wasn't it?

### In docker
```bash

# can be run from anywhere
docker run -i \
        -v '/path/to/repository/src:/home/node/app' \
        -v '/path/to/project/config:/home/node/app/config' \
        -v '/path/to/project/data:/home/node/app/data' \
        -v '/path/to/project/results:/home/node/app/results' \
    node:12 npm run url-tester [command] [arguments] [--max-failures=<N>] [--concurrency=<N>] [-v|-vv|-vvv]
```

### With docker-compose
```bash

# from within the repository
docker-compose run node npm run url-tester [command] [arguments] [--max-failures=<N>] [--concurrency=<N>] [-v|-vv|-vvv]

# from anywhere else
docker-compose -f /path/to/repository/docker-compose.yml run node npm run url-tester [command] [arguments] [--max-failures=<N>] [--concurrency=<N>] [-v|-vv|-vvv]
```

## Configuration
tba

## Commands

### profile list
```bash
url-tester profile list
```
Lists profiles in your current profile registry

#### arguments

|Argument|Description|Default|
|---|---|---|
|--max-failures|Program will exit if this number of errors has occurred. Use this at the start of your migration when you expect a lot of errors|-1 (infinite)|
|--concurrency|Maximum number of GET requests that will be done at the same time|10|
|-v|Show warnings||
|-vv|Show notices||
|-vvv|Show debug information||

Note that if `--max-failures` is configured but is **lower** than `--concurrency`, 
the program will exit after the specified number of failures but more GET requests may have already been started.
