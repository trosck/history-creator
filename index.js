"use strict"

const SHAPES = {
  CIRCLE: "circle",
  RECTANGLE: "rectangle",
}

const throttle = (func, ms=0) => {
  let canRun = true;
  return (...args) => {
    if (canRun) {
      canRun = false
      setTimeout(( ) => {
        canRun = true
        func.apply(this, args)
      }, ms)
    }
  }
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
  drawBorder() {}
  get range() {}
}

class CanvasCircle extends Shape {
  constructor(options, context) {
    super({
      ...options, 
      width: options.width / 2,
      initialX: options.initialX + options.width / 2,
      initialY: options.initialY + options.width / 2,
    })
    this.context = context
  }
  draw() {
    const canvas = this.context

    canvas.beginPath()
    canvas.fillStyle = "black"
    canvas.arc(
      this.position.x, 
      this.position.y, 
      this.width, 
      0, 
      Math.PI * 2
    )
    canvas.fill()

    canvas.beginPath()
    canvas.fillStyle = "white"
    canvas.arc(
      this.position.x, 
      this.position.y, 
      this.width - this.borderWidth, 
      0, 
      Math.PI * 2
    )
    canvas.fill()
  }
  inRange(x, y) {
    const deltaX = (x - this.position.x) ** 2
    const deltaY = (y - this.position.y) ** 2
    return Math.sqrt(deltaX + deltaY) <= this.width
  }
  drawBorder() {
    const canvas = this.context

    canvas.setLineDash([5, 5])
    canvas.lineWidth = 5
    canvas.beginPath();
    canvas.arc(
      this.position.x,
      this.position.y,
      this.width - this.borderWidth + 10, 
      0, 
      Math.PI * 2
    );
    canvas.stroke()
  }
}

class CanvasRectangle extends Shape {
  constructor(options, context) {
    super(options)
    this.context = context
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
  draw() {
    const canvas = this.context
    const borderWidth = this.borderWidth
    canvas.fillStyle = "black"
    canvas.fillRect(this.position.x, this.position.y, this.width, this.height)
    canvas.fillStyle = "white"
    canvas.fillRect(
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
  drawBorder() {
    const canvas = this.context
    canvas.setLineDash([5, 5])
    canvas.lineWidth = 5
    canvas.strokeRect(
      this.position.x - 5,
      this.position.y - 5,
      this.width + 10,
      this.height + 10,
    )
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
      this.handleClick(event)
    })
  }
  handleClick() {}
  handleDragElement() {}
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
      initialX: 100,
      initialY: 100,
    }
    switch(name) {
      case CIRCLE: return new CanvasCircle(options, this.context)
      case RECTANGLE: return new CanvasRectangle(options, this.context)
    }
  }

  drawShapes() {
    this.shapes_array.forEach(shape => shape.draw())
  }

  handleClick(event) {
    const { layerX, layerY } = event
    const shapeIndex = this.shapes_array.findIndex(
      el => el.inRange(layerX, layerY)
    )

    console.log('----------index', shapeIndex, layerX, layerY, this.shapes_array)
    this.reDraw()
    this.handleDragElement(this.shapes_array[shapeIndex])
  }

  handleDragElement(shape) {
    this.reDraw()
  
    shape.drawBorder()
    let deltaX, deltaY 

    const dragElement = ({ layerX, layerY }) => {
      const { x, y } = shape.position
      if (!deltaX && !deltaY) {
        deltaX = layerX - x
        deltaY = layerY - y
      }
      shape.position = {
        x: layerX - deltaX,
        y: layerY - deltaY,
      }
      this.reDraw()
      shape.drawBorder()
    }

    const throttledDragElement = throttle(dragElement, 1000 / 60)

    const removeListeners = ( ) => {
      this.field.removeEventListener("mousemove", throttledDragElement)
      this.field.removeEventListener("mouseup", removeListeners)
    }

    this.field.addEventListener("mousemove", throttledDragElement)
    this.field.addEventListener("mouseup", removeListeners)
  }
  reDraw() {
    this.field.reset()
    this.drawShapes()
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
