interface CategoryProps {
	categoryList: any;
	label?: string;
	onApply: (payload: string[]) => any;
	applied?: string[];
}
interface CategoryFilterProps {
	categoryList: any;
	label?: string;
	onApply: (payload: string[]) => any;
	applied?: string[];
	setAnchorEl: (anchorEl: any) => any;
	isDisable?: boolean;
}
interface HashMap extends Object {
	hierarchy: string;
	id: string;
}

enum CheckboxState {
	UNCHECKED,
	CHECKED,
	INDETERMINATE,
}

type ItemState = {
	id: any;
	state: CheckboxState;
};

export { CategoryFilterProps, CategoryProps, CheckboxState, HashMap, ItemState };
