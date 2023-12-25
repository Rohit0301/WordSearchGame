export const fillAlphabets = (ctx, grid) => {
	ctx.font = "20px Arial";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";

	for (let i = 1; i <= 10; i++) {
		for (let j = 1; j <= 10; j++) {
			const x = (j - 1) * 50 + 25;
			const y = i * 50 - 15;

			ctx.fillText(grid[i - 1][j - 1], x, y);
		}
	}
};

export const drawGrid = (ctx, grid) => {
	ctx.clearRect(0, 0, 500, 500);
	ctx.strokeStyle = "#788bff";
	ctx.lineWidth = 2;

	for (let i = 0; i <= 10; i++) {
		const x = i * 50;
		const y = i * 50;

		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(500, y);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, 500);
		ctx.stroke();
	}
	fillAlphabets(ctx, grid);
};

export const getRandomColor = () => {
	const letters = "0123456789ABCDEF";
	let color = "#";
	let opacity = 0.6;

	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}

	const opacityHex = Math.floor(opacity * 255)
		.toString(16)
		.toUpperCase();
	color += opacityHex.length === 1 ? "0" + opacityHex : opacityHex;

	return color;
};

export const modifyQuestions = (questions, solved) => {
	let modifiedQuestions = questions.map((item) => ({
		str: item,
		color: "black",
		isSolved: false,
	}));

	solved.map((item) => {
		let index = modifiedQuestions.findIndex((ques) => ques?.str == item?.str);
		modifiedQuestions[index] = item;
	});
	return modifiedQuestions.slice().sort((a, b) => a.str.length - b.str.length);
};

export const checkWordInQuestions = (rectangle, questions, grid) => {
	let offsets = {
		vertical: [1, 0],
		horizontal: [0, 1],
		diagonalRight: [1, 1],
		diagonalLeft: [+1, -1],
	};
	let startJ = rectangle.row - 1,
		startI = rectangle.col - 1;
	let endJ = rectangle.endRow - 1,
		endI = rectangle.endCol - 1;
	let direction = rectangle?.isRightDiagonal
		? "diagonalRight"
		: rectangle?.isLeftDiagonal
		? "diagonalLeft"
		: rectangle?.isVertical
		? "vertical"
		: "horizontal";
	let offset = offsets[direction];
	let length = Math.abs(
		direction == "horizontal" ? endJ - startJ + 1 : endI - startI + 1
	);
	let word = "";
	while (length-- > 0) {
		word += grid[startI][startJ];
		startI += offset[0];
		startJ += offset[1];
	}
	const reverseWord = word.split("").reverse().join("");
	if (questions.includes(reverseWord)) {
		word = reverseWord;
	}
	return {
		str: word,
		color: getRandomColor(),
		isSolved: questions.includes(word),
	};
};

export const clearCanvas = (canvasRef) => {
	let canvas = canvasRef?.current;
	const ctx = canvas?.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const drawRectangles = (previousCanvasRef, canvasRef, rectangles) => {
	const ctx = previousCanvasRef?.current?.getContext("2d");
	if (!ctx) return;
	clearCanvas(canvasRef);
	clearCanvas(previousCanvasRef);

	rectangles.forEach((rectangle) => {
		let diffX = 0,
			diffY = 0;
		let newWidth = rectangle.width;
		let newRotationAngleRadians = rectangle.rotationAngleRadians;
		if (rectangle.isHorizontal) {
			diffX = 5;
			newRotationAngleRadians = 0;
			newWidth = (rectangle.endRow - rectangle.row + 1) * 50 - 2 * 10;
		} else if (rectangle.isVertical) {
			(diffX = -10), (diffY = 12);
			newRotationAngleRadians = 1.5671862341748968;
			newWidth = (rectangle.endCol - rectangle.col + 1) * 50 - 2 * 10;
		} else if (rectangle.isRightDiagonal) {
			newRotationAngleRadians = 0.78;
			(diffX = 5), (diffY = 10);
			newWidth = (rectangle.endCol - rectangle.col + 1) * 68 - 2 * 8;
		} else if (rectangle.isLeftDiagonal) {
			newRotationAngleRadians = 2.35;
			(diffX = -22), (diffY = 10);
			newWidth = (rectangle.endCol - rectangle.col + 1) * 68 - 2 * 8;
		}
		ctx.save();
		ctx.translate(rectangle.startX - diffX, rectangle.startY - diffY);
		ctx.rotate(newRotationAngleRadians);

		ctx.fillStyle = rectangle.color;
		ctx.roundRect(0, -rectangle.height / 2, newWidth, rectangle.height, 3 * 16);
		ctx.fill();
		ctx.restore();
	});
};

export const getDirection = (hoveredCell, currentRectangle) => {
	const isVertical =
		hoveredCell.x === currentRectangle.row &&
		hoveredCell.y !== currentRectangle.col;
	const isHorizontal =
		hoveredCell.y === currentRectangle.col &&
		hoveredCell.x !== currentRectangle.row;
	const isDiagonal =
		Math.abs(hoveredCell.x - currentRectangle.row) ===
		Math.abs(hoveredCell.y - currentRectangle.col);
	let isRightDiagonal = isDiagonal && hoveredCell.x > currentRectangle.row;
	let isLeftDiagonal = isDiagonal && hoveredCell.x < currentRectangle.row;
	return [isVertical, isHorizontal, isRightDiagonal, isLeftDiagonal];
};
