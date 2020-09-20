{
    "targets": [
        {
            "target_name":"dht",
            "sources":["./src/node_dht.cc", "./src/DHTXXD.cc", "./src/NodeDhtReading.cc"],
            "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
            "libraries":["-lpigpio"],
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions"],
            "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
        }
    ]
}