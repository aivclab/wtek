import wtResource from "./wtResource.js";

class wtSwapChain extends wtResource {
  constructor(name, context) {
    super(name, context);
    this.swapChain_ = null;
  }

  createSwapChain(swapChainFormat, canvasContext) {
    const swapChainDescriptor = {
      device: super.getDevice(),
      format: swapChainFormat,
      usage: GPUTextureUsage.OUTPUT_ATTACHMENT | GPUTextureUsage.COPY_DST,
    };
    this.swapChain_ = canvasContext.configureSwapChain(swapChainDescriptor);
  }

  getCreateView() {
    return this.swapChain_.getCurrentTexture().createView();
  }

  getSwapChain() {
    return this.swapChain_;
  }
}

export { wtSwapChain };
