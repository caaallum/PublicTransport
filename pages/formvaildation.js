window.onload = function() {
	var form = document.getElementById('petition-form');
	var dob = form.dob;
	var date = new Date();
	
	function dobValidation(){
	if (dob.value.match(/\d\d-\d\d-\d\d\d\d/))
		dob.oninput = dob.setCustomValidity('');
	else
		dob.oninvalid = dob.setCustomValidity('The date must be in DD-MM-YYYY format');
	};
	
	//dob.onchange = dobValidation;
/*
function futureValidation(){
	var form = document.getElementById('petition-form');
	var dob = form.dob.value;
	var date = form.date.value;
	
	if (dob.value.indexOf(6,9) == date.getFullYear())
		dob.setCustomValidity('')
	else
		dob.setCustomValidity('The date cannot be in the future.')
	
	
	if (dob.value.indexOf(3,4).match(/02/)
			if (dob.value.indexOf(0,1).match(/(2[0-8])|[0-1]\d/)
				dob.oninput = dob.setCustomValidity('');
			else
*/
}