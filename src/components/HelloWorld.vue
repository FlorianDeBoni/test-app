<template>
  <div id="app">
    <h1>TIC TAC TOE</h1>
    <br />
    <div>Number of players connected: {{ numberPlayers }}</div>
    <br />
    <div>ID of this player: {{ idPlayer }}</div>
    <br>
    <div id="game-container" v-show="numberPlayers>=2">
        <button
          v-for="(cell, index) in 9"
          :key="index"
          @click="handleClick(Math.floor(index / 3), index % 3)"
          class="cell"
          :class="getCellClass(Math.floor(index / 3), index % 3)"
        >
          {{ getCellContent(Math.floor(index / 3), index % 3) }}
        </button>
      </div>
      <br>
      <div v-if="currentPlayer=='X'">Turn of player 1 ("X")</div>
      <div v-else>Turn of player 2 ("O")</div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      idPlayer: 0,
      numberPlayers: 0,
      socket: null,
      grid: [ [null, null, null],
              [null, null, null],
              [null, null, null]], // 3x3 grid initialized to null
      currentPlayer: "X", // Start with "X"
    };
  },
  created() {
    // WebSocket connection setup
    this.socket = new WebSocket("ws://localhost:8081");

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "number of players":
          this.idPlayer = data.id;
          this.numberPlayers = data.players;
          break;
        case "action":
          this.grid[data.row][data.col]=data.player;        
          if (data.player=="X") this.currentPlayer="O";
          else this.currentPlayer="X";
          break;
        case "end game":
          if (data.win!==null) {
            alert(`${data.win} player wins!`);
          }
          else alert("Rage quit occured");
          this.grid = [ [null, null, null],
              [null, null, null],
              [null, null, null]];
          break;
        default:
          console.log("wrong type");
          console.log(data);
      }
    };

    this.socket.onopen = () => {
      console.log("Player connected");
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };
  },
  methods: {
    checkWin() {
        // Check rows
        for (let row = 0; row < 3; row++) {
          if (
            this.grid[row][0] &&
            this.grid[row][0] === this.grid[row][1] &&
            this.grid[row][1] === this.grid[row][2]
          ) {
            return this.grid[row][0]; // Return the winning symbol ("X" or "O")
          }
        }

        // Check columns
        for (let col = 0; col < 3; col++) {
          if (
            this.grid[0][col] &&
            this.grid[0][col] === this.grid[1][col] &&
            this.grid[1][col] === this.grid[2][col]
          ) {
            return this.grid[0][col]; // Return the winning symbol
          }
        }

        // Check diagonals
        if (
          this.grid[0][0] &&
          this.grid[0][0] === this.grid[1][1] &&
          this.grid[1][1] === this.grid[2][2]
        ) {
          return this.grid[0][0]; // Return the winning symbol
        }
        if (
          this.grid[0][2] &&
          this.grid[0][2] === this.grid[1][1] &&
          this.grid[1][1] === this.grid[2][0]
        ) {
          return this.grid[0][2]; // Return the winning symbol
        }

        return null; // No winner yet
      },
    handleClick(row, col) {
      if (!this.grid[row][col]) {
        if ((this.currentPlayer === "X") && (this.idPlayer === 1)) {
          this.grid[row][col] = this.currentPlayer;
          this.currentPlayer = "O";
          const message = {"type":"action", "player":"X", "row":row, "col": col};
          this.socket.send(JSON.stringify(message));
        }
        else if ((this.currentPlayer === "O") && (this.idPlayer === 2)) {
          this.grid[row][col] = this.currentPlayer;
          this.currentPlayer = "X";
          const message = {"type":"action", "player":"O", "row":row, "col": col};
          this.socket.send(JSON.stringify(message));
        }
        const win = this.checkWin();
        if (win!==null) {
            const message = {type:"end game", win:win};
            this.socket.send(JSON.stringify(message));
        }
      }
    },
    getCellContent(row, col) {
      return this.grid[row][col]; // Returns "X", "O", or null
    },
    getCellClass(row, col) {
      return {
        cross: this.grid[row][col] === "X",
        circle: this.grid[row][col] === "O",
      };
    },
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  margin: 0;
  text-align: center;
}

#game-container {
  display: grid;
  grid-template-columns: repeat(3, 100px); /* 3 columns of fixed size */
  grid-template-rows: repeat(3, 100px);    /* 3 rows of fixed size */
  gap: 5px;
}

.row {
  display: flex;
}

.cell {
  width: 100px;
  height: 100px;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.cell.cross {
  color: #f00;
}

.cell.circle {
  color: #00f;
}

.cell:hover {
  background-color: #f0f0f0;
  transform: scale(1.1);
}

.cell:active {
  background-color: #ccc;
}
</style>
