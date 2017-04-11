const baseSize = 425

Polymer({
  is: "nishiwaki-logo-composer",
  properties: {
    file: {
      value: null
    },
    image: {
      value: null
    },
    text: {
      value: "西脇 太郎"
    }
  },
  observers: [
    "drawLogo(logo)",
    "setImage(file)",
    "render(ctx, logo, image, text)",
    "drawText(textImage)"
  ],
  attached() {
    this.set("width", baseSize)
    this.set("height", baseSize)
    this.setLogo()
    this.setCtx()
  },
  setCtx() {
    const {$: {canvas}} = this
    const ctx = canvas.getContext("2d")
    this.set("ctx", ctx)
  },
  setFile({target: {files: [file]}}) {
    this.set("file", file)
  },
  clear() {
    this.ctx.clearRect(0, 0, baseSize, baseSize)
  },
  render(ctx, logo, image, text) {
    this.clear()
    this.drawImage(image)
    this.drawLogo(logo)
    this.createTextImage(text)
  },
  setImage(file) {
    if (!file) return
    const reader = new FileReader()
    const image = new Image()
    reader.onload = ({target: {result}})=> {
      image.src = result
    }
    image.onload = ()=> {
      this.set("image", image)
    }
    reader.readAsDataURL(file)
  },
  drawImage(image) {
    if (!image) return
    const {width, height} = image
    const sliceSize = Math.min(width, height)
    const offsetRate = 0.15
    const offset = baseSize * offsetRate
    const size = baseSize * (1 - offsetRate * 2)
    this.ctx.drawImage(image, (width - sliceSize) / 2, (height - sliceSize) / 2, sliceSize, sliceSize, offset, offset, size, size)
  },
  setLogo(file) {
    const image = new Image()
    image.onload = ()=> {
      this.set("logo", image)
    }
    image.src = "./components/nishiwaki-logo-composer/logo.png"
  },
  drawLogo(logo) {
    this.ctx.drawImage(logo, 0, 0, baseSize, baseSize)
  },
  createTextImage(text) {
    const canvas = document.createElement("canvas")
    const w = baseSize * 0.3
    const h = w * 0.8
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    ctx.font = `${h * 0.8}px Arial`
    ctx.fillText(text, 0, h * 0.8, w)
    const url = canvas.toDataURL()
    const image = new Image()
    image.src = url
    image.onload = ()=> {
      this.set("textImage", image)
    }
  },
  drawText(textImage) {
    const {ctx} = this
    const x = baseSize * 0.68
    const y = baseSize * 0.48
    const w = textImage.width
    const h = textImage.height
    ctx.translate(x, y)
    ctx.translate(w / 2, h / 2)
    ctx.rotate(18 * Math.PI / 180)
    ctx.translate(- w / 2, - h / 2)
    drawTrapezoid(ctx, textImage, 50)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  },
})
// TODO: リファクタ
function drawTrapezoid(ctx, img, factor) {
  var w = img.width
  var h = img.height
  var x = 0

    var startPoint = h * 0.5 * (factor*0.01)
  var startLine = 0

    for(; x < w; x++) {

        // get x position based on line (y)
      var yi = (1 - x / w) * startPoint


        // draw the slice
        ctx.drawImage(img, x, 0, 1, h, // source line
                           x, yi, 1, h - yi * 2); // output line
    }
}
