import {Dep} from './observer.js'

export function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.depIds = {};
    this.value = this.get();
}

Watcher.prototype = {
    update: function () {
        this.run();
    },
    run: function () {
        var value = this.get();
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    addDep: function (dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    },
    get: function () {
        Dep.target = this;
        var value = this.getVMVal(this.exp);
        Dep.target = null;
        return value;
    },

    getVMVal: function (exp) {
        var that = this;
        var val = this.vm._data;
        var pattern = new RegExp("^\\[(.*?)\\]$");
        var result = exp.match(pattern);
        var resultArray = [];
        var exp1, exp2, exp3;
        if (result) {
            resultArray = result[1].split(',');
            resultArray = resultArray.map(function (exp) {
                if (exp.indexOf("?") >= 0) {
                    exp1 = (exp.split("?"))[0];
                    exp2 = ((exp.split("?"))[1].split(":"))[0];
                    exp3 = ((exp.split("?"))[1].split(":"))[1];
                    if (that.getVMVal(exp1)) {
                        return that.getVMVal(exp2);
                    } else {
                        return that.getVMVal(exp3);
                    }
                } else {
                    return that.getVMVal(exp);
                }
            });
            result = resultArray;
        } else {
            exp = exp.split('.');
            exp.forEach(function (k) {
                val = val[k];
            });
            result = val;
        }
        return result;
    }
};