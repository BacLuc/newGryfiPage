if(function($) {
        "use strict";

        function Redactor(a, b) {
            return new Redactor.prototype.init(a, b)
        }
        var uuid = 0,
            Range = function(a) {
                return this[0] = a.startOffset, this[1] = a.endOffset, this.range = a, this
            };
        Range.prototype.equals = function() {
            return this[0] === this[1]
        };
        var reUrlYoutube = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gi,
            reUrlVimeo = /https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
        $.fn.redactor = function(a) {
            var b = [],
                c = Array.prototype.slice.call(arguments, 1);
            return this.each("string" == typeof a ? function() {
                var d = $.data(this, "redactor");
                if("undefined" == typeof d || !$.isFunction(d[a])) return $.error('No such method "' + a + '" for Redactor');
                var e = d[a].apply(d, c);
                void 0 !== e && e !== d && b.push(e)
            } : function() {
                $.data(this, "redactor") || $.data(this, "redactor", Redactor(this, a))
            }), 0 === b.length ? this : 1 === b.length ? b[0] : b
        }, $.Redactor = Redactor, $.Redactor.VERSION = "9.2.4", $.Redactor.opts = {
            rangy: !1,
            iframe: !1,
            fullpage: !1,
            css: !1,
            lang: "en",
            direction: "ltr",
            placeholder: !1,
            typewriter: !1,
            wym: !1,
            mobile: !0,
            cleanup: !0,
            tidyHtml: !0,
            pastePlainText: !1,
            removeEmptyTags: !0,
            cleanSpaces: !0,
            cleanFontTag: !0,
            templateVars: !1,
            xhtml: !1,
            visual: !0,
            focus: !1,
            tabindex: !1,
            autoresize: !0,
            minHeight: !1,
            maxHeight: !1,
            shortcuts: {
                "ctrl+m, meta+m": "this.execCommand('removeFormat', false)",
                "ctrl+b, meta+b": "this.execCommand('bold', false)",
                "ctrl+i, meta+i": "this.execCommand('italic', false)",
                "ctrl+h, meta+h": "this.execCommand('superscript', false)",
                "ctrl+l, meta+l": "this.execCommand('subscript', false)",
                "ctrl+k, meta+k": "this.linkShow()",
                "ctrl+shift+7": "this.execCommand('insertorderedlist', false)",
                "ctrl+shift+8": "this.execCommand('insertunorderedlist', false)"
            },
            shortcutsAdd: {
                "ctrl+3": "this.execCommand('removeFormat', false)"
            },
            autosave: !1,
            autosaveInterval: 60,
            plugins: !1,
            linkProtocol: "http://",
            linkNofollow: !1,
            linkSize: 50,
            predefinedLinks: !1,
            imageFloatMargin: "10px",
            imageGetJson: !1,
            dragUpload: !0,
            imageTabLink: !0,
            imageUpload: !1,
            imageUploadParam: "file",
            imageResizable: !0,
            fileUpload: !1,
            fileUploadParam: "file",
            clipboardUpload: !0,
            clipboardUploadUrl: !1,
            dnbImageTypes: ["image/png", "image/jpeg", "image/gif"],
            concrete5: {
                filemanager: !1,
                sitemap: !1,
                lightbox: !1
            },
            s3: !1,
            uploadFields: !1,
            observeImages: !0,
            observeLinks: !0,
            modalOverlay: !0,
            tabSpaces: !1,
            tabFocus: !0,
            air: !1,
            airButtons: ["formatting", "bold", "italic", "deleted", "unorderedlist", "orderedlist", "outdent", "indent"],
            toolbar: !0,
            toolbarFixed: !1,
            toolbarFixedTarget: document,
            toolbarFixedTopOffset: 0,
            toolbarFixedBox: !1,
            toolbarExternal: !1,
            toolbarOverflow: !1,
            buttonSource: !0,
            buttons: ["html", "formatting", "bold", "italic", "deleted", "unorderedlist", "orderedlist", "outdent", "indent", "image", "file", "table", "link", "alignment", "|", "horizontalrule"],
            buttonsHideOnMobile: [],
            activeButtons: ["deleted", "italic", "bold", "underline", "unorderedlist", "orderedlist", "alignleft", "aligncenter", "alignright", "justify", "table"],
            activeButtonsStates: {
                b: "bold",
                strong: "bold",
                i: "italic",
                em: "italic",
                del: "deleted",
                strike: "deleted",
                ul: "unorderedlist",
                ol: "orderedlist",
                u: "underline",
                tr: "table",
                td: "table",
                table: "table"
            },
            formattingTags: ["p", "blockquote", "pre", "h1", "h2", "h3", "h4", "h5", "h6"],
            linebreaks: !1,
            paragraphy: !0,
            convertDivs: !0,
            convertLinks: !0,
            convertImageLinks: !1,
            convertVideoLinks: !1,
            formattingPre: !1,
            phpTags: !1,
            allowedTags: !1,
            deniedTags: ["html", "head", "link", "body", "meta", "script", "style", "applet"],
            boldTag: "strong",
            italicTag: "em",
            indentValue: 20,
            buffer: [],
            rebuffer: [],
            textareamode: !1,
            emptyHtml: "<p>&#x200b;</p>",
            invisibleSpace: "&#x200b;",
            rBlockTest: /^(P|H[1-6]|LI|ADDRESS|SECTION|HEADER|FOOTER|ASIDE|ARTICLE)$/i,
            alignmentTags: ["P", "H1", "H2", "H3", "H4", "H5", "H6", "DD", "DL", "DT", "DIV", "TD", "BLOCKQUOTE", "OUTPUT", "FIGCAPTION", "ADDRESS", "SECTION", "HEADER", "FOOTER", "ASIDE", "ARTICLE"],
            ownLine: ["area", "body", "head", "hr", "i?frame", "link", "meta", "noscript", "style", "script", "table", "tbody", "thead", "tfoot"],
            contOwnLine: ["li", "dt", "dt", "h[1-6]", "option", "script"],
            newLevel: ["blockquote", "div", "dl", "fieldset", "form", "frameset", "map", "ol", "p", "pre", "select", "td", "th", "tr", "ul"],
            blockLevelElements: ["P", "H1", "H2", "H3", "H4", "H5", "H6", "DD", "DL", "DT", "DIV", "LI", "BLOCKQUOTE", "OUTPUT", "FIGCAPTION", "PRE", "ADDRESS", "SECTION", "HEADER", "FOOTER", "ASIDE", "ARTICLE", "TD"],
            langs: {
                en: {
                    html: "HTML",
                    video: "Insert Video",
                    image: "Insert Image",
                    table: "Table",
                    link: "Link",
                    link_insert: "Insert link",
                    link_edit: "Edit link",
                    unlink: "Unlink",
                    formatting: "Formatting",
                    paragraph: "Normal text",
                    quote: "Quote",
                    code: "Code",
                    header1: "Header 1",
                    header2: "Header 2",
                    header3: "Header 3",
                    header4: "Header 4",
                    header5: "Header 5",
                    header6: "Header 6",
                    bold: "Bold",
                    italic: "Italic",
                    fontcolor: "Font Color",
                    backcolor: "Back Color",
                    unorderedlist: "Unordered List",
                    orderedlist: "Ordered List",
                    outdent: "Outdent",
                    indent: "Indent",
                    cancel: "Cancel",
                    insert: "Insert",
                    save: "Save",
                    _delete: "Delete",
                    insert_table: "Insert Table",
                    insert_row_above: "Add Row Above",
                    insert_row_below: "Add Row Below",
                    insert_column_left: "Add Column Left",
                    insert_column_right: "Add Column Right",
                    delete_column: "Delete Column",
                    delete_row: "Delete Row",
                    delete_table: "Delete Table",
                    rows: "Rows",
                    columns: "Columns",
                    add_head: "Add Head",
                    delete_head: "Delete Head",
                    title: "Title",
                    image_position: "Position",
                    none: "None",
                    left: "Left",
                    right: "Right",
                    center: "Center",
                    image_web_link: "Image Web Link",
                    text: "Text",
                    mailto: "Email",
                    web: "URL",
                    video_html_code: "Video Embed Code",
                    file: "Insert File",
                    upload: "Upload",
                    download: "Download",
                    choose: "Choose",
                    or_choose: "Or choose",
                    drop_file_here: "Drop file here",
                    align_left: "Align text to the left",
                    align_center: "Center text",
                    align_right: "Align text to the right",
                    align_justify: "Justify text",
                    horizontalrule: "Insert Horizontal Rule",
                    deleted: "Deleted",
                    anchor: "Anchor",
                    link_type: "Link Type",
                    link_type_image: "Image",
                    link_type_ajax: "AJAX",
                    open_link: "Open link",
                    default_behavior: "Default Behavior",
                    in_lightbox: "In a Lightbox",
                    open_link_in_lightbox: "Open Link in Lightbox",
                    link_new_tab: "Open link in new tab",
                    underline: "Underline",
                    alignment: "Alignment",
                    filename: "Name (optional)",
                    edit: "Edit"
                }
            }
        }, Redactor.fn = $.Redactor.prototype = {
            keyCode: {
                BACKSPACE: 8,
                DELETE: 46,
                DOWN: 40,
                ENTER: 13,
                ESC: 27,
                TAB: 9,
                CTRL: 17,
                META: 91,
                LEFT: 37,
                LEFT_WIN: 91
            },
            init: function(a, b) {
                this.rtePaste = !1, this.$element = this.$source = $(a), this.uuid = uuid++;
                var c = $.extend(!0, {}, $.Redactor.opts);
                if(this.opts = $.extend({}, c, this.$element.data(), b), this.start = !0, this.dropdowns = [], this.sourceHeight = this.$source.css("height"), this.sourceWidth = this.$source.css("width"), this.opts.fullpage && (this.opts.iframe = !0), this.opts.linebreaks && (this.opts.paragraphy = !1), this.opts.paragraphy && (this.opts.linebreaks = !1), this.opts.toolbarFixedBox && (this.opts.toolbarFixed = !0), this.document = document, this.window = window, this.savedSel = !1, this.cleanlineBefore = new RegExp("^<(/?" + this.opts.ownLine.join("|/?") + "|" + this.opts.contOwnLine.join("|") + ")[ >]"), this.cleanlineAfter = new RegExp("^<(br|/?" + this.opts.ownLine.join("|/?") + "|/" + this.opts.contOwnLine.join("|/") + ")[ >]"), this.cleannewLevel = new RegExp("^</?(" + this.opts.newLevel.join("|") + ")[ >]"), this.rTestBlock = new RegExp("^(" + this.opts.blockLevelElements.join("|") + ")$", "i"), this.opts.linebreaks === !1) {
                    if(this.opts.allowedTags !== !1) {
                        var d = ["strong", "em", "del"],
                            e = ["b", "i", "strike"];
                        "-1" === $.inArray("p", this.opts.allowedTags) && this.opts.allowedTags.push("p");
                        for(i in d) "-1" != $.inArray(d[i], this.opts.allowedTags) && this.opts.allowedTags.push(e[i])
                    }
                    if(this.opts.deniedTags !== !1) {
                        var f = $.inArray("p", this.opts.deniedTags);
                        "-1" !== f && this.opts.deniedTags.splice(f, f)
                    }
                }(this.browser("msie") || this.browser("opera")) && (this.opts.buttons = this.removeFromArrayByValue(this.opts.buttons, "horizontalrule")), this.opts.curLang = this.opts.langs[this.opts.lang], $.extend(this.opts.shortcuts, this.opts.shortcutsAdd), this.placeholderInit(), this.buildStart()
            },
            toolbarInit: function(a) {
                return {
                    html: {
                        title: a.html,
                        func: "toggle"
                    },
                    formatting: {
                        title: a.formatting,
                        func: "show",
                        dropdown: {
                            p: {
                                title: a.paragraph,
                                func: "formatBlocks"
                            },
                            blockquote: {
                                title: a.quote,
                                func: "formatQuote",
                                className: "redactor_format_blockquote"
                            },
                            pre: {
                                title: a.code,
                                func: "formatBlocks",
                                className: "redactor_format_pre"
                            },
                            h1: {
                                title: a.header1,
                                func: "formatBlocks",
                                className: "redactor_format_h1"
                            },
                            h2: {
                                title: a.header2,
                                func: "formatBlocks",
                                className: "redactor_format_h2"
                            },
                            h3: {
                                title: a.header3,
                                func: "formatBlocks",
                                className: "redactor_format_h3"
                            },
                            h4: {
                                title: a.header4,
                                func: "formatBlocks",
                                className: "redactor_format_h4"
                            },
                            h5: {
                                title: a.header5,
                                func: "formatBlocks",
                                className: "redactor_format_h5"
                            },
                            h6: {
                                title: a.header6,
                                func: "formatBlocks",
                                className: "redactor_format_h6"
                            }
                        }
                    },
                    bold: {
                        title: a.bold,
                        exec: "bold"
                    },
                    italic: {
                        title: a.italic,
                        exec: "italic"
                    },
                    deleted: {
                        title: a.deleted,
                        exec: "strikethrough"
                    },
                    underline: {
                        title: a.underline,
                        exec: "underline"
                    },
                    unorderedlist: {
                        title: "&bull; " + a.unorderedlist,
                        exec: "insertunorderedlist"
                    },
                    orderedlist: {
                        title: "1. " + a.orderedlist,
                        exec: "insertorderedlist"
                    },
                    outdent: {
                        title: "< " + a.outdent,
                        func: "indentingOutdent"
                    },
                    indent: {
                        title: "> " + a.indent,
                        func: "indentingIndent"
                    },
                    image: {
                        title: a.image,
                        func: "imageShow"
                    },
                    video: {
                        title: a.video,
                        func: "videoShow"
                    },
                    file: {
                        title: a.file,
                        func: "fileShow"
                    },
                    table: {
                        title: a.table,
                        func: "show",
                        dropdown: {
                            insert_table: {
                                title: a.insert_table,
                                func: "tableShow"
                            },
                            separator_drop1: {
                                name: "separator"
                            },
                            insert_row_above: {
                                title: a.insert_row_above,
                                func: "tableAddRowAbove"
                            },
                            insert_row_below: {
                                title: a.insert_row_below,
                                func: "tableAddRowBelow"
                            },
                            insert_column_left: {
                                title: a.insert_column_left,
                                func: "tableAddColumnLeft"
                            },
                            insert_column_right: {
                                title: a.insert_column_right,
                                func: "tableAddColumnRight"
                            },
                            separator_drop2: {
                                name: "separator"
                            },
                            add_head: {
                                title: a.add_head,
                                func: "tableAddHead"
                            },
                            delete_head: {
                                title: a.delete_head,
                                func: "tableDeleteHead"
                            },
                            separator_drop3: {
                                name: "separator"
                            },
                            delete_column: {
                                title: a.delete_column,
                                func: "tableDeleteColumn"
                            },
                            delete_row: {
                                title: a.delete_row,
                                func: "tableDeleteRow"
                            },
                            delete_table: {
                                title: a.delete_table,
                                func: "tableDeleteTable"
                            }
                        }
                    },
                    link: {
                        title: a.link,
                        func: "show",
                        dropdown: {
                            link: {
                                title: a.link_insert,
                                func: "linkShow"
                            },
                            unlink: {
                                title: a.unlink,
                                exec: "unlink"
                            }
                        }
                    },
                    alignment: {
                        title: a.alignment,
                        func: "show",
                        dropdown: {
                            alignleft: {
                                title: a.align_left,
                                func: "alignmentLeft"
                            },
                            aligncenter: {
                                title: a.align_center,
                                func: "alignmentCenter"
                            },
                            alignright: {
                                title: a.align_right,
                                func: "alignmentRight"
                            },
                            justify: {
                                title: a.align_justify,
                                func: "alignmentJustify"
                            }
                        }
                    },
                    alignleft: {
                        title: a.align_left,
                        func: "alignmentLeft"
                    },
                    aligncenter: {
                        title: a.align_center,
                        func: "alignmentCenter"
                    },
                    alignright: {
                        title: a.align_right,
                        func: "alignmentRight"
                    },
                    alignjustify: {
                        title: a.align_justify,
                        func: "alignmentJustify"
                    },
                    horizontalrule: {
                        exec: "inserthorizontalrule",
                        title: a.horizontalrule
                    }
                }
            },
            callback: function(a, b, c) {
                var d = this.opts[a + "Callback"];
                return $.isFunction(d) ? b === !1 ? d.call(this, c) : d.call(this, b, c) : c
            },
            destroy: function() {
                clearInterval(this.autosaveInterval), $(window).off(".redactor"), this.$source.off("redactor-textarea"), this.$element.off(".redactor").removeData("redactor");
                var a = this.get();
                if(this.opts.textareamode) this.$box.after(this.$source), this.$box.remove(), this.$source.val(a).show();
                else {
                    var b = this.$editor;
                    this.opts.iframe && (b = this.$element), this.$box.after(b), this.$box.remove(), b.removeClass("redactor_editor").removeClass("redactor_editor_wym").removeAttr("contenteditable").html(a).show()
                }
                this.opts.toolbarExternal && $(this.opts.toolbarExternal).html(""), this.opts.air && $("#redactor_air_" + this.uuid).remove()
            },
            getObject: function() {
                return $.extend({}, this)
            },
            getEditor: function() {
                return this.$editor
            },
            getBox: function() {
                return this.$box
            },
            getIframe: function() {
                return this.opts.iframe ? this.$frame : !1
            },
            getToolbar: function() {
                return this.$toolbar ? this.$toolbar : !1
            },
            get: function() {
                return this.$source.val()
            },
            getCodeIframe: function() {
                this.$editor.removeAttr("contenteditable").removeAttr("dir");
                var a = this.outerHtml(this.$frame.contents().children());
                return this.$editor.attr({
                    contenteditable: !0,
                    dir: this.opts.direction
                }), a
            },
            set: function(a, b, c) {
                a = a.toString(), a = a.replace(/\$/g, "&#36;"), this.opts.fullpage ? this.setCodeIframe(a) : this.setEditor(a, b), "" == a && (c = !1), c !== !1 && this.placeholderRemoveFromEditor()
            },
            setEditor: function(a, b) {
                b !== !1 && (a = this.cleanSavePreCode(a), a = this.cleanStripTags(a), a = this.cleanConvertProtected(a), a = this.cleanConvertInlineTags(a, !0), a = this.opts.linebreaks === !1 ? this.cleanConverters(a) : a.replace(/<p(.*?)>([\w\W]*?)<\/p>/gi, "$2<br>")), a = a.replace(/&amp;#36;/g, "$"), a = this.cleanEmpty(a), this.$editor.html(a), this.setNonEditable(), this.setSpansVerified(), this.sync()
            },
            setCodeIframe: function(a) {
                var b = this.iframePage();
                this.$frame[0].src = "about:blank", a = this.cleanConvertProtected(a), a = this.cleanConvertInlineTags(a), a = this.cleanRemoveSpaces(a), b.open(), b.write(a), b.close(), this.opts.fullpage && (this.$editor = this.$frame.contents().find("body").attr({
                    contenteditable: !0,
                    dir: this.opts.direction
                })), this.setNonEditable(), this.setSpansVerified(), this.sync()
            },
            setFullpageOnInit: function(a) {
                this.fullpageDoctype = a.match(/^<\!doctype[^>]*>/i), this.fullpageDoctype && 1 == this.fullpageDoctype.length && (a = a.replace(/^<\!doctype[^>]*>/i, "")), a = this.cleanSavePreCode(a, !0), a = this.cleanConverters(a), a = this.cleanEmpty(a), this.$editor.html(a), this.setNonEditable(), this.setSpansVerified(), this.sync()
            },
            setFullpageDoctype: function() {
                if(this.fullpageDoctype && 1 == this.fullpageDoctype.length) {
                    var a = this.fullpageDoctype[0] + "\n" + this.$source.val();
                    this.$source.val(a)
                }
            },
            setSpansVerified: function() {
                var a = this.$editor.find("span"),
                    b = "inline";
                $.each(a, function() {
                    var a = this.outerHTML,
                        c = new RegExp("<" + this.tagName, "gi"),
                        d = a.replace(c, "<" + b);
                    c = new RegExp("</" + this.tagName, "gi"), d = d.replace(c, "</" + b), $(this).replaceWith(d)
                })
            },
            setSpansVerifiedHtml: function(a) {
                return a = a.replace(/<span(.*?)>/, "<inline$1>"), a.replace(/<\/span>/, "</inline>")
            },
            setNonEditable: function() {
                this.$editor.find(".noneditable").attr("contenteditable", !1)
            },
            sync: function(a) {
                var b = "";
                this.cleanUnverified(), b = this.opts.fullpage ? this.getCodeIframe() : this.$editor.html(), b = this.syncClean(b), b = this.cleanRemoveEmptyTags(b);
                var c = this.cleanRemoveSpaces(this.$source.val(), !1),
                    d = this.cleanRemoveSpaces(b, !1);
                if(c == d) return !1;
                if(b = b.replace(/<\/li><(ul|ol)>([\w\W]*?)<\/(ul|ol)>/gi, "<$1>$2</$1></li>"), "<br>" === $.trim(b) && (b = ""), this.opts.xhtml) {
                    var e = ["br", "hr", "img", "link", "input", "meta"];
                    $.each(e, function(a, c) {
                        b = b.replace(new RegExp("<" + c + "(.*?[^/$]?)>", "gi"), "<" + c + "$1 />")
                    })
                }
                if(b = this.callback("syncBefore", !1, b), this.$source.val(b), this.setFullpageDoctype(), this.callback("syncAfter", !1, b), this.start === !1)
                    if("undefined" != typeof a) switch(a.which) {
                        case 37:
                            break;
                        case 38:
                            break;
                        case 39:
                            break;
                        case 40:
                            break;
                        default:
                            this.callback("change", !1, b)
                    } else this.callback("change", !1, b)
            },
            syncClean: function(a) {
                return this.opts.fullpage || (a = this.cleanStripTags(a)), a = $.trim(a), a = this.placeholderRemoveFromCode(a), a = a.replace(/&#x200b;/gi, ""), a = a.replace(/&#8203;/gi, ""), a = a.replace(/<\/a>&nbsp;/gi, "</a> "), a = a.replace(/\u200B/g, ""), ("<p></p>" == a || "<p> </p>" == a || "<p>&nbsp;</p>" == a) && (a = ""), this.opts.linkNofollow && (a = a.replace(/<a(.*?)rel="nofollow"(.*?)>/gi, "<a$1$2>"), a = a.replace(/<a(.*?)>/gi, '<a$1 rel="nofollow">')), a = a.replace("<!--?php", "<?php"), a = a.replace("?-->", "?>"), a = a.replace(/<(.*?)class="noeditable"(.*?) contenteditable="false"(.*?)>/gi, '<$1class="noeditable"$2$3>'), a = a.replace(/ data-tagblock=""/gi, ""), a = a.replace(/<br\s?\/?>\n?<\/(P|H[1-6]|LI|ADDRESS|SECTION|HEADER|FOOTER|ASIDE|ARTICLE)>/gi, "</$1>"), a = a.replace(/<span(.*?)id="redactor-image-box"(.*?)>([\w\W]*?)<img(.*?)><\/span>/gi, "$3<img$4>"), a = a.replace(/<span(.*?)id="redactor-image-resizer"(.*?)>(.*?)<\/span>/gi, ""), a = a.replace(/<span(.*?)id="redactor-image-editter"(.*?)>(.*?)<\/span>/gi, ""), a = a.replace(/<(ul|ol)>\s*\t*\n*<\/(ul|ol)>/gi, ""), this.opts.cleanFontTag && (a = a.replace(/<font(.*?)>([\w\W]*?)<\/font>/gi, "$2")), a = a.replace(/<span(.*?)>([\w\W]*?)<\/span>/gi, "$2"), a = a.replace(/<inline>/gi, "<span>"), a = a.replace(/<inline /gi, "<span "), a = a.replace(/<\/inline>/gi, "</span>"), a = a.replace(/<span(.*?)class="redactor_placeholder"(.*?)>([\w\W]*?)<\/span>/gi, ""), a = a.replace(/<img(.*?)contenteditable="false"(.*?)>/gi, "<img$1$2>"), a = a.replace(/&/gi, "&"), a = a.replace(/\u2122/gi, "&trade;"), a = a.replace(/\u00a9/gi, "&copy;"), a = a.replace(/\u2026/gi, "&hellip;"), a = a.replace(/\u2014/gi, "&mdash;"), a = a.replace(/\u2010/gi, "&dash;"), a = this.cleanReConvertProtected(a)
            },
            buildStart: function() {
                this.content = "", this.$box = $('<div class="redactor_box" />'), "TEXTAREA" === this.$source[0].tagName && (this.opts.textareamode = !0), this.opts.mobile === !1 && this.isMobile() ? this.buildMobile() : (this.buildContent(), this.opts.iframe ? (this.opts.autoresize = !1, this.iframeStart()) : this.opts.textareamode ? this.buildFromTextarea() : this.buildFromElement(), this.opts.iframe || (this.buildOptions(), this.buildAfter()))
            },
            buildMobile: function() {
                this.opts.textareamode || (this.$editor = this.$source, this.$editor.hide(), this.$source = this.buildCodearea(this.$editor), this.$source.val(this.content)), this.$box.insertAfter(this.$source).append(this.$source)
            },
            buildContent: function() {
                this.content = $.trim(this.opts.textareamode ? this.$source.val() : this.$source.html())
            },
            buildFromTextarea: function() {
                this.$editor = $("<div />"), this.$box.insertAfter(this.$source).append(this.$editor).append(this.$source), this.buildAddClasses(this.$editor), this.buildEnable()
            },
            buildFromElement: function() {
                this.$editor = this.$source, this.$source = this.buildCodearea(this.$editor), this.$box.insertAfter(this.$editor).append(this.$editor).append(this.$source), this.buildEnable()
            },
            buildCodearea: function(a) {
                return $("<textarea />").attr("name", a.attr("id")).css("height", this.sourceHeight)
            },
            buildAddClasses: function(a) {
                $.each(this.$source.get(0).className.split(/\s+/), function(b, c) {
                    a.addClass("redactor_" + c)
                })
            },
            buildEnable: function() {
                this.$editor.addClass("redactor_editor").attr({
                    contenteditable: !0,
                    dir: this.opts.direction
                }), this.$source.attr("dir", this.opts.direction).hide(), this.set(this.content, !0, !1)
            },
            buildOptions: function() {
                var a = this.$editor;
                this.opts.iframe && (a = this.$frame), this.opts.tabindex && a.attr("tabindex", this.opts.tabindex), this.opts.minHeight ? a.css("min-height", this.opts.minHeight + "px") : this.browser("mozilla") && this.opts.linebreaks && this.$editor.css("min-height", "45px"), this.browser("mozilla") && this.opts.linebreaks && this.$editor.css("padding-bottom", "10px"), this.opts.maxHeight && (this.opts.autoresize = !1, this.sourceHeight = this.opts.maxHeight), this.opts.wym && this.$editor.addClass("redactor_editor_wym"), this.opts.typewriter && this.$editor.addClass("redactor-editor-typewriter"), this.opts.autoresize || a.css("height", this.sourceHeight)
            },
            buildAfter: function() {
                if(this.start = !1, this.opts.toolbar && (this.opts.toolbar = this.toolbarInit(this.opts.curLang), this.toolbarBuild()), this.modalTemplatesInit(), this.buildPlugins(), this.buildBindKeyboard(), this.opts.autosave && this.autosave(), setTimeout($.proxy(this.observeStart, this), 4), this.browser("mozilla")) try {
                    this.document.execCommand("enableObjectResizing", !1, !1), this.document.execCommand("enableInlineTableEditing", !1, !1)
                } catch(a) {}
                this.opts.focus && setTimeout($.proxy(this.focus, this), 100), this.opts.visual || setTimeout($.proxy(function() {
                    this.opts.visual = !0, this.toggle(!1)
                }, this), 200), this.callback("init")
            },
            buildBindKeyboard: function() {
                this.dblEnter = 0, !this.opts.dragUpload || this.opts.imageUpload === !1 && this.opts.s3 === !1 || this.$editor.on("drop.redactor", $.proxy(this.buildEventDrop, this)), this.$editor.on("click.redactor", $.proxy(function() {
                    this.selectall = !1
                }, this)), this.$editor.on("input.redactor", $.proxy(this.sync, this)), this.$editor.on("paste.redactor", $.proxy(this.buildEventPaste, this)), this.$editor.on("keydown.redactor", $.proxy(this.buildEventKeydown, this)), this.$editor.on("keyup.redactor", $.proxy(this.buildEventKeyup, this)), $.isFunction(this.opts.textareaKeydownCallback) && this.$source.on("keydown.redactor-textarea", $.proxy(this.opts.textareaKeydownCallback, this)), $.isFunction(this.opts.focusCallback) && this.$editor.on("focus.redactor", $.proxy(this.opts.focusCallback, this));
                var a;
                $(document).mousedown(function(b) {
                    a = $(b.target)
                }), this.$editor.on("blur.redactor", $.proxy(function(b) {
                    $(a).hasClass("redactor_toolbar") || 0 != $(a).parents(".redactor_toolbar").size() || (this.selectall = !1, $.isFunction(this.opts.blurCallback) && this.callback("blur", b))
                }, this))
            },
            buildEventDrop: function(a) {
                if(a = a.originalEvent || a, void 0 === window.FormData || !a.dataTransfer) return !0;
                var b = a.dataTransfer.files.length;
                if(0 == b) return !0;
                a.preventDefault();
                var c = a.dataTransfer.files[0];
                return this.opts.dnbImageTypes !== !1 && -1 == this.opts.dnbImageTypes.indexOf(c.type) ? !0 : (this.bufferSet(), this.showProgressBar(), void(this.opts.s3 === !1 ? this.dragUploadAjax(this.opts.imageUpload, c, !0, a, this.opts.imageUploadParam) : this.s3uploadFile(c)))
            },
            buildEventPaste: function(a) {
                var b = !1;
                if(this.browser("webkit") && -1 === navigator.userAgent.indexOf("Chrome")) {
                    var c = this.browser("version").split(".");
                    c[0] < 536 && (b = !0)
                }
                if(b) return !0;
                if(this.browser("opera")) return !0;
                if(this.opts.clipboardUpload && this.buildEventClipboardUpload(a)) return !0;
                if(this.opts.cleanup) {
                    this.rtePaste = !0, this.selectionSave(), this.selectall || (this.opts.autoresize === !0 && this.fullscreen !== !0 ? (this.$editor.height(this.$editor.height()), this.saveScroll = this.document.body.scrollTop) : this.saveScroll = this.$editor.scrollTop());
                    var d = this.extractContent();
                    setTimeout($.proxy(function() {
                        var a = this.extractContent();
                        this.$editor.append(d), this.selectionRestore();
                        var b = this.getFragmentHtml(a);
                        this.pasteClean(b), this.opts.autoresize === !0 && this.fullscreen !== !0 && this.$editor.css("height", "auto")
                    }, this), 1)
                }
            },
            buildEventClipboardUpload: function(a) {
                var b = a.originalEvent || a;
                if(this.clipboardFilePaste = !1, "undefined" == typeof b.clipboardData) return !1;
                if(b.clipboardData.items) {
                    var c = b.clipboardData.items[0].getAsFile();
                    if(null !== c) {
                        this.bufferSet(), this.clipboardFilePaste = !0;
                        var d = new FileReader;
                        return d.onload = $.proxy(this.pasteClipboardUpload, this), d.readAsDataURL(c), !0
                    }
                }
                return !1
            },
            buildEventKeydown: function(a) {
                if(this.rtePaste) return !1;
                var b, c = a.which,
                    d = a.ctrlKey || a.metaKey,
                    e = this.getParent(),
                    f = this.getCurrent(),
                    g = this.getBlock(),
                    h = !1;
                if(this.callback("keydown", a), this.browser("mozilla") && "modify" in window.getSelection() && d && (37 === a.keyCode || 39 === a.keyCode)) {
                    var i = this.getSelection(),
                        j = a.metaKey ? "line" : "word";
                    37 === a.keyCode && (i.modify("extend", "left", j), a.shiftKey || i.collapseToStart()), 39 === a.keyCode && (i.modify("extend", "right", j), a.shiftKey || i.collapseToEnd()), a.preventDefault()
                }
                if(this.imageResizeHide(!1), (e && "PRE" === $(e).get(0).tagName || f && "PRE" === $(f).get(0).tagName) && (h = !0, c === this.keyCode.DOWN && this.insertAfterLastElement(g)), c === this.keyCode.DOWN && (e && "BLOCKQUOTE" === $(e)[0].tagName && this.insertAfterLastElement(e), f && "BLOCKQUOTE" === $(f)[0].tagName && this.insertAfterLastElement(f), e && "P" === $(e)[0].tagName && "BLOCKQUOTE" == $(e).parent()[0].tagName && this.insertAfterLastElement(e, $(e).parent()[0]), f && "P" === $(f)[0].tagName && e && "BLOCKQUOTE" == $(e)[0].tagName && this.insertAfterLastElement(f, e)), this.shortcuts(a, c), d && 90 === c && !a.shiftKey && !a.altKey) return a.preventDefault(), void(this.opts.buffer.length ? this.bufferUndo() : this.document.execCommand("undo", !1, !1));
                if(d && 90 === c && a.shiftKey && !a.altKey) return a.preventDefault(), void(0 != this.opts.rebuffer.length ? this.bufferRedo() : this.document.execCommand("redo", !1, !1));
                if(32 == c && this.bufferSet(), d && 65 === c ? (this.bufferSet(), this.selectall = !0) : c == this.keyCode.LEFT_WIN || d || (this.selectall = !1), c != this.keyCode.ENTER || a.shiftKey || a.ctrlKey || a.metaKey) c === this.keyCode.ENTER && (a.ctrlKey || a.shiftKey) && (this.bufferSet(), a.preventDefault(), this.insertLineBreak());
                else {
                    var k = this.getRange();
                    if(k && k.collapsed === !1 && (b = this.getSelection(), b.rangeCount && k.deleteContents()), this.browser("msie") && 1 == e.nodeType && ("TD" == e.tagName || "TH" == e.tagName)) return a.preventDefault(), this.bufferSet(), this.insertNode(document.createElement("br")), this.callback("enter", a), !1;
                    if(g && ("BLOCKQUOTE" == g.tagName || "BLOCKQUOTE" == $(g).parent()[0].tagName))
                        if(this.isEndOfElement()) {
                            if(1 == this.dblEnter) {
                                var l, m;
                                if("BLOCKQUOTE" == g.tagName ? (m = "br", l = g) : (m = "p", l = $(g).parent()[0]), a.preventDefault(), this.insertingAfterLastElement(l), this.dblEnter = 0, "p" == m) $(g).parent().find("p").last().remove();
                                else {
                                    var n = $.trim($(g).html());
                                    $(g).html(n.replace(/<br\s?\/?>$/i, ""))
                                }
                                return
                            }
                            this.dblEnter++
                        } else this.dblEnter++;
                    if(h === !0) return this.buildEventKeydownPre(a, f);
                    if(!this.opts.linebreaks) {
                        if(g && "LI" == g.tagName) {
                            var o = this.getBlock();
                            if(o !== !1 || "LI" === o.tagName) {
                                var p = $.trim($(g).text()),
                                    q = $.trim($(o).text());
                                if("" == p && "" == q && 0 == $(o).next("li").size() && 0 == $(o).parents("li").size()) {
                                    this.bufferSet();
                                    var r = $(o).closest("ol, ul");
                                    $(o).remove();
                                    var s = $("<p>" + this.opts.invisibleSpace + "</p>");
                                    return r.after(s), this.selectionStart(s), this.sync(), this.callback("enter", a), !1
                                }
                            }
                        }
                        if(g && this.opts.rBlockTest.test(g.tagName)) this.bufferSet(), setTimeout($.proxy(function() {
                            var a = this.getBlock();
                            if("DIV" === a.tagName && !$(a).hasClass("redactor_editor")) {
                                var b = $("<p>" + this.opts.invisibleSpace + "</p>");
                                $(a).replaceWith(b), this.selectionStart(b)
                            }
                        }, this), 1);
                        else if(g === !1) {
                            this.bufferSet();
                            var s = $("<p>" + this.opts.invisibleSpace + "</p>");
                            return this.insertNode(s[0]), this.selectionStart(s), this.callback("enter", a), !1
                        }
                    }
                    if(this.opts.linebreaks) {
                        if(!g || !this.opts.rBlockTest.test(g.tagName)) return this.buildEventKeydownInsertLineBreak(a);
                        this.bufferSet(), setTimeout($.proxy(function() {
                            var a = this.getBlock();
                            "DIV" !== a.tagName && "P" !== a.tagName || $(a).hasClass("redactor_editor") || this.replaceLineBreak(a)
                        }, this), 1)
                    }
                    if("BLOCKQUOTE" == g.tagName || "FIGCAPTION" == g.tagName) return this.buildEventKeydownInsertLineBreak(a);
                    this.callback("enter", a)
                }
                return(c === this.keyCode.TAB || a.metaKey && 219 === c) && this.opts.shortcuts ? this.buildEventKeydownTab(a, h, c) : void(c === this.keyCode.BACKSPACE && this.buildEventKeydownBackspace(a, f, e))
            },
            buildEventKeydownPre: function(a, b) {
                a.preventDefault(), this.bufferSet();
                var c = $(b).parent().text();
                return this.insertNode(document.createTextNode("\n")), -1 == c.search(/\s$/) && this.insertNode(document.createTextNode("\n")), this.sync(), this.callback("enter", a), !1
            },
            buildEventKeydownTab: function(a, b) {
                return this.opts.tabFocus ? this.isEmpty(this.get()) && this.opts.tabSpaces === !1 ? !0 : (a.preventDefault(), b !== !0 || a.shiftKey ? this.opts.tabSpaces !== !1 ? (this.bufferSet(), this.insertNode(document.createTextNode(Array(this.opts.tabSpaces + 1).join(" "))), this.sync(), !1) : (a.shiftKey ? this.indentingOutdent() : this.indentingIndent(), !1) : (this.bufferSet(), this.insertNode(document.createTextNode("	")), this.sync(), !1)) : !0
            },
            buildEventKeydownBackspace: function(a, b, c) {
                if(c && b && "TD" == c.parentNode.tagName && "UL" == c.tagName && "LI" == b.tagName && 1 == $(c).children("li").size()) {
                    var d = $(b).text().replace(/[\u200B-\u200D\uFEFF]/g, "");
                    if("" == d) {
                        var e = c.parentNode;
                        return $(c).remove(), this.selectionStart(e), this.sync(), !1
                    }
                }
                if("undefined" != typeof b.tagName && /^(H[1-6])$/i.test(b.tagName)) {
                    var e;
                    e = $(this.opts.linebreaks === !1 ? "<p>" + this.opts.invisibleSpace + "</p>" : "<br>" + this.opts.invisibleSpace), $(b).replaceWith(e), this.selectionStart(e), this.sync()
                }
                "undefined" != typeof b.nodeValue && null !== b.nodeValue && b.remove && 3 === b.nodeType && null == b.nodeValue.match(/[^\u200B]/g) && ($(b).prev().remove(), this.sync())
            },
            buildEventKeydownInsertLineBreak: function(a) {
                this.bufferSet(), a.preventDefault(), this.insertLineBreak(), this.callback("enter", a)
            },
            buildEventKeyup: function(a) {
                if(this.rtePaste) return !1;
                var b = a.which,
                    c = this.getParent(),
                    d = this.getCurrent();
                if(!this.opts.linebreaks && 3 == d.nodeType && (0 == c || "BODY" == c.tagName)) {
                    var e = $("<p>").append($(d).clone());
                    $(d).replaceWith(e);
                    var f = $(e).next();
                    "undefined" != typeof f[0] && "BR" == f[0].tagName && f.remove(), this.selectionEnd(e)
                }
                return(this.opts.convertLinks || this.opts.convertImageLinks || this.opts.convertVideoLinks) && b === this.keyCode.ENTER && this.buildEventKeyupConverters(), b === this.keyCode.DELETE || b === this.keyCode.BACKSPACE ? this.formatEmpty(a) : (this.callback("keyup", a), void this.sync(a))
            },
            buildEventKeyupConverters: function() {
                this.formatLinkify(this.opts.linkProtocol, this.opts.convertLinks, this.opts.convertImageLinks, this.opts.convertVideoLinks, this.opts.linkSize), setTimeout($.proxy(function() {
                    this.opts.convertImageLinks && this.observeImages(), this.opts.observeLinks && this.observeLinks()
                }, this), 5)
            },
            buildPlugins: function() {
                this.opts.plugins && $.each(this.opts.plugins, $.proxy(function(a, b) {
                    RedactorPlugins[b] && ($.extend(this, RedactorPlugins[b]), $.isFunction(RedactorPlugins[b].init) && this.init())
                }, this))
            },
            iframeStart: function() {
                this.iframeCreate(), this.opts.textareamode ? this.iframeAppend(this.$source) : (this.$sourceOld = this.$source.hide(), this.$source = this.buildCodearea(this.$sourceOld), this.iframeAppend(this.$sourceOld))
            },
            iframeAppend: function(a) {
                this.$source.attr("dir", this.opts.direction).hide(), this.$box.insertAfter(a).append(this.$frame).append(this.$source)
            },
            iframeCreate: function() {
                this.$frame = $('<iframe style="width: 100%;" frameborder="0" />').one("load", $.proxy(function() {
                    if(this.opts.fullpage) {
                        this.iframePage(), "" === this.content && (this.content = this.opts.invisibleSpace), this.$frame.contents()[0].write(this.content), this.$frame.contents()[0].close();
                        var a = setInterval($.proxy(function() {
                            this.$frame.contents().find("body").html() && (clearInterval(a), this.iframeLoad())
                        }, this), 0)
                    } else this.iframeLoad()
                }, this))
            },
            iframeDoc: function() {
                return this.$frame[0].contentWindow.document
            },
            iframePage: function() {
                var a = this.iframeDoc();
                return a.documentElement && a.removeChild(a.documentElement), a
            },
            iframeAddCss: function(a) {
                a = a || this.opts.css, this.isString(a) && this.$frame.contents().find("head").append('<link rel="stylesheet" href="' + a + '" />'), $.isArray(a) && $.each(a, $.proxy(function(a, b) {
                    this.iframeAddCss(b)
                }, this))
            },
            iframeLoad: function() {
                this.$editor = this.$frame.contents().find("body").attr({
                    contenteditable: !0,
                    dir: this.opts.direction
                }), this.$editor[0] && (this.document = this.$editor[0].ownerDocument, this.window = this.document.defaultView || window), this.iframeAddCss(), this.opts.fullpage ? this.setFullpageOnInit(this.$source.val()) : this.set(this.content, !0, !1), this.buildOptions(), this.buildAfter()
            },
            placeholderInit: function() {
                this.opts.placeholder !== !1 ? (this.placeholderText = this.opts.placeholder, this.opts.placeholder = !0) : "undefined" == typeof this.$element.attr("placeholder") || "" == this.$element.attr("placeholder") ? this.opts.placeholder = !1 : (this.placeholderText = this.$element.attr("placeholder"), this.opts.placeholder = !0)
            },
            placeholderStart: function(a) {
                return this.opts.placeholder === !1 ? !1 : this.isEmpty(a) ? (this.opts.focus = !1, this.placeholderOnFocus(), this.placeholderOnBlur(), this.placeholderGet()) : (this.placeholderOnBlur(), !1)
            },
            placeholderOnFocus: function() {
                this.$editor.on("focus.redactor_placeholder", $.proxy(this.placeholderFocus, this))
            },
            placeholderOnBlur: function() {
                this.$editor.on("blur.redactor_placeholder", $.proxy(this.placeholderBlur, this))
            },
            placeholderGet: function() {
                var a = $('<span class="redactor_placeholder">').data("redactor", "verified").attr("contenteditable", !1).text(this.placeholderText);
                return this.opts.linebreaks === !1 ? $("<p>").append(a) : a
            },
            placeholderBlur: function() {
                var a = this.get();
                this.isEmpty(a) && (this.placeholderOnFocus(), this.$editor.html(this.placeholderGet()))
            },
            placeholderFocus: function() {
                this.$editor.find("span.redactor_placeholder").remove();
                var a = "";
                this.opts.linebreaks === !1 && (a = this.opts.emptyHtml), this.$editor.off("focus.redactor_placeholder"), this.$editor.html(a), this.opts.linebreaks === !1 ? this.selectionStart(this.$editor.children()[0]) : this.focus(), this.sync()
            },
            placeholderRemoveFromEditor: function() {
                this.$editor.find("span.redactor_placeholder").remove(), this.$editor.off("focus.redactor_placeholder")
            },
            placeholderRemoveFromCode: function(a) {
                return a.replace(/<span class="redactor_placeholder"(.*?)>(.*?)<\/span>/i, "")
            },
            shortcuts: function(e, key) {
                return this.opts.shortcuts ? void $.each(this.opts.shortcuts, $.proxy(function(str, command) {
                    var keys = str.split(",");
                    for(var i in keys) "string" == typeof keys[i] && this.shortcutsHandler(e, $.trim(keys[i]), $.proxy(function() {
                        eval(command)
                    }, this))
                }, this)) : (!e.ctrlKey && !e.metaKey || 66 !== key && 73 !== key || e.preventDefault(), !1)
            },
            shortcutsHandler: function(a, b, c) {
                var d = {
                        8: "backspace",
                        9: "tab",
                        10: "return",
                        13: "return",
                        16: "shift",
                        17: "ctrl",
                        18: "alt",
                        19: "pause",
                        20: "capslock",
                        27: "esc",
                        32: "space",
                        33: "pageup",
                        34: "pagedown",
                        35: "end",
                        36: "home",
                        37: "left",
                        38: "up",
                        39: "right",
                        40: "down",
                        45: "insert",
                        46: "del",
                        59: ";",
                        61: "=",
                        96: "0",
                        97: "1",
                        98: "2",
                        99: "3",
                        100: "4",
                        101: "5",
                        102: "6",
                        103: "7",
                        104: "8",
                        105: "9",
                        106: "*",
                        107: "+",
                        109: "-",
                        110: ".",
                        111: "/",
                        112: "f1",
                        113: "f2",
                        114: "f3",
                        115: "f4",
                        116: "f5",
                        117: "f6",
                        118: "f7",
                        119: "f8",
                        120: "f9",
                        121: "f10",
                        122: "f11",
                        123: "f12",
                        144: "numlock",
                        145: "scroll",
                        173: "-",
                        186: ";",
                        187: "=",
                        188: ",",
                        189: "-",
                        190: ".",
                        191: "/",
                        192: "`",
                        219: "[",
                        220: "\\",
                        221: "]",
                        222: "'"
                    },
                    e = {
                        "`": "~",
                        1: "!",
                        2: "@",
                        3: "#",
                        4: "$",
                        5: "%",
                        6: "^",
                        7: "&",
                        8: "*",
                        9: "(",
                        0: ")",
                        "-": "_",
                        "=": "+",
                        ";": ": ",
                        "'": '"',
                        ",": "<",
                        ".": ">",
                        "/": "?",
                        "\\": "|"
                    };
                b = b.toLowerCase().split(" ");
                var f = d[a.keyCode],
                    g = String.fromCharCode(a.which).toLowerCase(),
                    h = "",
                    i = {};
                $.each(["alt", "ctrl", "meta", "shift"], function(b, c) {
                    a[c + "Key"] && f !== c && (h += c + "+")
                }), f && (i[h + f] = !0), g && (i[h + g] = !0, i[h + e[g]] = !0, "shift+" === h && (i[e[g]] = !0));
                for(var j = 0, k = b.length; k > j; j++)
                    if(i[b[j]]) return a.preventDefault(), c.apply(this, arguments)
            },
            focus: function() {
                this.browser("opera") ? this.$editor.focus() : this.window.setTimeout($.proxy(this.focusSet, this, !0), 1)
            },
            focusWithSaveScroll: function() {
                if(this.browser("msie")) var a = this.document.documentElement.scrollTop;
                this.$editor.focus(), this.browser("msie") && (this.document.documentElement.scrollTop = a)
            },
            focusEnd: function() {
                if(this.browser("mozilla"))
                    if(this.opts.linebreaks === !1) {
                        var a = this.$editor.children().last();
                        this.$editor.focus(), this.selectionEnd(a)
                    } else this.focusSet();
                else this.focusSet()
            },
            focusSet: function(a, b) {
                this.$editor.focus(), "undefined" == typeof b && (b = this.$editor[0]);
                var c = this.getRange();
                c.selectNodeContents(b), c.collapse(a || !1);
                var d = this.getSelection();
                d.removeAllRanges(), d.addRange(c)
            },
            toggle: function(a) {
                this.opts.visual ? this.toggleCode(a) : this.toggleVisual()
            },
            toggleVisual: function() {
                var a = this.$source.hide().val();
                if("undefined" != typeof this.modified) {
                    var b = this.modified.replace(/\n/g, ""),
                        c = a.replace(/\n/g, "");
                    c = this.cleanRemoveSpaces(c, !1), this.modified = this.cleanRemoveSpaces(b, !1) !== c
                }
                this.modified && (this.opts.fullpage && "" === a ? this.setFullpageOnInit(a) : (this.set(a), this.opts.fullpage && this.buildBindKeyboard()), this.callback("change", !1, a)), this.opts.iframe ? this.$frame.show() : this.$editor.show(), this.opts.fullpage && this.$editor.attr("contenteditable", !0), this.$source.off("keydown.redactor-textarea-indenting"), this.$editor.focus(), this.selectionRestore(), this.observeStart(), this.buttonActiveVisual(), this.buttonInactive("html"), this.opts.visual = !0
            },
            toggleCode: function(a) {
                a !== !1 && this.selectionSave();
                var b = null;
                this.opts.iframe ? (b = this.$frame.height(), this.opts.fullpage && this.$editor.removeAttr("contenteditable"), this.$frame.hide()) : (b = this.$editor.innerHeight(), this.$editor.hide());
                var c = this.$source.val();
                "" !== c && this.opts.tidyHtml && this.$source.val(this.cleanHtml(c)), this.modified = c, this.$source.height(b).show().focus(), this.$source.on("keydown.redactor-textarea-indenting", this.textareaIndenting), this.buttonInactiveVisual(), this.buttonActive("html"), this.opts.visual = !1
            },
            textareaIndenting: function(a) {
                if(9 === a.keyCode) {
                    var b = $(this),
                        c = b.get(0).selectionStart;
                    return b.val(b.val().substring(0, c) + "	" + b.val().substring(b.get(0).selectionEnd)), b.get(0).selectionStart = b.get(0).selectionEnd = c + 1, !1
                }
            },
            autosave: function() {
                var a = !1;
                this.autosaveInterval = setInterval($.proxy(function() {
                    var b = this.get();
                    if(a !== b) {
                        var c = this.$source.attr("name");
                        $.ajax({
                            url: this.opts.autosave,
                            type: "post",
                            data: "name=" + c + "&" + c + "=" + escape(encodeURIComponent(b)),
                            success: $.proxy(function(c) {
                                var d = $.parseJSON(c);
                                "undefined" == typeof d.error ? this.callback("autosave", !1, d) : this.callback("autosaveError", !1, d), a = b
                            }, this)
                        })
                    }
                }, this), 1e3 * this.opts.autosaveInterval)
            },
            toolbarBuild: function() {
                if(this.isMobile() && this.opts.buttonsHideOnMobile.length > 0 && $.each(this.opts.buttonsHideOnMobile, $.proxy(function(a, b) {
                        var c = this.opts.buttons.indexOf(b);
                        this.opts.buttons.splice(c, 1)
                    }, this)), this.opts.air) this.opts.buttons = this.opts.airButtons;
                else if(!this.opts.buttonSource) {
                    var a = this.opts.buttons.indexOf("html");
                    this.opts.buttons.splice(a, 1)
                }
                return this.opts.toolbar && $.each(this.opts.toolbar.formatting.dropdown, $.proxy(function(a) {
                    "-1" == $.inArray(a, this.opts.formattingTags) && delete this.opts.toolbar.formatting.dropdown[a]
                }, this)), 0 === this.opts.buttons.length ? !1 : (this.airEnable(), this.$toolbar = $("<ul>").addClass("redactor_toolbar").attr("id", "redactor_toolbar_" + this.uuid), this.opts.typewriter && this.$toolbar.addClass("redactor-toolbar-typewriter"), this.opts.toolbarOverflow && this.isMobile() && this.$toolbar.addClass("redactor-toolbar-overflow"), this.opts.air ? (this.$air = $('<div class="redactor_air">').attr("id", "redactor_air_" + this.uuid).hide(), this.$air.append(this.$toolbar), $("body").append(this.$air)) : this.opts.toolbarExternal ? (this.$toolbar.addClass("redactor-toolbar-external"), $(this.opts.toolbarExternal).html(this.$toolbar)) : this.$box.prepend(this.$toolbar), $.each(this.opts.buttons, $.proxy(function(a, b) {
                    if(this.opts.toolbar[b]) {
                        var c = this.opts.toolbar[b];
                        if(this.opts.fileUpload === !1 && "file" === b) return !0;
                        this.$toolbar.append($("<li>").append(this.buttonBuild(b, c)))
                    }
                }, this)), this.$toolbar.find("a").attr("tabindex", "-1"), this.opts.toolbarFixed && (this.toolbarObserveScroll(), $(this.opts.toolbarFixedTarget).on("scroll.redactor", $.proxy(this.toolbarObserveScroll, this))), void(this.opts.activeButtons && this.$editor.on("mouseup.redactor keyup.redactor", $.proxy(this.buttonActiveObserver, this))))
            },
            toolbarObserveScroll: function() {
                var a = $(this.opts.toolbarFixedTarget).scrollTop(),
                    b = 0,
                    c = 0,
                    d = 0;
                if(b = this.opts.toolbarFixedTarget === document ? this.$box.offset().top : 1, d = b + this.$box.height() + 40, a > b) {
                    var e = "100%";
                    this.opts.toolbarFixedBox && (c = this.$box.offset().left, e = this.$box.innerWidth(), this.$toolbar.addClass("toolbar_fixed_box")), this.toolbarFixed = !0, this.$toolbar.css(this.opts.toolbarFixedTarget === document ? {
                        position: "fixed",
                        width: e,
                        zIndex: 10005,
                        top: this.opts.toolbarFixedTopOffset + "px",
                        left: c
                    } : {
                        position: "absolute",
                        width: e,
                        zIndex: 10005,
                        top: this.opts.toolbarFixedTopOffset + a + "px",
                        left: 0
                    }), d > a ? this.$toolbar.css("visibility", "visible") : this.$toolbar.css("visibility", "hidden")
                } else this.toolbarFixed = !1, this.$toolbar.css({
                    position: "relative",
                    width: "auto",
                    top: 0,
                    left: c
                }), this.opts.toolbarFixedBox && this.$toolbar.removeClass("toolbar_fixed_box")
            },
            airEnable: function() {
                this.opts.air && this.$editor.on("mouseup.redactor keyup.redactor", this, $.proxy(function(a) {
                    var b = this.getSelectionText();
                    if("mouseup" === a.type && "" != b && this.airShow(a), "keyup" === a.type && a.shiftKey && "" != b) {
                        var c = $(this.getElement(this.getSelection().focusNode)),
                            d = c.offset();
                        d.height = c.height(), this.airShow(d, !0)
                    }
                }, this))
            },
            airShow: function(a, b) {
                if(this.opts.air) {
                    var c, d;
                    if($(".redactor_air").hide(), b) c = a.left, d = a.top + a.height + 14, this.opts.iframe && (d += this.$box.position().top - $(this.document).scrollTop(), c += this.$box.position().left);
                    else {
                        var e = this.$air.innerWidth();
                        c = a.clientX, $(this.document).width() < c + e && (c -= e), d = a.clientY + 14, this.opts.iframe ? (d += this.$box.position().top, c += this.$box.position().left) : d += $(this.document).scrollTop()
                    }
                    this.$air.css({
                        left: c + "px",
                        top: d + "px"
                    }).show(), this.airBindHide()
                }
            },
            airBindHide: function() {
                if(this.opts.air) {
                    var a = $.proxy(function(a) {
                        $(a).on("mousedown.redactor", $.proxy(function(b) {
                            0 === $(b.target).closest(this.$toolbar).length && (this.$air.fadeOut(100), this.selectionRemove(), $(a).off(b))
                        }, this)).on("keydown.redactor", $.proxy(function(b) {
                            b.which === this.keyCode.ESC && this.getSelection().collapseToStart(), this.$air.fadeOut(100), $(a).off(b)
                        }, this))
                    }, this);
                    a(document), this.opts.iframe && a(this.document)
                }
            },
            airBindMousemoveHide: function() {
                if(this.opts.air) {
                    var a = $.proxy(function(a) {
                        $(a).on("mousemove.redactor", $.proxy(function(b) {
                            0 === $(b.target).closest(this.$toolbar).length && (this.$air.fadeOut(100), $(a).off(b))
                        }, this))
                    }, this);
                    a(document), this.opts.iframe && a(this.document)
                }
            },
            dropdownBuild: function(a, b) {
                $.each(b, $.proxy(function(b, c) {
                    c.className || (c.className = "");
                    var d;
                    "separator" === c.name ? d = $('<li class="divider"></li>') : (d = $('<li><a href="#" class="' + c.className + " redactor_dropdown_" + b + '">' + c.title + "</a></li>"), d.on("mousedown", function(a) {
                        a.preventDefault(), a.stopPropagation()
                    }), d.on("click", $.proxy(function(a) {
                        a.preventDefault && a.preventDefault(), this.browser("msie") && (a.returnValue = !1), c.callback && c.callback.call(this, b, d, c, a), c.exec && this.execCommand(c.exec, b), c.func && this[c.func](b), this.buttonActiveObserver(), this.opts.air && this.$air.fadeOut(100)
                    }, this))), a.append(d)
                }, this))
            },
            dropdownShow: function(a, b) {
                if(!this.opts.visual) return a.preventDefault(), !1;
                var c = this.buttonGet(b);
                0 == $("#redactor-dropdown-holder").length && $(document.body).append('<div id="redactor-dropdown-holder" class="ccm-ui" />');
                var d = $("#redactor-dropdown-holder"),
                    e = c.data("dropdown").appendTo(d);
                if(c.hasClass("dropact")) this.dropdownHideAll();
                else {
                    this.dropdownHideAll(), this.callback("dropdownShow", {
                        dropdown: e,
                        key: b,
                        button: c
                    }), this.buttonActive(b), c.addClass("dropact");
                    var f = c.offset(),
                        g = e.width();
                    f.left + g > $(document).width() && (f.left -= g);
                    var h = f.left + "px",
                        i = c.innerHeight(),
                        j = "absolute",
                        k = i + this.opts.toolbarFixedTopOffset + "px";
                    this.opts.toolbarFixed && this.toolbarFixed ? j = "fixed" : k = f.top + i + "px", e.css({
                        position: j,
                        left: h,
                        top: k
                    }).show(), this.callback("dropdownShown", {
                        dropdown: e,
                        key: b,
                        button: c
                    })
                }
                var l = $.proxy(function(a) {
                    this.dropdownHide(a, e)
                }, this);
                $(document).one("click", l), this.$editor.one("click", l), this.$editor.one("touchstart", l), a.stopPropagation(), this.focusWithSaveScroll()
            },
            dropdownHideAll: function() {
                this.$toolbar.find("a.dropact").removeClass("redactor_act").removeClass("dropact"), $("#redactor-dropdown-holder ul.dropdown-menu").hide(), this.callback("dropdownHide")
            },
            dropdownHide: function(a, b) {
                $(a.target).hasClass("dropact") || (b.removeClass("dropact"), this.dropdownHideAll())
            },
            getIconClass: function(a) {
                switch(a) {
                    case "html":
                        return "fa fa-code";
                    case "formatting":
                    case "formatting-concrete5":
                        return "fa fa-paragraph";
                    case "styles":
                        return "fa fa-magic";
                    case "orderedlist":
                        return "fa fa-list-ol";
                    case "unorderedlist":
                        return "fa fa-list-ul";
                    case "video":
                        return "fa fa-file-video-o";
                    case "alignment":
                        return "fa fa-align-left";
                    case "horizontalrule":
                        return "fa fa-minus";
                    case "deleted":
                        return "fa fa-strikethrough";
                    case "fontfamily":
                        return "fa fa-font";
                    case "fontsize":
                        return "fa fa-text-height";
                    case "fontcolor":
                        return "fa fa-tint";
                    case "backcolor":
                        return "fa fa-tint";
                    default:
                        return "fa fa-" + a
                }
            },
            buttonBuild: function(a, b, c) {
                var d = $('<a href="javascript:;" title="' + b.title + '" tabindex="-1" class="' + this.getIconClass(a) + " re-icon re-" + a + '"></a>');
                if("undefined" != typeof c && d.addClass("redactor-btn-image"), d.on("click", $.proxy(function(c) {
                        return c.preventDefault && c.preventDefault(), this.browser("msie") && (c.returnValue = !1), d.hasClass("redactor_button_disabled") ? !1 : (this.isFocused() !== !1 || b.exec || this.focusWithSaveScroll(), b.exec ? (this.focusWithSaveScroll(), this.execCommand(b.exec, a), this.airBindMousemoveHide()) : b.func && "show" !== b.func ? (this[b.func](a), this.airBindMousemoveHide()) : b.callback ? (b.callback.call(this, a, d, b, c), this.airBindMousemoveHide()) : b.dropdown && this.dropdownShow(c, a), void this.buttonActiveObserver(!1, a))
                    }, this)), b.dropdown) {
                    var e = $('<ul class="dropdown-menu redactor_dropdown_box_' + a + '" style="display: none;">');
                    d.data("dropdown", e), this.dropdownBuild(e, b.dropdown)
                }
                return d
            },
            buttonGet: function(a) {
                return this.opts.toolbar ? $(this.$toolbar.find("a.re-" + a)) : !1
            },
            buttonTagToActiveState: function(a, b) {
                this.opts.activeButtons.push(a), this.opts.activeButtonsStates[b] = a
            },
            buttonActiveToggle: function(a) {
                var b = this.buttonGet(a);
                b.hasClass("redactor_act") ? this.buttonInactive(a) : this.buttonActive(a)
            },
            buttonActive: function(a) {
                var b = this.buttonGet(a);
                b.addClass("redactor_act")
            },
            buttonInactive: function(a) {
                var b = this.buttonGet(a);
                b.removeClass("redactor_act")
            },
            buttonInactiveAll: function(a) {
                this.$toolbar.find("a.re-icon").not(".re-" + a).removeClass("redactor_act")
            },
            buttonActiveVisual: function() {
                this.$toolbar.find("a.re-icon").not("a.re-html").removeClass("redactor_button_disabled")
            },
            buttonInactiveVisual: function() {
                this.$toolbar.find("a.re-icon").not("a.re-html").addClass("redactor_button_disabled")
            },
            buttonChangeIcon: function(a, b) {
                this.buttonGet(a).addClass("re-" + b)
            },
            buttonRemoveIcon: function(a, b) {
                this.buttonGet(a).removeClass("re-" + b)
            },
            buttonAwesome: function(a, b) {
                var c = this.buttonGet(a);
                c.removeClass("redactor-btn-image"), c.addClass("fa-redactor-btn"), c.html('<i class="fa ' + b + '"></i>')
            },
            buttonAdd: function(a, b, c, d) {
                if(this.opts.toolbar) {
                    var e = this.buttonBuild(a, {
                        title: b,
                        callback: c,
                        dropdown: d
                    }, !0);
                    return this.$toolbar.append($("<li>").append(e)), e
                }
            },
            buttonAddFirst: function(a, b, c, d) {
                if(this.opts.toolbar) {
                    var e = this.buttonBuild(a, {
                        title: b,
                        callback: c,
                        dropdown: d
                    }, !0);
                    this.$toolbar.prepend($("<li>").append(e))
                }
            },
            buttonAddAfter: function(a, b, c, d, e) {
                if(this.opts.toolbar) {
                    var f = this.buttonBuild(b, {
                            title: c,
                            callback: d,
                            dropdown: e
                        }, !0),
                        g = this.buttonGet(a);
                    return 0 !== g.size() ? g.parent().after($("<li>").append(f)) : this.$toolbar.append($("<li>").append(f)), f
                }
            },
            buttonAddBefore: function(a, b, c, d, e) {
                if(this.opts.toolbar) {
                    var f = this.buttonBuild(b, {
                            title: c,
                            callback: d,
                            dropdown: e
                        }, !0),
                        g = this.buttonGet(a);
                    return 0 !== g.size() ? g.parent().before($("<li>").append(f)) : this.$toolbar.append($("<li>").append(f)), f
                }
            },
            buttonRemove: function(a) {
                var b = this.buttonGet(a);
                b.parent().remove()
            },
            buttonActiveObserver: function(a, b) {
                var c = this.getParent();
                if(this.buttonInactiveAll(b), a === !1 && "html" !== b) return void(-1 != $.inArray(b, this.opts.activeButtons) && this.buttonActiveToggle(b));
                this.$toolbar.find("a.redactor_dropdown_link").text(c && "A" === c.tagName ? this.opts.curLang.link_edit : this.opts.curLang.link_insert), $.each(this.opts.activeButtonsStates, $.proxy(function(a, b) {
                    0 != $(c).closest(a, this.$editor.get()[0]).length && this.buttonActive(b)
                }, this));
                var d = $(c).closest(this.opts.alignmentTags.toString().toLowerCase(), this.$editor[0]);
                if(d.length) {
                    var e = d.css("text-align");
                    "" == e && (e = "left"), this.buttonActive("align" + e)
                }
            },
            execPasteFrag: function(a) {
                var b = this.getSelection();
                if(b.getRangeAt && b.rangeCount) {
                    var c = this.getRange();
                    c.deleteContents();
                    var d = this.document.createElement("div");
                    d.innerHTML = a;
                    for(var e, f, g = this.document.createDocumentFragment(); e = d.firstChild;) f = g.appendChild(e); {
                        g.firstChild
                    }
                    c.insertNode(g), f && (c = c.cloneRange(), c.setStartAfter(f), c.collapse(!0)), b.removeAllRanges(), b.addRange(c)
                }
            },
            exec: function(a, b, c) {
                "formatblock" === a && this.browser("msie") && (b = "<" + b + ">"), "inserthtml" === a && this.browser("msie") ? this.isIe11() ? this.execPasteFrag(b) : (this.focusWithSaveScroll(), this.document.selection.createRange().pasteHTML(b)) : this.document.execCommand(a, !1, b), c !== !1 && this.sync(), this.callback("execCommand", a, b)
            },
            execCommand: function(a, b, c) {
                if(!this.opts.visual) return this.$source.focus(), !1;
                if(("bold" === a || "italic" === a || "underline" === a || "strikethrough" === a) && this.bufferSet(), "superscript" === a || "subscript" === a) {
                    var d = this.getParent();
                    ("SUP" === d.tagName || "SUB" === d.tagName) && this.inlineRemoveFormatReplace(d)
                }
                return "inserthtml" === a ? (this.insertHtml(b, c), void this.callback("execCommand", a, b)) : this.currentOrParentIs("PRE") && !this.opts.formattingPre ? !1 : "insertunorderedlist" === a || "insertorderedlist" === a ? this.execLists(a, b) : "unlink" === a ? this.execUnlink(a, b) : (this.exec(a, b, c), void("inserthorizontalrule" === a && this.$editor.find("hr").removeAttr("id")))
            },
            execUnlink: function(a, b) {
                this.bufferSet();
                var c = this.currentOrParentIs("A");
                return c ? ($(c).replaceWith($(c).text()), this.sync(), void this.callback("execCommand", a, b)) : void 0
            },
            execLists: function(a, b) {
                this.bufferSet();
                var c = this.getParent(),
                    d = $(c).closest("ol, ul");
                this.isParentRedactor(d) || 0 == d.size() || (d = !1);
                var e = !1;
                if(d && d.length) {
                    e = !0;
                    var f = d[0].tagName;
                    ("insertunorderedlist" === a && "OL" === f || "insertorderedlist" === a && "UL" === f) && (e = !1)
                }
                if(this.selectionSave(), e) {
                    var g = this.getNodes(),
                        h = this.getBlocks(g);
                    "undefined" != typeof g[0] && g.length > 1 && 3 == g[0].nodeType && h.unshift(this.getBlock());
                    var i = "",
                        j = "";
                    $.each(h, $.proxy(function(a, b) {
                        if("LI" == b.tagName) {
                            var c = $(b),
                                d = c.clone();
                            if(d.find("ul", "ol").remove(), this.opts.linebreaks === !1) i += this.outerHtml($("<p>").append(d.contents()));
                            else {
                                var e = d.html().replace(/<br\s?\/?>$/i, "");
                                i += e + "<br>"
                            }
                            0 == a ? (c.addClass("redactor-replaced").empty(), j = this.outerHtml(c)) : c.remove()
                        }
                    }, this)), html = this.$editor.html().replace(j, "</" + f + ">" + i + "<" + f + ">"), this.$editor.html(html), this.$editor.find(f + ":empty").remove()
                } else {
                    var k = $(this.getParent()).closest("td");
                    if(this.browser("msie") && !this.isIe11() && this.opts.linebreaks) {
                        var l = this.selectionWrap("div"),
                            m = $(l).html(),
                            n = $("<ul>");
                        "insertorderedlist" == a && (n = $("<ol>"));
                        var o = $("<li>");
                        "" == $.trim(m) ? (o.append(m + '<span id="selection-marker-1">' + this.opts.invisibleSpace + "</span>"), n.append(o), this.$editor.find("#selection-marker-1").replaceWith(n)) : (o.append(m), n.append(o), $(l).replaceWith(n))
                    } else this.document.execCommand(a);
                    var c = this.getParent(),
                        d = $(c).closest("ol, ul");
                    if(this.opts.linebreaks === !1) {
                        var p = $.trim(d.text());
                        "" == p && (d.children("li").find("br").remove(), d.children("li").append('<span id="selection-marker-1">' + this.opts.invisibleSpace + "</span>"))
                    }
                    if(0 != k.size() && d.wrapAll("<td>"), d.length) {
                        var q = d.parent();
                        this.isParentRedactor(q) && "LI" != q[0].tagName && this.nodeTestBlocks(q[0]) && q.replaceWith(q.contents())
                    }
                    this.browser("mozilla") && this.$editor.focus()
                }
                this.selectionRestore(), this.$editor.find("#selection-marker-1").removeAttr("id"), this.sync(), this.callback("execCommand", a, b)
            },
            indentingIndent: function() {
                this.indentingStart("indent")
            },
            indentingOutdent: function() {
                this.indentingStart("outdent")
            },
            indentingStart: function(a) {
                if(this.bufferSet(), "indent" === a) {
                    var b = this.getBlock();
                    if(this.selectionSave(), b && "LI" == b.tagName) {
                        var c = this.getParent(),
                            d = $(c).closest("ol, ul"),
                            e = d[0].tagName,
                            f = this.getBlocks();
                        $.each(f, function(a, b) {
                            if("LI" == b.tagName) {
                                var c = $(b).prev();
                                if(0 != c.size() && "LI" == c[0].tagName) {
                                    var d = c.children("ul, ol");
                                    0 == d.size() ? c.append($("<" + e + ">").append(b)) : d.append(b)
                                }
                            }
                        })
                    } else if(b === !1 && this.opts.linebreaks === !0) {
                        this.exec("formatBlock", "blockquote");
                        var g = this.getBlock(),
                            b = $('<div data-tagblock="">').html($(g).html());
                        $(g).replaceWith(b);
                        var h = this.normalize($(b).css("margin-left")) + this.opts.indentValue;
                        $(b).css("margin-left", h + "px")
                    } else {
                        var i = this.getBlocks();
                        $.each(i, $.proxy(function(a, b) {
                            var c = !1;
                            if("TD" !== b.tagName) {
                                c = -1 !== $.inArray(b.tagName, this.opts.alignmentTags) ? $(b) : $(b).closest(this.opts.alignmentTags.toString().toLowerCase(), this.$editor[0]);
                                var d = this.normalize(c.css("margin-left")) + this.opts.indentValue;
                                c.css("margin-left", d + "px")
                            }
                        }, this))
                    }
                    this.selectionRestore()
                } else {
                    this.selectionSave();
                    var b = this.getBlock();
                    if(b && "LI" == b.tagName) {
                        var f = this.getBlocks(),
                            j = 0;
                        this.insideOutdent(b, j, f)
                    } else {
                        var i = this.getBlocks();
                        $.each(i, $.proxy(function(a, b) {
                            var c = !1;
                            c = -1 !== $.inArray(b.tagName, this.opts.alignmentTags) ? $(b) : $(b).closest(this.opts.alignmentTags.toString().toLowerCase(), this.$editor[0]);
                            var d = this.normalize(c.css("margin-left")) - this.opts.indentValue;
                            0 >= d ? this.opts.linebreaks === !0 && "undefined" != typeof c.data("tagblock") ? c.replaceWith(c.html() + "<br>") : (c.css("margin-left", ""), this.removeEmptyAttr(c, "style")) : c.css("margin-left", d + "px")
                        }, this))
                    }
                    this.selectionRestore()
                }
                this.sync()
            },
            insideOutdent: function(a, b, c) {
                if(a && "LI" == a.tagName) {
                    var d = $(a).parent().parent();
                    0 != d.size() && "LI" == d[0].tagName ? d.after(a) : "undefined" != typeof c[b] ? (a = c[b], b++, this.insideOutdent(a, b, c)) : this.execCommand("insertunorderedlist")
                }
            },
            alignmentLeft: function() {
                this.alignmentSet("", "JustifyLeft")
            },
            alignmentRight: function() {
                this.alignmentSet("right", "JustifyRight")
            },
            alignmentCenter: function() {
                this.alignmentSet("center", "JustifyCenter")
            },
            alignmentJustify: function() {
                this.alignmentSet("justify", "JustifyFull")
            },
            alignmentSet: function(a, b) {
                if(this.bufferSet(), this.oldIE()) return this.document.execCommand(b, !1, !1), !0;
                this.selectionSave();
                var c = this.getBlock();
                if(!c && this.opts.linebreaks) {
                    this.exec("formatblock", "div");
                    var d = this.getBlock(),
                        c = $('<div data-tagblock="">').html($(d).html());
                    $(d).replaceWith(c), $(c).css("text-align", a), this.removeEmptyAttr(c, "style"), "" == a && "undefined" != typeof $(c).data("tagblock") && $(c).replaceWith($(c).html())
                } else {
                    var e = this.getBlocks();
                    $.each(e, $.proxy(function(b, c) {
                        var d = !1;
                        d = -1 !== $.inArray(c.tagName, this.opts.alignmentTags) ? $(c) : $(c).closest(this.opts.alignmentTags.toString().toLowerCase(), this.$editor[0]), d && (d.css("text-align", a), this.removeEmptyAttr(d, "style"))
                    }, this))
                }
                this.selectionRestore(), this.sync()
            },
            cleanEmpty: function(a) {
                var b = this.placeholderStart(a);
                return b !== !1 ? b : (this.opts.linebreaks === !1 && ("" === a ? a = this.opts.emptyHtml : -1 !== a.search(/^<hr\s?\/?>$/gi) && (a = "<hr>" + this.opts.emptyHtml)), a)
            },
            cleanConverters: function(a) {
                return this.opts.convertDivs && !this.opts.gallery && (a = a.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, "<p$1>$2</p>")), this.opts.paragraphy && (a = this.cleanParagraphy(a)), a
            },
            cleanConvertProtected: function(a) {
                return this.opts.templateVars && (a = a.replace(/\{\{(.*?)\}\}/gi, "<!-- template double $1 -->"), a = a.replace(/\{(.*?)\}/gi, "<!-- template $1 -->")), a = a.replace(/<script(.*?)>([\w\W]*?)<\/script>/gi, '<title type="text/javascript" style="display: none;" class="redactor-script-tag"$1>$2</title>'), a = a.replace(/<style(.*?)>([\w\W]*?)<\/style>/gi, '<section$1 style="display: none;" rel="redactor-style-tag">$2</section>'), a = a.replace(/<form(.*?)>([\w\W]*?)<\/form>/gi, '<section$1 rel="redactor-form-tag">$2</section>'), a = this.opts.phpTags ? a.replace(/<\?php([\w\W]*?)\?>/gi, '<section style="display: none;" rel="redactor-php-tag">$1</section>') : a.replace(/<\?php([\w\W]*?)\?>/gi, "")
            },
            cleanReConvertProtected: function(a) {
                return this.opts.templateVars && (a = a.replace(/<!-- template double (.*?) -->/gi, "{{$1}}"), a = a.replace(/<!-- template (.*?) -->/gi, "{$1}")), a = a.replace(/<title type="text\/javascript" style="display: none;" class="redactor-script-tag"(.*?)>([\w\W]*?)<\/title>/gi, '<script$1 type="text/javascript">$2</script>'), a = a.replace(/<section(.*?) style="display: none;" rel="redactor-style-tag">([\w\W]*?)<\/section>/gi, "<style$1>$2</style>"), a = a.replace(/<section(.*?)rel="redactor-form-tag"(.*?)>([\w\W]*?)<\/section>/gi, "<form$1$2>$3</form>"), this.opts.phpTags && (a = a.replace(/<section style="display: none;" rel="redactor-php-tag">([\w\W]*?)<\/section>/gi, "<?php\r\n$1\r\n?>")), a
            },
            cleanRemoveSpaces: function(a, b) {
                if(b !== !1) {
                    var b = [],
                        c = a.match(/<(pre|style|script|title)(.*?)>([\w\W]*?)<\/(pre|style|script|title)>/gi);
                    if(null === c && (c = []), this.opts.phpTags) {
                        var d = a.match(/<\?php([\w\W]*?)\?>/gi);
                        d && (c = $.merge(c, d))
                    }
                    c && $.each(c, function(c, d) {
                        a = a.replace(d, "buffer_" + c), b.push(d)
                    })
                }
                return a = a.replace(/\n/g, " "), a = a.replace(/[\t]*/g, ""), a = a.replace(/\n\s*\n/g, "\n"), a = a.replace(/^[\s\n]*/g, " "), a = a.replace(/[\s\n]*$/g, " "), a = a.replace(/>\s{2,}</g, "> <"), a = this.cleanReplacer(a, b), a = a.replace(/\n\n/g, "\n")
            },
            cleanReplacer: function(a, b) {
                return b === !1 ? a : ($.each(b, function(b, c) {
                    a = a.replace("buffer_" + b, c)
                }), a)
            },
            cleanRemoveEmptyTags: function(a) {
                a = a.replace(/[\u200B-\u200D\uFEFF]/g, "");
                var b = ["<b>\\s*</b>", "<b>&nbsp;</b>", "<em>\\s*</em>"],
                    c = ["<pre></pre>", "<blockquote>\\s*</blockquote>", "<dd></dd>", "<dt></dt>", "<ul></ul>", "<ol></ol>", "<li></li>", "<table></table>", "<tr></tr>", "<span>\\s*<span>", "<span>&nbsp;<span>", "<p>\\s*</p>", "<p></p>", "<p>&nbsp;</p>", "<p>\\s*<br>\\s*</p>", "<div>\\s*</div>", "<div>\\s*<br>\\s*</div>"];
                c = this.opts.removeEmptyTags ? c.concat(b) : b;
                for(var d = c.length, e = 0; d > e; ++e) a = a.replace(new RegExp(c[e], "gi"), "");
                return a
            },
            cleanParagraphy: function(a) {
                function b(b, c, d) {
                    return a.replace(new RegExp(b, c), d)
                }
                if(a = $.trim(a), this.opts.linebreaks === !0) return a;
                if("" === a || "<p></p>" === a) return this.opts.emptyHtml;
                if(a += "\n", this.opts.removeEmptyTags === !1) return a;
                var c = [],
                    d = a.match(/<(table|div|pre|object)(.*?)>([\w\W]*?)<\/(table|div|pre|object)>/gi);
                d || (d = []);
                var e = a.match(/<!--([\w\W]*?)-->/gi);
                if(e && (d = $.merge(d, e)), this.opts.phpTags) {
                    var f = a.match(/<section(.*?)rel="redactor-php-tag">([\w\W]*?)<\/section>/gi);
                    f && (d = $.merge(d, f))
                }
                d && $.each(d, function(b, d) {
                    c[b] = d, a = a.replace(d, "{replace" + b + "}\n")
                }), a = a.replace(/<br \/>\s*<br \/>/gi, "\n\n"), a = a.replace(/<br><br>/gi, "\n\n");
                var g = "(comment|html|body|head|title|meta|style|script|link|iframe|table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|option|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)";
                a = b("(<" + g + "[^>]*>)", "gi", "\n$1"), a = b("(</" + g + ">)", "gi", "$1\n\n"), a = b("\r\n", "g", "\n"), a = b("\r", "g", "\n"), a = b("/\n\n+/", "g", "\n\n");
                var h = a.split(new RegExp("\ns*\n", "g"), -1);
                a = "";
                for(var i in h) h.hasOwnProperty(i) && (-1 == h[i].search("{replace") ? (h[i] = h[i].replace(/<p>\n\t?<\/p>/gi, ""), h[i] = h[i].replace(/<p><\/p>/gi, ""), "" != h[i] && (a += "<p>" + h[i].replace(/^\n+|\n+$/g, "") + "</p>")) : a += h[i]);
                return a = b("<p><p>", "gi", "<p>"), a = b("</p></p>", "gi", "</p>"), a = b("<p>s?</p>", "gi", ""), a = b("<p>([^<]+)</(div|address|form)>", "gi", "<p>$1</p></$2>"), a = b("<p>(</?" + g + "[^>]*>)</p>", "gi", "$1"), a = b("<p>(<li.+?)</p>", "gi", "$1"), a = b("<p>s?(</?" + g + "[^>]*>)", "gi", "$1"), a = b("(</?" + g + "[^>]*>)s?</p>", "gi", "$1"), a = b("(</?" + g + "[^>]*>)s?<br />", "gi", "$1"), a = b("<br />(s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)", "gi", "$1"), a = b("\n</p>", "gi", "</p>"), a = b("<li><p>", "gi", "<li>"), a = b("</p></li>", "gi", "</li>"), a = b("</li><p>", "gi", "</li>"), a = b("<p>	?\n?<p>", "gi", "<p>"), a = b("</dt><p>", "gi", "</dt>"), a = b("</dd><p>", "gi", "</dd>"), a = b("<br></p></blockquote>", "gi", "</blockquote>"), a = b("<p>	*</p>", "gi", ""), $.each(c, function(b, c) {
                    a = a.replace("{replace" + b + "}", c)
                }), $.trim(a)
            },
            cleanConvertInlineTags: function(a, b) {
                var c = "strong";
                "b" === this.opts.boldTag && (c = "b");
                var d = "em";
                return "i" === this.opts.italicTag && (d = "i"), a = a.replace(/<span style="font-style: italic;">([\w\W]*?)<\/span>/gi, "<" + d + ">$1</" + d + ">"), a = a.replace(/<span style="font-weight: bold;">([\w\W]*?)<\/span>/gi, "<" + c + ">$1</" + c + ">"), a = "strong" === this.opts.boldTag ? a.replace(/<b>([\w\W]*?)<\/b>/gi, "<strong>$1</strong>") : a.replace(/<strong>([\w\W]*?)<\/strong>/gi, "<b>$1</b>"), a = "em" === this.opts.italicTag ? a.replace(/<i>([\w\W]*?)<\/i>/gi, "<em>$1</em>") : a.replace(/<em>([\w\W]*?)<\/em>/gi, "<i>$1</i>"), a = a.replace(/<span style="text-decoration: underline;">([\w\W]*?)<\/span>/gi, "<u>$1</u>"), a = b !== !0 ? a.replace(/<strike>([\w\W]*?)<\/strike>/gi, "<del>$1</del>") : a.replace(/<del>([\w\W]*?)<\/del>/gi, "<strike>$1</strike>")
            },
            cleanStripTags: function(a) {
                if("" == a || "undefined" == typeof a) return a;
                var b = !1;
                this.opts.allowedTags !== !1 && (b = !0);
                var c = b === !0 ? this.opts.allowedTags : this.opts.deniedTags,
                    d = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
                return a = a.replace(d, function(a, d) {
                    return b === !0 ? $.inArray(d.toLowerCase(), c) > "-1" ? a : "" : $.inArray(d.toLowerCase(), c) > "-1" ? "" : a
                }), a = this.cleanConvertInlineTags(a)
            },
            cleanSavePreCode: function(a, b) {
                var c = a.match(/<(pre|code)(.*?)>([\w\W]*?)<\/(pre|code)>/gi);
                return null !== c && $.each(c, $.proxy(function(c, d) {
                    var e = d.match(/<(pre|code)(.*?)>([\w\W]*?)<\/(pre|code)>/i);
                    e[3] = e[3].replace(/&nbsp;/g, " "), b !== !1 && (e[3] = this.cleanEncodeEntities(e[3])), e[3] = e[3].replace(/\$/g, "&#36;"), a = a.replace(d, "<" + e[1] + e[2] + ">" + e[3] + "</" + e[1] + ">")
                }, this)), a
            },
            cleanEncodeEntities: function(a) {
                return a = String(a).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"'), a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
            },
            cleanUnverified: function() {
                var a = this.$editor.find("li, img, a, b, strong, sub, sup, i, em, u, small, strike, del, span, cite");
                a.filter('[style*="background-color: transparent;"][style*="line-height"]').css("background-color", "").css("line-height", ""), a.filter('[style*="background-color: transparent;"]').css("background-color", ""), a.css("line-height", ""), $.each(a, $.proxy(function(a, b) {
                    this.removeEmptyAttr(b, "style")
                }, this));
                var b = this.$editor.find("b, strong, i, em, u, strike, del");
                b.css("font-size", ""), $.each(b, $.proxy(function(a, b) {
                    this.removeEmptyAttr(b, "style")
                }, this)), this.$editor.find('div[style="text-align: -webkit-auto;"]').contents().unwrap(), this.$editor.find("ul, ol, li").removeAttr("style")
            },
            cleanHtml: function(a) {
                var b = 0,
                    c = a.length,
                    d = 0,
                    e = null,
                    f = null,
                    g = "",
                    h = "",
                    i = "";
                for(this.cleanlevel = 0; c > b; b++) {
                    if(d = b, -1 == a.substr(b).indexOf("<")) return h += a.substr(b), this.cleanFinish(h);
                    for(; c > d && "<" != a.charAt(d);) d++;
                    for(b != d && (i = a.substr(b, d - b), i.match(/^\s{2,}$/g) || ("\n" == h.charAt(h.length - 1) ? h += this.cleanGetTabs() : "\n" == i.charAt(0) && (h += "\n" + this.cleanGetTabs(), i = i.replace(/^\s+/, "")), h += i), i.match(/\n/) && (h += "\n" + this.cleanGetTabs())), e = d; c > d && ">" != a.charAt(d);) d++;
                    g = a.substr(e, d - e), b = d;
                    var j;
                    if("!--" == g.substr(1, 3)) {
                        if(!g.match(/--$/)) {
                            for(;
                                "-->" != a.substr(d, 3);) d++;
                            d += 2, g = a.substr(e, d - e), b = d
                        }
                        "\n" != h.charAt(h.length - 1) && (h += "\n"), h += this.cleanGetTabs(), h += g + ">\n"
                    } else "!" == g[1] ? h = this.placeTag(g + ">", h) : "?" == g[1] ? h += g + ">\n" : (j = g.match(/^<(script|style|pre)/i)) ? (j[1] = j[1].toLowerCase(), g = this.cleanTag(g), h = this.placeTag(g, h), f = String(a.substr(b + 1)).toLowerCase().indexOf("</" + j[1]), f && (i = a.substr(b + 1, f), b += f, h += i)) : (g = this.cleanTag(g), h = this.placeTag(g, h))
                }
                return this.cleanFinish(h)
            },
            cleanGetTabs: function() {
                for(var a = "", b = 0; b < this.cleanlevel; b++) a += "	";
                return a
            },
            cleanFinish: function(a) {
                return a = a.replace(/\n\s*\n/g, "\n"), a = a.replace(/^[\s\n]*/, ""), a = a.replace(/[\s\n]*$/, ""), a = a.replace(/<script(.*?)>\n<\/script>/gi, "<script$1></script>"), this.cleanlevel = 0, a
            },
            cleanTag: function(a) {
                var b = "";
                a = a.replace(/\n/g, " "), a = a.replace(/\s{2,}/g, " "), a = a.replace(/^\s+|\s+$/g, " ");
                var c = "";
                a.match(/\/$/) && (c = "/", a = a.replace(/\/+$/, ""));
                for(var d; d = /\s*([^= ]+)(?:=((['"']).*?\3|[^ ]+))?/.exec(a);) d[2] ? b += d[1].toLowerCase() + "=" + d[2] : d[1] && (b += d[1].toLowerCase()), b += " ", a = a.substr(d[0].length);
                return b.replace(/\s*$/, "") + c + ">"
            },
            placeTag: function(a, b) {
                var c = a.match(this.cleannewLevel);
                return(a.match(this.cleanlineBefore) || c) && (b = b.replace(/\s*$/, ""), b += "\n"), c && "/" == a.charAt(1) && this.cleanlevel--, "\n" == b.charAt(b.length - 1) && (b += this.cleanGetTabs()), c && "/" != a.charAt(1) && this.cleanlevel++, b += a, (a.match(this.cleanlineAfter) || a.match(this.cleannewLevel)) && (b = b.replace(/ *$/, ""), b += "\n"), b
            },
            formatEmpty: function(a) {
                var b = $.trim(this.$editor.html());
                if(this.opts.linebreaks) "" == b && (a.preventDefault(), this.$editor.html(""), this.focus());
                else {
                    b = b.replace(/<br\s?\/?>/i, "");
                    var c = b.replace(/<p>\s?<\/p>/gi, "");
                    if("" === b || "" === c) {
                        a.preventDefault();
                        var d = $(this.opts.emptyHtml).get(0);
                        this.$editor.html(d), this.focus()
                    }
                }
                this.sync()
            },
            formatBlocks: function(a) {
                this.browser("mozilla") && this.isFocused() && this.$editor.focus(), this.bufferSet();
                var b = this.getBlocks();
                this.selectionSave(), $.each(b, $.proxy(function(b, c) {
                    if("LI" !== c.tagName) {
                        var d = $(c).parent();
                        if("p" === a) {
                            if("P" === c.tagName && 0 != d.size() && "BLOCKQUOTE" === d[0].tagName || "BLOCKQUOTE" === c.tagName) return void this.formatQuote();
                            if(this.opts.linebreaks) {
                                if(!c || 0 != c.tagName.search(/H[1-6]/)) return;
                                $(c).replaceWith(c.innerHTML + "<br>")
                            } else this.formatBlock(a, c)
                        } else this.formatBlock(a, c)
                    }
                }, this)), this.selectionRestore(), this.sync()
            },
            formatBlock: function(a, b) {
                if(b === !1 && (b = this.getBlock()), b === !1 && this.opts.linebreaks === !0) return this.execCommand("formatblock", a), !0;
                var c = "";
                if("pre" !== a ? c = $(b).contents() : (c = $(b).html(), "" === $.trim(c) && (c = '<span id="selection-marker-1"></span>')), "PRE" === b.tagName && (a = "p"), this.opts.linebreaks === !0 && "p" === a) $(b).replaceWith($("<div>").append(c).html() + "<br>");
                else {
                    var d = this.getParent(),
                        e = $("<" + a + ">").append(c);
                    $(b).replaceWith(e), d && "TD" == d.tagName && $(e).wrapAll("<td>")
                }
            },
            formatChangeTag: function(a, b, c) {
                c !== !1 && this.selectionSave();
                var d = $("<" + b + "/>");
                return $(a).replaceWith(function() {
                    return d.append($(this).contents())
                }), c !== !1 && this.selectionRestore(), d
            },
            formatQuote: function() {
                if(this.browser("mozilla") && this.isFocused() && this.$editor.focus(), this.bufferSet(), this.opts.linebreaks === !1) {
                    this.selectionSave();
                    var a = this.getBlocks(),
                        b = !1,
                        c = a.length;
                    if(a) {
                        var d = "",
                            e = "",
                            f = !1,
                            g = !0;
                        if($.each(a, function(a, b) {
                                "P" !== b.tagName && (g = !1)
                            }), $.each(a, $.proxy(function(h, i) {
                                if("BLOCKQUOTE" === i.tagName) this.formatBlock("p", i, !1);
                                else if("P" === i.tagName)
                                    if(b = $(i).parent(), "BLOCKQUOTE" == b[0].tagName) {
                                        var j = $(b).children("p").size();
                                        1 == j ? $(b).replaceWith(i) : j == c ? (f = "blockquote", d += this.outerHtml(i)) : (f = "html", d += this.outerHtml(i), 0 == h ? ($(i).addClass("redactor-replaced").empty(), e = this.outerHtml(i)) : $(i).remove())
                                    } else g === !1 || 1 == a.length ? this.formatBlock("blockquote", i, !1) : (f = "paragraphs", d += this.outerHtml(i));
                                else "LI" !== i.tagName && this.formatBlock("blockquote", i, !1)
                            }, this)), f)
                            if("paragraphs" == f) $(a[0]).replaceWith("<blockquote>" + d + "</blockquote>"), $(a).remove();
                            else if("blockquote" == f) $(b).replaceWith(d);
                        else if("html" == f) {
                            var h = this.$editor.html().replace(e, "</blockquote>" + d + "<blockquote>");
                            this.$editor.html(h), this.$editor.find("blockquote").each(function() {
                                "" == $.trim($(this).html()) && $(this).remove()
                            })
                        }
                    }
                    this.selectionRestore()
                } else {
                    var i = this.getBlock();
                    if("BLOCKQUOTE" === i.tagName) {
                        this.selectionSave();
                        var h = $.trim($(i).html()),
                            j = $.trim(this.getSelectionHtml());
                        if(h = h.replace(/<span(.*?)id="selection-marker(.*?)<\/span>/gi, ""), h == j) $(i).replaceWith($(i).html() + "<br>");
                        else {
                            this.inlineFormat("tmp");
                            var k = this.$editor.find("tmp");
                            k.empty();
                            var l = this.$editor.html().replace("<tmp></tmp>", '</blockquote><span id="selection-marker-1">' + this.opts.invisibleSpace + "</span>" + j + "<blockquote>");
                            this.$editor.html(l), k.remove(), this.$editor.find("blockquote").each(function() {
                                "" == $.trim($(this).html()) && $(this).remove()
                            })
                        }
                        this.selectionRestore(), this.$editor.find("span#selection-marker-1").attr("id", !1)
                    } else {
                        var m = this.selectionWrap("blockquote"),
                            h = $(m).html(),
                            n = ["ul", "ol", "table", "tr", "tbody", "thead", "tfoot", "dl"];
                        $.each(n, function(a, b) {
                            h = h.replace(new RegExp("<" + b + "(.*?)>", "gi"), ""), h = h.replace(new RegExp("</" + b + ">", "gi"), "")
                        });
                        var o = this.opts.blockLevelElements;
                        $.each(o, function(a, b) {
                            h = h.replace(new RegExp("<" + b + "(.*?)>", "gi"), ""), h = h.replace(new RegExp("</" + b + ">", "gi"), "<br>")
                        }), $(m).html(h), this.selectionElement(m);
                        var p = $(m).next();
                        0 != p.size() && "BR" === p[0].tagName && p.remove()
                    }
                }
                this.sync()
            },
            blockRemoveAttr: function(a) {
                var b = this.getBlocks();
                $(b).removeAttr(a), this.sync()
            },
            blockSetAttr: function(a, b) {
                var c = this.getBlocks();
                $(c).attr(a, b), this.sync()
            },
            blockRemoveStyle: function(a) {
                var b = this.getBlocks();
                $(b).css(a, ""), this.removeEmptyAttr(b, "style"), this.sync()
            },
            blockSetStyle: function(a, b) {
                var c = this.getBlocks();
                $(c).css(a, b), this.sync()
            },
            blockRemoveClass: function(a) {
                var b = this.getBlocks();
                $(b).removeClass(a), this.removeEmptyAttr(b, "class"), this.sync()
            },
            blockSetClass: function(a) {
                var b = this.getBlocks();
                $(b).addClass(a), this.sync()
            },
            inlineRemoveClass: function(a) {
                this.selectionSave(), this.inlineEachNodes(function(b) {
                    $(b).removeClass(a), this.removeEmptyAttr(b, "class")
                }), this.selectionRestore(), this.sync()
            },
            inlineSetClass: function(a) {
                var b = this.getCurrent();
                $(b).hasClass(a) || this.inlineMethods("addClass", a)
            },
            inlineRemoveStyle: function(a) {
                this.selectionSave(), this.inlineEachNodes(function(b) {
                    $(b).css(a, ""), this.removeEmptyAttr(b, "style")
                }), this.selectionRestore(), this.sync()
            },
            inlineSetStyle: function(a, b) {
                this.inlineMethods("css", a, b)
            },
            inlineRemoveAttr: function(a) {
                this.selectionSave();
                var b = this.getRange(),
                    c = this.getElement(),
                    d = this.getNodes();
                (b.collapsed || b.startContainer === b.endContainer && c) && (d = $(c)), $(d).removeAttr(a), this.inlineUnwrapSpan(), this.selectionRestore(), this.sync()
            },
            inlineSetAttr: function(a, b) {
                this.inlineMethods("attr", a, b)
            },
            inlineMethods: function(a, b, c) {
                this.bufferSet(), this.selectionSave();
                var d = this.getRange(),
                    e = this.getElement();
                if(!d.collapsed && d.startContainer !== d.endContainer || !e || this.nodeTestBlocks(e)) {
                    this.document.execCommand("fontSize", !1, 4);
                    var f = this.$editor.find("font");
                    $.each(f, $.proxy(function(d, e) {
                        this.inlineSetMethods(a, e, b, c)
                    }, this))
                } else $(e)[a](b, c);
                this.selectionRestore(), this.sync()
            },
            inlineSetMethods: function(a, b, c, d) {
                var e, f = $(b).parent(),
                    g = this.getSelectionText(),
                    h = $(f).text(),
                    i = g == h;
                return i && f && "INLINE" === f[0].tagName && 0 != f[0].attributes.length ? (e = f, $(b).replaceWith($(b).html())) : (e = $("<inline>").append($(b).contents()), $(b).replaceWith(e)), $(e)[a](c, d), e
            },
            inlineEachNodes: function(a) {
                var b, c = this.getRange(),
                    d = this.getElement(),
                    e = this.getNodes();
                (c.collapsed || c.startContainer === c.endContainer && d) && (e = $(d), b = !0), $.each(e, $.proxy(function(c, d) {
                    if(!b && "INLINE" !== d.tagName) {
                        var e = this.getSelectionText(),
                            f = $(d).parent().text(),
                            g = e == f;
                        if(!g || "INLINE" !== d.parentNode.tagName || $(d.parentNode).hasClass("redactor_editor")) return;
                        d = d.parentNode
                    }
                    a.call(this, d)
                }, this))
            },
            inlineUnwrapSpan: function() {
                var a = this.$editor.find("inline");
                $.each(a, $.proxy(function(a, b) {
                    var c = $(b);
                    void 0 === c.attr("class") && void 0 === c.attr("style") && c.contents().unwrap()
                }, this))
            },
            inlineFormat: function(a) {
                this.selectionSave(), this.document.execCommand("fontSize", !1, 4);
                var b, c = this.$editor.find("font");
                $.each(c, function(c, d) {
                    var e = $("<" + a + "/>").append($(d).contents());
                    $(d).replaceWith(e), b = e
                }), this.selectionRestore(), this.sync()
            },
            inlineRemoveFormat: function(a) {
                this.selectionSave();
                var b = a.toUpperCase(),
                    c = this.getNodes(),
                    d = $(this.getParent()).parent();
                $.each(c, function(a, c) {
                    c.tagName === b && this.inlineRemoveFormatReplace(c)
                }), d && d[0].tagName === b && this.inlineRemoveFormatReplace(d), this.selectionRestore(), this.sync()
            },
            inlineRemoveFormatReplace: function(a) {
                $(a).replaceWith($(a).contents())
            },
            insertHtml: function(a, b) {
                var c = this.getCurrent(),
                    d = c.parentNode;
                this.focusWithSaveScroll(), this.bufferSet();
                var e = $("<div>").append($.parseHTML(a));
                a = e.html(), a = this.cleanRemoveEmptyTags(a), e = $("<div>").append($.parseHTML(a));
                var f = this.getBlock();
                if(1 == e.contents().length) {
                    var g = e.contents()[0].tagName;
                    ("P" != g && g == f.tagName || "PRE" == g) && (e = $("<div>").append(a))
                }
                this.opts.linebreaks && (a = a.replace(/<p(.*?)>([\w\W]*?)<\/p>/gi, "$2<br>")), !this.opts.linebreaks && 1 == e.contents().length && 3 == e.contents()[0].nodeType && (this.getRangeSelectedNodes().length > 2 || !c || "BODY" == c.tagName && !d || "HTML" == d.tagName) && (a = "<p>" + a + "</p>"), a = this.setSpansVerifiedHtml(a), e.contents().length > 1 && f || e.contents().is("p, :header, ul, ol, li, div, table, td, blockquote, pre, address, section, header, footer, aside, article") ? this.browser("msie") ? this.isIe11() ? this.execPasteFrag(a) : this.document.selection.createRange().pasteHTML(a) : this.document.execCommand("inserthtml", !1, a) : this.insertHtmlAdvanced(a, !1), this.selectall && this.window.setTimeout($.proxy(function() {
                    this.opts.linebreaks ? this.focusEnd() : this.selectionEnd(this.$editor.contents().last())
                }, this), 1), this.observeStart(), this.setNonEditable(), b !== !1 && this.sync()
            },
            insertHtmlAdvanced: function(a, b) {
                a = this.setSpansVerifiedHtml(a);
                var c = this.getSelection();
                if(c.getRangeAt && c.rangeCount) {
                    var d = c.getRangeAt(0);
                    d.deleteContents();
                    var e = this.document.createElement("div");
                    e.innerHTML = a;
                    for(var f, g, h = this.document.createDocumentFragment(); f = e.firstChild;) g = h.appendChild(f);
                    d.insertNode(h), g && (d = d.cloneRange(), d.setStartAfter(g), d.collapse(!0), c.removeAllRanges(), c.addRange(d))
                }
                b !== !1 && this.sync()
            },
            insertBeforeCursor: function(a) {
                a = this.setSpansVerifiedHtml(a);
                var b = $(a),
                    c = document.createElement("span");
                c.innerHTML = "​";
                var d = this.getRange();
                d.insertNode(c), d.insertNode(b[0]), d.collapse(!1);
                var e = this.getSelection();
                e.removeAllRanges(), e.addRange(d), this.sync()
            },
            insertText: function(a) {
                var b = $($.parseHTML(a));
                b.length && (a = b.text()), this.focusWithSaveScroll(), this.browser("msie") ? this.isIe11() ? this.execPasteFrag(a) : this.document.selection.createRange().pasteHTML(a) : this.document.execCommand("inserthtml", !1, a), this.sync()
            },
            insertNode: function(a) {
                if(a = a[0] || a, "SPAN" == a.tagName) {
                    var b = "inline",
                        c = a.outerHTML,
                        d = new RegExp("<" + a.tagName, "i"),
                        e = c.replace(d, "<" + b);
                    d = new RegExp("</" + a.tagName, "i"), e = e.replace(d, "</" + b), a = $(e)[0]
                }
                var f, g = this.getSelection();
                return g.getRangeAt && g.rangeCount && (f = g.getRangeAt(0), f.deleteContents(), f.insertNode(a), f.setEndAfter(a), f.setStartAfter(a), g.removeAllRanges(), g.addRange(f)), a
            },
            insertNodeToCaretPositionFromPoint: function(a, b) {
                var c, d = a.clientX,
                    e = a.clientY;
                if(this.document.caretPositionFromPoint) {
                    var f = this.document.caretPositionFromPoint(d, e);
                    c = this.getRange(), c.setStart(f.offsetNode, f.offset), c.collapse(!0), c.insertNode(b)
                } else if(this.document.caretRangeFromPoint) c = this.document.caretRangeFromPoint(d, e), c.insertNode(b);
                else if("undefined" != typeof document.body.createTextRange) {
                    c = this.document.body.createTextRange(), c.moveToPoint(d, e);
                    var g = c.duplicate();
                    g.moveToPoint(d, e), c.setEndPoint("EndToEnd", g), c.select()
                }
            },
            insertAfterLastElement: function(a, b) {
                if("undefined" != typeof b && (a = b), this.isEndOfElement()) {
                    if(this.opts.linebreaks) {
                        var c = $("<div>").append($.trim(this.$editor.html())).contents(),
                            d = c.last()[0];
                        if("SPAN" == d.tagName && "" == d.innerHTML && (d = c.prev()[0]), this.outerHtml(d) != this.outerHtml(a)) return !1
                    } else if(this.$editor.contents().last()[0] !== a) return !1;
                    this.insertingAfterLastElement(a)
                }
            },
            insertingAfterLastElement: function(a) {
                if(this.bufferSet(), this.opts.linebreaks === !1) {
                    var b = $(this.opts.emptyHtml);
                    $(a).after(b), this.selectionStart(b)
                } else {
                    var b = $('<span id="selection-marker-1">' + this.opts.invisibleSpace + "</span>", this.document)[0];
                    $(a).after(b), $(b).after(this.opts.invisibleSpace), this.selectionRestore(), this.$editor.find("span#selection-marker-1").removeAttr("id")
                }
            },
            insertLineBreak: function(a) {
                this.selectionSave();
                var b = "<br>";
                if(1 == a && (b = "<br><br>"), this.browser("mozilla")) {
                    var c = $("<span>").html(this.opts.invisibleSpace);
                    this.$editor.find("#selection-marker-1").before(b).before(c).before(this.opts.invisibleSpace), this.setCaretAfter(c[0]), c.remove(), this.selectionRemoveMarkers()
                } else {
                    var d = this.getParent();
                    if(d && "A" === d.tagName) {
                        var e = this.getCaretOffset(d),
                            f = $.trim($(d).text()).replace(/\n\r\n/g, ""),
                            g = f.length;
                        if(e == g) {
                            this.selectionRemoveMarkers();
                            var h = $('<span id="selection-marker-1">' + this.opts.invisibleSpace + "</span>", this.document)[0];
                            return $(d).after(h), $(h).before(b + (this.browser("webkit") ? this.opts.invisibleSpace : "")), this.selectionRestore(), !0
                        }
                    }
                    this.$editor.find("#selection-marker-1").before(b + (this.browser("webkit") ? this.opts.invisibleSpace : "")), this.selectionRestore()
                }
            },
            insertDoubleLineBreak: function() {
                this.insertLineBreak(!0)
            },
            replaceLineBreak: function(a) {
                var b = $("<br>" + this.opts.invisibleSpace);
                $(a).replaceWith(b), this.selectionStart(b)
            },
            pasteClean: function(a) {
                if(a = this.callback("pasteBefore", !1, a), this.browser("msie")) {
                    var b = $.trim(a);
                    0 == b.search(/^<a(.*?)>(.*?)<\/a>$/i) && (a = a.replace(/^<a(.*?)>(.*?)<\/a>$/i, "$2"))
                }
                if(this.opts.pastePlainText) {
                    var b = this.document.createElement("div");
                    return a = a.replace(/<br>|<\/H[1-6]>|<\/p>|<\/div>/gi, "\n"), b.innerHTML = a, a = b.textContent || b.innerText, a = $.trim(a), a = a.replace("\n", "<br>"), a = this.cleanParagraphy(a), this.pasteInsert(a), !1
                }
                var c = !1;
                if(this.currentOrParentIs("TD")) {
                    c = !0;
                    var d = this.opts.blockLevelElements;
                    d.push("tr"), d.push("table"), $.each(d, function(b, c) {
                        a = a.replace(new RegExp("<" + c + "(.*?)>", "gi"), ""), a = a.replace(new RegExp("</" + c + ">", "gi"), "<br>")
                    })
                }
                if(this.currentOrParentIs("PRE")) return a = this.pastePre(a), this.pasteInsert(a), !0;
                if(a = a.replace(/<img(.*?)v:shapes=(.*?)>/gi, ""), a = a.replace(/<p(.*?)class="MsoListParagraphCxSpFirst"([\w\W]*?)<\/p>/gi, "<ul><li$2</li>"), a = a.replace(/<p(.*?)class="MsoListParagraphCxSpMiddle"([\w\W]*?)<\/p>/gi, "<li$2</li>"), a = a.replace(/<p(.*?)class="MsoListParagraphCxSpLast"([\w\W]*?)<\/p>/gi, "<li$2</li></ul>"), a = a.replace(/<p(.*?)class="MsoListParagraph"([\w\W]*?)<\/p>/gi, "<ul><li$2</li></ul>"), a = a.replace(/·/g, ""), a = a.replace(/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi, ""), this.opts.cleanSpaces === !0 && (a = a.replace(/(&nbsp;){2,}/gi, "&nbsp;"), a = a.replace(/&nbsp;/gi, " ")), a = a.replace(/<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi, "$2"), a = a.replace(/<b(.*?)id="docs-internal-guid(.*?)">([\w\W]*?)<\/b>/gi, "$3"), a = a.replace(/<span[^>]*(font-style: italic; font-weight: bold|font-weight: bold; font-style: italic)[^>]*>/gi, '<span style="font-weight: bold;"><span style="font-style: italic;">'), a = a.replace(/<span[^>]*font-style: italic[^>]*>/gi, '<span style="font-style: italic;">'), a = a.replace(/<span[^>]*font-weight: bold[^>]*>/gi, '<span style="font-weight: bold;">'), a = a.replace(/<span[^>]*text-decoration: underline[^>]*>/gi, '<span style="text-decoration: underline;">'), a = a.replace(/<td>\u200b*<\/td>/gi, "[td]"), a = a.replace(/<td>&nbsp;<\/td>/gi, "[td]"), a = a.replace(/<td><br><\/td>/gi, "[td]"), a = a.replace(/<td(.*?)colspan="(.*?)"(.*?)>([\w\W]*?)<\/td>/gi, '[td colspan="$2"]$4[/td]'), a = a.replace(/<td(.*?)rowspan="(.*?)"(.*?)>([\w\W]*?)<\/td>/gi, '[td rowspan="$2"]$4[/td]'), a = a.replace(/<a(.*?)href="(.*?)"(.*?)>([\w\W]*?)<\/a>/gi, '[a href="$2"]$4[/a]'), a = a.replace(/<iframe(.*?)>([\w\W]*?)<\/iframe>/gi, "[iframe$1]$2[/iframe]"), a = a.replace(/<video(.*?)>([\w\W]*?)<\/video>/gi, "[video$1]$2[/video]"), a = a.replace(/<audio(.*?)>([\w\W]*?)<\/audio>/gi, "[audio$1]$2[/audio]"), a = a.replace(/<embed(.*?)>([\w\W]*?)<\/embed>/gi, "[embed$1]$2[/embed]"), a = a.replace(/<object(.*?)>([\w\W]*?)<\/object>/gi, "[object$1]$2[/object]"), a = a.replace(/<param(.*?)>/gi, "[param$1]"), a = a.replace(/<img(.*?)>/gi, "[img$1]"), a = a.replace(/ class="(.*?)"/gi, ""), a = a.replace(/<(\w+)([\w\W]*?)>/gi, "<$1>"), this.opts.linebreaks ? (a = a.replace(/<strong><\/strong>/gi, ""), a = a.replace(/<u><\/u>/gi, ""), this.opts.cleanFontTag && (a = a.replace(/<font(.*?)>([\w\W]*?)<\/font>/gi, "$2")), a = a.replace(/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi, "<br>")) : a = a.replace(/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi, ""), a = a.replace(/<div>\s*?\t*?\n*?(<ul>|<ol>|<p>)/gi, "$1"), a = a.replace(/\[td colspan="(.*?)"\]([\w\W]*?)\[\/td\]/gi, '<td colspan="$1">$2</td>'), a = a.replace(/\[td rowspan="(.*?)"\]([\w\W]*?)\[\/td\]/gi, '<td rowspan="$1">$2</td>'), a = a.replace(/\[td\]/gi, "<td>&nbsp;</td>"), a = a.replace(/\[a href="(.*?)"\]([\w\W]*?)\[\/a\]/gi, '<a href="$1">$2</a>'), a = a.replace(/\[iframe(.*?)\]([\w\W]*?)\[\/iframe\]/gi, "<iframe$1>$2</iframe>"), a = a.replace(/\[video(.*?)\]([\w\W]*?)\[\/video\]/gi, "<video$1>$2</video>"), a = a.replace(/\[audio(.*?)\]([\w\W]*?)\[\/audio\]/gi, "<audio$1>$2</audio>"), a = a.replace(/\[embed(.*?)\]([\w\W]*?)\[\/embed\]/gi, "<embed$1>$2</embed>"), a = a.replace(/\[object(.*?)\]([\w\W]*?)\[\/object\]/gi, "<object$1>$2</object>"), a = a.replace(/\[param(.*?)\]/gi, "<param$1>"), a = a.replace(/\[img(.*?)\]/gi, "<img$1>"), this.opts.convertDivs ? (a = a.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, "<p>$2</p>"), a = a.replace(/<\/div><p>/gi, "<p>"), a = a.replace(/<\/p><\/div>/gi, "</p>"), a = a.replace(/<p><\/p>/gi, "<br />")) : a = a.replace(/<div><\/div>/gi, "<br />"), a = this.cleanStripTags(a), this.currentOrParentIs("LI") ? a = a.replace(/<p>([\w\W]*?)<\/p>/gi, "$1<br>") : c === !1 && (a = this.cleanParagraphy(a)), a = a.replace(/<span(.*?)>([\w\W]*?)<\/span>/gi, "$2"), a = a.replace(/<img>/gi, ""), a = a.replace(/<[^\/>][^>][^img|param|source|td][^<]*>(\s*|\t*|\n*| |<br>)<\/[^>]+>/gi, ""), a = a.replace(/\n{3,}/gi, "\n"), a = a.replace(/<p><p>/gi, "<p>"), a = a.replace(/<\/p><\/p>/gi, "</p>"), a = a.replace(/<li>(\s*|\t*|\n*)<p>/gi, "<li>"), a = a.replace(/<\/p>(\s*|\t*|\n*)<\/li>/gi, "</li>"), this.opts.linebreaks === !0 && (a = a.replace(/<p(.*?)>([\w\W]*?)<\/p>/gi, "$2<br>")), a = a.replace(/<[^\/>][^>][^img|param|source|td][^<]*>(\s*|\t*|\n*| |<br>)<\/[^>]+>/gi, ""), a = a.replace(/<img src="webkit-fake-url\:\/\/(.*?)"(.*?)>/gi, ""), a = a.replace(/<td(.*?)>(\s*|\t*|\n*)<p>([\w\W]*?)<\/p>(\s*|\t*|\n*)<\/td>/gi, "<td$1>$3</td>"), this.opts.convertDivs && (a = a.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, "$2"), a = a.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, "$2")), this.pasteClipboardMozilla = !1, this.browser("mozilla")) {
                    if(this.opts.clipboardUpload) {
                        var e = a.match(/<img src="data:image(.*?)"(.*?)>/gi);
                        if(null !== e) {
                            this.pasteClipboardMozilla = e;
                            for(k in e) {
                                var f = e[k].replace("<img", '<img data-mozilla-paste-image="' + k + '" ');
                                a = a.replace(e[k], f)
                            }
                        }
                    }
                    for(;
                        /<br>$/gi.test(a);) a = a.replace(/<br>$/gi, "")
                }
                if(a = a.replace(/<p>•([\w\W]*?)<\/p>/gi, "<li>$1</li>"), this.browser("msie"))
                    for(;
                        /<font>([\w\W]*?)<\/font>/gi.test(a);) a = a.replace(/<font>([\w\W]*?)<\/font>/gi, "$1");
                c === !1 && (a = a.replace(/<td(.*?)>([\w\W]*?)<p(.*?)>([\w\W]*?)<\/td>/gi, "<td$1>$2$4</td>"), a = a.replace(/<td(.*?)>([\w\W]*?)<\/p>([\w\W]*?)<\/td>/gi, "<td$1>$2$3</td>"), a = a.replace(/<td(.*?)>([\w\W]*?)<p(.*?)>([\w\W]*?)<\/td>/gi, "<td$1>$2$4</td>"), a = a.replace(/<td(.*?)>([\w\W]*?)<\/p>([\w\W]*?)<\/td>/gi, "<td$1>$2$3</td>")), a = a.replace(/\n/g, " "), a = a.replace(/<p>\n?<li>/gi, "<li>"), this.pasteInsert(a)
            },
            pastePre: function(a) {
                a = a.replace(/<br>|<\/H[1-6]>|<\/p>|<\/div>/gi, "\n");
                var b = this.document.createElement("div");
                return b.innerHTML = a, this.cleanEncodeEntities(b.textContent || b.innerText)
            },
            pasteInsert: function(a) {
                a = this.callback("pasteAfter", !1, a), this.selectall ? (this.$editor.html(a), this.selectionRemove(), this.focusEnd(), this.sync()) : this.insertHtml(a), this.selectall = !1, setTimeout($.proxy(function() {
                    this.rtePaste = !1, this.browser("mozilla") && this.$editor.find("p:empty").remove(), this.pasteClipboardMozilla !== !1 && this.pasteClipboardUploadMozilla()
                }, this), 100), this.opts.autoresize && this.fullscreen !== !0 ? $(this.document.body).scrollTop(this.saveScroll) : this.$editor.scrollTop(this.saveScroll)
            },
            pasteClipboardAppendFields: function(a) {
                return this.opts.uploadFields !== !1 && "object" == typeof this.opts.uploadFields && $.each(this.opts.uploadFields, $.proxy(function(b, c) {
                    null != c && 0 === c.toString().indexOf("#") && (c = $(c).val()), a[b] = c
                }, this)), a
            },
            pasteClipboardUploadMozilla: function() {
                var a = this.$editor.find("img[data-mozilla-paste-image]");
                $.each(a, $.proxy(function(a, b) {
                    var c = $(b),
                        d = b.src.split(","),
                        e = {
                            contentType: d[0].split(";")[0].split(":")[1],
                            data: d[1]
                        };
                    e = this.pasteClipboardAppendFields(e), $.post(this.opts.clipboardUploadUrl, e, $.proxy(function(a) {
                        var b = "string" == typeof a ? $.parseJSON(a) : a;
                        c.attr("src", b.filelink), c.removeAttr("data-mozilla-paste-image"), this.sync(), this.callback("imageUpload", c, b)
                    }, this))
                }, this))
            },
            pasteClipboardUpload: function(a) {
                var b = a.target.result,
                    c = b.split(","),
                    d = {
                        contentType: c[0].split(";")[0].split(":")[1],
                        data: c[1]
                    };
                this.opts.clipboardUpload ? (d = this.pasteClipboardAppendFields(d), $.post(this.opts.clipboardUploadUrl, d, $.proxy(function(a) {
                    var b = "string" == typeof a ? $.parseJSON(a) : a,
                        c = '<img src="' + b.filelink + '" id="clipboard-image-marker" />';
                    this.execCommand("inserthtml", c, !1);
                    var d = $(this.$editor.find("img#clipboard-image-marker"));
                    d.length ? d.removeAttr("id") : d = !1, this.sync(), d && this.callback("imageUpload", d, b)
                }, this))) : this.insertHtml('<img src="' + b + '" />')
            },
            bufferSet: function(a) {
                a !== !1 && this.selectionSave(), this.opts.buffer.push(this.$editor.html()), a !== !1 && this.selectionRemoveMarkers("buffer")
            },
            bufferUndo: function() {
                return 0 === this.opts.buffer.length ? void this.focusWithSaveScroll() : (this.selectionSave(), this.opts.rebuffer.push(this.$editor.html()), this.selectionRestore(!1, !0), this.$editor.html(this.opts.buffer.pop()), this.selectionRestore(), void setTimeout($.proxy(this.observeStart, this), 100))
            },
            bufferRedo: function() {
                return 0 === this.opts.rebuffer.length ? (this.focusWithSaveScroll(), !1) : (this.selectionSave(), this.opts.buffer.push(this.$editor.html()), this.selectionRestore(!1, !0), this.$editor.html(this.opts.rebuffer.pop()), this.selectionRestore(!0), void setTimeout($.proxy(this.observeStart, this), 4))
            },
            observeStart: function() {
                this.observeImages(), this.opts.observeLinks && this.observeLinks()
            },
            observeLinks: function() {
                this.$editor.find("a").on("click", $.proxy(this.linkObserver, this)), this.$editor.on("click.redactor", $.proxy(function(a) {
                    this.linkObserverTooltipClose(a)
                }, this)), $(document).on("click.redactor", $.proxy(function(a) {
                    this.linkObserverTooltipClose(a)
                }, this))
            },
            observeImages: function() {
                return this.opts.observeImages === !1 ? !1 : (this.$editor.find("img").each($.proxy(function(a, b) {
                    this.browser("msie") && $(b).attr("unselectable", "on");
                    var c = $(b).parent();
                    c.hasClass("royalSlider") || c.hasClass("fotorama") || this.imageResize(b)
                }, this)), void this.$editor.find(".fotorama, .royalSlider").on("click", $.proxy(this.editGallery, this)))
            },
            linkObserver: function(a) {
                var b = $(a.target),
                    c = $(a.target).parent();
                if(!c.hasClass("royalSlider") && !c.hasClass("fotorama") && 0 != b.size() && "A" === b[0].tagName) {
                    var d = b.offset();
                    if(this.opts.iframe) {
                        var e = this.$frame.offset();
                        d.top = e.top + (d.top - $(this.document).scrollTop()), d.left += e.left
                    }
                    var f = $('<span class="redactor-link-tooltip"></span>'),
                        g = b.attr("href");
                    void 0 === g && (g = ""), g.length > 24 && (g = g.substring(0, 24) + "...");
                    var h = $('<a href="' + b.attr("href") + '" target="_blank">' + g + "</a>").on("click", $.proxy(function() {
                            this.linkObserverTooltipClose(!1)
                        }, this)),
                        i = $('<a href="#">' + this.opts.curLang.edit + "</a>").on("click", $.proxy(function(a) {
                            a.preventDefault(), this.linkShow(), this.linkObserverTooltipClose(!1)
                        }, this)),
                        j = $('<a href="#">' + this.opts.curLang.unlink + "</a>").on("click", $.proxy(function(a) {
                            a.preventDefault(), this.execCommand("unlink"), this.linkObserverTooltipClose(!1)
                        }, this));
                    f.append(h), f.append(" | "), f.append(i), f.append(" | "), f.append(j), f.css({
                        top: d.top + 20 + "px",
                        left: d.left + "px"
                    }), $(".redactor-link-tooltip").remove(), $("body").append(f)
                }
            },
            linkObserverTooltipClose: function(a) {
                return a !== !1 && "A" == a.target.tagName ? !1 : void $(".redactor-link-tooltip").remove()
            },
            getSelection: function() {
                return this.opts.rangy ? this.opts.iframe ? rangy.getSelection(this.$frame[0]) : rangy.getSelection() : this.document.getSelection()
            },
            getRange: function() {
                if(this.opts.rangy) return this.opts.iframe ? rangy.createRange(this.iframeDoc()) : rangy.createRange();
                if(this.document.getSelection) {
                    var a = this.getSelection();
                    if(a.getRangeAt && a.rangeCount) return a.getRangeAt(0)
                }
                return this.document.createRange()
            },
            selectionElement: function(a) {
                this.setCaret(a)
            },
            selectionStart: function(a) {
                this.selectionSet(a[0] || a, 0, null, 0)
            },
            selectionEnd: function(a) {
                this.selectionSet(a[0] || a, 1, null, 1)
            },
            selectionSet: function(a, b, c, d) {
                null == c && (c = a), null == d && (d = b);
                var e = this.getSelection();
                if(e) {
                    if("P" == a.tagName && "" == a.innerHTML && (a.innerHTML = this.opts.invisibleSpace), "BR" == a.tagName && this.opts.linebreaks === !1) {
                        var f = $(this.opts.emptyHtml)[0];
                        $(a).replaceWith(f), a = f, c = a
                    }
                    var g = this.getRange();
                    g.setStart(a, b), g.setEnd(c, d);
                    try {
                        e.removeAllRanges()
                    } catch(h) {}
                    e.addRange(g)
                }
            },
            selectionWrap: function(a) {
                a = a.toLowerCase();
                var b = this.getBlock();
                if(b) {
                    var c = this.formatChangeTag(b, a);
                    return this.sync(), c
                }
                var d = this.getSelection(),
                    e = d.getRangeAt(0),
                    c = document.createElement(a);
                return c.appendChild(e.extractContents()), e.insertNode(c), this.selectionElement(c), c
            },
            selectionAll: function() {
                var a = this.getRange();
                a.selectNodeContents(this.$editor[0]);
                var b = this.getSelection();
                b.removeAllRanges(), b.addRange(a)
            },
            selectionRemove: function() {
                this.getSelection().removeAllRanges()
            },
            getCaretOffset: function(a) {
                var b = 0,
                    c = this.getRange(),
                    d = c.cloneRange();
                return d.selectNodeContents(a), d.setEnd(c.endContainer, c.endOffset), b = $.trim(d.toString()).length
            },
            getCaretOffsetRange: function() {
                return new Range(this.getSelection().getRangeAt(0))
            },
            setCaret: function(a, b, c) {
                "undefined" == typeof c && (c = b), a = a[0] || a;
                var d = this.getRange();
                d.selectNodeContents(a);
                var e, f = this.getTextNodesIn(a),
                    g = !1,
                    h = 0;
                if(1 == f.length && b) d.setStart(f[0], b), d.setEnd(f[0], c);
                else
                    for(var i, j = 0; i = f[j++];) {
                        if(e = h + i.length, !g && b >= h && (e > b || b == e && j < f.length) && (d.setStart(i, b - h), g = !0), g && e >= c) {
                            d.setEnd(i, c - h);
                            break
                        }
                        h = e
                    }
                var k = this.getSelection();
                k.removeAllRanges(), k.addRange(d)
            },
            setCaretAfter: function(a) {
                this.$editor.focus(), a = a[0] || a;
                var b = this.document.createRange(),
                    c = 1,
                    d = -1;
                b.setStart(a, c), b.setEnd(a, d + 2);
                var e = this.window.getSelection(),
                    f = this.document.createRange(),
                    g = this.document.createTextNode("​");
                $(a).after(g), f.setStartAfter(g), e.removeAllRanges(), e.addRange(f), $(g).remove()
            },
            getTextNodesIn: function(a) {
                var b = [];
                if(3 == a.nodeType) b.push(a);
                else
                    for(var c = a.childNodes, d = 0, e = c.length; e > d; ++d) b.push.apply(b, this.getTextNodesIn(c[d]));
                return b
            },
            getCurrent: function() {
                var a = !1,
                    b = this.getSelection();
                return b && b.rangeCount > 0 && (a = b.getRangeAt(0).startContainer), this.isParentRedactor(a)
            },
            getParent: function(a) {
                return a = a || this.getCurrent(), a ? this.isParentRedactor($(a).parent()[0]) : !1
            },
            getBlock: function(a) {
                for("undefined" == typeof a && (a = this.getCurrent()); a;) {
                    if(this.nodeTestBlocks(a)) return $(a).hasClass("redactor_editor") ? !1 : a;
                    a = a.parentNode
                }
                return !1
            },
            getBlocks: function(a) {
                var b = [];
                if("undefined" == typeof a) {
                    var c = this.getRange();
                    if(c && c.collapsed === !0) return [this.getBlock()];
                    var a = this.getNodes(c)
                }
                return $.each(a, $.proxy(function(a, c) {
                    return this.opts.iframe === !1 && 0 == $(c).parents("div.redactor_editor").size() ? !1 : void(this.nodeTestBlocks(c) && b.push(c))
                }, this)), 0 === b.length && (b = [this.getBlock()]), b
            },
            isInlineNode: function(a) {
                return 1 != a.nodeType ? !1 : !this.rTestBlock.test(a.nodeName)
            },
            nodeTestBlocks: function(a) {
                return 1 == a.nodeType && this.rTestBlock.test(a.nodeName)
            },
            tagTestBlock: function(a) {
                return this.rTestBlock.test(a)
            },
            getNodes: function(a, b) {
                if("undefined" == typeof a || 0 == a) var a = this.getRange();
                if(a && a.collapsed === !0) {
                    if("undefined" == typeof b && this.tagTestBlock(b)) {
                        var c = this.getBlock();
                        return c.tagName == b ? [c] : []
                    }
                    return [this.getCurrent()]
                }
                var d = [],
                    e = [],
                    f = this.document.getSelection();
                if(f.isCollapsed || (d = this.getRangeSelectedNodes(f.getRangeAt(0))), $.each(d, $.proxy(function(a, c) {
                        return this.opts.iframe === !1 && 0 == $(c).parents("div.redactor_editor").size() ? !1 : void("undefined" == typeof b ? "" != $.trim(c.textContent) && e.push(c) : c.tagName == b && e.push(c))
                    }, this)), 0 == e.length) {
                    if("undefined" == typeof b && this.tagTestBlock(b)) {
                        var c = this.getBlock();
                        return c.tagName == b ? e.push(c) : []
                    }
                    e.push(this.getCurrent())
                }
                var g = e[e.length - 1];
                return this.nodeTestBlocks(g) && (e = e.slice(0, -1)), e
            },
            getElement: function(a) {
                for(a || (a = this.getCurrent()); a;) {
                    if(1 == a.nodeType) return $(a).hasClass("redactor_editor") ? !1 : a;
                    a = a.parentNode
                }
                return !1
            },
            getRangeSelectedNodes: function(a) {
                a = a || this.getRange();
                var b = a.startContainer,
                    c = a.endContainer;
                if(b == c) return [b];
                for(var d = []; b && b != c;) d.push(b = this.nextNode(b));
                for(b = a.startContainer; b && b != a.commonAncestorContainer;) d.unshift(b), b = b.parentNode;
                return d
            },
            nextNode: function(a) {
                if(a.hasChildNodes()) return a.firstChild;
                for(; a && !a.nextSibling;) a = a.parentNode;
                return a ? a.nextSibling : null
            },
            getSelectionText: function() {
                return this.getSelection().toString()
            },
            getSelectionHtml: function() {
                var a = "",
                    b = this.getSelection();
                if(b.rangeCount) {
                    for(var c = this.document.createElement("div"), d = b.rangeCount, e = 0; d > e; ++e) c.appendChild(b.getRangeAt(e).cloneContents());
                    a = c.innerHTML
                }
                return this.syncClean(a)
            },
            selectionSave: function() {
                this.isFocused() || this.focusWithSaveScroll(), this.opts.rangy ? this.savedSel = rangy.saveSelection() : this.selectionCreateMarker(this.getRange())
            },
            selectionCreateMarker: function(a) {
                if(a) {
                    var b = $('<span id="selection-marker-1" class="redactor-selection-marker">' + this.opts.invisibleSpace + "</span>", this.document)[0],
                        c = $('<span id="selection-marker-2" class="redactor-selection-marker">' + this.opts.invisibleSpace + "</span>", this.document)[0];
                    a.collapsed === !0 ? this.selectionSetMarker(a, b, !0) : (this.selectionSetMarker(a, b, !0), this.selectionSetMarker(a, c, !1)), this.savedSel = this.$editor.html(), this.selectionRestore(!1, !1)
                }
            },
            selectionSetMarker: function(a, b, c) {
                var d = a.cloneRange();
                try {
                    d.collapse(c), d.insertNode(b), d.detach()
                } catch(e) {
                    var f = this.opts.emptyHtml;
                    this.opts.linebreaks && (f = "<br>"), this.$editor.prepend(f), this.focus()
                }
            },
            selectionRestore: function(a, b) {
                if(this.opts.rangy) rangy.restoreSelection(this.savedSel);
                else {
                    a === !0 && this.savedSel && this.$editor.html(this.savedSel);
                    var c = this.$editor.find("span#selection-marker-1"),
                        d = this.$editor.find("span#selection-marker-2");
                    this.browser("mozilla") ? this.$editor.focus() : this.isFocused() || this.focusWithSaveScroll(), 0 != c.length && 0 != d.length ? this.selectionSet(c[0], 0, d[0], 0) : 0 != c.length && this.selectionSet(c[0], 0, null, 0), b !== !1 && (this.selectionRemoveMarkers(), this.savedSel = !1)
                }
            },
            selectionRemoveMarkers: function() {
                this.opts.rangy ? rangy.removeMarkers(this.savedSel) : $.each(this.$editor.find("span.redactor-selection-marker"), function() {
                    var a = $.trim($(this).html().replace(/[^\u0000-\u1C7F]/g, ""));
                    "" == a ? $(this).remove() : $(this).removeAttr("class").removeAttr("id")
                })
            },
            tableShow: function() {
                this.selectionSave(), this.modalInit(this.opts.curLang.table, this.opts.modal_table, 300, $.proxy(function() {
                    $("#redactor_insert_table_btn").click($.proxy(this.tableInsert, this)), setTimeout(function() {
                        $("#redactor_table_rows").focus()
                    }, 200)
                }, this))
            },
            tableInsert: function() {
                this.bufferSet(!1);
                var a, b, c, d, e = $("#redactor_table_rows").val(),
                    f = $("#redactor_table_columns").val(),
                    g = $("<div></div>"),
                    h = Math.floor(99999 * Math.random()),
                    i = $('<table id="table' + h + '"><tbody></tbody></table>');
                for(a = 0; e > a; a++) {
                    for(b = $("<tr></tr>"), c = 0; f > c; c++) d = $("<td>" + this.opts.invisibleSpace + "</td>"), 0 === a && 0 === c && d.append('<span id="selection-marker-1">' + this.opts.invisibleSpace + "</span>"), $(b).append(d);
                    i.append(b)
                }
                g.append(i);
                var j = g.html();
                this.opts.linebreaks === !1 && this.browser("mozilla") && (j += "<p>" + this.opts.invisibleSpace + "</p>"), this.modalClose(), this.selectionRestore();
                var k = this.getBlock() || this.getCurrent();
                if(k && "BODY" != k.tagName) {
                    if("LI" == k.tagName) var k = $(k).closest("ul, ol");
                    $(k).after(j)
                } else this.insertHtmlAdvanced(j, !1);
                this.selectionRestore();
                var l = this.$editor.find("#table" + h);
                this.buttonActiveObserver(), l.find("span#selection-marker-1, inline#selection-marker-1").remove(), l.removeAttr("id"), this.sync()
            },
            tableDeleteTable: function() {
                var a = $(this.getParent()).closest("table");
                return this.isParentRedactor(a) ? 0 == a.size() ? !1 : (this.bufferSet(), a.remove(), void this.sync()) : !1
            },
            tableDeleteRow: function() {
                var a = this.getParent(),
                    b = $(a).closest("table");
                if(!this.isParentRedactor(b)) return !1;
                if(0 == b.size()) return !1;
                this.bufferSet();
                var c = $(a).closest("tr"),
                    d = c.prev().length ? c.prev() : c.next();
                if(d.length) {
                    var e = d.children("td").first();
                    e.length && e.prepend('<span id="selection-marker-1">' + this.opts.invisibleSpace + "</span>")
                }
                c.remove(), this.selectionRestore(), b.find("span#selection-marker-1").remove(), this.sync()
            },
            tableDeleteColumn: function() {
                var a = this.getParent(),
                    b = $(a).closest("table");
                if(!this.isParentRedactor(b)) return !1;
                if(0 == b.size()) return !1;
                this.bufferSet();
                var c = $(a).closest("td");
                c.is("td") || (c = c.closest("td"));
                var d = c.get(0).cellIndex;
                b.find("tr").each($.proxy(function(a, b) {
                    var c = 0 > d - 1 ? d + 1 : d - 1;
                    0 === a && $(b).find("td").eq(c).prepend('<span id="selection-marker-1">' + this.opts.invisibleSpace + "</span>"), $(b).find("td").eq(d).remove()
                }, this)), this.selectionRestore(), b.find("span#selection-marker-1").remove(), this.sync()
            },
            tableAddHead: function() {
                var a = $(this.getParent()).closest("table");
                if(!this.isParentRedactor(a)) return !1;
                if(0 == a.size()) return !1;
                if(this.bufferSet(), 0 !== a.find("thead").size()) this.tableDeleteHead();
                else {
                    var b = a.find("tr").first().clone();
                    b.find("td").html(this.opts.invisibleSpace);
                    var c;
                    c = $("<thead></thead>"), c.append(b), a.prepend(c), this.sync()
                }
            },
            tableDeleteHead: function() {
                var a = $(this.getParent()).closest("table");
                if(!this.isParentRedactor(a)) return !1;
                var b = a.find("thead");
                return 0 == b.size() ? !1 : (this.bufferSet(), b.remove(), void this.sync())
            },
            tableAddRowAbove: function() {
                this.tableAddRow("before")
            },
            tableAddRowBelow: function() {
                this.tableAddRow("after")
            },
            tableAddColumnLeft: function() {
                this.tableAddColumn("before")
            },
            tableAddColumnRight: function() {
                this.tableAddColumn("after")
            },
            tableAddRow: function(a) {
                var b = $(this.getParent()).closest("table");
                if(!this.isParentRedactor(b)) return !1;
                if(0 == b.size()) return !1;
                this.bufferSet();
                var c = $(this.getParent()).closest("tr"),
                    d = c.clone();
                d.find("td").html(this.opts.invisibleSpace), "after" === a ? c.after(d) : c.before(d), this.sync()
            },
            tableAddColumn: function(a) {
                var b = this.getParent(),
                    c = $(b).closest("table");
                if(!this.isParentRedactor(c)) return !1;
                if(0 == c.size()) return !1;
                this.bufferSet();
                var d = 0,
                    e = this.getCurrent(),
                    f = $(e).closest("tr"),
                    g = $(e).closest("td");
                f.find("td").each($.proxy(function(a, b) {
                    $(b)[0] === g[0] && (d = a)
                }, this)), c.find("tr").each($.proxy(function(b, c) {
                    var e = $(c).find("td").eq(d),
                        f = e.clone();
                    f.html(this.opts.invisibleSpace), "after" === a ? e.after(f) : e.before(f)
                }, this)), this.sync()
            },
            videoShow: function() {
                this.selectionSave(), this.modalInit(this.opts.curLang.video, this.opts.modal_video, 600, $.proxy(function() {
                    $("#redactor_insert_video_btn").click($.proxy(this.videoInsert, this)), setTimeout(function() {
                        $("#redactor_insert_video_area").focus()
                    }, 200)
                }, this))
            },
            videoInsert: function() {
                var a = $("#redactor_insert_video_area").val();
                a = this.cleanStripTags(a);
                var b = '<iframe width="500" height="281" src="',
                    c = '" frameborder="0" allowfullscreen></iframe>';
                a.match(reUrlYoutube) ? a = a.replace(reUrlYoutube, b + "//www.youtube.com/embed/$1" + c) : a.match(reUrlVimeo) && (a = a.replace(reUrlVimeo, b + "//player.vimeo.com/video/$2" + c)), this.selectionRestore();
                var d = this.getBlock() || this.getCurrent();
                d ? $(d).after(a) : this.insertHtmlAdvanced(a, !1), this.sync(), this.modalClose()
            },
            linkShow: function() {
                this.selectionSave();
                var a = $.proxy(function() {
                    if(this.opts.predefinedLinks !== !1) {
                        this.predefinedLinksStorage = {};
                        var a = this;
                        $.getJSON(this.opts.predefinedLinks, function(b) {
                            var c = $("#redactor-predefined-links");
                            c.html(""), $.each(b, function(b, d) {
                                a.predefinedLinksStorage[b] = d, c.append($("<option>").val(b).html(d.name))
                            }), c.on("change", function() {
                                var b = $(this).val(),
                                    c = "",
                                    d = "";
                                0 != b && (c = a.predefinedLinksStorage[b].name, d = a.predefinedLinksStorage[b].url), $("#redactor_link_url").val(d), $("#redactor_link_url_text").val(c)
                            }), c.show()
                        })
                    }
                    this.insert_link_node = !1;
                    var b = this.getSelection(),
                        c = "",
                        d = "",
                        e = "",
                        f = !1,
                        g = "ajax",
                        h = this.getParent(),
                        i = $(h).parent().get(0);
                    i && "A" === i.tagName && (h = i), h && "A" === h.tagName ? (c = h.href, d = $(h).text(), e = h.target, f = "lightbox-image" == $(h).attr("data-concrete5-link-launch"), g = "image" === $(h).attr("data-concrete5-link-type"), this.insert_link_node = h) : d = b.toString(), $("#redactor_link_url_text").val(d), f && $("#redactor_link_lightbox").prop("checked", !0), g ? $("#redactor_link_image").prop("checked", !0) : $("#redactor_link_ajax").prop("checked", !0), $("#redactor_link_lightbox").is(":checked") ? $(".ccm-redactor-link-type").show() : $(".ccm-redactor-link-type").hide();
                    var j = self.location.href.replace(/\/$/i, "");
                    if(c = c.replace(j, ""), c = c.replace(/^\/#/, "#"), c = c.replace("mailto:", ""), this.opts.linkProtocol === !1) {
                        var k = new RegExp("^(http|ftp|https)://" + self.location.host, "i");
                        c = c.replace(k, "")
                    }
                    $("#redactor_link_url").val(c), "_blank" === e && $("#redactor_link_blank").prop("checked", !0), this.linkInsertPressed = !1, $("#redactor_insert_link_btn").on("click", $.proxy(this.linkProcess, this)), setTimeout(function() {
                        $("#redactor_link_url").focus()
                    }, 200), this.opts.concrete5.filemanager ? $("a[data-action=choose-file-from-file-manager]").on("click", function(a) {
                        a.preventDefault(), ConcreteFileManager.launchDialog(function(a) {
                            jQuery.fn.dialog.showLoader(), ConcreteFileManager.getFileDetails(a.fID, function(a) {
                                jQuery.fn.dialog.hideLoader();
                                var b = a.files[0];
                                $("#redactor_link_url").val(b.urlDownload), $("#redactor_link_image").prop("checked", !0)
                            })
                        })
                    }) : $("a[data-action=choose-file-from-file-manager]").remove(), this.opts.concrete5.lightbox || $("div.form-group[data-option-feature=lightbox]").hide(), this.opts.concrete5.sitemap ? $("a[data-action=choose-link-from-sitemap]").on("click", function(a) {
                        a.preventDefault(), jQuery.fn.dialog.open({
                            width: "90%",
                            height: "70%",
                            modal: !1,
                            title: ccmi18n_sitemap.choosePage,
                            href: CCM_TOOLS_PATH + "/sitemap_search_selector"
                        }), ConcreteEvent.unsubscribe("SitemapSelectPage"), ConcreteEvent.subscribe("SitemapSelectPage", function(a, b) {
                            jQuery.fn.dialog.closeTop();
                            var c = CCM_BASE_URL + CCM_DISPATCHER_FILENAME + "?cID=" + b.cID;
                            $("#redactor_link_url").val(c), $("#redactor_link_ajax").prop("checked", !0)
                        })
                    }) : $("a[data-action=choose-link-from-sitemap]").remove(), this.opts.concrete5.sitemap || this.opts.concrete5.filemanager || $("#redactor_link_url").parent().removeClass()
                }, this);
                this.modalInit(this.opts.curLang.link, this.opts.modal_link, 460, a)
            },
            linkProcess: function() {
                if(!this.linkInsertPressed) {
                    this.linkInsertPressed = !0;
                    var a = "",
                        b = "",
                        c = $("#redactor_link_url").val(),
                        d = $("#redactor_link_image").is(":checked") ? "image" : "ajax",
                        e = $("#redactor_link_url_text").val(),
                        f = $("#redactor_link_lightbox").is(":checked");
                    if(f) var g = 'data-concrete5-link-type="' + d + '" data-concrete5-link-launch="lightbox-image"';
                    else var g = 'data-concrete5-link-type="' + d + '"';
                    if(-1 != c.search("@") && /(http|ftp|https):\/\//i.test(c) === !1) c = "mailto:" + c;
                    else if(0 != c.search("#")) {
                        $("#redactor_link_blank").prop("checked") && (a = ' target="_blank"', b = "_blank");
                        var h = "((xn--)?[a-z0-9]+(-[a-z0-9]+)*.)+[a-z]{2,}",
                            i = new RegExp("^(http|ftp|https)://" + h, "i"),
                            j = new RegExp("^" + h, "i"); - 1 == c.search(i) && 0 == c.search(j) && this.opts.linkProtocol && (c = this.opts.linkProtocol + c)
                    }
                    e = e.replace(/<|>/g, "");
                    var k = "&nbsp;";
                    this.browser("mozilla") && (k = "&nbsp;"), this.linkInsert('<a href="' + c + '"' + a + " " + g + ">" + e + "</a>" + k, $.trim(e), c, b, f)
                }
            },
            linkInsert: function(a, b, c, d, e) {
                if(this.selectionRestore(), "" !== b) {
                    if(this.insert_link_node) this.bufferSet(), $(this.insert_link_node).text(b).attr("href", c), "" !== d ? $(this.insert_link_node).attr("target", d) : $(this.insert_link_node).removeAttr("target"), "" != e ? $(this.insert_link_node).attr("data-concrete5-link-launch", "lightbox") : $(this.insert_link_node).removeAttr("data-concrete5-link-launch");
                    else {
                        var f = $(a).addClass("redactor-added-link");
                        this.exec("inserthtml", this.outerHtml(f), !1);
                        var c = this.$editor.find("a.redactor-added-link");
                        c.removeAttr("style").removeClass("redactor-added-link").each(function() {
                            "" == this.className && $(this).removeAttr("class")
                        })
                    }
                    this.sync()
                }
                setTimeout($.proxy(function() {
                    this.opts.observeLinks && this.observeLinks()
                }, this), 5), this.modalClose()
            },
            fileShow: function() {
                this.selectionSave();
                var a = $.proxy(function() {
                    var a = this.getSelection(),
                        b = "";
                    b = this.oldIE() ? a.text : a.toString(), $("#redactor_filename").val(b), this.isMobile() || this.isIPad() || this.draguploadInit("#redactor_file", {
                        url: this.opts.fileUpload,
                        uploadFields: this.opts.uploadFields,
                        success: $.proxy(this.fileCallback, this),
                        error: $.proxy(function(a, b) {
                            this.callback("fileUploadError", b)
                        }, this),
                        uploadParam: this.opts.fileUploadParam
                    }), this.uploadInit("redactor_file", {
                        auto: !0,
                        url: this.opts.fileUpload,
                        success: $.proxy(this.fileCallback, this),
                        error: $.proxy(function(a, b) {
                            this.callback("fileUploadError", b)
                        }, this)
                    })
                }, this);
                this.modalInit(this.opts.curLang.file, this.opts.modal_file, 500, a)
            },
            fileCallback: function(a) {
                if(this.selectionRestore(), a !== !1) {
                    var b = $("#redactor_filename").val();
                    "" === b && (b = a.filename);
                    var c = '<a href="' + a.filelink + '" id="filelink-marker">' + b + "</a>";
                    this.browser("webkit") && this.window.chrome && (c += "&nbsp;"), this.execCommand("inserthtml", c, !1);
                    var d = $(this.$editor.find("a#filelink-marker"));
                    0 != d.size() ? d.removeAttr("id") : d = !1, this.sync(), this.callback("fileUpload", d, a)
                }
                this.modalClose()
            },
            imageShow: function() {
                this.selectionSave();
                var a = $.proxy(function() {
                    this.opts.imageGetJson ? $.getJSON(this.opts.imageGetJson, $.proxy(function(a) {
                        var b = {},
                            c = 0;
                        $.each(a, $.proxy(function(a, d) {
                            "undefined" != typeof d.folder && (c++, b[d.folder] = c)
                        }, this));
                        var d = !1;
                        if($.each(a, $.proxy(function(a, c) {
                                var e = "";
                                "undefined" != typeof c.title && (e = c.title);
                                var f = 0;
                                $.isEmptyObject(b) || "undefined" == typeof c.folder || (f = b[c.folder], d === !1 && (d = ".redactorfolder" + f));
                                var g = $('<img src="' + c.thumb + '" class="redactorfolder redactorfolder' + f + '" rel="' + c.image + '" title="' + e + '" />');
                                $("#redactor_image_box").append(g), $(g).click($.proxy(this.imageThumbClick, this))
                            }, this)), !$.isEmptyObject(b)) {
                            $(".redactorfolder").hide(), $(d).show();
                            var e = function(a) {
                                    $(".redactorfolder").hide(), $(".redactorfolder" + $(a.target).val()).show()
                                },
                                f = $('<select id="redactor_image_box_select">');
                            $.each(b, function(a, b) {
                                f.append($('<option value="' + b + '">' + a + "</option>"))
                            }), $("#redactor_image_box").before(f), f.change(e)
                        }
                    }, this)) : $("#redactor-tab-control-2").remove(), this.opts.imageUpload || this.opts.s3 ? (this.isMobile() || this.isIPad() || this.opts.s3 !== !1 || $("#redactor_file").length && this.draguploadInit("#redactor_file", {
                        url: this.opts.imageUpload,
                        uploadFields: this.opts.uploadFields,
                        success: $.proxy(this.imageCallback, this),
                        error: $.proxy(function(a, b) {
                            this.callback("imageUploadError", b)
                        }, this),
                        uploadParam: this.opts.imageUploadParam
                    }), this.opts.s3 === !1 ? this.uploadInit("redactor_file", {
                        auto: !0,
                        url: this.opts.imageUpload,
                        success: $.proxy(this.imageCallback, this),
                        error: $.proxy(function(a, b) {
                            this.callback("imageUploadError", b)
                        }, this)
                    }) : $("#redactor_file").on("change.redactor", $.proxy(this.s3handleFileSelect, this))) : ($(".redactor_tab").hide(), this.opts.imageGetJson ? ($("#redactor-tab-control-1").remove(), $("#redactor-tab-control-2").addClass("redactor_tabs_act"), $("#redactor_tab2").show()) : ($("#redactor_tabs").remove(), $("#redactor_tab3").show())), this.opts.imageTabLink || !this.opts.imageUpload && !this.opts.imageGetJson || $("#redactor-tab-control-3").hide(), $("#redactor_upload_btn").click($.proxy(this.imageCallbackLink, this)), this.opts.imageUpload || this.opts.imageGetJson || setTimeout(function() {
                        $("#redactor_file_link").focus()
                    }, 200), $("a[data-action=choose-image-from-file-manager]").on("click", function(a) {
                        a.preventDefault(), ConcreteFileManager.launchDialog(function(a) {
                            jQuery.fn.dialog.showLoader(), ConcreteFileManager.getFileDetails(a.fID, function(a) {
                                jQuery.fn.dialog.hideLoader();
                                var b = a.files[0];
                                $("#redactor_file_link").val(b.urlInline), $("#redactor_link_image").prop("checked", !0)
                            })
                        })
                    })
                }, this);
                this.modalInit(this.opts.curLang.image, this.opts.modal_image, 610, a)
            },
            imageEdit: function(a) {
                var b = a,
                    c = b.parent().parent(),
                    d = $.proxy(function() {
                        $("#redactor_link_default").prop("checked", !0), $("#redactor_file_alt").val(b.attr("alt")), $("#redactor_image_edit_src").attr("href", b.attr("src")), $("#redactor_form_image_align").val("block" == b.css("display") && "none" == b.css("float") ? "center" : b.css("float")), "A" === $(c).get(0).tagName && ($("#redactor_file_link").val($(c).attr("href")), "_blank" == $(c).attr("target") ? $("#redactor_link_blank").prop("checked", !0) : $(c).attr("data-concrete5-link-launch") && $("#redactor_link_lightbox").prop("checked", !0), "image" === $(c).data("concrete5-link-type") ? $("#redactor_link_image").prop("checked", !0) : $("#redactor_link_ajax").prop("checked", !0)), $("#redactor_image_delete_btn").click($.proxy(function() {
                            this.imageRemove(b)
                        }, this)), $("#redactorSaveBtn").click($.proxy(function() {
                            this.imageSave(b)
                        }, this)), $("a[data-action=choose-file-from-file-manager]").on("click", function(a) {
                            a.preventDefault(), ConcreteFileManager.launchDialog(function(a) {
                                jQuery.fn.dialog.showLoader(), ConcreteFileManager.getFileDetails(a.fID, function(a) {
                                    jQuery.fn.dialog.hideLoader();
                                    var b = a.files[0];
                                    $("#redactor_file_link").val(b.urlDownload), $("#redactor_link_image").prop("checked", !0)
                                })
                            })
                        }), $("a[data-action=choose-link-from-sitemap]").on("click", function(a) {
                            a.preventDefault(), jQuery.fn.dialog.open({
                                width: "90%",
                                height: "70%",
                                modal: !1,
                                title: ccmi18n_sitemap.choosePage,
                                href: CCM_TOOLS_PATH + "/sitemap_search_selector"
                            }), ConcreteEvent.unsubscribe("SitemapSelectPage"), ConcreteEvent.subscribe("SitemapSelectPage", function(a, b) {
                                jQuery.fn.dialog.closeTop();
                                var c = CCM_BASE_URL + CCM_DISPATCHER_FILENAME + "?cID=" + b.cID;
                                $("#redactor_file_link").val(c), $("#redactor_link_ajax").prop("checked", !0)
                            })
                        })
                    }, this);
                this.modalInit(this.opts.curLang.edit, this.opts.modal_image_edit, 380, d)
            },
            imageRemove: function(a) {
                var b = $(a).parent().parent(),
                    c = $(a).parent(),
                    d = !1;
                b.length && "A" === b[0].tagName ? (d = !0, $(b).remove()) : c.length && "A" === c[0].tagName ? (d = !0, $(c).remove()) : $(a).remove(), c.length && "P" === c[0].tagName && (this.focusWithSaveScroll(), d === !1 && this.selectionStart(c)), this.callback("imageDelete", a), this.modalClose(), this.sync()
            },
            imageSave: function(a) {
                this.imageResizeHide(!1);
                var b = $(a),
                    c = b.parent();
                b.attr("alt", $("#redactor_file_alt").val());
                var d = $("#redactor_form_image_align").val(),
                    e = "",
                    f = !1;
                "left" === d ? (e = "0 " + this.opts.imageFloatMargin + " " + this.opts.imageFloatMargin + " 0", b.css({
                    "float": "left",
                    margin: e
                })) : "right" === d ? (e = "0 0 " + this.opts.imageFloatMargin + " " + this.opts.imageFloatMargin, b.css({
                    "float": "right",
                    margin: e
                })) : b.css("center" === d ? {
                    "float": "",
                    display: "block",
                    margin: "auto"
                } : {
                    "float": "",
                    display: "",
                    margin: ""
                });
                var g = $.trim($("#redactor_file_link").val());
                if("" !== g) {
                    var h = !1;
                    $("#redactor_link_blank").prop("checked") && (h = !0), $("#redactor_link_lightbox").prop("checked") && (f = !0), f ? $(".ccm-redactor-link-type").show() : $(".ccm-redactor-link-type").hide();
                    var i = $("#redactor_link_image").is(":checked") ? "image" : "ajax";
                    if("A" !== c.get(0).tagName) {
                        var j = $('<a href="' + g + '">' + this.outerHtml(a) + "</a>");
                        h ? j.attr("target", "_blank") : f && j.attr("data-concrete5-link-launch", "lightbox-image"), j.attr("data-concrete5-link-type", i), b.replaceWith(j)
                    } else c.attr("href", g), h ? c.attr("target", "_blank") : c.removeAttr("target"), f ? c.attr("data-concrete5-link-launch", "lightbox-image") : c.removeAttr("data-concrete5-link-launch"), c.attr("data-concrete5-link-type", i)
                } else "A" === c.get(0).tagName && c.replaceWith(this.outerHtml(a));
                this.modalClose(), this.observeImages(), this.sync()
            },
            imageResizeHide: function(a) {
                if(a !== !1 && 0 != $(a.target).parent().size() && "redactor-image-box" === $(a.target).parent()[0].id) return !1;
                var b = this.$editor.find("#redactor-image-box");
                return 0 == b.size() ? !1 : (this.$editor.find("#redactor-image-editter, #redactor-image-resizer").remove(), b.find("img").css({
                    marginTop: b[0].style.marginTop,
                    marginBottom: b[0].style.marginBottom,
                    marginLeft: b[0].style.marginLeft,
                    marginRight: b[0].style.marginRight
                }), b.css("margin", ""), b.find("img").css("opacity", ""), b.replaceWith(function() {
                    return $(this).contents()
                }), $(document).off("click.redactor-image-resize-hide"), this.$editor.off("click.redactor-image-resize-hide"), this.$editor.off("keydown.redactor-image-delete"), void this.sync())
            },
            imageResize: function(a) {
                var b = $(a);
                b.on("mousedown", $.proxy(function() {
                    this.imageResizeHide(!1)
                }, this)), b.on("dragstart", $.proxy(function() {
                    this.$editor.on("drop.redactor-image-inside-drop", $.proxy(function() {
                        setTimeout($.proxy(function() {
                            this.observeImages(), this.$editor.off("drop.redactor-image-inside-drop"), this.sync()
                        }, this), 1)
                    }, this))
                }, this)), b.on("click", $.proxy(function() {
                    if(0 != this.$editor.find("#redactor-image-box").size()) return !1;
                    var a, c, d = b.width() / b.height(),
                        e = 20,
                        f = this.imageResizeControls(b),
                        g = !1;
                    f !== !1 && (f.on("mousedown", function(e) {
                        g = !0, e.preventDefault(), d = b.width() / b.height(), a = Math.round(e.pageX - b.eq(0).offset().left), c = Math.round(e.pageY - b.eq(0).offset().top)
                    }), $(this.document.body).on("mousemove", $.proxy(function(f) {
                        if(g) {
                            var h = (Math.round(f.pageX - b.eq(0).offset().left) - a, Math.round(f.pageY - b.eq(0).offset().top) - c),
                                i = b.height(),
                                j = parseInt(i, 10) + h,
                                k = Math.round(j * d);
                            k > e && (b.width(k), this.imageEditter.css(100 > k ? {
                                marginTop: "-7px",
                                marginLeft: "-13px",
                                fontSize: "9px",
                                padding: "3px 5px"
                            } : {
                                marginTop: "-11px",
                                marginLeft: "-18px",
                                fontSize: "11px",
                                padding: "7px 10px"
                            })), a = Math.round(f.pageX - b.eq(0).offset().left), c = Math.round(f.pageY - b.eq(0).offset().top), this.sync()
                        }
                    }, this)).on("mouseup", function() {
                        g = !1
                    })), this.$editor.on("keydown.redactor-image-delete", $.proxy(function(a) {
                        var c = a.which;
                        (this.keyCode.BACKSPACE == c || this.keyCode.DELETE == c) && (this.bufferSet(!1), this.imageResizeHide(!1), this.imageRemove(b))
                    }, this)), $(document).on("click.redactor-image-resize-hide", $.proxy(this.imageResizeHide, this)), this.$editor.on("click.redactor-image-resize-hide", $.proxy(this.imageResizeHide, this))
                }, this))
            },
            imageResizeControls: function(a) {
                var b = $('<span id="redactor-image-box" data-redactor="verified">');
                if(b.css({
                        position: "relative",
                        display: "inline-block",
                        lineHeight: 0,
                        outline: "1px dashed rgba(0, 0, 0, .6)",
                        "float": a.css("float")
                    }), b.attr("contenteditable", !1), "auto" != a[0].style.margin ? (b.css({
                        marginTop: a[0].style.marginTop,
                        marginBottom: a[0].style.marginBottom,
                        marginLeft: a[0].style.marginLeft,
                        marginRight: a[0].style.marginRight
                    }), a.css("margin", "")) : b.css({
                        display: "block",
                        margin: "auto"
                    }), a.css("opacity", .5).after(b), this.imageEditter = $('<span id="redactor-image-editter" data-redactor="verified">' + this.opts.curLang.edit + "</span>"), this.imageEditter.css({
                        position: "absolute",
                        zIndex: 5,
                        top: "50%",
                        left: "50%",
                        marginTop: "-11px",
                        marginLeft: "-18px",
                        lineHeight: 1,
                        backgroundColor: "#000",
                        color: "#fff",
                        fontSize: "11px",
                        padding: "7px 10px",
                        cursor: "pointer"
                    }), this.imageEditter.attr("contenteditable", !1), this.imageEditter.on("click", $.proxy(function() {
                        this.imageEdit(a)
                    }, this)), b.append(this.imageEditter), this.opts.imageResizable) {
                    var c = $('<span id="redactor-image-resizer" data-redactor="verified"></span>');
                    return c.css({
                        position: "absolute",
                        zIndex: 2,
                        lineHeight: 1,
                        cursor: "nw-resize",
                        bottom: "-4px",
                        right: "-5px",
                        border: "1px solid #fff",
                        backgroundColor: "#000",
                        width: "8px",
                        height: "8px"
                    }), c.attr("contenteditable", !1), b.append(c), b.append(a), c
                }
                return b.append(a), !1
            },
            imageThumbClick: function(a) {
                var b = '<img id="image-marker" src="' + $(a.target).attr("rel") + '" alt="' + $(a.target).attr("title") + '" />',
                    c = this.getParent();
                this.opts.paragraphy && 0 == $(c).closest("li").size() && (b = "<p>" + b + "</p>"), this.imageInsert(b, !0)
            },
            imageCallbackLink: function() {
                var a = $("#redactor_file_link").val();
                if("" !== a) {
                    var b = '<img id="image-marker" src="' + a + '" />';
                    this.opts.linebreaks === !1 && (b = "<p>" + b + "</p>"), this.imageInsert(b, !0)
                } else this.modalClose()
            },
            imageCallback: function(a) {
                this.imageInsert(a)
            },
            imageInsert: function(a, b) {
                if(this.selectionRestore(), a !== !1) {
                    var c = "";
                    if(b !== !0) {
                        c = '<img id="image-marker" src="' + a.filelink + '" />';
                        var d = this.getParent();
                        this.opts.paragraphy && 0 == $(d).closest("li").size() && (c = "<p>" + c + "</p>")
                    } else c = a;
                    this.execCommand("inserthtml", c, !1);
                    var e = $(this.$editor.find("img#image-marker"));
                    e.length ? e.removeAttr("id") : e = !1, this.sync(), b !== !0 && this.callback("imageUpload", e, a)
                }
                this.modalClose(), this.observeImages()
            },
            buildProgressBar: function() {
                0 == $("#redactor-progress").size() && (this.$progressBar = $('<div id="redactor-progress"><span></span></div>'), $(document.body).append(this.$progressBar))
            },
            showProgressBar: function() {
                this.buildProgressBar(), this.$progressBar.fadeIn()
            },
            hideProgressBar: function() {
                this.buildProgressBar(), this.$progressBar.fadeOut(1500)
            },
            modalTemplatesInit: function() {
                $.extend(this.opts, {
                    modal_file: String() + '<section id="redactor-modal-file-insert"><form id="redactorUploadFileForm" method="post" action="" enctype="multipart/form-data"><label>' + this.opts.curLang.filename + '</label><input type="text" id="redactor_filename" class="redactor_input" /><div style="margin-top: 7px;"><input type="file" id="redactor_file" name="' + this.opts.fileUploadParam + '" /></div></form></section>',
                    modal_image_edit: String() + '<section id="redactor-modal-image-edit"><div class="form-group"><label>' + this.opts.curLang.title + '</label><input type="text" id="redactor_file_alt" class="form-control" /></div><div class="form-group"><label class="control-label">' + this.opts.curLang.link + '</label><div class="input-group"><input type="text" name="redactor_file_link" id="redactor_file_link" class="form-control" /><a href="#" data-action="choose-file-from-file-manager" class="btn btn-default input-group-addon"><i class="fa fa-file"></i></a><a href="#" data-action="choose-link-from-sitemap" class="btn btn-default input-group-addon"><i class="fa fa-search"></i></a></div></div><div class="form-group"><label class="control-label"> ' + this.opts.curLang.open_link + '</label><div class="radio"><label><input type="radio" id="redactor_link_default" name="redactor_open_link_behavior" value="default"> ' + this.opts.curLang.default_behavior + ' </label></div><div class="radio"><label><input type="radio" id="redactor_link_lightbox" name="redactor_open_link_behavior" value="lightbox"> ' + this.opts.curLang.in_lightbox + ' </label></div><div class="radio"><label><input type="radio" id="redactor_link_blank" name="redactor_open_link_behavior" value="blank"> ' + this.opts.curLang.link_new_tab + '</label></div></div><div class="form-group ccm-redactor-link-type" style="display:none"><label class="control-label"> ' + this.opts.curLang.link_type + '</label><div class="radio"><label><input type="radio" id="redactor_link_image" name="redactor_link_type" value="image"> ' + this.opts.curLang.link_type_image + ' </label></div><div class="radio"><label><input type="radio" id="redactor_link_ajax" name="redactor_link_type" value="ajax" checked> ' + this.opts.curLang.link_type_ajax + ' </label></div></div><div class="form-group"><label>' + this.opts.curLang.image_position + '</label><select id="redactor_form_image_align" class="form-control"><option value="none">' + this.opts.curLang.none + '</option><option value="left">' + this.opts.curLang.left + '</option><option value="center">' + this.opts.curLang.center + '</option><option value="right">' + this.opts.curLang.right + '</option></select></div></section><footer><button id="redactor_image_delete_btn" class="btn btn-danger pull-left redactor_modal_btn redactor_modal_delete_btn">' + this.opts.curLang._delete + '</button><button id="redactorSaveBtn" style="margin-left: 10px" class="btn btn-primary pull-right redactor_modal_btn redactor_modal_action_btn">' + this.opts.curLang.save + '</button><button class="btn btn-default pull-right redactor_modal_btn redactor_btn_modal_close">' + this.opts.curLang.cancel + "</button></footer>",
                    modal_image: String() + '<section id="redactor-modal-image-insert"><ul class="nav nav-tabs" id="redactor_tabs"><li id="redactor-tab-control-1" class="active"><a href="#">' + this.opts.curLang.upload + '</a></li><li id="redactor-tab-control-2"><a href="#">' + this.opts.curLang.choose + '</a></li><li id="redactor-tab-control-3"><a href="#">' + this.opts.curLang.link + '</a></li></ul><form id="redactorInsertImageForm" method="post" action="" enctype="multipart/form-data"><div id="redactor_tab1" class="redactor_tab"><input type="file" id="redactor_file" name="' + this.opts.imageUploadParam + '" /></div><div id="redactor_tab2" class="redactor_tab" style="display: none;"><div id="redactor_image_box"></div></div></form><div id="redactor_tab3" class="redactor_tab" style="display: none;"><div class="form-group"><label>' + this.opts.curLang.image_web_link + '</label><div class="input-group"><input type="text" name="redactor_file_link" id="redactor_file_link" class="form-control"  /><a href="#" data-action="choose-image-from-file-manager" class="btn btn-default input-group-addon"><i class="fa fa-search"></i></a></div></div></div></section><footer><button class="btn btn-default pull-left redactor_btn_modal_close">' + this.opts.curLang.cancel + '</button><button class="btn btn-primary pull-right redactor_modal_action_btn" id="redactor_upload_btn">' + this.opts.curLang.insert + "</button></footer>",
                    modal_link: String() + '<section id="redactor-modal-link-insert"><select id="redactor-predefined-links" class="form-control" style="width: 99.5%; display: none;"></select><div class="form-group"><label>' + this.opts.curLang.web + '</label><div class="input-group"><input type="text" class="form-control" id="redactor_link_url" /><a href="#" data-action="choose-link-from-sitemap" class="btn btn-default input-group-addon"><i class="fa fa-sitemap"></i></a><a href="#" data-action="choose-file-from-file-manager" class="btn btn-default input-group-addon"><i class="fa fa-file"></i></a></div></div><div class="form-group"><label>' + this.opts.curLang.text + '</label><input type="text" class="form-control" id="redactor_link_url_text" /></div><div class="form-group" data-option-feature="lightbox"><div class="checkbox"><label><input type="checkbox" id="redactor_link_lightbox" />' + this.opts.curLang.open_link_in_lightbox + '</label></div></div><div class="form-group ccm-redactor-link-type" style="display:none"><label class="control-label"> ' + this.opts.curLang.link_type + '</label><div class="radio"><label><input type="radio" id="redactor_link_image" name="redactor_link_type" value="image"> ' + this.opts.curLang.link_type_image + ' </label></div><div class="radio"><label><input type="radio" id="redactor_link_ajax" name="redactor_link_type" value="ajax" checked> ' + this.opts.curLang.link_type_ajax + ' </label></div></div></section><footer><button class="btn btn-default pull-left redactor_modal_btn redactor_btn_modal_close">' + this.opts.curLang.cancel + '</button><button id="redactor_insert_link_btn" class="btn btn-primary pull-right redactor_modal_btn redactor_modal_action_btn">' + this.opts.curLang.insert + "</button></footer>",
                    modal_table: String() + '<section id="redactor-modal-table-insert"><div class="form-group"><label class="control-label">' + this.opts.curLang.rows + '</label><input class="form-control" type="text" size="5" value="2" id="redactor_table_rows" /></div><div class="form-group"><label class="control-label">' + this.opts.curLang.columns + '</label><input class="form-control" type="text" size="5" value="3" id="redactor_table_columns" /></div></section><footer><button class="btn btn-default pull-left redactor_modal_btn redactor_btn_modal_close">' + this.opts.curLang.cancel + '</button><button id="redactor_insert_table_btn" class="btn btn-primary pull-right redactor_modal_btn redactor_modal_action_btn">' + this.opts.curLang.insert + "</button></footer>",
                    modal_video: String() + '<section id="redactor-modal-video-insert"><form id="redactorInsertVideoForm"><label>' + this.opts.curLang.video_html_code + '</label><textarea id="redactor_insert_video_area" style="width: 99%; height: 160px;"></textarea></form></section><footer><button class="btn btn-default pull-left redactor_modal_btn redactor_btn_modal_close">' + this.opts.curLang.cancel + '</button><button id="redactor_insert_video_btn" class="btn btn-primary pull-right redactor_modal_btn redactor_modal_action_btn">' + this.opts.curLang.insert + "</button></footer>"
                })
            },
            modalInit: function(a, b, c, d) {
                if(this.modalSetOverlay(), this.$redactorModalWidth = c, this.$redactorModal = $("#redactor_modal"), !this.$redactorModal.length) {
                    this.$redactorModal = $('<div id="redactor_modal" style="display: none;" />'), this.$redactorModal.addClass("ui-dialog"), this.$redactorModal.append($('<div id="redactor_modal_close"><button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" role="button"><span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">close</span></button></div>')), this.$redactorModal.append($('<header id="redactor_modal_header" />')), this.$redactorModal.append($('<div id="redactor_modal_inner" />')), this.$redactorModal.appendTo(document.body);
                    var e = this.$redactorModal;
                    e.addClass("ccm-ui"), this.$redactorModal.find("#redactor_modal_close").on("mouseover", function() {
                        e.find("#redactor_modal_close button").addClass("ui-state-active")
                    }).on("mouseout", function() {
                        e.find("#redactor_modal_close button").removeClass("ui-state-active")
                    })
                }
                $("#redactor_modal_close").on("click", $.proxy(this.modalClose, this)), $(document).keyup($.proxy(this.modalCloseHandler, this)), this.$editor.keyup($.proxy(this.modalCloseHandler, this)), this.modalSetContent(b), this.modalSetTitle(a), this.modalSetDraggable(), this.modalLoadTabs(), this.modalOnCloseButton(), this.saveModalScroll = this.document.body.scrollTop, this.opts.autoresize === !1 && (this.saveModalScroll = this.$editor.scrollTop()), this.isMobile() === !1 ? this.modalShowOnDesktop() : this.modalShowOnMobile(), "function" == typeof d && d(), setTimeout($.proxy(function() {
                    this.callback("modalOpened", this.$redactorModal)
                }, this), 11), $(document).off("focusin.modal"), this.$redactorModal.find("input[type=text]").on("keypress", $.proxy(function(a) {
                    13 === a.which && (this.$redactorModal.find(".redactor_modal_action_btn").click(), a.preventDefault())
                }, this));
                var f = $("#redactor_link_lightbox"),
                    g = $("#redactor_link_lightbox, input[name=redactor_open_link_behavior]").change(function() {
                        f.prop("checked") || g.filter(":checked").is(f) ? $(".ccm-redactor-link-type").show() : $(".ccm-redactor-link-type").hide()
                    });
                return this.$redactorModal
            },
            modalShowOnDesktop: function() {
                this.$redactorModal.css({
                    position: "fixed",
                    top: "-2000px",
                    left: "50%",
                    width: this.$redactorModalWidth + "px",
                    marginLeft: "-" + this.$redactorModalWidth / 2 + "px"
                }).show().addClass("animated fadeIn"), this.modalSaveBodyOveflow = $(document.body).css("overflow"), $(document.body).css("overflow", "hidden"), setTimeout($.proxy(function() {
                    var a = this.$redactorModal.outerHeight();
                    this.$redactorModal.css({
                        top: "50%",
                        height: "auto",
                        minHeight: "auto",
                        marginTop: "-" + (a + 10) / 2 + "px"
                    })
                }, this), 15)
            },
            modalShowOnMobile: function() {
                this.$redactorModal.css({
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    top: "0",
                    left: "0",
                    margin: "0",
                    minHeight: "300px"
                }).show()
            },
            modalSetContent: function(a) {
                this.modalcontent = !1, 0 == a.indexOf("#") ? (this.modalcontent = $(a), $("#redactor_modal_inner").empty().append(this.modalcontent.html()), this.modalcontent.html("")) : $("#redactor_modal_inner").empty().append(a)
            },
            modalSetTitle: function(a) {
                this.$redactorModal.find("#redactor_modal_header").html(a)
            },
            modalSetButtonsWidth: function() {
                var a = this.$redactorModal.find("footer button").not(".redactor_modal_btn_hidden"),
                    b = a.size();
                b > 0 && $(a).css("width", this.$redactorModalWidth / b + "px")
            },
            modalOnCloseButton: function() {
                this.$redactorModal.find(".redactor_btn_modal_close").on("click", $.proxy(this.modalClose, this))
            },
            modalSetOverlay: function() {
                this.opts.modalOverlay && (this.$redactorModalOverlay = $("#redactor_modal_overlay"), this.$redactorModalOverlay.length || (this.$redactorModalOverlay = $('<div id="redactor_modal_overlay" style="display: none;"></div>'), $("body").prepend(this.$redactorModalOverlay)), this.$redactorModalOverlay.show().on("click", $.proxy(this.modalClose, this)))
            },
            modalSetDraggable: function() {
                "undefined" != typeof $.fn.draggable && (this.$redactorModal.draggable({
                    handle: "#redactor_modal_header"
                }), this.$redactorModal.find("#redactor_modal_header").css("cursor", "move"))
            },
            modalLoadTabs: function() {
                var a = $("#redactor_tabs");
                if(!a.length) return !1;
                var b = this;
                a.find("li").each(function(c, d) {
                    c++, $(d).on("click", function(d) {
                        if(d.preventDefault(), a.find("li").removeClass("active"), $(this).addClass("active"), $(".redactor_tab").hide(), $("#redactor_tab" + c).show(), $("#redactor_tab_selected").val(c), b.isMobile() === !1) {
                            var e = b.$redactorModal.outerHeight();
                            b.$redactorModal.css("margin-top", "-" + (e + 10) / 2 + "px")
                        }
                    })
                })
            },
            modalCloseHandler: function(a) {
                return a.keyCode === this.keyCode.ESC ? (this.modalClose(), !1) : void 0
            },
            modalClose: function() {
                $("#redactor_modal_close").off("click", this.modalClose), $("#redactor_modal").hide();
                var a = $("#redactor_modal_inner");
                return this.modalcontent !== !1 && (this.modalcontent.html(a.html()), this.modalcontent = !1), a.html(""), this.opts.modalOverlay && $("#redactor_modal_overlay").hide().off("click", this.modalClose), $(document).unbind("keyup", this.hdlModalClose), this.$editor.unbind("keyup", this.hdlModalClose), this.selectionRestore(), this.opts.autoresize && this.saveModalScroll ? $(this.document.body).scrollTop(this.saveModalScroll) : this.opts.autoresize === !1 && this.saveModalScroll && this.$editor.scrollTop(this.saveModalScroll), this.callback("modalClosed"), this.isMobile() === !1 && $(document.body).css("overflow", this.modalSaveBodyOveflow ? this.modalSaveBodyOveflow : "visible"), !1
            },
            modalSetTab: function(a) {
                $(".nav-tabs li").hide(), $("#redactor_tabs").find("li").removeClass("active").eq(a - 1).addClass("active"), $("#redactor_tab" + a).show()
            },
            s3handleFileSelect: function(a) {
                for(var b, c = a.target.files, d = 0; b = c[d]; d++) this.s3uploadFile(b)
            },
            s3uploadFile: function(a) {
                this.s3executeOnSignedUrl(a, $.proxy(function(b) {
                    this.s3uploadToS3(a, b)
                }, this))
            },
            s3executeOnSignedUrl: function(a, b) {
                var c = new XMLHttpRequest,
                    d = "?";
                "-1" != this.opts.s3.search(/\?/) && (d = "&"), c.open("GET", this.opts.s3 + d + "name=" + a.name + "&type=" + a.type, !0), c.overrideMimeType && c.overrideMimeType("text/plain; charset=x-user-defined");
                var e = this;
                c.onreadystatechange = function() {
                    4 == this.readyState && 200 == this.status ? (e.showProgressBar(), b(decodeURIComponent(this.responseText))) : 4 == this.readyState && 200 != this.status
                }, c.send()
            },
            s3createCORSRequest: function(a, b) {
                var c = new XMLHttpRequest;
                return "withCredentials" in c ? c.open(a, b, !0) : "undefined" != typeof XDomainRequest ? (c = new XDomainRequest, c.open(a, b)) : c = null, c
            },
            s3uploadToS3: function(a, b) {
                var c = this.s3createCORSRequest("PUT", b);
                c && (c.onload = $.proxy(function() {
                    if(200 == c.status) {
                        this.hideProgressBar();
                        var a = b.split("?");
                        if(!a[0]) return !1;
                        this.selectionRestore();
                        var d = "";
                        d = '<img id="image-marker" src="' + a[0] + '" />', this.opts.paragraphy && (d = "<p>" + d + "</p>"), this.execCommand("inserthtml", d, !1);
                        var e = $(this.$editor.find("img#image-marker"));
                        e.length ? e.removeAttr("id") : e = !1, this.sync(), this.callback("imageUpload", e, !1), this.modalClose(), this.observeImages()
                    }
                }, this), c.onerror = function() {}, c.upload.onprogress = function() {}, c.setRequestHeader("Content-Type", a.type), c.setRequestHeader("x-amz-acl", "public-read"), c.send(a))
            },
            uploadInit: function(a, b) {
                this.uploadOptions = {
                    url: !1,
                    success: !1,
                    error: !1,
                    start: !1,
                    trigger: !1,
                    auto: !1,
                    input: !1
                }, $.extend(this.uploadOptions, b);
                var c = $("#" + a);
                c.length && "INPUT" === c[0].tagName ? (this.uploadOptions.input = c, this.el = $(c[0].form)) : this.el = c, this.element_action = this.el.attr("action"), this.uploadOptions.auto ? $(this.uploadOptions.input).change($.proxy(function(a) {
                    this.el.submit(function() {
                        return !1
                    }), this.uploadSubmit(a)
                }, this)) : this.uploadOptions.trigger && $("#" + this.uploadOptions.trigger).click($.proxy(this.uploadSubmit, this))
            },
            uploadSubmit: function() {
                this.showProgressBar(), this.uploadForm(this.element, this.uploadFrame())
            },
            uploadFrame: function() {
                this.id = "f" + Math.floor(99999 * Math.random());
                var a = this.document.createElement("div"),
                    b = '<iframe style="display:none" id="' + this.id + '" name="' + this.id + '"></iframe>';
                return a.innerHTML = b, $(a).appendTo("body"), this.uploadOptions.start && this.uploadOptions.start(), $("#" + this.id).load($.proxy(this.uploadLoaded, this)), this.id
            },
            uploadForm: function(a, b) {
                if(this.uploadOptions.input) {
                    var c = "redactorUploadForm" + this.id,
                        d = "redactorUploadFile" + this.id;
                    this.form = $('<form  action="' + this.uploadOptions.url + '" method="POST" target="' + b + '" name="' + c + '" id="' + c + '" enctype="multipart/form-data" />'), this.opts.uploadFields !== !1 && "object" == typeof this.opts.uploadFields && $.each(this.opts.uploadFields, $.proxy(function(a, b) {
                        null != b && 0 === b.toString().indexOf("#") && (b = $(b).val());
                        var c = $("<input/>", {
                            type: "hidden",
                            name: a,
                            value: b
                        });
                        $(this.form).append(c)
                    }, this));
                    var e = this.uploadOptions.input,
                        f = $(e).clone();
                    $(e).attr("id", d).before(f).appendTo(this.form), $(this.form).css("position", "absolute").css("top", "-2000px").css("left", "-2000px").appendTo("body"), this.form.submit()
                } else a.attr("target", b).attr("method", "POST").attr("enctype", "multipart/form-data").attr("action", this.uploadOptions.url), this.element.submit()
            },
            uploadLoaded: function() {
                var a, b = $("#" + this.id)[0];
                if(a = b.contentDocument ? b.contentDocument : b.contentWindow ? b.contentWindow.document : window.frames[this.id].document, this.uploadOptions.success)
                    if(this.hideProgressBar(), "undefined" != typeof a) {
                        var c = a.body.innerHTML,
                            d = c.match(/\{(.|\n)*\}/)[0];
                        d = d.replace(/^\[/, ""), d = d.replace(/\]$/, "");
                        var e = $.parseJSON(d);
                        "undefined" == typeof e.error ? this.uploadOptions.success(e) : (this.uploadOptions.error(this, e), this.modalClose())
                    } else this.modalClose(), alert("Upload failed!");
                this.el.attr("action", this.element_action), this.el.attr("target", "")
            },
            draguploadInit: function(a, b) {
                return this.draguploadOptions = $.extend({
                    url: !1,
                    success: !1,
                    error: !1,
                    preview: !1,
                    uploadFields: !1,
                    text: this.opts.curLang.drop_file_here,
                    atext: this.opts.curLang.or_choose,
                    uploadParam: !1
                }, b), void 0 === window.FormData ? !1 : (this.droparea = $('<div class="redactor_droparea"></div>'), this.dropareabox = $('<div class="redactor_dropareabox">' + this.draguploadOptions.text + "</div>"), this.dropalternative = $('<div class="redactor_dropalternative">' + this.draguploadOptions.atext + "</div>"), this.droparea.append(this.dropareabox), $(a).before(this.droparea), $(a).before(this.dropalternative), this.dropareabox.on("dragover", $.proxy(function() {
                    return this.draguploadOndrag()
                }, this)), this.dropareabox.on("dragleave", $.proxy(function() {
                    return this.draguploadOndragleave()
                }, this)), void(this.dropareabox.get(0).ondrop = $.proxy(function(a) {
                    a.preventDefault(), this.dropareabox.removeClass("hover").addClass("drop"), this.showProgressBar(), this.dragUploadAjax(this.draguploadOptions.url, a.dataTransfer.files[0], !1, a, this.draguploadOptions.uploadParam)
                }, this)))
            },
            dragUploadAjax: function(a, b, c, d, e) {
                if(!c) {
                    var f = $.ajaxSettings.xhr();
                    f.upload && f.upload.addEventListener("progress", $.proxy(this.uploadProgress, this), !1), $.ajaxSetup({
                        xhr: function() {
                            return f
                        }
                    })
                }
                this.callback("drop", d);
                var g = new FormData;
                e !== !1 ? g.append(e, b) : g.append("file", b), this.opts.uploadFields !== !1 && "object" == typeof this.opts.uploadFields && $.each(this.opts.uploadFields, $.proxy(function(a, b) {
                    null != b && 0 === b.toString().indexOf("#") && (b = $(b).val()), g.append(a, b)
                }, this)), $.ajax({
                    url: a,
                    dataType: "html",
                    data: g,
                    cache: !1,
                    contentType: !1,
                    processData: !1,
                    type: "POST",
                    success: $.proxy(function(a) {
                        a = a.replace(/^\[/, ""), a = a.replace(/\]$/, "");
                        var b = "string" == typeof a ? $.parseJSON(a) : a;
                        if(this.hideProgressBar(), c) {
                            var e = $("<img>");
                            e.attr("src", b.filelink).attr("id", "drag-image-marker"), this.insertNodeToCaretPositionFromPoint(d, e[0]);
                            var f = $(this.$editor.find("img#drag-image-marker"));
                            f.length ? f.removeAttr("id") : f = !1, this.sync(), this.observeImages(), f && this.callback("imageUpload", f, b), "undefined" != typeof b.error && this.callback("imageUploadError", b)
                        } else "undefined" == typeof b.error ? this.draguploadOptions.success(b) : (this.draguploadOptions.error(this, b), this.draguploadOptions.success(!1))
                    }, this)
                })
            },
            draguploadOndrag: function() {
                return this.dropareabox.addClass("hover"), !1
            },
            draguploadOndragleave: function() {
                return this.dropareabox.removeClass("hover"), !1
            },
            uploadProgress: function(a, b) {
                var c = a.loaded ? parseInt(a.loaded / a.total * 100, 10) : a;
                this.dropareabox.text("Loading " + c + "% " + (b || ""))
            },
            isMobile: function() {
                return /(iPhone|iPod|BlackBerry|Android)/.test(navigator.userAgent)
            },
            isIPad: function() {
                return /iPad/.test(navigator.userAgent)
            },
            normalize: function(a) {
                return "undefined" == typeof a ? 0 : parseInt(a.replace("px", ""), 10)
            },
            outerHtml: function(a) {
                return $("<div>").append($(a).eq(0).clone()).html()
            },
            stripHtml: function(a) {
                var b = document.createElement("DIV");
                return b.innerHTML = a, b.textContent || b.innerText || ""
            },
            isString: function(a) {
                return "[object String]" == Object.prototype.toString.call(a)
            },
            isEmpty: function(a) {
                return a = a.replace(/&#x200b;|<br>|<br\/>|&nbsp;/gi, ""), a = a.replace(/\s/g, ""), a = a.replace(/^<p>[^\W\w\D\d]*?<\/p>$/i, ""), "" == a
            },
            getInternetExplorerVersion: function() {
                var a = !1;
                if("Microsoft Internet Explorer" == navigator.appName) {
                    var b = navigator.userAgent,
                        c = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                    null != c.exec(b) && (a = parseFloat(RegExp.$1))
                }
                return a
            },
            isIe11: function() {
                return !!navigator.userAgent.match(/Trident\/7\./)
            },
            browser: function(a) {
                var b = navigator.userAgent.toLowerCase(),
                    c = /(opr)[\/]([\w.]+)/.exec(b) || /(chrome)[ \/]([\w.]+)/.exec(b) || /(webkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(b) || /(webkit)[ \/]([\w.]+)/.exec(b) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(b) || /(msie) ([\w.]+)/.exec(b) || b.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(b) || b.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(b) || [];
                return "version" == a ? c[2] : "webkit" == a ? "chrome" == c[1] || "webkit" == c[1] : "rv" == c[1] ? "msie" == a : "opr" == c[1] ? "webkit" == a : a == c[1]
            },
            oldIE: function() {
                return this.browser("msie") && parseInt(this.browser("version"), 10) < 9 ? !0 : !1
            },
            getFragmentHtml: function(a) {
                var b = a.cloneNode(!0),
                    c = this.document.createElement("div");
                return c.appendChild(b), c.innerHTML
            },
            extractContent: function() {
                for(var a, b = this.$editor[0], c = this.document.createDocumentFragment(); a = b.firstChild;) c.appendChild(a);
                return c
            },
            isParentRedactor: function(a) {
                return a ? this.opts.iframe ? a : 0 == $(a).parents("div.redactor_editor").length || $(a).hasClass("redactor_editor") ? !1 : a : !1
            },
            currentOrParentIs: function(a) {
                var b = this.getParent(),
                    c = this.getCurrent();
                return b && b.tagName === a ? b : c && c.tagName === a ? c : !1
            },
            isEndOfElement: function() {
                var a = this.getBlock(),
                    b = this.getCaretOffset(a),
                    c = $.trim($(a).text()).replace(/\n\r\n/g, ""),
                    d = c.length;
                return b == d ? !0 : !1
            },
            isFocused: function() {
                var a, b = this.getSelection();
                return b && b.rangeCount && b.rangeCount > 0 && (a = b.getRangeAt(0).startContainer), a ? this.opts.iframe ? this.getCaretOffsetRange().equals() ? !this.$editor.is(a) : !0 : 0 != $(a).closest("div.redactor_editor").length : !1
            },
            removeEmptyAttr: function(a, b) {
                "" == $(a).attr(b) && $(a).removeAttr(b)
            },
            removeFromArrayByValue: function(a, b) {
                for(var c = null; - 1 !== (c = a.indexOf(b));) a.splice(c, 1);
                return a
            }
        }, Redactor.prototype.init.prototype = Redactor.prototype, $.Redactor.fn.formatLinkify = function(a, b, c, d, e) {
            for(var f = /(((https?|ftps?):\/\/)|www[.][^\s])(.+?\..+?)([.),]?)(\s|\.\s+|\)|$)/gi, g = /(https?|ftp):\/\//i, h = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi, i = (this.$editor ? this.$editor.get(0) : this).childNodes, j = i.length; j--;) {
                var k = i[j];
                if(3 === k.nodeType) {
                    var l = k.nodeValue;
                    if(d && l) {
                        var m = '<iframe width="500" height="281" src="',
                            n = '" frameborder="0" allowfullscreen></iframe>';
                        l.match(reUrlYoutube) ? (l = l.replace(reUrlYoutube, m + "//www.youtube.com/embed/$1" + n), $(k).after(l).remove()) : l.match(reUrlVimeo) && (l = l.replace(reUrlVimeo, m + "//player.vimeo.com/video/$2" + n), $(k).after(l).remove())
                    }
                    if(c && l && l.match(h) && (l = l.replace(h, '<img src="$1">'), $(k).after(l).remove()), b && l && l.match(f)) {
                        var o = l.match(f);
                        for(var j in o) {
                            var p = o[j],
                                q = p,
                                r = "";
                            null !== p.match(/\s$/) && (r = " ");
                            var s = a;
                            null !== p.match(g) && (s = ""), q.length > e && (q = q.substring(0, e) + "..."), q = q.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                            var t = q.replace("$", "$$$");
                            l = l.replace(p, '<a href="' + s + $.trim(p) + '">' + $.trim(t) + "</a>" + r)
                        }
                        $(k).after(l).remove()
                    }
                } else 1 !== k.nodeType || /^(a|button|textarea)$/i.test(k.tagName) || $.Redactor.fn.formatLinkify.call(k, a, b, c, d, e)
            }
        }
    }(jQuery), !RedactorPlugins) var RedactorPlugins = {};
if(RedactorPlugins.fontcolor = {
        init: function() {
            for(var a = ["#ffffff", "#000000", "#eeece1", "#1f497d", "#4f81bd", "#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646", "#ffff00", "#f2f2f2", "#7f7f7f", "#ddd9c3", "#c6d9f0", "#dbe5f1", "#f2dcdb", "#ebf1dd", "#e5e0ec", "#dbeef3", "#fdeada", "#fff2ca", "#d8d8d8", "#595959", "#c4bd97", "#8db3e2", "#b8cce4", "#e5b9b7", "#d7e3bc", "#ccc1d9", "#b7dde8", "#fbd5b5", "#ffe694", "#bfbfbf", "#3f3f3f", "#938953", "#548dd4", "#95b3d7", "#d99694", "#c3d69b", "#b2a2c7", "#b7dde8", "#fac08f", "#f2c314", "#a5a5a5", "#262626", "#494429", "#17365d", "#366092", "#953734", "#76923c", "#5f497a", "#92cddc", "#e36c09", "#c09100", "#7f7f7f", "#0c0c0c", "#1d1b10", "#0f243e", "#244061", "#632423", "#4f6128", "#3f3151", "#31859b", "#974806", "#7f6000"], b = ["fontcolor"], c = 0; 1 > c; c++) {
                var d = b[c],
                    e = $('<ul class="dropdown-menu redactor_dropdown_box_' + d + '" style="display: none; width: 243px;">');
                this.pickerBuild(e, d, a), $(this.$toolbar).append(e);
                var f = this.buttonAddAfter("fontsize", d, this.opts.curLang[d], $.proxy(function(a, b, c, d) {
                    this.dropdownShow(d, a)
                }, this));
                f.data("dropdown", e)
            }
        },
        pickerBuild: function(a, b, c) {
            var d = "color";
            "backcolor" === b && (d = "background-color");
            for(var e = this, f = function(a) {
                    a.preventDefault();
                    var b = $(this);
                    e.pickerSet(b.data("rule"), b.attr("rel"))
                }, g = c.length, h = 0; g > h; h++) {
                var i = c[h],
                    j = $('<a rel="' + i + '" data-rule="' + d + '" href="#" style="float: left; font-size: 0; border: 2px solid #fff; padding: 0; margin: 0; width: 20px; height: 20px;"></li>');
                j.css("background-color", i), a.append(j), j.on("click", f)
            }
        },
        pickerSet: function(a, b) {
            this.bufferSet(), this.$editor.focus(), this.inlineRemoveStyle(a), b !== !1 && this.inlineSetStyle(a, b), this.opts.air && this.$air.fadeOut(100), this.sync()
        }
    }, !RedactorPlugins) var RedactorPlugins = {};
if(RedactorPlugins.fontfamily = {
        init: function() {
            var a = ["Arial", "Helvetica", "Georgia", "Times New Roman", "Monospace"],
                b = this,
                c = {};
            $.each(a, function(a, d) {
                c["s" + a] = {
                    title: d,
                    callback: function() {
                        b.setFontfamily(d)
                    }
                }
            }), c.remove = {
                title: ccmi18n_redactor.remove_font,
                callback: function() {
                    b.resetFontfamily()
                }
            }, this.buttonAddAfter("formatting", "fontfamily", ccmi18n_redactor.change_font_family, !1, c)
        },
        setFontfamily: function(a) {
            this.inlineSetStyle("font-family", a)
        },
        resetFontfamily: function() {
            this.inlineRemoveStyle("font-family")
        }
    }, !RedactorPlugins) var RedactorPlugins = {};
if(RedactorPlugins.fontsize = {
        init: function() {
            var a = [10, 11, 12, 14, 16, 18, 20, 24, 28, 30],
                b = this,
                c = {};
            $.each(a, function(a, d) {
                c["s" + a] = {
                    title: d + "px",
                    callback: function() {
                        b.setFontsize(d)
                    }
                }
            }), c.remove = {
                title: ccmi18n_redactor.remove_font_size,
                callback: function() {
                    b.resetFontsize()
                }
            }, this.buttonAddAfter("fontfamily", "fontsize", ccmi18n_redactor.change_font_size, !1, c)
        },
        setFontsize: function(a) {
            this.inlineSetStyle("font-size", a + "px")
        },
        resetFontsize: function() {
            this.inlineRemoveStyle("font-size")
        }
    }, "undefined" == typeof RedactorPlugins) var RedactorPlugins = {};
RedactorPlugins.concrete5inline = {
    init: function() {
        var a = this;
        this.$toolbar.addClass("ccm-inline-toolbar"), this.$toolbar.append($('<li class="ccm-inline-toolbar-button ccm-inline-toolbar-button-cancel"><button id="ccm-redactor-cancel-button" type="button" class="btn btn-mini">' + ccmi18n_redactor.cancel + '</button></li><li class="ccm-inline-toolbar-button ccm-inline-toolbar-button-save"><button id="ccm-redactor-save-button" type="button" class="btn btn-primary btn-mini">' + ccmi18n_redactor.save + "</button></li>"));
        var b = this.$toolbar;
        $("#ccm-redactor-cancel-button").unbind().on("click", function() {
            b.hide(), $("li#ccm-redactor-actions-buttons").hide(), ConcreteEvent.fire("EditModeExitInline"), a.destroy(), Concrete.getEditMode().scanBlocks()
        }), $("#ccm-redactor-save-button").unbind().on("click", function() {
            $("#redactor-content").val(a.get()), b.hide(), $("#ccm-block-form").submit(), ConcreteEvent.fire("EditModeExitInlineSaved"), ConcreteEvent.fire("EditModeExitInline", {
                action: "save_inline"
            })
        })
    }
}, RedactorPlugins.concrete5 = {
    styles: [],
    createButton: function(a) {
        if(!a) var a = [];
        var b = this;
        b.buttonRemove("styles"), b.buttonGet("formatting").length ? b.buttonAddAfter("formatting", "styles", b.opts.curLang.customStyles, !1, a) : b.buttonAdd("styles", b.opts.curLang.customStyles, !1, a)
    },
    init: function() {
        var a = this;
        $.ajax({
            type: "get",
            dataType: "json",
            url: CCM_DISPATCHER_FILENAME + "/ccm/system/backend/editor_data",
            data: {
                ccm_token: CCM_EDITOR_SECURITY_TOKEN,
                cID: CCM_CID
            },
            success: function(b) {
                dropdownOptions = {}, a.snippetsByHandle = {}, $.each(b.snippets, function(b, c) {
                    a.snippetsByHandle[c.scsHandle] = {
                        scsHandle: c.scsHandle,
                        scsName: c.scsName
                    }, dropdownOptions[c.scsHandle] = {
                        title: c.scsName,
                        callback: function(b) {
                            var c = this,
                                d = a.snippetsByHandle[b],
                                e = String() + '<span class="ccm-content-editor-snippet" contenteditable="false" data-scsHandle="' + d.scsHandle + '">' + d.scsName + "</span>";
                            c.insertHtml(e)
                        }
                    }
                }); {
                    var c = {};
                    a.buttonGet("styles")
                }
                a.styles = b.classes, jQuery.each(b.classes, function(b, d) {
                    c["s" + b] = {
                        title: d.title,
                        className: d.menuClass,
                        callback: function() {
                            a.setCustomFormat(d)
                        }
                    }
                }), c.remove = {
                    title: ccmi18n_redactor.remove_style,
                    callback: function() {
                        a.resetCustomFormat()
                    }
                }, a.createButton(c)
            }
        }), a.createButton()
    },
    setCustomFormat: function(a) {
        -1 == a.forceBlock || 1 != a.forceBlock && (!a.wrap || jQuery.inArray(a.wrap, ["a", "em", "strong", "small", "s", "cite", "q", "dfn", "abbr", "data", "time", "var", "samp", "kbd", "i", "b", "u", "mark", "ruby", "rt", "rp", "bdi", "bdo", "span", "sub", "sup", "code"]) > -1) ? (a.wrap && this.inlineFormat(a.wrap), a.style && this.inlineSetAttr("style", a.style), a.spanClass && this.inlineSetClass(a.spanClass)) : (this.selectionWrap(a.wrap), a.style && this.blockSetAttr("style", a.style), a.spanClass && this.blockSetClass(a.spanClass))
    },
    resetCustomFormat: function() {
        var a = this;
        jQuery.each(this.styles, function(b, c) {
            c.spanClass && (a.inlineRemoveClass(c.spanClass), a.blockRemoveClass(c.spanClass), a.formatBlocks("p"))
        }), this.inlineSetAttr("style", "")
    }
}, RedactorPlugins.underline = {
    init: function() {
        this.buttonAddAfter("italic", "underline", "Underline", this.format)
    },
    format: function() {
        jQuery(this.buttonGet("underline")).hasClass("redactor_act") ? this.inlineRemoveFormat("u") : this.inlineFormat("u")
    }
};