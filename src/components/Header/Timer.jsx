import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

const Timer = ({ isGameEnd }) => {
	const [totalSeconds, setTotalSeconds] = useState(0);
	const [isActive, setIsActive] = useState(true);

	useEffect(() => {
		if (isGameEnd) {
			stopTimer();
		}
	}, [isGameEnd]);

	useEffect(() => {
		let interval;

		const incrementTimer = () => {
			setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
		};

		if (isActive) {
			interval = setInterval(incrementTimer, 1000);
		}
		return () => clearInterval(interval);
	}, [isActive]);

	const stopTimer = () => {
		setIsActive(false);
	};

	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return (
		<div className={styles.timer}>
			<span className={styles.minutes}>{minutes} minutes</span>{" "}
			<span className={styles.seconds}>{seconds} seconds</span>
		</div>
	);
};

export default Timer;
