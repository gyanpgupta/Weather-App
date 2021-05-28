### Packages Installation

Run `npm install` command for installing the required packages.

### Setup Environment

Create the `.env` file and copy the _.env.example_ file code and paste into **.env** file for configuring the environment

### Install Redis in system.

> If Redis is not installed in the system then run the below command for installing the Redis else you can directly start the server.

`wget http://download.redis.io/redis-stable.tar.gz`

`tar xvzf redis-stable.tar.gz`

`cd redis-stable`

`make`

**\*Confirm installation by running command\*\***

`make test`

> You can then copy redis to your path by running the below command.

`sudo make install`

> To confirm that redis has been properly setup, start the redis server by running

`redis-server`

### Redis Server

Run `redis-server` command for starting the redis server process.

### Server Starting

Run `npm start` command for starting the server
