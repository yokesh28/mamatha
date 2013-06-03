(function(a) {
	a.fn.hoverscroll = function(b) {
		if (!b) {
			b = {}
		}
		b = a.extend({}, a.fn.hoverscroll.params, b);
		this.each(function() {
			var o = a(this);
			if (b.debug) {
				a.log("[HoverScroll] Trying to create hoverscroll on element "
						+ this.tagName + "#" + this.id)
			}
			if (b.fixedArrows) {
				o.wrap('<div class="fixed-listcontainer"></div>')
			} else {
				o.wrap('<div class="listcontainer"></div>')
			}
			o.addClass("list");
			var p = o.parent();
			p.wrap('<div class="ui-widget-content hoverscroll'
					+ (b.rtl && !b.vertical ? " rtl" : "") + '"></div>');
			var d = p.parent();
			var c, j, g, k;
			if (b.arrows) {
				if (!b.vertical) {
					if (b.fixedArrows) {
						c = '<div class="fixed-arrow left"></div>';
						j = '<div class="fixed-arrow right"></div>';
						p.before(c).after(j)
					} else {
						c = '<div class="arrow left"></div>';
						j = '<div class="arrow right"></div>';
						p.append(c).append(j)
					}
				} else {
					if (b.fixedArrows) {
						g = '<div class="fixed-arrow top"></div>';
						k = '<div class="fixed-arrow bottom"></div>';
						p.before(g).after(k)
					} else {
						g = '<div class="arrow top"></div>';
						k = '<div class="arrow bottom"></div>';
						p.append(g).append(k)
					}
				}
			}
			d.width(b.width).height(b.height);
			if (b.arrows && b.fixedArrows) {
				if (b.vertical) {
					g = p.prev();
					k = p.next();
					p.width(b.width).height(
							b.height - (g.height() + k.height()))
				} else {
					c = p.prev();
					j = p.next();
					p.height(b.height).width(b.width - (c.width() + j.width()))
				}
			} else {
				p.width(b.width).height(b.height)
			}
			var q = 0;
			if (!b.vertical) {
				d.addClass("horizontal");
				o.children()
						.each(
								function() {
									a(this).addClass("item");
									if (a(this).outerWidth) {
										q += a(this).outerWidth(true)
									} else {
										q += a(this).width()
												+ parseInt(a(this).css(
														"padding-left"))
												+ parseInt(a(this).css(
														"padding-right"))
												+ parseInt(a(this).css(
														"margin-left"))
												+ parseInt(a(this).css(
														"margin-right"))
									}
								});
				o.width(q);
				if (b.debug) {
					a.log("[HoverScroll] Computed content width : " + q + "px")
				}
				if (d.outerWidth) {
					q = d.outerWidth()
				} else {
					q = d.width() + parseInt(d.css("padding-left"))
							+ parseInt(d.css("padding-right"))
							+ parseInt(d.css("margin-left"))
							+ parseInt(d.css("margin-right"))
				}
				if (b.debug) {
					a.log("[HoverScroll] Computed container width : " + q
							+ "px")
				}
			} else {
				d.addClass("vertical");
				o.children()
						.each(
								function() {
									a(this).addClass("item");
									if (a(this).outerHeight) {
										q += a(this).outerHeight(true)
									} else {
										q += a(this).height()
												+ parseInt(a(this).css(
														"padding-top"))
												+ parseInt(a(this).css(
														"padding-bottom"))
												+ parseInt(a(this).css(
														"margin-bottom"))
												+ parseInt(a(this).css(
														"margin-bottom"))
									}
								});
				o.height(q);
				if (b.debug) {
					a
							.log("[HoverScroll] Computed content height : " + q
									+ "px")
				}
				if (d.outerHeight) {
					q = d.outerHeight()
				} else {
					q = d.height() + parseInt(d.css("padding-top"))
							+ parseInt(d.css("padding-bottom"))
							+ parseInt(d.css("margin-top"))
							+ parseInt(d.css("margin-bottom"))
				}
				if (b.debug) {
					a.log("[HoverScroll] Computed container height : " + q
							+ "px")
				}
			}
			var n = {
				1 : {
					action : "move",
					from : 0,
					to : 0.1 * q,
					direction : -1,
					speed : 32
				},
				2 : {
					action : "move",
					from : 0.15 * q,
					to : 0.25 * q,
					direction : -1,
					speed : 16
				},
				3 : {
					action : "move",
					from : 0.25 * q,
					to : 0.35 * q,
					direction : -1,
					speed : 8
				},
				4 : {
					action : "move",
					from : 0.35 * q,
					to : 0.45 * q,
					direction : -1,
					speed : 4
				},
				5 : {
					action : "stop",
					from : 0.45 * q,
					to : 0.55 * q
				},
				6 : {
					action : "move",
					from : 0.55 * q,
					to : 0.65 * q,
					direction : 1,
					speed : 4
				},
				7 : {
					action : "move",
					from : 0.65 * q,
					to : 0.75 * q,
					direction : 1,
					speed : 8
				},
				8 : {
					action : "move",
					from : 0.75 * q,
					to : 0.85 * q,
					direction : 1,
					speed : 16
				},
				9 : {
					action : "move",
					from : 0.85 * q,
					to : q,
					direction : 1,
					speed : 32
				}
			};
			d[0].isChanging = false;
			d[0].direction = 0;
			d[0].speed = 1;
			function h(r, t) {
				r = r - d.offset().left;
				t = t - d.offset().top;
				var s;
				if (!b.vertical) {
					s = r
				} else {
					s = t
				}
				for (i in n) {
					if (s >= n[i].from && s < n[i].to) {
						if (n[i].action == "move") {
							f(n[i].direction, n[i].speed)
						} else {
							l()
						}
					}
				}
			}
			function m() {
				if (!b.arrows || b.fixedArrows) {
					return
				}
				var v;
				var r;
				if (!b.vertical) {
					v = p[0].scrollWidth - p.width();
					r = p[0].scrollLeft
				} else {
					v = p[0].scrollHeight - p.height();
					r = p[0].scrollTop
				}
				var t = b.arrowsOpacity;
				var u = (r / v) * t;
				if (u > t) {
					u = t
				}
				if (isNaN(u)) {
					u = 0
				}
				var s = false;
				if (u <= 0) {
					a("div.arrow.left, div.arrow.top", d).hide();
					if (v > 0) {
						a("div.arrow.right, div.arrow.bottom", d).show().css(
								"opacity", t)
					}
					s = true
				}
				if (u >= t || v <= 0) {
					a("div.arrow.right, div.arrow.bottom", d).hide();
					s = true
				}
				if (!s) {
					a("div.arrow.left, div.arrow.top", d).show().css("opacity",
							u);
					a("div.arrow.right, div.arrow.bottom", d).show().css(
							"opacity", (t - u))
				}
			}
			function f(s, r) {
				if (d[0].direction != s) {
					if (b.debug) {
						a.log("[HoverScroll] Starting to move. direction: " + s
								+ ", speed: " + r)
					}
					l();
					d[0].direction = s;
					d[0].isChanging = true;
					e()
				}
				if (d[0].speed != r) {
					if (b.debug) {
						a.log("[HoverScroll] Changed speed: " + r)
					}
					d[0].speed = r
				}
			}
			function l() {
				if (d[0].isChanging) {
					if (b.debug) {
						a.log("[HoverScroll] Stoped moving")
					}
					d[0].isChanging = false;
					d[0].direction = 0;
					d[0].speed = 1;
					clearTimeout(d[0].timer)
				}
			}
			function e() {
				if (d[0].isChanging == false) {
					return
				}
				m();
				var r;
				if (!b.vertical) {
					r = "scrollLeft"
				} else {
					r = "scrollTop"
				}
				p[0][r] += d[0].direction * d[0].speed;
				d[0].timer = setTimeout(function() {
					e()
				}, 50)
			}
			if (b.rtl && !b.vertical) {
				p[0].scrollLeft = p[0].scrollWidth - p.width()
			}
			d.mousemove(function(r) {
				h(r.pageX, r.pageY)
			}).bind("mouseleave", function() {
				l()
			});
			this.startMoving = f;
			this.stopMoving = l;
			if (b.arrows && !b.fixedArrows) {
				m()
			} else {
				a(".arrowleft, .arrowright, .arrowtop, .arrowbottom", d).hide()
			}
		});
		return this
	};
	if (!a.fn.offset) {
		a.fn.offset = function() {
			this.left = this.top = 0;
			if (this[0] && this[0].offsetParent) {
				var b = this[0];
				do {
					this.left += b.offsetLeft;
					this.top += b.offsetTop
				} while (b = b.offsetParent)
			}
			return this
		}
	}
	a.fn.hoverscroll.params = {
		vertical : false,
		width : 400,
		height : a(window).height(),
		arrows : true,
		arrowsOpacity : 0.7,
		fixedArrows : false,
		rtl : false,
		debug : false
	};
	a.log = function() {
		try {/* console.log.apply(console,arguments) */
		} catch (b) {
			try {
				opera.postError.apply(opera, arguments)
			} catch (b) {
			}
		}
	}
})(jQuery);