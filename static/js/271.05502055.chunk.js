"use strict";(self.webpackChunkrelay=self.webpackChunkrelay||[]).push([[271],{9271:function(e,n,t){t.r(n),t.d(n,{default:function(){return I}});var r=t(2982),a=t(8683),o=t(885),d=t(2791),s=t(3504),i=t(184),c=function(e){var n=e.wordIndex,t=e.mode,r=e.state,s=e.selected,c=e.setSelected,l=r.inputs[n],x=r.hints[n],f=(0,d.useState)(l.split("")),h=(0,o.Z)(f,2),v=h[0],b=h[1],w=(0,d.useRef)(null);(0,d.useEffect)((function(){b(l.split(""))}),[l]);var m="wordbox";return s.wordIndex===n&&(m+=" wordbox-selected"),(0,i.jsx)("div",{tabIndex:0,className:m,ref:w,onClick:function(){c((function(e){return(0,a.Z)((0,a.Z)({},e),{},{wordIndex:n})}))},onBlur:function(){c({wordIndex:-1,charIndex:-1})},children:(0,i.jsx)(u,{charArray:v,wordIndex:n,selected:s,hint:x,mode:t,updateSelected:function(e){c({wordIndex:n,charIndex:e})}})})},u=function(e){for(var n=e.charArray,t=e.wordIndex,r=e.selected,a=e.hint,o=e.mode,d=e.updateSelected,s=[],c=null,u=function(e){c=l(t,e,r,a[e],o),s.push((0,i.jsxs)("div",{className:c,onClick:function(){return d(e)},children:[(0,i.jsx)("div",{className:"charbox-text",children:n[e]}),(0,i.jsx)("div",{className:"charbox-underline"})]},e))},x=0;x<n.length;x++)u(x);return(0,i.jsx)(i.Fragment,{children:s})},l=function(e,n,t,r,a){var o="charbox";return" "!==r&&(o+=" charbox-hint"),(n<a.overlapLen&&e>0||n>=a.wordLen-a.overlapLen&&e<a.noOfWords-1)&&(o+=" charbox-overlap"),e===t.wordIndex&&n===t.charIndex&&(o+=" charbox-selected"),o},x=(0,d.memo)(c),f=function(e){var n=e.keys,t=e.boardRef,r=function(e){e.preventDefault()};return(0,i.jsx)("div",{children:n.map((function(e,n){return(0,i.jsx)("div",{className:"btn key-button",onClick:function(n){return function(e,n){var r=new KeyboardEvent("keydown_buttons",{key:e});t.current.dispatchEvent(r)}(e)},onMouseDown:r,children:e},n)}))})},h=t(917),v=t(8587),b=(0,d.lazy)((function(){return t.e(940).then(t.bind(t,7940))})),w=function(e){var n=(0,d.useState)(v.BH),t=(0,o.Z)(n,2),c=t[0],u=t[1],l=(0,d.useState)(v.vJ),w=(0,o.Z)(l,2),I=w[0],j=w[1],C=(0,d.useState)([]),k=(0,o.Z)(C,2),y=k[0],N=k[1],E=(0,d.useState)({wordIndex:-1,charIndex:-1}),Z=(0,o.Z)(E,2),S=Z[0],g=Z[1],R=(0,d.useState)({res:null,data:""}),A=(0,o.Z)(R,2),q=A[0],L=A[1],D=(0,d.useState)(!1),O=(0,o.Z)(D,2),W=O[0],z=O[1],B=(0,s.lr)(),H=(0,o.Z)(B,2),M=H[0],K=(H[1],(0,d.useRef)(null));(0,d.useEffect)((function(){var e,n=M.get("puzzle");e=null!==n?h.q.genPuzzleFromEncoded(n):h.q.genPuzzle(),u(h.q.getMode().data),j(e.data),N(h.q.getKeys().data),z(!1)}),[M]);var P=function(e){var n=S.wordIndex,t=S.charIndex;if(!(t>=c.wordLen||t<0)){var o=e.key.toUpperCase(),d=(0,r.Z)(I.inputs),s=d[n].split(""),i=I.hints[n];1===o.length?(t<c.wordLen&&" "===i[t]&&(s[t]=o,d[n]=s.join(""),j((function(e){return(0,a.Z)((0,a.Z)({},e),{},{inputs:d})}))),t<c.wordLen-1&&t++):"DELETE"===o||"BACKSPACE"===o?(" "===i[t]&&(s[t]=" ",d[n]=s.join(""),j((function(e){return(0,a.Z)((0,a.Z)({},e),{},{inputs:d})}))),"BACKSPACE"===o&&t>0&&t--):"ENTER"===o?function(e,n){var t=h.q.validateInput(e,n);L(t)}(n,s.join("")):"ARROWLEFT"===o?t>0&&t--:"ARROWRIGHT"===o?t<c.wordLen-1&&t++:"ARROWUP"===o?n>0&&n--:"ARROWDOWN"===o&&n<c.noOfWords-1&&n++,g({wordIndex:n,charIndex:t})}};return(0,d.useEffect)((function(){var e=K.current;return e.addEventListener("keydown_buttons",P),function(){e.removeEventListener("keydown_buttons",P)}}),[P]),(0,i.jsxs)("div",{className:"container board",children:[(0,i.jsx)("div",{tabIndex:0,className:"board-panel",ref:K,onKeyDown:P,children:I.inputs.map((function(e,n){return(0,i.jsx)(x,{wordIndex:n,mode:c,state:I,selected:S,setSelected:g},n)}))}),(0,i.jsxs)("div",{className:"board-control",children:[(0,i.jsx)("div",{children:"".concat(q.data)}),(0,i.jsx)(m,{onClickClear:function(){var e=(0,a.Z)({},I);e.inputs=(0,r.Z)(e.hints),j(e)},onClickHint:function(){var e=null;if((e=-1===S.charIndex?h.q.addHint(S.wordIndex):h.q.addHint(S.wordIndex,S.charIndex)).status===v.bb){var n=(0,a.Z)({},I),t=K.current.getElementsByClassName("wordbox")[S.wordIndex].textContent;n.hints=(0,r.Z)(h.q.getHints().data),n.inputs[S.wordIndex]=t.slice(0,e.data.index)+e.data.hint+t.slice(e.data.index+1),j(n)}else L(e)},onClickValidate:function(){if(!(S.wordIndex<0||S.wordIndex>=c.noOfWords)){var e=K.current.getElementsByClassName("wordbox")[S.wordIndex].textContent,n=h.q.validateInput(S.wordIndex,e);L(n)}}}),(0,i.jsx)(f,{keys:y,boardRef:K}),(0,i.jsx)("div",{className:"btn board-button board-submit-button",onClick:function(){var e=Array.from(K.current.getElementsByClassName("wordbox")).map((function(e){return e.textContent})),n=h.q.validateAll(e);L(n),n.status===v.bb&&z(!0)},onMouseDown:p,children:"Submit"})]}),(0,i.jsx)(d.Suspense,{children:(0,i.jsx)(b,{show:W,inputs:I.inputs,dismiss:function(){return z(!1)}})})]})},m=function(e){var n=e.onClickClear,t=e.onClickHint,r=e.onClickValidate;return(0,i.jsxs)("div",{children:[(0,i.jsx)("span",{className:"fa-2x",onClick:n,onMouseDown:p,children:(0,i.jsx)("i",{className:"fa-solid fa-rotate-right board-icon-button"})}),(0,i.jsx)("span",{className:"fa-2x",onClick:t,onMouseDown:p,children:(0,i.jsx)("i",{className:"fa-solid fa-square-h board-icon-button"})}),(0,i.jsx)("span",{className:"fa-2x",onClick:r,onMouseDown:p,children:(0,i.jsx)("i",{className:"fa-regular fa-circle-check board-icon-button"})})]})},p=function(e){e.preventDefault()},I=(0,d.memo)(w)}}]);
//# sourceMappingURL=271.05502055.chunk.js.map