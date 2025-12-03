type TagOption = {
	label: string;
	value: string;
	color: string;
	is_default: boolean;
	is_active: boolean;
};

type TagsResponse = {
	value: string;
	type: string;
	options: TagOption[];
	id: string;
};

export type { TagOption, TagsResponse };
