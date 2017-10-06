'use strict'

let handles = new Set()

document.addEventListener('keypress', (event) => {
  if (event.keyCode === 116) {
    sessionStorage.removeItem('items')
    sessionStorage[ 'items message ' ] = 'items cache was cleared with F5 on ' + new Date()
  }
})

function loadContent () {
  console.debug("to shorten the time, for debugging, set sessionStorage.skip = 2 (seconds)")
  return new Promise((resolve, reject) => {
    let items = null
    try {
      if (sessionStorage.items) {
        items = JSON.parse(sessionStorage.items)
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
        console.log(response.items)
          let items = response.items
            .filter(item => item.fields.set_id === sessionStorage.set_id)
            .map(item => item.fields)
          items.forEach((item) => {if (!item.order) item.order = 0 })
          items = items.sort((a, b) => a.order - b.order) // sort ascending
          items.forEach(item => console.info(item.order + ' ' + item.name + ' ' + item.duration))
          let pause = {
            duration: 1,
            name: "Skift",
            tags: {
              change: 1,
            },
          }
          let items2 = []
          items.forEach((item, index) => {
            if (index > 0) {
              items2.push(pause)
            }
            items2.push(item)
          })
          items = items2
          items.forEach((item) => {if (!item.tags) item.tags = {} }) // fix tags
          if (sessionStorage.skip) items.forEach(item => {item.duration = (item.tags.change) ? 1 : parseFloat(sessionStorage.skip)}) // set duration to sessionStorage.skip unless its the "change position" item
          resolve(items)
          sessionStorage.items = JSON.stringify(items)
        })
        .catch(reject)
    }
  })
}

function toggleFullScreen () {
  if (!sessionStorage.hasPlayed) {
    sessionStorage.hasPlayed = 1
    play_vi_venter_lige_paa_oliver()
  }

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

const tukTuk = [
  play_tuk_tuk3, play_tuktuk, play_tuktuk2, play_tuktuk4, play_tuk_tuk_en_gang,
  play_tuk_tuk3,
]
const randomStuff = [
  play_nice_slow,
  play_det_jo_ren_afslapning,
  play_vi_kan_godt_grine_igennem_det_naeste,
  play_complaining_is_always_good,
  play_husk_hoften_den_sku_vaere_plan,
  play_husk_og_hold_hoften_lee,
  play_fart1,
  play_lee_kom_nu,
  play_hold_boette,
  play_hvorfor_goer_vi_det_her,
  play_det_kan_jeg_godt_li,
  play_stille_og_rolige_bevaegelser,
  play_jeg_kan_godt_maerke_det_3_gang,
]
const keepAssDown = [
  play_but_lower_your_butt,
  play_husk_numserne_de_skal_ned,
  play_husk_numserne_skal_ned,
  play_ned_med_numsen,
  play_ned_med_numserne,
]
const dones = [
  // play_done_for_today,
  play_dette_er_den_nye_planke,
  play_nu_gider_jeg_ikke_lave_den_mere,
  play_alright_lets_call_it_a_day,
]

function playRandomFromArray (array, delay) {
  if (!array || array.length === 0) {
    console.info("did not play random", array)
  }
  else {
    const idx = Math.floor(Math.random() * array.length)
    const sound = array[idx]
    if (delay) {
      const h = setTimeout(sound, delay * 1000)
      handles.add(h)
      if (delay > 100) console.warn("Delay is way too long?",delay,array)
    }
    else {
      sound()
    }
    array.splice(idx, 1)
  }
}

(function () {
  const classes = []

  for (let i = 1; i < 60; i++) {
    classes.push(`
    .duration-visual--${i} {
      animation-timing-function: cubic-bezier(.42,.24,.59,.45);
      animation-name: my_animation;
    }
    .duration-visual--${i} { animation-duration: ${i}s }
    `)
  }

  const e = document.createElement('style')
  e.innerHTML = classes.join('\n')
  document.head.appendChild(e)
  console.debug('inserted animation classes')
})()

function uninstall () {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    if (!Array.from(registrations).length ) console.log("no service workers")

    for(let registration of registrations) {
      registration.unregister()
      console.debug("service worker uninstalled", registration)
    } })
}