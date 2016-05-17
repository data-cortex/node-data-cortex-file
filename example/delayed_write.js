
const dataCortex = require('../index.js');

console.log("simple example of a csv writer");

const opts = {
	filePrefix: '/tmp/',
	defaultEvent: {
		app: 'example_app',
		app_ver: '1.0.0',
	},
};

dataCortex.init(opts);

console.log("before delay");
dataCortex.event({ kingdom: 'before delay'});

setTimeout(() => {
	console.log("after delay");
	dataCortex.event({ kingdom: 'after delay'});
},20*1000);

setTimeout(() => {
	console.log("after second delay");
	dataCortex.event({ kingdom: 'after second delay'});
	dataCortex.closeFiles();
},40*1000);

setTimeout(() => {
	console.log("done done");
},45*1000);
