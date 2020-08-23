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
  
  getPosition() {
    return `${this.x}:${this.y}`
  }
}

class Shape extends Position {
  constructor(options) {
    super(0, 0)
    this.initialWidth = options.width
    this.initialHeight = options.height
    this.linesCount = options.lines
  }
  draw() {}
}

class Circle extends Shape {
  constructor(options) {
    super(options)
    options.lines = 1
  }
  draw(cx) {
    cx.beginPath()
    cx.fillStyle = "black"
    cx.arc(75, 75, 50, 0, Math.PI * 2, true)
    cx.stroke()
  }
}

class Rectangle extends Shape {
  constructor(options) {
    super(options)
    options.lines = 4
  }
  draw(cx) {
    cx.fillStyle = "black"
    cx.fillRect(0, 0, this.initialWidth, this.initialWidth)
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
