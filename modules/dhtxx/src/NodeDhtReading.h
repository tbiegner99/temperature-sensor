
#include "DHTXXD.h"
#include <napi.h>

class NodeDhtReading : public Napi::AsyncWorker {
	public: 
		NodeDhtReading(Napi::Env, int, Napi::Promise::Deferred ) ;
		~NodeDhtReading();
		void Execute();
		void OnOK();
		void OnError(const Napi::Error&);
	private:
	 	DHTXXD_t *dht;
		int gpio;
		Napi::Promise::Deferred deferred;
};
