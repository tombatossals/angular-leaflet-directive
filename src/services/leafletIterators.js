angular.module('leaflet-directive').factory('leafletIterators', function ($log, leafletHelpers) {

    var $lhelp = leafletHelpers,
        errorHeader = leafletHelpers.errorHeader + 'leafletIterators: ';

    var _hasErrors = function(collection, cb, ignoreCollection, cbName){
        if(!ignoreCollection) {
            if (!$lhelp.isDefined(collection) || !$lhelp.isDefined(cb)) {
                $log.error(errorHeader + 'collection or cb undefined');
                return true;
            }
        }
        if(!$lhelp.isFunction(cb)){
            cbName = $lhelp.defaultTo(cb,'cb');
            $log.error(errorHeader + cbName + ' is not a function');
            return true;
        }
        return false;
    };

    var _iterate = function(collection, externalCb, internalCb){
        if(_hasErrors(undefined, internalCb, true, 'internalCb')){
            return;
        }
        if(!_hasErrors(collection, externalCb)){
            for(var key in collection){
                internalCb(collection[key], key);
            }
        }
    };


    //consider adding lodash or underscore but for now adding iterators as we need them
    var _each = function(collection, cb){
        _iterate(collection, cb, function(val, key){
            cb(val, key);
        })
    };

    //lodash or underscore have preference
    return _ ? _ : {
        each:_each
    };
});
