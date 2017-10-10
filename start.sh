#!/bin/bash

. /etc/profile

mypath=`pwd`


cd $mypath

/usr/local/node-v7.0/bin/cnpm i && /usr/local/node-v7.0/bin/npm run build && /usr/local/node-v7.0/bin/npm run $1