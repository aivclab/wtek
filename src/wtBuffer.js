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
    this.sizeInBytes_ = 0;
  }

  createVertexBuffer(sizeInBytes) {
    this.usage_ = bufferUsage.Vertex | bufferUsage.CopyDst;
    this.sizeInBytes_ = sizeInBytes;
    let bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_,
    };
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor);
  }

  createVertexBufferFromData(data) {
    this.usage_ = bufferUsage.Vertex | bufferUsage.CopyDst;
    let bufferDescriptor = {
      size: data.byteLength,
      usage: this.usage_,
    };
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor);
    super.getDevice().defaultQueue.writeBuffer(this.buffer_, 0, data.buffer);
  }

  createUniformBuffer(sizeInBytes) {
    this.usage_ = bufferUsage.Uniform | bufferUsage.CopyDst; // |
    // bufferUsage.MapWrite;
    this.sizeInBytes_ = sizeInBytes;
    let bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_,
    };
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor);
  }

  createUniformBufferFromData(data) {
    this.usage_ = bufferUsage.Uniform | bufferUsage.CopyDst;
    let bufferDescriptor = {
      size: data.byteLength,
      usage: this.usage_,
    };
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor);
    super.getDevice().defaultQueue.writeBuffer(this.buffer_, 0, data.buffer);
  }

  createStorageBuffer(sizeInBytes) {
    this.usage_ = bufferUsage.Storage | GPUBufferUsage.COPY_SRC;
    this.sizeInBytes_ = sizeInBytes;
    let bufferDescriptor = {
      size: this.sizeInBytes_,
      usage: this.usage_,
    };
    this.buffer_ = super.getDevice().createBuffer(bufferDescriptor);
  }

  getBuffer() {
    return this.buffer_;
  }

  getSizeInBytes() {
    return this.sizeInBytes_;
  }

  async mapBuffer() {
    // Todo how does this work?
    this.buffer_.mapAsync(GPUMapMode.WRITE, 0, this.sizeInBytes_);
  }

  async unmapBuffer() {
    this.buffer_.mapAsync(GPUMapMode.READ, 0, this.sizeInBytes_);
  }

  uploadData(data) {}
}

export { wtBuffer };
