'use strict'

angular.module("app", ['ngMaterial'])

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
  controller: function ($timeout) {
    this.loading = (location.host.indexOf('localhost') === -1)
    $timeout(() => {
      this.loading = false
    }, 2000)
  },
})

angular.module('app').component('plank', {
  template: `
<div class="screen" style="z-index: 0;" md-colors="{'background': $ctrl.bgColour}"></div>

<div id="duration-visual" style="z-index: 2;" class="" md-colors="{'background': $ctrl.progressColour}"></div>

<div class="screen" style="z-index: 5">
  <div layout="column"
       layout-align="center center"  
       style="height: 100%;">      
    
    <h1 class="md-display-3 header" ng-bind="$ctrl.text"></h1>
    <div class="md-display-1 subheader" ng-bind="$ctrl.textTop"></div>
    
    <div class="hover-button">
      <div layout="row">   
        <div layout="row" layout-align="end end">
            <md-button class="md-button md-raised" 
              ng-click="$ctrl.muted = !$ctrl.muted" 
              ng-bind="$ctrl.muted ? 'unmute' : 'mute'"></md-button>
                                     
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
</div>
  `,
  bindings: {},
  controller: function ($window, $scope, $mdColorPalette) {
    const self = this
    const queue = $window.queue
    this.queue = $window.queue

    let primary = 'indigo'
    const colours = Object.keys($mdColorPalette).filter(colour => colour !== primary)
    const numColours = colours.length

    const grace = (navigator.userAgent.indexOf("Firefox") > -1) ? 20 : 10
    let running = false
    this.index = 0
    this.text = "PLANKEN"
    this.textTop = "PRESS START"

    Object.defineProperty(this, 'muted', {
      get: () => !!localStorage.muted,
      set: (value) => localStorage.muted = (value) ? '1' : ''
    })

    loadContent().then(result => {
      queue.length = 0
      result.forEach(item => queue.push(item))
      $scope.$apply()
    })
      .catch(error => console.error(error))

    this.rotateColours = () => {
      this.bgColour = colours[Math.floor(numColours * Math.random())]
      this.progressColour = colours[Math.floor(numColours * Math.random())]
      if (this.bgColour === this.progressColour) {
        this.rotateColours()
      }
    }

    this.rotateColours()

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
    }

    function onLastEnd (item) {
      console.debug('Done. (onLastEnd)', item)
      play_fanfare()
      playRandomFromArray(dones, 2.5)
      self.text = ''
      self.textTop = ''
      self.index = 0
      running = false
      $scope.$apply()
    }

    function onFirstStart (item) {
      running = true
      console.debug('first start', item)
    }

    function onFirstEnd (item) {
      console.debug('first end', item)
    }

    function onStart (item) {
      console.debug('starts', item.name)
      self.text = item.name

      let animationClass = 'duration-visual--' + item.duration
      console.assert(item.duration, "should be duration")
      document.getElementById('duration-visual').setAttribute('class', '')
      setTimeout(() => document.getElementById('duration-visual').setAttribute('class', animationClass), grace)

      if (!item.tags.change) {
        playRandomFromArray(randomStuff, item.duration * 0.375 + item.duration * 0.3 * Math.random())

        if (item.tags.tuktuk) {
          playRandomFromArray(tukTuk)
        }
        else if (item.tags.diagonal) {
          playRandomFromArray(keepAssDown)
        }

        // countdown visual
        playAfter(() => {play_Blip3(); self.text = 1}, item.duration-1.1, true)
        playAfter(() => {play_Blip2(); self.text = 2}, item.duration-2.1, true)
        playAfter(() => {play_Blip1(); self.text = 3}, item.duration-3.1, true)
      }
    }

    function onEnd (item) {
      self.rotateColours()
      $scope.$apply()
      play_biipbiip()
      console.debug('ends', item)
      self.textTop = ""
    }

    function onHalfTime (item, index, queue) {
      const nextItem = index+2 < queue.length ? queue[index+2] : undefined
      if (item.tags && !item.tags.change && nextItem) {
        self.textTop = nextItem.name
      }
    }

    function playAfter(callback, seconds, apply) {
      if (seconds > 100) console.warn("Alt for langt timeout", seconds)
      const handle = setTimeout(() => {
        callback()
        if (apply && !$scope.$$phase) {
          $scope.$apply()
        }
      }, seconds * 1000)

      handles.add(handle)
    }

    this.stop = function () {
      self.text = ''
      self.textTop = ''

      handles.forEach(handle => clearTimeout(handle))
      handles = new Set()

      running = false
      self.index = 0

      document.getElementById('duration-visual')
        .setAttribute('class', '')
    }

    this.start = function () {
      if (!this.running()) {
        this.text = 'Get ready...'
        this.textTop = ''
        document.getElementById('duration-visual')
          .setAttribute('class', 'duration-visual--3')
        playAfter( () => self.startItem(), 3, true)
      }
      else {
        console.debug("is running")
      }
    }

    this.startItem = function () {
      const item = queue[this.index]
      const index = this.index++
      console.assert(item, "There should be item")

      if (index === queue.length) {
        onLastStart(item, index)
      }
      if (index === 0) {
        onFirstStart(queue[index], index)
      }
      if (item.onStart) item.onStart(item, index)
      onStart(item, index)

      playAfter( () => onHalfTime(item, index, queue), item.duration * 0.5, true)

      if (index <= queue.length) {
        playAfter(() => {
          if (index === 0) {
            onFirstEnd(item, index)
          }
          if (item.onEnd) item.onEnd(item, index)
          onEnd(item, index)
          if (self.index < queue.length) {
            this.startItem()
          }
          else {
            onLastEnd(item, index)
          }
        }, item.duration, true)
      }
    }
  }
})
