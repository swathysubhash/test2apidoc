# test2apidoc

Creates documentation by writing functional tests.


## Installation
`npm install test2apidoc`

## Introduction
This module can be used for creating documentation files by writing functional tests. For writing tests, 
[supertest](https://github.com/visionmedia/supertest) should be used. Documention files will be in api blueprint format.

Destination folder for the generated documentation need to be passed while creating doctest. We can also pass css file for custom styling.

Corresponding html files are also generated in the same place by using [aglio](https://github.com/danielgtaylor/aglio).

### Usage

```javascript
var Doctest = require('test2apidoc')(request)
var req = request.agent(require('../lib').listen())

var doctest = Doctest({
	name: 'Org API', 
	description: 'This is the documentation for Org api', 
	path: process.cwd() + "/public/docs",
	style: process.cwd() + "/docless/style.css"
})


describe('api', function() {
	'use strict'
	it('polls', function (done) {
		this.timeout(50000);
		req.get('/polls/v1/945865')
		.docTest(doctest)
		.docGroup({
			name: 'Poll',
			description: 'Apis for fetching poll data'
		})
		.docResource({
			uri: '/poll/v1/:id',
			name: 'Fetch poll',
			description: 'Fetch spoll description'
		})
		.type('application/json')
		.expect('Content-Type', /json/)
		.end(function(err, res) {
			done(err);
		})
	})
	after(function(done) {
		this.timeout(50000);
		doctest.generateDoc(done)
	})
});

```



## License

MIT
