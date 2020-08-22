"use strict"

const canvas = document.getElementById("canvas")
const cx = canvas.getContext("2d")

const panel = document.getElementById("panel")
const panel_items = panel.getElementsByClassName("panel_item")

const wrapper = document.getElementById("canvas-wrapper")
width = wrapper.offsetWidth
height = wrapper.offsetHeight

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
    this.initialWidth = options.width
    this.initialHeight = options.height
    this.linesCount = options.lines

    super(0, 0)
  }
}

class Circle extends Shape {
  constructor(options) {
    options.lines = 1
    super(options)
  }
}

class Rectangle extends Shape {
  constructor(options) {
    options.lines = 4
    super(options)
  }
}

function createShape(name) {
  const { CIRCLE, RECTANGLE } = SHAPES
  const options = {
    initialHeight: 100,
    initialWidth: 100,
  }
  switch(name) {
    case CIRCLE: return new Circle(options)
    case RECTANGLE: return new Rectangle(options)
  }
}

const shapes_array = []

panel_items.forEach(el => {
  el.addEventListener("click", ( ) => {
    const name = el.dataset.shape
    const shape = createShape(name)
    shapes_array.push(shape)
  })
})
