'use strict';
(function () {
    var app = angular.module('ui.mapgaode', ['ui.event']);
    //Setup map events from a google map object to trigger on a given element too,
    //then we just use ui-event to catch events from an element
    function bindMapEvents(scope, eventsStr, googleObject, element) {
        angular.forEach(eventsStr.split(' '), function (eventName) {
            //Prefix all googlemap events with 'map-', so eg 'click'
            //for the googlemap doesn't interfere with a normal 'click' event
            window.AMap.event.addListener(googleObject, eventName, function (event) {
                element.triggerHandler('map-' + eventName, event);
                //We create an $apply if it isn't happening. we need better support for this
                //We don't want to use timeout because tons of these events fire at once,
                //and we only need one $apply
                if (!scope.$$phase) {
                    scope.$apply();
                }
            });
        });
    }

    app.value('uiMapConfig', {}).directive('uiMap', [
        'uiMapConfig',
        '$parse',
        function (uiMapConfig, $parse) {
            var mapEvents = 'complete click dblclick mapmove movestart moveend zoomchange zoomstart zoomend mousemove mousewheel mouseover mouseout mouseup mousedown rightclick dragstart dragging dragend resize touchstart touchmove touchend';
            var options = uiMapConfig || {};
            return {
                restrict: 'A',
                controller: function ($scope, $element) {
                },
                link: function (scope, elm, attrs) {
                    var map;

                    var opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));
                    if (opts.uiMapCache && window[attrs.uiMapCache]) {
                        elm.replaceWith(window[attrs.uiMapCache]);
                        map = window[attrs.uiMapCache+"Map"];
                    } else {

                        map = new window.AMap.Map(elm[0], opts);
                        /**************** add AMap plugins *******************************/
                        if (opts.toolbar) {
                            map.plugin(["AMap.ToolBar"], function () {
                                var toolBar = new AMap.ToolBar({
                                    ruler: opts.ruler
                                });
                                map.addControl(toolBar);
                            });
                        }

                        if (opts.maptype == "SATELLITE") {
                            map.plugin(["AMap.MapType"], function () {
                                //地图类型切换
                                /* MaptypeOptions	 类型	 说明
                                 defaultType  	Number	 初始化默认图层类型。 取值为0：2D地图 取值为1：卫星图 默认值：0
                                 showTraffic	    Boolean	 叠加实时交通图层 默认值：false
                                 showRoad 	    Boolean	 叠加路网图层 默认值：false
                                 */
                                var type = new AMap.MapType({
                                    defaultType: 1,
                                    showRoad: true
                                });
                                map.addControl(type);
                            });
                        } else if (opts.maptype) {
                            map.plugin(["AMap.MapType"], function () {
                                var type = new AMap.MapType({
                                    defaultType: 0,
                                    showRoad: true
                                });
                                map.addControl(type);
                            });
                        }

                        if (opts.overview) {
                            map.plugin(["AMap.OverView"], function () {
                                //加载鹰眼
                                var view = new AMap.OverView({
                                    isOpen: opts.overview.isOpen || false
                                });
                                map.addControl(view);
                            });
                        }

                        if (opts.uiMapCache) {
                            window[attrs.uiMapCache+"Map"] = map;
                            scope.$on("$destroy", function () {
                                window[attrs.uiMapCache] = elm;
                            });
                        }
                        /*********************** end add AMap plugins ****************/
                    }
                    var model = $parse(attrs.uiMap);
                    //Set scope variable for the map
                    model.assign(scope, map);
                    bindMapEvents(scope, mapEvents, map, elm);
                }
            };
        }
    ]);
    app.value('uiMapInfoWindowConfig', {}).directive('uiMapInfoWindow', [
        'uiMapInfoWindowConfig',
        '$parse',
        '$compile',
        function (uiMapInfoWindowConfig, $parse, $compile) {
            var infoWindowEvents = 'change open close';
            var options = uiMapInfoWindowConfig || {};
            return {
                link: function (scope, elm, attrs) {
                    var opts = angular.extend({}, options, scope.$eval(attrs.uiOptions));
                    opts.content = elm[0];
                    var model = $parse(attrs.uiMapInfoWindow);
                    var infoWindow = model(scope);
                    if (!infoWindow) {
                        infoWindow = new window.AMap.InfoWindow(opts);
                        model.assign(scope, infoWindow);
                    }
                    bindMapEvents(scope, infoWindowEvents, infoWindow, elm);
                    /* The info window's contents dont' need to be on the dom anymore,
                     google maps has them stored.  So we just replace the infowindow element
                     with an empty div. (we don't just straight remove it from the dom because
                     straight removing things from the dom can mess up angular) */
                    elm.replaceWith('<div></div>');
                    //Decorate infoWindow.open to $compile contents before opening
                    var _open = infoWindow.open;
                    infoWindow.open = function open(a1, a2, a3, a4, a5, a6) {
                        $compile(elm.contents())(scope);
                        _open.call(infoWindow, a1, a2, a3, a4, a5, a6);
                    };
                }
            };
        }
    ]);
    /*
     * Map overlay directives all work the same. Take map marker for example
     * <ui-map-marker="myMarker"> will $watch 'myMarker' and each time it changes,
     * it will hook up myMarker's events to the directive dom element.  Then
     * ui-event will be able to catch all of myMarker's events. Super simple.
     */
    function mapOverlayDirective(directiveName, events) {
        app.directive(directiveName, [function () {
            return {
                restrict: 'A',
                link: function (scope, elm, attrs) {
                    scope.$watch(attrs[directiveName], function (newObject) {
                        if (newObject) {
                            bindMapEvents(scope, events, newObject, elm);
                        }
                    });
                }
            };
        }]);
    }

    mapOverlayDirective('uiMapMarker', 'click dblclick rightclick mousemove mouseover mouseout mousedown mouseup dragstart dragging dragend moving moveend movealong touchstart touchmove touchend');
    mapOverlayDirective('uiMapPolyline', 'click dblclick rightclick hide show mousedown mouseup mouseover mouseout change touchstart touchmove touchend');
    mapOverlayDirective('uiMapPolygon', 'click dblclick rightclick hide show mousedown mouseup mouseover mouseout change touchstart touchmove touchend');
    //mapOverlayDirective('uiMapRectangle', 'bounds_changed click dblclick mousedown mousemove mouseout mouseover ' + 'mouseup rightclick');
    mapOverlayDirective('uiMapCircle', 'click dblclick rightclick hide show mousedown mouseup mouseover mouseout change touchstart touchmove touchend');
    mapOverlayDirective('uiMapGroundImage', 'click dblclick');
}());