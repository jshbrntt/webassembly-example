import wasm from './main.rs'

const colorSelector = {
  rgbas: [],
  colors: ['1abc9c', '16a085', '2ecc71', '27ae60', '4caf50', '8bc34a', 'cddc39', '3498db', '2980b9', '34495e', '2c3e50', '2196f3', '03a9f4', '00bcd4', '009688', 'e74c3c', 'c0392b', 'f44336', 'e67e22', 'd35400', 'f39c12', 'ff9800', 'ff5722',
    'ffc107', 'f1c40f', 'ffeb3b', '9b59b6', '8e44ad', '9c27b0', '673ab7', 'e91e63', '3f51b5', '795548', '9e9e9e', '607d8b', '7f8c8d', '95a5a6', 'bdc3c7', 'ecf0f1', 'efefef'
  ],
  rgba: function (color) {
    return {
      r: parseInt(color.substring(0, 2), 16),
      g: parseInt(color.substring(2, 4), 16),
      b: parseInt(color.substring(4, 6), 16)
    }
  },
  init: function () {
    this.colors.forEach((color, i) => {
      this.rgbas[i] = this.rgba(color)
    })
  }
}
colorSelector.init()

wasm.initialize({
  noExitRuntime: true
}).then(Module => {
  const update = Module.cwrap('update', null, ['number', 'number', 'number'])
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')
  const width = window.innerWidth
  const height = window.innerHeight
  canvas.width = width
  canvas.height = height
  const image = ctx.createImageData(width, height)
  const column = ~~(width)
  const bufsize = ~~(height) * column
  const bufptr = Module._malloc(bufsize)
  function dropPoint (e) {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const i = (y - 1) * width + x
    buf[i] = true
  }
  canvas.addEventListener('click', dropPoint, false)
  Module._memset(bufptr, 0, bufsize)
  let buf = new Uint8Array(Module.HEAPU8.buffer, bufptr, bufsize)
  for (let i = 0; i < buf.length; i++) {
    buf[i] = false
  }
  const tick = () => {
    requestAnimationFrame(() => {
      let t0 = performance.now()
      update(bufsize, buf.byteOffset, column)
      let t1 = performance.now()
      for (let i = 0; i < bufsize; i += 1) {
        if (buf[i]) {
          let color = colorSelector.rgbas[(~~(colorSelector.colors.length * (i / buf.length)))]
          image.data[i * 4] = color.r
          image.data[i * 4 + 1] = color.g
          image.data[i * 4 + 2] = color.b
        } else {
          image.data[i * 4] = 0xFF
          image.data[i * 4 + 1] = 0xFF
          image.data[i * 4 + 2] = 0xFF
          image.data[i * 4 + 3] = 0xFF
        }
      }
      ctx.putImageData(image, 0, 0)
      tick()
    })
  }
  tick()
})
