// Global variables
const MAX_ATTENDEES = 50;
let totalAttendees = 0;
let teamCounts = { water: 0, zero: 0, power: 0 };
let attendeeList = [];

const teamNames = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables"
};

// DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greetingMessage = document.getElementById("greeting");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");

// Load from localStorage
function loadFromStorage() {
  const savedTotal = localStorage.getItem("totalAttendees");
  const savedTeams = localStorage.getItem("teamCounts");
  const savedList = localStorage.getItem("attendeeList");

  if (savedTotal) totalAttendees = parseInt(savedTotal);
  if (savedTeams) teamCounts = JSON.parse(savedTeams);
  if (savedList) attendeeList = JSON.parse(savedList);

  updateAllDisplays();
  renderAttendeeList();
}

// Save to localStorage
function saveToStorage() {
  localStorage.setItem("totalAttendees", totalAttendees);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendeeList", JSON.stringify(attendeeList));
}

// Update all displays
function updateAllDisplays() {
  // Update total count
  attendeeCountDisplay.textContent = totalAttendees;

  // Update team counts
  waterCountDisplay.textContent = teamCounts.water;
  zeroCountDisplay.textContent = teamCounts.zero;
  powerCountDisplay.textContent = teamCounts.power;

  // Update progress bar
  const percentage = (totalAttendees / MAX_ATTENDEES) * 100;
  progressBar.style.width = Math.min(percentage, 100) + "%";
}

// Show greeting message
function showGreeting(name, team) {
  const fullTeamName = teamNames[team];
  greetingMessage.textContent = `Welcome, ${name}! You're checked in with ${fullTeamName} 🎉`;
  greetingMessage.style.display = "block";
  greetingMessage.className = "success-message";

  // Hide after 4 seconds
  setTimeout(() => {
    greetingMessage.style.display = "none";
  }, 4000);
}

// Check for celebration
function checkCelebration() {
  if (totalAttendees >= MAX_ATTENDEES) {
    // Find winning team
    const winningTeam = Object.keys(teamCounts).reduce((a, b) =>
      teamCounts[a] > teamCounts[b] ? a : b
    );
    const winningTeamName = teamNames[winningTeam];

    greetingMessage.textContent = `🎉🎊 GOAL REACHED! ${winningTeamName} wins with ${teamCounts[winningTeam]} attendees! 🏆`;
    greetingMessage.style.display = "block";
    greetingMessage.className = "success-message";
  }
}

// Render attendee list
function renderAttendeeList() {
  // Remove existing list
  let existingList = document.querySelector(".attendee-list-container");
  if (existingList) existingList.remove();

  if (attendeeList.length === 0) return;

  // Create list container
  const listContainer = document.createElement("div");
  listContainer.className = "attendee-list-container";
  listContainer.innerHTML = `
    <h3>Checked-In Attendees</h3>
    <div class="attendee-list"></div>
  `;

  const list = listContainer.querySelector(".attendee-list");

  // Add each attendee
  attendeeList.forEach((attendee) => {
    const item = document.createElement("div");
    item.className = "attendee-item";
    item.innerHTML = `
      <span class="attendee-name">${attendee.name}</span>
      <span class="attendee-team">${teamNames[attendee.team]}</span>
    `;
    list.appendChild(item);
  });

  // Insert after team-stats
  const teamStats = document.querySelector(".team-stats");
  teamStats.parentNode.insertBefore(listContainer, teamStats.nextSibling);
}

// Handle form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get values
  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) return;

  // Increment counts
  totalAttendees++;
  teamCounts[team]++;

  // Add to attendee list
  attendeeList.push({ name, team });

  // Update displays
  updateAllDisplays();
  showGreeting(name, team);
  checkCelebration();
  renderAttendeeList();

  // Save to localStorage
  saveToStorage();

  // Reset form
  form.reset();
});

// Load data when page loads
loadFromStorage();
