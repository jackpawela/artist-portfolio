<template>
  <div id='WalletConnect'>

  </div>
</template>

<script>

// WalletConnect requirements
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

export default {
  name: 'WalletConnect',

  data() {
    return {
      accounts: '',
      chainId: '',
      payload: '',
    };
  },

  methods: {

    initiateWalletConnect() {

      // create a connector
      const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org", // required
        qrcodeModal: QRCodeModal,
      });

      // check if connection is already established
      if(!connector.connected) {
        // create new session
        connector.createSession();
      }

      // Subscribe to connection events
      connector.on("connect", (error, payload) => {
        if(error) {
          throw error;
        }

        // get provided accounts and chainId
        const { accounts, chainId } = payload.params[0];
        this.accounts = accounts;
        this.chainId = chainId;
        this.$emit('updateWalletConnect', this.accounts, this.chainId);
      });

      connector.on("session_update", (error, payload) => {
        if(error) {
          throw error;
        }
      
        // get updated accounts and chainId
        const { accounts, chainId } = payload.params[0];
        this.accounts = accounts;
        this.chainId = chainId;
        this.$emit('updateWalletConnect', this.accounts, this.chainId);
      });

      connector.on("disconnect", (error, payload) => {
        if(error) {
          throw error;
        }
       
        this.accounts = '';
        this.chainId = '';
        this.$emit('updateWalletConnect', this.accounts, this.chainId);
        console.log(payload);
        // delete connector
      });
     
    },

  },

  // runs on component render
  created() {
    this.initiateWalletConnect();
  },

}
</script>

<style>


</style>
