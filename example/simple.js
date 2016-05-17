
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

dataCortex.event({ kingdom: 'kingdom', species: 'species'});
dataCortex.event({ event_datetime: new Date(), kingdom: 'date'});
dataCortex.event({ kingdom: '"quotes""middle""'});
dataCortex.event({ kingdom: "newline\n"});
dataCortex.install({ kingdom: 'organic'});

dataCortex.closeFiles();

console.log("closed files, waiting");
setTimeout(() => {
	console.log("done done");
},1000);
