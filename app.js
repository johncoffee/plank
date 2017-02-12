'use strict'

angular.module("app", [ 'ngMaterial' ])

angular.module("app").config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('orange')

  $mdThemingProvider.enableBrowserColor({
    theme: 'default', // Default is 'default'
    palette: 'primary', // Default is 'primary', any basic material palette and extended palettes are available
    hue: '800' // Default is '800'
  });
})

angular.module('app').component('plankApp', {
  template: `
    <plank ng-if="$ctrl.loading === false"></plank>
<h2 ng-if="$ctrl.loading">Loading more..</h2>`,
  controller: function ($timeout, $window, $scope) {
    this.loading = (location.host.indexOf('localhost') === -1)
    $timeout(() => {
      this.loading = false
    }, 2000)
  },
})

angular.module('app').component('plank', {
  template: `
<div id="duration-visual"></div>

<div layout="row" layout-align="center center" style="height: 100%; position:relative; z-index: 1">
  <h1 class="md-display-3"
   ng-bind="$ctrl.text"></h1>
  
  <div class="hover-button">
    <div layout="row">   
      <div layout="row" layout-align="end end">
          <md-button class="md-button md-raised" 
            ng-click="$ctrl.fullscreen()">immersive mode</md-button>
                                   
          <md-button class="md-button md-raised"
           ng-class="{'md-accent': $ctrl.running(), 'md-primary': !$ctrl.running()}"
          ng-click="$ctrl.running() ? $ctrl.stop() : $ctrl.start()"
           ng-bind="$ctrl.running() ? 'stop' : 'start'"></md-button>
      </div>
    </div>
  </div>
</div>
  `,
  bindings: {},
  controller: function ($timeout, $window, $scope) {
    const self = this
    const queue = $window.queue
    this.queue = $window.queue

    const grace = (navigator.userAgent.indexOf("Firefox") > -1) ? 20 : 0
    let handle
    let running = false
    this.index = 0
    this.text = ""

    if (localStorage.dev) {
      $timeout(() => self.start(), 200)
    }

    loadContent().then(result => {
      queue.length = 0
      result.forEach(item => queue.push(item))
      $scope.$apply()
    })
      .catch(error => console.error(error))

    this.fullscreen = function () {
      toggleFullScreen()
      if (!self.hasPlayed) {
        self.hasPlayed = true
        play_vi_venter_lige_paa_oliver()
      }
    }

    this.running = function () {
      return running
    }

    function onLastStart (item) {
      console.debug('onLastStart', item)
      setTimeout( play_whoow, 2000 )
    }

    function onLastEnd (item) {
      console.debug('Done. (onLastEnd)', item)
      play_fanfare()
      setTimeout(play_done_for_today, 1000)
      self.index = 0
      running = false
    }

    function onFirstStart (item) {
      running = true
      setTimeout( play_dette_er_den_nye_planke, 1900 )
      console.debug('first start', item)
    }

    function onFirstEnd (item) {
      console.debug('first end', item)
    }

    function onStart (item) {
      console.debug('starts', item.name)
      self.text = item.name
      play_coin()
      let e = document.querySelector('#duration-visual')
      let animationClass = 'duration-visual--' + item.duration
      console.assert(item.duration, "should be duration")
      e.setAttribute('class', '')
      setTimeout(() => e.classList.add(animationClass), grace)
      console.debug(item.tags)
      if (!item.tags.pause) {
        console.debug("random")
        playRandomFromArray(randomStuff, item.duration * 1 / 2 + item.duration * 1 / 3 * Math.random())

        if(item.tags.tuktuk) {
          playRandomFromArray(tukTuk)
        }
        if(item.tags.diagonal) {
          playRandomFromArray(keepAssDown)
        }
      }
    }

    function onEnd (item) {
      console.debug('ends', item)
      self.text = ""
    }

    this.stop = function () {
      $timeout.cancel(handle)
      self.text = ""
      running = false
      self.index = 0

      let e = document.querySelector('#duration-visual')
      e.setAttribute('class', '')
    }

    this.start = function () {
      if (!this.running()) {
        this.startItem()
      }
      else {
        console.debug("is running")
      }
    }

    this.startItem = function () {
      const index = this.index++
      const item = queue[ index ]

      if (index === queue.length) {
        onLastStart(item, index)
      }
      if (index === 0) {
        onFirstStart(queue[ index ], index)
      }
      if (item.onStart) item.onStart(item, index)
      onStart(item, index)

      if (index <= queue.length) {
        handle = $timeout(() => {
          if (index === 0) {
            onFirstEnd(item, index)
          }
          if (item.onEnd) item.onEnd(item, index)
          onEnd(item, index)
          if (index < queue.length) {
            this.startItem()
          }
          else {
            onLastEnd(item, index)
          }
        }, item.duration * 1000)
      }
    }
  }
})
