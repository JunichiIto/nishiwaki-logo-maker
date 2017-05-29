Polymer({
  is: "interact-component",
  properties: {
    draggable: {
      value: false
    },
    resizable: {
      value: false
    },
    x: {
      value: 0,
      notify: true
    },
    y: {
      value: 0,
      notify: true
    },
    w: {
      value: 0,
      notify: true
    },
    h: {
      value: 0,
      notify: true
    },
    scale: {
      value: 1
    },
  },
  observers: [
    "setDraggable(draggable)",
    "setResizable(resizable)",
    "setTranslation(x, y)",
    "setSize(w, h)",
  ],
  setDraggable(draggable) {
    if (!draggable) return
    // NOTE: interact()にエレメントを直接渡すとスマホ時にバグるのでセレクターを使用する
    interact('interact-component', this.parentNode).draggable({
      onmove: this.onDragMove.bind(this)
    })
  },
  setResizable(resizable) {
    if (!resizable) return
    // NOTE: interact()にエレメントを直接渡すとスマホ時にバグるのでセレクターを使用する
    interact('interact-component', this.parentNode).resizable({
      preserveAspectRatio: true,
      edges: {top: true, right: true, bottom: true, left: true}
    }).on("resizemove", this.onResizeMove.bind(this))
  },
  attached() {
  },
  onDragMove({target, dx, dy}) {
    this.set("x", this.x + dx)
    this.set("y", this.y + dy)
  },
  onResizeMove({target, rect: {width, height}, deltaRect: {left, top}}) {
    this.set("x", this.x + left)
    this.set("y", this.y + top)
    this.set("w", width / this.scale)
    this.set("h", height / this.scale)
  },
  setTranslation(x, y) {
    if (!this.style) return
    this.style.transform = `translate(${x}px, ${y}px)`
  },
  setSize(w, h) {
    if (!this.style) return
    this.style.width = `${w}px`
    this.style.height = `${h}px`
  },
})
