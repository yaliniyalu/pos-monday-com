<template>
    <div>
        <div class="dial-pad">
            <div class="head" v-if="display && title">{{title}}</div>
            <div class="number" v-if="display">{{value}}</div>
            <div class="dials">
                <table class="grid">
                    <tbody>
                    <tr>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="7">7</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="8">8</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="9">9</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="bk">⌫</td>
                    </tr>
                    <tr>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="4">4</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="5">5</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="6">6</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="clr">×</td>
                    </tr>
                    <tr>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="1">1</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="2">2</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="3">3</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="ret" rowspan="2">{{ acceptBtn }}</td>

                    </tr>
                    <tr>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="0">0</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="00">00</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="." v-if="floatType">.</td>
                        <td @mousedown="onKeyDown" @click="touchHandler" data-key="" v-else> </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'NumberPad',

        props: {
            input: { type: [Object, HTMLElement] },
            display: { type: Boolean, default: false },
            title: { type: String, default: null },
            default: { type: Number, default: 0 },
            floatType: { type: Boolean, default: true },
            acceptBtn: { type: String, default: '⏎' }
        },

        data () {
            return {
                value: ''
            }
        },

        watch: {
            input () {
                this.value = ''
            }
        },

        methods: {
            clear () {
                this.value = ''
            },

            onKeyDown (e) {
                e.preventDefault()
            },

            touchHandler (e) {
                e.preventDefault();
                const key = e.target.getAttribute('data-key');
                let el = document.activeElement;

                let isInput = el instanceof HTMLInputElement && ((/text|password|search|tel|url|number/).test(el.type)) || el.tagName === 'TEXTAREA';

                if (isInput) {
                    this.textChange(el, key)
                }

                let evt = {};
                switch (key) {
                    case 'bk':
                        evt = { key: 'Backspace', keyCode: 8, charCode: 0, which: 8 };
                        break;
                    case 'ret':
                        evt = { key: 'Enter', keyCode: 13, charCode: 0, which: 13 };
                        break;
                    case 'clr':
                        evt = { key: 'Backspace', keyCode: 8, charCode: 0, which: 8 };
                        break;
                    default:
                        evt = { key: key, keyCode: String.fromCharCode(key), charCode: String.fromCharCode(key), which: String.fromCharCode(key) }
                }

                el.dispatchEvent(new KeyboardEvent('keyup', evt));
                el.dispatchEvent(new KeyboardEvent('keypress', evt));

                if (isInput) {
                    if (evt.which === 13) {
                        el.dispatchEvent(new Event('change'))
                    } else {
                        el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, target: el }))
                    }
                }
            },

            textChange (el, key) {
                let val = el.value;
                let startPos = el.selectionStart;
                let endPos = el.selectionEnd;

                let val_set_1 = val.substring(0, startPos);
                let val_set_2 = val.substring(endPos, val.length);

                switch (key) {
                    case 'bk':
                        if (startPos === endPos) { val_set_1 = val_set_1.slice(0, -1) }
                        break;
                    case 'ret':
                        val_set_1 = val;
                        val_set_2 = '';
                        break;
                    case 'clr':
                        if (startPos === endPos) { val_set_1 = val_set_2 = '' }
                        break;
                    default:
                        val_set_1 += key
                }

                el.value = this.value = val_set_1 + val_set_2;
                startPos = endPos = val_set_1.length;
                el.setSelectionRange(startPos, endPos);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dials {
        cursor: pointer;
        font-family: "Concert One", sans-serif;

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            width: 25%;
            font-weight: 600;
            padding: 2px;
            border: 2px solid #ffffff;
            font-size: 30px;
            color: #fff;
            margin: 0 auto;
            text-align: center;
            background: #424345;
            user-select: none;

            &:active, &:focus, &:hover {
                background: #616163;
            }

            &.disabled {
                opacity: 1 !important;
                touch-action: none;
                pointer-events: none;
            }
        }
    }

    .dial-pad .head {
        background: #000;
        color: #00ffd2;
        font-size: 30px;
        font-weight: bold;
        height: 43px;
        padding: 5px 10px;
    }

    .dial-pad .number {

        position: relative;
        z-index: 2;
        padding: 40px;
        color: #ffffff;
        font-weight: 700;
        font-size: 52px;
        background: #1d1918;
        height: var(--number-pad-height);
        border-bottom: 1px solid #fff;
    }
</style>
