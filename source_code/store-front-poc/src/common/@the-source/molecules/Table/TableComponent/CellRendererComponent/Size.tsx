import styles from '../Cell.module.css';

interface Props {
	value: any;
	colDef?: any;
	data?: any;
	valueFormatted?: any;
}

const SizeCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;
	return <div className={styles.agGridCustomCell}>{valueFormatted}</div>;
};

export default SizeCellRenderer;
