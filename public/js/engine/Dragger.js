define('engine/Dragger', ['boq', 'boq.dom'], function (b) {
    /**
     * config:{
     *      area: element to move
     *      zone: area from where you can move
     * }
     */
    return function (config) {

        var area = config.area;
        var zone = config.zone;

        //top por ahora no importa.

        area.css('top', area.f().offsetTop + "px");
        area.css('left', area.f().offsetLeft + "px");

        var lastX;
        var lastY;
        var move = function (e) {
            var x = e.clientX - lastX;
            var y = e.clientY - lastY;

            area.css('top', parseInt(area.css('top')) + y + 'px');
            area.css('left', parseInt(area.css('left')) + x + 'px');


            lastX = e.clientX;
            lastY = e.clientY;
        };


        zone.on('mousedown', function (e) {
            document.addEventListener('mousemove', move);
            lastX = e.clientX;
            lastY = e.clientY;

        });
        document.addEventListener('mouseup', function (e) {
            document.removeEventListener('mousemove', move);
        })

    }

});