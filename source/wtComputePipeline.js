import { wtResource } from './wtResource'

class WtComputePipeline extends wtResource {
  constructor (name, context) {
    super(name, context)
    this.layout_ = null
    this.bindGroupLayouts_ = null
  }

  create (computeShaderModule) {
    this.pipeLineLayout_ = super
      .getDevice()
      .createPipelineLayout({ bindGroupLayouts: [this.bindGroupLayouts_] })

    this.computeStage_ = {
      layout: this.pipeLineLayout_,
      compute: { module: computeShaderModule, entryPoint: 'main' }
    }
    this.pipeline_ = super
      .getDevice()
      .createComputePipeline(this.computeStage_)
  }

  setBindGroupLayouts (bindGroupLayouts) {
    this.bindGroupLayouts_ = bindGroupLayouts
  }

  getPipeline () {
    return this.pipeline_
  }
}

export { WtComputePipeline }
