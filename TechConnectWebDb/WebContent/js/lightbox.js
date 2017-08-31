/*
Created By: Chris Campbell
Website: http://particletree.com
Date: 2/1/2006

Inspired by the lightbox implementation found at http://www.huddletogether.com/projects/lightbox/
*/

/*-------------------------------GLOBAL VARIABLES------------------------------------*/

var detect = navigator.userAgent.toLowerCase();
var OS,browser,version,total,thestring;

/*-----------------------------------------------------------------------------------------------*/

//Browser detect script origionally created by Peter Paul Koch at http://www.quirksmode.org/

function getBrowserInfo() {
	if (checkIt('konqueror')) {
		browser = "Konqueror";
		OS = "Linux";
	}
	else if (checkIt('safari')) browser 	= "Safari";
	else if (checkIt('omniweb')) browser 	= "OmniWeb";
	else if (checkIt('opera')) browser 		= "Opera";
	else if (checkIt('webtv')) browser 		= "WebTV";
	else if (checkIt('icab')) browser 		= "iCab";
	else if (checkIt('msie')) browser 		= "Internet Explorer";
	else if (!checkIt('compatible')) {
		browser = "Netscape Navigator";
		version = detect.charAt(8);
	}
	else browser = "An unknown browser";
	
	
	
	if (!version) version = detect.charAt(place + thestring.length);

	if (!OS) {
		if (checkIt('linux')) OS 		= "Linux";
		else if (checkIt('x11')) OS 	= "Unix";
		else if (checkIt('mac')) OS 	= "Mac";
		else if (checkIt('win')) OS 	= "Windows";
		else OS 								= "an unknown operating system";
	}
}

function checkIt(string) {
	place = detect.indexOf(string) + 1;
	thestring = string;
	return place;
}

/*-----------------------------------------------------------------------------------------------*/
Event.observe(window, 'load', function() {
	getBrowserInfo();
	initialize();
});

var lightbox = Class.create();

