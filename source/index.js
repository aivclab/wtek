/*
 // require all modules on the path and with the pattern defined
 const req = require.context("./", true, /.js$/);
 const modules = req.keys().map(req);
 // export all modules
 module.exports = modules;
 */
/*
 if ('gpu' in navigator) {
 // WebGPU is supported! 🎉
 console.log('webgpu supported')
 }
 */

export * from './wtBindGroupLayout'
export * from './wtBuffer'
export * from './wtComputePipeline'
export * from './wtConstants'
export * from './wtContext'
export * from './wtGpuDebug'
export * from './wtImport'
export * from './wtPrimRender'
export * from './wtRenderPipeline'
export * from './wtResource'
export * from './wtShader'
export * from './wtSwapChain'
export * from './wtTexture'
export * from './wtVertexDescriptor'
