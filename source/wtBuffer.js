import wtResource from "./wtResource.js";

export const bufferType = {
  VertexBuffer: "vertexBuffer",
  UniformBuffer: "uniform-buffer",
  StorageBuffer: "storageBuffer",
};
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
  Unknown: 0x00000,
};

class wtBuffer extends wtResource {
  constructor(name, context) {
    super(name, context);
    this.bufferType_ = bufferType.VertexBuffer;
    this.usage_ = bufferUsage.Unknown;
    this.buffer_ = null;
    this.stagingBuffer_ = null;
    this.sizeInBytes_ = 0;
  }

  createVertexBuffer(sizeInBytes) {
    this.usage_ = bufferUsage.Vertex | bufferUsage.CopyDst;
    this.sizeInBytes_ = sizeInBytes;
    const bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_,
    };
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor);
    this.stagingBuffer_ = super.getDevice().createBuffer({size: this.sizeInBytes_, usage: bufferUsage.CopySrc | bufferUsage.MapWrite });
  }

  createVertexBufferFromData(data) {
    this.usage_ = bufferUsage.Vertex;
    const bufferDescriptor = {
      size: data.byteLength,
      usage: this.usage_,
      mappedAtCreation: true
    };
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor);
    let mapped = new Uint8Array(this.buffer_.getMappedRange())
    mapped.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength))
    this.buffer_.unmap()
  }

  createUniformBuffer(sizeInBytes) {
    this.usage_ = bufferUsage.Uniform | bufferUsage.CopyDst; // |
    // bufferUsage.MapWrite;
    this.sizeInBytes_ = sizeInBytes;
    const bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_,
    };
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor);
    this.stagingBuffer_ = super.getDevice().createBuffer({size: this.sizeInBytes_, usage: bufferUsage.CopySrc | bufferUsage.MapWrite });
  }

  createUniformBufferFromData(data) {
    this.usage_ = bufferUsage.Uniform | bufferUsage.CopyDst;
    const bufferDescriptor = {
      size: data.byteLength,
      usage: this.usage_,
    };
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor);
    super.getDevice().defaultQueue.writeBuffer(this.buffer_, 0, data.buffer);
  }

  createStorageBuffer(sizeInBytes) {
    this.usage_ = bufferUsage.Storage | GPUBufferUsage.COPY_SRC;
    this.sizeInBytes_ = sizeInBytes;
    const bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_,
    };
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor);
    this.stagingBuffer_ = super.getDevice().createBuffer({size: this.sizeInBytes_, usage: bufferUsage.CopySrc | bufferUsage.MapWrite });
  }

  getBuffer() {
    return this.buffer_;
  }

  getSizeInBytes() {
    return this.sizeInBytes_;
  }

  async mapBuffer() {
    // Todo how does this work?
    await this.buffer_.mapAsync(GPUMapMode.WRITE, 0, this.sizeInBytes_);
    return this.buffer_.getMappedRange()
  }

  unmapBuffer() {
    this.buffer_.unmap();
  }

  uploadData(data) {
    this.context_.getDevice().queue.writeBuffer( this.buffer_, 0, data.buffer, data.byteOffset, data.byteLength )
  }
}

export { wtBuffer };
