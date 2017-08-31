/* begin Page */

/* Created by Artisteer v3.0.0.39952 */
jQuery(function(){jQuery('#art-page-background-glare').css('zoom',1)});

// css hacks
(function($) {
    // fix ie blinking
    var m = document.uniqueID && document.compatMode && !window.XMLHttpRequest && document.execCommand;
    try { if (!!m) { m('BackgroundImageCache', false, true); } }
    catch (oh) { };
    // css helper
    var data = [
        {str:navigator.userAgent,sub:'Chrome',ver:'Chrome',name:'chrome'},
        {str:navigator.vendor,sub:'Apple',ver:'Version',name:'safari'},
        {prop:window.opera,ver:'Opera',name:'opera'},
        {str:navigator.userAgent,sub:'Firefox',ver:'Firefox',name:'firefox'},
        {str:navigator.userAgent,sub:'MSIE',ver:'MSIE',name:'ie'}];
    for (var n=0;n<data.length;n++)	{
        if ((data[n].str && (data[n].str.indexOf(data[n].sub) != -1)) || data[n].prop) {
            var v = function(s){var i=s.indexOf(data[n].ver);return (i!=-1)?parseInt(s.substring(i+data[n].ver.length+1)):'';};
            $('html').addClass(data[n].name+' '+data[n].name+v(navigator.userAgent) || v(navigator.appVersion)); break;			
        }
    }
})(jQuery);

var _artStyleUrlCached = null;
function artGetStyleUrl() {
    if (null == _artStyleUrlCached) {
        var ns;
        _artStyleUrlCached = '';
        ns = jQuery('link');
        for (var i = 0; i < ns.length; i++) {
            var l = ns[i].href;
            if (l && /style\.ie6\.css(\?.*)?$/.test(l))
                return _artStyleUrlCached = l.replace(/style\.ie6\.css(\?.*)?$/, '');
        }
        ns = jQuery('style');
        for (var i = 0; i < ns.length; i++) {
            var matches = new RegExp('import\\s+"([^"]+\\/)style\\.ie6\\.css"').exec(ns[i].html());
            if (null != matches && matches.length > 0)
                return _artStyleUrlCached = matches[1];
        }
    }
    return _artStyleUrlCached;
}

function artFixPNG(element) {
    if (jQuery.browser.msie && parseInt(jQuery.browser.version) < 7) {
		var src;
		if (element.tagName == 'IMG') {
			if (/\.png$/.test(element.src)) {
				src = element.src;
				element.src = artGetStyleUrl() + 'images/spacer.gif';
			}
		}
		else {
			src = element.currentStyle.backgroundImage.match(/url\("(.+\.png)"\)/i);
			if (src) {
				src = src[1];
				element.runtimeStyle.backgroundImage = 'none';
			}
		}
		if (src) element.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "')";
	}
}

jQuery(function() {
    jQuery.each(jQuery('ul.art-hmenu>li:not(.art-hmenu-li-separator),ul.art-vmenu>li:not(.art-vmenu-separator)'), function (i, val) {
        var l = jQuery(val); var s = l.children('span'); if (s.length == 0) return;
        var t = l.find('span.t').last(); l.children('a').append(t.html(t.text()));
        s.remove();
    });
});/* end Page */

/* begin Box, Sheet */

function artFluidSheetComputedWidth(percent, minval, maxval) {
    percent = parseInt(percent);
    var val = document.body.clientWidth / 100 * percent;
    return val < minval ? minval + 'px' : val > maxval ? maxval + 'px' : percent + '%';
}/* end Box, Sheet */

/* begin Menu */
jQuery(function() {
    jQuery.each(jQuery('ul.art-hmenu>li:not(:last-child)'), function(i, val) {
        jQuery('<li class="art-hmenu-li-separator"><span class="art-hmenu-separator"> </span></li>').insertAfter(val);
    });
    if (!jQuery.browser.msie || parseInt(jQuery.browser.version) > 6) return;
    jQuery.each(jQuery('ul.art-hmenu li'), function(i, val) {
        val.j = jQuery(val);
        val.UL = val.j.children('ul:first');
        if (val.UL.length == 0) return;
        val.A = val.j.children('a:first');
        this.onmouseenter = function() {
            this.j.addClass('art-hmenuhover');
            this.UL.addClass('art-hmenuhoverUL');
            this.A.addClass('art-hmenuhoverA');
        };
        this.onmouseleave = function() {
            this.j.removeClass('art-hmenuhover');
            this.UL.removeClass('art-hmenuhoverUL');
            this.A.removeClass('art-hmenuhoverA');
        };

    });
});

/* end Menu */

/* begin Layout */
jQuery(function () {
     var c = jQuery('div.art-content');
    if (c.length !== 1) return;
    var s = c.parent().children('.art-layout-cell:not(.art-content)');

    if (jQuery.browser.msie && parseInt(jQuery.browser.version) < 8) {

        jQuery(window).bind('resize', function () {
            var w = 0;
            c.hide();
            s.each(function () { w += this.clientWidth; });
            c.w = c.parent().width(); c.css('width', c.w - w + 'px');
            c.show();
        })

        var r = jQuery('div.art-content-layout-row').each(function () {
            this.c = jQuery(this).children('.art-layout-cell:not(.art-content)');
        });

        jQuery(window).bind('resize', function () {
            r.each(function () {
                if (this.h == this.clientHeight) return;
                this.c.css('height', 'auto');
                this.h = this.clientHeight;
                this.c.css('height', this.h + 'px');
            });
        });
    }

    var g = jQuery('.art-layout-glare-image');
    jQuery(window).bind('resize', function () {
        g.each(function () {
            var i = jQuery(this);
            i.css('height', i.parents('.art-layout-cell').height() + 'px');
        });
    });

    jQuery(window).trigger('resize');
});/* end Layout */

