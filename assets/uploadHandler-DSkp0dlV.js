const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BdDLif_t.js","assets/html2pdf-GX85U5Jj.js","assets/mammoth-BmZWruCw.js"])))=>i.map(i=>d[i]);
import{_ as y}from"./html2pdf-GX85U5Jj.js";import{C as D}from"./compressorjs-C46f8uP2.js";const P=(e,n=.7,t=1920,m=200,r=100)=>new Promise((w,c)=>{const f=e.size/1024;if(f<m){console.log(`文件大小 ${f.toFixed(2)}KB 小于 ${m}KB, 不进行压缩.`),w(e);return}(p=>new Promise((d,s)=>{const a=new FileReader;a.onload=i=>{var l;const o=new Image;o.src=(l=i.target)==null?void 0:l.result,o.onload=()=>{const u=document.createElement("canvas"),h=u.getContext("2d");if(!h){s(new Error("无法获取 Canvas 上下文"));return}u.width=o.width,u.height=o.height,h.drawImage(o,0,0),u.toBlob(x=>{x?d(new File([x],p.name.replace(/\.[^/.]+$/,".jpg"),{type:"image/jpeg"})):s(new Error("转换为 JPEG 时出现问题"))},"image/jpeg",n)},o.onerror=u=>s(u)},a.onerror=i=>s(i),a.readAsDataURL(p)}))(e).then(p=>{const d=a=>new Promise((i,o)=>{new D(p,{quality:a,maxWidth:t,success(l){console.log(`压缩成功, 压缩后大小 ${l.size/1024}KB, 压缩后的文件类型: ${l.type}.`),i(l)},error(l){console.error(l),o(new Error("压缩失败"))}})}),s=async(a,i,o=0)=>{if(o>10)throw console.warn("二分法尝试次数过多，停止尝试."),new Error("无法压缩到指定大小");const l=(a+i)/2,u=await d(l);if(u){const h=u.size/1024;return console.log(`尝试压缩质量 ${l}, 结果文件大小: ${h.toFixed(2)}KB`),h<=r?u:s(a,l,o+1)}else throw new Error("压缩失败")};s(0,1).then(a=>{console.log(`压缩成功, 压缩后大小 ${a.size/1024}KB.`),w(a)}).catch(a=>{console.error("压缩过程中发生错误:",a),c(a)})}).catch(p=>{console.error("转换过程中发生错误:",p),c(p)})}),E={async handleFile(e){var t;switch((t=e.name.split(".").pop())==null?void 0:t.toLowerCase()){case"html":return this.parseHTML(e);case"md":return this.parseMarkdown(e);case"pdf":return this.parsePDF(e);case"txt":return this.parseText(e);case"docx":case"doc":return this.parseDoc(e);default:throw new Error("不支持的文件类型")}},async parseHTML(e){const n=await e.text(),t=new DOMParser().parseFromString(n,"text/html");return t.body?(t.body.textContent||"").split(`
`).map(r=>r.trim()).filter(r=>r.length>0).join(`
`):(console.warn("HTML 文件无有效内容"),"")},async parseMarkdown(e){return(await e.text()).split(`
`).map(t=>t.trim()).filter(t=>t.length>0).join(`
`)},async parsePDF(e){try{const[n]=await Promise.all([y(()=>import("./pdfjsDist-DQ7craWA.js"),[])]);n.GlobalWorkerOptions.workerSrc="pdf.worker.min.mjs";const t=await e.arrayBuffer(),m=await n.getDocument({data:t}).promise,r=m.numPages,w=[];for(let c=1;c<=r;c++){const g=await(await m.getPage(c)).getTextContent(),{items:p}=g,d=[];let s=null;const a=p.sort((i,o)=>o.transform[5]-i.transform[5]);for(const i of a){if(!i.str)continue;const o=i.transform[5],u=12*.5;s?Math.abs(s.y-o)<u?s.text+=" "+i.str:(d.push(s.text),s={text:i.str,y:o}):s={text:i.str,y:o}}s&&d.push(s.text),w.push(d.join(`

`)),c<r&&w.push(`
---
`)}return w.join(`

`).split(`

`).map(c=>c.trim()).filter(c=>c.length>0).join(`

`)}catch(n){return console.error("PDF解析失败:",n),"无法解析 PDF 文件，请检查文件内容！"}},async parseText(e){return(await e.text()).split(`
`).map(t=>t.trim()).filter(t=>t.length>0).join(`
`)},async parseDoc(e){try{const n=await y(()=>import("./index-BdDLif_t.js").then(r=>r.i),__vite__mapDeps([0,1,2])),t=await e.arrayBuffer();return(await n.default.extractRawText({arrayBuffer:t})).value.split(`
`).map(r=>r.trim()).filter(r=>r.length>0).join(`
`)}catch(n){return console.error("DOC/DOCX 解析失败:",n),"无法解析 DOC/DOCX 文件，请检查文件内容！"}},async handleImage(e){return new Promise(async(n,t)=>{try{const m=await P(e,.7,1200,100,200),r=new FileReader;r.onload=w=>{var p;const c=(p=w.target)==null?void 0:p.result,g=`![${m.name.replace(/\.[^/.]+$/,"")}](${c})`;n(g)},r.onerror=()=>t(new Error("图片读取失败")),r.readAsDataURL(m)}catch(m){t(m)}})}};export{E as FileUploadHandler};
