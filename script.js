//* VIEW *

const inputForm = document.getElementById("input-form");
const meterNo = document.getElementById("meter-no");
const prevReading = document.getElementById("prev-reading");
const currReading = document.getElementById("curr-reading");
const costPerUnit = document.getElementById("unit-cost");

const consumption = document.getElementById("consumption");
const monthlyCost = document.getElementById("monthly-cost");

const calculateButton = document.getElementById("calculate-button");

//* CONTROLLER *
const storageKey = "anything kayo na ang bahala";

window.onload = function () {
	// Load inputs on page load
	loadInputs();

	// bind event listener to both reading inputs
	currReading.addEventListener("input", validateReading);
	prevReading.addEventListener("input", validateReading);

	// bind event listener to input submit
	inputForm.addEventListener("submit", calculate);
};

// validates if current reading is greater than previous reading
const validateReading = () => {
	if (currReading.value < prevReading.value) {
		currReading.setCustomValidity(
			"Current reading must be greater than or equal to the previous reading."
		);
		return false;
	} else {
		currReading.setCustomValidity("");
		return true;
	}
};

// input submit button calculates consumption and monthly cost
const calculate = () => {
	if (!validateReading()) return;

	// calculate output values
	var consumptionVal = currReading.value - prevReading.value;
	var monthlyCostVal = consumptionVal * costPerUnit.value;

	// limit consumption to 2 decimal places if not an integer
	if (consumptionVal % 1 !== 0) consumptionVal = consumptionVal.toFixed(2);
	consumptionVal += " kWh";

	// peso is always 2 decimal places
	monthlyCostVal =
		"₱" +
		monthlyCostVal.toFixed(2).toLocaleString("en", { useGrouping: true });

	consumption.value = consumptionVal;
	monthlyCost.value = monthlyCostVal;

	// save inputs to storage
	saveInputs();
};

// saves input in storage
const saveInputs = () => {
	const inputs = {
		meterNo: meterNo.value,
		prevReading: prevReading.value,
		currReading: currReading.value,
		costPerUnit: costPerUnit.value,
	};
	localStorage.setItem(storageKey, JSON.stringify(inputs));
};

// loads inputs from storage if available
const loadInputs = () => {
	const inputs = JSON.parse(localStorage.getItem(storageKey));

	if (inputs) {
		meterNo.value = inputs.meterNo;
		prevReading.value = inputs.prevReading;
		currReading.value = inputs.currReading;
		costPerUnit.value = inputs.costPerUnit;

		// run calculate function
		calculate();
	}
};
