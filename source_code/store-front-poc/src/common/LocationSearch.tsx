import { Box } from './@the-source/atoms';
import { List, ListItem, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import usePlacesAutocomplete, { getDetails } from 'use-places-autocomplete';
import TextEditField from './@the-source/atoms/FieldsNew/TextEditField';
import _ from 'lodash';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';
interface Props {
	name: string;
	handle_selected_place?: Function;
	placeholder?: string;
	label: string;
	validations: any;
	getValues: any;
	show_copy_drawer?: boolean;
	edit_buyer_id: any;
	country?: any;
	from?: string;
	field_data?: any;
	disabled?: boolean;
	allow_check_box?: boolean;
}

function normalize(text: string) {
	return text.replace(/[\s,.-]/g, '').toLowerCase();
}

function isSimilar(a: string, b: string) {
	const normA = normalize(a);
	const normB = normalize(b);
	return normA.includes(normB) || normB.includes(normA);
}

function formatAddress(name: string, addressParts: any) {
	const addressComponents = [
		addressParts.subpremise,
		addressParts.premise,
		addressParts.street_number,
		addressParts.route.long_name, // Only using long_name for the address string
		addressParts.sublocality_level_1,
		addressParts.sublocality_level_2,
		addressParts.sublocality_level_3,
		addressParts.sublocality_level_4,
		addressParts.sublocality_level_5,
		addressParts.administrative_area_level_3,
	].filter(Boolean);

	const uniqueComponents = [];

	// Check similarity of name with street_number and both long_name and short_name of route
	const isNameSimilarToStreetNumber = isSimilar(name, addressParts.street_number);
	const isNameSimilarToRouteLong = isSimilar(name, addressParts.route.long_name);
	const isNameSimilarToRouteShort = isSimilar(name, addressParts.route.short_name);

	if (isNameSimilarToStreetNumber && (isNameSimilarToRouteLong || isNameSimilarToRouteShort)) {
		// Condition 1: Name is similar to both street_number and either long_name or short_name of route
		uniqueComponents.push(name); // Replace both with name
	} else if (isNameSimilarToStreetNumber && !isNameSimilarToRouteLong && !isNameSimilarToRouteShort) {
		// Condition 2: Name is similar to street_number but not to route
		uniqueComponents.push(name); // Replace street_number with name
		uniqueComponents.push(addressParts.route.long_name); // Add long_name of route
	} else if (!isNameSimilarToStreetNumber && (isNameSimilarToRouteLong || isNameSimilarToRouteShort)) {
		// Condition 2: Name is similar to route but not to street_number
		uniqueComponents.push(addressParts.street_number); // Add street_number
		uniqueComponents.push(name); // Replace route with name
	} else {
		// Condition 3: Name is not similar to both
		uniqueComponents.push(name); // Add name at the top
		uniqueComponents.push(addressParts.street_number); // Add street_number
		uniqueComponents.push(addressParts.route.long_name); // Add long_name of route
	}

	// Add the remaining components that are not street_number or route long_name
	addressComponents.forEach((component) => {
		if (component !== addressParts.street_number && component !== addressParts.route.long_name) {
			if (!uniqueComponents.some((existing) => isSimilar(existing, component))) {
				uniqueComponents.push(component);
			}
		}
	});

	return uniqueComponents.join(', ');
}

const LocationSearch = ({
	name,
	placeholder,
	label,
	getValues,
	handle_selected_place,
	validations,
	show_copy_drawer,
	edit_buyer_id,
	country,
	from,
	field_data,
	disabled,
	allow_check_box,
}: Props) => {
	const {
		ready,
		suggestions: { status, data },
		setValue,
		value,
		clearSuggestions,
	} = usePlacesAutocomplete({
		callbackName: 'google_places_autocomplete',
		debounce: 300,
	});

	const [is_edit_mode, set_is_edit_mode] = useState(edit_buyer_id ? true : false);
	const [should_show_list, set_should_show_list] = useState(true);
	const containerRef = useRef<any>(null);
	const selected_country = getValues()?.country || '';
	const theme: any = useTheme();

	const handle_document_click = (e: any) => {
		if (containerRef.current && !containerRef.current.contains(e.target)) {
			clearSuggestions();
		}
	};

	useEffect(() => {
		if (from === 'payment') {
			set_should_show_list(false); // Prevent showing the list when the component is mounted, as it will be shown when the user starts typing
		}
	}, [from]);

	useEffect(() => {
		// Attach a click event listener to the document
		document.addEventListener('click', handle_document_click);

		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener('click', handle_document_click);
		};
	}, []);

	useEffect(() => {
		setValue(_.get(getValues(), name, ''));
	}, []);
	useEffect(() => {
		if (!show_copy_drawer) {
			setValue(_.get(getValues(), name, ''));
		}
	}, [show_copy_drawer]);

	useEffect(() => {
		if (allow_check_box) {
			const street_address_value = _.get(getValues(), name);
			setValue(street_address_value || '');
		}
	}, [allow_check_box]);

	const country_options = _.find(field_data, { id: 'country' })?.options;
	const state_type = _.find(field_data, { id: 'state' })?.type;
	const selected_country_data = _.find(country_options, (item) => item?.value === selected_country);

	useEffect(() => {
		if (country) {
			if (!getValues()?.address_1) setValue('');
		}
	}, [country]);

	const filter_suggestions_by_country = (suggestions: any[], country_value: string, country_label: string) => {
		if (country_value) {
			const filtered_by_value = _.filter(suggestions, (suggestion) =>
				_.some(suggestion.terms, (term) => _.toLower(term.value) === _.toLower(country_value)),
			);

			if (!_.isEmpty(filtered_by_value)) {
				return filtered_by_value;
			}

			return _.filter(suggestions, (suggestion) => _.some(suggestion.terms, (term) => _.toLower(term.value) === _.toLower(country_label)));
		} else {
			return suggestions;
		}
	};

	const handle_input = (e: any) => {
		setValue(e.target.value);
		set_is_edit_mode(false);
		set_should_show_list(true);
	};

	const handle_select = async (suggestion: any) => {
		set_is_edit_mode(false);
		clearSuggestions();

		try {
			const results = await getDetails({ placeId: suggestion?.place_id || '', fields: ['address_components', 'name'] });
			const address_components = results.address_components || [];
			const address_name = results.name || '';
			let city = '';
			let zip_code = '';
			let _country = { key: '', value: '' };
			let state = { key: '', value: '' };
			let address_2 = '';

			let addressParts: any = {
				subpremise: '',
				premise: '',
				street_number: '',
				route: { long_name: '', short_name: '' },
				sublocality_level_1: '',
				sublocality_level_2: '',
				sublocality_level_3: '',
				sublocality_level_4: '',
				sublocality_level_5: '',
				administrative_area_level_3: '',
			};

			address_components.forEach((component: any) => {
				const componentType = component.types.find((type: any) => addressParts.hasOwnProperty(type) || type);

				if (componentType === 'route') {
					addressParts.route = { long_name: component.long_name, short_name: component.short_name };
					return;
				}

				if (componentType && addressParts.hasOwnProperty(componentType) && !addressParts[componentType]) {
					addressParts[componentType] = component.long_name;
				}

				// if (component.types.includes('administrative_area_level_2')) {
				// 	address_2 = component.long_name;
				// }

				if (component.types.includes('locality')) {
					city = component.long_name;
				}
				if (component.types.includes('country')) {
					_country = { key: component.short_name, value: component.long_name };
				}
				if (component.types.includes('administrative_area_level_1')) {
					if (state_type === 'text') {
						state = component.long_name;
					} else {
						state = { key: component.short_name, value: component.long_name };
					}
				}
				if (component.types.includes('postal_code')) {
					zip_code = component.long_name;
				}
			});

			const address_1 = formatAddress(address_name, addressParts);

			const street_address = address_1 || suggestion.description;

			setValue(street_address, false);
			handle_selected_place?.({
				zip_code,
				city,
				state,
				country: _country,
				street_address,
				address_1,
				address_2,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handle_render_empty_state = () => {
		return (
			<Typography variant='subtitle2' sx={{ textAlign: 'center' }}>
				{t('Common.Main.NoResult')}
			</Typography>
		);
	};

	const handle_render_list = (list: any) => {
		if (list?.length > 0 && filter_suggestions_by_country(data, selected_country, selected_country_data?.label).length > 0) {
			return filter_suggestions_by_country(data, selected_country, selected_country_data?.label).map((suggestion: any) => (
				<ListItem
					sx={{ ...theme?.order_management?.location_search }}
					style={{ fontSize: 16 }}
					key={suggestion.place_id}
					onClick={() => handle_select(suggestion)}>
					{suggestion.description}
				</ListItem>
			));
		}
		return handle_render_empty_state();
	};
	return (
		<React.Fragment>
			<Box mb={2.5}>
				<TextEditField
					name={name}
					label={label}
					placeholder={placeholder}
					disabled={disabled || !ready}
					value={value}
					onChangeCapture={handle_input}
					sx={{ width: '100%' }}
					validations={validations}
				/>
				{status && !is_edit_mode && should_show_list && (
					<List ref={containerRef} sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', mt: 0.5, cursor: 'pointer' }}>
						{handle_render_list(data)}
					</List>
				)}
			</Box>
		</React.Fragment>
	);
};

export default LocationSearch;
