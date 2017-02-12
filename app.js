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

angular.module('app').component('app', {
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

    const grace = (navigator.userAgent.indexOf("Firefox") > -1) ? 10 : 0
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
    }

    function onLastEnd (item) {
      console.debug('Done. (onLastEnd)', item)
      play_fanfare()
      self.index = 0
      running = false
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
      play_coin()
      let e = document.querySelector('#duration-visual')
      let animationClass = 'duration-visual--' + item.duration
      console.assert(item.duration, "should be duration")
      e.setAttribute('class', '')
      setTimeout(() => e.classList.add(animationClass), grace)
      if (!item.tags.pause) {
        setTimeout(() => {
          console.debug("random")
        }, item.duration * 1 / 3 + item.duration * 1 / 2 * Math.random() * 1000)
      }
    }

    function random () {
      const sounds = [
        play_nice_slow,
        play_alright_lets_call_it_a_day,
        play_det_jo_ren_afslapning,
        play_vi_kan_godt_grine_igennem_det_naeste,
        play_complaining_is_always_good
      ]
      sounds[ Math.floor(Math.random() * sounds.length) ]()
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

document.addEventListener('keypress', (event) => {
  if (event.keyCode === 116) {
    localStorage.removeItem('items')
    localStorage[ 'items cache was cleared with F5 on ' + new Date() ] = ''
  }
})

function loadContent () {
  return new Promise((resolve, reject) => {
    let items = null
    try {
      if (localStorage.items) {
        items = JSON.parse(localStorage.items)
      }
    }
    catch (e) {
      console.error(e.message)
    }
    if (items !== null) {
      resolve(items)
    }
    else {
      const SPACE_ID = 'xcc5bcpq1bzl'
      const ACCESS_TOKEN = '7c2d47447f69007013be6ea72b531db3748dd971f6acbcd3f4d831491f6f9013'
      const client = contentful.createClient({
        space: SPACE_ID,
        accessToken: ACCESS_TOKEN
      })
      client.getEntries()
        .then((response) => {
          let items = response.items.map(item => item.fields)
          items.forEach((item) => {if (!item.order) item.order = 0 })
          items = items.sort((a, b) => a.order - b.order) // sort ascending
          items.forEach(item => console.debug(item.order + ' ' + item.name))
          let pause = {
            duration: 1,
            name: "Pause",
          }
          let items2 = []
          items.forEach((item, index) => {
            if (index > 0) {
              items2.push(pause)
            }
            items2.push(item)
          })
          items = items2
          items.forEach(item => console.debug(item.name))
          items.forEach((item) => {if (!item.tags) item.tags = {} }) // fix tags
          setTimeout(() => {localStorage.items = JSON.stringify(items)}, 100)
          resolve(items)
        })
        .catch(reject)
    }
  })
}

function toggleFullScreen () {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||
    (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

setTimeout(function () {
  let classes = []

  for (let i = 1; i < 60; i++) {
    classes.push(`
  .duration-visual--${i} {
    animation-timing-function: cubic-bezier(.42,.24,.59,.45);
    animation-name: my_animation;
  }
  .duration-visual--${i} { animation-duration: ${i}s }`)
  }

  let e = document.createElement('style')
  e.innerHTML = classes.join('\n')
  document.head.appendChild(e)
}, 50)