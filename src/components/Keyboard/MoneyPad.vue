<template>
    <div class="q-gutter-md">
        <button v-ripple @mousedown.prevent @click="addMoney(total)"   class="q-btn btn-money large" v-if="total != null">{{ total }}</button>
        <button v-ripple @mousedown.prevent @click="addMoney(5)"   class="q-btn btn-money">5</button>
        <button v-ripple @mousedown.prevent @click="addMoney(10)"  class="q-btn btn-money">10</button>
        <button v-ripple @mousedown.prevent @click="addMoney(20)"  class="q-btn btn-money">20</button>
        <button v-ripple @mousedown.prevent @click="addMoney(50)"  class="q-btn btn-money">50</button>
        <button v-ripple @mousedown.prevent @click="addMoney(100)" class="q-btn btn-money">100</button>
        <button v-ripple @mousedown.prevent @click="addMoney(500)" class="q-btn btn-money">500</button>
    </div>
</template>

<script>
    export default {
        name: "MoneyPad",

        props: {
            total: {
                type: [Number, String],
                default: null
            }
        },

        methods: {
            addMoney(v) {
                let el = document.activeElement;

                if (!((el instanceof HTMLInputElement && (/text|password|search|tel|url|number/).test(el.type)) || el.tagName === 'TEXTAREA') || el.readOnly || el.disabled) {
                    return;
                }

                let val = el.value ? parseFloat(el.value) : 0;
                if (isNaN(val)) return;

                val += v;
                el.value = val;

                let evt = document.createEvent("HTMLEvents");
                evt.initEvent("input", false, true);
                el.dispatchEvent(evt);

                evt.initEvent("change", false, true);
                el.dispatchEvent(evt);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .btn-money {
        width: 60px;
        background: #00838f;
        cursor: pointer;
        box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
        height: 36px;
        border-radius: 3px;
        color: #fff;
        padding: 6px;

        &:hover {
            opacity: 0.90;
        }

        &.large {
            width: 136px;
            background: #00695c;
        }
    }
</style>
