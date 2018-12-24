<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Westfield Giftcard Checker</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-container>
      <v-content>
        <BalanceChecker/>
      </v-content>
    </v-container>
  </v-app>
</template>

<script>
import BalanceChecker from "./components/BalanceChecker";

export default {
  name: "App",
  components: {
    BalanceChecker
  },
  data() {
    return {
      //
    };
  }
};
</script>
