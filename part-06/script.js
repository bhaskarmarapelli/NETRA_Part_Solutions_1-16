// ================= ROVER DATA =================
// Stores information about all six campus rovers.
// Each rover has an ID, location, status and sensor readings.
const rovers = [
    { id: "R-01", zone: "Library", status: "Online", battery: 92,
      temperature: 32, sonar: 120, speed: 1.2, distance: 2.4 },
    { id: "R-02", zone: "Admin Block", status: "Online", battery: 78,
      temperature: 35, sonar: 95, speed: 0.9, distance: 1.8 },
    { id: "R-03", zone: "R&D Block", status: "Online", battery: 65,
      temperature: 38, sonar: 140, speed: 1.5, distance: 3.1 },
    { id: "R-04", zone: "Hostel Gate", status: "Online", battery: 84,
      temperature: 33, sonar: 110, speed: 1.1, distance: 2.0 },
    { id: "R-05", zone: "Food Court", status: "Online", battery: 48,
      temperature: 41, sonar: 75, speed: 0.7, distance: 1.5 },
    { id: "R-06", zone: "Sports Arena", status: "Online", battery: 89,
      temperature: 31, sonar: 160, speed: 1.3, distance: 2.8 }
];

// Stores the currently selected rover.
// Initially, R-01 is selected.
let selectedRover = rovers[0];

// Stores historical sensor readings for the selected rover.
// These readings are used to draw the telemetry chart.
let historyData = [];

// ================= DIGITAL CLOCK =================
// Updates the dashboard clock with the current system time.
function updateClock() {

    // Finds the clock element in the HTML.
    const clock = document.getElementById("clock");

    // Displays the current time.
    if (clock) clock.textContent = new Date().toLocaleTimeString();
}

// Calls the clock function immediately.
updateClock();

// Repeats the clock update every one second (1000 milliseconds).
setInterval(updateClock, 1000);

// ================= FLEET MANAGEMENT =================
// Displays all rover information inside the fleet table.
// Also supports searching and selecting individual rovers.
function renderFleet() {

    // Finds the table body where rover information is displayed.
    const body = document.getElementById("fleet-body");

    // Gets the search text and converts it to lowercase.
    const search = document.getElementById("rover-search").value.toLowerCase();

    // Stops execution if the table body does not exist.
    if (!body) return;

    // Clears the previous table contents.
    body.innerHTML = "";

    // Filters rovers using their ID or zone name.
    // Only matching rovers are displayed.
    rovers.filter(rover =>
        rover.id.toLowerCase().includes(search) ||
        rover.zone.toLowerCase().includes(search)
    ).forEach(rover => {

        // Creates a new table row for each rover.
        const row = document.createElement("tr");

        // Highlights the currently selected rover.
        if (rover.id === selectedRover.id) {
            row.classList.add("selected-row");
        }

        // Inserts rover details into the table row.
        row.innerHTML = `
            <td>${rover.id}</td>
            <td>${rover.zone}</td>
            <td>${rover.status}</td>
            <td>${rover.battery.toFixed(0)}%</td>
            <td>${rover.temperature.toFixed(1)}°C</td>
            <td>${rover.sonar.toFixed(0)} cm</td>
            <td>${rover.speed.toFixed(1)} m/s</td>
        `;

        // Adds a click event to each rover row.
        // When clicked, that rover becomes the selected rover.
        row.addEventListener("click", () => {
            // Updates the selected rover.
            selectedRover = rover;

            // Refreshes the fleet table to highlight the selection.
            renderFleet();
        });

        // Adds the completed row to the fleet table.
        body.appendChild(row);
    });
}

// ================= DASHBOARD STATISTICS =================
// Calculates and updates the important fleet statistics.
// Updates online rovers, average battery and total distance.
function updateDashboard() {

    // Counts how many rovers are currently online.
    const online = rovers.filter(rover => rover.status === "Online").length;

    // Calculates the average battery percentage of all rovers.
    const averageBattery =
        rovers.reduce((sum, rover) => sum + rover.battery, 0) / rovers.length;

    // Calculates the total distance travelled by all rovers.
    const distance =
        rovers.reduce((sum, rover) => sum + rover.distance, 0);

    // Displays the number of online rovers.
    document.getElementById("online-count").textContent =
        `${online} / ${rovers.length}`;

    // Displays the average battery percentage.
    document.getElementById("average-battery").textContent =
        averageBattery.toFixed(0) + "%";

    // Displays the total distance.
    document.getElementById("distance").textContent =
        distance.toFixed(1) + " km";

    // Refreshes the fleet information table.
    renderFleet();
}

// ================= SEARCH AND PAGE LOAD =================
// Updates the fleet table whenever the user types in the search box.
document.getElementById("rover-search")
    .addEventListener("input", renderFleet);

// Shows the dashboard values after the page finishes loading.
window.addEventListener("load", updateDashboard);
