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
  console.debug('inserted animation classes')
}, 50)