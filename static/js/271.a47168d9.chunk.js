"use strict";(self.webpackChunkrelay=self.webpackChunkrelay||[]).push([[271],{9271:function(e,n,t){t.r(n),t.d(n,{default:function(){return j}});var r=t(2982),a=t(8683),s=t(885),o=t(2791),d=t(3504),i=t(184),c=function(e){var n=e.wordIndex,t=e.mode,r=e.state,d=e.selected,c=e.setSelected,l=r.inputs[n],x=r.hints[n],f=(0,o.useState)(l.split("")),h=(0,s.Z)(f,2),v=h[0],m=h[1],b=(0,o.useRef)(null);(0,o.useEffect)((function(){m(l.split(""))}),[l]);var w="wordbox";return d.wordIndex===n&&(w+=" wordbox-selected"),(0,i.jsx)("div",{tabIndex:0,className:w,ref:b,onClick:function(){c((function(e){return(0,a.Z)((0,a.Z)({},e),{},{wordIndex:n})}))},onBlur:function(){c({wordIndex:-1,charIndex:-1})},children:(0,i.jsx)(u,{charArray:v,wordIndex:n,selected:d,hint:x,mode:t,updateSelected:function(e){c({wordIndex:n,charIndex:e})}})})},u=function(e){for(var n=e.charArray,t=e.wordIndex,r=e.selected,a=e.hint,s=e.mode,o=e.updateSelected,d=[],c=null,u=function(e){c=l(t,e,r,a[e],s),d.push((0,i.jsxs)("div",{className:c,onClick:function(){return o(e)},children:[(0,i.jsx)("div",{className:"charbox-text",children:n[e]}),(0,i.jsx)("div",{className:"charbox-underline"})]},e))},x=0;x<n.length;x++)u(x);return(0,i.jsx)(i.Fragment,{children:d})},l=function(e,n,t,r,a){var s="charbox";return" "!==r&&(s+=" charbox-hint"),(n<a.overlapLen&&e>0||n>=a.wordLen-a.overlapLen&&e<a.noOfWords-1)&&(s+=" charbox-overlap"),e===t.wordIndex&&n===t.charIndex&&(s+=" charbox-selected"),s},x=(0,o.memo)(c),f=function(e){var n=e.keys,t=e.boardRef,r=function(e,n){var r=new KeyboardEvent("keydown_buttons",{key:e});t.current.dispatchEvent(r)},a=function(e){e.preventDefault()};return(0,i.jsxs)("div",{className:"d-flex justify-content-center align-items-center",children:[(0,i.jsx)("div",{children:n.map((function(e,n){return(0,i.jsx)("div",{className:"btn key-button",onClick:function(n){return r(e)},onMouseDown:a,children:e},n)}))}),(0,i.jsx)("div",{className:"vr mx-3 my-3"}),(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{className:"key-button",onClick:function(e){return r("BACKSPACE")},onMouseDown:a,children:(0,i.jsx)("i",{className:"fa-solid fa-left-long"})}),(0,i.jsx)("div",{className:"key-button",onClick:function(e){return r("ENTER")},onMouseDown:a,children:(0,i.jsx)("i",{className:"fa-solid fa-spell-check"})})]})]})},h=t(917),v=t(8587),m=(0,o.lazy)((function(){return t.e(391).then(t.bind(t,4391))})),b=function(e){var n=(0,o.useState)(v.BH),t=(0,s.Z)(n,2),c=t[0],u=t[1],l=(0,o.useState)(v.vJ),b=(0,s.Z)(l,2),p=b[0],j=b[1],k=(0,o.useState)([]),C=(0,s.Z)(k,2),I=C[0],N=C[1],y=(0,o.useState)({wordIndex:-1,charIndex:-1}),E=(0,s.Z)(y,2),Z=E[0],S=E[1],g=(0,o.useState)({res:null,data:""}),R=(0,s.Z)(g,2),A=R[0],D=R[1],L=(0,o.useState)(!1),q=(0,s.Z)(L,2),z=q[0],B=q[1],H=(0,d.lr)(),M=(0,s.Z)(H,2),O=M[0],W=(M[1],(0,o.useRef)(null));(0,o.useEffect)((function(){var e,n=O.get("puzzle");e=null!==n?h.q.genPuzzleFromEncoded(n):h.q.genPuzzle(),u(h.q.getMode().data),j(e.data),N(h.q.getKeys().data),B(!1)}),[O]);var K=function(e){var n=Z.wordIndex,t=Z.charIndex;if(!(t>=c.wordLen||t<0)){var s=e.key.toUpperCase(),o=(0,r.Z)(p.inputs),d=o[n].split(""),i=p.hints[n];1===s.length?(t<c.wordLen&&" "===i[t]&&(d[t]=s,o[n]=d.join(""),j((function(e){return(0,a.Z)((0,a.Z)({},e),{},{inputs:o})}))),t<c.wordLen-1&&t++):"DELETE"===s||"BACKSPACE"===s?(" "===i[t]&&(d[t]=" ",o[n]=d.join(""),j((function(e){return(0,a.Z)((0,a.Z)({},e),{},{inputs:o})}))),"BACKSPACE"===s&&t>0&&t--):"ENTER"===s?function(e,n){var t=h.q.validateInput(e,n);D(t)}(n,d.join("")):"ARROWLEFT"===s?t>0&&t--:"ARROWRIGHT"===s?t<c.wordLen-1&&t++:"ARROWUP"===s?n>0&&n--:"ARROWDOWN"===s&&n<c.noOfWords-1&&n++,S({wordIndex:n,charIndex:t})}};return(0,o.useEffect)((function(){var e=W.current;return e.addEventListener("keydown_buttons",K),function(){e.removeEventListener("keydown_buttons",K)}}),[K]),(0,i.jsxs)("div",{className:"container board",children:[(0,i.jsx)("div",{tabIndex:0,className:"board-panel",ref:W,onKeyDown:K,children:p.inputs.map((function(e,n){return(0,i.jsx)(x,{wordIndex:n,mode:c,state:p,selected:Z,setSelected:S},n)}))}),(0,i.jsxs)("div",{className:"board-control",children:[(0,i.jsx)("div",{children:"".concat(A.data)}),(0,i.jsx)(w,{onClickClear:function(){var e=(0,a.Z)({},p);e.inputs=(0,r.Z)(e.hints),j(e)},onClickHint:function(){var e=null;if((e=-1===Z.charIndex?h.q.addHint(Z.wordIndex):h.q.addHint(Z.wordIndex,Z.charIndex)).status===v.bb){var n=(0,a.Z)({},p),t=W.current.getElementsByClassName("wordbox")[Z.wordIndex].textContent;n.hints=(0,r.Z)(h.q.getHints().data),n.inputs[Z.wordIndex]=t.slice(0,e.data.index)+e.data.hint+t.slice(e.data.index+1),j(n)}else D(e)},onClickSubmit:function(){var e=Array.from(W.current.getElementsByClassName("wordbox")).map((function(e){return e.textContent})),n=h.q.validateAll(e);D(n),n.status===v.bb&&B(!0)}}),(0,i.jsx)(f,{keys:I,boardRef:W})]}),(0,i.jsx)(o.Suspense,{children:(0,i.jsx)(m,{show:z,inputs:p.inputs,dismiss:function(){return B(!1)}})})]})},w=function(e){var n=e.onClickClear,t=e.onClickHint,r=e.onClickSubmit;return(0,i.jsxs)("div",{children:[(0,i.jsx)("span",{className:"fa-2x",onClick:n,onMouseDown:p,children:(0,i.jsx)("i",{className:"fa-solid fa-rotate-right board-icon-button"})}),(0,i.jsx)("span",{className:"fa-2x",onClick:t,onMouseDown:p,children:(0,i.jsx)("i",{className:"fa-solid fa-square-h board-icon-button"})}),(0,i.jsx)("span",{className:"fa-2x",onClick:r,onMouseDown:p,children:(0,i.jsx)("i",{className:"fa-regular fa-circle-check board-icon-button"})})]})},p=function(e){e.preventDefault()},j=(0,o.memo)(b)}}]);
//# sourceMappingURL=271.a47168d9.chunk.js.map