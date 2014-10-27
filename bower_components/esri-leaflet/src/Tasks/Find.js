EsriLeaflet.Tasks.Find = EsriLeaflet.Tasks.Task.extend({
  setters: {
    // method name > param name
    'contains': 'contains',
    'text': 'searchText',
    'fields': 'searchFields[]', // denote an array or single string
<<<<<<< HEAD
    'spatialReference': 'sr',
    'sr': 'sr',
=======
    'spatialReference': 'spatialReference',
    'sr': 'spatialReference',
>>>>>>> d522b84d3395ffeebab22c020a51c35daec2a891
    'layers': 'layers[]',
    'returnGeometry': 'returnGeometry',
    'maxAllowableOffset': 'maxAllowableOffset',
    'precision': 'geometryPrecision',
    'dynamicLayers': 'dynamicLayers',
    'returnZ' : 'returnZ',
    'returnM' : 'returnM',
    'gdbVersion' : 'gdbVersion',
    'token' : 'token'
  },

  path: 'find',

  params: {
    sr: 4326,
    contains: true,
    returnGeometry: true,
    returnZ: true,
    returnM: false
  },

  layerDefs: function (id, where) {
    this.params.layerDefs = (this.params.layerDefs) ? this.params.layerDefs + ';' : '';
    this.params.layerDefs += ([id, where]).join(':');
    return this;
  },

  simplify: function(map, factor){
    var mapWidth = Math.abs(map.getBounds().getWest() - map.getBounds().getEast());
    this.params.maxAllowableOffset = (mapWidth / map.getSize().y) * factor;
    return this;
  },

  run: function (callback, context) {
    return this.request(function(error, response){
      callback.call(context, error, (response && EsriLeaflet.Util.responseToFeatureCollection(response)), response);
    }, context);
  }
});

EsriLeaflet.Tasks.find = function (url, params) {
  return new EsriLeaflet.Tasks.Find(url, params);
};