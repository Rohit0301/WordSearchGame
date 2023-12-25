import React, { Fragment } from "react";
import styles from "./styles.module.css";
import Timer from "./Timer";
export default function Header({ isGameEnd }) {
	return (
		<Fragment>
			<div className={styles.word_search}>Word Search Game</div>
			<Timer isGameEnd={isGameEnd} />
		</Fragment>
	);
}
