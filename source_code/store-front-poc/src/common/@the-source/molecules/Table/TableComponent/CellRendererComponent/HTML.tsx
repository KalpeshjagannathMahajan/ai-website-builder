import styles from '../Cell.module.css';

interface Props {
	value: any;
	valueFormatted?: any;
}

const HTMLCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;
	const style = {
		borderRadius: '16px',
		background: 'rgb(201, 228, 223)',
		cursor: 'pointer',
		fontSize: '10px',
		padding: '0px 10px',
		lineHeight: '2',
	};

	const handleValidate = (val: any) => {
		if (val) {
			return '';
		} else {
			return (
				<div className={styles.agGridCustomCell} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
					<div style={style}>HTML CONTENT</div>
				</div>
			);
		}
	};

	return <>{handleValidate(valueFormatted)}</>;
};

export default HTMLCellRenderer;
