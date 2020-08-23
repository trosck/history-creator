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
    this.linesCount = options.lines
  }
  resize() {}
  draw() {}
  inRange() {}
  get range() {}
}

class InteractiveShape {

}

class Circle extends Shape {
  constructor(options) {
    super({ ...options, lines: 1})
  }
  draw(cx) {
    cx.beginPath()
    cx.fillStyle = "black"
    cx.arc(75, 75, 50, 0, Math.PI * 2, true)
    cx.stroke()
  }
  inRange(x, y) {
    
  }
}

class Rectangle extends Shape {
  constructor(options) {
    super({ ...options, lines: 4 })
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
    cx.fillStyle = "black"
    cx.fillRect(this.position[0], this.position[1], this.initialWidth, this.initialWidth)
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
  console.log(event)
  const xAxis = event.layerX
  const yAxis = event.layerY

})