/* begin VMenu */
jQuery(function() {
    jQuery('ul.art-vmenu li').not(':first').before('<li class="art-vsubmenu-separator"><span class="art-vsubmenu-separator-span"> </span></li>');
    jQuery('ul.art-vmenu > li.art-vsubmenu-separator').removeClass('art-vsubmenu-separator').addClass('art-vmenu-separator').children('span').removeClass('art-vsubmenu-separator-span').addClass('art-vmenu-separator-span');
    jQuery('ul.art-vmenu > li > ul > li.art-vsubmenu-separator:first-child').removeClass('art-vsubmenu-separator').addClass('art-vmenu-separator').addClass('art-vmenu-separator-first').children('span').removeClass('art-vsubmenu-separator-span').addClass('art-vmenu-separator-span');
});  /* end VMenu */

/* begin VMenuItem */
jQuery(function() {
    jQuery('ul.art-vmenu a').click(function () {
        var a = jQuery(this);
        a.parents('ul.art-vmenu').find("ul, a").removeClass('active');
        a.parent().children('ul').addClass('active');
        a.parents('ul.art-vmenu ul').addClass('active');
        a.parents('ul.art-vmenu li').children('a').addClass('active');
    });
});
/* end VMenuItem */

/* begin Button */
function artButtonSetup(className) {
    jQuery.each(jQuery("a." + className + ", button." + className + ", input." + className), function (i, val) {
        var b = jQuery(val);
        if (!b.parent().hasClass('art-button-wrapper')) {
            if (b.is('input')) b.val(b.val().replace(/^\s*/, '')).css('zoom', '1');
            if (!b.hasClass('art-button')) b.addClass('art-button');
            jQuery("<span class='art-button-wrapper'><span class='art-button-l'> </span><span class='art-button-r'> </span></span>").insertBefore(b).append(b);
            if (b.hasClass('active')) b.parent().addClass('active');
        }
        b.mouseover(function () { jQuery(this).parent().addClass("hover"); });
        b.mouseout(function () { var b = jQuery(this); b.parent().removeClass("hover"); if (!b.hasClass('active')) b.parent().removeClass('active'); });
        b.mousedown(function () { var b = jQuery(this); b.parent().removeClass("hover"); if (!b.hasClass('active')) b.parent().addClass('active'); });
        b.mouseup(function () { var b = jQuery(this); if (!b.hasClass('active')) b.parent().removeClass('active'); });
    });
}
jQuery(function() { artButtonSetup("art-button"); });

/* end Button */


function addrows(tid, prevcount) {

	var colName = null;
	var colValue = null;
	
	if (isPrevAdd == 0) {
		if (prevcount > 5) {
			count2 = count2 + (prevcount - 5);
			count =6;
		} else {
			count = count +  parseInt(prevcount);
		}
		isPrevAdd = 1;
	}
	if (tid == 'myTable') {
		count = count + 1;
		colName = 'tb1desc' + count;
		colValue = 'tb1value' + count;
	} else {
		count2 = count2 + 1;
		colName = 'tb2desc' + count2;
		colValue = 'tb2value' + count2;
	}
	if (count > 5 && count2 == 0) {
		alert('Please use next Custom row');
		var addbutton = document.getElementById("addRow");
		addbutton.setAttribute('disabled', 'disabled');
		var addbutton2 = document.getElementById("addRow2");
		addbutton2.removeAttribute('disabled', 0);
		return false;
	}

	if (count2 > 5) {
		alert('Please save the sheet and then press add row');
		return false;
	}
	var tbody = document.getElementById(tid).getElementsByTagName("TBODY")[0];
	// here we create a row element
	var row = document.createElement("TR");
	var rowNm = 'row' + count;
	row.setAttribute('id', rowNm);

	// here we create the first cell element
	var t1 = document.createElement("TD");
	a = '<input  type="text" name="' + colName + '" id="' + colName + '" size="10" />';
	t1.innerHTML = a;

	// here we create the second cell element
	var t2 = document.createElement("TD");
	a = '<input id="' + colValue + '" name="' + colValue + '" size="5" onblur="if(!ValidNumber('
			+ colValue + '.value,document,' + count
			+ ','+ count2 +')) {document.addData.' + colValue
			+ '.value=\'\'; return false;}" />';

	t2.innerHTML = a;

	var t3 = document.createElement("TD");
	a = '<button onclick="deleteRows(\'' + tid + '\',\'' + count
			+ '\')">D</button>';
	t3.innerHTML = a;

	// here we append the cells to the created row element
	row.appendChild(t1);
	row.appendChild(t2);
	row.appendChild(t3);

	// here we append the created row element to the table
	tbody.appendChild(row);
	if (tid == 'myTable') {
		var rowcountele = document.getElementById('rowcountid');
		if (rowcountele == null) {
			var tdiv = document.getElementById('rowcountdiv');
			var ele1 = document.createElement('INPUT');
			ele1.type = "hidden";
			ele1.setAttribute('id', 'rowcountid');
			ele1.setAttribute('name', 'rowcount');
			ele1.setAttribute('value', count);
			tdiv.appendChild(ele1);
		} else {
			rowcountele.setAttribute('value', count);
		}
	} else {
		var rowcount2ele = document.getElementById('rowcount2id');
		if (rowcount2ele == null) {
			var tdiv2 = document.getElementById('rowcountdiv');
			var ele2 = document.createElement('INPUT');
			ele2.type = "hidden";
			ele2.setAttribute('id', 'rowcount2id');
			ele2.setAttribute('name', 'rowcount2');
			ele2.setAttribute('value', count2);
			tdiv2.appendChild(ele2);
		} else {
			rowcount2ele.setAttribute('value', count2);
		}
	}
}


