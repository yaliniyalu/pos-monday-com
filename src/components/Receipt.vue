<template>
  <q-dialog position="top" ref="dialog" @hide="onDialogHide">
    <q-card class="bill-container">
      <q-card-section>
        <p class="title">Receipt</p>
        <span class="btn-print">
          <q-btn outline round color="pink" icon="fas fa-print" @click="print" :loading="printing"/>
        </span>
      </q-card-section>
      <q-card-section>
        <perfect-scrollbar style="height: 500px">
          <div class="bill-width" id="print-frame" ref="receipt">
            <div id="invoice-POS">
              <div id="top">
                <div class="logo"></div>
                <div class="info">
                  <h2>{{ info.name }}</h2>
                  <h3>{{ info.address }}</h3>
                  <h3>
                    <span v-if="info.phone">Phone: {{ info.phone }}</span>
                    <span v-if="info.phone && info.cell">, </span>
                    <span v-if="info.cell">Cell: {{ info.cell }}</span>
                  </h3>
                  <h4>Payment: {{ paymentInfo.status | titleCase }}</h4>
                </div>
              </div>

              <div id="mid">
                <div class="info-date">
                  <ul>
                    <li>Bill No : {{ order.billNo }}</li>
                    <li class="t-right">Date : {{ Date.now() | dateFormat('DD-MM-YYYY') }}</li>

                    <li v-if="order.id"># {{ order.id }}</li>
                    <li v-else></li>

                    <li class="t-right">Time : {{ Date.now() | dateFormat('hh:mm a') }}</li>
                  </ul>
                </div>
              </div>

              <div id="bot">
                <div id="table">
                  <table>
                    <tbody>
                    <tr class="table-title">
                      <td class="sno">Sno</td>
                      <td class="item">Item</td>
                      <td>Rate</td>
                      <td class="tx-right">Qty</td>
                      <td class="tx-right amt">Amt</td>
                    </tr>

                    <tr v-for="(item, i) in order.items" :key="item.key">
                      <td class="sno">{{ i + 1 }}</td>
                      <td class="item">{{ item.info.name }}</td>
                      <td>{{ item.info.price | price }}</td>
                      <td class="tx-right">{{ item.qty }}</td>
                      <td class="tx-right">{{ item.totalPrice | price }}</td>
                    </tr>


                    <tr class="table-title-1 b-top">
                      <td></td>
                      <td class="tx-right" colspan="3">Sub Total :</td>
                      <td class="tx-right">{{ amount.subTotal | price }}</td>
                    </tr>

                    <tr class="table-title-1">
                      <td></td>
                      <td class="tx-right" colspan="3">Discount :</td>
                      <td class="tx-right">-{{ amount.discount.amount | price }}</td>
                    </tr>

                    <tr class="table-title-1">
                      <td></td>
                      <td class="tx-right" colspan="3">Tax :</td>
                      <td class="tx-right">{{ amount.tax.amount | price }}</td>
                    </tr>

                    <tr class="table-title-1 b-bot">
                      <td></td>
                      <td class="tx-right" colspan="3">Round off :</td>
                      <td class="tx-right">{{ amount.roundOff | price | withSign }}</td>
                    </tr>

                    <tr class="table-title b-bot">
                      <td colspan="2"></td>
                      <td class="tx-right" colspan="2">Total :</td>
                      <td class="tx-right">{{ amount.payableAmount | price | currency }}</td>
                    </tr>
                    <tr class="service">
                      <td class="tx-center" colspan="2">Paid : {{ paymentInfo.paid | price | currency }}</td>
                      <td></td>
                      <td class="tx-center" colspan="2">Bal : {{ paymentInfo.balance | price | currency | withSign(false) }}</td>
                    </tr>
                    </tbody></table>
                </div>
                <div id="legal-copy" class="b-top">
                  <p class="legal">Thank you Visit Again!</p>
                </div>

              </div>
            </div>
          </div>
        </perfect-scrollbar>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import css from '!raw-loader!sass-loader!./../css/print.scss';
import Print from 'printd'
import {currency, price, withSign, dateFormat, titleCase} from "src/filters";

export default {
  name: "Receipt",

  props: {
    data: {
      type: Object
    },
    autoPrint: {
      type: Boolean,
      default: false
    }
  },

  filters: {
    price, currency, withSign, dateFormat, titleCase
  },

  data() {
    return {
      printing: false,
    }
  },

  computed: {
    order() {
      if (this.data)
        return this.data.order;

      return this.$store.state.order
    },

    amount() {
      if (this.data)
        return this.data.amountInfo;

      return this.$store.getters["order/amountInfo"];
    },

    paymentInfo() {
      if (this.data)
        return this.data.paymentInfo;

      return this.$store.getters["order/paymentInfo"];
    },

    info() {
      return this.$store.state.app.settings.receipt;
    }
  },

  methods: {
    show() {
      this.$refs.dialog.show();
    },

    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      this.$emit('hide')
    },

    printFinished() {
      this.printing = false;
      this.hide();
    },

    print() {
      this.printing = true;
      const p = new Print()
      p.print(this.$refs.receipt, [css])
      const { contentWindow } = p.getIFrame()
      contentWindow.addEventListener('afterprint', () => this.printFinished())
    },

    printWhenAvailable() {
      this.$nextTick(_ => this.$refs.receipt ? this.print() : this.printWhenAvailable())
    }
  },

  mounted() {
    if (this.$store.state.app.settings.printing.autoPrintOnPopupOpen || this.autoPrint) {
      this.printWhenAvailable();
    }
  }
}
</script>

<style scoped lang="scss">

@import "../css/print";

.bill-width {
  width: var(--bill-width) !important;
}

.bill-container {
  width: calc(var(--bill-width) + 35px)
}

.btn-print {
  position: absolute;
  right: 25px;
  top: 14px;
  font-size: 20px;
}

</style>
