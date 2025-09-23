(function($){
  jQuery.fn.specificsize = function(options_base){
    return $(this).map(function(){
        var options = {};

        function getOptions() {
            return options_base;
        }

        function setOptions(options_c) {
            options = $.extend(true, options_c, options);
        }

        function lineVerticalElem(options, line_max) {
            options.self.css({'display' : 'flex', 'flex-wrap' : 'wrap'});

            var links_width = options.self.outerWidth(true);
            var links_width_current = 0;
            var line_current = 1;
            var display = false;

            options.self.children().each(function(){
                if (!options.open) {
                    $(this).css('display', '');
                }

                $(this).removeClass(options.class['open']);
            });

            options.self.children().each(function(){
                var elem_width = $(this).outerWidth(true);

                if (elem_width > (links_width - links_width_current)) {
                    links_width_current = 0;
                    line_current++;
                }

                links_width_current += elem_width;
                
                if (line_max < line_current) {
                    if (!options.open) {
                        $(this).css('display', 'none');
                    }

                    $(this).addClass(options.class['open']); 
                    
                    display = true;
                }
            });

            return display;
        }

        function actions(options) {
            var c_show = options.class['show'],
                c_hide = options.class['hide'],
                c_click = options.class['click'];

            if (lineVerticalElem(options, options.countMaxLine)) {
                var display_show = options.open ? 'display: none' : '';
                var display_hide = !options.open ? 'display: none' : '';

                if (!options.self.parent().children('.' + c_show).is('.' + c_show) 
                    && !options.self.parent().children('.' + c_hide).is('.' + c_hide)) {

                    if (options.click.classShow == undefined) {
                        options.self.after('<a href="#" class="' + c_show + (!options.open ? ' '+c_click : '') + '" style="' + display_show + '">' + options.textShow + options.buttonHtmlShow + '</a>');
                    } else {
                        if (!options.open) {
                            $('.' + options.click.classShow).addClass(options.class['click']);
                        } else {
                            $('.' + options.click.classShow).removeClass(options.class['click']);
                        }
                    }
                    if (options.click.classHide == undefined) {
                        options.self.after('<a href="#" class="' + c_hide + (options.open ? ' '+c_click : '') + '" style="' + display_hide + '">' + options.textHide + options.buttonHtmlHide + '</a>');
                    } else {
                        if (options.open) {
                            $('.' + options.click.classHide).addClass(options.class['click']);
                        } else {
                            $('.' + options.click.classHide).removeClass(options.class['click']);
                        }
                    }
                }

                if(options.click.classShow == undefined || options.click.classHide == undefined) {
                    ['show', 'hide'].map(function(el) {
                        options.self.parent().find('.' + options.class[el]).unbind().on('click', function(e){
                            e.preventDefault();

                            options.open = el == 'show' ? true : false;

                            if (options.open) {
                                options.self.addClass(options.class.openBlock);
                                options.self.removeClass(options.class.closeBlock);
                            } else {
                                options.self.removeClass(options.class.openBlock);
                                options.self.addClass(options.class.closeBlock);
                            }
                            
                            options.self.children().each(function(){
                                if ($(this).is('.' + options.class['open'])) {
                                    if (el == 'show' && options.click.classShow == undefined) {
                                        options.worksShow(this);
                                        options.self.parent().find('.' + c_hide).css('display', '').addClass(options.class['click']);
                                        options.self.parent().find('.' + c_show).css('display', 'none').removeClass(options.class['click']);
                                    } else if(el == 'hide' && options.click.classHide == undefined) {
                                        options.worksHide(this);
                                        options.self.parent().find('.' + c_hide).css('display', 'none').removeClass(options.class['click']);
                                        options.self.parent().find('.' + c_show).css('display', '').addClass(options.class['click']);
                                    }
                                }
                            });
                        });
                    });
                }
                
                if (options.click.classHide != undefined) {
                    $('.' + options.click.classHide).unbind().on('click', function(e){
                        e.preventDefault();

                        options.open = false;

                        options.self.children().each(function(){
                            if ($(this).is('.' + options.class['open'])) {
                                options.worksHide(this);
                                $('.' + options.click.classHide).removeClass(options.class['click']);

                                if (options.click.classShow != undefined) {
                                    $('.' + options.click.classShow).addClass(options.class['click']);
                                }
                            }
                        });
                    });
                }
                if (options.click.classShow != undefined) {
                    $('.' + options.click.classShow).unbind().on('click', function(e){
                        e.preventDefault();

                        options.open = true;

                        options.self.children().each(function(){
                            if ($(this).is('.' + options.class['open'])) {
                                options.worksShow(this);
                                $('.' + options.click.classShow).removeClass(options.class['click']);

                                if (options.click.classHide != undefined) {
                                    $('.' + options.click.classHide).addClass(options.class['click']);
                                }
                            }
                        });
                    });
                }
            } else {
                options.self.parent().find('.' + c_show).remove();
                options.self.parent().find('.' + c_hide).remove();
            }
        }

        function media(options) {
            var mediaMaxLine = undefined;
            var keys = [];

            for (i in options.media) { keys.push(i); }

            keys.sort((a, b) => b - a).forEach(function(elem, index) {
                $.each(options.media, function(key, item) {
                    if(window.innerWidth <= parseFloat(key) && elem == parseFloat(key)) {
                        mediaMaxLine = parseFloat(item);
                    }
                });
            });
            

            if (mediaMaxLine != undefined) {
                options.countMaxLine = mediaMaxLine;
            } else {
                options.countMaxLine = options.fixCountMaxLine;
            }

            return options;
        }

        function addElemTop(options) {
            if (options.addElemTop) {
                options.self.wrap('<div class="' + options.class.wrappingElem + '"></div>');
            }
            
            if (options.wrappingAfterHtml != undefined) {
                options.self.after(options.wrappingAfterHtml);
            }
            if (options.wrappingBeforeHtml != undefined) {
                options.self.before(options.wrappingBeforeHtml);
            }
        }

        function worksShow(elem, options) {
            if (options.animation == 'none') {
                $(elem).css('display', '');
            } else if(options.animation == 'top') {
                $(elem).slideDown(options.speedOpen);
            } else if(options.animation == 'bias') {
                $(elem).show(options.speedOpen);
            } else if(options.animation == 'scale') {
                $(elem).css({'opacity': '0'});
                $(elem).slideDown(options.speedOpen);

                $(elem).animate({borderSpacing: 0.1},{
                    step: function(now,fx) {
                        $(this).css({'transform':'scale('+(now/0.1)+')', 'opacity' : (now/0.1)}); 
                    },
                    duration: options.speedScale != undefined ? options.speedScale : options.speedOpen,
                    easing: "linear",
                    done: function() {
                        $(this).css({'display': '', 'transform' : '', 'border-spacing' : '', 'opacity' : ''});
                    }
                });
            }
        }

        function worksHide(elem, options) {
            if (options.animation == 'none') {
                $(elem).css('display', 'none');
            } else if(options.animation == 'top') {
                $(elem).slideUp(options.speedOpen);
            } else if(options.animation == 'bias') {
                $(elem).hide(options.speedOpen);
            } else if(options.animation == 'scale') {
                $(elem).animate({borderSpacing: 0.1},{
                    step: function(now,fx) {
                        $(this).css({'transform':'scale('+(1-(now/0.1))+')'});  
                    },
                    duration: options.speedScale != undefined ? options.speedScale : options.speedOpen,
                    easing: "linear",
                    done: function() {
                        $(this).slideUp(options.speedOpen, function(){
                            $(this).css({'display': 'none', 'transform' : '', 'border-spacing' : ''});
                        });
                    }
                });
            }
        }

        function getElems(options) {
            return options.self.children();
        }

 
        return $(this).each(function(options){

            // data-media = [900, 3][767, 2]
            // data-countMaxLine = 2
            // data-hideText = text
            // data-showText = text
            // .list_0 = count line

            var options = $.extend(true, {
                self: $(this),
                open: false,
                textShow: 'Show',
                textHide: 'Hide',
                countMaxLine: 1,
                classPrefixCountMaxLine: undefined, // берет колличество указанное в название класса с префиксом
                resize: true,
                speedOpen: 300,
                speedScale: undefined, // int number
                animation: 'top', //none, top, bias, scale
                click: {
                    classHide: undefined,
                    classShow: undefined,
                },
                class: {
                    'openBlock' : 'specificsize_blockOpen',
                    'closeBlock' : 'specificsize_blockClose',
                    'open' : 'specificsize_open', // класс открытия элемента
                    'show' : 'specificsize_show', // класс для кноки открытия (или ссылки)
                    'hide' : 'specificsize_hide', // класс для кноки скрытия (или ссылки)
                    'click' : 'specificsize_click', // класс фиксации кнопки открытия или закрытия (или ссылки)
                    'wrappingElem': 'specificsize_wrapping', // обертанный в элемент
                },
                addElemTop: true,
                wrappingAfterHtml: undefined,
                wrappingBeforeHtml: undefined,
                buttonHtmlHide: '',
                buttonHtmlShow: '',
                media: {}, //[900, 3][767, 2]
                worksShow: undefined, //function(elem)
                worksHide: undefined, //function(elem)
                resizeFun: undefined,  //function
                updateFun: undefined, //function(options)
            }, getOptions(), true);

            setOptions(options);

            var data = $(this).data();

            if (data.showtext != undefined) { options.textShow = data.showtext; }
            if (data.hidetext != undefined) { options.textHide = data.hidetext; }
            if (data.countmaxline != undefined) { options.countMaxLine = data.countmaxline; }
            if (options.classPrefixCountMaxLine != undefined) {
                var class_countMaxLine = undefined;

                $(this).attr('class').split(/\s+/).forEach(function(class_name, index){
                    var class_c = class_name.replace(options.classPrefixCountMaxLine + '_', '');

                    if ($.isNumeric(class_c)) {
                        class_countMaxLine = class_c;
                    }
                });

                if (class_countMaxLine != undefined) {
                    options.countMaxLine = class_countMaxLine;
                }
            }

            options.fixCountMaxLine = options.countMaxLine;

            if (data.media != undefined) {
                var media_json = {};
                var arr_media = data.media.toString()
                    .replace('[','').replace('][', '|').replace('] [', '|').replace(']', '').split('|');

                arr_media.forEach(function(item){
                    var elem = item.split(',');
                    media_json[elem[0].trim()] = elem[1].trim();
                });

                options.media = media_json;
            }


            if(options.worksShow == undefined) {
                options.worksShow = function(elem){
                    worksShow(elem, options);
                } 
            }
            if (options.worksHide == undefined) {
                options.worksHide = function(elem){
                    worksHide (elem, options);
                }
            }

            if (options.open) {
                options.self.addClass(options.class.openBlock);
                options.self.removeClass(options.class.closeBlock);
            } else {
                options.self.removeClass(options.class.openBlock);
                options.self.addClass(options.class.closeBlock);
            }
            
            options.updateFun = function(options_c) {

                if (options_c == undefined) {
                    options_c = {};
                }

                
                if (options_c.countMaxLine != undefined) {
                    options_c.fixCountMaxLine = options_c.countMaxLine;
                }
                if (options_c.worksShow != undefined) {
                    options.worksShow = options_c.worksShow;
                } else {
                    options.worksShow = function(elem) {
                        worksShow(elem, options);
                    }
                }
                if (options_c.worksHide != undefined) {
                    options.worksHide = options_c.worksHide;
                } else {
                    options.worksHide = function(elem) {
                        worksHide(elem, options);
                    }
                }

                if (options.click.classShow != undefined) {
                    $('.' + options.click.classShow).unbind();
                    options.click.classShow = undefined;
                }
                if (options.click.classHide != undefined) {
                    $('.' + options.click.classHide).unbind();
                    options.click.classHide = undefined;
                }

                if (options_c.animation == undefined) {
                    options.animation = 'top';
                }

                var textShow = options_c.textShow != undefined ? options_c.textShow : options.textShow,
                    textHide = options_c.textHide != undefined ? options_c.textHide : options.textHide,
                    buttonHtmlShow = options_c.buttonHtmlShow != undefined ? options_c.buttonHtmlShow : options.buttonHtmlShow,
                    buttonHtmlHide = options_c.buttonHtmlHide != undefined ? options_c.buttonHtmlHide : options.buttonHtmlHide;

                options.self.parent().find('.' + options.class['show']).html(textShow + buttonHtmlShow);
                options.self.parent().find('.' + options.class['hide']).html(textHide + buttonHtmlHide);

                options = $.extend(true, options, options_c);
                
                
                main();

                return this;
            }

            options.resizeFun = function() {
                main();

                return this;
            }

            if (options.resize) {
                $(window).on('resize', function() {
                    main();
                });
            }

            function main() {
                options.elems = getElems(options);
                options.version = '1.0.0';
                media(options);
                actions(options);
            }

            addElemTop(options);
            main();
        }), options;
    });
  };
})(jQuery);