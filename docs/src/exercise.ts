interface Activity {
  duration: number,
  name: string,
  tags: Object,
  onEnd?: Function,
  onStart?: Function,
}

var queue: Activity[] = []
// window.queue = queue

queue.push({
  duration: 4,
  name: "øvelse 1",
  tags: {},
})

queue.push({
  duration: 4,
  name: "øvelse 2",
  tags: {},
  onStart: function (self:Activity) {
    setTimeout(function() {
      play_husk_og_hold_hoften_lee()
    }, self.duration / 2 * 1000)
  },
})

queue.push({
  duration: 4,
  name: "øvelse 3",
  tags: {},
  onStart: function () {
    const tukTuk:Function[] = [play_tuk_tuk3, play_tuktuk, play_tuktuk2, play_tuktuk4, play_tuk_tuk_en_gang]
    tukTuk[Math.floor(Math.random() * tukTuk.length)]()
  },
})
