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

            // Clears previous rover history.
            historyData = [];

            // Creates initial history for the newly selected rover.
            seedHistory();

            // Updates the sensor readings on the dashboard.
            updateSelectedRover();

            // Refreshes the fleet table to highlight the selection.
            renderFleet();

            // Redraws the telemetry chart.
            drawChart();
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

    // Updates the selected rover details.
    updateSelectedRover();

    // Refreshes the fleet information table.
    renderFleet();
}

// ================= SELECTED ROVER DETAILS =================
// Displays the latest sensor readings of the selected rover.
function updateSelectedRover() {

    // Displays the selected rover ID.
    document.getElementById("selected-rover-label").textContent = selectedRover.id;

    // Displays the battery percentage.
    document.getElementById("battery-value").textContent =
        selectedRover.battery.toFixed(0) + "%";

    // Displays the temperature in Celsius.
    document.getElementById("temperature-value").textContent =
        selectedRover.temperature.toFixed(1) + "°C";

    // Displays the sonar distance in centimetres.
    document.getElementById("sonar-value").textContent =
        selectedRover.sonar.toFixed(0) + " cm";

    // Displays the rover speed in metres per second.
    document.getElementById("speed-value").textContent =
        selectedRover.speed.toFixed(1) + " m/s";
}

// ================= TELEMETRY HISTORY =================
// Saves the current sensor readings of the selected rover.
// Each saved record contains a timestamp and four sensor values.
function saveHistory() {

    // Adds the latest sensor readings to the history array.
    historyData.push({

        // Records the current date and time.
        timestamp: new Date(),

        // Saves the current battery level.
        battery: selectedRover.battery,

        // Saves the current temperature.
        temperature: selectedRover.temperature,

        // Saves the current sonar distance.
        sonar: selectedRover.sonar,

        // Saves the current rover speed.
        speed: selectedRover.speed
    });

    // Keeps only the latest 30 records.
    // Removes the oldest record when the limit is exceeded.
    if (historyData.length > 30) {
        historyData.shift();
    }
}

// ================= INITIAL TELEMETRY HISTORY =================
// Generates ten initial history records for the selected rover.
// This allows the chart to display data immediately.
function seedHistory() {

    // Gets the current timestamp in milliseconds.
    const now = Date.now();

    // Creates ten records with one-second intervals.
    for (let i = 9; i >= 0; i--) {

        // Adds an initial sensor reading to the history array.
        historyData.push({

            // Creates timestamps for the previous ten seconds.
            timestamp: new Date(now - i * 1000),

            // Uses the rover's current battery value.
            battery: selectedRover.battery,

            // Uses the rover's current temperature.
            temperature: selectedRover.temperature,

            // Uses the rover's current sonar distance.
            sonar: selectedRover.sonar,

            // Uses the rover's current speed.
            speed: selectedRover.speed
        });
    }
}

