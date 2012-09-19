(function (angular) {
	
	var module = angular.module("angular-leaflet-directive-demo", ["leaflet-directive"]);

})(window.angular);

function DemoController($scope) {
    angular.extend($scope, {
        center: { lat: 40.094882122321145, lng: -3.8232421874999996 },
        marker: { lat: 40.094882122321145, lng: -3.8232421874999996 },
        message: "Drag me to your position",
        zoom: 4
    });
}
