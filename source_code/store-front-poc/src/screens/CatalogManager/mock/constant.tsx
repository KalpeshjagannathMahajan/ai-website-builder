export const commonStyle = {
	margin: '0rem 1rem',
	backgroundColor: '#F7F8F8',
	cursor: 'pointer',
	boxShadow: '0px 0px 12px 1px rgba(0, 0, 0, 0.06)',
	'&:hover': {
		background: 'none',
	},
};

export interface import_export_props {
	open: boolean;
	set_open?: any;
	handle_close: () => void;
	handle_confirm: (id: string) => void;
}
