/* global  GPUBufferUsage,  GPUMapMode */
import { WtResource } from './WtResource'

export const wtBufferType = {
  VertexBuffer: 'vertexBuffer',
  UniformBuffer: 'uniform-buffer',
  StorageBuffer: 'storageBuffer'
}

// Must be defined as const enums to support implementations with undefined
// GPUBufferUsage
export const wtBufferUsage = {
  MapRead: 0x1, // GPUBufferUsage.MAP_READ,
  MapWrite: 0x2, // GPUBufferUsage.MAP_WRITE,
  CopySrc: 0x4, // GPUBufferUsage.COPY_SRC,
  CopyDst: 0x8, // GPUBufferUsage.COPY_DST,
  Index: 0x10, // GPUBufferUsage.INDEX,
  Vertex: 0x20, // GPUBufferUsage.VERTEX,
  Uniform: 0x40, // GPUBufferUsage.UNIFORM,
  Storage: 0x80, // GPUBufferUsage.STORAGE,
  Indirect: 0x100, // GPUBufferUsage.INDIRECT,
  QueryResult: 0x200, // GPUBufferUsage.QUERY_RESOLVE,
  Unknown: 0x00000
}

export class WtBuffer extends WtResource {
  constructor (name, context) {
    super(name, context)
    this.bufferType_ = wtBufferType.VertexBuffer
    this.usage_ = wtBufferUsage.Unknown
    this.buffer_ = null
    this.stagingBuffer_ = null
    this.sizeInBytes_ = 0
  }

  destroy () {
    if (this.buffer_) {
      this.buffer_.destroy()
    }
  }

  createVertexBuffer (sizeInBytes) {
    this.usage_ = wtBufferUsage.Vertex | wtBufferUsage.CopyDst
    this.sizeInBytes_ = sizeInBytes
    const bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_
    }
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor)
    this.stagingBuffer_ = super.getDevice().createBuffer({
      size: this.sizeInBytes_,
      usage: wtBufferUsage.CopySrc | wtBufferUsage.MapWrite
    })
  }

  createVertexBufferFromData (data) {
    this.usage_ = wtBufferUsage.Vertex
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

  /*
   * @param {ArrayBuffer} data
   */
  createStagingBufferFromData (data) {
    this.usage_ = GPUBufferUsage.COPY_SRC
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
    this.usage_ = wtBufferUsage.Uniform | wtBufferUsage.CopyDst // |
    // wtBufferUsage.MapWrite;
    this.sizeInBytes_ = sizeInBytes
    const bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_
    }
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor)
    this.stagingBuffer_ = super.getDevice().createBuffer({
      size: this.sizeInBytes_,
      usage: wtBufferUsage.CopySrc | wtBufferUsage.MapWrite
    })
  }

  createUniformBufferFromData (data) {
    this.usage_ = wtBufferUsage.Uniform | wtBufferUsage.CopyDst
    const bufferDescriptor = {
      size: data.byteLength,
      usage: this.usage_
    }
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor)
    super.getDevice().defaultQueue.writeBuffer(this.buffer_, 0, data.buffer)
  }

  createStorageBuffer (sizeInBytes) {
    this.usage_ = wtBufferUsage.Storage | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    this.sizeInBytes_ = sizeInBytes
    const bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_
    }
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor)
    this.stagingBuffer_ = super.getDevice().createBuffer({
      size: this.sizeInBytes_,
      usage: wtBufferUsage.CopySrc | wtBufferUsage.MapWrite
    })
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
    this.context_
      .getDevice()
      .queue.writeBuffer(
        this.buffer_,
        0,
        data.buffer,
        data.byteOffset,
        data.byteLength
      )
  }
}
