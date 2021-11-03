import { wtResource } from './wtResource'

class wtSwapChain extends wtResource {
  constructor (name, context) {
    super(name, context)
    this.swapChain_ = null
  }

  createSwapChain (swapChainFormat, canvasContext) {
    const swapChainDescriptor = {
      device: super.getDevice(),
      format: swapChainFormat,
    }
    canvasContext.configure(swapChainDescriptor)
    this.swapChain_ = canvasContext
  }

  getCreateView () {
    return this.swapChain_.getCurrentTexture().createView()
  }

  getSwapChain () {
    return this.swapChain_
  }
}

export { wtSwapChain }
