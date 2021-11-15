import { WtResource } from './WtResource'

export const GpuPrimTopology = {
  PointList: 'point-list',
  LineList: 'line-list',
  LineStrip: 'line-strip',
  TriangleList: 'triangle-list',
  TriangleStrip: 'triangle-strip'
}

export class WtRenderPipeline extends WtResource {
  constructor (name, context) {
    super(name, context)
    this.layout_ = null
    this.layoutEntries_ = []
    this.vertexBufferState_ = null
    this.bindGroupLayouts_ = null
    this.primTopology_ = GpuPrimTopology.TriangleList
    this.sampleCount_ = 1
    this.pipeline_ = null
  }

  setVertexModule (vertexModule) {
    this.vertexModule_ = vertexModule
  }

  setFragmentModule (fragmentModule) {
    this.fragmentModule_ = fragmentModule
  }

  setBindGroupLayouts (bindGroupLayouts) {
    this.bindGroupLayouts_ = bindGroupLayouts
  }

  setPrimTopology (primTopology) {
    this.primTopology_ = primTopology
  }

  setVertexBufferState (vertexBufferState) {
    this.vertexBufferState_ = vertexBufferState
  }

  setSampleCount (sampleCount) {
    this.sampleCount_ = sampleCount
  }

  create () {
    this.pipeLineLayout_ = super
      .getDevice()
      .createPipelineLayout({ bindGroupLayouts: [this.bindGroupLayouts_] })
    this.depthStencilState_ = {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus-stencil8'
    }
    this.rasterState_ = {
      frontFace: 'ccw',
      cullMode: 'none'
    }
    this.pipelineDescriptor_ = {
      layout: this.pipeLineLayout_,
      vertex: {
        module: this.vertexModule_,
        entryPoint: 'main',
        buffers: [this.vertexBufferState_]
      },
      fragment: {
        module: this.fragmentModule_,
        entryPoint: 'main',
        targets: [{ format: 'bgra8unorm' }]
      },
      vertexState: { vertexBuffers: [this.vertexBufferState_] },
      colorStates: [{ format: 'bgra8unorm' }],
      // colorStates:[ { format: "bgra8unorm", alphaBlend: { srcFactor:
      // "source-alpha", dstFactor: "one-minus-source-alpha", operation: "add"
      // } }],
      rasterizationState: this.rasterState_,
      depthStencil: this.depthStencilState_,
      primitive: { topology: this.primTopology_ },
      sampleCount: this.sampleCount_
    }
    this.pipeline_ = super
      .getDevice()
      .createRenderPipeline(this.pipelineDescriptor_)
    return this.pipeline_
  }

  createNoDepthStencil () {
    this.pipeLineLayout_ = super
      .getDevice()
      .createPipelineLayout({ bindGroupLayouts: [this.bindGroupLayouts_] })
    this.depthStencilState_ = {
      depthWriteEnabled: false,
      depthCompare: 'less',
      format: 'depth24plus-stencil8'
    }
    this.rasterState_ = {
      frontFace: 'ccw',
      cullMode: 'none'
    }
    this.pipelineDescriptor_ = {
      layout: this.pipeLineLayout_,
      vertex: {
        module: this.vertexModule_,
        entryPoint: 'main',
        buffers: [this.vertexBufferState_]
      },
      fragment: {
        module: this.fragmentModule_,
        entryPoint: 'main',
        targets: [{ format: 'bgra8unorm' }]
      },
      vertexState: { vertexBuffers: [this.vertexBufferState_] },
      colorStates: [{ format: 'bgra8unorm' }],
      rasterizationState: this.rasterState_,
      depthStencilState: this.depthStencilState_,
      primitive: { topology: this.primTopology_ },
      sampleCount: this.sampleCount_
    }
    this.pipeline_ = super
      .getDevice()
      .createRenderPipeline(this.pipelineDescriptor_)
    return this.pipeline_
  }

  getPipeline () {
    return this.pipeline_
  }
}
