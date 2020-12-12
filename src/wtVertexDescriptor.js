
const byteSizeOfFloat = 4;

export const VertexType = {
    VT_Vertex4: 'vertex4',
    VT_VertexColor4: 'vertexColor4',
    VT_VertexColorNormal4: 'vertexColorNormal4'
}

class wtVertexLayout {
    constructor(format, shaderLocation, offset) {
        this.format_ = format;
        this.shaderLocation_ = shaderLocation;
        this.offset_ = offset;
    }

    getFormat() { return this.format_; }
    getShaderLocation() { return this.shaderLocation_; }
    getOffset() { return this.offset_; }
}

class wtVertexDescriptor {
    constructor(vertexType) {

        this.vertexType_ = vertexType;

        switch (this.vertexType_) {
            case VertexType.VT_Vertex4:
                this.vertexLayout_ = [new wtVertexLayout('float4', 0, 0)];
                this.sizeInBytes_ = 4 * byteSizeOfFloat;
                break;
            case VertexType.VT_VertexColor4:
                this.vertexLayout_ = [
                    new wtVertexLayout('float4', 0, 0),
                    new wtVertexLayout('float4', 1, 4 * byteSizeOfFloat)];
                this.sizeInBytes_ = 8 * byteSizeOfFloat;
                break;
            case VertexType.VT_VertexColorNormal4:
                this.vertexLayout_ = [
                    new wtVertexLayout('float4', 0, 0),
                    new wtVertexLayout('float4', 1, 4 * byteSizeOfFloat),
                    new wtVertexLayout('float4', 2, 8 * byteSizeOfFloat)];
                this.sizeInBytes_ = 12 * byteSizeOfFloat;
                break;
        }
    }

    getVertexLayout() { this.vertexLayout_; }
    getVertexSizeInBytes() { return this.sizeInBytes_; }
    getVertexState() {
        let attArray = [];
        for (let i = 0; i < this.vertexLayout_.length; i++) {
            let att = {
                shaderLocation: this.vertexLayout_[i].getShaderLocation(),  
                offset: this.vertexLayout_[i].getOffset(), 
                format: this.vertexLayout_[i].getFormat()};
                attArray.push(att);
        }

        let vertexState = { arrayStride: this.getVertexSizeInBytes(),  attributes: attArray };
        return vertexState;
    }
}

export { wtVertexLayout };
export { wtVertexDescriptor };