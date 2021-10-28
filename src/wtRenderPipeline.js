import wtResource from "./wtResource.js";

export const GpuPrimTopology = {
  PointList: "point-list",
  LineList: "line-list",
  LineStrip: "line-strip",
  TriangleList: "triangle-list",
  TriangleStrip: "triangle-strip",
};

class wtRenderPipeline extends wtResource {
  constructor(name, context) {
    super(name, context);
    this.layout_ = null;
    this.layoutEntries_ = new Array();
    this.vertexBufferState_ = null;
    this.bindGroupLayouts_ = null;
    this.primTopology_ = GpuPrimTopology.TriangleList;
    this.sampleCount_ = 1;
    this.pipeline_ = null;
  }

  setVertexModule(vertexModule) {
    this.vertexModule_ = vertexModule;
  }

  setFragmentModule(fragmentModule) {
    this.fragmentModule_ = fragmentModule;
  }

  setBindGroupLayouts(bindGroupLayouts) {
    this.bindGroupLayouts_ = bindGroupLayouts;
  }

  setPrimTopology(primTopology) {
    this.primTopology_ = primTopology;
  }

  setVertexBufferState(vertexBufferState) {
    this.vertexBufferState_ = vertexBufferState;
  }

  setSampleCount(sampleCount) {
    this.sampleCount_ = sampleCount;
  }

  create() {
    this.pipeLineLayout_ = super
      .getDevice()
      .createPipelineLayout({ bindGroupLayouts: [this.bindGroupLayouts_] });
    this.depthStencilState_ = {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: "depth24plus-stencil8",
    };
    this.rasterState_ = {
      frontFace: "ccw",
      cullMode: "none",
    };
    this.pipelineDescriptor_ = {
      layout: this.pipeLineLayout_,
      vertexStage: { module: this.vertexModule_, entryPoint: "main" },
      fragmentStage: { module: this.fragmentModule_, entryPoint: "main" },
      vertexState: { vertexBuffers: [this.vertexBufferState_] },
      colorStates: [{ format: "bgra8unorm" }],
      //colorStates:[ { format: "bgra8unorm", alphaBlend: { srcFactor:
      // "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" } }],
      rasterizationState: this.rasterState_,
      depthStencilState: this.depthStencilState_,
      primitiveTopology: this.primTopology_,
      sampleCount: this.sampleCount_,
    };
    this.pipeline_ = super
      .getDevice()
      .createRenderPipeline(this.pipelineDescriptor_);
    return this.pipeline_;
  }

  createNoDepthStencil() {
    this.pipeLineLayout_ = super
      .getDevice()
      .createPipelineLayout({ bindGroupLayouts: [this.bindGroupLayouts_] });
    this.depthStencilState_ = {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: "depth24plus-stencil8",
    };
    this.rasterState_ = {
      frontFace: "ccw",
      cullMode: "none",
    };
    this.pipelineDescriptor_ = {
      layout: this.pipeLineLayout_,
      vertexStage: { module: this.vertexModule_, entryPoint: "main" },
      fragmentStage: { module: this.fragmentModule_, entryPoint: "main" },
      vertexState: { vertexBuffers: [this.vertexBufferState_] },
      colorStates: [{ format: "bgra8unorm" }],
      rasterizationState: this.rasterState_,
      depthStencilState: this.depthStencilState_,
      primitiveTopology: this.primTopology_,
      sampleCount: this.sampleCount_,
    };
    this.pipeline_ = super
      .getDevice()
      .createRenderPipeline(this.pipelineDescriptor_);
    return this.pipeline_;
  }

  getPipeline() {
    return this.pipeline_;
  }
}

export default wtRenderPipeline;
export {wtRenderPipeline};
