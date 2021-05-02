<template>
  <div>
    <table class="board">
      <tbody>
      <tr>
        <td class="board-left">
          <div >
            <p>SubTotal <span class="value">{{ amount.subTotal | null2zero | price }}</span></p>
            <p>Discount ({{ amount.discount.percent | null2zero | price(1) }}%)
              <span class="value">- {{ amount.discount.amount | null2zero | price }}</span>
            </p>

            <p >Tax
              <span>({{ amount.tax.percent | null2zero }}% {{ amount.tax.type }})</span>
              <span class="value">{{ amount.tax.amount | null2zero | price }}</span>
            </p>

            <q-separator inset color="white"/>

            <p>Total
              <span class="value">{{ amount.grandTotal | null2zero | price }}</span>
            </p>
          </div>
        </td>
        <td class="board-right">
          <div>
            <p>TOTAL AMOUNT</p>
            <h3><span class="number">{{ amount.grandTotal | null2zero | price }}</span></h3>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {currency, null2zero, percent, price} from "src/filters";

export default {
  name: 'PriceInfoBoard',

  filters: {
    price: price,
    currency: currency,
    null2zero: null2zero,
    percent: percent
  },

  computed: {
    order() {
      return this.$store.state.order
    },

    amount() {
      return this.$store.getters["order/amountInfo"];
    }
  },
}
</script>

<style lang="scss" scoped>
.board {
  position: relative;
  float: left;
  width: 100%;
  border: none;
  border-collapse: collapse;

  .board-left {
    width: 60%;
    background: #0e979b;
    color: #ffff;

    p {
      margin: 0;
      color: #fff;
      padding: 4px 10px;

      span.value {
        float: right;
        font-family: 'Fira Mono', monospace;
      }
    }
  }

  .board-right {
    width: 40%;
    background: #212121;
    padding: 1.60rem 10px;
    text-align: center;

    p {
      margin: 0;
      color: #fff;
    }

    h3 {
      font-weight: bold;
      font-size: 2rem;
      color: #fff;
      margin: 0;
    }
  }
}
</style>
