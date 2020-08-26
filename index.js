"use strict"

const SHAPES = {
  CIRCLE: "circle",
  RECTANGLE: "rectangle",
}

class Position {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  
  get position() {
    return { x: this.x, y: this.y }
  }

  set position({ x, y }) {
    this.x = x
    this.y = y
  }
}

class Shape extends Position {
  constructor(options) {
    super(options.initialX, options.initialY)
    this.borderWidth = 5
    this.width = options.width
    this.height = options.height
  }
  resize() {}
  draw() {}
  inRange() {}
  get range() {}
}

class CanvasCircle extends Shape {
  constructor(options) {
    super({
      ...options, 
      width: options.width / 2,
    })
    const { x, y } = this.position
    this.position = { x: this.width + x, y: this.width + y }
  }
  draw(cx) {
    const borderWidth = this.borderWidth

    cx.beginPath()
    cx.fillStyle = "black"
    cx.arc(
      this.position.x, 
      this.position.y, 
      this.width, 
      0, 
      Math.PI * 2
    )
    cx.fill()

    cx.beginPath()
    cx.fillStyle = "white"
    cx.arc(
      this.position.x, 
      this.position.y, 
      this.width - borderWidth, 
      0, 
      Math.PI * 2
    )
    cx.fill()
  }
  inRange(x, y) {
    const deltaX = (x - this.position.x) ** 2
    const deltaY = (y - this.position.y) ** 2
    return Math.sqrt(deltaX + deltaY) <= this.width
  }
}

class CanvasRectangle extends Shape {
  constructor(options) {
    super({
      ...options,
    })
  }
  get range() {
    return {
      x: [this.x, this.x + this.width],
      y: [this.y, this.y + this.height],
    }
  }
  resize(width, height) {
    this.width = width
    this.height = height
  }
  draw(cx) {
    const borderWidth = this.borderWidth
    cx.fillStyle = "black"
    cx.fillRect(this.position.x, this.position.y, this.width, this.height)
    cx.fillStyle = "white"
    cx.fillRect(
      this.position.x + borderWidth, 
      this.position.y + borderWidth, 
      this.width - borderWidth * 2,
      this.height - borderWidth * 2,
    )
  }
  inRange(x, y) {
    const compareX = x >= this.range.x[0] && x <= this.range.x[1]
    const compareY = y >= this.range.y[0] && y <= this.range.y[1]
    return compareX && compareY
  }
}

class Drawer {
  constructor(field) {
    this.field = field
    this.shapes_array = []
  }
  init(panel_items) {
    ;[].forEach.call(panel_items, el => {
      el.addEventListener("click", ( ) => {
        const name = el.dataset.shape
        const shape = this.createShape(name)
        this.shapes_array.push(shape)
        this.drawShapes()
      })
    })

    this.#setListenerOnClickShape()
  }
  #setListenerOnClickShape() {
    this.field.addEventListener("mousedown", event => {
      const xAxis = event.layerX
      const yAxis = event.layerY
      const shape = this.shapes_array.find(el => el.inRange(xAxis, yAxis))
      if (shape) {
        const removeListeners = ( ) => {
          this.field.removeEventListener("mousemove", dragElement)
          this.field.removeEventListener("mouseup", removeListeners)
        }

        const dragElement = ({ layerX: x, layerY: y }) => {
          shape.position = { x, y }
          this.field.reset()
          this.drawShapes()
        }

        this.field.addEventListener("mousemove", dragElement)
        this.field.addEventListener("mouseup", removeListeners)
      }
    })
  }
  drawShapes() {
    this.shapes_array.forEach(shape => shape.draw(this.context))
  }
  createShape() {}
}

class CanvasDrawer extends Drawer {
  constructor(field) {
    super(field)
    this.context = field.getContext("2d")
  }
  createShape(name) {
    const { CIRCLE, RECTANGLE } = SHAPES
    const options = {
      width: 100,
      height: 100,
      initialX: 100,
      initialY: 100,
    }
    switch(name) {
      case CIRCLE: return new CanvasCircle(options)
      case RECTANGLE: return new CanvasRectangle(options)
    }
  }
}

class SVGDrawer extends Drawer {
  // soon...
}

class Application {
  constructor({ type, fieldID, panelItemClass }) {
    const field = document.getElementById(fieldID)
    const { drawer, el } = this.init({ type, field })

    field.appendChild(el)

    const panel_items = document.getElementsByClassName(panelItemClass)
    drawer.init(panel_items)
  }
  init({ type, field }) {
    const size = {
      width: field.offsetWidth,
      height: field.offsetHeight,
    }

    if (type === "canvas") {
      const canvas = this.initCanvas(size)
      return {
        drawer: new CanvasDrawer(canvas),
        el: canvas,
      }
    }
    if (type === "svg") {
      const svg = this.initSVG(size)
      return {
        drawer: new SVGDrawer(svg),
        el: svg
      }
    }
  }
  initCanvas({ width, height }) {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext("2d")
    canvas.reset = function() {
      context.fillStyle = "rgb(218, 210, 216)"
      context.fillRect(0, 0, width, height)
    }
    canvas.reset()
    
    return canvas
  }
  initSVG({ width, height }) {
    const svg = document.createElement("svg")
    svg.width = width
    svg.height = height 

    return svg
  }
}

new Application({ type: "canvas", fieldID: "field-wrapper", panelItemClass: "panel_item" })
