<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="row">
    <perfect-scrollbar style="height: calc(100% - 44px);" class="col-md-8">
      <q-splitter v-model="splitterModel">

        <template v-slot:before>
          <q-tabs v-model="tab" vertical class="text-teal" dense>
            <q-tab name="cash" label="Cash" icon="fas fa-money-bill-alt" class="text-purple"
                   :alert="payments.cash > 0" :disable="processing"/>

            <q-tab name="card" label="Card" icon="fas fa-credit-card" class="text-green" disable/>

            <q-tab name="point" label="Points" icon="fas fa-comment-dollar" class="text-orange"
                   :alert="payments.points > 0" :disable="processing || !member"/>

            <q-tab name="discount" label="Discount" icon="fas fa-tags" class="text-indigo"
                   :alert="discount.value > 0" :disable="processing || !settings.options.discount"/>

            <!--                        <q-tab name="coupon" label="Coupon" icon="fas fa-ticket-alt" class="text-brown" :alert="payments.coupon.length > 0" :disable="processing"></q-tab>-->
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels v-model="tab" animated transition-prev="jump-up" transition-next="jump-up">
            <q-tab-panel name="cash" v-if="settings.options.cash">
              <div class="text-h5 q-mb-md font-2">Cash</div>
              <div class="row q-gutter-md">
                <div class="col-12">
                  <q-input autofocus outlined v-select-on-focus prefix="$" label="Amount Paid"
                           v-model="payments.cash" ref="cash_paid" @change="saveCash"
                           :loading="processing"/>
                </div>

                <div class="col-12">
                  <MoneyPad :total="paymentInfo.balance"/>
                </div>
              </div>

            </q-tab-panel>

            <q-tab-panel name="card" v-if="settings.options.card">
              <div class="text-h5 q-mb-md font-2">Card</div>
              <div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="point" v-if="settings.options.points && member">
              <div class="text-h5 q-mb-md font-2">Reward Points</div>
              <div class="redeem-points-content">
                <q-input autofocus outlined prefix="$" label="Redeem Points"
                         v-select-on-focus
                         v-model="payments.points"
                         @change="savePoints"

                         :rules="[val => validatePoints(val) || 'No points available']"
                         :loading="processing"
                />

                <div class="q-pt-md row justify-center q-gutter-xs text-center">
                  <q-card class="w-50 bg-amber" flat>
                    <q-card-section>
                      <div class="text-uppercase text-bold">Redeemed Points</div>
                      <div class="text-bold text-teal">{{ paymentSrc.points.redeemed | null2zero }} / {{ paymentSrc.points.redeemed * settings.costPerPoint | null2zero | price | currency }}</div>
                    </q-card-section>
                  </q-card>
                  <q-card class="w-50 bg-amber" flat>
                    <q-card-section>
                      <div class="text-uppercase text-bold">Balance Points</div>
                      <div class="text-bold text-teal">{{ member.rewardPoints - paymentSrc.points.redeemed | null2zero }} / {{ member.rewardPoints * settings.costPerPoint | null2zero | price | currency }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="coupon" v-if="settings.options.coupon">
              <div class="text-h5 q-mb-md font-2">Coupon</div>
              <div>
                <div class="row">
                  <div class="col-md-6">
                    <q-input autofocus outlined label="Coupon">
                      <template v-slot:append>
                        <q-icon name="fas fa-plus" class="cursor-pointer" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="discount" v-if="settings.options.discount">
              <div class="text-h5 q-mb-md font-2">Discount</div>
              <div>
                <div class="row q-gutter-md">
                  <div class="col-12">
                    <q-input autofocus outlined label="Discount"
                             v-select-on-focus
                             v-model="discount.value"
                             ref="txt_discount"

                             @change="saveDiscount"

                             :rules="[ validateDiscount ]"
                             :loading="processing"
                    >
                      <template v-slot:append>
                        <span class="cursor-pointer" @click="changeDiscountType">{{ discount.type }}</span>
                      </template>
                    </q-input>

                    <q-btn type="submit" class="hidden"/>
                  </div>
                </div>
              </div>
            </q-tab-panel>

          </q-tab-panels>
        </template>

      </q-splitter>
    </perfect-scrollbar>

    <div class="q-px-md q-py-xs col-md-4">
      <div>
        <table class="payment-info-table">
          <tr><td>Sub Total:</td><td>{{ amount.subTotal | null2zero | price }}</td></tr>
          <tr>
            <td>Discount: <span>({{ amount.discount.percent | price(1) }}%)</span></td>
            <td>- {{ amount.discount.amount | price }}</td>
          </tr>
          <tr>
            <td>Tax: <span>({{ amount.tax.percent }}% {{ amount.tax.type }})</span></td>
            <td>{{ amount.tax.amount | price }}</td>
          </tr>
        </table>
        <q-separator/>
        <table class="payment-info-table">
          <tr><td>Total:</td><td>{{ amount.grandTotal | price }}</td></tr>
          <tr><td>Round Off:</td><td>{{ amount.roundOff | price | withSign }}</td></tr>
        </table>
        <q-separator/>
        <table class="final-amount-table">
          <tr>
            <td colspan="2" class="amount-payable">
              <p class="title">TOTAL</p>
              <p class="amount">{{ amount.payableAmount | price | currency }}</p>
            </td>
          </tr>
        </table>
        <q-separator/>
        <table class="payment-paid-table">
          <tr>
            <td>PAID:</td>
            <td :class="paid_class">{{ paymentInfo.paid | price | currency }}</td>
          </tr>
          <tr>
            <td>BALANCE:</td>
            <td>{{ paymentInfo.balance | price | currency }}</td>
          </tr>
        </table>
        <q-separator/>
      </div>

      <div class="q-ma-md q-gutter-xs text-center">
        <q-btn class="btn-finish" unelevated color="teal-14" label="Finish"
               :disable="paymentInfo.paid < amount.payableAmount || amount.payableAmount === 0" @click="startFinishTrans"/>
      </div>

    </div>
  </div>
</template>

<script>
import { extend } from 'quasar'

// import TransactionView from "./Transaction/TransactionView";
import MoneyPad from "./Keyboard/MoneyPad";
import {currency, null2zero, price, withSign} from "src/filters";
import monday from "src/modals/monday";
import ui from "src/ui";
import Receipt from "components/Receipt";

export default {
  name: 'Payment',
  components: {MoneyPad},
  filters: {
    price, currency, null2zero, withSign
  },
  data () {
    return {
      paid: 0,

      splitterModel: 20,
      tab: 'cash',

      processing: false,

      payments: {
        cash: null,
        card: null,
        points: null,

        coupon: [

        ]
      },

      discount: {
        value: null,
        type: '%'
      },

      membership_available: false,
      curr_reward_points: 0,
    }
  },

  watch: {
    resetIndicator() {
      this.reset();
    }
  },

  computed: {
    paid_class() {
      return {
        paid: this.paymentInfo.paid >= this.amount.payableAmount,
      }
    },

    settings() {
      return this.$store.state.app.settings.payment
    },

    amount() {
      return this.$store.getters["order/amountInfo"];
    },

    member() {
      return this.$store.state.order.customer
    },

    delivery() {
      return this.$store.state.order.delivery;
    },

    paymentInfo() {
      return this.$store.getters["order/paymentInfo"];
    },

    items() {
      return this.$store.state.order.items;
    },

    paymentSrc() {
      return this.$store.state.order.payments;
    },

    resetIndicator() {
      return this.$store.state.app.resetIndicator;
    }
  },

  methods: {
    changeDiscountType() {
      this.discount.type = (this.discount.type === '%' ? '$' : '%');
      let old_disc = this.discount.value;

      this.discount.value = null;
      this.$nextTick(() => this.$refs.txt_discount?.$el.focus())
      if (old_disc > 0) {
        this.$nextTick(() => {
          this.saveDiscount();
        });
      }
    },

    validateDiscount(val) {
      val = !val ? 0 : val;

      if (this.discount.type === '%' ) {
        if (val < 0 || val > 100) {
          return "Please apply discount between 0 and 100";
        }
      } else {
        if (val < 0 || val > this.amount.subTotal) {
          return "Please apply discount below " + this.amount.subTotal;
        }
      }

      return true;
    },

    validatePoints(val) {
      val = !val ? 0 : val;

      return this.member.rewardPoints >= this.payments.points;
    },

    async startFinishTrans() {
      if (!this.checkDeliveryDetails()) {
        await this.$store.dispatch('app/openPage', { page: 'delivery' });
        ui.notifyError("Please provide delivery details")
        return;
      }

      if (!this.items.length) {
        await this.$store.dispatch('app/openPage', { page: 'menu' });
        ui.notifyError("Please add some items")
        return;
      }

      ui.showLoader("Order is being placed. Please wait...")
      try {
        const id = await monday.saveOrder(this.$store.state.order, this.amount, this.paymentInfo, this.member, this.$store.state.order.delivery, this.$store.getters["order/customerCurrentStatus"]);
        ui.notifySuccess("Order Placed")

        await this.$store.dispatch('order/setOrderId', id)
        await this.$store.dispatch('order/extractLastOrder')

        if (this.$store.state.app.settings.printing.autoPrintAfterFinish) {
          this.$q.dialog({
            component: Receipt,
            data: this.$store.state.data.lastOrder,
            root: this.$root,
            autoPrint: true
          });
        }

        await this.$store.dispatch('order/newOrder')
        this.$store.dispatch('app/resetApp')
      } catch(e) {
        console.log(e)
        ui.notifyError("Unable to place your order. Something went wrong.")
      }
      ui.hideLoader();
    },

    checkDeliveryDetails() {
      if (this.delivery.type === 'dineIn') return true;
      if (this.delivery.type === 'homeDelivery' && this.delivery.name && this.delivery.address && this.delivery.phone) return true;
      if (this.delivery.type === 'pickup' && this.delivery.date && this.delivery.time) return true;
      return false;
    },

    async saveDiscount() {
      if (!this.$refs.txt_discount.validate()) {
        return;
      }

      this.processing = true;
      await this.$store.dispatch('order/setDiscount', { value: +this.discount.value, type: this.discount.type })
      this.processing = false;
    },

    async saveCash() {
      this.processing = true;
      await this.$store.dispatch('order/setPayment', {type: 'cash', payment: { amount: parseFloat(this.payments.cash) }})
      this.processing = false;
    },

    async savePoints() {
      this.processing = true;
      await this.$store.dispatch('order/setPayment', {type: 'points', payment: { redeemed: parseFloat(this.payments.points), costPerPoint: parseFloat(this.settings.costPerPoint) }})
      this.processing = false;
    },

    reset() {
      this.$refs.cash_paid.focus();

      this.payments.cash = this.$store.state.order.payments.cash.amount;
      this.discount.type = this.$store.state.order.discount?.type || '%';
      this.discount.value = this.$store.state.order.discount?.value || null;
      this.payments.points = this.$store.state.order.payments.points.redeemed;
    },
  },

  mounted () {
    this.reset();
  }
}
</script>

<style lang="scss" scoped>
.pd-c {
  padding-right: 5px !important;
}

.redeem-points-content {
  .col-md-6 {
    padding: 0 5px;
  }
}

.payment-info-table {
  width: 100%;

  tr td:last-child {
    text-align: right;
    font-family: 'Fira Mono', monospace;
  }
}

.final-amount-table {
  width: 100%;
}

.amount-payable {
  font-weight: bold;

  p {
    text-align: center;
    margin-bottom: 3px;
  }

  .title {

  }

  .amount {
    font-size: 25px;
    color: var(--q-color-negative);
  }
}

.payment-paid-table {
  width: 100%;

  tr td {
    font-weight: bold;
    text-align: right;

    &:last-child {
      color: var(--q-color-primary);
    }

    &.paid {
      color: var(--q-color-positive)
    }
  }
}

.btn-finish {
  width: 100%;
}
</style>
