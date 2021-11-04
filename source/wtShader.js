import { wtResource } from './wtResource'

const vertexShaderType = 'vertex'
const fragmentShaderType = 'fragment'
const computeShaderType = 'compute'

class wtShader extends wtResource {
  constructor (name, context) {
    super(name, context)
  }

  createVertexShaderModule (glslang, source) {
    let shaderModule
    if (source.startsWith('#version')) {
      const shaderModuleDescriptor = {
        code: glslang.compileGLSL(source, vertexShaderType),
        source: source
      }
      shaderModule = super.getDevice().createShaderModule(shaderModuleDescriptor)
    } else {
      shaderModule = super.getDevice().createShaderModule({ code: source })
    }
    console.log(`shaderModule_${vertexShaderType}}`, shaderModule)
    return shaderModule
  }

  createFragmentShaderModule (glslang, source) {
    let shaderModule
    if (source.startsWith('#version')) {
      const shaderModuleDescriptor = {
        code: glslang.compileGLSL(source, fragmentShaderType),
        source: source
      }
      shaderModule = super.getDevice().createShaderModule(shaderModuleDescriptor)
    } else {
      shaderModule = super.getDevice().createShaderModule({ code: source })
    }

    console.log(`shaderModule_${fragmentShaderType}}`, shaderModule)
    return shaderModule
  }

  createComputeShaderModule (glslang, source) {
    let shaderModule
    if (source.startsWith('#version')) {
      const shaderModuleDescriptor = {
        code: glslang.compileGLSL(source, computeShaderType),
        source: source
      }
      shaderModule = super.getDevice().createShaderModule(shaderModuleDescriptor)
    } else {
      shaderModule = super.getDevice().createShaderModule({ code: source })
    }
    console.log(`shaderModule_${computeShaderType}}`, shaderModule)
    return shaderModule
  }
}

export { wtShader }
