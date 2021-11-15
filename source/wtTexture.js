/* global GPUTextureUsage */
import { WtResource } from './WtResource'

export const TextureUsage = {
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
    this.heigth_ = 1
    this.depth_ = 1
    this.sampleCount_ = 1
    this.usage_ = usage
    this.texture_ = null
  }

  deleteTexture () {
    if (this.texture_ !== null) {
      this.texture_.destroy()
      this.texture_ = null
      this.textureView_ = null
    }
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
    this.textureView_ = this.texture_.createView()
    return this.textureView_
  }
}
