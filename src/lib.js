'use strict'

let handles = new Set()

document.addEventListener('keypress', (event) => {
  if (event.keyCode === 116) {
    sessionStorage.removeItem('items')
    sessionStorage[ 'items message ' ] = 'items cache was cleared with F5 on ' + new Date()
  }
})

async function loadContent () {
  const req = await fetch("data/items.json")
  console.log(req)
  let items = await req.json()
  console.log(items)

  // checks
  items.forEach(item => {
    console.assert(item.tags instanceof Object, `item should have tags`)
  })

  // set duration to sessionStorage.skip unless its the "change position" item
  if (sessionStorage.skip) {
    items.forEach(item => {
      if (item.duration > sessionStorage.skip) {
        item.duration = sessionStorage.skip
      }
    })
  }

  return items

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

function uninstall (showAlert) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    if (!Array.from(registrations).length ) console.log("no service workers")

    for(let registration of registrations) {
      registration.unregister()
      console.debug("service worker uninstalled", registration)
      if (showAlert) {
        alert("At least 1 service worker uninstalled")
        showAlert = false
      }
    } })
}
