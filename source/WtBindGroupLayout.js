import { WtResource } from './WtResource'

// Must be defined as const enums to support implementations with undefined
// GPUShaderStage
export const wtGpuBindingStage = {
  VertexStage: 0x1, // GPUShaderStage.VERTEX,
  FragmentStage: 0x2, // GPUShaderStage.FRAGMENT,
  ComputeStage: 0x4 // GPUShaderStage.COMPUTE
}

export class WtBindGroupLayout extends WtResource {
  constructor (name, context) {
    super(name, context)
    this.layout_ = null
    this.layoutEntries_ = []
  }

  create () {
    if (!this.validateLayout) {
      return
    }
    const layoutEntries = { entries: this.layoutEntries_ }
    this.layout_ = super.getDevice().createBindGroupLayout(layoutEntries)
    /*
     const computePipeline = super.getDevice().createComputePipeline({
     compute: {
     module: shaderModule,
     entryPoint: "main",
     },
     });
     this.layout_ = computePipeline.getBindGroupLayout(0); // INDEX

     */

    return this.layout_
  }

  addLayoutBinding (layoutEntry) {
    this.layoutEntries_.push(layoutEntry)
  }

  getBindGroupLayout () {
    return this.layout_
  }

  validateLayout () {
    return true
  }
}
