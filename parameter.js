var util = require('./util')

function Parameter(key, value) {
	this.key = key
	this.value = value
}

Parameter.prototype = {
	blueprint: function() {
		return '+ ' + this.key + ': ' + this.value + ' (' + util.getType(this.value) + ')'
	}
}

module.exports = Parameter