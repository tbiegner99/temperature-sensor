
#include "NodeDhtReading.h"
#include <napi.h>
#include <pigpio.h>

	void teardown(const Napi::CallbackInfo& info) {
		gpioTerminate();
	}
	
	void setup(const Napi::CallbackInfo& info) {
		gpioInitialise();
	}
	
	
	Napi::Value readValue(const Napi::CallbackInfo& info) {
		Napi::Env env = info.Env();
		int gpio = (int) info[0].ToNumber().Int32Value();
		Napi::Promise::Deferred deferred =  Napi::Promise::Deferred::New(info.Env());
		NodeDhtReading* readingObj = new NodeDhtReading(env,gpio,deferred);
		readingObj->Queue();
		return deferred.Promise();
	}
	
	Napi::Object Init(Napi::Env env,Napi::Object exports) {
		exports.Set("setup",Napi::Function::New(env, setup));
		exports.Set("teardown",Napi::Function::New(env, teardown));
		exports.Set("readValue",Napi::Function::New(env, readValue));
		return exports;
	}
	
	NODE_API_MODULE(dht, Init);



