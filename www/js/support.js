

var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

function ajaxGetList(path, callback) {
    ajaxGet(path, function(data) { callback(data.response); });
}

function login(username, password, success, failure) {
    var mygetrequest = new XMLHttpRequest();
    mygetrequest.onreadystatechange = function() {
        if (mygetrequest.readyState == 4) {
            if (mygetrequest.responseText.substring(0,2)=="OK")
                success();
            else
                failure(mygetrequest.responseText);
        }
        else {
            return null;
        }
    }

    var up = (username!=null) ? ("USERNAME=" + username + "&PASSWORD=" + Base64.encode(password) + "&") : "";
    mygetrequest.open("GET", "verifylogin.aspx?" + up, true);
    mygetrequest.send(null);
}

function ajaxGet(path, callback, username, password) {
    var mygetrequest = new XMLHttpRequest();
    mygetrequest.onreadystatechange = function() {
        if (mygetrequest.readyState == 4) {
            if (mygetrequest.responseText.substring(0,3)=="ERR")
                alert(mygetrequest.responseText);
            else
                callback(eval('(' + mygetrequest.responseText + ')'));
        }
        else {
            return null;
        }
    }

    var up = (username!=null) ? ("USERNAME=" + username + "&PASSWORD=" + Base64.encode(password) + "&") : "";
    mygetrequest.open("GET", "/apiget.aspx?" + up + "path=" + path + "&format=json&pagesize=500", true);
    mygetrequest.send(null);
}

function GetDisplay(text)
{
    if (text.indexOf("|@|")>-1)
        return text.substring(0, text.indexOf("|@|"));
    else
        return text;
}

function ajaxPut(path, record, action, callback) {
    var mygetrequest = new XMLHttpRequest();
    mygetrequest.onreadystatechange = function() {
        if (mygetrequest.readyState == 4) {
            callback(eval('(' + mygetrequest.responseText + ')'));
        }
        else {
            return null;
        }
    }
    $.post("/apiput.aspx?path=" + path + "&actionid=" + action + "&format=json&json=" + JSON.stringify(record), null, function(res) { callback(res); });
    //mygetrequest.open("GET", "/apiput.aspx?path=" + path + "&actionID=" + action + "&format=json", true);
    //mygetrequest.send(null);
}

function ajaxGetSimple(path, predField, predValue, callback) {
    return ajaxGet(path + "[" + predField + "=\"" + predValue + "\"]", function(res) { callback(res.response[0]); });
}

$.extend($.support, {
    touch: "ontouchend" in document
});

//
// Hook up touch events
//
$.fn.addTouch = function() {
    if ($.support.touch) {
        this.each(function(i, el) {
            el.addEventListener("touchstart", iPadTouchHandler, false);
            el.addEventListener("touchmove", iPadTouchHandler, false);
            el.addEventListener("touchend", iPadTouchHandler, false);
            el.addEventListener("touchcancel", iPadTouchHandler, false);
        });
    }
};

var lastTap = null; 

$.fn.touchDraggable = function(prams) {
    var offset = null;
    var start = function(e) {
        var orig = e.originalEvent;
        var pos = $(this).position();
        offset = {
            x: orig.changedTouches[0].pageX - pos.left,
            y: orig.changedTouches[0].pageY - pos.top
        };
    };
    var moveMe = function(e) {
        e.preventDefault();
        var orig = e.originalEvent;
        var item = document.getElementById($(this).attr("id"));
        var updated = new Array();
        if (prams.drag!=null) prams.drag(null, { "helper": $(this),
            "offset": { "left": orig.changedTouches[0].pageX - offset.x, "top": orig.changedTouches[0].pageY - offset.y },
            "position": { "left": $(this).position().left, "top": $(this).position().top }
        });
    };
    var checkToLock = function(e) {
        var orig = e.originalEvent;
        var newTop = orig.changedTouches[0].pageY - offset.y;
        var newLeft = orig.changedTouches[0].pageX - offset.x;
        var newRight = $(this).width() + newLeft;
        var newBottom = $(this).height() + newTop;

        if (prams.stop!=null)
            prams.stop(null, { "helper": $(this),
            "offset": { "left": orig.changedTouches[0].pageX - offset.x, "top": orig.changedTouches[0].pageY - offset.y },
            "position": { "left": $(this).position().left, "top": $(this).position().top }
        });
    }
    this.bind("touchstart", start);
    this.bind("touchmove", moveMe);
    this.bind("touchend", checkToLock);
};


	function Close(x1, x2, space)
	{
	    if (space==null) space = 25;
		x1 = parseInt(x1);
		x2 = parseInt(x2);
		//alert('checking close: ' + x1.toString() + ' - ' + x2.toString());
		if (x1 > (x2-space) && x1 < (x2 + space)) return true;
		if (x2 > (x1-space) && x2 < (x1 + space)) return true;
		return false;
	}
	
