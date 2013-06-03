var menuOpened = false,
	captionOpened = false,
	animating = false,
	captionAsset,
	lock = false,
	topBar = $('.top_bar').height();

var Listing = {
	init: function(){
		$('img.lazy').lazyload({
			load: function(elements_left, settings) {
		       $(this).animate({opacity: 1}, 800);
		    }
		});

		var maxHeight = 0;
	    $('.asset').each(function(){
	      	maxHeight = Math.max(maxHeight, $(this).height());
	    });

	    $('.asset').css('height', maxHeight);
	}
}

var Gallery = {
	init: function(){
		$('.asset').slice(2, $('.asset').length).remove();

		$('.asset').eq(0).addClass('current fixed');

		var assets = $('.asset'),
			wHeight = $(window).height() - topBar,
			galleryType = _4ORMAT_DATA.theme.gallery_type,
			limit = _4ORMAT_DATA.page.assets.length,
			titleCount = _4ORMAT_DATA.page.title ? 1 : 0,
			scrollTop,
			mouseover = false;

		$('.assets').height((_4ORMAT_DATA.page.assets.length + titleCount) * wHeight);


		var reActivateVideo = function(){
			$('.youtube_cont.preview .load_iframe, .vimeo_cont.preview .load_iframe').unbind('click');
			$('.youtube_cont.preview .load_iframe, .vimeo_cont.preview .load_iframe').bind('click', function(){
				var iframe_url = _4ORMAT.$(this).attr('href');
				var asset = $(this).parents('.asset');
				if (asset.hasClass('current')) {
					$('body, html').stop().animate({scrollTop: asset.position().top - topBar}, 400);
				} else {
					$('body, html').stop().animate({scrollTop: $('.current').offset().top - wHeight - topBar}, 400);
				}

				if (!_4ORMAT.$(this).parent().find('iframe').length) {
			    	_4ORMAT.$(this).parent().append("<iframe src='"+ iframe_url +"' width='100%' height='100%' frameborder='0'></iframe>");
			    }

			    return false;
			});
		}

		var removeAsset = function(id){
			$('#no' + id).remove();
		}

		var addAsset = function(newId, increment, current) {
			if (_4ORMAT_DATA.page.assets[newId - titleCount] && !$('#no' + newId).length) {
				var image = _4ORMAT_DATA.page.assets[newId - titleCount],
					index = newId,
					asset,
					html = '';

				if (image.type == 'image') {
					html += '<div id="no'+newId+'" class="asset image" style="top: '+(((index) * wHeight) + topBar)+'px;z-index:'+(index)+';height:'+wHeight+'px"> \
						<div class="ie-shadow-top"></div><div class="inner-shadow">';
					if (image.copy && image.copy_alignment != 'none') {
						html += '<a href="#" class="show_copy">Open</a>';
					}
					if (_4ORMAT_DATA.theme.gallery_type == 'Full Screen') {
						html += '<div class="img" style="height: '+wHeight+'px;"></div>'; 
					} else if (_4ORMAT_DATA.theme.gallery_type == 'Fitted'){
						html += '<div class="img" style="overflow: hidden"><img src="'+image.image_url_1600x1200+'" alt=""/></div>'; 
					}
					if (image.copy && image.copy_alignment != 'none') {
						html += '<div class="copy"><div class="ie-shadow-right"></div><div class="copy_content"><div class="inner">'+image.copy+'</div></div></div>';
					}
				}
				if (image.type == 'video') {
					html += '<div id="no'+newId+'" class="asset video" style="top: '+(((index) * wHeight) + topBar)+'px;z-index:'+(index)+';height:'+wHeight+'px"> \
							<div class="ie-shadow-top"></div><div class="inner-shadow">';
					if (image.copy && image.copy_alignment != 'none') {
						html += '<a href="#" class="show_copy">Open</a>';
					}
					html += '<div class="video">';
					html += image.embed_preview;
					html += '</div>';
					if (image.copy && image.copy_alignment != 'none') {
						html += '<div class="copy"><div class="ie-shadow-right"></div><div class="copy_content"><div class="inner">'+image.copy+'</div></div></div>';
					}
				}

				if (image.type == 'text') {
					html += '<div id="no'+newId+'" class="asset txt" style="top: '+(((index) * wHeight) + topBar)+'px;z-index:'+(index)+';height:'+wHeight+'px"> \
							<div class="ie-shadow-top"></div><div class="inner-shadow">';
	                html += '<div class="content"><div class="inner">' + image.copy + '</div></div>';
				}

				html += '</div></div>';

				if (increment > 0) {
					$('.assets').append(html);
				} else {
					$('#no0').after(html);
					$('#no' + newId).addClass('fixed').css({top: topBar});
				}

				asset = $('#no' + newId);

				if (image.type == 'image') {
					if (_4ORMAT_DATA.theme.gallery_type == 'Full Screen') {
						asset.find('.img').anystretch(image.image_url_1600x1200, {speed: 500});
					} else {
						asset.find('img').load(function(){
							var imgHeight = this.height;
							if (imgHeight < asset.height()) {
								asset.find('img').css('padding-top', (asset.height() - imgHeight)/2);
							}
						});
					}
				}

				if (image.type == 'video') {
					reActivateVideo();
					var videoHeight = asset.find('.video').height();
					if (videoHeight < wHeight) {
						var top = (wHeight - videoHeight)/2;
						top = top < 0 ? 0 : top; 
						asset.find('.video').css({
							paddingTop: top
						});
					}
				} 

				if (image.type == 'text') {
					var hText = asset.find('.content').height();
					if (hText < wHeight - 20) {
						asset.find('.content').css({
							paddingTop: (wHeight - hText)/2
						})
					} else {
						asset.find('.content').css({height: wHeight - 20}).jScrollPane();
					}
				}
				
				asset.not('.title_element').find('.copy_content').height(wHeight - 180).jScrollPane();
				if (current) {
					asset.addClass('current');
				}
				if (menuOpened) {
					asset.css('margin-left', '-210px');
				}
				
				var add1 = titleCount == 1 ? 0 : 1;
				
				if ((newId + add1) == _4ORMAT_DATA.page.assets.length) {
					asset.addClass('last');
				}
			}
		}

		$('.asset').each(function(index){
			var asset = $(this);
			var id = parseInt(asset.attr("id").split('no')[1], 10); 
			var imageIndex =  _4ORMAT_DATA.page.title ? id - 1 : index;

			if (galleryType == 'Full Screen') {
				if (!asset.hasClass('title_element') && _4ORMAT_DATA.page.assets[imageIndex] && _4ORMAT_DATA.page.assets[imageIndex].type == 'image') {
					asset.find('.img').anystretch(_4ORMAT_DATA.page.assets[imageIndex].image_url_1600x1200, {speed: 500});
					asset.find('.img').css({zIndex: index});
				}
			}

			asset.height(wHeight);

			if(_4ORMAT_DATA.theme.gallery_type == 'Fitted' && !asset.hasClass('title_element')) {
				if (asset.hasClass('image')) {
					var img = new Image();
					img.onload = function(){
						var imgHeight = asset.find('img').height();

						if (imgHeight < asset.height()) {
							asset.find('img').css('padding-top', (asset.height() - imgHeight)/2);
						}
					}
					img.src = asset.find('img').attr('src');
				}
			}

			if (asset.hasClass('title_element')) {
				$('.asset.title_element').addClass('fixed');
				var titleHeight = $('.asset.title_element').find('.inner').height();
				var img = $('.asset.title_element').find('img');

				if (img.length) {
					var newImage = new Image();
					newImage.onload = function(){
						titleHeight = this.height;
						titleHeight += $('.asset.title_element').find('.copy').height();
						var top = (wHeight - titleHeight)/2;
						top = top < 0 ? 0 : top; 
						if (titleHeight < wHeight) {
							$('.asset.title_element .inner').css({
								paddingTop: top
							});
						}
					}
					newImage.src = img.attr('src');
				} else {
					var top = (wHeight - titleHeight)/2;
					top = top < 0 ? 0 : top; 
					if (titleHeight < wHeight) {
						$('.asset.title_element .inner').css({
							paddingTop: top
						})
					}
				}
			}

			if (asset.hasClass('txt')) {
				var txtHeight = asset.find('.content').height();
				if (txtHeight < wHeight) {
					var top = (wHeight - txtHeight)/2;
					top = top < 0 ? 0 : top; 
					asset.find('.content').css({
						paddingTop: top
					})
				}
			}
			if (asset.hasClass('video')) {
				var videoHeight = asset.find('.video').height();
				if (videoHeight < wHeight) {
					var top = (wHeight - videoHeight)/2;
						top = top < 0 ? 0 : top; 
					asset.find('.video').css({
						paddingTop: top
					})
				}
			}	
			asset.css({
				top: (wHeight * index) + topBar
			});

			asset.not('.title_element').find('.copy_content').height(wHeight - 230).jScrollPane();
				
			if ((id) == _4ORMAT_DATA.page.assets.length) {
				asset.addClass('last');
			}
		});

		var changeAssets = function(assetId) {
			$('.asset').slice(1, $('.asset').length).remove();
			addAsset(assetId - 1, 1);
			addAsset(assetId, 1, true);
			addAsset(assetId + 1, 1);
		}

		var lastTop = 0;
		$(window).bind('scroll', function(){
			if (!$('.current').length) { 
				$('.asset').eq(0).addClass('current');
			}
			var current = $('.current');
			var id = parseInt(current.attr('id').split('no')[1], 10);
			var currentTop = current.offset().top;

			scrollTop = $(this).scrollTop();

			if (!lock) {
				if ((scrollTop - wHeight > currentTop || scrollTop + wHeight < currentTop) && Math.abs(lastTop - scrollTop) > wHeight) {
					var assetId = Math.round(scrollTop/wHeight);
					changeAssets(assetId);
					if (!$('.current').length) { 
						$('.asset').eq(0).addClass('current');
					}
					current = $('.current');
					currentTop = current.offset().top;
					id = parseInt(current.attr('id').split('no')[1], 10);
				}

				if (scrollTop + wHeight + topBar < currentTop) {
					if (!$('#no' + (id - 1)).length && (id - 1) > 0) {
						addAsset(id - 1, -1);	
					}
					if (!$('#no' + (id - 2)).length && (id - 2) > 0) {
						addAsset(id - 2, -1);
					}
					if (!$('#no' + (id - 3)).length && (id - 3) > 0) {
						addAsset(id - 3, -1);
					}
					if ($('#no' + (id + 1)).length && $('.asset').length > 3){
						removeAsset(id + 1);
					}
					if ($('#no' + (id + 2)).length && $('.asset').length > 3){
						removeAsset(id + 2);
					}
					if ($('#no' + (id - 1)).length) {
						$('#no' + (id - 1)).addClass('current').not($('#no0')).removeClass('fixed').css({top: (wHeight * (id - 1)) + topBar});
						current.removeClass('current');
					} 
				}
				if (scrollTop + topBar >= currentTop && id <= limit) {
					if (!$('#no' + (id + 1)).length) {
						addAsset(id + 1, 1);	
					}
					if (!$('#no' + (id + 2)).length && (id + 2) <= limit) {
						addAsset(id + 2, 1);
					}
					if ($('#no' + (id - 1)).length && id - 1 != 0 && $('.asset').length > 3){
						removeAsset(id - 1);
					}
					if ($('#no' + (id - 2)).length && id - 2 != 0 && $('.asset').length > 3){
						removeAsset(id - 2);
					}
					if ($('#no' + (id + 1)).length) {
						current.addClass("fixed").css({top:topBar}).removeClass('current');
						$('#no' + (id + 1)).addClass('current');
					}
				}
				if (captionAsset && !animating) {
					var posCaption = parseInt(captionAsset.css('top').split('px')[0], 10);
					if (!((posCaption >= topBar + scrollTop  || posCaption == topBar) && posCaption < scrollTop + wHeight)) {
						$('.close_caption').text('Open').toggleClass('show_copy close_caption');
						captionAsset.find('.copy').css('left', -608);
						captionAsset.css('padding-left', 0);
						captionOpened = false;
					}
				}
				if (captionOpened && !mouseover) {
					captionAsset.find('.close_caption').click();
				}
			lastTop = scrollTop;	
			}
		});
		$(window).scroll().load(function(){$(window).scroll()});

		var t;
		$(window).resize(function(){
			wHeight = $(window).height() - topBar;
			lock = true;
			clearTimeout(t);
			t = setTimeout(function(){lock = false}, 0);
				
			$('.asset').each(function(){
				var asset = $(this),
					top = parseInt(asset.css('top').split('px')[0], 10);

				asset.height(wHeight);
				if (!asset.hasClass('fixed')) {
					var pos = parseInt(asset.attr('id').split('no')[1], 10);
					asset.css({top: (pos * wHeight) + topBar});
				}

				if (asset.hasClass('title_element')) {
					var titleHeight = $('.asset.title_element').find('.inner').height();
					var img = $('.asset.title_element').find('img');
					if (img.length) {
						var top = (wHeight - titleHeight)/2;
						top = top < 0 ? 0 : top; 
						titleHeight = $('.asset.title_element').find('img').height();
						if (titleHeight < wHeight) {
							$('.asset.title_element .inner').css({
								paddingTop: top
							})
						}
					} else {
						var top = (wHeight - titleHeight)/2;
						top = top < 0 ? 0 : top; 
						if (titleHeight < wHeight) {
							$('.asset.title_element .inner').css({
								paddingTop: top
							})
						}
					}
				}

				if (asset.hasClass('txt')) {
					asset.find('.content').height('auto');
					var hText = asset.find('.content').height();
					if (hText < wHeight - 20) {
						if (asset.find('.content').data('jsp')) {
							asset.find('.content').data('jsp').destroy();
						}
						asset.find('.content').css({
							paddingTop: (wHeight - hText)/2
						});
					} else {
						asset.find('.content').css({
							paddingTop: 0,
							marginTop: 0
						});
						asset.find('.content').css({height: wHeight - 20}).jScrollPane();
					}
				}
				if (asset.hasClass('image')) {
					if (_4ORMAT_DATA.theme.gallery_type == 'Fitted') {
						var img = asset.find('img'),
							imgHeight = img.height();

						if (imgHeight < asset.height()) {
							img.css('padding-top', (asset.height() - imgHeight)/2);
						}
					}
				}
				if (asset.hasClass('video')) {
					var videoHeight = asset.find('.video').height();
					if (videoHeight < wHeight) {
						var top = (wHeight - videoHeight)/2;
						top = top < 0 ? 0 : top; 
						asset.find('.video').css({
							paddingTop: top
						});
					}
				}
				
				asset.not('.title_element').find('.copy_content').height(wHeight - 230).jScrollPane();

				if (captionOpened) {
					$('.close_caption').click();
				}
			});
			
			$('.assets').height((_4ORMAT_DATA.page.assets.length + titleCount) * wHeight);
			if ($('.current').attr('id') == 'no' + _4ORMAT_DATA.page.assets.length) {
				if (_4ORMAT_DATA.page.assets.length == 1) {
					if (scrollTop - topBar < $('.current').offset().top - wHeight - topBar) {
						$(window).scrollTop($('.current').offset().top - wHeight - topBar);
					} else {
						$(window).scrollTop($('.assets').height());
					}
				} else {
						$(window).scrollTop($('.assets').height());
				}
			} else {
				$(window).scrollTop($('.current').offset().top - wHeight - topBar);
			}
		});
		$(document).keydown(function(event){

			if (event.keyCode == 40) {
				event.preventDefault();
				if ($('.current').attr('id') == 'no0') {
					var next = $('.current').next().position().top;
				} else {
					var next = $('.current').length ? $('.current').position().top : $('.asset').last().position().top;
				}
				if ($(window).scrollTop() == next) {
					next += wHeight;
				}
				$("html,body").stop(true, true).animate({scrollTop: next - topBar}, 600);

				return false;
			}
			
			if (event.keyCode == 38) {
				event.preventDefault();
				var prev = $('.current').prev().length ? $('.current').prev() : $('.asset').first();
				prev = parseInt(prev.attr('id').split('no')[1], 10) * wHeight;

				if ($(window).scrollTop() == prev) {
					prev -= wHeight;
				}

				var current = $('.current');
				var id = parseInt(current.attr('id').split('no')[1], 10);

				$("html,body").stop(true, true).animate({scrollTop: prev}, 600);

				return false;
			}
		});

		var callback = function(){
			captionAsset
				.find('.copy').animate({left: 0}, 400, function(){
					$('.asset').not(captionAsset).find('.copy').css('left', -608);
				})
				.end().animate({paddingLeft: 608}, 400, function(){
					$('.asset').not(captionAsset).css('padding-left', 0);
					if (captionAsset) {
						captionAsset
							.find('.show_copy')
							.css({left: 553, opacity: 0})
							.text('Close')
							.toggleClass('show_copy close_caption')
							.css({opacity: 1});
					}
				})

			$('#post_text').animate({left: 701}, 400);
		};

		$('.show_copy').live('click', function(){
			var that = $(this);
			
			if (captionAsset) {
				captionAsset.find('.close_caption').click();
			}
			captionAsset = that.parents('.asset');
			animating = true;
			captionOpened = true;
			
			that.animate({opacity: 0}, 300);

			if (!captionAsset.hasClass('current')) {
				if ($('.current').offset().top - wHeight - topBar != $('body').scrollTop()) {
					$('body, html').stop().animate({scrollTop: $('.current').offset().top - wHeight - topBar}, 400, function(){
						callback();
					});
				} else {
					callback();
				}
				
			} else {
				$('body,html').stop().animate({scrollTop: captionAsset.offset().top - topBar}, 400, function(){
					callback();
				});
			}

			captionAsset.find('.copy').hover(function(){
				mouseover = true;
			}, function(){
				mouseover = false;
			});

			return false;
		});

		$('.close_caption').live('click', function(){
			captionOpened = false;
			captionAsset.find('.copy').animate({left: -608}, 400)
						.end().find('.close_caption')
							.css({left: 23, opacity: 0})
						.end().animate({'padding-left': 0}, 400, function(){
							$(this).find('.close_caption')
								.text('Open')
								.toggleClass('show_copy close_caption')
								.animate({opacity: 1}, 300);
				});

			captionAsset.find('.copy').unbind('mouseenter mouseleave');
			captionAsset = null;
			mouseover = false;
			
			$('#post_text').stop().animate({left: 23}, 400);

			return false;
		});
		
		setTimeout(function(){
			reActivateVideo();
		}, 600);	
	}	
}

