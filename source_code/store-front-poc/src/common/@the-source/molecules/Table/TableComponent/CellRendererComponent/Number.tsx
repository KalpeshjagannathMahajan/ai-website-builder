import styles from '../Cell.module.css';

interface Props {
	value: any;
	valueFormatted?: any;
}

const NumberCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;
	return <div className={styles.agGridCustomCell}> {valueFormatted === 0 || valueFormatted ? valueFormatted : '0'}</div>;
};

export default NumberCellRenderer;
