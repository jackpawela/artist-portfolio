<template>
  <div id='WalletSelect'>

    <!-- wallet connection button -->
    <div class='wallet-connect-icon'>
      <button
        class='wallet-connect-icon'
        v-if='!wallet'
        @click='popupOn=true'
      >Connect Wallet</button>
      
      <div
        v-else
        class='connection-details'
        @click='viewProfile'
      >
        <span style='font-weight: bold; margin-left: 15px;'>0x</span>
        <span class='wallet-details'>{{ wallet }}</span>
      </div>

    </div>

    <!-- wallet selection popup -->
    <div
      class='selection-popup'
      v-if='popupOn'
    >

      <div
        class='popup-background'
        @click='popupOn=false; walletConnectOn=false; metamaskOn=false'
      ></div>

      <div class='popup-foreground'>
        <h1>Select A Wallet</h1>
        
        <div class='buttons-container'>

          <!-- MetaMask button -->
          <button
            id='metamask-button'
            class='connect-button'
            @click='popupOn=false; authenticateMetamask()'
          >
            <div class='connect-button-container'>
              <span>MetaMask</span>
              <img src='https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg' />
            </div>
          </button>

          <!-- WalletConnect button -->
          <button
            id='walletconnect-button'
            class='connect-button'
            @click='popupOn=false; authenticateWalletConnect()'
          >
            <div class='connect-button-container'>
              <span>WalletConnect</span>
              <img src='https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/492d95c038bbcde1517cab5fb90ed4514690e919/svg/original/walletconnect-logo.svg' />
            </div>
          </button>
        </div>

      </div>

    </div>

  </div>
</template>


<script>

// components

export default {
  name: 'WalletSelect',

  components: {
  },

  data() {
    return {
      popupOn: false,
      wallet: '',
      walletConnectKey: 1,

      walletConnectData: {
        accounts: [],
        chainId: '',
      },

      metamaskData: { },
    };
  },

  methods: {

    viewProfile() {
      if(this.$moralis.User.current()) {
        this.$emit('viewProfile');
      } else {
        this.wallet = '';
      }
    },

    async authenticateMetamask() {
      await this.$moralis.authenticate();
      if(this.$moralis.User.current()) {
        this.wallet = this.$moralis.User.current().get('ethAddress');
      }
    },

    async authenticateWalletConnect() {
      await this.$moralis.authenticate({ provider: 'walletconnect' })
      if(this.$moralis.User.current()) {
        this.wallet = this.$moralis.User.current().get('ethAddress');
      }
    },

  },

  created() {

  },
}

</script>

<style scoped>

img {
  width: 35px;
}

div.wallet-connect-icon {
  margin-left: 70vw;
}

button {
  cursor: pointer;
}

button.wallet-connect-icon {
  padding: 15px 20px;
  border-radius: 10px;
  border: 0;
  background-color: black;
  color: white;
  font-size: 15px;
  font-weight: bold;
}

div.popup-foreground {
  position: absolute;
  width: 440px;
  height: 500px;
  border: 2px solid black;
  margin: 0 calc(50vw - 220px);
  z-index: 2;
  background-color: white;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 48px;
}

div.popup-background {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
  background-color: black;
  opacity: 30%;
  z-index: 1;
}

div.button-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

button.connect-button {
  height: 60px;
  border-radius: 12px;
  border: 0;
  margin-bottom: 20px;
  width: 100%;
}

#metamask-button {
  background-image: linear-gradient(267.54deg, rgb(255, 220, 36) 1.63%, rgb(255, 92, 0) 98.05%);
}

#walletconnect-button {
  background-image: linear-gradient(267.56deg, rgb(5, 0, 255) 0%, rgb(143, 0, 255) 97.07%);
}

.connect-button-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px;
  font-size: 16px;
  color: white;
  font-weight: bold;
}

div.connection-details {
  background-color: black;
  border-radius: 12px;
  height: 50px;
  width: 200px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

span.wallet-details {
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  margin-right: 15px;
  direction: rtl;
}

</style>
