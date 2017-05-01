const baseSize = 425

Polymer({
  is: "nishiwaki-logo-composer",
  properties: {
    isMobile: {value: true},
    file: {
      value: null
    },
    image: {
      value: null
    },
    text: {
      value: "西脇 太郎"
    },
    isDragging: {
      value: false
    },
    scale: {
      value: 1
    },
    x: { value: 0 },
    y: { value: 0 },
    w: { value: 0 },
    h: { value: 0 },
  },
  observers: [
    "drawLogo(logo)",
    "setImageUrl(file)",
    "setImage(imageUrl)",
    "setHandleSize(image)",
    "render(ctx, logo, image, text, x, y, w, h)",
    "drawText(textImage)"
  ],
  attached() {
    this.setMobile()
    this.listenResize()
    this.resize()
    this.setLogo()
    this.setCtx()
  },
  setMobile() {
    this.set("isMobile", ["Android", "iOS", "Windows Phone"].indexOf(platform.os.family) >= 0)
    if (this.isMobile) this.classList.add("mobile")
  },
  listenResize() {
    window.addEventListener("resize", this.resize.bind(this))
  },
  resize() {
    const {min} = Math
    const scale = min(1, this.parentNode.clientWidth / baseSize)
    this.style.transform = `scale(${scale})`
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
  setHandleSize(image) {
    if (!image) return
    const {width, height} = image
    const {min, max} = Math
    const rate = min(1, baseSize / max(width, height))
    this.set("w", width * rate)
    this.set("h", height * rate)
  },
  render(ctx, logo, image, text, x, y, w, h) {
    this.clear()
    this.drawImage(image, x, y, w, h)
    this.drawLogo(logo)
    this.createTextImage(text)
  },
  selectFile() {
    this.$.fileInput.inputElement.click()
  },
  onFileSelected({target: {files: [file]}}) {
    this.set("file", file)
  },
  toggleEditorMode() {
    this.classList.toggle("editor-mode")
  },
  setImageUrl(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = ({target: {result}})=> {
      this.set("imageUrl", result)
    }
    reader.readAsDataURL(file)
  },
  setImage(imageUrl) {
    if (!imageUrl) return
    const image = new Image()
    image.onload = ()=> {
      this.set("image", image)
    }
    image.src = imageUrl
  },
  drawImage(image, x, y, w, h) {
    if (!image) return
    const offsetRate = 0.15
    const offset = baseSize * offsetRate
    const maskSize = baseSize - offset * 2
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.rect(offset, offset, maskSize, maskSize)
    this.ctx.closePath()
    this.ctx.clip()
    this.ctx.drawImage(image, x, y, w, h)
    this.ctx.restore()
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
  download() {
    const a = document.createElement("a")
    a.href = this.$.canvas.toDataURL()
    a.download = `西脇市ロゴ ${this.text}.png`
    a.style.display = "none"
    this.appendChild(a)
    a.click()
  },
  onDragover(event) {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = "copy"
  },
  onDrop(event) {
    event.preventDefault()
    event.stopPropagation()
    window.dataTransfer = event.dataTransfer
    const {dataTransfer: {files}} = event
    const file = files[0]
    this.set("file", file)
    this.set("isDragging", false)
  },
  setDragging(event) {
    event.preventDefault()
    event.stopPropagation()
    this.set("isDragging", true)
  },
  unsetDragging(event) {
    event.preventDefault()
    event.stopPropagation()
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
