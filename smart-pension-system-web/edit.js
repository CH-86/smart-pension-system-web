function edit(str1,str2){
	var g = '';
	var type = '';
	if (str1 == 1) {
		type = '社员';
	} else if (str1 == 2) {
		type = '社长'
	}
	if (str2 == 1) {
		g = '大一'
	} else if (str2 == 2) {
		g = '大二'
	} else if (str2 == 3) {
		g = '大三'
	} else if (str2 == 4) {
		g = '大四';
	}
	return g,type;
}
function edit2 (str1,str2){
	if (str1 == '社长') {
		str1 = 2;
	} else {
		str1 = 1;
	}
	if (str2 == '大一') {
		str2 = 1;
	} else if (str2 == '大二') {
		str2 = 2;
	} else if (str2 == '大三') {
		str2 = 3;
	} else {
		str2 = 4;
	}
}