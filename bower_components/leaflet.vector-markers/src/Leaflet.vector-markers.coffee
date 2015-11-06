#
#  Leaflet.VectorMarkers, a plugin that adds colorful iconic svg markers for Leaflet, based on the Font Awesome icons
#  (c) 2014, Mathias Schneider
#
#  Version: 0.0.3
#
#  http://leafletjs.com
#  https://github.com/hiasinho
#

#global L

((window, document, undefined_) ->
  "use strict"

  #
  #     * Leaflet.VectorMarkers assumes that you have already included the Leaflet library.
  #
  L.VectorMarkers = {}
  L.VectorMarkers.version = "1.0.0"
  L.VectorMarkers.MAP_PIN = 'M16,1 C7.7146,1 1,7.65636364 1,15.8648485 C1,24.0760606 16,51 16,51 C16,51 31,24.0760606 31,15.8648485 C31,7.65636364 24.2815,1 16,1 L16,1 Z'
  L.VectorMarkers.Icon = L.Icon.extend(
    options:
      iconSize: [ 30, 50 ]
      iconAnchor: [ 15, 50 ]
      popupAnchor: [ 2, -40 ]
      shadowAnchor: [ 7, 45 ]
      shadowSize: [ 54, 51 ]
      className: "vector-marker"
      prefix: "fa"
      spinClass: "fa-spin"
      extraClasses: ""
      icon: "home"
      markerColor: "blue"
      iconColor: "white"

    initialize: (options) ->
      options = L.Util.setOptions(this, options)

    createIcon: (oldIcon) ->
      div = (if (oldIcon and oldIcon.tagName is "DIV") then oldIcon else document.createElement("div"))
      options = @options

      icon = @_createInner()  if options.icon

      pin_path = L.VectorMarkers.MAP_PIN

      div.innerHTML = '<svg width="32px" height="52px" viewBox="0 0 32 52" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
                        '<path d="' + pin_path + '" fill="' + options.markerColor + '"></path>' +
                        icon +
                      '</svg>'
      @_setIconStyles div, "icon"
      @_setIconStyles div, "icon-" + options.markerColor
      div

    _createInner: ->
      iconClass = undefined
      iconSpinClass = ""
      iconColorClass = ""
      iconColorStyle = ""
      options = @options
      if options.prefix is '' or options.icon.slice(0, options.prefix.length + 1) is options.prefix + "-"
        iconClass = options.icon
      else
        iconClass = options.prefix + "-" + options.icon
      iconSpinClass = options.spinClass  if options.spin and typeof options.spinClass is "string"
      if options.iconColor
        if options.iconColor is "white" or options.iconColor is "black"
          iconColorClass = "icon-" + options.iconColor
        else
          iconColorStyle = "style='color: " + options.iconColor + "' "
      "<i " + iconColorStyle + "class='" + options.extraClasses + " " + options.prefix + " " + iconClass + " " + iconSpinClass + " " + iconColorClass + "'></i>"

    _setIconStyles: (img, name) ->
      options = @options
      size = L.point(options[(if name is "shadow" then "shadowSize" else "iconSize")])
      anchor = undefined
      if name is "shadow"
        anchor = L.point(options.shadowAnchor or options.iconAnchor)
      else
        anchor = L.point(options.iconAnchor)
      anchor = size.divideBy(2, true)  if not anchor and size
      img.className = "vector-marker-" + name + " " + options.className
      if anchor
        img.style.marginLeft = (-anchor.x) + "px"
        img.style.marginTop = (-anchor.y) + "px"
      if size
        img.style.width = size.x + "px"
        img.style.height = size.y + "px"

    createShadow: ->
      div = document.createElement("div")
      @_setIconStyles div, "shadow"
      div
  )
  L.VectorMarkers.icon = (options) ->
    new L.VectorMarkers.Icon(options)
) this, document
