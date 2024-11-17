<template>
  <div id="app">
    <h1>WebSocket Vue App</h1>
    <div>
      <input v-model="message" type="text" placeholder="Type a message" />
      <button @click="sendMessage">Send Message</button>
    </div>
    <div v-if="response">
      <h3>Response from Server:</h3>
      <p>{{ response }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      response: '',
      socket: null,
    };
  },
  created() {
    // Connect to the WebSocket server hosted on wss://webserver-test-myxm.onrender.com or ws://localhost:8081
    this.socket = new WebSocket('wss://webserver-test-myxm.onrender.com:8081'); 

    this.socket.onmessage = (event) => {
      // When the server sends a message back, we store it in the response variable
      this.response = event.data;
    };

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };
  },
  methods: {
    sendMessage() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        // Send the message to the server
        this.socket.send(this.message);
        this.message = ''; // Clear input after sending
      } else {
        console.log('WebSocket connection is not open');
      }
    },
  },
  beforeUnmount() {
    // Clean up WebSocket connection when the component is destroyed
    if (this.socket) {
      this.socket.close();
    }
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 50px;
  text-align: center;
}

input {
  padding: 10px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}
</style>