$(document).ready(function(){
	topBar = $('.top_bar').height();

	if ($.browser.msie && $.browser.version == '7.0') {
		if (_4ORMAT_DATA.theme.menu_categories_collapse) {
			$('li.category_container').hide();
		}
	}
	// show/hide category content
	$('.category').click(function() {
		$(this).find('span.arrow-cont').children().toggleClass('arrow-right arrow-down');
		$(this).next('.category_container').slideUp(400, function(){
			var minusLogo = 40;
			if (_4ORMAT_DATA.theme.menu_logo) {
				var hLogo = $('.logo').height();
				minusLogo = hLogo + 90 + 50;
			}
			$('#menu .inner').height($(window).height() - minusLogo).jScrollPane();
		});
		
		if($(this).hasClass('open_cat')) {
			$('.category').removeClass('open_cat');
		} else {
			$('.category').removeClass('open_cat');
			$(this).addClass('open_cat');
		}
		
		if($(this).next().css('display') == 'none') {
			$(this).next().slideDown(400, function(){
				var minusLogo = 40;
				if (_4ORMAT_DATA.theme.menu_logo) {
					var hLogo = $('.logo').height();
					minusLogo = hLogo + 90 + 50;
				}
				$('#menu .inner').height($(window).height() - minusLogo).jScrollPane();
			});
		}
	});

	(function(){
		var height = $('#open_menu').outerHeight(),
			minusLogo = 40;
		$('#menu .menu_top_bar').height(height);
		if (_4ORMAT_DATA.theme.menu_logo) {
			var hLogo = $('.logo').height();
			minusLogo = hLogo + 90 + 50;
		}
		$('#menu .inner').height($(window).height() - minusLogo);
		$('#menu .inner').jScrollPane();
		
		if(_4ORMAT_DATA.page.type == 'simple' || _4ORMAT_DATA.page.type == 'listing'){
			$('#content, .simple #content .inner').css('min-height', $(window).height());
			$('.listing #content .container').css('min-height', $(window).height() - 150);
		}
	})();

	$('#open_menu, #close_menu').click(function(){
		if (captionOpened) {
			captionAsset.animate({'padding-left': 0}, 400);
			$('.close_caption').click();
			captionOpened = false;
		}
		if(_4ORMAT_DATA.page.type == 'gallery'){
			if (!menuOpened) {
				$('.asset').stop().animate({marginLeft: '-210px'}, 400);
				$('#menu').stop().animate({right: 0}, 400);
				$('#close_menu').show();
				menuOpened = true;
			} else {
				$('.asset').stop().animate({marginLeft: '0px'}, 400);
				$('#menu').stop().animate({right: '-210px'}, 400);
				$('#close_menu').hide();
				menuOpened = false;
			}
		} else {
			if (!menuOpened) {
				$('#content').animate({marginLeft: '-210px'}, 400);
				$('#menu').stop().animate({right: 0}, 400);
				$('#close_menu').show();
				menuOpened = true;
			} else {
				$('#content').stop().animate({marginLeft: '0px'}, 400);
				$('#menu').stop().animate({right: '-210px'}, 400);
				$('#close_menu').hide();
				menuOpened = false;
			}
		}

		return false;
	});

	$(window).resize(function(){
		var minusLogo = 40;
		if (_4ORMAT_DATA.theme.menu_logo) {
			var hLogo = $('.logo').height();
			minusLogo = hLogo + 90 + 50;
		}
		$('#menu .inner').height($(window).height() - minusLogo);
		$('#menu .inner').jScrollPane();

		if(_4ORMAT_DATA.page.type == 'simple' || _4ORMAT_DATA.page.type == 'listing'){
			$('#content, .simple #content .inner').css('min-height', $(window).height());
			$('.listing #content .container').css('min-height', $(window).height() - 150);
		}
	});

	if(_4ORMAT_DATA.page.type == 'gallery'){
	   	Gallery.init();
	}
	if(_4ORMAT_DATA.page.type == 'listing'){
	   Listing.init();
	}
});