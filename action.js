var Request = require('./request')
var Response = require('./response')

function Action(options) {
	this.description = options.description
	this.method = options.req.method
	this.paramUri = options.paramUri
	this.req = options.req
	this.res = options.res
	this.request = ''
	this.response = ''
	this.setRequest()
	this.setResponse()
}

Action.prototype = {
	setRequest: function() {
		this.request = new Request(this.req)
	},

	setResponse: function() {
		this.response = new Response(this.res)
	},

	blueprint: function() {
		return '### ' + this.description 
				+ ' [' + this.method + ']' + '\n' 
				+ this.request.blueprint() + '\n'
				+ this.response.blueprint()
	},

	name: function() {
		return this.method + this.paramUri
	}
}

module.exports = Action