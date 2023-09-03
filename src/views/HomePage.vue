<template>
  <ion-page>
    <ion-content :fullscreen="true">
        <ion-header>
            <ion-toolbar>
                <ion-title>MyFinance</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="exit">LOGOUT</ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-card>
            <ion-card-header>
                <ion-row class="ion-align-items-center">
                    <ion-col>
                        <ion-card-title>
                            Balance:
                        </ion-card-title>
                    </ion-col>
                    <ion-col class="ion-text-end">
                        <ion-card-title>
                            $ {{ totalBalance.toFixed(2) }}
                        </ion-card-title>
                    </ion-col>
                </ion-row>
            </ion-card-header>
        </ion-card>

        <ion-row>
            <ion-col>
                <ion-button expand="block" @click="openFundsModal(false)">
                    Add Income
                </ion-button>
            </ion-col>
            <ion-col>
                <ion-button color="danger" expand="block" @click="openFundsModal(true)">
                    Add Expense
                </ion-button>
            </ion-col>
        </ion-row>

        <ion-card>
        <ion-row
            v-for="(record, index) in store.records"
            :key="index"
        >
          <ion-col>
            <ion-card-title>
              {{ record.description }}
            </ion-card-title>
            <ion-card-subtitle>
              {{ record.date }}
            </ion-card-subtitle>
          </ion-col>
          <ion-col class="ion-text-end">
            <ion-card-title :class="{ 'added-funds': !record.isExpense, 'remove-funds': record.isExpense  }">
              <span v-if="!record.isExpense">+</span>
              ${{ record.value }}
            </ion-card-title>
          </ion-col>
        </ion-row>
      </ion-card>


      <ion-modal
          :is-open="isAddFundsModalOpen"
          @will-dismiss="dismiss"
          :initial-breakpoint="1"
          :breakpoints="[0, .5, 1]"
          handle-behavior="cycle"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="dismiss">X</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-input
              v-model="record.description"
              label="Description"
              label-placement="floating"
              required
          />
          <ion-input
              v-model="record.value"
              label="Amount ($)"
              type="number"
              label-placement="floating"
              required
          />
          <br>
          <ion-button
              class="ion-margin-bottom"
              expand="block"
              @click="addFunds"
          >
            Submit
          </ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>

  </ion-page>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { personOutline } from "ionicons/icons";
import { userStore } from "@/store/user.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth.ts";

const store = userStore()

const isAddFundsModalOpen = ref(false)
const isNewRecordWithExpenses = ref(false)
const authStore = useAuthStore()

const totalBalance = computed(() => {
  return store.records.reduce((sum, el) => {
    if (el.isExpense) {
      return sum - Number(el.value)
    } else {
      return sum + Number(el.value)
    }
  }, 0)
})

const openFundsModal = (isExpenses) => {
  isNewRecordWithExpenses.value = isExpenses
  isAddFundsModalOpen.value = true
}

const dismiss = () => {
  isAddFundsModalOpen.value = false;
}

const record = ref({})

const addFunds = () => {
  if (!record.value.description || !record.value.value) return
  const data = { ...record.value, date: new Date().toDateString() }
  data.isExpense = isNewRecordWithExpenses.value

  store.addRecordToStore(data)

  record.value = {}

  dismiss()
}

const router = useRouter()

const exit = async () => {
    await authStore.logout()
    await router.push({name: 'Auth'})
}

onMounted(() => {
  store.fetchDataFromDB()
})

</script>

<style scoped>
.added-funds {
    color: var(--ion-color-primary)
}
.remove-funds {
    color: var(--ion-color-danger)
}

</style>