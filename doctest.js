var ResourceGroup = require('./resource-group')
var overrides = require('./overrides')
var aglio = require('aglio')
var fs = require('fs')
var mkdirp = require('mkdirp')

function DocTest(name, description, path, style) {
	this.format = 'FORMAT: 1A'
	this.name = name
	this.description = description
	this.docPath = path
	this.docStyle = style
	this.resourceGroups = {}
}

DocTest.prototype = {
	addName: function(name) {
		this.name = name
	},

	addDescription: function(description) {
		this.description = description
	},

	group: function(group, description) {
		if(!this.resourceGroups[group]) {
			this.resourceGroups[group] = new ResourceGroup(group, description)
		}
		return this.resourceGroups[group]
	},

	printResourceGroups: function(){
		var t = this
		var keys = Object.keys(t.resourceGroups)
		var res = ''
		keys.forEach(function(k) {
			res += t.resourceGroups[k].blueprint() + '\n';
		})
		return res
	},

	blueprint: function() {
		return this.format + '\n' +
			'# ' + this.name + '\n'
				+ this.description + '\n'
				+ this.printResourceGroups()
	},

	generateDoc: function(done) {
		var t = this
		var options = {
			themeVariables: 'default',
			themeFullWidth: true,
			themeTemplate: 'triple'
		};
		if(this.docStyle) {
			options.themeVariables = this.docStyle
		}
		var blueprint = this.blueprint()
		mkdirp.sync(t.docPath)
		aglio.render(blueprint, options, function (err, html, warnings) {
		    if (err) return console.log(err);
		    try {
		    	fs.writeFileSync(t.docPath + '/apidoc.apirb', blueprint, { flag: 'w' })	
		    } catch (e) {
		    	console.error('Error occured while writing blueprint file', e)
		    }

		    try {
		    	fs.writeFileSync(t.docPath + '/apidoc.html', html, { flag: 'w' })
		    } catch (e) {
		    	console.error('Error occured while writing documentation html', e)
		    }
			done()
		});
	}
}


var docTest;
function getDocTest (options){
	if (typeof docTest === 'undefined') {
		docTest = new DocTest(options.name, options.description, options.path, options.style)
	}

	if (docTest.name === options.name) {
		return docTest
	}

	throw new Error('Api with name ' + name + ' is not found')
}



module.exports = function(superTest) {
	if(superTest.Test) {
		overrides(superTest.Test)	
	} else {
		throw Error('Need an instance of supertest to initialize')
	}
	return getDocTest
}




