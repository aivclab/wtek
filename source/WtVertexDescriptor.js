const byteSizeOfFloat = 4

export class WtVertexLayout {
  constructor (format, shaderLocation, offset) {
    this.format_ = format
    this.shaderLocation_ = shaderLocation
    this.offset_ = offset
  }

  getFormat () {
    return this.format_
  }

  getShaderLocation () {
    return this.shaderLocation_
  }

  getOffset () {
    return this.offset_
  }
}

export class WtVertexDescriptor {
  constructor (vertexType) {
    this.vertexType_ = vertexType
    switch (this.vertexType_) {
      case vertexType.VT_Vertex4:
        this.vertexLayout_ = [new WtVertexLayout('float32x4', 0, 0)]
        this.sizeInBytes_ = 4 * byteSizeOfFloat
        break
      case vertexType.VT_VertexColor4:
        this.vertexLayout_ = [
          new WtVertexLayout('float32x4', 0, 0),
          new WtVertexLayout('float32x4', 1, 4 * byteSizeOfFloat)
        ]
        this.sizeInBytes_ = 8 * byteSizeOfFloat
        break
      case vertexType.VT_VertexColorNormal4:
        this.vertexLayout_ = [
          new WtVertexLayout('float32x4', 0, 0),
          new WtVertexLayout('float32x4', 1, 4 * byteSizeOfFloat),
          new WtVertexLayout('float32x4', 2, 8 * byteSizeOfFloat)
        ]
        this.sizeInBytes_ = 12 * byteSizeOfFloat
        break
    }
  }

  getVertexLayout () {
    return this.vertexLayout_
  }

  getVertexSizeInBytes () {
    return this.sizeInBytes_
  }

  getVertexState () {
    const attArray = []
    for (let i = 0; i < this.vertexLayout_.length; i++) {
      const att = {
        shaderLocation: this.vertexLayout_[i].getShaderLocation(),
        offset: this.vertexLayout_[i].getOffset(),
        format: this.vertexLayout_[i].getFormat()
      }
      attArray.push(att)
    }
    const vertexState = {
      arrayStride: this.getVertexSizeInBytes(),
      attributes: attArray
    }
    return vertexState
  }
}
