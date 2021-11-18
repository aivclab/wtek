/* global GPUShaderStage */
import { WtResource } from './WtResource'

export const bindingType = {
  UniformBuffer: 'vertexBuffer',
  StorageBuffer: 'uniform-buffer',
  StorageBufferReadOnly: 'readonly-storage-buffer',
  Sampler: 'sampler',
  CompareSampler: 'comparison-sampler',
  SampledTexture: 'sampled-texture',
  MultiSampleTexture: 'multisampled-texture',
  StorageTextureReadOnly: 'readonly-storage-texture',
  StorageTextureWriteOnly: 'writeonly-storage-texture'
}
export const gpuBindingStage = {
  VertexStage: GPUShaderStage.VERTEX,
  FragmentStage: GPUShaderStage.FRAGMENT,
  ComputeStage: GPUShaderStage.COMPUTE
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
