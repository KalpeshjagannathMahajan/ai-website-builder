import { CatalogFormValues, CatalogPreviewValues } from 'src/@types/presentation';
import utils from '../utils';

const presentation = {
	get_presentation_templates: () => {
		return utils.request({
			url: 'pdf/v1/templates/presentation',
			method: 'GET',
		});
	},
	get_presenntation_by_id: (id: string) => {
		return utils.request({
			url: `presentations/v1/${id}`,
			method: 'GET',
		});
	},
	create_presentation: (data: CatalogFormValues) => {
		return utils.request({
			url: 'presentations/v1',
			method: 'POST',
			data,
		});
	},
	update_presentation: (id: string, data: CatalogFormValues) => {
		return utils.request({
			url: `presentations/v1/${id}`,
			method: 'PUT',
			data,
		});
	},
	get_presentation_preview: (data: CatalogPreviewValues) => {
		return utils.request({
			url: 'presentations/v1/tear_sheet/preview',
			method: 'POST',
			data,
		});
	},
	regenerate_presentation_pdf: (id: string) => {
		return utils.request({
			url: `presentations/v1/${id}/tear_sheet/pdf`,
			method: 'POST',
		});
	},
};

export default presentation;
