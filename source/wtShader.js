import { wtResource } from './wtResource'

const vertexShaderType = 'vertex'
const fragmentShaderType = 'fragment'
const computeShaderType = 'compute'

class wtShader extends wtResource {
  constructor (name, context) {
    super(name, context)
  }

  createVertexShaderModule (glslang, source) {
    const shaderModuleDescriptor = {
      code: glslang.compileGLSL(source, vertexShaderType),
      source: source
    }
    console.log('shaderModuleDescriptor', shaderModuleDescriptor)
    const shaderModule = super
      .getDevice()
      .createShaderModule(shaderModuleDescriptor)
    console.log(`shaderModule_${vertexShaderType}}`, shaderModule)
    return shaderModule
  }

  createFragmentShaderModule (glslang, source) {
    const shaderModuleDescriptor = {
      code: glslang.compileGLSL(source, fragmentShaderType),
      source: source
    }
    console.log('shaderModuleDescriptor', shaderModuleDescriptor)
    const shaderModule = super
      .getDevice()
      .createShaderModule(shaderModuleDescriptor)
    console.log(`shaderModule_${fragmentShaderType}}`, shaderModule)
    return shaderModule
  }

  createComputeShaderModule (glslang, source) {
    const shaderModuleDescriptor = {
      code: glslang.compileGLSL(source, computeShaderType),
      source: source
    }
    console.log('shaderModuleDescriptor', shaderModuleDescriptor)
    const shaderModule = super
      .getDevice()
      .createShaderModule(shaderModuleDescriptor)
    console.log(`shaderModule_${computeShaderType}}`, shaderModule)
    return shaderModule
  }
}

export { wtShader }
