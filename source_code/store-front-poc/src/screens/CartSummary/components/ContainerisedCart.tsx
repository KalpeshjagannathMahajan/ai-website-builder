import { Divider, MenuItem, Radio, Select } from '@mui/material';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon, LinearProgressBar, Skeleton, Switch, ToggleButtons } from 'src/common/@the-source/atoms';
import useStyles from 'src/screens/CartSummary/styles';
import { alpha } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { primary, secondary } from 'src/utils/light.theme';
import { error, success, warning } from 'src/utils/common.theme';
// import { useEffect } from 'react';

interface ContainerisedCartProps {
	switch_toggle: boolean;
	container_data?: any;
	selected_container: IContainer;
	allow_edit?: boolean;
	container_loading?: boolean;
	set_custom_container_modal?: (val: boolean) => void;
	toggle_button_value: string;
	handle_change?: any;
}

interface IContainer {
	container_key: string;
	container_name: string;
	container_volume_data: any;
	is_default_container?: boolean;
	container_volume_filled_data: any;
}

function ContainerisedCart({
	switch_toggle,
	container_data,
	selected_container = {
		container_key: '',
		container_name: '',
		container_volume_data: {
			CBM: 0,
			CFT: 0,
		},
		container_volume_filled_data: {
			CBM: 0,
			CFT: 0,
		},
	},
	allow_edit = true,
	container_loading = false,
	set_custom_container_modal,
	toggle_button_value,
	handle_change,
}: ContainerisedCartProps) {
	const classes = useStyles();
	const vol_data = selected_container?.container_volume_data?.[toggle_button_value];
	const volume_filled = selected_container?.container_volume_filled_data?.[toggle_button_value];
	const vol_filled = typeof volume_filled === 'number' ? volume_filled : parseFloat(volume_filled || 0);
	const percentage = (vol_filled / vol_data) * 100 || 0;
	const color = percentage < 80 ? warning.main : percentage >= 80 && percentage <= 100 ? success?.main : error.main;
	const volume_left = vol_data - vol_filled || 0;
	const absolute_volume_left = Math.abs(volume_left);
	const [open, set_open] = useState<boolean>(false);
	const [loading, set_loading] = useState<boolean>(false);
	const [refetch, set_refetch] = useState<boolean>(true);

	const menu_item_click = (container: IContainer) => {
		set_open(false);
		if (selected_container?.container_key === container?.container_key) {
			return;
		}
		handle_change('container', container);
		set_refetch((prev: boolean) => !prev);
	};

	const show_current_capacity = (container: any) => {
		return (
			container?.container_key === selected_container?.container_key && vol_data !== container?.container_volume_data?.[toggle_button_value]
		);
	};

	useEffect(() => {
		set_loading(true);
		setTimeout(() => {
			set_loading(false);
		}, 1000);
	}, [refetch]);

	return (
		<Grid className={classes.container_cart}>
			{container_loading ? (
				<Grid display='flex' direction='column' gap={1}>
					<Grid display='flex' justifyContent='space-between'>
						<Skeleton height={'10px'} variant='rounded' width={'100px'} />
						<Skeleton height={'10px'} variant='rounded' width={'20px'} />
					</Grid>
					<Skeleton height={'50px'} variant='rounded' />
					<Skeleton height={'2px'} variant='rounded' />
					<Skeleton height={'20px'} variant='rounded' />
					<Skeleton height={'10px'} variant='rounded' />
					<Skeleton height={'20px'} variant='rounded' width={'100px'} sx={{ alignSelf: 'flex-end' }} />
				</Grid>
			) : (
				<>
					<Grid className={classes.total_cbm_info}>
						<CustomText type='Subtitle'>Container </CustomText>
						<Switch
							disabled={!allow_edit}
							checked={switch_toggle}
							onChange={() => handle_change('display', !switch_toggle)}
							size='medium'
						/>
					</Grid>

					{switch_toggle && (
						<>
							<Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
								<CustomText type='Body2'>Measure volume in</CustomText>
								<ToggleButtons
									icons={[
										{
											id: 1,
											value: 'CBM',
											text: 'CBM',
										},
										{
											id: 2,
											value: 'CFT',
											text: 'CFT',
										},
									]}
									textStyle={{ fontSize: '14px', fontWeight: 700, color: 'inherit' }}
									sx={{
										padding: '0.5rem 2.2rem',
										'&.Mui-selected': {
											backgroundColor: '#E8F3EF',
											color: `${primary?.main} !important`,
										},
									}}
									value={toggle_button_value}
									disabled={!allow_edit}
									handleChange={(selectedValue: string) => {
										handle_change('unit', selectedValue);
									}}
								/>
							</Grid>
							<Divider className={classes.divider_style} />
							{allow_edit ? (
								<Select
									open={open}
									onOpen={() => set_open(true)}
									onClose={() => set_open(false)}
									value={selected_container}
									sx={{
										background: secondary[100],
										height: 'fit-content',
										padding: '0',
										border: 'none',
										width: '100%',
										'&:hover': {
											border: 'none', // Remove border on hover
											'& .MuiOutlinedInput-notchedOutline': {
												border: 'none',
											},
										},
										'&.Mui-focused': {
											border: 'none', // Remove border when focused
											'& .MuiOutlinedInput-notchedOutline': {
												border: 'none',
											},
										},

										'& .MuiSelect-select': {
											p: 0,
											'&:focus': {
												backgroundColor: 'transparent', // Remove background color when focused
											},
										},
									}}
									MenuProps={{
										sx: {
											'& .MuiMenuItem-root': {
												backgroundColor: 'transparent', // Apply transparent background to selected MenuItem
												'&:hover': {
													backgroundColor: 'transparent', // Optionally, you can set a hover state as well
												},
											},
										},
									}}
									renderValue={() => {
										return (
											<Grid className={classes.container_info}>
												<Icon iconName='IconTruckDelivery' className={classes.icon_delivery} />
												<Grid>
													<CustomText className={classes.text_primary} type='Subtitle'>
														{selected_container?.container_name}
													</CustomText>
													<CustomText className={classes.text_secondary} type='Caption'>
														Capacity: {vol_data} {toggle_button_value?.toUpperCase()}
													</CustomText>
												</Grid>
											</Grid>
										);
									}}>
									<CustomText style={{ padding: '0rem 1rem 1rem' }}>Showing {container_data?.length} options</CustomText>
									<Grid sx={{ maxHeight: '250px', flexDirection: 'column', overflowY: 'scroll' }}>
										{container_data?.map((container: any) => (
											<MenuItem
												key={container?.container_key}
												value={container?.container_key}
												sx={{ padding: '1.5rem 0.5rem', background: 'none' }}
												onClick={() => menu_item_click(container)}>
												<Radio checked={container?.container_key === selected_container?.container_key} />
												<Grid>
													<CustomText className={classes.text_primary} type='Subtitle'>
														{container?.container_name}
													</CustomText>
													<CustomText className={classes.text_secondary} type='Caption'>
														Default capacity : {container?.container_volume_data?.[toggle_button_value]}{' '}
														{toggle_button_value?.toUpperCase()}
														{show_current_capacity(container) && ` • Current capacity: ${vol_data} ${toggle_button_value?.toUpperCase()}`}
													</CustomText>
												</Grid>
											</MenuItem>
										))}
									</Grid>
								</Select>
							) : (
								<Grid className={classes.container_info}>
									<Icon iconName='IconTruckDelivery' className={classes.icon_delivery} />
									<Grid>
										<CustomText className={classes.text_primary} type='Subtitle'>
											{selected_container?.container_name}
										</CustomText>
										<CustomText className={classes.text_secondary} type='Caption'>
											Capacity: {vol_data} {toggle_button_value?.toUpperCase()}
										</CustomText>
									</Grid>
								</Grid>
							)}

							{set_custom_container_modal && (
								<Grid mb={-1}>
									<CustomText
										type='Subtitle'
										color={primary.main}
										style={{ cursor: 'pointer' }}
										onClick={() => set_custom_container_modal(true)}>
										Edit capacity
									</CustomText>
								</Grid>
							)}

							<Divider className={classes.divider_style} />
							{loading ? (
								<Grid display='flex' direction='column' gap={1}>
									<Skeleton height={'20px'} variant='rounded' />
									<Skeleton height={'10px'} variant='rounded' />
									<Skeleton height={'20px'} variant='rounded' width={'100px'} sx={{ alignSelf: 'flex-end' }} />
								</Grid>
							) : (
								<>
									<Grid className={classes.total_cbm_info}>
										<CustomText type='Body'>
											Total {toggle_button_value?.toUpperCase()} : {(vol_filled || 0)?.toFixed(2)}
										</CustomText>
										<CustomText className={classes.text_primary} type='Body'>
											({`${_.isNumber(percentage) ? percentage.toFixed(1) : '0.0'}% filled`})
										</CustomText>
									</Grid>
									<LinearProgressBar
										variant={'determinate'}
										value={percentage > 100 ? 100 : percentage}
										sx={{
											height: '8px',
											background: 'white',
											border: '1px solid #B5BBC3',
											'& .css-lqhyza-MuiLinearProgress-bar1': {
												backgroundColor: color,
												backgroundImage: 'none',
											},
										}}
										progressStyles={{
											backgroundColor: `${color} !important`,
											backgroundImage: 'none',
										}}
									/>
									<Grid container sx={{ justifyContent: 'flex-end' }}>
										<CustomText
											type='CaptionBold'
											style={{
												padding: '0.5rem 1rem',
												color,
												width: 'fit-content',
												borderRadius: '8px',
												background: alpha(color, 0.1),
											}}>
											{absolute_volume_left?.toFixed(2)} {toggle_button_value?.toUpperCase()} {volume_left >= 0 ? 'left' : 'extra'}
										</CustomText>
									</Grid>
								</>
							)}
						</>
					)}
				</>
			)}
		</Grid>
	);
}

export default ContainerisedCart;
