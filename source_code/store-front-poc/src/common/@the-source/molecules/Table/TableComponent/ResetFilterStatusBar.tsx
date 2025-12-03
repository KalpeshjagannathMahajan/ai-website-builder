import { t } from 'i18next';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Grid, Icon, Typography } from 'src/common/@the-source/atoms';

interface ResetProps {
	api: any;
	key: string;
}

interface ResetRef {
	setVisible: (visible: boolean) => void;
	isVisible: () => boolean;
}

const Reset = forwardRef<ResetRef, ResetProps>((props, ref) => {
	const [isvisible, setIsVisible] = useState(false);
	const [searchParams] = useSearchParams();
	const onClick = () => {
		props?.api?.setFilterModel(null);
		searchParams.delete('filter');
		window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
		// alert('Selected Row Count: ' + props.api.getSelectedRows().length);
	};

	useImperativeHandle(ref, () => {
		return {
			setVisible: (visible) => {
				setIsVisible(visible);
			},
			isVisible: () => {
				return isvisible;
			},
		};
	});

	const bnt_style = {
		backgroundColor: '#FEF7EA',
		border: '1px solid #CE921E',
		margin: '0 1rem',
		borderRadius: '4px',
		height: '3rem',
	};

	if (isvisible) {
		return (
			<Grid container alignItems='center' height={'100%'}>
				<Button
					sx={bnt_style}
					startIcon={<Icon size='small' color='#CE921E' iconName='IconFilter' />}
					variant={'outlined'}
					key={props.key}
					size={'small'}
					endIcon={<Icon size='small' color='#CE921E' iconName='IconX' />}
					onClick={onClick}>
					<Typography variant='h6' color='#AC7710' sx={{ fontSize: 14 }}>
						{t('Common.Table.ClearFilters')}
					</Typography>
				</Button>
			</Grid>
		);
	}

	return null;
});

Reset.displayName = 'MyComponent';
export default Reset;
