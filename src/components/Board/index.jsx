import React from "react";

export default function Board({
	canvasRef,
	overlayRef,
	handleMouseUp,
	handleMouseMove,
	handleMouseDown,
	previousCanvasRef,
}) {
	return (
		<div>
			<canvas
				id="overlay"
				width={500}
				height={500}
				ref={overlayRef}
				style={{ position: "absolute" }}
			></canvas>
			<canvas
				width={500}
				height={500}
				id="prevCanvas"
				ref={previousCanvasRef}
				style={{ position: "absolute" }}
			></canvas>
			<canvas
				id="canvas"
				width={500}
				height={500}
				ref={canvasRef}
				onMouseUp={handleMouseUp}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				style={{ position: "relative" }}
			></canvas>
		</div>
	);
}
