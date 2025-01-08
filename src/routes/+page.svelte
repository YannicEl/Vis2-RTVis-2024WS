<script lang="ts">
</script>

<main class="mx-auto mt-8 max-w-screen-md p-4">
	<enhanced:img src="$lib/assets/images/title_image.jpg" alt="4V4L molecule visualization" />

	<h1 class="mt-4">Rendering molecules for fun and profit</h1>

	<p class="mt-2">
		Welcome to our project, an in-depth exploration of visualizing molecules led by Yannic Ellhotka
		and Simon Wesp. As part of the Visualization 2 & Real Time Visualization university course, this
		web application aims to provide an interactive platform for rendering and exploring molecular
		structures using cutting-edge graphics technologies. Our project leverages the power of WebGPU,
		a new web standard for low-level graphics and compute API, to create stunning visualizations of
		complex molecular structures in real-time. By combining the latest web technologies with
		advanced rendering techniques, we hope to inspire and educate users about the fascinating world
		of molecular biology and chemistry.
	</p>

	<p class="mt-4">
		This work is based on the research paper <a
			href="https://doi.org/10.2312/VCBM.20181244"
			target="_blank"
			class="underline"
			>"Improving Perception of Molecular Surface Visualizations by Incorporating Translucency
			Effects" by Hermosilla, P., Maisch, S., Vazquez, P.-P., & Ropinski, T. (2018).</a
		>
	</p>

	<a href="/examples" class="mt-2 underline">
		<button type="button" class="border-1 mt-4 border border-black px-4 py-2">
			See examples →
		</button>
	</a>

	<h2 class="mt-8">Gallery</h2>
	<enhanced:img src="$lib/assets/images/title_image.jpg" alt="4V4L molecule visualization" />
	<enhanced:img src="$lib/assets/images/title_image.jpg" alt="4V4L molecule visualization" />
	<enhanced:img src="$lib/assets/images/title_image.jpg" alt="4V4L molecule visualization" />
	<enhanced:img src="$lib/assets/images/title_image.jpg" alt="4V4L molecule visualization" />

	<p class="mt-8">
		Ray marching is a powerful technique used in computer graphics and computational geometry for
		rendering complex scenes, particularly in the context of 3D volumetric rendering. It works by
		tracing rays through a scene and stepping through the environment at discrete intervals to
		accumulate color, lighting, and texture data. Unlike traditional ray tracing, which relies on
		calculating intersections with geometric surfaces, ray marching is often used for rendering
		objects like fog, clouds, and other volumetric phenomena, where surfaces are not well-defined.
		This technique involves marching along a ray, incrementally calculating the distance to the
		nearest surface or density field, and stopping when a specific threshold is reached or when the
		ray exits the scene. The resulting images often exhibit stunning effects, such as soft shadows
		and intricate light scattering, which can be computationally expensive but provide a high level
		of realism in scenes with complex lighting and materials.
	</p>
</main>
