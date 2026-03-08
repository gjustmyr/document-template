// Function to update display fields from input values
function updateDisplay() {
	document.getElementById("displayStudentName").textContent =
		document.getElementById("studentName").value;
	document.getElementById("displayYearProgram").textContent =
		document.getElementById("yearProgram").value;
	document.getElementById("displayCompanyAddress").textContent =
		document.getElementById("companyAddress").value;
	document.getElementById("displayRequiredHours").textContent =
		document.getElementById("requiredHours").value;
}

// Function to generate schedule based on configuration
function generateSchedule() {
	// Get configuration values
	const startDate = document.getElementById("startDate").value;
	const endDate = document.getElementById("endDate").value;
	const timeIn = document.getElementById("timeIn").value;
	const timeOut = document.getElementById("timeOut").value;
	const hoursPerDay = parseFloat(document.getElementById("hoursPerDay").value);

	// Validate inputs
	if (!startDate || !endDate) {
		alert("Please select both start and end dates.");
		return;
	}

	if (!timeIn || !timeOut) {
		alert("Please select both time in and time out.");
		return;
	}

	if (!hoursPerDay || hoursPerDay <= 0) {
		alert("Please enter valid hours per day.");
		return;
	}

	// Get selected training days
	const selectedDays = [];
	document
		.querySelectorAll('.days-selector input[type="checkbox"]:checked')
		.forEach((checkbox) => {
			selectedDays.push(parseInt(checkbox.value));
		});

	if (selectedDays.length === 0) {
		alert("Please select at least one training day.");
		return;
	}

	// Generate schedule
	const scheduleBody = document.getElementById("scheduleBody");
	scheduleBody.innerHTML = "";

	const start = new Date(startDate);
	const end = new Date(endDate);
	let totalHours = 0;

	// Iterate through dates
	for (
		let date = new Date(start);
		date <= end;
		date.setDate(date.getDate() + 1)
	) {
		const dayOfWeek = date.getDay();

		// Check if this day is in selected training days
		if (selectedDays.includes(dayOfWeek)) {
			const row = document.createElement("tr");

			// Format date
			const formattedDate = formatDate(date);

			// Format time range with 12-hour format
			const timeRange = formatTimeRange(timeIn, timeOut);

			// Create cells
			row.innerHTML = `
                <td contenteditable="true">${formattedDate}</td>
                <td contenteditable="true">${timeRange}</td>
                <td contenteditable="true" class="hours-cell" oninput="updateTotal()">${hoursPerDay}</td>
            `;

			scheduleBody.appendChild(row);
			totalHours += hoursPerDay;
		}
	}

	// Update total hours
	document.getElementById("totalHours").innerHTML =
		`<strong>${totalHours.toFixed(1)}</strong>`;

	// Scroll to table
	document
		.querySelector(".timeframe-table")
		.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Function to format date (e.g., "January 15, 2026")
function formatDate(date) {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const month = months[date.getMonth()];
	const day = date.getDate();
	const year = date.getFullYear();

	return `${month} ${day}, ${year}`;
}

// Function to format time range in 12-hour format
function formatTimeRange(timeIn, timeOut) {
	const formatTime12Hour = (time) => {
		const [hours, minutes] = time.split(":");
		const hour = parseInt(hours);
		const ampm = hour >= 12 ? "PM" : "AM";
		const hour12 = hour % 12 || 12;
		return `${hour12}:${minutes} ${ampm}`;
	};

	return `${formatTime12Hour(timeIn)} - ${formatTime12Hour(timeOut)}`;
}

// Function to update total hours when edited
function updateTotal() {
	let total = 0;
	document.querySelectorAll(".hours-cell").forEach((cell) => {
		const hours = parseFloat(cell.textContent) || 0;
		total += hours;
	});
	document.getElementById("totalHours").innerHTML =
		`<strong>${total.toFixed(1)}</strong>`;
}

// Function to reset form
function resetForm() {
	if (
		confirm("Are you sure you want to reset the form? All data will be lost.")
	) {
		// Clear all input fields
		document.getElementById("studentName").value = "";
		document.getElementById("yearProgram").value = "";
		document.getElementById("companyAddress").value = "";
		document.getElementById("requiredHours").value = "";
		document.getElementById("startDate").value = getTodayDate();
		document.getElementById("endDate").value = getThreeMonthsLaterDate();
		document.getElementById("timeIn").value = "08:00";
		document.getElementById("timeOut").value = "17:00";
		document.getElementById("hoursPerDay").value = "8";

		// Reset checkboxes to default (Monday-Friday)
		document
			.querySelectorAll('.days-selector input[type="checkbox"]')
			.forEach((checkbox, index) => {
				checkbox.checked = index < 5; // Check first 5 (Mon-Fri)
			});

		// Clear display fields
		document.getElementById("displayStudentName").textContent = "";
		document.getElementById("displayYearProgram").textContent = "";
		document.getElementById("displayCompanyAddress").textContent = "";
		document.getElementById("displayRequiredHours").textContent = "";

		// Clear schedule table
		document.getElementById("scheduleBody").innerHTML = "";
		document.getElementById("totalHours").innerHTML = "<strong>0</strong>";
	}
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate() {
	const today = new Date();
	return today.toISOString().split("T")[0];
}

// Helper function to get date 3 months from now in YYYY-MM-DD format
function getThreeMonthsLaterDate() {
	const date = new Date();
	date.setMonth(date.getMonth() + 3);
	return date.toISOString().split("T")[0];
}

// Add event listener for Enter key in contenteditable cells
document.addEventListener("keydown", function (e) {
	if (e.key === "Enter" && e.target.contentEditable === "true") {
		e.preventDefault();
		// Move to next cell
		const cell = e.target;
		const row = cell.parentElement;
		const nextCell = cell.nextElementSibling;

		if (nextCell && nextCell.contentEditable === "true") {
			nextCell.focus();
			// Select all text in the cell
			const range = document.createRange();
			range.selectNodeContents(nextCell);
			const sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(range);
		} else {
			const nextRow = row.nextElementSibling;
			if (nextRow) {
				const firstCell = nextRow.querySelector('[contenteditable="true"]');
				if (firstCell) {
					firstCell.focus();
					const range = document.createRange();
					range.selectNodeContents(firstCell);
					const sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		}
	}
});

// Initialize: Set default dates (today and 3 months later)
window.addEventListener("DOMContentLoaded", function () {
	document.getElementById("startDate").value = getTodayDate();
	document.getElementById("endDate").value = getThreeMonthsLaterDate();
	document.getElementById("totalHours").innerHTML = "<strong>0</strong>";
});
