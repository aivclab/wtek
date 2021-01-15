
import wtResource from "./wtResource.js"

class wtComputePipeline extends wtResource {

    constructor(name, context) {
        super(name, context);
        this.layout_ = null;
    }

    create(computeShaderModule) {
        this.computeStage_ = { computeStage: { module: computeShaderModule, entryPoint: 'main' } };
        this.pipeline_ = super.getDevice().createComputePipeline(this.computeStage_);
    }

    getPipeline() { return this.pipeline_; }
}

export { wtComputePipeline };
