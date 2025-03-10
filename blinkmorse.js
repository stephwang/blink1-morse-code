const Blink1 = require('node-blink1')

const blink1 = new Blink1()

const translation = {
  'a': '.-',
  'b': '-...',
  'c': '-.-.',
  'd': '-..',
  'e': '.',
  'f': '..-.',
  'g': '--.',
  'h': '....',
  'i': '..',
  'j': '.---',
  'k': '-.-',
  'l': '.-..',
  'm': '--',
  'n': '-.',
  'o': '---',
  'p': '.--.',
  'q': '--.-',
  'r': '.-.',
  's': '...',
  't': '-',
  'u': '..-',
  'v': '...-',
  'w': '.--',
  'x': '-..-',
  'y': '-.--',
  'z': '--..',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '0': '-----',
  ' ': ' '
}

const DIT_DURATION = 100

/**
 * <i>Note - this function exists for the sake of testing and will not flash your blink(1) device on its own.</i>
 *
 * Calculates the flash timings for a Morse code translation of the given input.
 *
 * The function returns a sequential array representing the length of each flash, where even-indexed
 * entries represent the amount of time that the light was on, and odd-indexed entries represent the amount of time that
 * the light was off.  The value of each element is equivalent to the number of <i>dit</i> durations that have passed.
 *
 * For example, the input "SOS" would return a value of [1, 1, 1, 1, 1, 3, 3, 1, 3, 1, 3, 3, 1, 1, 1, 1, 1 ]
 *
 *
 * @param input the string to translate to Morse code timings.
 * @returns {Number[]} A sequential array representing the length of each flash, where even-indexed entries represent the
 * amount of time that the light was on, and odd-indexed entries represent the amount of time that the light was off.
 * The value is equivalent to the number of <i>dit</i> durations that have passed.
 */
function calculateTimings(input) {
  let onTime = 0, offTime = 0, timings = []
  input.toString()
    .trim()
    .replace(/\s\s+/g, ' ')
    .toLowerCase()
    .split('')
    .map(x => x)
    .forEach(x => {
      const translated = translation[x] ?? ''
      if (translated === '') {
        return
      }
      translated
        .split('')
        .forEach((y) => {
          if (y === ' ') {
            offTime += 2
          } else {
            timings.push(offTime)
            offTime = 0;
            if (y === '.') {
              onTime += 1
            } else {
              onTime += 3
            }
            timings.push(onTime)
            onTime = 0
            offTime += 1
          }
        })
      offTime += 2
    })
  timings.shift()
  return timings
}

/**
 * Causes a connected blink(1) device to flash the given input in Morse code.
 *
 * A <i>dit</i> is defined as 100ms.
 *
 *
 * @param input the string to flash in Morse code.
 */
async function blinkMorse(input) {
  const timings = calculateTimings(input)
  for (let i = 0; i < timings.length; i++){
    const timing = timings[i]
    if (i % 2 === 0) {
      blink1.setRGB(0, 255, 0)
    } else {
      blink1.off()
    }
    await new Promise(done => setTimeout(() => done(), timing * DIT_DURATION))
  }
  blink1.off()
}

exports.calculateTimings = calculateTimings
exports.blinkMorse = blinkMorse