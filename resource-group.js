var Resource = require('./resource')

function ResourceGroup(name){
	this.name = name
	this.description = ''
	this.paramUri = ''
	this.resources = {}
}

ResourceGroup.prototype = {
	forResource: function(options) {
		this.paramUri = options.uri
		if (!this.resources[this.paramUri]) {
			this.resources[this.paramUri] = new Resource(options)
		}
		return this.resources[this.paramUri]
	},

	addAction: function(options) {
		this.resources[options.paramUri].addAction(new Action(options))
	},

	printResources: function() {
		var t = this
		var resourcesKeys = Object.keys(t.resources)
		var res = ''
		resourcesKeys.forEach(function(rk) {
			res += t.resources[rk].blueprint();
		})
		return res
	},

	blueprint: function(){
		return '# Group ' + this.name + '\n'
				+ this.printResources()
	}
}

module.exports = ResourceGroup