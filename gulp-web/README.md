### Build with

* [Node.js](http://nodejs.org/)
* [Gulp](http://gulpjs.com/)

#### Startup built env

##### Install Node.js

* [Installing Node.js via package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)
* [How to install and run a Node.js app on centos-b4bit](https://www.digitalocean.com/community/tutorials/how-to-install-and-run-a-node-js-app-on-centos-6-4-64bit)
* [Installing Node.js 0.10.24 on CentOS 6.4](http://codybonney.com/installing-node-js-0-10-24-on-centos-6-4/)


##### Install Gulp

```
npm install -g gulp
```

##### Install node modules

```
cd project-dir
npm install
```


### For Development

See `Makefile` or `gulpfile.js`, we defined some tasks.

#### Web project

```
# watch & auto build jade/js/less files
gulp watch:web

gulp web:jade
gulp web:less
gulp web:scripts
gulp web:images
...
```

#### Start a proxy server for API service.

https://github.com/fundon/go-proxy

Install go-proxy and start go-proxy server

```
go get -u github.com/fundon/go-proxy
cd mogubao-web
go-proxy -h
# go-proxy -s dist/web -d 192.168.18.1
go-proxy -s dist/web -d modouwifi.net
```

```
make build-web
```
