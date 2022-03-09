/**
 * ScrollFix v0.1
 * http://www.joelambert.co.uk
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/*var ScrollFix = function(elem) {
	// Variables to track inputs
	var startY, startTopScroll;
	
	elem = elem || document.querySelector(elem);
	
	// If there is no element, then do nothing	
	if(!elem)
		return;

	// Handle the start of interactions
	elem.addEventListener('touchstart', function(event){
		
	}, false);
};*/

export function scrollFix(node) {
	var startY, startTopScroll;
    const touchstart_event = (event) => {
        startY = event.touches[0].pageY;
		startTopScroll = node.scrollTop;
		
		if(startTopScroll <= 0)
			node.scrollTop = 1;

		if(startTopScroll + node.offsetHeight >= node.scrollHeight)
			node.scrollTop = node.scrollHeight - node.offsetHeight - 1;
    }
    node.addEventListener('touchstart', touchstart_event, false);
    return {
		destroy() {
			node.removeEventListener("touchstart", touchstart_event, true);
		}
	};
}
