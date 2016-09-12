var shimmer = require('shimmer');


module.exports = function(obj) {

	if(obj.prototype && obj.prototype.assert && !obj.prototype.assert.__wrapped)
		shimmer.wrap(obj.prototype, 'assert', function(original) {
			return function() {
				this.docTestResource.addAction({
					req: this.req, 
					res: this.res, 
					paramUri: this.docTestUri, 
					description: this.docTestDescription
				})
				var returned = original.apply(this, arguments)
				return returned;
			}
		});

	if(!obj.prototype.docTest)
	obj.prototype.docTest = function(docTest) {
		this.docTest = docTest
		return this
	}

	if(!obj.prototype.docGroup)
	obj.prototype.docGroup = function(options) {
		this.docTestGroup = this.docTest.group(options.name, options.description)
		return this
	}

	if(!obj.prototype.docResource)
	obj.prototype.docResource = function(options) {
		this.docTestResource = this.docTestGroup.forResource(options)
		this.docTestUri = options.uri
		this.docTestName = options.name
		this.docTestDescription = options.description
		return this
	}	
}

