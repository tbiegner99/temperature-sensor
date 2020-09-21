#! /bin/bash

path=`dirname ${BASH_SOURCE[0]}`

cp $path/temperature.service /etc/systemd/system

systemctl enable temperature
systemctl start temperature