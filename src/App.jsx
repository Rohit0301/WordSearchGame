import React, { Fragment, useEffect, useRef, useState } from "react";

import "./utils/words";
import "./utils/prototype";
import Board from "./components/Board";
import {
	drawGrid,
	clearCanvas,
	getDirection,
	drawRectangles,
	checkWordInQuestions,
} from "./utils";
import { grid, questions } from "./utils/grid";
import Questions from "./components/Questions";
import Header from "./components/Header";

import "./App.css";
import Celebration from "./components/Celebration";

// const grid = [
// 	["A", "B", "C", "D", "E", "F", "S", "H", "I", "J"],
// 	["K", "L", "M", "N", "O", "T", "Q", "R", "S", "T"],
// 	["U", "V", "W", "X", "A", "Z", "A", "B", "C", "D"],
// 	["E", "F", "G", "C", "I", "J", "K", "L", "M", "N"],
// 	["O", "P", "K", "R", "S", "T", "U", "V", "W", "X"],
// 	["Y", "Z", "A", "B", "C", "D", "E", "F", "G", "H"],
// 	["I", "J", "K", "L", "M", "N", "O", "P", "Q", "R"],
// 	["S", "T", "N", "I", "A", "J", "Y", "Z", "A", "B"],
// 	["C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
// 	["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"],
// ];
// const questions = ["STACK", "JAIN"];

const WordSearchGame = () => {
	const canvasRef = useRef(null);
	const overlayRef = useRef(null);
	const previousCanvasRef = useRef(null);

	const [solved, setSolved] = useState([]);
	const [rectangles, setRectangles] = useState([]);
	const [hoveredCell, setHoveredCell] = useState(null);
	const [isMouseDown, setIsMouseDown] = useState(false);
	const [currentRectangle, setCurrentRectangle] = useState({});

	useEffect(() => {
		const canvas = overlayRef.current;
		const ctx = canvas.getContext("2d");
		drawGrid(ctx, grid);
	}, []);

	useEffect(() => {
		drawRectangles(previousCanvasRef, canvasRef, rectangles);
	}, [rectangles.length]);

	const handleMouseDown = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const canvas = canvasRef.current;
		const { left: offsetX, top: offsetY } = canvas.getBoundingClientRect();

		const mouseX = e.clientX - offsetX;
		const mouseY = e.clientY - offsetY;

		const startX = Math.floor(mouseX / 50) * 50 + 15;
		const startY = Math.floor(mouseY / 50) * 50 + 25;

		const row = Math.floor(startX / 50) + 1;
		const col = Math.floor(startY / 50) + 1;

		setCurrentRectangle({
			row,
			col,
			startX,
			startY,
		});
		setIsMouseDown(true);
	};

	const handleMouseUp = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsMouseDown(false);

		const [isVertical, isHorizontal, isRightDiagonal, isLeftDiagonal] =
			getDirection(hoveredCell, currentRectangle);

		if (isVertical || isHorizontal || isRightDiagonal || isLeftDiagonal) {
			let updatedRectangle = {
				...currentRectangle,
				isVertical,
				isHorizontal,
				isRightDiagonal,
				isLeftDiagonal,
			};
			const result = checkWordInQuestions(updatedRectangle, questions, grid);
			if (result?.isSolved) {
				setSolved([...solved, result]);
				updatedRectangle["color"] = result.color;
				setRectangles([...rectangles, updatedRectangle]);
				return;
			}
		}
		clearCanvas(canvasRef);
	};

	const handleMouseMove = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!isMouseDown) {
			return;
		}

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const offsetX = canvas.getBoundingClientRect().left;
		const offsetY = canvas.getBoundingClientRect().top;
		const { startX, startY } = currentRectangle;

		const mouseX = parseInt(e.clientX - offsetX);
		const mouseY = parseInt(e.clientY - offsetY);

		const deltaX = mouseX - startX;
		const deltaY = mouseY - startY;
		const rotationAngleRadians = Math.atan2(deltaY, deltaX);

		const width = Math.sqrt(deltaX ** 2 + deltaY ** 2);
		const height = 36;

		const endX = startX + Math.cos(rotationAngleRadians) * width;
		const endY = startY + Math.sin(rotationAngleRadians) * width;
		clearCanvas(canvasRef);
		let diff = 0;

		if (rotationAngleRadians > 1) diff = 10;

		ctx.save();
		ctx.translate(startX + diff, startY - diff);
		ctx.rotate(rotationAngleRadians);
		ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
		ctx.roundRect(0, -height / 2, width, height, 3 * 16).fill();
		ctx.restore();

		const row = Math.floor(endX / 50) + 1;
		const col = Math.floor(endY / 50) + 1;

		setHoveredCell({ x: row, y: col });
		setCurrentRectangle({
			...currentRectangle,
			endX,
			endY,
			width,
			height,
			endRow: row,
			endCol: col,
			rotationAngleRadians,
		});
	};

	return (
		<Fragment>
			<Header isGameEnd={questions.length === solved.length} />
			<div id="container">
				<Board
					canvasRef={canvasRef}
					overlayRef={overlayRef}
					handleMouseUp={handleMouseUp}
					handleMouseMove={handleMouseMove}
					handleMouseDown={handleMouseDown}
					previousCanvasRef={previousCanvasRef}
				/>
				<Questions questions={questions} solved={solved} />
			</div>
			{questions.length === solved.length && <Celebration />}
		</Fragment>
	);
};

export default WordSearchGame;
