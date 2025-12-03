import { useEffect, useState } from 'react';
import { TagOption, TagsResponse } from 'src/@types/document_tags';
import api_requests from 'src/utils/api_requests';

const useDocumentTags = (document_tags_enabled: boolean) => {
	const [tags_data, set_tags_data] = useState<TagsResponse | null>(null);
	const [tag_options, set_tag_options] = useState<TagOption[]>([]);
	const fetch_doc_tags = async () => {
		try {
			const response: any = await api_requests.order_management.get_document_tags();
			if (response?.status === 200) {
				set_tags_data(response);
				set_tag_options(response?.options);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!document_tags_enabled) return;
		fetch_doc_tags();
	}, [document_tags_enabled]);
	return { tags_data, tag_options };
};

export default useDocumentTags;
