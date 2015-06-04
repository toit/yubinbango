/// <reference path="./yubinbango-core/yubinbango-core.ts"/>

const ISO31661JP = ["Japan", "JP", "JPN", "JAPAN"];
const HADRLIST = ["p-region", "p-locality", "p-street-address", "p-extended-address"];
module YubinBango {
  export class MicroformatDom {
    constructor(
      ) {
      document.addEventListener('DOMContentLoaded', () => { this.hadrloop() }, false);
    }
    hadrloop() {
      // HTML内のh-adr要素のリストに対して操作を行う
      var hadrs = document.querySelectorAll('.h-adr');
      [].map.call(hadrs, (hadr) => {
        // country-name が日本かどうかチェック
        if (this.countryNameCheck(hadr)) {
          // 郵便番号の入力欄を取得
          let postalcode = hadr.querySelectorAll('.p-postal-code');
          // 郵便番号入力欄が1つの場合でも3桁-4桁で2つに分かれている場合でも両方に対応するため、それぞれのh-adr内の中の最後のpostal-codeにkeyupイベントを付与する
          postalcode[postalcode.length - 1].addEventListener("keyup", function() { MicroformatDom.prototype.applyDom(hadr) }, false);
        }
      });
    }
    // 日本かどうかチェックする
    countryNameCheck(elm) {
      let a = elm.querySelector('.p-country-name');
      let arr:string[] = [a.innerHTML, a.value];
      return (arr.some((val: string) => (ISO31661JP.indexOf(val) >= 0)))
    }
    applyDom(elm) {
      let postalcode = elm.querySelectorAll('.p-postal-code');
      new YubinBango.Core(this.reduceVal(postalcode), (address) => this.setAddr(elm, address));
    }
    reduceVal(postalcode: any[]): string {
      return [].map.call(postalcode, a => a.value).reduce((a, b) => a + b);
    }
    setAddr(elm, address) {
      let fnlist = [this.postalFormClear, this.postalFormSet];
      // 住所欄に入力されているデータを削除 & 住所欄に入力
      fnlist.map((fn) => HADRLIST.map((val: string) => fn(val, elm, address)));
    }
    postalFormClear(val: string, elm, data?) {
      if (data){
        var addrs = elm.querySelectorAll('.' + val);
        [].map.call(addrs, (addr) => {
          return addr.value = '';
        });
      }
    }
    postalFormSet(val: string, elm, data?) {
      let o = {
        "p-region": data.region,
        "p-locality": data.locality,
        "p-street-address": data.street,
        "p-extended-address": data.extended
      };
      var addrs = elm.querySelectorAll('.' + val);
      [].map.call(addrs, (addr) => {
        return addr.value += (o[val])? o[val] : '';
      });
    }
  }
}
new YubinBango.MicroformatDom();
