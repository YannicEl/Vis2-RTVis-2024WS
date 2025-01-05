<script lang="ts">
</script>

<main class="mx-auto max-w-screen-md">
	<enhanced:img src="$lib/assets/images/title_image.jpg" alt="An alt text" />

	<h1>Rendering molecules for fun and profit</h1>

	<p>
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

	<a href="/examples" class="mt-2 underline">See examples</a>
</main>
