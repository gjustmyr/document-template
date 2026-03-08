// Update display fields when inputs change
function updateDisplay() {
	// Date
	const dateInput = document.getElementById("dateInput").value;
	if (dateInput) {
		const date = new Date(dateInput);
		const formattedDate = date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		document.getElementById("displayDate").textContent = formattedDate;
	} else {
		document.getElementById("displayDate").textContent = "";
	}

	// Parent/Guardian Name
	const parentName = document.getElementById("parentName").value;
	document.getElementById("displayParentName1").textContent = parentName;

	// Student Name
	const studentName = document.getElementById("studentName").value;
	document.getElementById("displayStudentName1").textContent = studentName;

	// Program
	const program = document.getElementById("program").value;
	document.getElementById("displayProgram1").textContent = program;
	document.getElementById("displayProgram2").textContent = program;
	document.getElementById("displayProgram3").textContent = program;

	// Contact Number
	const contactNumber = document.getElementById("contactNumber").value;
	document.getElementById("displayContactNumber").textContent = contactNumber;

	// Address
	const address = document.getElementById("address").value;
	document.getElementById("displayAddress").textContent = address;

	// Coordinator
	const coordinator = document.getElementById("coordinatorName").value;
	document.getElementById("displayCoordinator").textContent = coordinator;
}

// Reset form
function resetForm() {
	// Clear all inputs
	document.getElementById("dateInput").value = "";
	document.getElementById("parentName").value = "";
	document.getElementById("studentName").value = "";
	document.getElementById("program").value = "";
	document.getElementById("contactNumber").value = "";
	document.getElementById("address").value = "";
	document.getElementById("coordinatorName").value = "";

	// Update display
	updateDisplay();
}

// Download as PDF
async function downloadPDF() {
	const button = event.target;
	const originalText = button.textContent;
	button.textContent = "Generating PDF...";
	button.disabled = true;

	try {
		const element = document.querySelector(".form-document");

		// Hide action buttons before capturing
		const actionButtons = document.querySelector(".action-buttons");
		actionButtons.style.display = "none";

		const canvas = await html2canvas(element, {
			scale: 2,
			useCORS: true,
			allowTaint: true,
			backgroundColor: "#ffffff",
		});

		// Show action buttons again
		actionButtons.style.display = "flex";

		const imgData = canvas.toDataURL("image/png");
		const { jsPDF } = window.jspdf;
		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "a4",
		});

		const imgWidth = 210; // A4 width in mm
		const imgHeight = (canvas.height * imgWidth) / canvas.width;

		pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
		pdf.save("Parents_Guardian_Consent_Form.pdf");
	} catch (error) {
		console.error("Error generating PDF:", error);
		alert("Error generating PDF. Please try again.");
	} finally {
		button.textContent = originalText;
		button.disabled = false;
	}
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
	updateDisplay();
});
