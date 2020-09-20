#include "NodeDhtReading.h"
#include "DHTXXD.h"
#include <iostream>

NodeDhtReading::NodeDhtReading(Napi::Env env, int gpio, Napi::Promise::Deferred deferred) 
: Napi::AsyncWorker(env),gpio(gpio) ,deferred(deferred) {
	dht = DHTXXD(gpio, DHTXX, NULL);
}

NodeDhtReading::~NodeDhtReading(){
	free(dht);
}

void NodeDhtReading::Execute() {
	DHTXXD_manual_read(dht);
	switch(dht->_data.status) {
		case DHT_BAD_DATA:
			SetError("Could not read data");
			break;
		case DHT_BAD_CHECKSUM:
			SetError("Checksum invalid");
			break;
		case DHT_TIMEOUT:
			SetError("Dht timeout. Ensure sensor is connected on gpio "+this->gpio);
			break;
		case DHT_GOOD: 
		return;
		default: SetError("Unknown error");
		 
	}
}

void NodeDhtReading::OnOK() {
	Napi::Object resolve=Napi::Object::New(Env());
	resolve.Set("temperature",Napi::Number::New(Env(),dht->_data.temperature));
	resolve.Set("humidity",Napi::Number::New(Env(),dht->_data.humidity));
	this->deferred.Resolve(resolve);
}

void NodeDhtReading::OnError(const Napi::Error& err) {
	this->deferred.Reject(err.Value());
}
