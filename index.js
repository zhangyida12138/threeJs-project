const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        this.status = PENDING;
        this.result = undefined;
        this.handlers = [];
        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.result = value;
                this.handlers.forEach(handler => handler());
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.result = reason;
                this.handlers.forEach(handler => handler());
            }
        }
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    static #resolvePromise(promise, x, resolve, reject) {
        if(promise === x) {
            return reject(new TypeError('Chaining cycle detected for promise'));
        }
        if(typeof x === 'object' && x !== null || typeof x === 'function') {
            let called = false;
            try {
                let then = x.then;
                if(typeof then === 'function') {
                    then.call(x, y => {
                        if(called) return;
                        called = true;
                        MyPromise.#resolvePromise(promise, y, resolve, reject);
                    }, r => {
                        if(called) return;
                        called = true;
                        reject(r);
                    });
                }else {
                    resolve(x);
                }
            }
            catch (error) {
                if(called) return;
                called = true;
                reject(error);
            }
        }else {
            resolve(x);
        }
    }
}