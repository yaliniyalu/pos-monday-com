<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <perfect-scrollbar>
    <div class="q-pa-md" v-if="!isEditPage">
      <div class="q-gutter-md">
        <q-form @submit="verifyMember" v-if="!member" ref="frm_set_member">
          <q-input v-model="mobile" outlined type="text" placeholder="Mobile No"
                   :loading="isLoading" lazy-rules autofocus
                   :rules="[ val => !!val || 'Please Enter Valid Mobile No']"
          >
            <template v-slot:append>
              <font-awesome-icon icon="arrow-alt-circle-right" class="set-icon" v-if="!isLoading"
                                 @click="$refs.frm_set_member.submit()"/>
            </template>
          </q-input>
        </q-form>

        <div v-else>
          <table class="details-head">
            <tr>
              <td class="account"># {{ member.phone }}</td>
              <td class="account-name">{{ member.name }}</td>
            </tr>
            <tr>
              <td>
                <q-badge class="member-type-badge" rounded color="primary" :label="member.memberType" v-if="member.memberType" />
              </td>
              <td class="action-buttons">
                <q-btn flat color="primary" @click="openEdit"><font-awesome-icon icon="edit" /></q-btn>
                <q-btn flat color="negative" @click="unlinkMember"><font-awesome-icon icon="times"/></q-btn>
              </td>
            </tr>
          </table>

          <table class="points-table">
            <tr>
              <th>
                <q-btn outline color="primary" class="points-item">
                  <div>Reward Points<br><b>{{ member.rewardPoints | null2zero }}</b></div>
                </q-btn>
              </th>
              <th>
                <q-btn outline color="primary" class="points-item">
                  <div>Total Purchased<br><b>{{ member.totalPurchased | null2zero | currency}}</b></div>
                </q-btn>
              </th>
              <th>
                <q-btn outline color="primary" class="points-item">
                  <div>Total Discounted<br><b>{{ member.totalDiscounted | null2zero | currency }}</b></div>
                </q-btn>
              </th>
            </tr>
          </table>

          <table class="member-details" v-if="member.email || member.address || member.phone">
            <tr>
              <td colspan="2" class="title">Member Details</td>
            </tr>
            <tr v-if="member.phone">
              <td class="icon">
                <font-awesome-icon icon="phone"/>
              </td>
              <td>{{ member.phone | mobile }}</td>
            </tr>
            <tr v-if="member.email">
              <td class="icon">
                <font-awesome-icon icon="envelope"/>
              </td>
              <td>{{ member.email }}</td>
            </tr>
            <tr v-if="member.address">
              <td class="icon">
                <font-awesome-icon icon="map-marker-alt"/>
              </td>
              <td>{{ member.address }}</td>
            </tr>
          </table>
        </div>
      </div>

      <q-dialog v-model="showConfirm">
        <q-card>
          <q-card-section class="row items-center text-center">
            <p>The requested account is not found.<br>Please confirm the mobile number and click <i>CREATE ACCOUNT</i> to create new account.</p>
          </q-card-section>

          <div class="text-center">
            <p>VERIFY MOBILE NO<br><b>{{ mobile | mobile }}</b></p>

          </div>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup/>
            <q-btn flat label="Create Account" color="primary" @click="createCustomer" :loading="isCreating" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <div class="q-pa-md" v-else>
      <div class="q-gutter-md">
        <q-form @submit="updateMember">

          <div class="row q-col-gutter-sm">
            <div class="col-md-6">
              <q-input outlined dense v-model="edited.name" label="Name" color="primary" pos-keyboard>
                <template v-slot:prepend>
                  <font-awesome-icon icon="user"/>
                </template>
              </q-input>
            </div>
            <div class="col-md-6">
              <q-input outlined dense v-model="edited.email" label="Email" color="primary" pos-keyboard>
                <template v-slot:prepend>
                  <font-awesome-icon icon="envelope"/>
                </template>
              </q-input>
            </div>
            <div class="col-md-6">
              <q-input outlined dense v-model="edited.phone" label="Mobile" color="primary" pos-keyboard>
                <template v-slot:prepend>
                  <font-awesome-icon icon="phone"/>
                </template>
              </q-input>
            </div>
            <div class="col-md-6">
              <q-input type="textarea" outlined dense v-model="edited.address" label="Address" color="primary" autogrow pos-keyboard>
                <template v-slot:prepend>
                  <font-awesome-icon icon="map"/>
                </template>
              </q-input>
            </div>
          </div>

          <div class="text-center q-pa-md q-gutter-sm">
            <q-btn unelevated outline type="button" color="primary" label="Cancel" @click="closeEdit"/>
            <q-btn unelevated type="submit" color="primary" label="Update" :loading="isUpdating"/>
          </div>
        </q-form>
      </div>
    </div>
  </perfect-scrollbar>
