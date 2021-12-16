/* global GPUTextureUsage */
import { WtResource } from './WtResource'
import { WtBuffer } from './WtBuffer'

export const wtTextureUsage = {
  TU_COPY_SRC: GPUTextureUsage.COPY_SRC,
  TU_COPY_DST: GPUTextureUsage.COPY_DST,
  TU_SAMPLED: GPUTextureUsage.SAMPLED,
  TU_STORAGE: GPUTextureUsage.STORAGE,
  TU_RENDER_ATTACHMENT: GPUTextureUsage.RENDER_ATTACHMENT
}

export class WtTexture extends WtResource {
  constructor (name, context, usage) {
    super(name, context)
    this.width_ = 1
    this.height_ = 1
    this.depth_ = 1
    this.sampleCount_ = 1
    this.usage_ = usage
    this.texture_ = null
    this.viewDescriptor_ = null
  }

  deleteTexture () {
    if (this.texture_ !== null) {
      this.texture_.destroy()
      this.texture_ = null
      this.textureView_ = null
    }
  }

  uploadData (data) {
    // Usage must be copy dst enabled
    const stagingBuffer = new WtBuffer('staging', this.getContext())
    stagingBuffer.createStagingBufferFromData(data)

    // Copy buffer to image
    const commandEncoder = this.getDevice().createCommandEncoder()
    let bytesPerRow = this.width_
    if (this.format_.substring(0, 4) === 'rgba') {
      bytesPerRow *= 4
    }
    if (this.format_.search(/32/) > 0) {
      bytesPerRow *= 4
    }
    //console.log(data)

    commandEncoder.copyBufferToTexture({ buffer: stagingBuffer.getBuffer(), bytesPerRow: bytesPerRow }, { texture: this.texture_ }, { width: this.width_, height: this.height_ })

    this.getDevice().queue.submit([commandEncoder.finish()])
    stagingBuffer.destroy()
  }

  create2D (width, height, format, sampleCount) {
    this.width_ = width
    this.height_ = height
    this.depth_ = 1
    this.format_ = format
    this.sampleCount_ = sampleCount
    this.texture_ = super.getDevice().createTexture({
      size: {
        width: this.width_,
        height: this.height_,
        depthOrArrayLayers: 1
      },
      sampleCount: this.sampleCount_,
      dimension: '2d',
      mipLevelCount: 1,
      format: this.format_,
      usage: this.usage_
    })
    this.viewDescriptor_ = {
      format: format,
      dimension: '2d',
      arrayLayerCount: 1,
      mipLevelCount: 1
    }
  }

  createCube (width, height, format, sampleCount) {
    this.width_ = width
    this.height_ = height
    this.depth_ = 1
    this.format_ = format
    this.sampleCount_ = sampleCount
    this.texture_ = super.getDevice().createTexture({
      size: {
        width: this.width_,
        height: this.height_,
        depthOrArrayLayers: 6
      },
      sampleCount: this.sampleCount_,
      dimension: '2d',
      mipLevelCount: 1,
      format: this.format_,
      usage: this.usage_
    })
    this.viewDescriptor_ = {
      format: format,
      dimension: 'cube',
      arrayLayerCount: 6,
      mipLevelCount: 1,
      size: {
        width: this.width_,
        height: this.height_
      }
    }
  }

  create3D (width, height, depth, format, sampleCount) {
    this.width_ = width
    this.height_ = height
    this.depth_ = depth
    this.format_ = format
    this.sampleCount_ = sampleCount
    this.texture_ = super.getDevice().createTexture({
      size: {
        width: this.width_,
        height: this.height_,
        depth: 1
      },
      arrayLayerCount: 1,
      sampleCount: this.sampleCount_,
      dimension: '3d',
      mipLevelCount: 1,
      format: this.format_,
      usage: this.usage_
    })
  }

  createView () {
    this.textureView_ = this.texture_.createView(this.viewDescriptor_)
    return this.textureView_
  }
}
