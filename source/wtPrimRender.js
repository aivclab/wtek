import { mat4, vec3, vec4 } from 'gl-matrix'
import { WtBuffer, Vec4Colors } from './wtBuffer'
import { WtBindGroupLayout } from './wtBindGroupLayout'
import { GpuPrimTopology, WtRenderPipeline } from './wtRenderPipeline'
import { wtResource } from './wtResource'
import { VertexType, WtVertexDescriptor } from './wtVertexDescriptor'

class PrimUniformData {
  constructor () {
    this.dataSizeInFloats_ = 16 + 4
    this.viewProjMatrix_ = mat4.create()
    this.screenDimension_ = vec4.create()
    this.floatArray_ = new Float32Array(this.dataSizeInFloats_)
  }

  update (viewProjectionMatrix) {
    this.viewProjMatrix_ = viewProjectionMatrix
  }

  setScreenDimension (width, height) {
    this.screenDimension_[0] = width
    this.screenDimension_[1] = height
  }

  toArray () {
    const a0 = Float32Array.from(this.viewProjMatrix_)
    const a1 = Float32Array.from(this.screenDimension_)
    let index = 0
    for (let i = 0; i < a0.length; i++) {
      this.floatArray_[index] = a0[i]
      index++
    }
    for (let i = 0; i < a1.length; i++) {
      this.floatArray_[index] = a1[i]
      index++
    }
    return this.floatArray_
  }
}

