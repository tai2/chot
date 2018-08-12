import fs from 'fs'
import path from 'path'
import screenshot from 'screenshot-desktop'
import shutterWav from './shutter.wav'

const shutterSound = new Audio(shutterWav)
const FILENAME_BASE = ''
const FILENAME_EXT = 'png'
const FILENAME_REGEX = new RegExp(`${FILENAME_BASE}(\\d+)\\.${FILENAME_EXT}`)

function readdir(dirPath, options) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, options, (err, files) => {
      if (err) {
        reject(err)
        return
      }

      resolve(files)
    })
  })
}

export async function makeNextFilename(ctx) {
  const files = await readdir(ctx.dirPath, 'utf8')
  const nums = files
    .map(file => FILENAME_REGEX.exec(file))
    .filter(match => match)
    .map(match => parseInt(match[1], 10))

  const nextNum = Math.max(...nums, ctx.startNumber - 1) + 1
  return `${FILENAME_BASE}${nextNum}.${FILENAME_EXT}`
}

export async function takeScreenshot(displayId, ctx) {
  shutterSound.play()

  const nextFilename = await makeNextFilename(ctx)

  await screenshot({
    screen: displayId,
    filename: path.join(ctx.dirPath, nextFilename),
  })
}
