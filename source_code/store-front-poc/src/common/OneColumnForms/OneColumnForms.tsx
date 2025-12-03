import { Box, Button, Grid, PageHeader, Typography } from '../@the-source/atoms';
import { FormProvider, useForm } from 'react-hook-form';
import { Section } from '../Interfaces/SectionsInterface';
import { get_default_values, get_form_data, get_sections, is_submit_disabled } from './helper';
import SectionFields from './FieldComponents/SectionFields';
import { useEffect, useState } from 'react';
import PermissionsComponent from './FieldComponents/PermissionsComponent';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material';
import { PageTitle } from '../PageHeaderComponents';
import OneFormSkeleton from './OneFormSkeleton';
interface FormProps {
	sections: Section[]; //should be sorted/ordered
	allow_back: boolean;
	back_text: string;
	submit_cta_text: string;
	is_permission_form: boolean;
	disable_cta_if_not_dirty?: boolean;
	additional_header_left?: any;
	btn_loading_master?: boolean;
	methods?: any;
	fetchFromForm?: boolean;
	submit_callback?: (params: any, setError?: any) => any;
	handle_back_callback?: () => void;
	set_is_form_dirty?: (flag: boolean) => any;
}

const useStyles = makeStyles(() => ({
	form_container: {
		scrollbarWidth: 'thin',
		alignItems: 'center',
		display: 'flex',
		width: '100%',
		flexDirection: 'column',
		'&::-webkit-scrollbar': {
			width: '6px',
			marginRight: '10px',
		},
	},
	form_sub_container: {
		width: '50%',
		margin: '0 auto',
		height: '100%',
	},
	inner: {
		borderRadius: '20px',
		padding: '20px 40px',
		height: 'fit-content',
		margin: '20px 0',
	},
}));

const OneColumnForm = ({
	sections = [],
	allow_back = false,
	back_text = '',
	submit_cta_text = '',
	submit_callback,
	is_permission_form,
	disable_cta_if_not_dirty = false,
	additional_header_left,
	set_is_form_dirty,
	btn_loading_master = false,
	handle_back_callback,
}: FormProps) => {
	const { access_permission } = get_sections(sections);
	const [access_map, set_access_map] = useState(access_permission?.permissions || {});
	const [btn_loading, set_btn_loading] = useState<boolean>(false);
	const theme: any = useTheme();
	const styles = useStyles();
	const methods = useForm({
		defaultValues: get_default_values(sections),
	});

	const {
		handleSubmit,
		getValues,
		setValue,
		register,
		formState: { isDirty },
		setError,
		clearErrors,
	} = methods;

	let disabled = false;
	if (is_permission_form) disabled = is_submit_disabled(access_map, isDirty, disable_cta_if_not_dirty);

	const is_manager_role = access_permission?.is_manager_role || false;

	const onSubmit = (data: any) => {
		set_btn_loading(true);
		const form_data = get_form_data(data, access_map, is_permission_form, is_manager_role);
		if (submit_callback) {
			submit_callback(form_data, setError);
		}
	};

	useEffect(() => {
		if (set_is_form_dirty && isDirty) {
			set_is_form_dirty(true);
		}
	}, [isDirty]);

	useEffect(() => {
		set_btn_loading(btn_loading_master);
	}, [btn_loading_master]);

	return (
		<Grid container style={{ width: '100%' }}>
			<FormProvider {...methods}>
				<PageHeader
					leftSection={
						<Grid display='flex' width='100%'>
							<PageTitle title={back_text} allow_back={allow_back} additional_header_left={additional_header_left} />
						</Grid>
					}
					rightSection={
						<Grid container spacing={2} justifyContent='flex-end'>
							{handle_back_callback && (
								<Grid item>
									<Button onClick={handle_back_callback} variant='outlined'>
										Cancel
									</Button>
								</Grid>
							)}
							<Grid item>
								<Button loading={btn_loading} disabled={disabled} type='submit' onClick={handleSubmit(onSubmit)}>
									{submit_cta_text}
								</Button>
							</Grid>
						</Grid>
					}
				/>
				<Grid justifyContent='center' className={styles.form_container} style={{ ...theme?.one_column_forms?.form_container }}>
					<Grid className={styles.form_sub_container}>
						{sections.length > 0 ? (
							<>
								{sections
									.filter((section) => section.key !== 'access_permission')
									.map((section) => (
										<Grid className={styles.inner} style={{ ...theme?.one_column_forms?.inner }}>
											<Box key={section.key}>
												<Typography variant='h6' sx={{ padding: '10px 0' }}>
													{section.name}
												</Typography>
												{section?.attributes?.length > 0 && (
													<SectionFields
														clearErrors={clearErrors}
														attributes={section.attributes.filter((attr) => attr.key !== 'country_code')}
														getValues={getValues}
														setValue={setValue}
														register={register}
													/>
												)}
											</Box>
										</Grid>
									))}
								{sections.filter((section) => section.key === 'access_permission')?.length > 0 && (
									<Grid className={styles.inner}>
										{sections
											.filter((section) => section.key === 'access_permission')
											.map((section) => (
												<Box key={section.key}>
													<Typography variant='h6' sx={{ padding: '10px 0' }}>
														{section.name}
													</Typography>
													<p>{section.subtext}</p>
													{section?.modules && section?.modules?.length > 0 && (
														<PermissionsComponent modules={section.modules} access_map={access_map} set_access_map={set_access_map} />
													)}
												</Box>
											))}
									</Grid>
								)}
							</>
						) : (
							<OneFormSkeleton />
						)}
					</Grid>
				</Grid>
			</FormProvider>
		</Grid>
	);
};

export default OneColumnForm;
