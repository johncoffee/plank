'use strict'

angular.module("app", ['ngMaterial'])

angular.module("app").config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('orange')
})

angular.module("app").config(function() {
  if (!Routes[sessionStorage.route]) {
    // default route
    sessionStorage.route = Routes.PLANKE
  }
})

angular.module('app').component('plankApp', {
  template: `
    <sound-board ng-if="$ctrl.route == ${Routes.SOUND_BOARD}"></sound-board>    
    <plank       ng-if="$ctrl.route == ${Routes.PLANKE}"></plank>
    <glossary    ng-if="$ctrl.route == ${Routes.GLOSSARY}"></glossary>
`,
  controller: function () {
    Object.defineProperty(this, 'route', {
      get: () => sessionStorage.route,
    })
  },
})

angular.module('app').component('soundBoard', {
  template: `

<md-content md-colors="{background: 'blue'}" class="screen">
    <div layout="row">
        <div flex="0">
            <md-button ng-click="$ctrl.menu()" class="md-raised" style="margin: 1.5rem 0 0 1rem">back</md-button>
        </div>
        <div flex="grow" layout-align="center center">     
           <h1 style="text-align: center">The Sound Board</h1>
        </div>
    </div>
  
    <div>
        <div ng-repeat="item in ::$ctrl.items" style="display: inline-block">
            <md-button ng-click="$ctrl.play($index)"
                       aria-label="::item"
                       ng-bind="::item"></md-button>
        </div>
    </div>
</md-content>
    
`,
  controller: function () {
    this.sounds = []
    this.items = []

    sfxMap.forEach((v, k) => {
      this.sounds.push(v)
      let name = Sound[k].toString().replace(/^play_/i, '').replace(/_/g, ' ').trim()
      this.items.push(name)
    })

    this.menu = () => {
      sessionStorage.route = Routes.PLANKE
    }

    this.play = function (index) {
      if (this.sounds[index]) {
        this.sounds[index]()
      }
      else {
        console.log('did not play?', index, this.sounds)
      }
    }

  },
})

