$(document).ready(function () {
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (str) {
            return !this.indexOf(str);
        }
    }
});


var Collection = {
    ForEach: function (arr, fn) {
        for (var i = 0; i < arr.length; i++)
            fn(arr[i]);
    }
};


var Convert = {
    toBoolean: function (input) {
        return /^true$/i.test(input) ? true : false;
    }
};

var Helpers = {
    getDigits: function (input) {
        var str = '';
        for (var i = 0; i < input.length; i++)
            if (!isNaN(input.charAt(i)))
                str += input.charAt(i);

        return str;
    },
    
    String: {
        toReplacePattern: function (str) {
            return new RegExp('{{' + str + '}}', 'g');
        }
    },

    Object: {
        valueOrUndefined: function (obj, valueIfUndefined) {
            return typeof (obj) === 'undefined' ? valueIfUndefined : obj;
        },
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        isObject: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        },
        isNullOrEmpty: function (obj) {
            return obj === null || typeof (obj) === 'undefined' || obj === '';
        }
    }
};

var Siga = {
    Ajax: {
        Url: '/Ajax/',
        get: function (action, args, fnDone) {
            var fn = fnDone;
            $.ajax({
                url: Siga.Ajax.Url + action + '?args=' + args,
                beforeSend: function (xhr) {
                    console.log('calling: ' + Siga.Ajax.Url + '?args=' + args);
                    Siga.UI.loading();
                }
            })
            .done(function (data) {
                if (Convert.toBoolean(data)) {
                    console.log(fn);
                    eval(fn);
                }
                else
                    Phidelis.UI.alert('Ops! Não foi possível executar a ação. Tente novamente mais tarde.');
            });
        }
    },

    UI: {
        toggleLoading: function () {
            $('#loadingModal').modal('toggle');

            var isIE = window.ActiveXObject || "ActiveXObject" in window;
            if (isIE) {
                $('.modal').removeClass('fade');
            }
        },

        alert: function (msg) {
            console.log(msg);
        }
    },

    Message: {
        View: function (title, msg) {
            var $messageTitle = $('#message-title'),
                $messageBody = $('#message-body');

            $messageBody.html(msg);
            $messageTitle.html(title);

            $('.list-group-message').each(function () { $(this).removeClass('active'); });

        }
    },

    Student: {
        Incident: {
            parentIsAware: function (id, senderId) {
                $.ajax({
                    url: Phidelis.Ajax.Url + 'AwareOfIncident?args=' + id,
                    beforeSend: function (xhr) {
                        Phidelis.UI.toggleLoading();
                    }
                })
                .done(function (data) {
                    console.log(data);
                    Phidelis.UI.toggleLoading();
                    var digits = Helpers.getDigits(data);

                    console.log(parseInt(digits));

                    var dateUpdated = new Date(parseInt(digits));

                    if (typeof (dateUpdated) !== 'undefined' && dateUpdated !== null) {
                        $('#' + senderId).replaceWith('<small style="font-weight: bold">Ciente em ' + dateUpdated.toLocaleString('pt-BR') + '</small>');
                    }
                    else {
                        $('#' + senderId).replaceWith('<small>Tente novamente mais tarde.</small>');
                    }
                });
            }
        }
    },

    Widgets: {

        CollapsableNavPill: {
            collapseButton: undefined,

            collapse: function ($navPill) {
                $('a', $navPill).each(function () {
                    var $navPillItem = $(this);
                    $('.glyphicon', $navPillItem).each(function () {
                        var $anchorIcon = $(this);
                        $anchorIcon.next().hide();
                    });
                });

                $navPill.parent().removeClass('col-sm-3').addClass('col-sm-1');
                $navPill.parent().next().removeClass('col-sm-9').addClass('col-sm-11');
            },

            init: function ($collapseButton) {

            }
        },

        HoverGroup: {
            handleHover: function ($obj, entering) {
                var $myHoverGroup = $obj.data('hovergroup');
                var groups = $myHoverGroup.replace(/\s{2,}/g, ' ').split(' ');

                Collection.ForEach(groups, function (item) {
                    var cssClass = $obj.data('cssgroup-' + item) || 'hover-group-selected';
                    $('*[data-isingroup-' + item + '="true"]').toggleClass(cssClass);
                    if (entering)
                        $obj.addClass('group-pivot');
                    else
                        $obj.removeClass('group-pivot');
                });
            },
            init: function () {
                $('.hover-group').each(function () {
                    var $this = $(this);
                    var $myHoverGroup = $this.data('hovergroup');
                    var groups = $myHoverGroup.replace(/\s{2,}/g, ' ').split(' ');

                    Collection.ForEach(groups, function (item) {
                        $this.attr('data-isingroup-' + item, 'true');
                    });

                    $this.hover(
                        function () {
                            Phidelis.Widgets.HoverGroup.handleHover($(this), true);
                        },
                        function () {
                            Phidelis.Widgets.HoverGroup.handleHover($(this), false);
                        }
                    );
                });
            }
        }
    }
};