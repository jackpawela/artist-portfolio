<template>
  <div id='EditProfile'>
    <h2>Edit Profile</h2>

    <div class='input-container'>

      <label for='name'>Name</label>
      <input
        id='name'
        value='name'
        v-model='name'
        v-on:keyup.enter='setUserInfo'
      />
 
      <label for='url'>Custom URL</label>
      <input
        id='url'
        value='urlInput'
        v-model='urlInput'
        @keyup='checkUrl'
        v-on:keyup.enter='setUserInfo'
      />
      <div id='url-availability' v-if='urlInput'>
        <p v-if='urlAvailable'>{{ urlInput }} is available!</p>
        <p v-else>{{ urlInput }} is not available. Please try another.</p>
      </div>


      <label for='email'>Email Address</label>
      <input
        id='email'
        value='email'
        v-model='email'
        v-on:keyup.enter='setUserInfo'
      />

      <button
        @click='setUserInfo'
      >Save Changes</button>
    </div>

  </div>
</template>

<script>


export default {
  name: 'EditProfile',

  data() {
    return {
      urlInput: '',
      email: '',
      name: '',
      urlAvailable: true,
    };
  },
  
  methods: {

    async getUserInfo() {
      const user = this.$moralis.User.current();
      this.urlInput = await user.get('customUrl');
      this.email = await user.get('email');
      this.name = await user.get('name');
    },

    async setUserInfo() {
      // temporary value to reference user
      const user = this.$moralis.User.current();


      // verify user is signed in
      if(user) {

        // set name
        user.set('name', this.name);

        // set email
        user.set('email', this.email);

        // set url
        user.set('customUrl', this.urlInput);


      // alert for not signed in
      } else {
        alert('not signed in');
      }

      //save user info
      await user.save();
    },

    async checkUrl() {
      const user = this.$moralis.User.current();

      const oldUrl = user.get('customUrl');

      // URL already registered to user
      if(this.urlInput == oldUrl) {
        this.urlAvailable = true;
        return;
      }

      const users = this.$moralis.Object.extend('_User');
      const query = new this.$moralis.Query(users);
      query.equalTo('customUrl', this.urlInput);
        let results = await query.find({ useMasterKey: true });
      console.log(this.urlInput);
      console.log(results);
      // URL not registered
      if(results.length>0) {
        this.urlAvailable = false;
      } else {
        this.urlAvailable = true;
      }
    },

  },

  created() {
    this.getUserInfo();
  },
}

</script>


<style scoped>

div.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

input {
  width: 300px;
  margin-bottom: 20px;
}

</style>
