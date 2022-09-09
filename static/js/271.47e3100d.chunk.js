"use strict";(self.webpackChunkrelay=self.webpackChunkrelay||[]).push([[271],{9271:function(n,e,t){t.r(e),t.d(e,{default:function(){return j}});var a=t(2982),r=t(8683),o=t(885),s=t(2791),c=t(3504),i=t(184),d=function(n){var e=n.wordIndex,t=n.mode,a=n.state,c=n.selected,d=n.setSelected,u=a.inputs[e],f=a.hints[e],x=(0,s.useState)(u.split("")),h=(0,o.Z)(x,2),v=h[0],m=h[1],b=(0,s.useRef)(null);(0,s.useEffect)((function(){m(u.split(""))}),[u]);var p="wordbox";return c.wordIndex===e&&(p+=" wordbox-selected"),(0,i.jsx)("div",{tabIndex:0,className:p,ref:b,onClick:function(){d((function(n){return(0,r.Z)((0,r.Z)({},n),{},{wordIndex:e})}))},onBlur:function(){d({wordIndex:-1,charIndex:-1})},children:(0,i.jsx)(l,{charArray:v,wordIndex:e,selected:c,hint:f,mode:t,updateSelected:function(n){d({wordIndex:e,charIndex:n})}})})},l=function(n){for(var e=n.charArray,t=n.wordIndex,a=n.selected,r=n.hint,o=n.mode,s=n.updateSelected,c=[],d=null,l=function(n){d=u(t,n,a,r[n],o),c.push((0,i.jsxs)("div",{className:d,onClick:function(){return s(n)},children:[(0,i.jsx)("div",{className:"charbox-text",children:e[n]}),(0,i.jsx)("div",{className:"charbox-underline"})]},n))},f=0;f<e.length;f++)l(f);return(0,i.jsx)(i.Fragment,{children:c})},u=function(n,e,t,a,r){var o="charbox";return" "!==a&&(o+=" charbox-hint"),(e<r.overlapLen&&n>0||e>=r.wordLen-r.overlapLen&&n<r.noOfWords-1)&&(o+=" charbox-overlap"),n===t.wordIndex&&e===t.charIndex&&(o+=" charbox-selected"),o},f=(0,s.memo)(d),x=function(n){var e=n.keys,t=n.boardRef,a=function(n){n.preventDefault()};return(0,i.jsx)("div",{className:"d-flex flex-wrap align-items-center justify-content-center",children:e.map((function(n,e){return(0,i.jsx)("div",{className:"key-button",onClick:function(e){return function(n,e){var a=new KeyboardEvent("keydown_buttons",{key:n});t.current.dispatchEvent(a)}(n)},onMouseDown:a,children:n},e)}))})},h=t(917),v=t(8587),m=(0,s.lazy)((function(){return t.e(391).then(t.bind(t,4391))})),b=function(n){var e=(0,s.useState)(v.BH),t=(0,o.Z)(e,2),d=t[0],l=t[1],u=(0,s.useState)(v.vJ),b=(0,o.Z)(u,2),k=b[0],j=b[1],C=(0,s.useState)([]),I=(0,o.Z)(C,2),N=I[0],y=I[1],E=(0,s.useState)({wordIndex:-1,charIndex:-1}),Z=(0,o.Z)(E,2),g=Z[0],S=Z[1],R=(0,s.useState)({res:null,data:""}),A=(0,o.Z)(R,2),D=A[0],L=A[1],q=(0,s.useState)(!1),B=(0,o.Z)(q,2),z=B[0],H=B[1],K=(0,c.lr)(),M=(0,o.Z)(K,2),O=M[0],W=(M[1],(0,s.useRef)(null));(0,s.useEffect)((function(){var n,e=O.get("puzzle");n=null!==e?h.q.genPuzzleFromEncoded(e):h.q.genPuzzle(),l(h.q.getMode().data),j(n.data),y(h.q.getKeys().data),H(!1)}),[O]);var P=function(n){L({res:null,data:""});var e=g.wordIndex,t=g.charIndex;if(!(t>=d.wordLen||t<0)){var o=n.key.toUpperCase(),s=(0,a.Z)(k.inputs),c=s[e].split(""),i=k.hints[e];1===o.length?(t<d.wordLen&&" "===i[t]&&(c[t]=o,s[e]=c.join(""),j((function(n){return(0,r.Z)((0,r.Z)({},n),{},{inputs:s})}))),t<d.wordLen-1&&t++):"DELETE"===o||"BACKSPACE"===o?(" "===i[t]&&(c[t]=" ",s[e]=c.join(""),j((function(n){return(0,r.Z)((0,r.Z)({},n),{},{inputs:s})}))),"BACKSPACE"===o&&t>0&&t--):"ENTER"===o?function(n,e){var t=h.q.validateInput(n,e);L(t)}(e,c.join("")):"ARROWLEFT"===o?t>0&&t--:"ARROWRIGHT"===o?t<d.wordLen-1&&t++:"ARROWUP"===o?e>0&&e--:"ARROWDOWN"===o&&e<d.noOfWords-1&&e++,S({wordIndex:e,charIndex:t})}},F=function(n,e){var t=new KeyboardEvent("keydown_buttons",{key:n});W.current.dispatchEvent(t)};return(0,s.useEffect)((function(){var n=W.current;return n.addEventListener("keydown_buttons",P),function(){n.removeEventListener("keydown_buttons",P)}}),[P]),(0,i.jsxs)("div",{className:"container board",children:[(0,i.jsx)("div",{tabIndex:0,className:"board-panel",ref:W,onKeyDown:P,children:k.inputs.map((function(n,e){return(0,i.jsx)(f,{wordIndex:e,mode:d,state:k,selected:g,setSelected:S},e)}))}),(0,i.jsxs)("div",{className:"board-control",children:[(0,i.jsx)("div",{className:"board-status",children:"".concat(D.data)}),(0,i.jsxs)("div",{children:[(0,i.jsx)(p,{onClickClear:function(){var n=(0,r.Z)({},k);n.inputs=(0,a.Z)(n.hints),j(n)},onClickHint:function(){var n=null;if((n=-1===g.charIndex?h.q.addHint(g.wordIndex):h.q.addHint(g.wordIndex,g.charIndex)).status===v.bb){var e=(0,r.Z)({},k),t=W.current.getElementsByClassName("wordbox")[g.wordIndex].textContent;e.hints=(0,a.Z)(h.q.getHints().data),e.inputs[g.wordIndex]=t.slice(0,n.data.index)+n.data.hint+t.slice(n.data.index+1),j(e)}else L(n)},onClickSubmit:function(){var n=Array.from(W.current.getElementsByClassName("wordbox")).map((function(n){return n.textContent})),e=h.q.validateAll(n);L(e),e.status===v.bb&&H(!0)}}),(0,i.jsx)(w,{onClickValid:function(n){return F("ENTER")},onClickBackspace:function(n){return F("BACKSPACE")}})]}),(0,i.jsx)(x,{keys:N,boardRef:W})]}),(0,i.jsx)(s.Suspense,{children:(0,i.jsx)(m,{show:z,inputs:k.inputs,dismiss:function(){return H(!1)}})})]})},p=function(n){var e=n.onClickClear,t=n.onClickHint,a=n.onClickSubmit;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("span",{className:"fa-2x",onClick:e,onMouseDown:k,children:(0,i.jsx)("i",{className:"fa-solid fa-rotate-right board-icon-button"})}),(0,i.jsx)("span",{className:"fa-2x",onClick:t,onMouseDown:k,children:(0,i.jsx)("i",{className:"fa-solid fa-square-h board-icon-button"})}),(0,i.jsx)("span",{className:"fa-2x",onClick:a,onMouseDown:k,children:(0,i.jsx)("i",{className:"fa-regular fa-circle-check board-icon-button"})})]})},w=function(n){var e=n.onClickValid,t=n.onClickBackspace;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("span",{className:"fa-2x",onClick:e,onMouseDown:k,children:(0,i.jsx)("i",{className:"fa-solid fa-spell-check board-icon-button"})}),(0,i.jsx)("span",{className:"fa-2x",onClick:t,onMouseDown:k,children:(0,i.jsx)("i",{className:"fa-solid fa-left-long board-icon-button"})})]})},k=function(n){n.preventDefault()},j=(0,s.memo)(b)}}]);
//# sourceMappingURL=271.47e3100d.chunk.js.map