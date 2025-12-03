import React from 'react';
import Switch from 'src/common/@the-source/atoms/Switch';
import styles from 'src/common/@the-source/molecules/Table/TableComponent/Cell.module.css';
interface Props {
	value: any;
	node?: any;
}

const ToggleComp: React.FC<Props> = ({ value, node, ...rest }: any) => {
	return (
		<div className={styles.agGridCustomCell}>
			<Switch checked={value} onClick={() => rest?.setValue(!value)} disabled />
		</div>
	);
};

export default ToggleComp;
