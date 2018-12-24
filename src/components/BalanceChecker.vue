<template>
  <div>
    <div class="mb-4">
      <div class="mb-3">
        <h2>Gift card number</h2>
        <v-layout row grid-list-md>
          <v-flex sm3>
            <v-text-field value="502119" disabled/>
          </v-flex>
          <v-flex sm3>
            <v-text-field
              ref="num1"
              type="tel"
              placeholder="XXXX"
              v-model="num1"
              @input="onNumInput($event, 'num2')"
              @keypress="isNumberKey($event)"
            />
          </v-flex>
          <v-flex sm3>
            <v-text-field
              ref="num2"
              type="tel"
              placeholder="XXXX"
              v-model="num2"
              @input="onNumInput($event, 'num3')"
              @keypress="isNumberKey($event)"
            />
          </v-flex>
          <v-flex sm3>
            <v-text-field
              ref="num3"
              type="tel"
              placeholder="XXXX"
              v-model="num3"
              @input="onNumInput($event, 'refNum')"
              @keypress="isNumberKey($event)"
            />
          </v-flex>
        </v-layout>
      </div>
      <div class="mb-3">
        <h2>Ref number</h2>
        <v-text-field
          ref="refNum"
          type="tel"
          placeholder="XXXX"
          v-model="refNum"
          @keypress="onNumInput($event, 'btnSave')"
        />
      </div>
      <v-btn color="success" ref="btnSave" @click="onSave" class="mx-0">Save</v-btn>
    </div>
    <section>
      <h2>List</h2>
      <div>
        <v-layout class="mb-3" column :key="numObj.num" v-for="(numObj, $index) in numList">
          <v-layout>
            <div :class="`${$style.colFs} headline pr-4`">{{ numObj.spacedNum }}</div>
            <v-chip
              color="indigo"
              text-color="white"
              :class="`${$style.colFs} headline`"
            >{{ numObj.balance || '' }}</v-chip>
          </v-layout>
          <v-layout>
            <div :class="`${$style.colFs} headline`">
              <strong>Ref:</strong>
              {{ numObj.refNum }} &nbsp;
            </div>
            <div :class="`${$style.colFs} ${$style.colExpiry} headline`">
              <strong v-if="numObj.expiry">Exp:</strong>
              {{ numObj.expiry || '' }}
            </div>
          </v-layout>
          <v-layout row>
            <v-btn
              icon
              class="ml-0"
              color="info"
              title="Check"
              :disabled="isLoading.includes($index)"
              :loading="isLoading.includes($index)"
              @click="onCheck(numObj, $index)"
            >
              <v-icon>cached</v-icon>
            </v-btn>
            <v-btn
              icon
              color="error"
              title="Delete"
              :disabled="isLoading.includes($index)"
              @click="onDelete(numObj.num)"
            >
              <v-icon>delete</v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      num1: "",
      num2: "",
      num3: "",
      refNum: "",
      numList: [],
      isLoading: []
    };
  },
  computed: {
    num() {
      return `502119${this.num1}${this.num2}${this.num3}`.trim();
    },
    spacedNum() {
      return `502119 ${this.num1} ${this.num2} ${this.num3}`.trim();
    }
  },
  methods: {
    updateLocalStorageList() {
      localStorage.setItem("wgcList", JSON.stringify(this.numList));
    },
    onSave() {
      const { numList, num, refNum, spacedNum } = this;
      if (!this.numList.some(item => item.num == num)) {
        numList.push({
          num,
          refNum,
          spacedNum
        });
        this.updateLocalStorageList();
      }
      this.num1 = "";
      this.num2 = "";
      this.num3 = "";
      this.refNum = "";
    },
    onNumInput(val, nextFocusTarget) {
      if (val.length == 4) {
        this.$refs[nextFocusTarget].focus();
      }
    },
    isNumberKey(e) {
      var charCode = e.which ? e.which : e.keyCode;
      return !(charCode < 48 || charCode > 57);
    },
    onDelete(num) {
      const newNumList = this.numList.filter(item => item.num != num);
      this.$set(this, "numList", newNumList);
      this.updateLocalStorageList();
    },
    async onCheck(numObj, index) {
      const { num, refNum } = numObj;
      this.isLoading.push(index);
      const { data } = await axios.get(
        `https://wgc.herokuapp.com/balance/${num}/${refNum}`
      );
      this.isLoading = this.isLoading.filter(item => item != index);
      console.log(data);
      const { balance, expiry } = data;
      const newNumList = this.numList.map((item, _index) => {
        if (index != _index) return item;
        return {
          ...item,
          balance,
          expiry
        };
      });
      this.$set(this, "numList", newNumList);
      this.updateLocalStorageList();
    }
  },
  created() {
    const wgcList = localStorage.getItem("wgcList");
    if (wgcList) {
      try {
        this.numList = JSON.parse(wgcList);
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

<style lang="scss" module>
.colFs.colFs {
  @media (max-width: 767px) {
    font-size: 16px !important;
  }
}

.col {
  &Balance {
    max-width: 110px;
    flex-basis: 110px;
  }
  &Expiry {
    max-width: 112px;
    flex-basis: 112px;
  }
}
</style>
