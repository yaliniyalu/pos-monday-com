<template>
    <!--    <q-dialog v-model="keyboardShown" seamless position="bottom" full-width>-->
    <q-card class="keyboard-container">
        <div class="vue-touch-keyboard">
            <div class="keyboard" @mousedown="$event.preventDefault()">
                <div class="line" v-for="(line, index) in keySet" :key="index">
                        <span v-for="(key, index) in line" :key="index"
                              :class="getClassesOfKey(key)"
                              :style="getKeyStyle(key)"

                              v-text="getCaptionOfKey(key)"

                              @click="clickKey($event, key)"
                              @mousedown="mousedown"
                        />
                </div>
            </div>
        </div>
    </q-card>
    <!--    </q-dialog>-->
</template>

<script>
    import isString from "lodash/isString";
    import isObject from "lodash/isObject";
    export default {
        name: "QwertyPad",
        props: {
            acceptBtn: {
                type: String,
                default: 'Accept'
            }
        },

        data () {
            return {
                currentKeySet: 'default',

            };
        },

        computed: {
            keySet() {
                let layout = this.getLayout();
                if (!layout) return;

                let keySet = layout[this.currentKeySet];
                if (!keySet) return;
                let res = [];
                let meta = layout["_meta"] || {};
                keySet.forEach((line) => {
                    let row = [];
                    line.split(" ").forEach((item) => {
                        if (isObject(item)) {
                            row.push(item);
                        }
                        else if (isString(item)) {
                            if (item.length > 2 && item[0] === "{" && item[item.length- 1] === "}") {
                                let name = item.substring(1, item.length - 1);
                                if (meta[name])
                                    row.push(meta[name]);
                                else
                                    console.warn("Missing named key from meta: " + name);
                            } else {
                                if (item === "") {
                                    // Placeholder
                                    row.push({
                                        placeholder: true
                                    });

                                } else {
                                    // Normal key
                                    row.push({
                                        key: item,
                                        text: item
                                    });
                                }
                            }
                        }
                    });
                    res.push(row);
                });
                return res;
            }
        },

        watch: {
            layout() {
                this.currentKeySet = "default";
            }
        },

        methods: {
            getLayout() {
                return {
                    _meta: {
                        "tab": { key: "\t", text: "Tab", width: 60, classes: "control"},
                        "shiftl": { keySet: "shifted", text: "Shift", width: 100, classes: "control"},
                        "shiftr": { keySet: "shifted", text: "Shift", width: 100, classes: "control"},
                        "caps": { keySet: "capsed", text: "Caps lock", width: 80, classes: "control"},
                        "space": { key: " ", text: "Space", width: 180},
                        "enter": { key: "\r\n", text: "Enter", width: 80, classes: "control"},
                        "backspace": { func: "backspace", classes: "control backspace", width: 65},
                        "accept": { func: "accept", text: this.acceptBtn ? this.acceptBtn : 'Accept', classes: "control featured"},
                        "next": { func: "next", text: "Next", classes: "control featured"},
                        "clear": { func: "clear", text: "Clear", classes: "control featured"}
                    },

                    default: [
                        "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
                        "{tab} q w e r t y u i o p [ ] \\",
                        "{caps} a s d f g h j k l ; ' {enter}",
                        "{shiftl} z x c v b n m , . / {shiftr}",
                        "{clear} {space} {accept}"
                    ],
                    shifted: [
                        "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
                        "{tab} Q W E R T Y U I O P { } |",
                        "{caps} A S D F G H J K L : \" {enter}",
                        "{shiftl} Z X C V B N M < > ? {shiftr}",
                        "{clear} {space} {accept}"
                    ],

                    capsed: [
                        "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
                        "{tab} Q W E R T Y U I O P [ ] \\",
                        "{caps} A S D F G H J K L ; ' {enter}",
                        "{shiftl} Z X C V B N M , . / {shiftr}",
                        "{clear} {space} {accept}"
                    ]
                };
            },

            changeKeySet(name) {
                let layout = this.getLayout();
                if (layout[name] != null)
                    this.currentKeySet = name;
            },

            toggleKeySet(name) {
                this.currentKeySet = this.currentKeySet === name ? "default" : name;
            },

            getCaptionOfKey(key) {
                return key.text || key.key || "";
            },

            getClassesOfKey(key) {
                if (key.placeholder)
                    return "placeholder";
                else {
                    let classes = "key " + (key.func || "") + " " + (key.classes || "");
                    if (key.keySet && this.currentKeySet === key.keySet)
                        classes += " activated";
                    return classes;
                }
            },

            getKeyStyle(key) {
                if (key.width)
                    return {
                        flex: key.width
                    };
            },

            backspace(caret, text) {
                if (caret.start < caret.end) {
                    text = text.substring(0, caret.start) + text.substring(caret.end);
                } else {
                    text = text.substring(0, caret.start - 1) + text.substring(caret.start);
                    caret.start -= 1;
                }
                caret.end = caret.start;
                return text;
            },

            close() {
                this.$emit('close');
            },

            focusNextElement: function () {
                const focusableElements = 'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
                if (document.activeElement && document.activeElement.form) {
                    let focusable = Array.prototype.filter.call(document.activeElement.form.querySelectorAll(focusableElements),
                        function (element) {
                            //check for visibility while always include the current activeElement
                            return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
                        });
                    let index = focusable.indexOf(document.activeElement);
                    if(index > -1) {
                        let nextElement = focusable[index + 1] || focusable[0];
                        nextElement.focus();
                    }
                }
            },

            mousedown(e) {
                e.preventDefault();
            },

            insertChar(el, key) {
                let val = el.value;
                let startPos = el.selectionStart;
                let endPos = el.selectionEnd;

                let val_set_1 = val.substring(0, startPos);
                let val_set_2 = val.substring(endPos, val.length);

                switch (key) {
                    case 'backspace':
                        if (startPos === endPos) { val_set_1 = val_set_1.slice(0, -1) }
                        break;
                    case 'return':
                    case 'accept':
                    case "\r\n":
                        val_set_1 = val;
                        val_set_2 = '';

                        if (el.tagName === 'TEXTAREA') {
                            val_set_2 = "\r\n";
                        }
                        break;
                    case 'clear':
                        if (startPos === endPos) { val_set_1 = val_set_2 = '' }
                        break;
                    case "next":
                    case "\t":
                        this.focusNextElement();
                        break;
                    default:
                        val_set_1 += key
                }

                el.value = val_set_1 + val_set_2;
                startPos = endPos = val_set_1.length;
                el.setSelectionRange(startPos, endPos);
            },

            triggerEvents(el, key) {
                let evt = {};
                switch (key) {
                    case 'backspace':
                        evt = { key: 'Backspace', keyCode: 8, charCode: 0, which: 8 };
                        break;
                    case 'return':
                    case 'accept':
                    case "\r\n":
                        evt = { key: 'Enter', keyCode: 13, charCode: 0, which: 13 };
                        break;
                    case 'clear':
                        evt = { key: 'Backspace', keyCode: 8, charCode: 0, which: 8 };
                        break;
                    case "next":
                    case "\t":
                        evt = { key: 'Tab', keyCode: 9, charCode: 0, which: 9 };
                        break;
                    default:
                        evt = { key: key, keyCode: String.fromCharCode(key), charCode: String.fromCharCode(key), which: String.fromCharCode(key) }
                }

                el.dispatchEvent(new KeyboardEvent('keydown', evt));
                el.dispatchEvent(new KeyboardEvent('keyup', evt));
                el.dispatchEvent(new KeyboardEvent('keypress', evt));

                if (evt.which === 13 || evt.which === 9) {
                    el.dispatchEvent(new Event('change'))
                } else {
                    el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, target: el }))
                }
            },

            clickKey(e, key) {
                e.preventDefault();

                let input = document.activeElement;

                if (!((input instanceof HTMLInputElement && (/text|password|search|tel|url|number/).test(input.type)) || input.tagName === 'TEXTAREA') || input.readOnly || input.disabled) {
                    return;
                }

                let text = input.value;

                let addChar = null;
                if (typeof key == "object") {
                    if (key.keySet) {
                        this.toggleKeySet(key.keySet);
                    }
                    else if (key.func) {
                        switch(key.func) {
                            case "backspace": {
                                addChar = 'backspace';
                                break;
                            }
                            case "clear": {
                                addChar = 'clear';
                                break;
                            }
                            case "accept": {
                                addChar = 'accept';
                                break;
                            }
                            case "cancel": {
                                this.close();
                                return;
                            }
                            case "next": {
                                addChar = '\t';
                                break;
                            }
                            default: {
                                this.$emit(key.func);
                            }
                        }
                    } else {
                        addChar = key.key;
                    }
                } else {
                    addChar = key;
                }

                if (addChar) {
                    if (input.maxLength <= 0 || text.length < input.maxLength) {
                        this.insertChar(input, addChar);
                        this.triggerEvents(input, addChar);
                    }

                    if (this.currentKeySet === "shifted")
                        this.changeKeySet("default");
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    $width: 40;
    $height: 2.6em;
    $margin: 0.5em;
    $radius: 0.35em;

    .vue-touch-keyboard {
        .keyboard {
            width: 100%;
            margin: 0;
            height: calc(var(--number-pad-height) + var(--status-bar-height) + 30px);
            padding: 5px;

            .line {
                display: flex;
                justify-content: space-around;
                margin-bottom: $margin;
                &:not(:last-child) {
                    margin-bottom: $margin;
                }
            }

            .key {
                &:not(:last-child) {
                    margin-right: $margin;
                }
                flex: $width;
                //width: $btnW;
                height: $height;
                line-height: $height;
                overflow: hidden;
                vertical-align: middle;
                border: 1px solid #ccc;
                color: #333;
                background-color: #fff;
                box-shadow: 0 2px 2px rgba(0, 0, 0, .6);
                border-radius: $radius;
                font-size: 1.25em;
                text-align: center;
                white-space: nowrap;
                user-select: none;
                cursor: pointer;
                &.backspace:after {
                    content: '⌫';
                    /*background-image: url("./icons/backspace.svg");*/
                    /*background-position: center center;
                    background-repeat: no-repeat;
                    background-size: 35%;*/
                }

                &.half {
                    flex: $width / 2;
                }
                &.control {
                    color: #fff;
                    background-color: #7d7d7d;
                    border-color: #656565;
                }

                &.featured {
                    color: #fff;
                    background-color: #337ab7;
                    border-color: #2e6da4;
                }
                &:hover {
                    color: #333;
                    background-color: #d6d6d6;
                    border-color: #adadad;
                }

                &:active {
                    transform: scale(.98); // translateY(1px);
                    color: #333;
                    background-color: #d4d4d4;
                    border-color: #8c8c8c;
                }
                &.activated {
                    color: #fff;
                    background-color: #5bc0de;
                    border-color: #46b8da;
                }
            } // .key
            /*
            // Apple style
            .key {
                color: #aaa;
                //font: bold 9pt arial;
                background: #eff0f2;
                border-radius: 4px;
                border-top: 1px solid #ddd;
                box-shadow:
                    inset 0 0 25px #e8e8e8,
                    0 1px 0 #c3c3c3,
                    0 2px 0 #c9c9c9,
                    0 2px 3px #333;
                text-shadow: 0px 1px 0px #f5f5f5;
                &.control {
                    box-shadow:
                        0 1px 0 #c3c3c3,
                        0 2px 0 #c9c9c9,
                        0 2px 3px #333;
                    text-shadow: 0px 1px 0px #777;
                }
                &:hover {
                    color: #aaa;
                    background-color: inherit;
                    border-color: inherit;
                }
                &:active {
                    color: #888;
                    background: #ebeced;
                    transform: translateY(3px);
                    box-shadow: inset 0 0 25px #ddd, 0 0 3px #333;
                    border-top: 1px solid #eee;
                }
            }*/
            .placeholder {
                flex: $width / 2;
                height: $height;
                line-height: $height;

                &:not(:last-child) {
                    margin-right: $margin;
                }
            }


            &:before,
            &:after {
                content: "";
                display: table;
            }
            &:after {
                clear: both;
            }
        } // .keyboard
    } // .vue-touch-keyboard

    .keyboard-container {
        width: 100%;
        margin-bottom: 18px;
    }
</style>