</template>

<script>
import {mobile, currency, null2zero} from "src/filters";
import {createCustomer, getCustomerByMobile, updateCustomer} from "src/modals/customer";
import ui from "src/ui";

export default {
  name: "Member",

  filters: {
    mobile, currency, null2zero
  },

  data() {
    return {
      isLoading: false,
      isCreating:  false,
      isUpdating: false,
      showConfirm: false,

      mobile: '',

      edited: {
        name: '',
        email: null,
        phone: '',
        address: ''
      }
    }
  },

  watch: {
    member() {
      this.copyMemberToEdited();
    },

    resetIndicator() {
      this.reset();
    }
  },

  computed: {
    member() {
      return this.$store.state.order.customer
    },

    isEditPage() {
      return this.$store.state.app.customer.isEditPage
    },

    resetIndicator() {
      return this.$store.state.app.resetIndicator;
    }
  },

  methods: {
    async verifyMember() {
      this.isLoading = true;

      let customer = null;
      try {
        customer = await getCustomerByMobile(this.mobile.replace(/[^0-9]+/g, ""));
      } catch (e) {
        ui.notifyError('Unable to get member')
      } finally {
        this.isLoading = false;
      }

      if (!customer) {
        this.showConfirm = true;
      }

      await this.$store.dispatch('order/setCustomer', customer);
    },

    unlinkMember() {
      this.$store.dispatch('order/setCustomer', null);
    },

    async createCustomer() {
      this.isCreating = true;
      const c = await createCustomer({ name: this.mobile, phone: this.mobile });
      await this.$store.dispatch('order/setCustomer', c)
      this.isCreating = false
      this.showConfirm = false;
    },

    openEdit() {
      this.$store.dispatch('app/setCustomerEditPage', true)
    },

    closeEdit() {
      this.$store.dispatch('app/setCustomerEditPage', false)
    },

    async updateMember() {
      this.isUpdating = true;

      try {
        const member = await updateCustomer(this.member, this.edited);
        await this.$store.dispatch('order/setCustomer', member)
        ui.notifySuccess('Customer details updated')
      } catch (e) {
        ui.notifyError('Unable to update customer details')
      }

      this.isUpdating = false;
    },

    copyMemberToEdited() {
      if (!this.member) return;

      Object.keys(this.edited).forEach(v => {
        this.edited[v] = this.member[v]
      });
    },

    reset() {
      this.closeEdit();
      this.mobile = '';
    }
  },

  mounted() {
    this.copyMemberToEdited();
  }
}
</script>

<style lang="scss" scoped>
.set-icon {
  cursor: pointer;
}

.btn-set-member {
  background: transparent;
  cursor: pointer;
  border: none;
}

.points-table {
  width: 100%;

  th, td {
    text-transform: uppercase;
    text-align: center;
  }

  button {
    width: 100%;
  }
}

.account {
  margin: 0;
  font-size: 22px;
  font-weight: bold;
}

.account-name {
  text-align: right;
  font-size: 22px;
  font-weight: bold;
  text-transform: uppercase;
}

.details-head {
  width: 100%;
}

.action-buttons {
  text-align: right;

  .remove, .edit {
    cursor: pointer;
    margin: 5px 15px;
  }

  .remove {
    color: red;
  }

  .edit {
    color: blue;
  }
}

.member-details {
  width: 100%;
  font-size: 18px;
  line-height: 1.2em;
  margin-top: 15px;

  tr {
    & > td {
      padding-bottom: 0.5em;
    }
  }

  .icon {
    color: var(--q-color-primary);
  }

  .title {
    text-transform: uppercase;
    font-weight: bold;
  }
}

.points-item {
  width: 150px;
  font-size: 16px;
}

.points-title {
  font-size: 20px;
}

.member-type-badge {
  padding: 5px 10px;
  font-size: 16px;
}
</style>
