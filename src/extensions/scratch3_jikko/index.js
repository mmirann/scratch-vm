const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const formatMessage = require("format-message");
const BLE = require("../../io/ble");
const Base64Util = require("../../util/base64-util");

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI =
    "data:image/png;base64,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";

/**
 * A time interval to wait (in milliseconds) before reporting to the BLE socket
 * that data has stopped coming from the peripheral.
 */
const BLETimeout = 2500;

/**
 * A time interval to wait (in milliseconds) while a block that sends a BLE message is running.
 * @type {number}
 */
const BLESendInterval = 100;

/**
 * A string to report to the BLE socket when the micro:bit has stopped receiving data.
 * @type {string}
 */
const BLEDataStoppedError = "jikko extension stopped receiving data";

/**
 * Enum for micro:bit protocol.
 * https://github.com/LLK/scratch-microbit-firmware/blob/master/protocol.md
 * @readonly
 * @enum {string}
 */

/*
d895dd30-902e-11eb-a8b3-0242ac130003
d895ddee-902e-11eb-a8b3-0242ac130003
d895dea2-902e-11eb-a8b3-0242ac130003
*/
const BLEUUID = {
    set_service: 0xc005,
    set_pin: "d895d7cc-902e-11eb-a8b3-0242ac130003",
    set_neopixel: "d895d61e-902e-11eb-a8b3-0242ac130003",
    set_buzzer: "d895d952-902e-11eb-a8b3-0242ac130003",
    set_lcd: "d895dc2c-902e-11eb-a8b3-0242ac130003",
    get_service: 0xc006,
    get_button: "d895d704-902e-11eb-a8b3-0242ac130003",
};

class Jikko {
    /**
     * Construct a MicroBit communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor(runtime, extensionId) {
        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;
        this._user_button = 1;

        /**
         * The BluetoothLowEnergy connection socket for reading/writing peripheral data.
         * @type {BLE}
         * @private
         */
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._extensionId = extensionId;
        /**
         * Interval ID for data reading timeout.
         * @type {number}
         * @private
         */
        this._timeoutID = null;

        /**
         * A flag that is true while we are busy sending data to the BLE socket.
         * @type {boolean}
         * @private
         */
        this._busy = false;

