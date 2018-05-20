require('bootstrap');
const ko = require('knockout');
const steem = require('steem');

window.onload = function() {
  let Payee = function(addr = '', amt = '') {
    this.address = ko.observable(addr);
    this.amount = ko.observable(amt).extend({ numeric: 3 });
  };

  ko.extenders.numeric = (target, precision) => {
    let result = ko
      .pureComputed({
        read: target,
        write: newValue => {
          let current = target();
          let roundingMultiplier = Math.pow(10, precision);
          let newValueAsNum = isNaN(newValue) ? 0 : +newValue;
          let valueToWrite =
            Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
          valueToWrite = valueToWrite.toFixed(precision, 0);
          if (valueToWrite !== current) {
            target(valueToWrite);
          } else {
            if (newValue !== current) {
              target.notifySubscribers(valueToWrite);
            }
          }
        }
      })
      .extend({ notify: 'always' });
    result(target());
    return result;
  };

  let vm = function(defaultPayees = []) {
    this.memo = ko.observable('https://httpstat.us/200');
    this.payees = ko.observableArray(defaultPayees);
    this.showJson = ko.observable(true);
    this.total = ko.computed(
      () => this.payees().reduce((a,c) => a + +c.amount(), 0).toFixed(3,0),
      this
    );
    this.pay = () => {
      console.log('Pay method not yet implemented.');
    };
    this.wif = ko.observable('');  
    this.payer = ko.observable('');
  };

  let defaults = [
    new Payee('promobot', 9.95),
    new Payee('rocky1', 3.0),
    new Payee('estabond', 0.1),
    new Payee('mercurybot', 0.25),
    new Payee('therising', 3.0),
    new Payee('upme', 3.0),
    new Payee('smartsteem', 5.0),
    new Payee('jerrybanfield', 1.0),
    new Payee('pushup', 0.25),
    new Payee('boomerang', 1.5),
    new Payee('inciter', 0.25),
    new Payee('buildawhale', 5.0),
    new Payee('appreciator', 5.0),
    new Payee('ebargains', 1.0)
  ];

  ko.applyBindings(new vm(defaults));
};
