import styles from '../Cell.module.css';

interface Props {
	value: any;
	valueFormatted?: any;
}

const UOMCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;
	return <div className={styles.agGridCustomCell}>{valueFormatted}</div>;
};
export default UOMCellRenderer;
