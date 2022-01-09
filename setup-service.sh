#! /bin/bash
set -e

readNumber() {
    while true; do
        echo $1
        read $2
        if [[ ${!2} =~ ^[0-9]+$ ]]; then
            break;
        else 
            echo $'This must be a number'
        fi
    done
}

readRequired() {
    while true; do
        echo $1
        read $2
        if [[ ${!2} =~ ^.+$ ]]; then
            break;
        else 
            echo $'This is required'
        fi
    done
}


path=`pwd`

NODE_DIR=`which node`

cp $path/temperature.service /etc/systemd/system

# readRequired $'What is the name of the zone?\n' ZONE_NAME
# read -p $'Describe the zone?\n' ZONE_DESC
# readNumber $'What port should I listen on?\n' APP_PORT
# readNumber $'Which GPIO pin is temperature sensor on?\n' GPIO_PIN
# readNumber $'How many seconds between temperature checks?\n' INTERVAL_SECS
# JSON_CONFIG="{
#     \"zoneName\": \"${ZONE_NAME}\",
#     \"zoneDescription\": \"${ZONE_DESCRIPTION}\",
#     \"appPort\": ${APP_PORT},
#     \"gpioPin\": ${GPIO_PIN},
#     \"interval\": $((INTERVAL_SECS * 1000))
# }"

# if [[ -f "./config.json" ]]; then
#     node -e "console.log(JSON.stringify(Object.assign(require('./config.json'),${JSON_CONFIG}),undefined,4))" > config_new.json
#     rm config.json
#     mv config_new.json config.json
# else 
#     echo $JSON_CONFIG > config.json
# fi
# chmod 777 config.json 

# echo "ZONE_NAME=${ZONE_NAME}" > environment
# echo "ZONE_DESCRIPTION=${ZONE_DESC}" >> environment

sed -i "s|\$PWD|$path|g" /etc/systemd/system/temperature.service

sed -i "s|\$NODE_DIR|$NODE_DIR|g" /etc/systemd/system/temperature.service


#systemctl enable temperature
#systemctl start temperature