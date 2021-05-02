<template>
  <perfect-scrollbar>
    <div class="q-pa-md">
      <div class="q-gutter-md">
        <div class="option-container">
          <q-btn-toggle v-model="type" toggle-color="primary" no-caps rounded unelevated :options="options"/>
        </div>

        <div class="q-gutter-md" v-if="type === 'homeDelivery'">
          <q-form>
            <div class="row q-col-gutter-sm">
              <div class="col-md-6">
                <q-input outlined dense v-model.lazy="context.name" label="Name" color="primary" pos-keyboard>
                  <template v-slot:prepend>
                    <font-awesome-icon icon="user"/>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6">
                <q-input outlined dense v-model.lazy="context.phone" label="Mobile" color="primary" pos-keyboard>
                  <template v-slot:prepend>
                    <font-awesome-icon icon="phone"/>
                  </template>
                </q-input>
              </div>
              <div class="col-md-12">
                <q-input type="textarea" outlined dense v-model.lazy="context.address" label="Address" color="primary" autogrow pos-keyboard>
                  <template v-slot:prepend>
                    <font-awesome-icon icon="map"/>
                  </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </div>

        <div class="q-gutter-md" v-if="type === 'pickup'">
          <q-form>
            <div class="row q-col-gutter-sm">
              <div class="col-md-6">
                <q-input outlined dense :value="context_date" label="Date" color="primary" pos-keyboard>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="context_date" mask="DD-MM-YYYY">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-md-6">
                <q-input outlined dense :value="context_time" label="Time" color="primary" pos-keyboard>
                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="context_time" mask="hh:mm a">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </perfect-scrollbar>
</template>

<script>
import { date } from 'quasar'

export default {
  name: "DeliveryDetails",
  data() {
    return {
      type: '',
      context: {
        name: null,
        address: null,
        phone: null,
        date: null,
        time: null
      },

      context_time: null,
      context_date: null,

      options: [
        {label: 'Dine In', value: 'dineIn'},
        {label: 'Home Delivery', value: 'homeDelivery'},
        {label: 'Self PickUp', value: 'pickup'}
      ]
    }
  },

  computed: {
    delivery() {
      return this.$store.state.order.delivery
    },

    customer() {
      return this.$store.state.order.customer
    },
  },

  watch: {
    context: {
      handler() {
        this.setDelivery();
      },
      deep: true
    },

    context_time(val) {
      const d = date.extractDate(val, 'hh:mm a')
      this.context.time = date.formatDate(d, 'HH:mm:ss')
    },

    context_date(val) {
      const d = date.extractDate(val, 'DD-MM-YYYY')
      this.context.date = date.formatDate(d, 'YYYY-MM-DD')
    },

    type() {
      if (this.type === 'homeDelivery' && !this.delivery.name && this.customer) {
        this.context.name = this.customer.name;
        this.context.address = this.customer.address;
        this.context.phone = this.customer.phone;
      } else {
        this.setDelivery();
      }
    }
  },

  methods: {
    reloadDelivery() {
      this.type = this.delivery.type;
      this.context.name = this.delivery.name;
      this.context.address = this.delivery.address;
      this.context.phone = this.delivery.phone;
      this.context.date = this.delivery.date;
      this.context.time = this.delivery.time;

      if (this.delivery.date) {
        this.context_date = date.formatDate(date.extractDate(this.delivery.date, 'YYYY-MM-DD'), 'DD-MM-YYYY');
      }

      if (this.delivery.time) {
        this.context_time = date.formatDate(date.extractDate(this.delivery.time, 'HH:mm:ss'), 'hh:mm a');
      }
    },

    setDelivery() {
      this.$store.dispatch('order/setDeliveryDetails', { type: this.type, data: this.context })
    }
  },

  mounted() {
    this.reloadDelivery();
  }
}
</script>

<style scoped>
.option-container {
  text-align: center;
}
</style>