lightbox.prototype = {

	yPos : 0,
	xPos : 0,

	initialize: function(ctrl,options) {
		this.options = {
			loadFunction: this.loadInfo,
			url: $(ctrl).readAttribute('href'),
			event: 'click'
		};
		Object.extend(this.options, options || { });
		this.content = this.options.url;
		this.callerId = ctrl.identify();
		if (this.options.event != 'manual'){
			Event.observe(ctrl, 'click', this.activate.bindAsEventListener(this), false);
			if (ctrl.tagName=="A"){
				ctrl.onclick = function(){return false;};
			}
		}
	},
	
	// Turn everything on - mainly the IE fixes
	activate: function(){
		
		if (browser == 'Internet Explorer'){
			this.getScroll();
			this.prepareIE('100%', 'hidden');
			this.setScroll(0,0);
			this.hideSelects('hide');
		}
		
		this.displayLightbox("block");
		$('lightbox').fire('lightbox:loaded',{ callerId: this.callerId });
	},
	
	// Turn everything on - mainly the IE fixes
	updateContent: function(){
		$('lbContent').remove();
		this.displayLightbox("block");
		$('lightbox').fire('lightbox:loaded',{ callerId: this.callerId });
	},
	
	// Ie requires height to 100% and overflow hidden or else you can scroll down past the lightbox
	prepareIE: function(height, overflow){
		bod = document.getElementsByTagName('body')[0];
		bod.style.height = height;
		bod.style.overflow = overflow;
		
		//Below lines are commented to disable vertical scrolling in IE 8 with compatibility mode
		/*htm = document.getElementsByTagName('html')[0];
		htm.style.height = height;
		htm.style.overflow = overflow;*/
	},
	
	// In IE, select elements hover on top of the lightbox
	hideSelects: function(visibility){
		
		$$('select').each(function(s){
			if(!s.hasClassName('ieIgnore')){
				if(visibility=='hide'){
					var iHTML = $(s).options[s.selectedIndex].innerHTML;
					var vSpan = document.createElement('SPAN');
					vSpan.className='view';
					vSpan.id=s.name+'span';
					vSpan.innerHTML=iHTML;
					Element.hide(s);
					s.parentNode.appendChild(vSpan);
				}
				else {
					if ($(s.name+'span')){s.parentNode.removeChild($(s.name+'span'));};
					Element.show(s);
				}
				//s.style.visibility = visibility;
			}
			});
	},
	
	// Taken from lightbox implementation found at http://www.huddletogether.com/projects/lightbox/
	getScroll: function(){
		if (self.pageYOffset) {
			this.yPos = self.pageYOffset;
		} else if (document.documentElement && document.documentElement.scrollTop){
			this.yPos = document.documentElement.scrollTop; 
		} else if (document.body) {
			this.yPos = document.body.scrollTop;
		}
	},
	
	setScroll: function(x, y){
		window.scrollTo(x, y); 
	},
	
	displayLightbox: function(display){
		$('overlay').style.display = display;
		$('lightbox').style.display = display;
		if(display != 'none'){
			if (this.content.include('#')){
				this.processLocal(this.content.substring(this.content.lastIndexOf('#')+1,this.content.length));
			}
			else this.options['loadFunction'].bind(this)();
		}
		else{
			$('lightbox').removeClassName('localLightBox');
		}
	},
	
	// Begin Ajax request based off of the href of the clicked linked
	loadInfo: function() {
		var myAjax = new Ajax.Request(
        this.content,
        {method: 'post', parameters: "", onComplete: this.processAjax.bindAsEventListener(this)}
		);
		
	},
	
	// Display Ajax response
	displayInfo: function(info){
		new Insertion.Before($('lbLoadMessage'), info);
		$('lightbox').className = "done";
		var tmpW = $('lightbox').down('.lightbox-module').getWidth();
		this.actions();	
		$('lightbox').setStyle({width: tmpW+'px',
								marginLeft: ((1000-tmpW)/2)+'px'});
	},
	
	// Display Local response
	processLocal:function(lclDiv){
		this.displayInfo("<div id='lbContent'>" +$(lclDiv).innerHTML + "</div>");
	},
	
	// Display Ajax response
	processAjax: function(response){
		this.displayInfo("<div id='lbContent'>" + response.responseText + "</div>");			
	},
	
	// Search through new links within the lightbox, and attach click event
	actions: function(){
		$$('.lbAction').each(function(act){
			act.observe('click', this[act.readAttribute('rel')].bindAsEventListener(this),false);
			if (act.tagName=="A"){
				act.onclick = function(){return false;};
			}
		},this);
	},
	
	// Example of creating your own functionality once lightbox is initiated
	insert: function(e){
	   link = Event.element(e).parentNode;
	   Element.remove($('lbContent'));
	 
	   var myAjax = new Ajax.Request(
			  link.href,
			  {method: 'post', parameters: "", onComplete: this.processInfo.bindAsEventListener(this)}
	   );
	 
	},
	
	// Example of creating your own functionality once lightbox is initiated
	save: function(e){
		if (save())this.deactivate();
	},

	// Example of creating your own functionality once lightbox is initiated
	saveWorkflow: function(e){
		if (saveWorkflow())this.deactivate();
	},
	
	// Example of creating your own functionality once lightbox is initiated
	saveAndWait: function(e){
		if (save()){
			this.deactivate();
			Try.these(pleaseWait());
		}
	},
	
	// Example of creating your own functionality once lightbox is initiated
	deactivate: function(){
		$('lightbox').fire('lightbox:deactivate');
		Element.remove($('lbContent'));
		
		if (browser == "Internet Explorer"){
			this.setScroll(0,this.yPos);
			this.prepareIE("100%", "auto");   // Scroll To Top issue:Srini:061111
			this.hideSelects("show");
		}
		
		this.displayLightbox("none");
	}
}

/*-----------------------------------------------------------------------------------------------*/

// Onload, make all links that need to trigger a lightbox active
function initialize(){
	addLightboxMarkup();
	$$('.lbOn').each(function(lb){valid = new lightbox(lb);});
	$('lightbox').fire('lightbox:initialized');
}

// Add in markup necessary to make this work. Basically two divs:
// Overlay holds the shadow
// Lightbox is the centered square that the content is put into.
function addLightboxMarkup() {
	
	bod 				= document.getElementsByTagName('body')[0];
	overlay 			= document.createElement('div');
	overlay.id		= 'overlay';
	lb					= document.createElement('div');
	lb.id				= 'lightbox';
	lb.className 	= 'loading';
	lb.innerHTML	= '<div id="lbLoadMessage">' +
						  '<p>Loading</p>' +
						  '</div>';
	bod.appendChild(overlay);
	bod.appendChild(lb);
}