# How to run

1. `npm install`
2. `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000). Make sure to test in a browser that supports WebGPU like new versions of Chrome.
4. Mesh rasterization example [http://localhost:3000/examples/molecules](http://localhost:3000/examples/molecules)
5. Ray marching example [http://localhost:3000/examples/ray-marching](http://localhost:3000/examples/ray-marching)

# Hosted version

[https://vis2-rtvis-2024ws.yannic.workers.dev/](https://vis2-rtvis-2024ws.yannic.workers.dev/)

## Camera

## Geometry

Holds all vertices and indices belonging to a piece of geometry. Has helper functions for writing vertex and index buffers to the GPU.

## Material

Holds a material and provides a function for writing data to the GPU.

## Object3D

Basic 3D object that holds all data required for calculating the model matrix.

## SceneObject

WebGPU-specific object that extends `Object3D` with `load`, `update` and `render` functions.

### Instancing

There is an instanced variant of the `SceneObject`. When the same `SceneObject` is used multiple times, using instancing can greatly boost performance.

It allows efficient endering of multiple copies of the same geometry with varying transformations and materials. This technique reduces the overhead of drawing numerous objects by batching them into a single draw call, enhancing performance.

## Scene

Wrapper object that holds a number of `SceneObjects` and provides functions for drawing and updating them.

## Renderer

The Renderer is responsible for loading and rendering scenes and managing related WebGPU-specific tasks.

## PDB Parser

## Uniform Buffer

## WebGPU init

### custom mini framework

## SDF Texture for Ray Marching

## Ray Marching Shader

## Blending Example - page.svelte
