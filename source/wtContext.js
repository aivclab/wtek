class wtContext {
  constructor (gpu, adapter, device) {
    this.gpu_ = gpu
    this.adapter_ = adapter
    this.device_ = device
    this.width_ = 768
    this.height_ = 768
  }

  isValid () {
    return (
      this.gpu_ !== undefined &&
      this.adapter_ !== undefined &&
      this.device_ !== undefined
    )
  }

  getGpu () {
    return this.gpu_
  }

  getAdapter () {
    return this.adapter_
  }

  getDevice () {
    return this.device_
  }

  getWidth () {
    return this.width_
  }

  getHeight () {
    return this.height_
  }

  setWidth (width) {
    this.width_ = width
  }

  setHeight (height) {
    this.height_ = height
  }
}

export { wtContext }
