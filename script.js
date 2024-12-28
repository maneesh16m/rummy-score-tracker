const maxPlayers = 7;
let players = [];
let rounds = 0;

const tableBody = document.querySelector("#scoreTable tbody");
const tableHeader = document.querySelector("#scoreTable thead tr");
const addPlayerButton = document.getElementById("addPlayer");
const addRoundButton = document.getElementById("addRound");
const clearDataButton = document.getElementById("clearData");

// Add a new player
addPlayerButton.addEventListener("click", () => {
  if (players.length >= maxPlayers) {
    alert("Maximum 7 players allowed.");
    return;
  }
  const playerName = prompt("Enter player name:");
  if (playerName) {
    players.push({ name: playerName, scores: Array(rounds).fill(0), reEntries: 0 });
    updateTable();
  }
});

// Add a new round
addRoundButton.addEventListener("click", () => {
  rounds++;
  players.forEach(player => player.scores.push(0)); // Add a score of 0 for the new round

  // Add a new column to the table header for the new round
  const roundHeader = document.createElement("th");
  roundHeader.textContent = `Round ${rounds}`;
  roundHeader.classList.add("roundColumn"); // Add class for uniform width
  tableHeader.appendChild(roundHeader);
  updateTable();
});

// Clear all data
clearDataButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all data?")) {
    players = [];
    rounds = 0;

    // Reset table header
    tableHeader.innerHTML = "";
    updateTable();
    localStorage.removeItem("rummyScores");
  }
});

// Update the table display
function updateTable() {
  // Reset table header
  tableHeader.innerHTML = `<th class="sticky">Names</th>`;
  for (let i = 1; i <= rounds; i++) {
    const roundHeader = document.createElement("th");
    roundHeader.textContent = `Round ${i}`;
    roundHeader.classList.add("roundColumn"); // Assign class for uniform width
    tableHeader.appendChild(roundHeader);
  }
  const totalHeader = document.createElement("th");
  totalHeader.textContent = "Total";
  totalHeader.classList.add("totalColumn"); // Assign class for uniform width
  tableHeader.appendChild(totalHeader);

  tableHeader.innerHTML += `<th>Actions</th>`;

  tableBody.innerHTML = "";

  players.forEach((player, index) => {
    const totalScore = player.scores.reduce((sum, score) => sum + score, 0);
    const row = document.createElement("tr");

    // Player name with re-entries
    const nameCell = document.createElement("td");
    nameCell.textContent = `${player.name} ${player.reEntries > 0 ? `(${ '*'.repeat(player.reEntries)})` : ''}`;
    row.appendChild(nameCell);

    // Scores per round
    player.scores.forEach((score, i) => {
      const scoreCell = document.createElement("td");
      scoreCell.classList.add("roundColumn"); // Assign class for uniform width
      const scoreInput = document.createElement("input");
      scoreInput.type = "number";
      scoreInput.value = score;
      scoreInput.min = "0";
      scoreInput.className = "scoreInput";

      scoreInput.addEventListener("input", (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 0) {
          player.scores[i] = value;
          row.querySelector(".totalCell").textContent = player.scores.reduce((sum, score) => sum + score, 0);
          saveData();
        } else {
          event.target.value = player.scores[i];
        }
      });

      scoreCell.appendChild(scoreInput);
      row.appendChild(scoreCell);
    });

    // Total score
    const totalCell = document.createElement("td");
    totalCell.className = "totalCell totalColumn"; // Assign class for uniform width
    totalCell.textContent = totalScore;
    row.appendChild(totalCell);

    // Actions column
    const actionsCell = document.createElement("td");
    const reEnterButton = document.createElement("button");
    reEnterButton.textContent = "Re-Enter";
    reEnterButton.className = "reEnterButton";
    reEnterButton.addEventListener("click", () => {
      player.scores = player.scores.map(() => 0);
      player.reEntries++;
      updateTable();
    });
    actionsCell.appendChild(reEnterButton);
    row.appendChild(actionsCell);

    tableBody.appendChild(row);
  });

  saveData();
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("rummyScores", JSON.stringify({ players, rounds }));
}

// Load data from localStorage
function loadData() {
  const data = JSON.parse(localStorage.getItem("rummyScores"));
  if (data) {
    players = data.players;
    rounds = data.rounds;
    updateTable();
  }
}

// Initialize
loadData();