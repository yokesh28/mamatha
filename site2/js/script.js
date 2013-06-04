//active state onload
$getUrl = $(location).attr('href');

var ad_site_url='http://localhost/mamatha/site2/';
$getUrlLoc = "location.href='" + $(location).attr('href') + "'";
if ($getUrl != 'http://localhost/mamatha/site2/') {
    if ($getUrl != 'http://localhost/mamatha/site2/#!/') {
        $(window).load(function () {
            if ($getUrl.substring(0, 51) == "http://localhost/mamatha/site2/#!/photography/") {
                $(".hoverscrollVideo").hide();
                $(".hoverscrollPhoto").css("display", "block");
                $('.nav').find('a').removeClass('active');
                $("#gophotography").addClass('active');
            }
            $(".bgmax").hide();
            $('#wrapside li[onclick=\"' + $getUrlLoc + '\"]').addClass('activeThumb');
            $('.activeThumb h4').css("opacity", "1");
        });
    }
}

//loading gif of loading page
var cll = new CanvasLoader('loadingloading');
cll.setColor('#333333'); // default is '#000000'
cll.setDiameter(42); // default is 40
cll.setDensity(60); // default is 40
cll.setRange(1); // default is 1.3
cll.show(); // Hidden by default
$loaderObjloading = $("#loadingloading #canvasLoader");
$loaderObjloading.css("position", "absolute");
$loaderObjloading.css("top", -21);
$loaderObjloading.css("left", -21);

//background resizer function
function bgresize() {
    var image_width = $('.bgmax, .attachment-feature-image-2').width();
    var image_height = $('.bgmax, .attachment-feature-image-2').height();
    var over = image_width / image_height;
    var under = image_height / image_width;
    var body_width = $(window).width();
    var body_height = $(window).height();

    if (body_width / body_height >= over) {
        $('.bgmax, .attachment-feature-image-2').css({
            'width': body_width + 'px',
            'height': Math.ceil(under * body_width) + 'px',
            'left': '0px',
            'top': Math.abs((under * body_width) - body_height) / -2 + 'px'
        });
    } else {
        $('.bgmax, .attachment-feature-image-2').css({
            'width': Math.ceil(over * body_height) + 'px',
            'height': body_height + 'px',
            'top': '0px',
            'left': Math.abs((over * body_height) - body_width) / -2 + 'px'
        });
    }
}

$(window).load(function () {
    bgresize();
    $("#loading").fadeOut('slow');
});

var content_visible = false;
var $contactVis = false;
var aj;

