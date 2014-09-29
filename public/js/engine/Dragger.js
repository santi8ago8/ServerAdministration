function Dragger(config) {
    /**
     * config:{
     *      area: element to move
     *      zone: area from where you can move
     * }
     */

    var area = config.area;
    var zone = config.zone;

    //top por ahora no importa.

    area.style.top = area.offsetTop + "px";
    area.style.left = area.offsetLeft + "px";

    var lastX;
    var lastY;
    var move = function (e) {
        var x = e.clientX - lastX;
        var y = e.clientY - lastY;

        area.style.top = parseInt(area.style.top) + y + 'px';
        area.style.left = parseInt(area.style.left) + x + 'px';


        lastX = e.clientX;
        lastY = e.clientY;
    };


    zone.addEventListener('mousedown', function (e) {
        document.addEventListener('mousemove', move);
        lastX = e.clientX;
        lastY = e.clientY;

    });
    document.addEventListener('mouseup', function (e) {
        document.removeEventListener('mousemove', move);
    })
}