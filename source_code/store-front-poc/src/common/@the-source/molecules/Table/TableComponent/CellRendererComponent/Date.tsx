import styles from '../Cell.module.css';

interface Props {
	value: any;
	valueFormatted?: any;
}

const DateCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;
	return <div className={styles.agGridCustomCell}>{valueFormatted ? valueFormatted : '--'}</div>;
};

export default DateCellRenderer;
