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
    super(0, 0)
    this.width = options.width
    this.height = options.height
  }
  resize() {}
  draw() {}
  inRange() {}
  get range() {}
}

class RoundedShape extends Shape {
  constructor(options) {
    super(options)
    this.radius = this.width / 2
  }
}

class Circle extends RoundedShape {
  constructor(options) {
    super({
      ...options, 
      width: options.width / 2,
    })
    this.position = { x: this.width, y: this.width }
  }
  draw(cx) {
    cx.beginPath()
    cx.fillStyle = "black"
    cx.arc(this.position.x, this.position.y, this.width, 0, Math.PI * 2)
    cx.stroke()
  }
  inRange(x, y) {
    const deltaX = (x - this.position.x) ** 2
    const deltaY = (y - this.position.y) ** 2
    return Math.sqrt(deltaX + deltaY) <= this.width
  }
}

class Rectangle extends Shape {
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
    const borderWidth = 5
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

function createShape(name) {
  const { CIRCLE, RECTANGLE } = SHAPES
  const options = {
    width: 100,
    height: 100,
  }
  switch(name) {
    case CIRCLE: return new Circle(options)
    case RECTANGLE: return new Rectangle(options)
  }
}

const shapes_array = []

;[].forEach.call(panel_items, el => {
  el.addEventListener("click", ( ) => {
    const name = el.dataset.shape
    const shape = createShape(name)
    shapes_array.push(shape)
    drawShapes()
  })
})

function drawShapes() {
  shapes_array.forEach(shape => {
    shape.draw(cx)
  })
}

canvas.addEventListener("click", event => {
  const xAxis = event.layerX
  const yAxis = event.layerY
  const shape = shapes_array.find(el => el.inRange(xAxis, yAxis))
  if (shape) {
    console.log("congratulations!!! u find her")
  }
})
