"use strict"

const canvas = document.getElementById("canvas")
const cx = canvas.getContext("2d")

const panel = document.getElementById("panel")
const panel_items = panel.getElementsByClassName("panel_item")

const wrapper = document.getElementById("canvas-wrapper")
const width = wrapper.offsetWidth
const height = wrapper.offsetHeight

canvas.width = width
canvas.height = height

cx.fillStyle = "rgb(218, 210, 216)"
cx.fillRect(0, 0, width, height)

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
    super(10, 10)
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
    this.position = { x: this.width, y: this.width }
  }
  draw(cx) {
    const borderWidth = this.borderWidth

    cx.beginPath()
    cx.fillStyle = "black"
    cx.arc(this.position.x, this.position.y, this.width, 0, Math.PI * 2)
    cx.fill()

    cx.fillStyle = "white"
    cx.beginPath()
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

    ;[].forEach.call(panel_items, el => {
      el.addEventListener("click", ( ) => {
        const name = el.dataset.shape
        const shape = this.createShape(name)
        this.shapes_array.push(shape)
        this.drawShapes()
      })
    })

    this.setListenerOnClickShape()
  }
  setListenerOnClickShape() {
    this.field.addEventListener("click", event => {
      const xAxis = event.layerX
      const yAxis = event.layerY
      const shape = this.shapes_array.find(el => el.inRange(xAxis, yAxis))
      if (shape) {
        console.log("congratulations!!! u find her")
      }
    })
  }
  drawShapes() {}
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
    }
    switch(name) {
      case CIRCLE: return new CanvasCircle(options)
      case RECTANGLE: return new CanvasRectangle(options)
    }
  }
  drawShapes() {
    this.shapes_array.forEach(shape => shape.draw(this.context))
  }
}

class SVGDrawer extends Drawer {

}

class Application {
  constructor({ type, id }) {
    this.init(type, id)
  }
  init(type, id) {
    const field = document.getElementById(id)
    switch(type) {
      case "canvas": return new CanvasDrawer(field)
      case "svg": return new SVGDrawer(field)
    }
  }
}

new Application({ type: "canvas", id: "canvas" })
