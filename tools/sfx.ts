import {join} from "path";
import {writeFileSync} from "fs";
const walkSync = require('walk-sync');

const dir = join(__dirname, '../sfx')

const paths:string[] = walkSync(dir, {
  globs: ['*.ogg'],
  directories: false });

let names:string[] = paths.map((path:string) => path.replace('.ogg', ''))

let audioCode = paths
  .map(path => `<audio src="sfx/${path}" id="${path.replace('.ogg','')}" preload="auto"></audio>`)
  .join('\n')

audioCode = `console.log('inserting audio tags..');\n document.getElementById('sfx-container').innerHTML = \`${audioCode}\` \n\n`

let functionsCode = names
  .map(name => `function play_${name}():void {
   let e = document.getElementById("${name}") as HTMLAudioElement
   if (e) {
      e.play()
   }
   else {
      console.error('did not find audio element "${name}"')
   }
 } `)
  .join('\n')

// console.log(audioCode)
// writeFileSync(join(__dirname, '../SfxEnum.ts'), enumCode, console.log)

writeFileSync(join(__dirname, '../audiotags.js'), audioCode, console.log)
writeFileSync(join(__dirname, '../play.ts'), functionsCode, console.log)

// let e = new Map<Sfx, HTMLAudioElement>()