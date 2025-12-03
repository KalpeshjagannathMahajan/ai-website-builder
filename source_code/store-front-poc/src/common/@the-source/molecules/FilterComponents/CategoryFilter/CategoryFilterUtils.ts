import { forEach } from 'lodash';
import { CheckboxState, HashMap, ItemState } from './CategoryFilter.types';

const getAllIds = (tree: any): string[] => {
	const ids: string[] = [];

	const traverse = (nodes: any) => {
		nodes.forEach((node: any) => {
			ids.push(node.id);
			traverse(node.children);
		});
	};

	traverse(tree);

	return ids;
};

const getParentIdByNodeId = (tree: any, nodeId: string): string | null => {
	const findParent = (nodes: any, parentId: string | null): string | null => {
		let foundParentId = null;

		nodes.some((node: any) => {
			if (node.id === nodeId) {
				foundParentId = parentId;
				return true; // Stop iterating
			}

			foundParentId = findParent(node.children, node.id);
			return foundParentId !== null;
		});

		return foundParentId;
	};

	return findParent(tree, null);
};

const flattenTree = (tree: any, hierarchy: string[] = []): HashMap[] =>
	tree.flatMap((node: any) => {
		const { id, name, children } = node;
		const currentHierarchy = [...hierarchy, name];
		const result = { id, hierarchy: currentHierarchy.join(' > ') };

		if (children && children.length > 0) {
			return [result, ...flattenTree(children, currentHierarchy)];
		}

		return result;
	});

const getAllChildrenByParentId = (node: any, parentId: string): string[] =>
	node.reduce((childrenIds: string[], item: any) => {
		if (item.id === parentId) {
			return item.children.map((child: any) => child.id);
		}

		const childIds = getAllChildrenByParentId(item.children, parentId);
		return childrenIds.concat(childIds);
	}, []);

const updateItemStates = (oldState: ItemState[], tree: any, clickedIds: any[]) => {
	const newState = oldState.map((i) => ({ ...i }));

	const getItemState = (id: any) => newState?.find((i) => i.id === id)?.state;

	const updateParent = (id: any) => {
		const parent = getParentIdByNodeId(tree, id);
		if (!parent) return;
		const childIds = getAllChildrenByParentId(tree, parent);
		const childStates = childIds.map((elem) => getItemState(elem));
		if (childStates.length === childStates.filter((s: any) => s === CheckboxState.CHECKED).length) {
			newState.find((i) => i.id === parent)!.state = CheckboxState.CHECKED;
		} else if (childStates.length === childStates.filter((s: any) => s === CheckboxState.UNCHECKED).length) {
			newState.find((i) => i.id === parent)!.state = CheckboxState.UNCHECKED;
		} else {
			newState.find((i) => i.id === parent)!.state = CheckboxState.INDETERMINATE;
		}
		updateParent(parent);
	};
	const setUnchecked = (id: any) => {
		newState.find((i) => i.id === id)!.state = CheckboxState.UNCHECKED;
		const allChildren = getAllChildrenByParentId(tree, id);
		allChildren.forEach((childId: any) => setUnchecked(childId));
		updateParent(id);
	};
	const setChecked = (id: any) => {
		newState.find((i) => i.id === id)!.state = CheckboxState.CHECKED;
		const allChildren = getAllChildrenByParentId(tree, id);
		allChildren.forEach((childId: any) => setChecked(childId));
		updateParent(id);
	};

	forEach(clickedIds, (clickedId) => {
		const itemState = getItemState(clickedId);
		if (itemState === CheckboxState.CHECKED) {
			setUnchecked(clickedId);
		} else {
			setChecked(clickedId);
		}
	});

	return newState;
};

export { flattenTree, getAllChildrenByParentId, getAllIds, getParentIdByNodeId, updateItemStates };
