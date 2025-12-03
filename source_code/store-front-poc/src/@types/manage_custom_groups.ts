import constants from 'src/utils/constants';
const { ACTION_MODAL_MODES } = constants.CART_GROUPING_KEYS;

type Mode = (typeof ACTION_MODAL_MODES)[keyof typeof ACTION_MODAL_MODES];

interface ManageCustomGroupsProps {
	show_custom_group_drawer: boolean;
	set_show_custom_group_drawer: (value: boolean) => void;
}

interface Product {
	id: string;
	product_image: string;
	[key: string]: any; // to store other product details
}

interface Group {
	id: string;
	base_name: string;
	products: Product[];
}

interface MappedCustomGroup {
	id: string;
	base_name: string;
	products: string[];
}

interface GroupedItemsProps {
	handle_add_group: () => void;
	groups: Group[];
	set_groups: (value: Group[]) => void;
	show_custom_group_drawer: boolean;
	set_current_group: (group: Group) => void;
	set_is_action_modal: (value: boolean) => void;
	set_modal_mode: (mode: string) => void;
}

interface DraggableGroupProps {
	group: Group;
	index: number;
	on_delete: (group_id: string) => void;
	on_edit: (group: Group) => void;
}

interface ActionModalProps {
	is_action_modal: boolean;
	set_is_action_modal: (value: boolean) => void;
	current_group: Group | null;
	mode: Mode;
	set_groups: (value: Group[] | ((prev: Group[]) => Group[])) => void;
	groups: Group[];
	handle_delete_group: (group_id: string) => void;
}

export type { ManageCustomGroupsProps, GroupedItemsProps, Product, Group, DraggableGroupProps, ActionModalProps, MappedCustomGroup };
