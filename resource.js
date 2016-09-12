var Action = require('./action')
var Parameter = require('./parameter')
function Resource(options) {
	this.heading = options.name
	this.uri = ''
	this.paramUri = ''
	this.reformedUri = this.paramUri;
	this.actions = []
	this.parameters = []
}

Resource.prototype = {
	addAction(options) {
		this.uri = options.req.path
		this.paramUri = options.paramUri
		if(!this.actions.find(function(a) { return a.name() === (new Action(options)).name() }))
		{
			this.actions.push(new Action(options))	
			this.parseParameters()
		}
		
	},

	parseParameters : function() {
		var t = this
		var urlSplit = this.uri.split('?', 2);
		var pathParts = urlSplit[0].split('/', 50);
		var queryParts = urlSplit[1] ? urlSplit[1].split('&', 50) : [];

		var paramPartsSplit = t.paramUri.split('?', 2)[0]
									.split('/', 50);

		queryParts.forEach(function(q) {
			var qSplits = q.split("=")
			if (qSplits.length === 2) {
				t.parameters.push(new Parameter(qSplits[0], qSplits[1]))
			} 
		})

		var reformedParts = []
		if (paramPartsSplit.length === pathParts.length)
			pathParts.forEach(function(p, i) {
				if(paramPartsSplit[i].charAt(0) === ':') {
					t.parameters.push(new Parameter(paramPartsSplit[i].substring(1), pathParts[i]))	
					reformedParts.push('{' + paramPartsSplit[i].substring(1) + '}')
				} else {
					reformedParts.push(pathParts[i])
				}
			})
		t.reformedUri = reformedParts.join('/')
	},

	printParameters: function() {
		if (this.parameters.length) {
			return '+ Parameters\n' 
				+ this.parameters.map(function(p){ return '\t' + p.blueprint() + '\n' }).join('')
		}
	},

	blueprint: function() {
		return '## ' + this.heading + ' [' + this.reformedUri + ']\n'
				+ this.printParameters()
				+ this.actions.map(function(action) {return action.blueprint()}).join('\n')
	}
}

module.exports = Resource