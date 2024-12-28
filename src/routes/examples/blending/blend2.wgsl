struct OurVertexShaderOutput {
    @builtin(position) position : vec4f,
};

@vertex fn vs(
@builtin(vertex_index) vertexIndex : u32
) -> OurVertexShaderOutput {
    let pos = array(
    //1st triangle
    vec2f(0.0, 0.0),    //center
    vec2f(1.0, 0.0),    //right, center
    vec2f(0.0, 1.0),    //center, top

    //2nd triangle
    vec2f(0.0, 1.0),    //center, top
    vec2f(1.0, 0.0),    //right, center
    vec2f(1.0, 1.0),    //right, top
    );

    var vsOutput : OurVertexShaderOutput;
    let xy = pos[vertexIndex];
    vsOutput.position = uni.matrix * vec4f(xy, 0.0, 1.0);
    vsOutput.texcoord = xy;
    return vsOutput;
}

@fragment fn fs(fsInput : OurVertexShaderOutput) -> @location(0) vec4f {
    let cyan = vec4f(0, 1, 1, 1);

    let grid = vec2u(fsInput.position.xy) / 8;
    let checker = (grid.x + grid.y) % 2 == 1;

    if (checker)
    {
        discard;
    }

    return cyan;
}