angular.module('app').component('glossary', {
  template: `
<md-content md-colors="{background: 'yellow'}" class="screen">
    <div layout="row">
        <div flex="0">
            <md-button ng-click="$ctrl.menu()" class="md-raised" style="margin: 1.5rem 0 0 1rem">back</md-button>
        </div>
        <div flex="grow">     
           <h1 style="text-align: center">Danske klatreord</h1>
        </div>
    </div>
  
    
      <md-list>
          <md-list-item class="md-2-line"  ng-repeat="item in ::$ctrl.items">
            <div class="md-list-item-text">            
                <h2 ng-bind="::item.term"></h2>
                <p ng-bind="::item.description"></p>
            </div>
          </md-list-item>           
      </md-list>
  
   <div layout="row">
      <div>
        <p style="margin-left: 2rem;">
          <md-button ng-click="$ctrl.menu()" class="md-raised">back</md-button>
        </p>
      </div>
      <div flex="grow">               
        <p style="text-align: center">Ændringsforslag? <a href="https://github.com/johncoffee/plank">Åben en halingsforespørgsel.</a></p>
      </div>
    </div>
  
</md-content>    
`,
  controller: function () {
    this.items = [
      {term: "Plet", description: "Lille bitte struktur til at stå på, oftest bedst til fødder."},
      {term: "Kneb", description: "Greb man ikke kan holde om, men knibe eller klemme."},
      {term: "Krømp", description: "Små greb, hvor der kun er plads til fingrespidserne."},
      {term: "Krukke", description: "Stort og komfortabelt greb med plads til begge hænder."},
      {term: "Knæfald", description: "Metode til at bære vægt ved at dreje knæet."},
      {term: "Sidetræk", description: "Greb der har retning til højre eller venstre."},
      {term: "Topover", description: "Når en rute slutter med at man kravler op på en kampesten."},
      {term: "Bakke", description: "Et rundt greb uden skarpe kanter."},
      {term: "Tåkrog", description: "At bruge tæerne som en krog under et greb."},
      {term: "Hælkrog", description: "At bruge hælen til at hive i et greb eller et volumen."},
      {term: "Klip", description: "En lille hudafskrabning."},
      {term: "Kampesten", description: "Stor sten."},
      {
        term: "Kampestensklatring",
        description: "At klatre op ad en stor sten, uden andet sikkerhedsudstyr end en faldmåtte."
      },
      {term: "Lomme", description: "En sprække man kan holde fast i."},
      {term: "Snaps", description: "Flydende klatrekalk."},
      {term: "Sovs", description: "Løs klatrekalk."},
      {
        term: "Klatrekalk",
        description: "Tørringsmiddel, magnesium karbonate (MgCO3), en bedre udgave af kartoffelmel."
      },
      {term: "Faldmåtte", description: "En type mobil stødpude brugt til bouldering udendørs."},
      {
        term: "Undertræk",
        description: "Et greb der bedst bruges ved at holde oppe fra og ned, mens man stemmer imod med føderne."
      },
    ].sort((a, b) => a.term > b.term)

    this.menu = () => {
      sessionStorage.route = Routes.PLANKE
    }
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
  </div>
</div>
<div class="screen" style="z-index: 10">
  <div class="hover-button" style="top: 1rem; bottom: auto;">
    <div layout="row" layout-align="space-between none">        
         <div></div>                       
         <div style="margin-left: 2rem">        
           <md-button class="md-button" ng-click="$ctrl.menu()" aria-label="menu">MENU</md-button>          
         </div>    
    </div>
  </div>      
  <div class="hover-button">
    <div layout="row" layout-align="space-between none">        
       <div></div>                       
       <div style="margin-right: 2rem">    
       
          <md-button class="md-button"
            ng-click="$ctrl.muted = !$ctrl.muted" 
       aria-label="{{$ctrl.muted ? 'unmute' : 'mute'}}"
            ng-bind="$ctrl.muted ? 'unmute' : 'mute'"></md-button>
       
          <md-button class="md-button md-raised"          
            ng-click="$ctrl.skip()"                        
            ng-disabled="!$ctrl.running()"
            aria-label="skip">SKIP</md-button>
                                                                                
          <md-button class="md-button md-raised"
           ng-class="{'md-accent': $ctrl.running(), 'md-primary': !$ctrl.running()}"
           ng-click="$ctrl.running() ? $ctrl.stop() : $ctrl.start(0, 3)"
           ng-bind="$ctrl.running() ? 'stop' : 'start'"
        aria-label="{{$ctrl.running() ? 'stop' : 'start'}}"></md-button>
       </div>            
    </div>
  </div>
</div>
  `,
  bindings: {},
  controller: function ($window, $scope, $mdColorPalette, bottomMenu) {
    const self = this
    const queue = $window.queue
    this.queue = $window.queue

    let primary = 'indigo'
    const colours = Object.keys($mdColorPalette).filter(colour => colour !== primary)
    const numColours = colours.length

    const grace = (navigator.userAgent.indexOf("Firefox") > -1) ? 20 : 10
    let running = false
    this.index = 0
    this.setsLeft = 0
    this.text = "LOADING..."
    this.textTop = ""

    Object.defineProperty(this, 'muted', {
      get: () => !!localStorage.muted,
      set: (value) => localStorage.muted = (value) ? '1' : ''
    })

    try {
      loadRemoteContents()
    }
    catch (e) {
      console.error(e)
    }

    async function loadRemoteContents () {
      queue.length = 0
      const result = await loadContent()
      result.forEach(item => queue.push(item))
      self.stop() // use reset here
      $scope.$apply()
    }

    this.menu = function () {
      bottomMenu.show()
    }

    this.rotateColours = () => {
      this.bgColour = this.progressColour = ''
      while (this.bgColour === this.progressColour) {
        this.bgColour = colours[Math.floor(numColours * Math.random())]
        this.progressColour = colours[Math.floor(numColours * Math.random())]
      }
    }

    this.rotateColours()

    this.running = function () {
      return running
    }

    function onLastStart (item) {
      console.debug('onLastStart', item)
    }

    function onGetReadyStart () {
      console.debug('get ready START')
      self.text = 'Get ready...'
      self.textTop = ''
      document.getElementById('duration-visual')
        .setAttribute('class', 'duration-visual--3')
    }

    function onGetReadyEnd () {
      console.debug('get ready stop')
    }

    function onSetStart () {
      self.setsLeft--
      console.debug('on set START')
    }

    function onSetEnd () {
      console.debug('onSetEnd')
      play_fanfare()
      playRandomFromArray(dones, 2.5)
    }

    function onLastEnd (item) {
      console.debug('Done. (onLastEnd)', item)
    }

    function onEnded (item) {
      console.debug('Done or stopped. (onEnded)', item)
      self.text = "PLANKING TIME"
      self.textTop = "PRESS START"
    }

    function onFirstStart (item) {
      console.debug('first start', item)
    }

    function onFirstEnd (item) {
      console.debug('first end', item)
    }

    function onStart (item, index) {
      console.debug('starts', item.name)
      self.text = item.name

      self.rotateColours()

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
        playAfter(() => {
          play_Blip3();
          self.text = 1
        }, item.duration - 1.1)
        playAfter(() => {
          play_Blip2();
          self.text = 2
        }, item.duration - 2.1)
        playAfter(() => {
          play_Blip1();
          self.text = 3
        }, item.duration - 3.1)
      }

      const nextItem = queue[index + 2]
      if (nextItem && !nextItem.tags.change) {
        self.textTop = nextItem.name
      }
    }

    function onEnd (item) {
      play_biipbiip()
      console.debug('ends', item)
      self.textTop = ""
      $scope.$apply()
    }

    function onHalfTime (item, index, queue) {
    }

    function playAfter (callback, seconds) {
      if (seconds > 100) console.warn("Alt for langt timeout", seconds)
      const handle = setTimeout(() => {
        callback()
        if (!$scope.$$phase) {
          $scope.$apply()
        }
      }, seconds * 1000)

      handles.add(handle)
    }

    this.stop = function () {
      running = false
      onEnded(self.queue[self.index])

      handles.forEach(handle => clearTimeout(handle))
      handles.clear()

      self.index = 0

      document.getElementById('duration-visual')
        .setAttribute('class', '')
    }

    this.start = function (index, numSets) {
      self.index = index

      if (!this.running()) {
        self.setsLeft = numSets
        running = true
        if (index === 0) {
          const secondsToStart = 3
          onGetReadyStart()
          playAfter(() => onGetReadyEnd(), secondsToStart)

          playAfter(() => self.startItem(index, self.setsLeft > 0), secondsToStart)
        }
        else {
          // start immediately
          self.startItem(index, self.setsLeft > 0)
        }
      }
      else {
        console.warn("is running!")
      }
    }

    this.startItem = function (index, loop) {
      const item = queue[index]
      this.index = index
      console.assert(item, "There should be item", index, queue)

      if (index === queue.length) {
        onLastStart(item, index)
      }
      if (index === 0) {
        onFirstStart(item, index)
        onSetStart(item, index)
      }
      if (item.onStart) item.onStart(item, index)
      onStart(item, index)

      playAfter(() => onHalfTime(item, index, queue), item.duration * 0.5)

      playAfter(() => {
        if (index === 0) {
          onFirstEnd(item, index)
        }
        if (item.onEnd) item.onEnd(item, index)
        onEnd(item, index)

        // start next or end set?
        if (index === queue.length - 1) {
          onLastEnd(item, index)
          if (this.setsLeft === 0) {
            running = false
            onSetEnd(item)
            onEnded(item)
          }
          else {
            this.startItem(0, this.setsLeft > 0)
          }
        }
        else {
          this.startItem(index + 1, loop)
        }
      }, item.duration)
    }

    this.skip = function() {
      const continueAtSet = this.setsLeft
      const continueAtIndex = (this.index+1 >= this.queue.length) ? 0 : this.index+1
      this.stop()
      this.start(continueAtIndex, continueAtSet)
    }

    $scope.$on('$destroy', () => {
      this.stop()
      console.debug(`scope destroyed. Stopped things.`)
    })
  }
})

angular.module('app').service('bottomMenu', class {
  constructor ($mdBottomSheet) {
    this.$mdBottomSheet = $mdBottomSheet

    this.items = [
      {
        name: "Sound Board",
        fn: () => {
          $mdBottomSheet.hide()
          sessionStorage.route = Routes.SOUND_BOARD
        }
      },
      {
        name: "danske klatrebegreber",
        fn: () => {
          $mdBottomSheet.hide()
          sessionStorage.route = Routes.GLOSSARY
        },
      },
      {
        name: "Uninstall app",
        fn: () => window.uninstall()
      },
      {
        name: "Full screen",
        fn: () => window.toggleFullScreen()
      },
    ]
  }

  show () {
    let self = this
    this.$mdBottomSheet.show({
      controller: function () {
        this.items = self.items
      },
      controllerAs: "$ctrl",
      template: `
  <md-bottom-sheet class="md-list md-has-header">
    <md-subheader>Super useful stuff</md-subheader>
    <md-list>
      <md-list-item ng-repeat="item in $ctrl.items">
        <md-button
            aria-label="item.name"
            md-autofocus="$index == 0"
            ng-click="item.fn()"
            class="md-list-item-content">
          <span class="md-inline-list-icon-label" ng-bind="item.name"></span>
        </md-button>

      </md-list-item>
    </md-list>
  </md-bottom-sheet>
`,
    })
  }
})
