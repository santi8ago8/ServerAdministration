/**
 * User: santi8ago8
 * GitHub: https://github.com/santi8ago8/boq.js
 */
(function (window) {

    function defineDomFunctions(Boq) {

        /**
         * set or get the html of selected nodes
         * @param {string} [html] html to set
         * @returns {string|*}
         */
        Boq.utils.qs.adds.html = function (html) {
            if (typeof html === 'undefined') {
                if (typeof this[0] !== 'undefined')
                    return this[0].innerHTML;
            }
            this.each(function (it) {
                it.innerHTML = html;
            });
            return this;
        };

        /**
         * set or get the text of selected nodes
         * @param {string} [text] text to set
         * @returns {string|*}
         */
        Boq.utils.qs.adds.text = function (text) {
            if (typeof text === 'undefined') {
                if (typeof this[0] !== 'undefined')
                    if (this[0].innerText)
                        return this[0].innerText;
                    else
                        return this[0].textContent;
            }
            this.each(function (it) {
                if (it.innerText)
                    it.innerText = text;
                else
                    it.textContent = text;
            });
            return this;
        };

        /**
         * set or get the html of selected nodes
         * @param {string} name name of the attribute
         * @param {string} [value] value to set in the attribute
         * @returns {string|*}
         */
        Boq.utils.qs.adds.attr = function (name, value) {
            if (typeof value === 'undefined') {
                if (typeof this[0] !== 'undefined')
                    return this[0].getAttribute(name);
            }
            this.each(function (it) {
                it.setAttribute(name, value);
            });
            return this;
        };

        /**
         * set or get the style rule in the selected nodes
         * @param {string} name name of the style
         * @param {string} [value] value to set in the rule
         * @returns {string|*}
         */
        Boq.utils.qs.adds.css = function (name, value) {
            if (typeof value === 'undefined') {
                if (typeof this[0] !== 'undefined')
                    return this[0].style[name];
            }
            this.each(function (it) {
                it.style[name] = value;
            });
            return this;
        };

        /**
         * hide with css the selected nodes
         * @returns {*}
         */
        Boq.utils.qs.adds.hide = function () {
            return this.adds.css.call(this, 'display', 'none');
        };

        /**
         * show with css the selected nodes
         * @returns {*}
         */
        Boq.utils.qs.adds.show = function () {
            return this.adds.css.call(this, 'display', '');
        };

        /**
         * remove from dom the selected nodes
         * @returns {*}
         */
        Boq.utils.qs.adds.remove = function () {
            return this.each(function (it) {
                if (it.remove) it.remove();
                else {
                    it.parentNode.removeChild(it);
                }
            });
        };

        /**
         * attach event of the selected nodes
         * @param {string} type name of the event
         * @param {function} cb cb that will trigger when the event is triggered
         * @returns {null|*|boq.Array}
         */
        Boq.utils.qs.adds.on = function (type, cb) {
            return this.each(function (it) {
                if (it.addEventListener)
                    it.addEventListener(type, cb, false);
                else
                    it.attachEvent('on' + type, cb);
            })
        };

        /**
         * detach event of the selected nodes
         * @param {string} type name of the event
         * @param {function} cb cb that will trigger when the event is triggered
         * @returns {null|*|boq.Array}
         */
        Boq.utils.qs.adds.off = function (type, cb) {
            return this.each(function (it) {
                if (it.removeEventListener)
                    it.removeEventListener(type, cb);
                else
                    it.detachEvent('on' + type, cb);
            })
        };

        /**
         * set or get the width of the selected nodes
         * @param {string|int} [width]
         * @returns {int|Boq.Array}
         */
        Boq.utils.qs.adds.width = function (width) {
            if (typeof width === 'undefined') { //return width;
                return this.f().offsetWidth;
            } else {
                if (!isNaN(width))
                    width += 'px';
                return this.adds.css.call(this, 'width', width);
            }
        };

        /**
         * set or get the height of the selected nodes
         * @param {string|int} [height]
         * @returns {int|Boq.Array}
         */
        Boq.utils.qs.adds.height = function (height) {
            if (typeof height === 'undefined') { //return width;
                return this.f().offsetHeight;
            } else {
                if (!isNaN(height))
                    height += 'px';
                return this.adds.css.call(this, 'height', height);
            }
        };

    }

    if (typeof Boq == 'undefined' && typeof require !== 'undefined') {
        define('boq.dom',['boq'],function(boq){
            defineDomFunctions(boq);
            return boq;
        })
    }
    else {
        defineDomFunctions(Boq || boq);
    }
}(window));