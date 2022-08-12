<template>

  <div>

    <!-- name -->
    <p
      v-if='name'
    >{{ name }}</p>

    <!-- twitter -->
    <a
      v-if='twitter'
      :href='`https://twitter.com/${twitter}`'
      target='_blank'
      >{{ twitter }}</a>

    <br />

    <!-- website -->
    <a
      v-if='website'
      :href='website'
      target='_blank'
    >{{ website }}</a>

    <!-- discord -->
    <p
      v-if='discord'
    >{{ discord }}</p>

    <!-- description -->
    <p
      v-if='description'
    >{{ description }}</p>
  </div>

</template>


<script>
// ethers dependency
import { ethers } from 'ethers';

export default {
  name: 'CreatorInfo',

  props: ['ensName'],

  data() {
    return {
      twitter: '',
      website: '',
      discord: '',
      description: '',
      name: '',
    }
  },

  methods: {
    async getCreatorInfo() {
      try {
        const provider = new ethers.providers.CloudflareProvider();
        //change to this.name
        const resolver = await provider.getResolver(this.ensName);

        this.twitter = await resolver.getText('com.twitter');
        this.website = await resolver.getText('url');
        this.description = await resolver.getText('description');
        this.name = await resolver.getText('name');
        this.discord = await resolver.getText('com.discord');

        if(!this.twitter) {
          this.twitter = await resolver.getText('vnd.twitter');
        }

        if(this.twitter.slice(0,1) !== '@') {
          this.twitter = '@' + this.twitter;
        }
      } catch(error) {
        console.log(error);
      }

    }

  },
  
  created() {
    this.getCreatorInfo();
  },
}


</script>


<style>

a {
  font-size: 20px;
}

</style>
