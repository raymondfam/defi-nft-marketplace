(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[687],{51553:function(n,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/mint",function(){return r(11763)}])},11763:function(n,t,r){"use strict";r.r(t),r.d(t,{default:function(){return l}});var e=r(34051),u=r.n(e),o=r(85893),c=r(22806),a=r(83078),s=r(96301),i=r(67294);function f(n,t,r,e,u,o,c){try{var a=n[o](c),s=a.value}catch(i){return void r(i)}a.done?t(s):Promise.resolve(s).then(e,u)}function p(n){return function(){var t=this,r=arguments;return new Promise((function(e,u){var o=n.apply(t,r);function c(n){f(o,e,u,c,a,"next",n)}function a(n){f(o,e,u,c,a,"throw",n)}c(void 0)}))}}function l(){var n=function(n,t){r({type:t,title:n,position:"topR"})},t=(0,a.JX)().runContractFunction,r=(0,c.lm)(),e={abi:s.achieverAbi,contractAddress:s.achieverAddress,functionName:"approve"},f={abi:s.nftAbi,contractAddress:s.nftAddress,functionName:"mint"},l=(0,a.JX)({abi:s.nftAbi,contractAddress:s.nftAddress,functionName:"cost",params:{}}).runContractFunction,d=(0,i.useState)(0),m=d[0],h=d[1],v=(0,i.useState)(0),b=v[0],w=v[1];function x(){return(x=p(u().mark((function r(){return u().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(console.log({mintAmount:b,cost:m}),b){r.next=4;break}return n("Error: No Value Selected","error"),r.abrupt("return");case 4:return e.params={spender:s.nftAddress,amount:m},r.next=7,t({params:e,onError:function(n){return console.log(n)},onSuccess:function(){console.log("suces"),y()}});case 7:case"end":return r.stop()}}),r)})))).apply(this,arguments)}function y(){return N.apply(this,arguments)}function N(){return(N=p(u().mark((function r(){return u().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return f.params={_mintAmount:b,_amountIn:m},r.next=3,t({params:f,onError:function(t){console.log(t),n("Error: Rejected","error")},onSuccess:function(){return n("Successfully minted NFT","success")}});case 3:case"end":return r.stop()}}),r)})))).apply(this,arguments)}function _(){return(_=p(u().mark((function n(t){var r,e;return u().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r=t.target.value,n.next=3,A(r);case 3:e=n.sent,h(e.toString()),w(r);case 6:case"end":return n.stop()}}),n)})))).apply(this,arguments)}var A=function(){var n=p(u().mark((function n(t){return u().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,k();case 2:return n.t0=n.sent,n.t1=t,n.abrupt("return",n.t0*n.t1);case 5:case"end":return n.stop()}}),n)})));return function(t){return n.apply(this,arguments)}}();function k(){return E.apply(this,arguments)}function E(){return(E=p(u().mark((function n(){var t;return u().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,l({onError:function(n){return console.log(n)}});case 2:return t=n.sent,n.abrupt("return",t);case 4:case"end":return n.stop()}}),n)})))).apply(this,arguments)}return(0,o.jsx)("div",{className:"px-5",children:(0,o.jsx)(c.l0,{onSubmit:function(){return x.apply(this,arguments)},onChange:function(n){return _.apply(this,arguments)},id:"mint-form",data:[{selectOptions:[{id:"1",label:"1"},{id:"2",label:"2"},{id:"3",label:"3"},{id:"4",label:"4"},{id:"5",label:"5"}],name:"Amount to mint (Max: 5)",type:"select",value:""}],title:"NFT MINT NOW!!"})})}}},function(n){n.O(0,[301,774,888,179],(function(){return t=51553,n(n.s=t);var t}));var t=n.O();_N_E=t}]);