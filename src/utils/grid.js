import { WORDS } from "./words";

function generateWordSearch(options) {
	let words = options.words
		.slice()
		.filter(
			(w) =>
				w.length >= options.minLength &&
				(options.maxLength == null || w.length <= options.maxLength)
		)
		.filter((w) => /^[a-z]*/.test(w));

	let width = options.width;
	let height = options.height;

	let grid = [];
	let used = [];
	let usedMap = {};
	for (let i = 0; i < width * height; i++) {
		grid[i] = " ";
	}

	let dxs, dys;

	dxs = [0, 1, 1, 1, 0, -1, -1, -1];
	dys = [-1, -1, 0, 1, 1, 1, 0, -1];

	function rand(max) {
		return Math.floor(Math.random() * max);
	}

	function get(x, y) {
		return grid[y * width + x];
	}

	function set(x, y, letter) {
		grid[y * width + x] = letter;
	}

	function tryWord(x, y, dx, dy, word) {
		let ok = false;
		for (let i = 0; i < word.length; i++) {
			const l = word[i].toUpperCase();
			if (x < 0 || y < 0 || x >= width || y >= height) return false;
			const cur = get(x, y);
			if (cur != " " && cur != l) return false;
			if (cur == " ") ok = true;
			x += dx;
			y += dy;
		}
		return ok;
	}

	function putWord(x, y, dx, dy, word) {
		for (let i = 0; i < word.length; i++) {
			const l = word[i].toUpperCase();
			set(x, y, l);
			x += dx;
			y += dy;
		}
		used.push(word);
		usedMap[word] = true;
	}

	for (let i = 0; i < width * height * 10000; i++) {
		if (used.length === words.length) break;
		const word = words[rand(words.length)];
		if (usedMap[word]) continue;
		const x = rand(width);
		const y = rand(height);
		const d = rand(dxs.length);
		const dx = dxs[d];
		const dy = dys[d];
		if (tryWord(x, y, dx, dy, word)) putWord(x, y, dx, dy, word);
	}

	for (let i = 0; i < grid.length; i++) {
		if (grid[i] == " ") grid[i] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[rand(26)];
	}

	used.sort();

	return {
		flatGrid: grid,
		questions: used,
	};
}

// Usage example:
const options = {
	width: 10,
	height: 10,
	minLength: 3,
	maxLength: 10,
	words: getRandomWords(WORDS, 9),
};
const { flatGrid, questions } = generateWordSearch(options);

function getRandomWords(wordsArray, count) {
	const shuffledArray = wordsArray.sort(() => Math.random() - 0.5);
	const selectedWords = shuffledArray.slice(0, count);
	return selectedWords.map((word) => word.toUpperCase());
}

const grid = [];
for (let i = 0; i < 10; i++) {
	const row = [];
	for (let j = 0; j < 10; j++) {
		row.push(flatGrid[i * 10 + j]);
	}
	grid.push(row);
}

export { grid, questions };
