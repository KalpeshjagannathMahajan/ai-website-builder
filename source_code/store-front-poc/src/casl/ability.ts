//ability.js
import { Ability } from '@casl/ability';

// Defines how to detect object's type;
function subjectName(item: any) {
	if (!item || typeof item === 'string') {
		return item;
	}
	return item.__type;
}
const ability = new Ability([], { subjectName });

export default ability;
