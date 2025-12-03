/* eslint-disable */
import { useContext, useEffect } from 'react';
import { Grid, Button, Drawer, Icon, Typography } from '../../atoms';
import styles from './ManageColumn.module.css';
import { MyDataContext } from './context';
import OrderListRight from './OrderListRIght';
import ToggleColumnLeft from './ToggleColumnLeft';
import { AgGridTableContext } from 'src/common/@the-source/molecules/Table/context';
import { t } from 'i18next';

// TODO: will refactor after phase 2.0

interface RenderDrawerDataProps {
	on_close: () => void;
	heading?: string;
	reorderText?: string;
	handleSave: (newColumnData: any) => void;
	pinned_columns?: string[];
}

const RenderDrawerData: React.FC<RenderDrawerDataProps> = ({
	on_close = () => {},
	heading = t('Common.ManageColumns.ToggleColumns'),
	reorderText = t('Common.ManageColumns.DragToSet'),
	handleSave = () => {},
	pinned_columns = [],
}) => {
	return (
		<Grid className={styles.container}>
			<Grid className={styles.body} xs={12}>
				<Grid className={styles.head}>
					<Typography variant='h5'>{t('Common.ManageColumns.ManageColumns')}</Typography>
					<Icon sx={{ cursor: 'pointer', marginRight: '1rem' }} onClick={on_close} iconName='IconX' />
				</Grid>
				<Grid mt='0.5rem' sx={{ marginLeft: '.5rem' }}>
					<Typography variant='body2' sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
						{heading}
					</Typography>
				</Grid>
				<Grid container className={styles.content} p={'1rem 0 1rem 0'}>
					<ToggleColumnLeft pinned_columns={pinned_columns} />
					<Grid className={styles.right} item xs={6} sx={{ height: '82vh' }}>
						<Grid sx={{ display: 'flex', justifyContent: 'center' }}>
							<Typography
								variant='body2'
								sx={{
									color: 'rgba(0, 0, 0, 0.6)',
									fontWeight: '400',
									margin: '0.8rem',
								}}>
								{reorderText}
							</Typography>
						</Grid>
						<Grid sx={{ padding: '1rem' }}>
							<OrderListRight />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item className={styles.footer} xs={12}>
				<Button width='158px' sx={{ marginLeft: '8px' }} onClick={on_close} variant='outlined'>
					{t('Common.ManageColumns.Close')}
				</Button>
				<Button width='158px' sx={{ marginLeft: '8px' }} onClick={handleSave}>
					{t('Common.ManageColumns.Confirm')}
				</Button>
			</Grid>
		</Grid>
	);
};

interface ManageColumnProps {
	on_close: () => void;
	pinned_columns: string[];
	onConfirm?: any;
}

const ManageColumn: React.FC<ManageColumnProps> = ({ on_close = () => {}, pinned_columns, onConfirm }) => {
	const context_value = useContext(MyDataContext);

	// const data = context_value?.data;
	const set_data = context_value?.set_data;
	const reordered = context_value?.reordered;
	const new_array = context_value?.new_array;
	const open_manage_column = context_value?.open_manage_column || false;

	const { all_columns, columns, setColumns } = useContext(AgGridTableContext);

	const import_column_values = () => {
		const visible_columns = columns?.map((data: any) => data?.key);

		const columnsWithVisibility = all_columns?.map((column: any) => {
			if (visible_columns.includes(column?.key)) {
				return { ...column, visible: true };
			} else {
				return { ...column, visible: false };
			}
		});

		return columnsWithVisibility?.map((column) => ({
			...column,
			headerName: column?.headerName || column?.name,
			visibility: column.visibility ? column.visibility : column.visible,
			hide: column.visibility ? !column.visibility : !column.visible,
			pinned: column.pinned,
			is_pinned: column.pinned === 'left' || column.pinned === 'right' || column.default ? true : false,
			colId: column.colId || column?.key,
			flex: 1,
			visible: column?.visible,
		}));
	};

	useEffect(() => {
		if (set_data) {
			set_data({ attributes: import_column_values() });
		}
	}, [columns]);

	const on_save = (newColumnData: any) => {
		onConfirm(newColumnData);
		localStorage.setItem('persist_columns', JSON.stringify(newColumnData));
	};

	const handleSave = () => {
		on_close();
		on_save(new_array);
	};

	return (
		<>
			<Drawer
				width={592}
				anchor='right'
				open={open_manage_column}
				onClose={on_close}
				content={<RenderDrawerData on_close={on_close} handleSave={handleSave} pinned_columns={pinned_columns} />}
			/>
		</>
	);
};

export default ManageColumn;
