/* eslint-disable */
import CustomText from 'src/common/@the-source/CustomText';
import { PLACE_HOLDER_IMAGE } from 'src/screens/ProductDetailsPage/constants';
import { Box, Checkbox, Image, Button, Icon, Radio } from 'src/common/@the-source/atoms';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { handle_field_validations } from '../helper';
import { makeStyles, useTheme } from '@mui/styles';
import { useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import ImageLightbox from 'src/common/@the-source/atoms/LightBox/LightBox';
import { get_formatted_price_with_currency } from 'src/utils/common';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

interface ImageProps {
	values: any[];
	show_checkbox?: boolean;
	options: any;
	onChange: any;
	id: string;
	is_mandatory: boolean;
	max_selection_quantity: number;
	min_selection_quantity: number;
	handleError: any;
	search_string_style?: {};
	currency: string;
	is_retail_mode?: boolean;
}

const useStyles = makeStyles((theme: any) => ({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		width: '170px',
		[theme.breakpoints.down(600)]: {
			width: '150px',
		},
		textAlign: 'center',
		padding: '6px 8px',
		position: 'relative',
	},
	overlay: {
		position: 'absolute',
		inset: 0,
		backgroundColor: `${theme?.light_box?.modal?.overlay_config?.background}`,
		opacity: 0,
		transition: 'opacity 0.3s ease',
		pointerEvents: 'none',
	},
	image_style: {
		width: '100%',
		height: '100%',
		maxWidth: '12rem',
		maxHeight: '12rem',
		borderRadius: 8,
		border: `1px solid ${theme?.light_box?.modal?.modifiers?.image_border}`,
		marginBottom: 5,
		cursor: 'pointer',
		[theme.breakpoints.down('sm')]: {
			maxWidth: '11rem',
			maxHeight: '11rem',
		},
	},
	wrapper_container: {
		display: 'grid',
		gap: '20px',
		[theme.breakpoints.down(600)]: {
			gridTemplateColumns: 'repeat(2, 1fr)',
		},
		gridTemplateColumns: 'repeat(3, 1fr)',
		alignItems: 'center',
		justifyItems: 'center',
	},
	imageContainer: {
		position: 'relative',
		width: '12rem',
		height: '12rem',
		[theme.breakpoints.down('sm')]: {
			width: '11rem',
			height: '11rem',
		},
		marginBottom: 6,
	},
	icon: {
		position: 'absolute',
		top: '2px',
		right: '2px',
		opacity: 0,
		cursor: 'pointer',
		transition: 'opacity 0.3s ease',
	},
	text_component: {
		textOverflow: 'ellipsis',
		maxWidth: '100px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		width: '85px',
	},
	imageContainerHover: {
		'&:hover $overlay': {
			opacity: 1,
		},
		'&:hover $icon': {
			opacity: 1,
		},
	},
}));

const selected_style = {
	borderRadius: '8px',
	padding: '6px',
};

const handleContextMenu = (e: any) => {
	e.preventDefault();
};

