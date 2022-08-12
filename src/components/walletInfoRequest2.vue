<template>
  <div class="hello">

    <div class='creatorInfo'>
      <h1
        v-if='ensName && ensName !== "invalid"'
      >{{ ensName }}</h1>

      <h2>Wallet Address: {{ address }}</h2>

      <CreatorInfo
        v-if="ensName"
        :ensName="ensName"
      />
    </div>


    <div class='flex'>

      <!-- display token media -->
      <div class='center-div' v-for="token in tokens" v-bind:key="token.tokenId">

        <!-- catch burned tokens -->
        <div v-if="token.nftMetadata.error !== 'Token does not exist'">

          <!-- image display -->
          <img
            v-if='token.mediaType == "image"'
            :src="token.nftMetadata.media[0].gateway"
          >

          <!-- video display -->
          <video width='320' height='240' controls
            v-else-if='token.mediaType == "video"'
          >
            <source :src='token.nftMetadata.media[0].gateway' type='video/mp4'>
            Your browser does not support the video tag.
          </video>

          <!-- no media: error message -->
          <h3 v-else-if='token.mediaType == "none"'>Media Not Found</h3>

          <!-- token name -->
          <h2 class="title">{{ token.nftMetadata.metadata.name }}</h2>

          <!-- token description -->
          <h3>{{ token.nftMetadata.description }}</h3>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
// components
import CreatorInfo from './CreatorInfo.vue';

// Web3 dependencies
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
// import { Network, initializeAlchemy } from '@alch/alchemy-sdk';

// addresses & keys
const apiKey = 'KdP80Ts57MxaQKbGfAcVeoBt76sJck-N';

// ethers dependency
import { ethers } from 'ethers';

export default {
  name: 'walletInfoRequest',

  components: {
    CreatorInfo,
  },

  props: ['address', 'ensName'],

  data() {
    return {
      tokens: [], // ERC721 & ERC1155 tokens minted by wallet
      res: [], // raw alchemy transfer
    };
  },

  methods: {
   // convert ENS address to ETH wallet address
    async ethAddressLookup(address) {
      try {
        const provider = new ethers.providers.CloudflareProvider();
        const ethWallet = await provider.resolveName(address);
        return ethWallet;
      } catch(error) {
        console.log(error);
      }
    },

   // initializes API call
    async getData() {
      try {

        // Alchemy parameters
        // nft mint events from contract
        let alchemyInfo = {
          fromAddress: '0x0000000000000000000000000000000000000000',
          toAddress: this.address,
        //  fromBlock: '',
        //  toBlock: '',
          excludeZeroValue:true,
          category: ['erc721', 'erc1155']
        }


        const web3 = createAlchemyWeb3(
          `https://eth-mainnet.alchemyapi.io/v2/${apiKey}`
        );

        this.res = await web3.alchemy.getAssetTransfers(alchemyInfo);
        
        for (const events of this.res.transfers) {

          const options = {
            address: events.rawContract.address,
          };

          console.log(await this.$moralis.Web3API.token.getAllTokenIds(options));

          let moralisNftTransfers = await this.$moralis.Web3API.token.getAllTokenIds(options);

          for (const token of moralisNftTransfers.result) {
            this.tokens.push({
              contractAddress: token.token_address,
              tokenId: token.token_id,
              tokenType: token.contract_type,
              nftMetadata: token.metadata
            });
          }

        }

        
        } catch(error) {
            console.log(error);
        }

        for (let token of this.tokens) {
            // determine media type
            let mediaTypePhrases = token.nftMetadata.media[0].gateway.split('.');
            let mediaExt = mediaTypePhrases[mediaTypePhrases.length-1];
            if(mediaExt.toUpperCase() == 'JPG' || mediaExt.toUpperCase() == 'PNG' || mediaExt.toUpperCase() == 'GIF' || mediaExt.toUpperCase() == 'SVG' || mediaExt.toUpperCase() == 'JPEG' || mediaExt.toUpperCase() == 'ICO') {
                token.mediaType = 'image';
            } else if (mediaExt.toUpperCase() == 'MP3') {
                token.mediaType = 'audio';
            } else if (mediaExt.toUpperCase() == 'MP4') {
                token.mediaType = 'video';
            } else if (!mediaExt) {
              token.mediaType = 'none';
            }

            // log token details
            console.log(token.tokenType, 'Token Minted: ID- ', token.tokenId, ' Contract- ', token.contractAddress);
            console.log('media: ', token.nftMetadata.metadata.image);
        }

    },

  },

  created() {
    this.getData();
  },


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h2.title {
  width: 200px;
  overflow-wrap: normal;
  text-align: center;
}
h3 {
  margin: 40px 0 0;
  width: 200px;
  word-break: break-word;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
img {
  height: 300px;
  margin: auto;
}

.flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
}

.center-div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.creatorInfo {
  text-align: left;
}

div.creatorInfo {
  margin: 0 0 75px 25px;
}



</style>
