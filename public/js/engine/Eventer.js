define('engine/Eventer', function () {
    return function (target) {
        var events = {};
        target = target ? target : this;
        target.on = function (type, cb, scope) {
            checkType(type);
            events[type].push({cb: cb, scope: scope});
            return target;
        };
        target.off = function (type, cb) {
            checkType(type);
            if (!cb) events[type] = [];
            else {
                for (var i = 0; i < events[type].length; i++) {
                    var o = events[type][i];
                    if (o.cb == cb)
                        events[type].splice(i--, 1);
                }
            }
            return target;
        };
        target.emit = function (type, data) {
            checkType(type);
            var args = Array.apply([], arguments).splice(1);
            for (var i = 0; i < events[type].length; i++) {
                var o = events[type][i];
                o.cb.apply(o.scope || target, args);
            }
            return target;
        };
        function checkType(type) {
            if (typeof events[type] === 'undefined')
                events[type] = [];
        }
    }
});