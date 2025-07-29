const l=(n,r)=>{const a=`| ${Array(r).fill("列").map((i,t)=>`列${t+1}`).join(" | ")} |`,o=`| ${Array(r).fill("---").join(" | ")} |`,e=Array(n-1).fill("").map(()=>`| ${Array(r).fill("内容").join(" | ")} |`);return`
${a}
${o}
${e.join(`
`)}
`};export{l as generateMarkdownTable};
