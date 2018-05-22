require('bootstrap');
const ko = require('knockout');
const steem = require('steem');
const options = {
  url: 'wss://testnet.steem.vc',
  address_prefix: 'STX',
  chain_id: '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673'
}


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
    let self = this;
    this.memo = ko.observable('https://httpstat.us/200');
    this.payees = ko.observableArray(defaultPayees);
    this.showJson = ko.observable(true);
    this.total = ko.computed(
      () =>
        this.payees()
          .reduce((a, c) => a + +c.amount(), 0)
          .toFixed(3, 0),
      this
    );
    this.pay = () => {
      steem.api.setOptions(options);
      let promises = self.payees().map(payee => {
        let promise = new Promise((resolve, reject) => {
          steem.broadcast.transfer(
            self.wif(),
            self.payer(),
            payee.address(),
            payee.amount(),
            self.memo(),
            (err, result) => {
              if (err) {
                console.error(err);
                reject(err);
              } else {
                console.log(result);
                resolve(result);
              }
            }
          );
        });
        return promise;
      });
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
