export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["docs/.nojekyll","docs/assets/favicon.png","docs/assets/hierarchy.js","docs/assets/highlight.css","docs/assets/icons.js","docs/assets/icons.svg","docs/assets/main.js","docs/assets/navigation.js","docs/assets/search.js","docs/assets/style.css","docs/classes/webGPU_Camera.Camera.html","docs/classes/webGPU_color_Color.Color.html","docs/classes/webGPU_controls_ArcballControls.ArcballControls.html","docs/classes/webGPU_geometry_CubeGeometry.CubeGeometry.html","docs/classes/webGPU_geometry_CylinderGeometry.CylinderGeometry.html","docs/classes/webGPU_geometry_Geometry.Geometry.html","docs/classes/webGPU_geometry_QuadGeometry.QuadGeometry.html","docs/classes/webGPU_geometry_SphereGeometry.SphereGeometry.html","docs/classes/webGPU_geometry_TriangleGeometry.TriangleGeometry.html","docs/classes/webGPU_material_ColorMaterial.ColorMaterial.html","docs/classes/webGPU_material_Material.Material.html","docs/classes/webGPU_material_RayMarchingMaterial.RayMarchingMaterial.html","docs/classes/webGPU_material_ShaderMaterial.ShaderMaterial.html","docs/classes/webGPU_Object3D.Object3D.html","docs/classes/webGPU_Renderer.Renderer.html","docs/classes/webGPU_scene_InstancedSceneObject.InstancedSceneObject.html","docs/classes/webGPU_scene_Scene.Scene.html","docs/classes/webGPU_scene_SceneObject.SceneObject.html","docs/classes/webGPU_texture_Texture.Texture.html","docs/classes/webGPU_utils_UniformBuffer.UniformBuffer.html","docs/functions/computeShader.compute3DTexture.html","docs/functions/controls_cameraControls.addCameraControls.html","docs/functions/controls_controls.svelte.getControls.html","docs/functions/controls_effectsControls.addEffectsControls.html","docs/functions/controls_generalControls.ts.addGeneralControls.html","docs/functions/controls_miscControls.svelte.addMiscControls.html","docs/functions/controls_rayMarchingControls.addRayMarchingControls.html","docs/functions/fullscreen.svelte.useFullscreen.html","docs/functions/proteins_mmcif_mmcifGeometry.createMmcifGeometry.html","docs/functions/proteins_mmcif_mmcifLoader.loadMmcifLocal.html","docs/functions/proteins_pdb_pdbGeometry.createMoleculeSceneObjects.html","docs/functions/proteins_pdb_pdbGeometry.parsePdb.html","docs/functions/proteins_pdb_pdbLoader.loadPDBLocal.html","docs/functions/proteins_pdb_pdbLoader.loadPDBWeb.html","docs/functions/resizeableCanvas.autoResizeCanvas.html","docs/functions/webGPU_helpers_helpers.degToRad.html","docs/functions/webGPU_helpers_helpers.radToDeg.html","docs/functions/webGPU_helpers_webGpu.draw.html","docs/functions/webGPU_helpers_webGpu.getWebGPUAdapter.html","docs/functions/webGPU_helpers_webGpu.getWebGPUDevice.html","docs/functions/webGPU_helpers_webGpu.initWebGPU.html","docs/functions/webGPU_helpers_webGpu.queueBufferWrite.html","docs/hierarchy.html","docs/index.html","docs/interfaces/webGPU_scene_BaseSceneObject.BaseSceneObject.html","docs/media/favicon.png","docs/modules/computeShader.html","docs/modules/controls_cameraControls.html","docs/modules/controls_controls.svelte.html","docs/modules/controls_effectsControls.html","docs/modules/controls_generalControls.ts.html","docs/modules/controls_miscControls.svelte.html","docs/modules/controls_rayMarchingControls.html","docs/modules/fullscreen.svelte.html","docs/modules/globalState.svelte.html","docs/modules/proteins_mmcif_mmcifGeometry.html","docs/modules/proteins_mmcif_mmcifLoader.html","docs/modules/proteins_mmcif_mmcifTypes.html","docs/modules/proteins_pdb_pdbColors.html","docs/modules/proteins_pdb_pdbGeometry.html","docs/modules/proteins_pdb_pdbLoader.html","docs/modules/resizeableCanvas.html","docs/modules/webGPU_Camera.html","docs/modules/webGPU_color_Color.html","docs/modules/webGPU_controls_ArcballControls.html","docs/modules/webGPU_geometry_CubeGeometry.html","docs/modules/webGPU_geometry_CylinderGeometry.html","docs/modules/webGPU_geometry_Geometry.html","docs/modules/webGPU_geometry_QuadGeometry.html","docs/modules/webGPU_geometry_SphereGeometry.html","docs/modules/webGPU_geometry_TriangleGeometry.html","docs/modules/webGPU_helpers_helpers.html","docs/modules/webGPU_helpers_webGpu.html","docs/modules/webGPU_material_ColorMaterial.html","docs/modules/webGPU_material_Material.html","docs/modules/webGPU_material_RayMarchingMaterial.html","docs/modules/webGPU_material_ShaderMaterial.html","docs/modules/webGPU_Object3D.html","docs/modules/webGPU_Renderer.html","docs/modules/webGPU_scene_BaseSceneObject.html","docs/modules/webGPU_scene_InstancedSceneObject.html","docs/modules/webGPU_scene_Scene.html","docs/modules/webGPU_scene_SceneObject.html","docs/modules/webGPU_texture_Texture.html","docs/modules/webGPU_utils_UniformBuffer.html","docs/modules.html","docs/types/computeShader.Compute3DTextureParams.html","docs/types/controls_controls.svelte.ButtonControlParams.html","docs/types/controls_controls.svelte.CheckboxControlParams.html","docs/types/controls_controls.svelte.ColorControlParams.html","docs/types/controls_controls.svelte.ControlParams.html","docs/types/controls_controls.svelte.NumberControlParams.html","docs/types/controls_controls.svelte.SelectControlParams.html","docs/types/controls_controls.svelte.TextControlParams.html","docs/types/globalState.svelte.GlobalState.html","docs/types/proteins_mmcif_mmcifTypes.mmcifAtom.html","docs/types/proteins_mmcif_mmcifTypes.mmcifBond.html","docs/types/proteins_pdb_pdbGeometry.AtomData.html","docs/types/proteins_pdb_pdbGeometry.Bond.html","docs/types/proteins_pdb_pdbGeometry.MoleculeData.html","docs/types/proteins_pdb_pdbLoader.PdbFile.html","docs/types/resizeableCanvas.AutoResizeCanvasParams.html","docs/types/webGPU_Camera.CameraParams.html","docs/types/webGPU_color_Color.ColorParams.html","docs/types/webGPU_color_Color.CssColor.html","docs/types/webGPU_controls_ArcballControls.ArcballControlsParams.html","docs/types/webGPU_controls_ArcballControls.Input.html","docs/types/webGPU_geometry_CylinderGeometry.CylinderGeometryParams.html","docs/types/webGPU_geometry_Geometry.GeometryParams.html","docs/types/webGPU_geometry_SphereGeometry.SphereGeometryParams.html","docs/types/webGPU_helpers_webGpu.InitWebGPUParmas.html","docs/types/webGPU_helpers_webGpu.WebGPU.html","docs/types/webGPU_material_Material.MaterialParams.html","docs/types/webGPU_material_RayMarchingMaterial.RayMarchingMaterialParams.html","docs/types/webGPU_material_ShaderMaterial.ShaderMaterialParams.html","docs/types/webGPU_Renderer.RendererParams.html","docs/types/webGPU_texture_Texture.TextureData.html","docs/types/webGPU_utils_UniformBuffer.UniformBufferParams.html","docs/variables/globalState.svelte.globalState-1.html","docs/variables/proteins_pdb_pdbColors.elementColors.html","docs/variables/proteins_pdb_pdbLoader.LOCAL_PDB_FILES.html","docs/variables/webGPU_color_Color.CSS_COLORS.html","docs/variables/webGPU_utils_UniformBuffer.DATA_TYPE_SIZES.html","favicon.png"]),
	mimeTypes: {".png":"image/png",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".html":"text/html"},
	_: {
		client: {"start":"_app/immutable/entry/start.0r3QrO1d.js","app":"_app/immutable/entry/app.TFxLjLxZ.js","imports":["_app/immutable/entry/start.0r3QrO1d.js","_app/immutable/chunks/entry.DT83CXea.js","_app/immutable/chunks/runtime.Cjuk95Ml.js","_app/immutable/chunks/control.CYgJF_JY.js","_app/immutable/chunks/index-client.DibeTDnh.js","_app/immutable/entry/app.TFxLjLxZ.js","_app/immutable/chunks/preload-helper.C1FmrZbK.js","_app/immutable/chunks/runtime.Cjuk95Ml.js","_app/immutable/chunks/render.D5jNgPOw.js","_app/immutable/chunks/events.DrILCSVv.js","_app/immutable/chunks/disclose-version.BcvwuTr4.js","_app/immutable/chunks/props.CnKyG9G2.js","_app/immutable/chunks/proxy.Cc6fi5nY.js","_app/immutable/chunks/this.DsiEjiIA.js","_app/immutable/chunks/index-client.DibeTDnh.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/examples",
				pattern: /^\/examples\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/examples/blending",
				pattern: /^\/examples\/blending\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/examples/molecules",
				pattern: /^\/examples\/molecules\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/examples/ray-marching",
				pattern: /^\/examples\/ray-marching\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/examples/rotation",
				pattern: /^\/examples\/rotation\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
