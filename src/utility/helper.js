import { animateScroll as scroll } from "react-scroll";
import memoizeOne from "memoize-one";
import isDeepEqual from "lodash.isequal";

const identity = x => x;

export const shallowMemoized = memoizeOne(identity);
export const deepMemoized = memoizeOne(identity, isDeepEqual);

export function scrollToBottom() {
  return scroll.scrollToBottom();
}

export function ScrollToTop() {
  return scroll.scrollToTop();
}

export const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop); // General scroll to element function
export const isnotEmpty = a => a && Boolean(Object.keys(a).length);


export const resolveWith = a => Promise.resolve(a);

export const deselectAllCheckboxes = document => {
	let getBoxes = document.getElementsByClassName('table_checkbox'),
		checkAllBox= document.getElementsByClassName('selectAllCheckbox');
	for(var i=0; i<getBoxes.length; i++){  
        if(getBoxes[i].type ==='checkbox')  
			getBoxes[i].checked=false;  
    }
	checkAllBox[0].checked=false;
	return 0;
};

export const handleCheckChange = (e, document, inputCheckedCount, inputCheckIds) => {
	let itemName = e.target.name,
	// checked = e.target.checked, 
	count = 0, checkedRows = [], finalResult = {};
	if (itemName === "selectAllCheckbox") {
		let getBoxes = document.getElementsByClassName('table_checkbox');
		if (e.target.checked === true) {
			for(var i=0; i<getBoxes.length; i++){  
				if(getBoxes[i].type ==='checkbox')  
					getBoxes[i].checked=true;  
					count = parseInt(i) + 1;
					checkedRows.push(getBoxes[i].name);
			} 
			finalResult.count = count;
			finalResult.checkData = checkedRows;
			return finalResult;
		} else {
			deselectAllCheckboxes(document);
			finalResult.count = 0;
			finalResult.checkData = [];
			return finalResult;
		}
	} else {
		let checkAllBox= document.getElementsByClassName('selectAllCheckbox');
			

		if (inputCheckIds.length > 0) checkedRows = inputCheckIds;
		if (e.target.checked === true) {
			count = parseInt(inputCheckedCount) + 1;
			checkedRows.push(e.target.name);
		} else {
			if (parseInt(inputCheckedCount) >=1) {
				count = parseInt(inputCheckedCount) - 1;
				checkedRows.splice(checkedRows.indexOf(e.target.name), 1);
			}
			if (checkAllBox[0].checked === true) {
				checkAllBox[0].checked = false;
			}
		}
		finalResult.count = count;
		finalResult.checkData = checkedRows;
		return finalResult;
	}
};