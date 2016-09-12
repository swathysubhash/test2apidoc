var util = require('./util')
var Header = require('./header')
var GenerateSchema = require('generate-schema')

function Request (req) {
	this.headers = Object.keys(req._headers).map(function(h) { return new Header(h, req._headers[h])} )
	this.type = req._headers['content-type'] || ''
	this.method = req.method
	this.body = req.body
	this.bodyParams = []
	this.schema = ''
}

Request.prototype = {
	blueprint : function() {
		return  this.printBodyParams() +
				'+ Request ' + ' (' + this.type + ')\n'
				+ this.printHeaders()
				+ this.printBody()
				+ this.printSchema()

	},
	printBodyParams: function() {
		var t = this
		if (t.body){
			var bodyKeys = Object.keys(t.body)
			var res = ''
			bodyKeys.forEach(function(key) {
				res += '+ ' + key + ' (' + util.getType(t.body[key]) + ')' + '\n';
			})
			return res + "\n"
		}
		return ''
	},
	printHeaders: function() {
		if (this.headers.length) {
			return '\t+ Headers\n'
				+ this.headers.map(function(h){ return '\t\t' + h.blueprint() + '\n' }).join('')
		}
		return ''
	},
	printBody: function() {
		if (this.body) {
			return '\t+ Body\n\t\t' + JSON.stringify(this.body, 0, 4).split('\n').join('\n\t\t')
		}
		return ''
	},
	printSchema: function() {
		if (this.body) {
			return '\n\t+ Schema\n\t\t' 
				+ JSON.stringify(GenerateSchema.json('BodySchema', this.body), 0, 4)
				.split('\n').join('\n\t\t')
		}
		return ''
	}
}

module.exports = Request