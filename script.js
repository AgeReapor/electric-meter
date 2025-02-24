import { DotLottie } from "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm";

// TODO: BY THE POWER OF CSS
// TODO: summary receipt (?) maybe copy format from unc portal
// TODO: Add Peso sign in front of unit cost via ::after
// TODO: Theme saved in storage

//* VIEW *

// -- DOM ELEMENTS --

// Windows
const inputWindow = document.getElementById("input-window");
const loadingWindow = document.getElementById("loading-window");
const outputWindow = document.getElementById("output-window");
const exitWindow = document.getElementById("exit-window");

// Form Elements
const inputForm = document.getElementById("input-form");
const meterNo = document.getElementById("meter-no");
const prevReading = document.getElementById("prev-reading");
const currReading = document.getElementById("curr-reading");
const costPerUnit = document.getElementById("unit-cost");

const outputForm = document.getElementById("output-form");
const consumption = document.getElementById("consumption");
const monthlyCost = document.getElementById("monthly-cost");

const calculateButton = document.getElementById("calculate-button");

// GIF CONTAINERS
const gifInput = document.querySelector("#input-window .gif-container");
const gifLoading = document.querySelector("#loading-window .gif-container");
const gifOutput = document.querySelector("#output-window .gif-container");
const gifExit = document.querySelector("#exit-window .gif-container");

//* CONTROLLER *

// -- ON PAGE LOAD --
window.onload = function () {
	// bind comparison validation to both electric reading inputs
	currReading.addEventListener("input", validateReading);
	prevReading.addEventListener("input", validateReading);

	// bind output calculation to input's submit button
	inputForm.addEventListener("submit", calculate);

	// bind exit button to exit window
	outputForm.addEventListener("submit", gotoExitWindow);

	// If inputs are available, load them
	loadInputs();

	// Show the input window by default
	setWindowActive(inputWindow);

	// load lottie animations

	lottieLoad(
		gifInput,
		"https://lottie.host/68678d9c-76e5-4c33-80f4-17b64fe84341/yTFddtNHOu.lottie"
	);
};

// -- FUNCTIONS --

// provided key to store inputs
const storageKey = "anything kayo na ang bahala";

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
// also saves inputs to storage
const calculate = async () => {
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

	// show loading window
	await setWindowActive(loadingWindow);

	// set a three second timer before showing the output window
	setTimeout(() => {
		setWindowActive(outputWindow);
	}, 3000);
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
// returns true if inputs are available
const loadInputs = () => {
	const inputs = JSON.parse(localStorage.getItem(storageKey));

	if (inputs) {
		meterNo.value = inputs.meterNo;
		prevReading.value = inputs.prevReading;
		currReading.value = inputs.currReading;
		costPerUnit.value = inputs.costPerUnit;

		return true;
	}

	return false;
};

// Sets all windows but the active one to hidden
const setWindowActive = (window) => {
	setHidden(inputWindow);
	setHidden(loadingWindow);
	setHidden(outputWindow);
	setHidden(exitWindow);

	removeHidden(window);
};

const gotoExitWindow = () => {
	setWindowActive(exitWindow);
};
// adds hidden class to passed element
const setHidden = (element) => {
	// only add hidden class if not already hidden
	if (!element.classList.contains("hidden")) {
		element.classList.add("hidden");
	}
};

// removes hidden class from passed element
const removeHidden = (element) => {
	// only remove hidden class if already hidden
	if (element.classList.contains("hidden")) {
		element.classList.remove("hidden");
	}
};
