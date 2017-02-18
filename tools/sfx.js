"use strict";
const path_1 = require("path");
const fs_1 = require("fs");
const walkSync = require('walk-sync');
const dir = path_1.join(__dirname, '../sfx');
const paths = walkSync(dir, {
    globs: ['*.ogg'],
    directories: false
});
let names = paths.map((path) => path.replace('.ogg', ''));
let audioCode = paths
    .map(path => `<audio src="sfx/${path}" id="${path.replace('.ogg', '')}" preload="auto"></audio>`)
    .join('\n');
audioCode = `console.log('inserting audio tags..');\n document.getElementById('sfx-container').innerHTML = \`${audioCode}\` \n\n`;
let functionsCode = names
    .map(name => `function play_${name}():void {
   let e = document.getElementById("${name}") as HTMLAudioElement 
   if (!localStorage.getItem('muted') && e) {
      e.play()
   }
 } `)
    .join('\n')
    + '// For copy-pasting:\n'
    + names.map(name => `  // play_${name},`)
        .join('\n');
// console.log(audioCode)
// writeFileSync(join(__dirname, '../SfxEnum.ts'), enumCode, console.log)
fs_1.writeFileSync(path_1.join(__dirname, '../audiotags.js'), audioCode, console.log);
fs_1.writeFileSync(path_1.join(__dirname, '../play.ts'), functionsCode, console.log);
// let e = new Map<Sfx, HTMLAudioElement>() 
