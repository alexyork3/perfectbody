$(document).ready(function () {
	var button = [$('.train-tab'), $('.article-tab')];
	var contents = [$('.add-train'), $('.add-article')];
	function removeAllActiveOfArray(arr, cl) {
		if(typeof arr == "array" || typeof arr == "object") {
			for(var i = 0 ; i < arr.length; i++) {
				arr[i].removeClass(cl);
			}
		}
	}
	button[0].click(function () {
		removeAllActiveOfArray(contents, 'active');
		removeAllActiveOfArray(button, 'active-button')
		$(this).addClass('active-button');
		$('.add-train').addClass('active');
	})
	button[1].click(function () {
		removeAllActiveOfArray(contents, 'active');
		removeAllActiveOfArray(button, 'active-button')
		$(this).addClass('active-button');
		$('.add-article').addClass('active');	
	})
	window.onload = function () {
		button[0].addClass('active-button');
		contents[0].addClass('active');
	}
}) 