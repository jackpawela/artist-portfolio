<template>

  <div>

    <h1
      v-if="!complete"
      >Loading ENS Domain...</h1>

    <h1
      v-else-if="!ensName"
      >No ENS Domain Detected</h1>
  </div>

</template>

<script>

// ethers dependency
import { ethers } from 'ethers';


export default {
  name: 'EnsRequest',

  props: ['inputAddress'],

  data() {
    return {
      ensName: '',
      address: '',
      complete: false,
    }
  },

  methods: {
    async getName() {
      try {
        const provider = new ethers.providers.CloudflareProvider();
        
        // handle Ethereum input
        if(this.inputAddress.slice(0,2) === '0x') {
          this.address = this.inputAddress;
          this.ensName = await provider.lookupAddress(this.address);

        // handle ENS input
        } else if(this.inputAddress.substr(-4) == '.eth') {
          this.ensName = this.inputAddress;
          this.address = await provider.resolveName(this.inputAddress);

        // handle invalid input
        } else {
          this.ensName = 'invalid';
          this.address = 'invalid';
        }


        this.$emit('resolved', this.ensName, this.address);
        console.log('name: ', this.ensName);
        this.complete = true;
      } catch(error) {
        console.log(error);
      }
    }
  },

  created() {
    this.getName();
  },
}

</script>


<style>


</style>
