/*
 * Leaflet.ExtraMarkers is a near copy of Leaflet.AwesomeMarkers (c) 2012-2013, Lennard Voogdt, https://github.com/lvoogdt
 * Making color changes and adding shapes are what drove me to make this copy and not a fork...
 */

/*global L*/

(function (window, document, undefined) {
    "use strict";

    L.ExtraMarkers = {};

    L.ExtraMarkers.version = '1.0.1';

    L.ExtraMarkers.Icon = L.Icon.extend({
        options: {
            iconSize: [35, 45],
            iconAnchor:   [17, 42],
            popupAnchor: [1, -32],
            shadowAnchor: [10, 12],
            shadowSize: [36, 16],
            className: 'extra-marker',
            prefix: '',
            extraClasses: '',
            shape: 'circle',
            icon: '',
            markerColor: 'red',
            iconColor: '#fff'
        },

        initialize: function (options) {
            options = L.Util.setOptions(this, options);
        },

        createIcon: function () {
            var div = document.createElement('div'),
                options = this.options;

            if (options.icon) {
                div.innerHTML = this._createInner();
            }

            if (options.bgPos) {
                div.style.backgroundPosition =
                    (-options.bgPos.x) + 'px ' + (-options.bgPos.y) + 'px';
            }

            this._setIconStyles(div, options.shape + '-' + options.markerColor);
            return div;
        },

        _createInner: function() {
            var iconClass, iconSpinClass = "", iconColorClass = "", iconColorStyle = "", options = this.options;

            if(options.iconColor) {
                iconColorStyle = "style='color: " + options.iconColor + "' ";
            }

            return "<i " + iconColorStyle + "class='" + options.extraClasses + " " + options.prefix + " " + options.icon + "'></i>";
        },

        _setIconStyles: function (img, name) {
            var options = this.options,
                size = L.point(options[name === 'shadow' ? 'shadowSize' : 'iconSize']),
                anchor;

            if (name === 'shadow') {
                anchor = L.point(options.shadowAnchor || options.iconAnchor);
            } else {
                anchor = L.point(options.iconAnchor);
            }

            if (!anchor && size) {
                anchor = size.divideBy(2, true);
            }

            img.className = 'extra-marker-' + name + ' ' + options.className;

            if (anchor) {
                img.style.marginLeft = (-anchor.x) + 'px';
                img.style.marginTop  = (-anchor.y) + 'px';
            }

            if (size) {
                img.style.width  = size.x + 'px';
                img.style.height = size.y + 'px';
            }
        },

        createShadow: function () {
            var div = document.createElement('div');

            this._setIconStyles(div, 'shadow');
            return div;
        }
    });

    L.ExtraMarkers.icon = function (options) {
        return new L.ExtraMarkers.Icon(options);
    };

}(this, document));
