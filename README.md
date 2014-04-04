# UI.Map [![Build Status](https://secure.travis-ci.org/angular-ui/ui-map.png)](http://travis-ci.org/angular-ui/ui-map)

This directive allows you to add [Gaode Maps Javascript API](http://api.amap.com/javascript) elements.

## Requirements

- AngularJS
- [UI.Event](https://github.com/angular-ui/ui-utils/blob/master/modules/event/event.js)
- [Gaode Maps Javascript API 1.2](http://api.amap.com/javascript)

## Usage

You can get it from [Bower](http://bower.io/)

```sh
bower install angular-ui-mapgaode
```  

This will copy the UI.Mapgaode files into a `bower_components` folder, along with its dependencies. Load the script files in your application:

```html
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-ui-utils/modules/event/event.js "></script>
<script type="text/javascript" src="bower_components/angular-ui-mapgaode/src/ui-map.js"></script>
<script src="http://webapi.amap.com/maps?v=1.2&key=yourkey" type="text/javascript"></script>
```

__Make sure to listen to the [callback parameter when loading the Gaode Maps API](http://api.amap.com/javascript/guide#callback) !   
The API must be fully loaded before this module !__  
Here we name this callback `init`. To load your angular app after the Gaode Maps API you can start it with [angular.bootstrap](http://docs.angularjs.org/api/angular.bootstrap). 

```javascript
function init() {
  angular.bootstrap(document.getElementById("map"), ['app.ui-map']);
}
```

Add the UI.Mapgaode module as a dependency to your application module :

```javascript
var myAppModule = angular.module('app.ui-map', ['ui.mapgaode']);
```

Finally, add the directive to your html:

```html
<section id="map" ng-controller="MapCtrl" >
  <div ui-map="myMap" ui-options="mapOptions" class="map-canvas"></div>
</section>
```
Note that `myMap` will be a [AMap.Map class](http://api.amap.com/javascript/reference/map), and `mapOptions` a [AMap.MapOptions object](http://api.amap.com/javascript/reference/map#MapOption) (see [below](#options)).

To see something it's better to add some CSS, like

```css
.map-canvas { height: 400px; }
```

## Options

[AMap.MapOptions object](http://api.amap.com/javascript/reference/map#MapOption) can be passed through the main directive attribute`ui-map`.

```javascript
myAppModule.controller('MapCtrl', ['$scope', function ($scope) {
    $scope.mapOptions = {
      center: new AMap.LngLat(-78.670, 35.784),
      
      // map plugin config
      toolbar: true,
      scrollzoom: true,
      maptype: true,
      overview: true,
      locatecity: true,
      
      // map-self config
      resizeEnable: true, // 是否监控地图容器尺寸变化
      
      // ui map config
      uiMapCache: true // 是否使用缓存来缓存此map dom，而不是每次链接跳转来都重新创建
    };
  }]);
```

### UI.Event

[UI.Event](http://angular-ui.github.io/ui-utils/#/event) allows you to specify custom behavior over user events. You just need to prefix the official event by __map-__ to bind a callback to it.  

For example, the _click_ or *zoomend* event of the [AMap.Map class](http://api.amap.com/javascript/reference/map) can be used through the UI.Event object keys __map-click__ and **map-zoomend** :

```html
<section id="map" ng-controller="MapCtrl" >
  <div  ui-map="myMap"ui-options="mapOptions" class="map-canvas" 
        ui-event="{'map-click': 'addMarker($event, $params)', 'map-zoomend': 'setZoomMessage(myMap.getZoom())' }"
  ></div>
</section>
```


## Testing

We use Karma and jshint to ensure the quality of the code.  The easiest way to run these checks is to use grunt:

```sh
npm install -g grunt-cli
npm install && bower install
grunt
```

The karma task will try to open Firefox and Chrome as browser in which to run the tests.  Make sure this is available or change the configuration in `test\karma.conf.js`


### Grunt Serve

We have one task to serve them all !

```sh
grunt serve
```

It's equal to run separately:

* `grunt connect:server` : giving you a development server at [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

* `grunt karma:server` : giving you a Karma server to run tests (at [http://localhost:9876/](http://localhost:9876/) by default). You can force a test on this server with `grunt karma:unit:run`.

* `grunt watch` : will automatically test your code and build your demo.  You can demo generation with `grunt build:gh-pages`.
