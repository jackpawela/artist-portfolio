<template>
  <div id='MetaMask'>
    
    <vue-metamask
      userMessage='msg'
      @onComplete='onComplete'
    />

  </div>
</template>

<script>
// MetaMask requirements
import VueMetamask from 'vue-metamask';

export default {
  name: 'MetaMask',

  components: {
    VueMetamask,
  },

  data() {
    return {
      msg: "Metamask wallet connected",
    }
  },

  methods: {
    onComplete(data) {
      console.log('data: ', data);
      if(data.metaMaskAddress) {
        this.$emit('connectMetaMask',data);
      }
      else { this.$emit('disconnectMetaMask'); }
    }
  },

  created() {

  },
}

</script>

<style>

</style>