function setCharAt(str,index,chr) {
	if(index > str.length-1) return str;
	return str.substr(0,index) + chr + str.substr(index+1);
}	
		function loadImages(sources, callback) {
			var images = {};
			var loadedImages = 0;
			var numImages = 0;
			// get num of sources
		  for (var key in sources)
			  if (sources[key]!=null) numImages++;
		  for (var key in sources)
		  {
			  images[key] = new Image();
			  
			  images[key].onload = function() {
				  loadedImages++;
					if(loadedImages >= numImages) {
						callback(images);
					}
				};
			  if (sources[key]!=null) images[key].src = sources[key].URL;
		  }
	  }

	function getRandomColor() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.round(Math.random() * 15)];
	    }
	    return color;
	}
	
	function ShowHide(id)
	{
		var inv = document.getElementById(id);
		if (inv.displaying)
		{
			// hide it...
			//$("#" + id).fadeOut("slow"); // inv.style.display = "none";
			$("#" + id).slideUp(); // inv.style.display = "none";
			inv.displaying = false;
			return false;
		}
		else
		{
			// show it...
			//$("#" + id).fadeIn("slow");
			$("#" + id).slideDown();
			inv.displaying = true;
		
			return true;
		}
	}
	
    var toolbar_orig_width = 0;

    function resizeImageMap(toolbarImage) { 
        if (toolbar_orig_width == 0) return;

        var pic = $(toolbarImage);
        var curr_width =  pic.width();      
        var ratio = curr_width / toolbar_orig_width;

        $(toolbarImage + "_map area").each(function() {

            var pairs = $(this).attr("coords").split(', ');

            for(var i=0; i<pairs.length; i++) {

                var nums = pairs[i].split(','); 

                for(var j=0; j<nums.length; j++) { 
                    nums[j] = nums[j] * ratio; 
                }

                pairs[i] = nums.join(',');
            }
            $(this).attr("coords", pairs.join(","));
        }); 
        toolbar_orig_width = curr_width;
    }


	function RemoveChildren(obj)
	{
		while (obj.hasChildNodes()) {
		    obj.removeChild(obj.lastChild);
		}				
	}


// special code for handling loaded images

// blank image data-uri bypasses webkit log warning (thx doug jones)
var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

$.fn.imagesLoaded = function( callback ) {
	var $this = this,
		deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
		hasNotify = $.isFunction(deferred.notify),
		$images = $this.find('img').add( $this.filter('img') ),
		loaded = [],
		proper = [],
		broken = [];

	function doneLoading() {
		var $proper = $(proper),
			$broken = $(broken);

		if ( deferred ) {
			if ( broken.length ) {
				deferred.reject( $images, $proper, $broken );
			} else {
				deferred.resolve( $images );
			}
		}

		if ( $.isFunction( callback ) ) {
			callback.call( $this, $images, $proper, $broken );
		}
	}

	function imgLoaded( img, isBroken ) {
		// don't proceed if BLANK image, or image is already loaded
		if ( img.src === BLANK || $.inArray( img, loaded ) !== -1 ) {
			return;
		}

		// store element in loaded images array
		loaded.push( img );

		// keep track of broken and properly loaded images
		if ( isBroken ) {
			broken.push( img );
		} else {
			proper.push( img );
		}

		// cache image and its state for future calls
		$.data( img, 'imagesLoaded', { isBroken: isBroken, src: img.src } );

		// trigger deferred progress method if present
		if ( hasNotify ) {
			deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] );
		}

		// call doneLoading and clean listeners if all images are loaded
		if ( $images.length === loaded.length ){
			setTimeout( doneLoading );
			$images.unbind( '.imagesLoaded' );
		}
	}

	// if no images, trigger immediately
	if ( !$images.length ) {
		doneLoading();
	} else {
		$images.bind( 'load.imagesLoaded error.imagesLoaded', function( event ){
			// trigger imgLoaded
			imgLoaded( event.target, event.type === 'error' );
		}).each( function( i, el ) {
			var src = el.src;

			// find out if this image has been already checked for status
			// if it was, and src has not changed, call imgLoaded on it
			var cached = $.data( el, 'imagesLoaded' );
			if ( cached && cached.src === src ) {
				imgLoaded( el, cached.isBroken );
				return;
			}

			// if complete is true and browser supports natural sizes, try
			// to check for image status manually
			if ( el.complete && el.naturalWidth !== undefined ) {
				imgLoaded( el, el.naturalWidth === 0 || el.naturalHeight === 0 );
				return;
			}

			// cached images don't fire load sometimes, so we reset src, but only when
			// dealing with IE, or image is complete (loaded) and failed manual check
			// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
			if ( el.readyState || el.complete ) {
				el.src = BLANK;
				el.src = src;
			}
		});
	}

	return deferred ? deferred.promise( $this ) : $this;
};

function html5_audio(){
	var a = document.createElement('audio');
	return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}
 
var play_html5_audio = false;
if(html5_audio()) play_html5_audio = true;
 
function play_sound(url){
	if(play_html5_audio){
		var snd = new Audio(url);
		snd.load();
		snd.play();
	}else{
		$("#sound").remove();
		var sound = $("<embed id='sound' type='audio/mpeg' />");
		sound.attr('src', url);
		sound.attr('loop', false);
		sound.attr('hidden', true);
		sound.attr('autostart', true);
		$('body').append(sound);
	}
}

//})(jQuery);
