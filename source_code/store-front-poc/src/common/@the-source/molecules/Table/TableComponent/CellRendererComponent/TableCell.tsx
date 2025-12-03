/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import styles from '../Cell.module.css';

interface Props {
	value: any;
	valueFormatted?: any;
}

const TableCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;

	return (
		<div className={styles.agGridCustomCell}>
			<table className={styles.customTable}>
				<thead>
					<tr>
						{valueFormatted?.columns.map((column: any, index: number) => (
							<th key={index}>{column}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{valueFormatted?.rows.map((row: any, index: number) => (
						<tr key={index}>
							{row.map((cell: any, index: number) => (
								<td key={index}>{cell}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TableCellRenderer;