// ================= TELEMETRY CHART =================
// Draws the sensor history graph using the HTML Canvas element.
// The selected metric determines which sensor values are plotted.
function drawChart() {

    // Finds the canvas element in the HTML.
    const canvas = document.getElementById("telemetry-chart");

    // Stops execution if the canvas does not exist.
    if (!canvas) return;

    // Gets the 2D drawing context of the canvas.
    const ctx = canvas.getContext("2d");

    // Gets the actual displayed width and height of the canvas.
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Stops execution if the canvas has no visible size.
    if (!width || !height) return;

    // Gets the device pixel ratio for sharper chart rendering.
    const dpr = window.devicePixelRatio || 1;

    // Sets the internal canvas resolution.
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    // Adjusts the drawing scale for high-resolution displays.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clears the previous chart.
    ctx.clearRect(0, 0, width, height);

    // Gets the selected sensor metric from the dropdown.
    const metric = document.getElementById("metric-select").value;

    // Extracts the selected sensor values from historyData.
    const values = historyData.map(item => item[metric]);

    // A line chart requires at least two data points.
    if (values.length < 2) return;

    // Defines the chart margins.
    const left = 55, right = 15, top = 20, bottom = 55;

    // Calculates the available graph drawing area.
    const graphWidth = width - left - right;
    const graphHeight = height - top - bottom;

    // Calculates the maximum and minimum sensor values.
    const maxValue = Math.max(...values) * 1.2 || 1;
    const minValue = Math.min(0, ...values);

    // Calculates the total range of sensor values.
    const range = maxValue - minValue || 1;

    // Sets the font and colours used for chart labels and grid lines.
    ctx.font = "11px Arial";
    ctx.textAlign = "right";
    ctx.fillStyle = "#9ca3af";
    ctx.strokeStyle = "rgba(255,255,255,0.15)";

    // -------- DRAW CHART GRID AND Y-AXIS LABELS --------
    // Draws six horizontal grid lines.
    for (let i = 0; i <= 5; i++) {

        // Calculates the vertical position of each grid line.
        const y = top + (graphHeight / 5) * i;

        // Calculates the sensor value for the Y-axis label.
        const value = maxValue - (range / 5) * i;

        // Draws the horizontal grid line.
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(width - right, y);
        ctx.stroke();

        // Displays the corresponding numerical value.
        ctx.fillText(value.toFixed(0), left - 8, y + 4);
    }

    // -------- DRAW SENSOR LINE GRAPH --------
    // Sets the line colour and thickness.
    ctx.beginPath();
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;

    // Connects all sensor data points with straight lines.
    values.forEach((value, index) => {

        // Calculates the horizontal position of each data point.
        const x = left + (index / (values.length - 1)) * graphWidth;

        // Calculates the vertical position using the sensor value.
        const y = top + ((maxValue - value) / range) * graphHeight;

        // Moves to the first point.
        // Connects all remaining points using lines.
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    // Draws the completed line.
    ctx.stroke();

    // -------- DRAW DATA POINTS --------
    // Draws a small circle at every sensor reading.
    values.forEach((value, index) => {

        // Calculates the X-coordinate.
        const x = left + (index / (values.length - 1)) * graphWidth;

        // Calculates the Y-coordinate.
        const y = top + ((maxValue - value) / range) * graphHeight;

        // Creates a circular data point.
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);

        // Sets the data point colour.
        ctx.fillStyle = "#38bdf8";

        // Fills the circle.
        ctx.fill();
    });

    // -------- DRAW TIME LABELS ON X-AXIS --------
    // Displays three time labels:
    // First reading, middle reading and latest reading.
    ctx.textAlign = "center";
    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px Arial";

    [0, Math.floor((values.length - 1) / 2), values.length - 1].forEach(index => {

        // Calculates the horizontal position of the time label.
        const x = left + (index / (values.length - 1)) * graphWidth;

        // Converts the saved timestamp into readable time.
        const time = historyData[index].timestamp.toLocaleTimeString();

        // Displays the time below the graph.
        ctx.fillText(time, x, height - 20);
    });
}

// ================= CHART CONTROLS =================
// Redraws the telemetry chart whenever the selected metric changes.
document.getElementById("metric-select")
    .addEventListener("change", drawChart);

// Redraws the chart whenever the browser window is resized.
window.addEventListener("resize", drawChart);

// ================= SYSTEM ALERTS =================
// Checks all rover sensor readings and generates warning messages.
// Alerts are generated for low battery, high temperature and nearby obstacles.
function renderAlerts() {

    // Finds the alert container in the HTML.
    const container = document.getElementById("alert-list");

    // Creates an empty array to store warning messages.
    const messages = [];

    // Checks each rover for abnormal sensor conditions.
    rovers.forEach(rover => {

        // Generates a warning if battery is below 25%.
        if (rover.battery < 25) {
            messages.push(
                `<div class="alert warning">⚠ ${rover.id}: Low battery (${rover.battery.toFixed(0)}%).</div>`
            );
        }

        // Generates a warning if temperature exceeds 40°C.
        if (rover.temperature > 40) {
            messages.push(
                `<div class="alert warning">⚠ ${rover.id}: High temperature (${rover.temperature.toFixed(1)}°C).</div>`
            );
        }

        // Generates a warning if an obstacle is closer than 50 cm.
        if (rover.sonar < 50) {
            messages.push(
                `<div class="alert warning">⚠ ${rover.id}: Nearby obstacle detected.</div>`
            );
        }
    });

    // Displays the total number of active alerts.
    document.getElementById("alert-count").textContent = messages.length;

    // Displays warning messages.
    // If no warnings exist, displays a normal status message.
    container.innerHTML = messages.length
        ? messages.join("")
        : '<p class="empty-message">No active alerts.</p>';
}

// ================= ROVER DATA SIMULATION =================
// Simulates changing sensor readings for every online rover.
// This function runs automatically every two seconds.
function simulateRoverData() {

    // Updates the sensor readings of every rover.
    rovers.forEach(rover => {

        // Skips rovers that are not online.
        if (rover.status !== "Online") return;

        // Gradually decreases battery level.
        rover.battery = Math.max(0, rover.battery - Math.random() * 0.15);

        // Randomly changes temperature within the 25°C to 55°C range.
        rover.temperature = Math.max(
            25,
            Math.min(55, rover.temperature + (Math.random() - 0.5) * 0.8)
        );

        // Randomly changes sonar distance between 20 cm and 250 cm.
        rover.sonar = Math.max(
            20,
            Math.min(250, rover.sonar + (Math.random() - 0.5) * 12)
        );

        // Randomly changes rover speed between 0 and 2.5 m/s.
        rover.speed = Math.max(
            0,
            Math.min(2.5, rover.speed + (Math.random() - 0.5) * 0.15)
        );

        // Calculates additional distance travelled during this interval.
        // Divides speed by 3600 to convert seconds into hours.
        rover.distance += rover.speed / 3600;
    });

    // Refreshes all dashboard statistics.
    updateDashboard();

    // Saves the latest sensor readings in telemetry history.
    saveHistory();

    // Redraws the telemetry chart with updated values.
    drawChart();

    // Checks and refreshes system alerts.
    renderAlerts();

}

// ================= AUTOMATIC DATA UPDATES =================
// Calls simulateRoverData every 2000 milliseconds (2 seconds).
// This creates continuous simulated rover monitoring.
setInterval(simulateRoverData, 2000);

// ================= MISSION DISPATCH =================
// Finds the mission popup element in the HTML.
const modal = document.getElementById("dispatch-modal");

// ================= OPEN MISSION POPUP =================
// Opens the mission dispatch popup.
// Also loads all available rover options into the dropdown.
function openMissionModal() {

    // Finds the rover selection dropdown.
    const select = document.getElementById("dispatch-rover");

    // Clears previously loaded dropdown options.
    select.innerHTML = "";

    // Adds every rover to the selection dropdown.
    rovers.forEach(rover => {

        // Creates a new dropdown option.
        const option = document.createElement("option");

        // Uses rover ID as the option value.
        option.value = rover.id;

        // Displays rover ID and its current zone.
        option.textContent = `${rover.id} - ${rover.zone}`;

        // Adds the option to the dropdown.
        select.appendChild(option);
    });

    // Clears any previous mission message.
    document.getElementById("mission-message").textContent = "";

    // Adds the open class to display the popup.
    modal.classList.add("open");
}

// ================= CLOSE MISSION POPUP =================
// Closes the mission dispatch popup by removing its open class.
function closeMissionModal() {

    // Hides the popup.
    modal.classList.remove("open");
}

// ================= MISSION POPUP EVENTS =================
// Opens the popup when the Dispatch Mission button is clicked.
document.getElementById("dispatch-open")
    .addEventListener("click", openMissionModal);

// Closes the popup when the close button is clicked.
document.getElementById("dispatch-close")
    .addEventListener("click", closeMissionModal);

// Closes the popup when the user clicks outside the popup box.
modal.addEventListener("click", event => {

    // Checks whether the clicked element is the popup background.
    if (event.target === modal) {
        closeMissionModal();
    }
});

// ================= CONFIRM MISSION =================
// Validates mission details and assigns the destination to the selected rover.
document.getElementById("mission-submit").addEventListener("click", () => {

    // Finds the rover selected in the dropdown.
    const rover = rovers.find(
        item => item.id === document.getElementById("dispatch-rover").value
    );

    // Gets the selected destination.
    const destination = document.getElementById("destination").value;

    // Gets the mission description and removes extra spaces.
    const description = document.getElementById("mission-description").value.trim();

    // Finds the message element used to display mission feedback.
    const message = document.getElementById("mission-message");

    // Checks whether all required mission details are entered.
    if (!rover || !destination || !description) {

        // Displays an error message if details are missing.
        message.textContent = "Please complete all mission details.";
        return;
    }

    // Checks whether the selected rover is online and has sufficient battery.
    if (rover.status !== "Online" || rover.battery < 15) {

        // Displays an error if the rover cannot accept the mission.
        message.textContent = "Selected rover is unavailable or has low battery.";
        return;
    }

    // Updates the rover's current zone to the selected destination.
    rover.zone = destination;

    // Changes the confirmation message colour to green.
    message.style.color = "#39d6a0";

    // Displays the successful mission assignment message.
    message.textContent = `Mission assigned successfully to ${rover.id}.`;

    // Refreshes the dashboard with the updated rover location.
    updateDashboard();

    // Automatically closes the popup after 1.2 seconds.
    setTimeout(closeMissionModal, 1200);
});

// ================= SEARCH =================
// Updates the fleet table whenever the user types in the search box.
document.getElementById("rover-search")
    .addEventListener("input", renderFleet);

// ================= PROJECT INITIALIZATION =================
// Starts the NETRA dashboard when the page loads.
// Initializes telemetry history, rover information, alerts and chart.
function startNETRA() {

    // Creates the initial ten telemetry history records.
    seedHistory();

    // Displays the initial dashboard statistics and fleet information.
    updateDashboard();

    // Checks the initial rover sensor readings and displays alerts.
    renderAlerts();

    // Draws the initial telemetry chart.
    drawChart();
}

// ================= WINDOW EVENTS =================
// Starts the NETRA dashboard after the page finishes loading.
window.addEventListener("load", startNETRA);
