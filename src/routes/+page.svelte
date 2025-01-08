<script lang="ts">
	import video from '$lib/assets/images/video.mp4';
</script>

<main class="mx-auto mt-8 max-w-screen-md p-4">
	<enhanced:img src="$lib/assets/images/title_image.png" alt="4V4L molecule visualization" />

	<h1 class="mt-10">Rendering molecules for fun and profit</h1>

	<p class="mt-2">
		Welcome to our project, an in-depth exploration of visualizing molecules led by Yannic Ellhotka
		and Simon Wesp. As part of the Visualization 2 & Real Time Visualization university course, this
		web application aims to provide an interactive platform for rendering and exploring molecular
		structures using cutting-edge graphics technologies. Our project leverages the power of WebGPU,
		a new web standard for low-level graphics and compute API, to create stunning visualizations of
		complex molecular structures in real-time.
	</p>

	<p class="mt-8">
		This work is based on the research paper <a
			href="https://doi.org/10.2312/VCBM.20181244"
			target="_blank"
			class="underline"
			>"Improving Perception of Molecular Surface Visualizations by Incorporating Translucency
			Effects" by Hermosilla, P., Maisch, S., Vazquez, P.-P., & Ropinski, T. (2018).</a
		>
	</p>

	<p class="mb-4">
		This paper deals with the problem of improving the way molecular surface visualizations are
		perceived, which are very important for analyzing molecular structures. Often, these
		visualizations make it difficult to see fine details and internal structures due to occlusion
		and simplification. The authors propose techniques inspired by the properties of translucent
		materials, such as subsurface scattering for better thickness perception, transparency for
		viewing underlying structures, and reflections and refractions to make the curvature easier to
		recognize. These methods aim to reduce visual clutter and give experts a clearer and more useful
		representation, supported by expert feedback and user studies.
	</p>

	<a href="/examples" class=" underline">
		<button type="button" class="border-1 mt-2 border border-black px-4 py-2">
			See examples →
		</button>
	</a>

	<a href="/docs/index.html" class="underline">
		<button type="button" class="border-1 mt-2 border border-black px-4 py-2"> Docs → </button>
	</a>

	<p class="mt-4">
		Make sure to use a recent browser with <a
			href="https://caniuse.com/webgpu"
			target="_blank"
			class="underline">WebGU support</a
		>
	</p>

	<h2 class="mt-8">Gallery</h2>
	<div class="-mx-4 lg:-mx-16">
		<video src={video} class="mt-4" loop muted autoplay></video>
		<enhanced:img src="$lib/assets/images/gallery_1.png" class="mt-4" />
		<enhanced:img src="$lib/assets/images/gallery_2.png" class="mt-4" />
		<enhanced:img src="$lib/assets/images/gallery_3.png" class="mt-4" />
		<enhanced:img src="$lib/assets/images/gallery_4.png" class="mt-4" />
		<enhanced:img src="$lib/assets/images/gallery_5.png" class="mt-4" />
		<enhanced:img src="$lib/assets/images/gallery_6.png" class="mt-4" />
	</div>
</main>
