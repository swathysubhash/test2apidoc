function Header(key, value){
	this.key = key
	this.value = value
}

Header.prototype = {
	blueprint: function() {
		return this.key + ': ' + this.value
	}
}
module.exports = Header