        /**
         * ID for a timeout which is used to clear the busy flag if it has been
         * true for a long time.
         */
        this._busyTimeoutID = null;
        this.disconnect = this.disconnect.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }

    get userButton() {
        if (this._user_button == 0) {
            return false;
        } else {
            return true;
        }
    }

    /*
    0. digital: cmd, pin, value
    1. pwm: cmd, pin, value
    2. servo pwm
    */
    setPin(cmd, pin, value) {
        var send_data = [];
        send_data.push(cmd);
        send_data.push(pin);
        send_data.push(value);
        return this.send(BLEUUID.set_service, BLEUUID.set_pin, send_data);
    }

    setBuzzerPlay(pin, note, beats) {
        var send_data = [];
        send_data.push(pin);
        send_data.push(note);
        send_data.push(beats);
        return this.send(BLEUUID.set_service, BLEUUID.set_buzzer, send_data);
    }

    /*
    0. init: cmd, pin, led_num
    1. brightness: cmd, pin, brightness
    2. clear_all: cmd, pin, color
    3. no_color: cmd, pin, color, num
    4. all_color: cmd, pin, color
    */
    setLEDLamp(cmd, pin, value, num) {
        var send_data = [];

        send_data.push(cmd);
        send_data.push(pin);

        // 0.init: value=led number
        // 1.set_brightness: value=brightness
        if (cmd == 0 || cmd == 1) {
            send_data.push(value);
            return this.send(
                BLEUUID.set_service,
                BLEUUID.set_neopixel,
                send_data
            );
        } else if (cmd == 2) {
            //clear_all
            return this.send(
                BLEUUID.set_service,
                BLEUUID.set_neopixel,
                send_data
            );
        }
        // cmd 3,4 => set_color
        // parsing first

        let r = parseInt(value.substr(1, 2), 16);
        let g = parseInt(value.substr(3, 2), 16);
        let b = parseInt(value.substr(5, 2), 16);

        r = Math.round(r);
        r = Math.min(r, 255);
        r = Math.max(r, 0);

        g = Math.round(g);
        g = Math.min(g, 255);
        g = Math.max(g, 0);

        b = Math.round(b);
        b = Math.min(b, 255);
        b = Math.max(b, 0);

        send_data.push(r);
        send_data.push(g);
        send_data.push(b);

        if (cmd == 3) {
            send_data.push(num);
        }

        return this.send(BLEUUID.set_service, BLEUUID.set_neopixel, send_data);
    }

    // 0: init, 1: clear, 2: text
    setLCDText(cmd, column, row, textLen, str) {
        var send_data = [];
        send_data.push(cmd);

        if (cmd == 0) {
            send_data.push(column);
            send_data.push(row);
            return this.send(BLEUUID.set_service, BLEUUID.set_lcd, send_data);
        } else if (cmd == 1) {
            return this.send(BLEUUID.set_service, BLEUUID.set_lcd, send_data);
        }
        send_data.push(column);
        send_data.push(row);
        send_data.push(textLen);
        for (var i = 0; i < textLen; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80)
                //ASCII 코드라면
                send_data.push(charcode);
        }
        return this.send(BLEUUID.set_service, BLEUUID.set_lcd, send_data);
    }

    send(service, characteristic, value) {
        if (!this.isConnected()) return;
        if (this._busy) return;

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        this._busy = true;

        // Set a timeout after which to reset the busy flag. This is used in case
        // a BLE message was sent for which we never received a response, because
        // e.g. the peripheral was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

        const data = Base64Util.uint8ArrayToBase64(value);
        this._ble
            .write(service, characteristic, data, "base64", false)
            .then(() => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            });
    }

    scan() {
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(
            this._runtime,
            this._extensionId,
            {
                filters: [
                    {
                        services: [BLEUUID.get_service, BLEUUID.set_service],
                    },
                ],
            },
            this._onConnect,
            this.disconnect
        );
    }
    /**
     * Called by the runtime when user wants to connect to a certain peripheral.
     * @param {number} id - the id of the peripheral to connect to.
     */
    connect(id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }
    /**
     * Disconnect from the jikko.
     */
    disconnect() {
        window.clearInterval(this._timeoutID);
        if (this._ble) {
            this._ble.disconnect();
        }
    }
    /**
     * Return true if connected to the micro:bit.
     * @return {boolean} - whether the micro:bit is connected.
     */
    isConnected() {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        return connected;
    }

    //Get 해오는 건 우선 보류
    /**
     * Starts reading data from peripheral after BLE has connected to it.
     * @private
     */
    _onConnect() {
        this._ble.read(
            BLEUUID.get_service,
            BLEUUID.get_button,
            true,
            this._onMessage
        );
        this._timeoutID = window.setInterval(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }
    _onMessage(base64) {
        const data = Base64Util.base64ToUint8Array(base64);
        /*
        this._robot_is_moving = data[0];
        this._battery.volt_level = data[1] / 10.0;
        this._battery.low_warning = data[2];
        this._user_button = data[3];
        */
        this._user_button = data[0];

        // cancel disconnect timeout and start a new one
        window.clearInterval(this._timeoutID);
        this._timeoutID = window.setInterval(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }
}

/**
 * Scratch 3.0 blocks to interact with a jikko peripheral.
 */
class Scratch3JikkoBlocks {
    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME() {
        return "Jikko";
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID() {
        return "jikko";
    }

    /**
     * Construct a set of jikko blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor(runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new jikko peripheral instance
        this._peripheral = new Jikko(
            this.runtime,
            Scratch3JikkoBlocks.EXTENSION_ID
        );
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: Scratch3JikkoBlocks.EXTENSION_ID,
            name: Scratch3JikkoBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: "setDigitalPin",
                    text: formatMessage({
                        id: "jikko.setDigitalPin",
                        default:
                            "디지털 [DIGITAL_PIN] 핀 디지털 값 [DIGITAL_TOGGLE] 출력",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 4,
                        },
                        DIGITAL_TOGGLE: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_TOGGLE",
                            defaultValue: 1,
                        },
                    },
                },
                {
                    opcode: "setPWMPin",
                    text: formatMessage({
                        id: "jikko.setPWMPin",
                        default:
                            "PWM [DIGITAL_PIN] 핀 아날로그 값 [PWM_VALUE] 출력 (0~255)",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 4,
                        },
                        PWM_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255,
                        },
                    },
                },

                "---",
                {
                    opcode: "setLedDigitalPin",
                    text: formatMessage({
                        id: "jikko.setLedDigitalPin",
                        default: "LED [DIGITAL_PIN] 핀 [DIGITAL_TOGGLE_KO]",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 4,
                        },
                        DIGITAL_TOGGLE_KO: {
                            type: ArgumentType.STRING,
                            menu: "DIGITAL_TOGGLE_KO",
                            defaultValue: 1,
                        },
                    },
                },
                {
                    opcode: "setLEDPWMPin",
                    text: formatMessage({
                        id: "jikko.setLEDPWMPin",
                        default:
                            "LED (PWM [DIGITAL_PIN] 핀) 밝기 [PWM_VALUE] 출력 (0~255)",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 4,
                        },
                        PWM_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255,
                        },
                    },
                },
                "---",
                {
                    opcode: "setBuzzerToggle",
                    text: formatMessage({
                        id: "jikko.setBuzzerToggle",
                        default:
                            "피에조부저 [DIGITAL_PIN] 핀 [DIGITAL_TOGGLE_KO]",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 4,
                        },
                        DIGITAL_TOGGLE_KO: {
                            type: ArgumentType.STRING,
                            menu: "DIGITAL_TOGGLE_KO",
                            defaultValue: 1,
                        },
                    },
                },
                {
                    opcode: "setBuzzerPWM",
                    text: formatMessage({
                        id: "jikko.setBuzzerPWM",
                        default:
                            "피에조부저 [DIGITAL_PIN] 핀 음량 [VOLUME] 출력 (0~255)",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 4,
                        },
                        VOLUME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255,
                        },
                    },
                },
                {
                    opcode: "setBuzzerPlay",
                    text: formatMessage({
                        id: "jikko.setBuzzerPlay",
                        default:
                            "피에조부저 [DIGITAL_PIN] 핀 [NOTE]음(hz) [BUZZER_BEATS] 박자 연주",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 4,
                        },
                        NOTE: {
                            type: ArgumentType.NOTE,
                            defaultValue: 60,
                        },
                        BUZZER_BEATS: {
                            type: ArgumentType.NUMBER,
                            menu: "BUZZER_BEATS",
                            defaultValue: 1,
                        },
                    },
                },
                "---",
                {
                    opcode: "setServo",
                    text: formatMessage({
                        id: "jikko.setServo",
                        default:
                            "서보모터 [DIGITAL_PIN] 핀 [DEGREE] 각도로 회전",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 4,
                        },
                        DEGREE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 180,
                        },
                    },
                },
                {
                    opcode: "setDigitalDCMotor",
                    text: formatMessage({
                        id: "jikko.setDigitalDCMotor",
                        default: "DC모터 [DIGITAL_PIN] 핀 [DIGITAL_TOGGLE_KO]",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 4,
                        },
                        DIGITAL_TOGGLE_KO: {
                            type: ArgumentType.STRING,
                            menu: "DIGITAL_TOGGLE_KO",
                            defaultValue: 1,
                        },
                    },
                },
                {
                    opcode: "setPWMDCMotor",
                    text: formatMessage({
                        id: "jikko.setPWMDCMotor",
                        default:
                            "DC모터 [DIGITAL_PIN] 핀 세기 [PWM_VALUE] 출력 (0~255)",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 4,
                        },
                        PWM_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255,
                        },
                    },
                },
                "---",

                {
                    opcode: "whenButtonPressed",
                    text: formatMessage({
                        id: "jikko.whenButtonPressed",
                        default: "when button pressed",
                        description: "when the button on the jikko is pressed",
                    }),
                    blockType: BlockType.HAT,
                    arguments: {},
                },
                {
                    opcode: "isButtonPressed",
                    text: formatMessage({
                        id: "jikko.isButtonPressed",
                        default: "button pressed?",
                        description: "is the button on the jikko pressed?",
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {},
                },
                "---",
                {
                    opcode: "setNEOInit",
                    text: formatMessage({
                        id: "jikko.setNEOInit",
                        default:
                            "네오픽셀 LED 시작하기 설정 ([DIGITAL_PIN] 핀에 [NUM]개의 LED 연결)",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 2,
                        },
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 4,
                        },
                    },
                },
                {
                    opcode: "setNEOBright",
                    text: formatMessage({
                        id: "jikko.setNEOBright",
                        default:
                            "네오픽셀 LED([DIGITAL_PIN] 핀) 밝기 [BRIGHTNESS] 으로 설정 (0~255)",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 2,
                        },
                        BRIGHTNESS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255,
                        },
                    },
                },
                {
                    opcode: "setNumNeo",
                    text: formatMessage({
                        id: "jikko.setNumNeo",
                        default:
                            "네오픽셀 LED ( [DIGITAL_PIN] 핀) [NUM] 번째 LED 색 [ALL_COLOR] 출력",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 2,
                        },
                        NUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                        },
                        ALL_COLOR: {
                            type: ArgumentType.COLOR,
                        },
                    },
                },
                {
                    opcode: "setAllNeo",
                    text: formatMessage({
                        id: "jikko.setAllNeo",
                        default:
                            "네오픽셀 LED ( [DIGITAL_PIN] 핀) 모든 LED 색 [ALL_COLOR] 출력",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 2,
                        },
                        ALL_COLOR: {
                            type: ArgumentType.COLOR,
                        },
                    },
                },
                {
                    opcode: "setNEOClear",
                    text: formatMessage({
                        id: "jikko.setNEOClear",
                        default:
                            "네오픽셀 LED ( [DIGITAL_PIN] 핀) 모든 LED 끄기",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DIGITAL_PIN: {
                            type: ArgumentType.NUMBER,
                            menu: "DIGITAL_PIN",
                            defaultValue: 2,
                        },
                    },
                },
                "---",
                {
                    opcode: "setLCDInit",
                    text: formatMessage({
                        id: "jikko.setLCDInit",
                        default: "I2C LCD 시작하기 설정 ([COLUMN] 열 [ROW] 행)",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLUMN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 16,
                        },
                        ROW: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2,
                        },
                    },
                },
                {
                    opcode: "setLCDText",
                    text: formatMessage({
                        id: "jikko.setLCDText",
                        default: "LCD [COLUMN] 열 [ROW] 행 부터 [TEXT] 출력",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COLUMN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        ROW: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: "HELLO, JIKKO!",
                        },
                    },
                },
                {
                    opcode: "setLCDClear",
                    text: formatMessage({
                        id: "jikko.setLCDClear",
                        default: "LCD 화면 지우기",
                        description: "",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {},
                },
                "---",
            ],
            menus: {
                DIGITAL_PIN: [
                    { text: "2", value: 2 },
                    { text: "4", value: 4 },
                    { text: "5", value: 5 },
                    { text: "12", value: 12 },
                    { text: "13", value: 13 },
                    { text: "14", value: 14 },
                    { text: "15", value: 15 },
                    { text: "18", value: 18 },
                    { text: "19", value: 19 },
                    { text: "23", value: 23 },
                    { text: "25", value: 25 },
                    { text: "26", value: 26 },
                    { text: "27", value: 27 },
                    { text: "32", value: 32 },
                    { text: "33", value: 33 },
                ],
                BUZZER_BEATS: [
                    { text: "4", value: 4 },
                    { text: "2", value: 2 },
                    { text: "1", value: 1 },
                    { text: "0.5", value: 0.5 },
                    { text: "0.25", value: 0.25 },
                ],
                DIGITAL_TOGGLE_KO: [
                    { text: "켜기", value: 1 },
                    { text: "끄기", value: 0 },
                ],
                DIGITAL_TOGGLE: [
                    { text: "HIGH", value: 1 },
                    { text: "LOW", value: 0 },
                ],
            },
        };
    }
    whenButtonPressed(args) {
        return this._peripheral.userButton;
    }

    isButtonPressed(args) {
        return this._peripheral.userButton;
    }

    setDigitalPin(args) {
        this._peripheral.setPin(0, args.DIGITAL_PIN, args.DIGITAL_TOGGLE);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setPWMPin(args) {
        var value = args.PWM_VALUE;
        value = Math.min(value, 180);
        value = Math.max(value, 0);
        this._peripheral.setPin(1, args.DIGITAL_PIN, value);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setLedDigitalPin(args) {
        this._peripheral.setPin(0, args.DIGITAL_PIN, args.DIGITAL_TOGGLE_KO);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setLEDPWMPin(args) {
        var value = parseInt(args.PWM_VALUE);
        value = Math.min(value, 255);
        value = Math.max(value, 0);
        this._peripheral.setPin(1, args.DIGITAL_PIN, value);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setBuzzerToggle(args) {
        this._peripheral.setPin(0, args.DIGITAL_PIN, args.DIGITAL_TOGGLE_KO);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setBuzzerPWM(args) {
        var value = parseInt(args.VOLUME);
        value = Math.min(value, 255);
        value = Math.max(value, 0);
        this._peripheral.setPin(1, args.DIGITAL_PIN, value);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setBuzzerPlay(args) {
        let note = parseInt(args.NOTE);
        let beats = parseInt(args.BUZZER_BEATS); //value
        var beats_delay = beats * 1000;

        this._peripheral.setBuzzerPlay(args.DIGITAL_PIN, note, beats);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, beats_delay + 50); //beats 초동안 재생
        });
    }

    setServo(args) {
        var value = parseInt(args.DEGREE);
        value = Math.min(value, 180);
        value = Math.max(value, 0);
        this._peripheral.setPin(2, args.DIGITAL_PIN, value);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setDigitalDCMotor(args) {
        this._peripheral.setPin(0, args.DIGITAL_PIN, args.DIGITAL_TOGGLE_KO);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setPWMDCMotor(args) {
        var value = args.PWM_VALUE;
        value = Math.min(value, 180);
        value = Math.max(value, 0);
        this._peripheral.setPin(1, args.DIGITAL_PIN, value);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setNEOInit(args) {
        this._peripheral.setLEDLamp(0, args.DIGITAL_PIN, args.NUM, 0);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setNEOBright(args) {
        this._peripheral.setLEDLamp(1, args.DIGITAL_PIN, args.BRIGHTNESS, 0);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }
    setNumNeo(args) {
        this._peripheral.setLEDLamp(
            3,
            args.DIGITAL_PIN,
            args.ALL_COLOR,
            args.NUM
        );

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }
    setAllNeo(args) {
        this._peripheral.setLEDLamp(4, args.DIGITAL_PIN, args.ALL_COLOR, 0);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setNEOClear(args) {
        this._peripheral.setLEDLamp(2, args.DIGITAL_PIN, "#000000", 0);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setLCDInit(args) {
        this._peripheral.setLCDText(0, args.COLUMN, args.ROW, 0, 0);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }
    setLCDClear(args) {
        this._peripheral.setLCDText(1, 0, 0, 0, 0);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }
    setLCDText(args) {
        var textLen = ("" + args.TEXT).length;
        //const text = String(args.TEXT).substring(0, 19);

        if (textLen > 0) {
            this._peripheral.setLCDText(
                2,
                args.COLUMN,
                args.ROW,
                textLen,
                args.TEXT
            );
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }
}

module.exports = Scratch3JikkoBlocks;
