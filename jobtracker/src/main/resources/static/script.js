const API_URL = "https://job-application-tracker-s1eu.onrender.com";

//Switching tabs
    function showSection(sectionId) {

        //Hide both sections
        document.getElementById("addJobSection").style.display = "none";
        document.getElementById("viewJobsSection").style.display = "none";

        //Show the selected section
        document.getElementById(sectionId).style.display = "block";

        //If viewing jobs, load them
        if (sectionId === "viewJobsSection") {
            loadjobs();
        }
    }
//Show/Hide "Other" Fields for source

document.getElementById("source").addEventListener("change", function() {
    const container = document.getElementById("sourceOtherContainer");
    if (this.value === "OTHER") {
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
});

// Get the form and listen for submit
document.getElementById('jobForm').addEventListener("submit", function(event) {
    
    //prevent page refresh
    event.preventDefault();

    //get dropdown values
    const sourceSelect = document.getElementById("source").value;
    const statusSelect = document.getElementById("status").value;

    const job = {
        company: document.getElementById("company").value,
        jobTitle: document.getElementById("jobTitle").value,
        location: document.getElementById("location").value,
        source: document.getElementById("source").value,
        dateApplied: document.getElementById("dateApplied").value,
        status: document.getElementById("status").value, //must match backend enum
        jobLink: document.getElementById("jobLink").value,
        followUpDate: document.getElementById("followUpDate").value,
        notes: document.getElementById("notes").value
    };

    //send POST request to backend
    const url = window.currentEditId 
    ? `${API_URL}/api/applications/${window.currentEditId}`
    : `${API_URL}/api/applications`;

    const method = window.currentEditId ? "PUT" : "POST";

    console.log("Submitting with:", method, url);

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(job)
    })
    .then(response => response.json())

    //success
    .then(data => {
        document.getElementById("message").innerText = "Job added successfully!";

        //Reset form fields
        document.getElementById("jobForm").reset();

        //Hide "other" fields again after reset
        document.getElementById("sourceOtherContainer").style.display = "none";

        window.currentEditId = null; //reset edit ID

        loadjobs(); // Refresh the job list

        //Reset button text and hide cancel button
        document.getElementById("submitButton").innerText = "Add Job";
        document.getElementById("cancelButton").style.display = "none";

        //Switch to view jobs tab
        showSection("viewJobsSection");
    })

    //Error handling
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("message").innerText = "Error adding job.";
    });
});

function loadjobs() {

    fetch(`${API_URL}/api/applications`)
    .then(response => response.json())
    .then(data => {

        const tableBody = document.getElementById("jobsTableBody");
        
        // clear exisiting rows
        tableBody.innerHTML = "";

        //loop through jobs
        data.forEach(job => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${job.company}</td>
                <td>${job.jobTitle}</td>
                <td>${job.location || ""}</td>
                <td>${formatEnum(job.source)}</td>
                <td>${job.dateApplied || ""}</td>
                <td>${formatEnum(job.status)}</td>
                <td class="link-cell">
                    <a href="${job.jobLink}" target="_blank">${job.jobLink ? "Link" : ""}</a>
                </td>
                <td>${job.followUpDate || ""}</td>
                <td>${job.notes || ""}</td>
                <td>
                    <button onclick="editJob(${job.id})">Edit</button>
                    <button onclick="deleteJob(${job.id})">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error("Error fetching jobs:", error));
}

function formatEnum(value) {
    if (!value) return "";

    return String(value)
        .toLowerCase()
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

//Edit job function
function editJob(id) {

    fetch(`${API_URL}/api/applications/${id}`)
    .then(response => response.json())
    .then(job => {

        //switch to add job tab
        showSection("addJobSection");

        //fill form
        document.getElementById("company").value = job.company;
        document.getElementById("jobTitle").value = job.jobTitle;
        document.getElementById("location").value = job.location || ""; 
        document.getElementById("source").value = job.source;
        document.getElementById("dateApplied").value = job.dateApplied;
        document.getElementById("status").value = job.status;
        document.getElementById("jobLink").value = job.jobLink || "";
        document.getElementById("followUpDate").value = job.followUpDate || "";
        document.getElementById("notes").value = job.notes || "";

        //Store ID globally
        window.currentEditId = id;

        //Change button text
        document.getElementById("submitButton").innerText = "Save Changes";

        //Show cancel button
        document.getElementById("cancelButton").style.display = "block";
    })
    .catch(error => console.error("Error fetching job for edit:", error));
}

//Cancel edit function
function cancelEdit() {

    //clear edit mode
    window.currentEditId = null;

    //reset form
    document.getElementById("jobForm").reset();

    //reset button text and hide cancel button
    document.getElementById("submitButton").innerText = "Add Job";
    document.getElementById("cancelButton").style.display = "none";

    //Hide "other" fields
    document.getElementById("sourceOtherContainer").style.display = "none";

    //Switch back to view jobs tab
    showSection("viewJobsSection");
}

//Delete job function
function deleteJob(id) {

    if (confirm("Are you sure you want to delete this job?")) {
        fetch(`${API_URL}/api/applications/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                loadjobs(); // Refresh the job list after deletion
            } else {
                console.error("Failed to delete job with id:", id);
            }
        })
        .catch(error => console.error("Error deleting job:", error));
    }
}   