var queue = [];
// window.queue = queue
queue.push({
    duration: 5,
    name: "Get ready...",
});
queue.push({
    duration: 3,
    name: "Normal planke",
    onStart: function (self) {
        setTimeout(function () {
            play_husk_og_hold_hoften_lee();
        }, self.duration / 2 * 1000);
    },
});
queue.push({
    duration: 5,
    name: "Tuk tuk",
    onStart: function () {
        const tukTuk = [play_tuk_tuk3, play_tuktuk, play_tuktuk2, play_tuktuk4, play_tuk_tuk_en_gang];
        tukTuk[Math.floor(Math.random() * tukTuk.length)]();
    },
});
