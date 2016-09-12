
var GenerateSchema = require('generate-schema')
var Header = require('./header')

function Response (res) {
	this.headers = Object.keys(res.headers).map(function(h) { return new Header(h, res.headers[h])} )
	this.type = res.headers['content-type'] || ''
	this.body = res.body
	this.schema = ''
	this.status = res.status
}

Response.prototype = {
	blueprint : function() {
		return '+ Response ' + this.status + ' (' + this.type + ')\n'
				+ this.printHeaders() + this.printBody() + this.printSchema()

	},

	printHeaders: function() {
		if (this.headers.length) {
			return '\t+ Headers\n'
				+ this.headers.map(function(h){ return '\t\t' + h.blueprint() + '\n' }).join('')
		}
	},

	printBody: function() {
		if (this.body) {
			return '\t+ Body\n\t\t' + JSON.stringify(this.body, 0, 4).split('\n').join('\n\t\t')
		}
	},

	printSchema: function() {
		if (this.body) {
			return '\n\t+ Schema\n\t\t' 
				+ JSON.stringify(GenerateSchema.json('BodySchema', this.body), 0, 4)
				.split('\n').join('\n\t\t')
		}
	}
}

module.exports = Response