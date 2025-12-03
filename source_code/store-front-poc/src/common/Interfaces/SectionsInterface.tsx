export interface Section {
	key: string;
	name: string;
	priority?: number;
	attributes: any[];
	subtext?: string;
	modules?: Module[];
}

export interface PermissionSection {
	key: string;
	name: string;
	priority: number;
	attributes: any[];
	subtext: string;
	modules: Module[];
	permissions: { [key: string]: PermissionEntity };
	is_manager_role: boolean;
}

export interface PermissionEntity {
	childDeps: string[];
	parentDeps: string[];
	value: boolean;
}

export interface Module {
	key: string;
	name: string;
	submodules: Submodule[];
}

export interface Submodule {
	key: string;
	name: string;
	permissions: Permission[];
}

export interface Permission {
	key: string;
	label: string;
	permissionId: string;
}

interface CartItem {
	quantity: number;
	discount_type: string;
	discount_value: number;
	meta: any;
}
export interface IProduct {
	[CartItemId: string]: CartItem;
}
