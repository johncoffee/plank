"use strict"

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  console.log(url.pathname)

  if (url.origin === location.origin && url.pathname === "/plank/") {
    event.respondWith(caches.match("/plank/index.html"))
    return
  }

  event.respondWith(caches.match(event.request)
    .then(response => response || fetch(event.request))
  )

})

const files = [
  "//npmcdn.com/contentful@3.3.5/browser-dist/contentful.min.js",
  "//ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.min.js",
  "//ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-animate.min.js",
  "//ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular-aria.min.js",
  "//ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.min.js",
  "//ajax.googleapis.com/ajax/libs/angular_material/1.1.1/angular-material.min.css",

  "Routes.js",
  "exercise.js",
  "play.js",
  "lib.js",
  "enums.js",
  "saveContent.js",

  "style.css",
  "app.js",
  "audiotags.js",
]

self.addEventListener('install', event => {
  console.log(event)

  event.waitUntil( caches.open("static-v0.1")
      .then(cache => cache.addAll(files))
  )
})