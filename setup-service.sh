#! /bin/bash

path=`dirname ${BASH_SOURCE[0]}`

cp $path/temperature.service /etc/systemd/systemd

systemctl enable temperature
systemctl start temperature