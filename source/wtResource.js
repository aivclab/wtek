class wtResource {
  constructor (name, context) {
    this.context_ = context
    this.name_ = name
    this.type_ = null // read-only
  }

  getName () {
    return this.name_
  }

  getContext () {
    return this.context_
  }

  getGpu () {
    return this.context_.getGpu()
  }

  getDevice () {
    return this.context_.device_
  }
}

export { wtResource }
