"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AwsKeyService {
    constructor(id, title) {
        this.id = id;
        this.title = title;
    }
    generateKey(prefix, randomStr) {
        let key = `${prefix}/${this.id}/${this.id}-${this.title.replace(/\s/g, "-")}`;
        return randomStr ? `${key}-${randomStr}` : key;
    }
    offer(randomStr) {
        return this.generateKey("offers", randomStr);
    }
    offerSection(randomStr) {
        return this.generateKey("offerSections", randomStr);
    }
    service(randomStr) {
        return this.generateKey("services", randomStr);
    }
    section(randomStr) {
        return this.generateKey("sections", randomStr);
    }
}
exports.default = AwsKeyService;
