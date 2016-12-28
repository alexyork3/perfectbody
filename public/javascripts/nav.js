var nav = $('.main_menu');
nav.css('position', "relative")
window.onscroll = function () {
	if(document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		nav.css('position', "fixed");
	}
	else {
		nav.css('position', "relative");
	}
}