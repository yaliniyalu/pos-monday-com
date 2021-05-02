<template>
  <div class="action-content">
    <MenuList v-show="openedPage === 'menu'" />
    <Member v-show="openedPage === 'member'"/>
    <DeliveryDetails v-if="openedPage === 'delivery'"/>
    <OrderList v-if="openedPage === 'orders'"/>
    <Settings v-if="openedPage === 'settings'"/>

    <Payment ref="payment" v-if="openedPage === 'pay'"/>
  </div>
</template>

<script>
import MenuList from "components/Menu/MenuList";
import Member from "components/Member/Member";
import Payment from "components/Payment";
import DeliveryDetails from "components/DeliveryDetails";
import OrderList from "components/Order/OrderList";
import Settings from "components/Settings";

export default {
  name: 'ActionContent',
  components: {
    OrderList,
    DeliveryDetails, MenuList, Member, Payment, Settings
  },
  computed: {
    openedPage() {
      return this.$store.state.app.ui.openedPage
    }
  },
}
</script>

<style lang="scss" scoped>

.action-content {
  margin: 4px 0;
  height:var(--action-screen-height);

  & > table, & > div {
    height: var(--action-screen-height);
  }
}

</style>