const ImageComponent = ({
	values,
	show_checkbox = false,
	onChange,
	options,
	id,
	is_mandatory,
	max_selection_quantity,
	min_selection_quantity,
	handleError,
	search_string_style,
	is_retail_mode,
	currency,
}: ImageProps) => {
	const styles = useStyles();
	const [selectedOptions, setSelectedOptions] = useState<any[]>(options ? options.split(',').map((item: any) => item.trim()) : []);
	const [open, set_open] = useState<boolean>(false);
	const [is_lightbox_open, set_is_lightbox_open] = useState<boolean>(false);
	const [selected_image_index, set_selected_image_index] = useState<number>(0);
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const [long_press_triggered, set_long_press_triggered] = useState<boolean>(false);
	const [timeout_id, set_timeout_id] = useState<number | null>(null);
	const image_preview: any = is_ultron
		? useSelector((state: any) => state?.settings?.image_preview)
		: JSON.parse(localStorage.getItem('wizshop_settings') || '{}')?.image_preview;

	const handleCheckboxChange = (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();

		setSelectedOptions((prevSelected: string[]) => {
			let newSelected;
			if (prevSelected?.includes(name)) {
				newSelected = prevSelected?.filter((item: string) => item !== name);
			} else {
				newSelected = [...prevSelected, name];
				if (max_selection_quantity && newSelected?.length > max_selection_quantity) {
					return prevSelected;
				}
			}

			return newSelected;
		});
	};

	const handleSelect = (name: string, e: any) => {
		e.stopPropagation();
		if (!show_checkbox) {
			setSelectedOptions(selectedOptions?.includes(name) ? [] : [name]);
		} else {
			handleCheckboxChange(name, e);
		}
	};

	const handleClickImage = (index: number) => {
		if (image_preview) {
			set_selected_image_index(index);
			set_is_lightbox_open(true);
		}
	};

	const handleStartTouch = (index: number) => {
		set_long_press_triggered(false);
		const id = window.setTimeout(() => {
			if (!long_press_triggered && image_preview) {
				handleClickImage(index);
				set_long_press_triggered(true);
			}
		}, 500);
		set_timeout_id(id);
	};

	const handleEndTouch = () => {
		if (timeout_id) clearTimeout(timeout_id);
	};

	useEffect(() => {
		if (options) {
			setSelectedOptions(options?.split(',')?.map((item: any) => item?.trim()));
		}
	}, [options]);

	useEffect(() => {
		onChange({ [id]: selectedOptions });
		handleError({
			[id]: handle_field_validations(selectedOptions.length, is_mandatory, min_selection_quantity, max_selection_quantity),
		});
	}, [selectedOptions]);

	const images = (values || [])?.map((curr) => ({
		src: curr?.image || '',
		download: {
			url: curr?.image || '',
			filename: curr?.display_name || 'download',
		},
	}));

	const handle_click = (e: any, index: number) => {
		if (!is_small_screen) {
			e?.stopPropagation();
			handleClickImage(index);
		}
	};

	return (
		<div style={search_string_style} onContextMenu={handleContextMenu}>
			<div className={styles.wrapper_container}>
				{_.isArray(values) &&
					values?.slice(0, open ? values?.length : 12)?.map((curr: any, index: number) => {
						return (
							<Box
								className={styles.container}
								key={curr?.id}
								style={{
									...(selectedOptions?.includes(curr?.name)
										? { ...selected_style, ...theme?.product?.custom_product_drawer?.image?.selected_style }
										: {}),
								}}
								onClick={(e: any) => {
									if (is_small_screen) {
										e.stopPropagation();
										handleSelect(curr?.name, e);
									}
								}}
								onTouchStart={is_small_screen ? () => handleStartTouch(index) : undefined}
								onTouchEnd={is_small_screen ? () => handleEndTouch() : undefined}
								onMouseDown={is_small_screen ? undefined : () => handleStartTouch(index)}
								onMouseUp={is_small_screen ? undefined : () => handleEndTouch()}>
								<Box className={`${styles.imageContainer} ${image_preview ? styles.imageContainerHover : ''}`}>
									<Image
										fallbackSrc={PLACE_HOLDER_IMAGE}
										src={curr?.image}
										alt='image'
										imgClass={styles.image_style}
										style={{ cursor: image_preview ? 'pointer' : 'default' }}
										onClick={(e: any) => handle_click(e, index)}
									/>
									{image_preview && (
										<React.Fragment>
											<Box className={styles.overlay} />
											<Icon
												iconName='IconArrowsDiagonal'
												color={theme?.light_box?.modal?.modifiers?.icon_color}
												className={styles.icon}
												onClick={(e: any) => handle_click(e, index)}
											/>
										</React.Fragment>
									)}
								</Box>

								<CustomText className={styles.text_component} type='Caption'>
									{curr?.display_name}
								</CustomText>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
									{show_checkbox ? (
										<Checkbox checked={selectedOptions?.includes(curr?.name)} onClick={(e: any) => handleSelect(curr?.name, e)} />
									) : (
										<Radio checked={selectedOptions?.includes(curr?.name)} onClick={(e: any) => handleSelect(curr?.name, e)} />
									)}

									{!is_retail_mode && curr?.price !== null && curr?.price !== undefined && (
										<CustomText type='Caption' style={{ fontWeight: 700 }}>
											{get_formatted_price_with_currency(currency, curr?.price)}
										</CustomText>
									)}
								</Box>
							</Box>
						);
					})}
			</div>
			{values?.length > 10 && (
				<Button
					sx={{ height: '40px' }}
					variant='text'
					onClick={() => {
						set_open(!open);
					}}>
					{open ? ' See less ' : `+ ${values?.length - 10} more`}
					{open && (
						<Icon sx={{ ml: 0.5 }} iconName='IconChevronUp' color={theme?.product?.custom_product_drawer?.image?.icon_style?.color} />
					)}
				</Button>
			)}
			<ImageLightbox
				open={is_lightbox_open}
				onClose={() => set_is_lightbox_open(false)}
				images={images}
				selectedIndex={selected_image_index}
				overrideWidth={is_small_screen ? 250 : 900}
				overrideHeight={700}
			/>
		</div>
	);
};

export default ImageComponent;
