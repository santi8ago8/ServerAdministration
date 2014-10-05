/**
 * Created by santi8ago8 on 01/10/14.
 */
sA.directive('zindex', function () {

    var zindexdir = {};

    var orderzindex = function (elements, el) {


        var mayor = 1;
        //buscar mayor.
        angular.forEach(elements, function (e) {
            var conv = parseInt(e.css('z-index'));
            if (!isNaN(conv) && conv > mayor) {
                mayor = conv;
            }
        });
        el.css('z-index', ++mayor);

    };

    //TODO: prevent memory leaks.


    return {
        restrict: 'A',
        link: function (scope, $element, attrs) {
            //console.log(attrs);

            if (typeof zindexdir[attrs.zindex] === 'undefined') {
                zindexdir[attrs.zindex] = [];
                zindexdir[attrs.zindex].$sid = scope.$id;

            }

            zindexdir[attrs.zindex].push($element);

            $element.on('mousedown', function () {
                orderzindex(zindexdir[attrs.zindex], $element);
            });
        }
    };
});