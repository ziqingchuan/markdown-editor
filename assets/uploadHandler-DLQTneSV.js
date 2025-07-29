import{a as y}from"./html2pdf-GX85U5Jj.js";import{r as D}from"./mammoth-BmZWruCw.js";import{_ as F,a as P}from"./pdfjsDist-DjviUUiK.js";import{C as B}from"./compressorjs-C46f8uP2.js";var T=D();const E=y(T),_=(e,n=.7,t=1920,o=200,c=100)=>new Promise((i,h)=>{const f=e.size/1024;if(f<o){console.log(`文件大小 ${f.toFixed(2)}KB 小于 ${o}KB, 不进行压缩.`),i(e);return}(s=>new Promise((m,w)=>{const r=new FileReader;r.onload=l=>{var a;const p=new Image;p.src=(a=l.target)==null?void 0:a.result,p.onload=()=>{const u=document.createElement("canvas"),g=u.getContext("2d");if(!g){w(new Error("无法获取 Canvas 上下文"));return}u.width=p.width,u.height=p.height,g.drawImage(p,0,0),u.toBlob(x=>{x?m(new File([x],s.name.replace(/\.[^/.]+$/,".jpg"),{type:"image/jpeg"})):w(new Error("转换为 JPEG 时出现问题"))},"image/jpeg",n)},p.onerror=u=>w(u)},r.onerror=l=>w(l),r.readAsDataURL(s)}))(e).then(s=>{const m=r=>new Promise((l,p)=>{new B(s,{quality:r,maxWidth:t,success(a){console.log(`压缩成功, 压缩后大小 ${a.size/1024}KB, 压缩后的文件类型: ${a.type}.`),l(a)},error(a){console.error(a),p(new Error("压缩失败"))}})}),w=async(r,l,p=0)=>{if(p>10)throw console.warn("二分法尝试次数过多，停止尝试."),new Error("无法压缩到指定大小");const a=(r+l)/2,u=await m(a);if(u){const g=u.size/1024;return console.log(`尝试压缩质量 ${a}, 结果文件大小: ${g.toFixed(2)}KB`),g<=c?u:w(r,a,p+1)}else throw new Error("压缩失败")};w(0,1).then(r=>{console.log(`压缩成功, 压缩后大小 ${r.size/1024}KB.`),i(r)}).catch(r=>{console.error("压缩过程中发生错误:",r),h(r)})}).catch(s=>{console.error("转换过程中发生错误:",s),h(s)})});P.workerSrc="pdf.worker.min.mjs";const L={async handleFile(e){var t;switch((t=e.name.split(".").pop())==null?void 0:t.toLowerCase()){case"html":return this.parseHTML(e);case"md":return this.parseMarkdown(e);case"pdf":return this.parsePDF(e);case"txt":return this.parseText(e);case"docx":case"doc":return this.parseDoc(e);default:throw new Error("不支持的文件类型")}},async parseHTML(e){const n=await e.text(),t=new DOMParser().parseFromString(n,"text/html");return t.body?(t.body.textContent||"").split(`
`).map(c=>c.trim()).filter(c=>c.length>0).join(`
`):(console.warn("HTML 文件无有效内容"),"")},async parseMarkdown(e){return(await e.text()).split(`
`).map(t=>t.trim()).filter(t=>t.length>0).join(`
`)},async parsePDF(e){try{const n=await e.arrayBuffer(),t=await F({data:n}).promise,o=t.numPages,c=[];for(let i=1;i<=o;i++){const f=await(await t.getPage(i)).getTextContent(),{items:d}=f,s=[];let m=null;const w=d.sort((r,l)=>l.transform[5]-r.transform[5]);for(const r of w){if(!r.str)continue;const l=r.transform[5],a=12*.5;m?Math.abs(m.y-l)<a?m.text+=" "+r.str:(s.push(m.text),m={text:r.str,y:l}):m={text:r.str,y:l}}m&&s.push(m.text),c.push(s.join(`

`)),i<o&&c.push(`
---
`)}return c.join(`

`).split(`

`).map(i=>i.trim()).filter(i=>i.length>0).join(`

`)}catch(n){return console.error("PDF解析失败:",n),"无法解析 PDF 文件，请检查文件内容！"}},async parseText(e){return(await e.text()).split(`
`).map(t=>t.trim()).filter(t=>t.length>0).join(`
`)},async parseDoc(e){try{const n=await e.arrayBuffer();return(await E.extractRawText({arrayBuffer:n})).value.split(`
`).map(o=>o.trim()).filter(o=>o.length>0).join(`
`)}catch(n){return console.error("DOC/DOCX 解析失败:",n),"无法解析 DOC/DOCX 文件，请检查文件内容！"}},async handleImage(e){return new Promise(async(n,t)=>{try{const o=await _(e,.7,1200,100,200),c=new FileReader;c.onload=i=>{var s;const h=(s=i.target)==null?void 0:s.result,d=`![${o.name.replace(/\.[^/.]+$/,"")}](${h})`;n(d)},c.onerror=()=>{t(new Error("图片读取失败"))},c.readAsDataURL(o)}catch(o){t(o)}})}};export{L as FileUploadHandler};
