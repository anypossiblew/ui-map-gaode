/* global console:false, google:false */
/*jshint unused:false */
'use strict';

function initCall() {
  console.log('Gaode maps api initialized.');
  angular.bootstrap(document.getElementById('map'), ['doc.ui-map']);
}

angular.module('doc.ui-map', ['ui.map', 'ui.bootstrap'])
  .controller('MapCtrl', ['$scope', function ($scope) {

    $scope.myMarkers = [];

        $scope.mapOptions = {
            // map plugin config
            toolbar: true,
            scrollzoom: true,
            maptype: true,
            overview: true,
            locatecity: true,
            // map-self config
            resizeEnable: true,
            // ui map config
            uiMapCache: true
        }

    $scope.addMarker = function ($event, $params) {
      $scope.myMarkers.push(new AMap.Marker({
        map: $scope.myMap,
        position: $params[0].lnglat
      }));
    };

    $scope.setZoomMessage = function (zoom) {
      $scope.zoomMessage = 'You just zoomed to ' + zoom + '!';
      console.log(zoom, 'zoomed');
    };

    $scope.openMarkerInfo = function (marker) {
      $scope.currentMarker = marker;
      $scope.currentMarkerLat = marker.getPosition().getLat();
      $scope.currentMarkerLng = marker.getPosition().getLng();
      $scope.myInfoWindow.open($scope.myMap, marker.getPosition( ));
    };

    $scope.setMarkerPosition = function (marker, lat, lng) {
      marker.setPosition(new AMap.LngLat(lng, lat));
    };
  }])
;