class wtPrimRender extends wtResource {
  constructor (name, context) {
    super(name, context)
    this.layout_ = null
    this.maxNumberOfPrims_ = 1024
    this.points_ = new Float32Array(this.maxNumberOfPrims_ * 8)
    this.lines_ = new Float32Array(this.maxNumberOfPrims_ * 8 * 2)
    this.triangles_ = new Float32Array(this.maxNumberOfPrims_ * 8 * 3)
    this.screenNdcVerts_ = new Float32Array(8 * 6)
    this.pointsUpdated_ = false
    this.linesUpdated_ = false
    this.trianglesUpdated_ = false
    this.screenNdcQuadUpdated_ = false
    this.numPoints_ = 0
    this.numLines_ = 0
    this.numTriangles_ = 0
    this.numNdcVerts_ = 0
    this.pointVertexBuffer_ = new WtBuffer(
      'primPointVertexBuffer',
      super.getContext()
    )
    this.lineVertexBuffer_ = new WtBuffer(
      'primLineVertexBuffer',
      super.getContext()
    )
    this.triangleVertexBuffer_ = new WtBuffer(
      'primTriangleVertexBuffer',
      super.getContext()
    )
    this.ndcVertexBuffer_ = new WtBuffer(
      'primFullScreenVertexBuffer',
      super.getContext()
    )
    this.pointVertexBuffer_.createVertexBuffer(
      this.maxNumberOfPrims_ * Float32Array.BYTES_PER_ELEMENT * 8
    )
    this.lineVertexBuffer_.createVertexBuffer(
      this.maxNumberOfPrims_ * Float32Array.BYTES_PER_ELEMENT * 8 * 2
    )
    this.triangleVertexBuffer_.createVertexBuffer(
      this.maxNumberOfPrims_ * Float32Array.BYTES_PER_ELEMENT * 8 * 3
    )
    this.ndcVertexBuffer_.createVertexBuffer(
      Float32Array.BYTES_PER_ELEMENT * 8 * 6
    )
    // uniform buffer create
    this.uniformBufferData_ = new PrimUniformData()
    const uniformBufferSize =
      this.uniformBufferData_.dataSizeInFloats_ *
      Float32Array.BYTES_PER_ELEMENT
    this.uniformBufferData_.setScreenDimension(
      super.getContext().getWidth(),
      super.getContext().getHeight()
    )
    this.uniformBuffer_ = new WtBuffer('primUniformBuffer', super.getContext())
    this.uniformBuffer_.createUniformBuffer(uniformBufferSize)
    // create bind group 0
    const layOutEntry0 = {
      binding: 0,
      visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
      buffer: { type: 'uniform', hasDynamicOffset: false, minBindingSize: 0 }
    }
    const layOutEntry1 = {
      binding: 1,
      visibility: GPUShaderStage.FRAGMENT,
      buffer: { type: 'storage', hasDynamicOffset: false, minBindingSize: 0 }
    }
    const uniformBindGroupLayout_ = new WtBindGroupLayout(
      'PrimGroupLayout0',
      super.getContext()
    )
    uniformBindGroupLayout_.addLayoutBinding(layOutEntry0)
    this.uniformsBindGroupLayout_ = uniformBindGroupLayout_.create()
    this.uniformBindGroupDescriptor_ = {
      layout: this.uniformsBindGroupLayout_,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.uniformBuffer_.getBuffer(),
            offset: 0,
            size: this.uniformBuffer_.getSizeInBytes()
          }
        }
      ]
    }
    this.pointBindGroup_ = super
      .getDevice()
      .createBindGroup(this.uniformBindGroupDescriptor_)
    // pixel
    const uniformBindGroupLayout1_ = new WtBindGroupLayout(
      'PrimGroupLayout1',
      super.getContext()
    )
    uniformBindGroupLayout1_.addLayoutBinding(layOutEntry0)
    uniformBindGroupLayout1_.addLayoutBinding(layOutEntry1)
    this.uniformsBindGroupLayout1_ = uniformBindGroupLayout1_.create()
  }

  toNdc (v) {
    return v * 2.0 - 1.0
  }

  updateUniforms (viewProjection) {
    this.uniformBufferData_.update(viewProjection)
    this.uniformBuffer_.uploadData(this.uniformBufferData_.toArray())
  }

  createPipelines (pointVertexModule, pointFragmentModule, sampleCount) {
    const vertexDescriptor = new WtVertexDescriptor(VertexType.VT_VertexColor4)
    this.pointPipeline_ = new WtRenderPipeline(
      'pointPipeline',
      super.getContext()
    )
    this.pointPipeline_.setPrimTopology(GpuPrimTopology.PointList)
    this.pointPipeline_.setVertexModule(pointVertexModule)
    this.pointPipeline_.setFragmentModule(pointFragmentModule)
    this.pointPipeline_.setBindGroupLayouts(this.uniformsBindGroupLayout_)
    this.pointPipeline_.setVertexBufferState(vertexDescriptor.getVertexState())
    this.pointPipeline_.setSampleCount(sampleCount)
    this.pointPipeline_.create()
    this.linePipeline_ = new WtRenderPipeline(
      'linePipeline',
      super.getContext()
    )
    this.linePipeline_.setPrimTopology(GpuPrimTopology.LineList)
    this.linePipeline_.setVertexModule(pointVertexModule)
    this.linePipeline_.setFragmentModule(pointFragmentModule)
    this.linePipeline_.setBindGroupLayouts(this.uniformsBindGroupLayout_)
    this.linePipeline_.setVertexBufferState(vertexDescriptor.getVertexState())
    this.linePipeline_.setSampleCount(sampleCount)
    this.linePipeline_.create()
    this.trianglePipeline_ = new WtRenderPipeline(
      'trianglePipeline',
      super.getContext()
    )
    this.trianglePipeline_.setPrimTopology(GpuPrimTopology.TriangleList)
    this.trianglePipeline_.setVertexModule(pointVertexModule)
    this.trianglePipeline_.setFragmentModule(pointFragmentModule)
    this.trianglePipeline_.setBindGroupLayouts(this.uniformsBindGroupLayout_)
    this.trianglePipeline_.setVertexBufferState(
      vertexDescriptor.getVertexState()
    )
    this.trianglePipeline_.setSampleCount(sampleCount)
    this.trianglePipeline_.create()
  }

  createPixelPipeline (pixelVertexModule, pixelFragmentModule, sampleCount) {
    const vertexDescriptor = new WtVertexDescriptor(VertexType.VT_VertexColor4)
    this.pixelPipeline_ = new WtRenderPipeline(
      'pixelPipeline',
      super.getContext()
    )
    this.pixelPipeline_.setPrimTopology(GpuPrimTopology.TriangleList)
    this.pixelPipeline_.setVertexModule(pixelVertexModule)
    this.pixelPipeline_.setFragmentModule(pixelFragmentModule)
    this.pixelPipeline_.setBindGroupLayouts(this.uniformsBindGroupLayout1_)
    this.pixelPipeline_.setVertexBufferState(vertexDescriptor.getVertexState())
    this.pixelPipeline_.setSampleCount(sampleCount)
    this.pixelPipeline_.create()
  }

  addPoint (point, color) {
    if (this.numPoints_ >= this.maxNumberOfPrims_) {
      return
    }
    this.points_[this.numPoints_ * 8 + 0] = point[0]
    this.points_[this.numPoints_ * 8 + 1] = point[1]
    this.points_[this.numPoints_ * 8 + 2] = point[2]
    this.points_[this.numPoints_ * 8 + 3] = point[3]
    this.points_[this.numPoints_ * 8 + 4] = color[0]
    this.points_[this.numPoints_ * 8 + 5] = color[1]
    this.points_[this.numPoints_ * 8 + 6] = color[2]
    this.points_[this.numPoints_ * 8 + 7] = color[3]
    this.numPoints_++
    this.pointsUpdated_ = true
  }

  addLine (p0, c0, p1, c1) {
    if (this.numLines_ >= this.maxNumberOfPrims_ * 2) {
      return
    }
    this.lines_[this.numLines_ * 16 + 0] = p0[0]
    this.lines_[this.numLines_ * 16 + 1] = p0[1]
    this.lines_[this.numLines_ * 16 + 2] = p0[2]
    this.lines_[this.numLines_ * 16 + 3] = p0[3]
    this.lines_[this.numLines_ * 16 + 4] = c0[0]
    this.lines_[this.numLines_ * 16 + 5] = c0[1]
    this.lines_[this.numLines_ * 16 + 6] = c0[2]
    this.lines_[this.numLines_ * 16 + 7] = c0[3]
    this.lines_[this.numLines_ * 16 + 8] = p1[0]
    this.lines_[this.numLines_ * 16 + 9] = p1[1]
    this.lines_[this.numLines_ * 16 + 10] = p1[2]
    this.lines_[this.numLines_ * 16 + 11] = p1[3]
    this.lines_[this.numLines_ * 16 + 12] = c1[0]
    this.lines_[this.numLines_ * 16 + 13] = c1[1]
    this.lines_[this.numLines_ * 16 + 14] = c1[2]
    this.lines_[this.numLines_ * 16 + 15] = c1[3]
    this.numLines_++
    this.linesUpdated_ = true
  }

  addTriangle (p0, c0, p1, c1, p2, c2) {
    if (this.numTriangles_ >= this.maxNumberOfPrims_ * 3) {
      return
    }
    this.triangles_[this.numTriangles_ * 24 + 0] = p0[0]
    this.triangles_[this.numTriangles_ * 24 + 1] = p0[1]
    this.triangles_[this.numTriangles_ * 24 + 2] = p0[2]
    this.triangles_[this.numTriangles_ * 24 + 3] = p0[3]
    this.triangles_[this.numTriangles_ * 24 + 4] = c0[0]
    this.triangles_[this.numTriangles_ * 24 + 5] = c0[1]
    this.triangles_[this.numTriangles_ * 24 + 6] = c0[2]
    this.triangles_[this.numTriangles_ * 24 + 7] = c0[3]
    this.triangles_[this.numTriangles_ * 24 + 8] = p1[0]
    this.triangles_[this.numTriangles_ * 24 + 9] = p1[1]
    this.triangles_[this.numTriangles_ * 24 + 10] = p1[2]
    this.triangles_[this.numTriangles_ * 24 + 11] = p1[3]
    this.triangles_[this.numTriangles_ * 24 + 12] = c1[0]
    this.triangles_[this.numTriangles_ * 24 + 13] = c1[1]
    this.triangles_[this.numTriangles_ * 24 + 14] = c1[2]
    this.triangles_[this.numTriangles_ * 24 + 15] = c1[3]
    this.triangles_[this.numTriangles_ * 24 + 16] = p2[0]
    this.triangles_[this.numTriangles_ * 24 + 17] = p2[1]
    this.triangles_[this.numTriangles_ * 24 + 18] = p2[2]
    this.triangles_[this.numTriangles_ * 24 + 19] = p2[3]
    this.triangles_[this.numTriangles_ * 24 + 20] = c2[0]
    this.triangles_[this.numTriangles_ * 24 + 21] = c2[1]
    this.triangles_[this.numTriangles_ * 24 + 22] = c2[2]
    this.triangles_[this.numTriangles_ * 24 + 23] = c2[3]
    this.numTriangles_++
    this.trianglesUpdated_ = true
  }

  addGridXZ (dim, step) {
    let xpos = -dim * 0.5 * step
    const lineLength = dim * step
    const offset_ = -0.005
    const mainOffset_ = offset_ - offset_ * 0.5
    for (let x = 0; x <= dim; x++) {
      const p0 = vec3.fromValues(xpos, offset_, -lineLength * 0.5)
      const p1 = vec3.fromValues(xpos, offset_, lineLength * 0.5)
      const p2 = vec3.fromValues(-lineLength * 0.5, offset_, xpos)
      const p3 = vec3.fromValues(lineLength * 0.5, offset_, xpos)
      this.addLine(p0, Vec4Colors.Grey, p1, Vec4Colors.Grey)
      this.addLine(p2, Vec4Colors.Grey, p3, Vec4Colors.Grey)
      xpos += step
    }
    const p0 = vec3.fromValues(-dim * 0.5 * step, mainOffset_, 0.0)
    const p1 = vec3.fromValues(dim * 0.5 * step, mainOffset_, 0.0)
    const p2 = vec3.fromValues(0.0, mainOffset_, -dim * 0.5 * step)
    const p3 = vec3.fromValues(0.0, mainOffset_, dim * 0.5 * step)
    this.addLine(p0, Vec4Colors.White, p1, Vec4Colors.White)
    this.addLine(p2, Vec4Colors.White, p3, Vec4Colors.White)
  }

  addOrigin (pos, scale) {
    const p0 = pos
    const pX = vec4.fromValues(scale, 0.0, 0.0, 0.0)
    const pY = vec4.fromValues(0.0, scale, 0.0, 0.0)
    const pZ = vec4.fromValues(0.0, 0.0, scale, 0.0)
    const vX = vec4.fromValues(0.0, 0.0, 0.0, 0.0)
    const vY = vec4.fromValues(0.0, 0.0, 0.0, 0.0)
    const vZ = vec4.fromValues(0.0, 0.0, 0.0, 0.0)
    vec4.add(vX, p0, pX)
    vec4.add(vY, p0, pY)
    vec4.add(vZ, p0, pZ)
    this.addLine(p0, Vec4Colors.Red, vX, Vec4Colors.Red)
    this.addLine(p0, Vec4Colors.Green, vY, Vec4Colors.Green)
    this.addLine(p0, Vec4Colors.Blue, vZ, Vec4Colors.Blue)
  }

  addImageQuad (xmin, xmax, ymin, ymax) {
    const p0 = vec4.fromValues(this.toNdc(xmin), this.toNdc(ymin), 0.0, 1.0)
    const p1 = vec4.fromValues(this.toNdc(xmax), this.toNdc(ymin), 0.0, 1.0)
    const p2 = vec4.fromValues(this.toNdc(xmax), this.toNdc(ymax), 0.0, 1.0)
    const p3 = vec4.fromValues(this.toNdc(xmin), this.toNdc(ymax), 0.0, 1.0)
    const c0 = vec4.fromValues(0, 0, 0.0, 0.0, 1.0)
    const c1 = vec4.fromValues(1, 0, 0.0, 0.0, 1.0)
    const c2 = vec4.fromValues(1, 0, 1.0, 0.0, 1.0)
    const c3 = vec4.fromValues(0, 0, 1.0, 0.0, 1.0)
    for (let i = 0; i < 4; i++) {
      this.screenNdcVerts_[i] = p0[i]
      this.screenNdcVerts_[i + 4] = c0[i]
      this.screenNdcVerts_[i + 8] = p2[i]
      this.screenNdcVerts_[i + 12] = c2[i]
      this.screenNdcVerts_[i + 16] = p3[i]
      this.screenNdcVerts_[i + 20] = c3[i]
      this.screenNdcVerts_[i + 24] = p0[i]
      this.screenNdcVerts_[i + 28] = c0[i]
      this.screenNdcVerts_[i + 32] = p1[i]
      this.screenNdcVerts_[i + 36] = c1[i]
      this.screenNdcVerts_[i + 40] = p2[i]
      this.screenNdcVerts_[i + 44] = c2[i]
    }
    this.numNdcVerts_ = 6
    this.screenNdcQuadUpdated_ = true
  }

  setPixelStorageBuffer (pixelStorageBuffer) {
    this.uniformBindGroupDescriptor1_ = {
      layout: this.uniformsBindGroupLayout1_,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.uniformBuffer_.getBuffer(),
            offset: 0,
            size: this.uniformBuffer_.getSizeInBytes()
          }
        },
        {
          binding: 1,
          resource: {
            buffer: pixelStorageBuffer.getBuffer(),
            offset: 0,
            size: pixelStorageBuffer.getSizeInBytes()
          }
        }
      ]
    }
    this.pixelBindGroup_ = super
      .getDevice()
      .createBindGroup(this.uniformBindGroupDescriptor1_)
  }

  clearPrimitive () {
    this.numPoints_ = 0
    this.numLines_ = 0
    this.numTriangles_ = 0
    this.numNdcVerts_ = 0
    this.linesUpdated_ = true
    this.pointsUpdated_ = true
    this.trianglesUpdated_ = true
    this.screenNdcQuadUpdated_ = true
  }

  update () {
    if (this.pointsUpdated_) {
      // const arrSize = this.numPoints_ * Float32Array.BYTES_PER_ELEMENT * 8
      this.pointVertexBuffer_.uploadData(this.points_)
      this.pointsUpdated_ = false
    }
    if (this.linesUpdated_) {
      // const arrSize = this.numLines_ * Float32Array.BYTES_PER_ELEMENT * 8 * 2
      this.lineVertexBuffer_.uploadData(this.lines_)
      this.linesUpdated_ = false
    }
    if (this.trianglesUpdated_) {
      // const arrSize = this.numTriangles_ * Float32Array.BYTES_PER_ELEMENT * 8 * 3
      this.triangleVertexBuffer_.uploadData(this.triangles_)
      this.trianglesUpdated_ = false
    }
    if (this.screenNdcQuadUpdated_) {
      // const arrSize = Float32Array.BYTES_PER_ELEMENT * 8 * 6
      this.ndcVertexBuffer_.uploadData(this.screenNdcVerts_)
      this.screenNdcQuadUpdated_ = false
    }
  }

  render (passEncoder) {
    if (this.numPoints_ > 0) {
      passEncoder.setVertexBuffer(0, this.pointVertexBuffer_.getBuffer())
      passEncoder.setPipeline(this.pointPipeline_.getPipeline())
      passEncoder.setBindGroup(0, this.pointBindGroup_)
      passEncoder.draw(this.numPoints_, 1, 0, 0)
    }
    if (this.numLines_ > 0) {
      passEncoder.setVertexBuffer(0, this.lineVertexBuffer_.getBuffer())
      passEncoder.setPipeline(this.linePipeline_.getPipeline())
      passEncoder.setBindGroup(0, this.pointBindGroup_)
      passEncoder.draw(this.numLines_ * 2, 1, 0, 0)
    }
    if (this.numTriangles_ > 0) {
      passEncoder.setVertexBuffer(0, this.triangleVertexBuffer_.getBuffer())
      passEncoder.setPipeline(this.trianglePipeline_.getPipeline())
      passEncoder.setBindGroup(0, this.pointBindGroup_)
      passEncoder.draw(this.numTriangles_ * 3, 1, 0, 0)
    }
    if (this.numNdcVerts_ > 0) {
      passEncoder.setVertexBuffer(0, this.ndcVertexBuffer_.getBuffer())
      passEncoder.setPipeline(this.pixelPipeline_.getPipeline())
      passEncoder.setBindGroup(0, this.pixelBindGroup_)
      passEncoder.draw(this.numNdcVerts_, 1, 0, 0)
    }
  }
}

export { wtPrimRender }