$(document).ready(function () {

    function fadeOutContact() {
        $('#gocontact').stop(true).css({
            opacity: 1
        });
        $("#contact").stop(true, true).animate({
            right: -340
        }, 500, "easeInQuint");
        $contactVis = false;
    }

    function fadeInContact() {
        $('#gocontact').stop(true).css({
            opacity: 0.5
        });
        $("#contact").stop(true, true).animate({
            right: 0
        }, 500, "easeOutQuint");
        $contactVis = true;
    }

    //fenetre contact
    $('#gocontact').click(function () {
        $('#loadinggif').stop(true).fadeOut(200);
		
        if (content_visible) {
            $('#content').stop(true).fadeOut(300);
            $(this).stop().css({
                opacity: 0.5
            });
            $contactVis = true;
            // navi naar home
            window.location = ad_site_url + '#!/';
        } else {
            if (!$contactVis) {
                $('#content').stop(true).fadeOut(300);
                fadeInContact();
            } else {
                fadeOutContact();
            }
        }
    });

    function doOnContentHidden(e) {
		
        // check if contact can show or not
        if ($contactVis && !content_visible) {
            $('.activeThumb').find("h4").stop(true).animate({
                bottom: '5px',
                opacity: '0'
            }, 250);
            $('#wrapside').find("li").removeClass('activeThumb');
            $("#contact").stop(true, true).delay(500).animate({
                right: 0
            }, 600, "easeOutQuint");
        }
    }

    function doOnContentPreloaded(e) {}

    $(window).bind('content_hidden', doOnContentHidden);
    $(window).bind('content_preloaded', doOnContentPreloaded);

    //hash change
    $(window).hashchange(function () {

        //previous call canceled and callback not executed
        if (aj != undefined) {

            aj.abort();

            $("#wrapside").find('li').live('click', function () {
                aj.abort();
            });

            $(window).trigger('request_cancelled');
            $('#loadinggif').stop(true).fadeOut(200);
        }

        $("#content").removeClass("cursorless").addClass("cursorplus");

        if (($(location).attr('href') != ad_site_url) && ($(location).attr('href') != ad_site_url + '#!/')) {
            // contact hiden
            fadeOutContact();
            //show preloader
            $('#loadinggif').stop(true).fadeIn(200);
        }
		else {
			$('#loadinggif').stop(true).fadeIn(200).delay(600).fadeOut(200);
		}
        //on retrouve le vrai lien
        var arg = window.location.hash.substring(3);
        
        
        var link = ad_site_url + arg;

        //requete ajax
        var aj = $.ajax({
            url: link,
            processData: false,
            cache: false,
            dataType: 'html',
            async: false,
            // success
            success: function (data) {
            	$('#content').fadeIn();
            	$('#content').html(data);
            	
            	 
            	
            	
                //console.log('content loaded');
                data = innerShiv(data, false);
                var content = $(data).find("#content");
                var title = $(data).filter('title').text();
                var urlHome = ad_site_url + "#!/"
                document.title = title;
                content_visible = false;
                $('#content').stop(true, false).fadeOut(500, function () {
                    $('#content').animate({
                        right: "-52.73%",
                        marginRight: 12
                    }, 0);
                    
                    $(".bgmax").fadeIn(500);
                    $(window).trigger('content_hidden');
                    if (location.href != urlHome) {
                        $(this).html(content.html());
                        $(".bgmax").hide();
                        $('#content').imagesLoaded(function () {
                            content_visible = true;
                            $(window).trigger('content_preloaded');
                            //slidecontent iPad, DIV to allow content to slide on ipad
                            if (navigator.userAgent.match(/iPad/i) != null) {
                                $("#slidecontent").css("display", "block");
								$("#slidecontent").css("background", "none");
                            }
                            $('#loadinggif').stop(true).fadeOut(200);
                            $("#content").removeClass("cursorless").addClass("cursorplus");

                            
                           
                            function animContent() {

                                $("#content").html(content.html()).fadeIn(750).animate({
                                    right: "0%",
                                    marginRight: 0
                                }, 500, "easeOutQuint", function () {

                                    $('.attachment-feature-image-2, #slidecontent').toggle(function () {
                                        $('#content').stop(true).animate({
                                            right: "-52.73%",
                                            marginRight: 12
                                        }, 500, "easeInQuint");
                                      
                                        $("#content").removeClass("cursorplus").addClass("cursorless");
                                        $("#slidecontent").css("width", 760);
                                        return false;
                                       

                                    }, function () {
                                    
                                        $('#content').stop(true).animate({
                                            right: "0%",
                                            marginRight: 0
                                        }, 500, "easeOutQuint");
                                        $("#content").removeClass("cursorless").addClass("cursorplus");
                                        $("#slidecontent").css("width", 220);

                                        return false;
                                    });
                                });
                                $(".bgmax").hide();
                            }

                            animContent();

                            bgresize();

                            $('#content').height($(window).height());

                            $(window).resize(function () {
                                $('#content').height($(window).height());
                            });

                            //scrollbar
                            $("#contentWrap").mCustomScrollbar({
                                scrollButtons: {
                                    enable: false
                                },
                                advanced: {
                                    updateOnContentResize: true
                                },
                                mouseWheel: 18
                            });
                            $("#contentWrap").mCustomScrollbar("update");

                            //shadowbox
                            Shadowbox.init({
                                player: ['html, img'],
                                skipSetup: true,
                                continuous: true,
                                displayCounter: false,
                                viewportPadding: 100
                            });

                            $getvimlink = $('.get_vimeo_link').html();

                            $content = '<div id="vidWrapper"><iframe id="player" src="' + $getvimlink + '?autoplay=1" width="1920" height="1080" frameborder="0" wmode="transparent" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>'

                            $("#vidThumbWrapper").live("click", function () {

                                Shadowbox.open({
                                    content: $content,
                                    player: ['html'],
                                    width: 1920,
                                    height: 1080,
                                    options: {
                                        onFinish: function () {
                                            $("#vidWrapper").fadeIn(1000);
                                        }
                                    }
                                });
                                return false;
                            });

                            Shadowbox.clearCache();
                            Shadowbox.setup();

                            $(".photoboxlink").live("click", function () {

                                $('#sb-body-inner').css("opacity", "0");

                                $getPicUrl = $(this).attr('href');

                                Shadowbox.open({
                                    player: ['img'],
                                    content: $getPicUrl,
                                    width: 1920,
                                    height: 1080,
                                    options: {
                                        onFinish: function () {
                                            $("#sb-body-inner").animate({
                                                opacity: 1
                                            }, 500);
                                        },
                                        onClose: function () {
                                            $("#sb-body-inner").css("opacity", "0");
                                        }
                                    }
                                });

                                window.setInterval(function () {
                                    if ($("#sb-body-inner").height() == $("#sb-player").height()) {
                                        $("#sb-body-inner").stop().animate({
                                            opacity: 1
                                        }, 300);
                                    } else {
                                        $("#sb-body-inner").stop().animate({
                                            opacity: 0
                                        }, 0);
                                    }
                                }, 500);
                                return false;
                            });

                            //vidthumb hover
                            $('#vidThumbWrapper').live({
                                mouseenter: function () {
                                    $('.vidthumb').stop(true, false).fadeTo(250, 0.5);
                                },
                                mouseleave: function () {
                                    $('.vidthumb').fadeTo(200, 1);
                                }
                            });

                            //photography hover
                            $('.photoboxlink').find('img').live({
                                mouseenter: function () {
                                    $(this).stop(true, false).fadeTo(250, 0.5);
                                },
                                mouseleave: function () {
                                    $(this).fadeTo(200, 1);
                                }
                            });
                        });
                    }
                });
               
            }
        });
    });

    
    
    
    
    $('#content>img').click(function(){
    	 $('#content').stop(true).animate({
             right: "-52.73%",
             marginRight: 12
         }, 500, "easeInQuint");
    });
    
    
    //dÃ©tection d'un hash onload

    if (window.location.hash.substring(3) != '') {
        $(window).trigger('hashchange');
    }

    function resizeSide() {
        $height = $(window).height();
        $('div.listcontainer').height($height);
        $('div#wrapside').height($height);
        $('div.hoverscroll').height($height);
    }

    resizeSide();

    if (navigator.userAgent.match(/iPhone|iPod|iPad|Android|BlackBerry/i) != null) {
        $(".listcontainer").mCustomScrollbar({
            scrollButtons: {
                enable: false
            },
            mouseWheel: 18
        });
        $(".listcontainer").mCustomScrollbar("update");
    }

    //menu text resizer
    $(".nav li a:not(#home)").fitText(0.8, {
        minFontSize: '16px',
        maxFontSize: '40px'
    });

    $("#home, #gocontact").live('click', function () {
        //$('#loadinggif').fadeOut(200);
        $('.activeThumb').find("h4").animate({
            bottom: '5px',
            opacity: '0'
        }, 250);
        $('#wrapside').find("li").removeClass('activeThumb');
    });

    //social ico resizer
    function resizesocial() {
        $socialWidth = $(".social").width();
        $socialAWidth = $(".social a").width();
        $socialSpanHeight = $(".social").width() / 1.5;
        $(".social").height($socialWidth);
        $(".social a").height($socialAWidth);
        $(".social span").height($socialSpanHeight);
        
    }
    resizesocial();
	
	//window resize functions
    $(window).resize(function () {
        resizeSide();
		bgresize();
        resizesocial();
    });
});