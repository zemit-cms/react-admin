import Hash from "./Hash";

export default class Shortcut {

    constructor() {
        this.list = {};
        this.callbacks = {};
        this.rootElement = null;
    }

    attachEvent(event) {

        let keys = [];
        if (event.ctrlKey) {
            keys.push('ControlLeft');
        }
        if (event.altKey) {
            keys.push('AltLeft');
        }

        if (keys.indexOf(event.code) === -1) {
            keys.push(event.code);
        }

        return this.run(keys, event);
    }

    attach(rootElement) {
        this.rootElement = rootElement;
        this.rootElement.addEventListener('keydown', this.attachEvent.bind(this));
    }

    detach() {

        if (!this.rootElement) {
            return;
        }

        this.rootElement.removeEventListener('keydown', this.attachEvent.bind(this));
    }

    keysToString(keys) {
        return keys.sort().filter(function (el) {
            return el != null && el.trim() !== '';
        }).join('+');
    }

    // TODO: Parameter to accept INPUT/TEXTAREA/CONTENTEDITABLE
    add(name, desc, group, keys, callback = () => {}, includeFields = false, includeInHelp = true) {

        let originalKeys = keys;

        let arrKeys = keys;
        if (!Array.isArray(arrKeys)) {
            arrKeys = [arrKeys];
        }

        let keysStr = this.keysToString(arrKeys);

        if (!this.list[keysStr]) {
            this.list[keysStr] = [];
        }

        this.list[keysStr].push({name, keys, arrKeys, desc, group, originalKeys, callback, includeFields, includeInHelp});

        let callbackRef = Hash.guid();
        this.callbacks[callbackRef] = {
            keys: arrKeys,
            index: this.list[keysStr].length - 1
        };
        // Object.getPrototypeOf(callback).__zmShortcutReference = callbackRef;
        callback.__zmShortcutReference = callbackRef;
    }

    remove(callback = () => {}) {

        // let proto = Object.getPrototypeOf(callback);
        // let ref = proto.__zmShortcutReference;
        let ref = callback.__zmShortcutReference;
        if (!ref) {
            return;
        }

        let info = this.callbacks[ref];
        if (info) {

            if (!(info.keys instanceof Array)) {
                info.keys = [info.keys];
            }

            let keyStr = this.keysToString(info.keys);
            if (this.list[keyStr]) {
                this.list[keyStr].splice(info.index, 1);
                delete this.callbacks[ref];
            }
        }
    }

    run(keys, event) {

        // let inputTags = ['INPUT', 'TEXTAREA'];
        // let target = event.target;
        // let tagName = target.tagName.toUpperCase();
        // let isInInput = inputTags.indexOf(tagName) !== -1
        // 	|| target.getAttribute('contenteditable') !== null;

        let keyStr = this.keysToString(keys);

        if (!this.list[keyStr] || this.list[keyStr].length === 0) {
            return;
        }

        this.list[keyStr].forEach(shortcut => {

            // if (!shortcut.includeFields && !event.altKey) {// && isInInput) {
            // 	return;
            // }

            shortcut.callback(event);
        });
    }
}
