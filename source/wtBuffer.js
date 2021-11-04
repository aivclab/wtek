import { vec4 } from 'gl-matrix'
import { wtResource } from './wtResource'

export const Vec4Colors = {
  White: vec4.fromValues(1.0, 1.0, 1.0, 1.0),
  Black: vec4.fromValues(0.0, 0.0, 0.0, 1.0),
  Red: vec4.fromValues(1.0, 0.0, 0.0, 1.0),
  Green: vec4.fromValues(0.0, 1.0, 0.0, 1.0),
  Blue: vec4.fromValues(0.0, 0.0, 1.0, 1.0),
  Yellow: vec4.fromValues(1.0, 1.0, 0.0, 1.0),
  DarkGrey: vec4.fromValues(0.25, 0.25, 0.25, 1.0),
  Grey: vec4.fromValues(0.5, 0.5, 0.5, 1.0),
  LightGrey: vec4.fromValues(0.75, 0.75, 0.75, 1.0)
}
export const Vec4Basics = {
  Zero: vec4.fromValues(0.0, 0.0, 0.0, 1.0),
  X: vec4.fromValues(1.0, 0.0, 0.0, 1.0),
  Y: vec4.fromValues(0.0, 1.0, 0.0, 1.0),
  Z: vec4.fromValues(0.0, 0.0, 1.0, 1.0)
}

export const bufferType = {
  VertexBuffer: 'vertexBuffer',
  UniformBuffer: 'uniform-buffer',
  StorageBuffer: 'storageBuffer'
}
export const bufferUsage = {
  MapRead: GPUBufferUsage.MAP_READ,
  MapWrite: GPUBufferUsage.MAP_WRITE,
  CopySrc: GPUBufferUsage.COPY_SRC,
  CopyDst: GPUBufferUsage.COPY_DST,
  Index: GPUBufferUsage.INDEX,
  Vertex: GPUBufferUsage.VERTEX,
  Uniform: GPUBufferUsage.UNIFORM,
  Storage: GPUBufferUsage.STORAGE,
  Indirect: GPUBufferUsage.INDIRECT,
  QueryResult: GPUBufferUsage.QUERY_RESOLVE,
  Unknown: 0x00000
}

class WtBuffer extends wtResource {
  constructor (name, context) {
    super(name, context)
    this.bufferType_ = bufferType.VertexBuffer
    this.usage_ = bufferUsage.Unknown
    this.buffer_ = null
    this.stagingBuffer_ = null
    this.sizeInBytes_ = 0
  }

  createVertexBuffer (sizeInBytes) {
    this.usage_ = bufferUsage.Vertex | bufferUsage.CopyDst
    this.sizeInBytes_ = sizeInBytes
    const bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_
    }
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor)
    this.stagingBuffer_ = super.getDevice().createBuffer({ size: this.sizeInBytes_, usage: bufferUsage.CopySrc | bufferUsage.MapWrite })
  }

  createVertexBufferFromData (data) {
    this.usage_ = bufferUsage.Vertex
    const bufferDescriptor = {
      size: data.byteLength,
      usage: this.usage_,
      mappedAtCreation: true
    }
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor)
    const mapped = new Uint8Array(this.buffer_.getMappedRange())
    mapped.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength))
    this.buffer_.unmap()
  }

  createUniformBuffer (sizeInBytes) {
    this.usage_ = bufferUsage.Uniform | bufferUsage.CopyDst // |
    // bufferUsage.MapWrite;
    this.sizeInBytes_ = sizeInBytes
    const bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_
    }
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor)
    this.stagingBuffer_ = super.getDevice().createBuffer({ size: this.sizeInBytes_, usage: bufferUsage.CopySrc | bufferUsage.MapWrite })
  }

  createUniformBufferFromData (data) {
    this.usage_ = bufferUsage.Uniform | bufferUsage.CopyDst
    const bufferDescriptor = {
      size: data.byteLength,
      usage: this.usage_
    }
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor)
    super.getDevice().defaultQueue.writeBuffer(this.buffer_, 0, data.buffer)
  }

  createStorageBuffer (sizeInBytes) {
    this.usage_ = bufferUsage.Storage | GPUBufferUsage.COPY_SRC
    this.sizeInBytes_ = sizeInBytes
    const bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_
    }
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor)
    this.stagingBuffer_ = super.getDevice().createBuffer({ size: this.sizeInBytes_, usage: bufferUsage.CopySrc | bufferUsage.MapWrite })
  }

  getBuffer () {
    return this.buffer_
  }

  getSizeInBytes () {
    return this.sizeInBytes_
  }

  async mapBuffer () {
    // Todo how does this work?
    await this.buffer_.mapAsync(GPUMapMode.WRITE, 0, this.sizeInBytes_)
    return this.buffer_.getMappedRange()
  }

  unmapBuffer () {
    this.buffer_.unmap()
  }

  uploadData (data) {
    this.context_.getDevice().queue.writeBuffer(this.buffer_, 0, data.buffer, data.byteOffset, data.byteLength)
  }
}

export { WtBuffer }
