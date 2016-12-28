"use strict"
class Window {
	constructor(width,height) {
		this.width = width;
		this.height = height;
	}
	showConf() {
		console.log(this)
	}
}
var userW = new Window(window.innerWidth, window.innerHeight);
userW.showConf(); 
window.addEventListener('resize', function () {
	userW.width = window.innerWidth;
	userW.height = window.innerHeight;
	userW.showConf();
})