import React from "react";
import { modifyQuestions } from "../../utils";
import styles from "./styles.module.css";

export default function Questions({ questions, solved }) {
	return (
		<div className={styles.questions}>
			<h2 className={styles.words}>Words</h2>
			{modifyQuestions(questions, solved).map((item, index) => (
				<div key={index} className={styles.text} style={{ color: item?.color }}>
					{item?.isSolved ? <strike>{item?.str}</strike> : item?.str}
				</div>
			))}
		</div>
	);
}
