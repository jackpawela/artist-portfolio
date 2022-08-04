<template>
  <div id='app'>

    <WalletSelect
      @viewProfile='viewProfile'
    />

    <div style='height: 50px;'></div>

    <!-- Search field -->
    <div class='label-container'>
      <label class='search_input'>

        <input
          placeholder=' '
          value='inputAddress'
          v-model="inputAddress"
          v-on:keyup.enter="ensRequestKey++"
        />

        <span class='placeholder'>ETH Wallet or ENS Domain</span>

        <!-- Search button -->
        <!-- incrementing walletInfoRequest key forces re-render -->
        <button
          class='search-button'
          @click="ensRequestKey++"
        >
        Search
        </button>

        <span class='error-message' aria-live='polite'>{{ invalidAddress }}</span>


      </label>
    </div>


    <EnsRequest 
      v-if="inputAddress && ensRequestKey"
      :inputAddress="inputAddress"
      @resolved='setName'
      :key='ensRequestKey'
    />

    <!-- check input validity -->
    <div
      v-if="!invalidAddress && address"
    >



      <!-- display minted nft metadata, request ens name -->
      <walletInfoRequest
        v-if="address && walletRequestKey"
        :address="address"
        :ensName="ensName"
        :key='walletRequestKey'
      />

    </div>

    <h1 v-if="ensRequestKey==0">Find your favorite digital art creator</h1>

  </div>
</template>

<script>
// components
import walletInfoRequest from './components/walletInfoRequest.vue';
import EnsRequest from './components/EnsRequest.vue';
import WalletSelect from './components/WalletSelect.vue';


// app parameters & methods
export default {
  name: 'App',

  components: {
    walletInfoRequest,
    EnsRequest,
    WalletSelect,
  },

  data() {
    return {
      inputAddress: '', // search input
      address: '', // ethereum wallet address
      ensName: '', // ENS domain
      ensRequestKey: 0, // increment to force re-render of EnsRequest
      walletRequestKey: 0, // increment to force re-render of walletInfoRequest
      invalidAddress: '', // error message if address is invalid
    };
  },

  methods: {
    async initializeMoralis() {
      const serverUrl = 'https://ydsmu57gaxby.usemoralis.com:2053/server';
      const appId = 'Ynn3zc2b1mOtVCEZdiIgtZvzv7AnsocmBU2qAjro';
      const masterKey = 'KaMQa7faTvj9KEjdELrJ6X9WlFdd529Aa0nGgT5l';
      await this.$moralis.start({ serverUrl, appId, masterKey });
      console.log(this.$moralis);
    },

    setName(name,address) {
      this.ensName = name;
      this.address = address;
      if(this.address == 'invalid') {
        this.invalidAddress = 'Invalid search criteria, please try again';
      } else {
        this.invalidAddress = ''; // resets error on new valid search
      }
      this.walletRequestKey++; // forces re-render of walletInfoRequest component
    },

    viewProfile() {
      this.inputAddress = this.$moralis.User.current().get('ethAddress');
      this.ensRequestKey++;
      this.walletRequestKey++;
    },
  },

  created() {
    this.initializeMoralis();
  },


}
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.label-container {
  width: 350px;
  margin-left: calc(50% - 175px);
}

.search_input {
  font-size: 14px;
  position: relative;
  --field-padding: 12px;
  border-top: 20px solid transparent;
  margin-bottom: 24px;
}

.search_input input {
  border: none;
  -webkit-appearance: none;
  -ms-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: #f2f2f2;
  padding: 12px;
  border-radius: 3px;
  width: 250px;
  font-size: 14px;
  padding: var(--field-padding);
}

.search_input input:not(:placeholder-shown) + .placeholder {
  top: -10px;
  font-size: 10px;
  color: #222;
}

.search_input input:focus + .placeholder {
  top: -10px;
  font-size: 10px;
  color: #222;
}

.search_input .placeholder {
  text-align: left;
  position: absolute;
  left: 12px;
  bottom: 50%;
  top: 22px;
  height: 40px;
  transform: translateY(-50%);
  color: #aaa;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  left: var(--field-padding);
  width: calc(250px - (var(--field-padding) * 2));
  transition:
    top 0.3s ease,
    color 0.3s ease,
    font-size 0.3s ease;
}

.search_input .error-message {
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 12px;
  background: #d30909;
  color: #fff;
  height: 24px;
  width: 100%;
}

.search_input .error-message:empty {
  opacity: 0;
}

.search_input .search-button {
  width: 100px;
  height: 40px;
  border-radius: 3px;
  border: none;
  font-size: 14px;
  color: white;
}


</style>
