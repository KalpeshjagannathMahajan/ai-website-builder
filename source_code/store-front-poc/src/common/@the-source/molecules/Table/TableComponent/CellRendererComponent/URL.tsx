import styles from '../Cell.module.css';

interface Props {
	value: any;
	valueFormatted?: any;
}

const URLCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;
	return (
		<div className={styles.agGridCustomCell}>
			<a href={value} target='_blank' rel='noopener noreferrer'>
				{valueFormatted}
			</a>
		</div>
	);
};
export default URLCellRenderer;
