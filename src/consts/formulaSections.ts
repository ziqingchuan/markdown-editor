export const formulaSections = [
    {
        title: "基础运算",
        symbols: [
            { code: '+' },
            { code: '-' },
            { code: '\\pm' },
            { code: '\\mp' },
            { code: '\\times' },
            { code: '\\div' },
            { code: '=' },
            { code: '\\neq' },
            { code: '\\approx' },
            { code: '\\equiv' },
            { code: '\\propto' },
            { code: '<' },
            { code: '>' },
            { code: '\\leq' },
            { code: '\\geq' },
            { code: '\\ll' },
            { code: '\\gg' },
            { code: '\\prec' },
            { code: '\\succ' },
            { code: '\\preceq' },
            { code: '\\succeq' }
        ]
    },
    {
        title: "上下标与导数",
        symbols: [
            { code: 'a^2' },
            { code: 'a_1' },
            { code: 'e^{x+y}' },
            { code: 'x_{i=1}' },
            { code: 'a^{b^c}' },
            { code: 'x_{i,j}' },
            { code: 'f\\prime' },
            { code: 'f\\prime\\prime' },
            { code: '\\dot{x}' },
            { code: '\\ddot{x}' },
            { code: '\\dot{\\dot{x}}' },
            { code: '\\frac{dy}{dx}' },
            { code: '\\frac{d^2y}{dx^2}' },
            { code: '\\partial f' },
            { code: '\\frac{\\partial f}{\\partial x}' }
        ]
    },
    {
        title: "分式与根号",
        symbols: [
            { code: '\\frac{a}{b}' },
            { code: '\\frac{a+b}{c+d}' },
            { code: '\\cfrac{a}{b}' }, // 连续分式
            { code: '\\sqrt{x}' },
            { code: '\\sqrt[3]{x}' },
            { code: '\\sqrt[n]{x}' },
            { code: '\\sqrt{a^2 + b^2}' },
        ]
    },
    {
        title: "三角函数",
        symbols: [
            { code: '\\sin' },
            { code: '\\cos' },
            { code: '\\tan' },
            { code: '\\cot' },
            { code: '\\sec' },
            { code: '\\csc' },
            { code: '\\arcsin' },
            { code: '\\arccos' },
            { code: '\\arctan' },
            { code: '\\sinh' },
            { code: '\\cosh' },
            { code: '\\tanh' },
            { code: '\\coth' },
            { code: '\\sin^{-1}' },
            { code: '\\cos^2 x' },
            { code: '\\tan\\theta' }
        ]
    },
    {
        title: "微积分",
        symbols: [
            { code: '\\int' },
            { code: '\\int_{a}^{b}' },
            { code: '\\int_{a}^{b} f(x) dx' },
            { code: '\\iint' },
            { code: '\\iiint' },
            { code: '\\oint' },
            { code: '\\sum' },
            { code: '\\sum_{i=1}^{n}' },
            { code: '\\sum_{i=1}^{n} a_i' },
            { code: '\\prod' },
            { code: '\\prod_{i=1}^{n}' },
            { code: '\\lim' },
            { code: '\\lim_{x \\to a}' },
            { code: '\\lim_{x \\to \\infty}' },
            { code: '\\infty' },
            { code: '\\partial' },
            { code: '\\nabla' }, // nabla算子
            { code: '\\nabla \\cdot' }, // 散度
            { code: '\\nabla \\times' }, // 旋度
            { code: '\\nabla^2' }, // 拉普拉斯算子
            { code: '\\mathrm{d}' }, // 微分符号
            { code: '\\delta' }, // 变分符号
            { code: '\\Delta' } // 差分符号
        ]
    },
    {
        title: "矩阵与行列式",
        symbols: [
            { code: '\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}' },
            { code: '\\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix}' },
            { code: '\\begin{vmatrix}a & b \\\\ c & d\\end{vmatrix}' },
            { code: '\\begin{Vmatrix}a & b \\\\ c & d\\end{Vmatrix}' },
            { code: 'A^T' }, // 转置
            { code: 'A^{-1}' }, // 逆矩阵
            { code: 'A^*' }, // 伴随矩阵
            { code: '\\det(A)' }, // 行列式
            { code: '\\text{rank}(A)' }, // 秩
            { code: '\\text{tr}(A)' }, // 迹
            { code: '\\mathbf{0}' }, // 零矩阵
            { code: '\\mathbf{I}' }, // 单位矩阵
        ]
    },
    {
        title: "集合论",
        symbols: [
            { code: '\\in' },
            { code: '\\notin' },
            { code: '\\subset' },
            { code: '\\supset' },
            { code: '\\subseteq' },
            { code: '\\supseteq' },
            { code: '\\nsubseteq' },
            { code: '\\nsupseteq' },
            { code: '\\cup' },
            { code: '\\cap' },
            { code: '\\setminus' },
            { code: '\\complement' },
            { code: '\\bigcup' },
            { code: '\\bigcap' },
            { code: '\\emptyset' },
            { code: '\\varnothing' },
            { code: '\\mathbb{N}' }, // 自然数集
            { code: '\\mathbb{Z}' }, // 整数集
            { code: '\\mathbb{Q}' }, // 有理数集
            { code: '\\mathbb{R}' }, // 实数集
            { code: '\\mathbb{C}' }, // 复数集
            { code: '\\{a, b, c\\}' },
            { code: '\\{x \\mid x > 0\\}' }
        ]
    },
    {
        title: "希腊字母（小写）",
        symbols: [
            { code: '\\alpha' },
            { code: '\\beta' },
            { code: '\\gamma' },
            { code: '\\delta' },
            { code: '\\epsilon' },
            { code: '\\varepsilon' },
            { code: '\\zeta' },
            { code: '\\eta' },
            { code: '\\theta' },
            { code: '\\vartheta' },
            { code: '\\iota' },
            { code: '\\kappa' },
            { code: '\\lambda' },
            { code: '\\mu' },
            { code: '\\nu' },
            { code: '\\xi' },
            { code: '\\pi' },
            { code: '\\varpi' },
            { code: '\\rho' },
            { code: '\\varrho' },
            { code: '\\sigma' },
            { code: '\\varsigma' },
            { code: '\\tau' },
            { code: '\\upsilon' },
            { code: '\\phi' },
            { code: '\\varphi' },
            { code: '\\chi' },
            { code: '\\psi' },
            { code: '\\omega' }
        ]
    },
    {
        title: "希腊字母（大写）",
        symbols: [
            { code: '\\Alpha' },
            { code: '\\Beta' },
            { code: '\\Gamma' },
            { code: '\\Delta' },
            { code: '\\Epsilon' },
            { code: '\\Zeta' },
            { code: '\\Eta' },
            { code: '\\Theta' },
            { code: '\\Iota' },
            { code: '\\Kappa' },
            { code: '\\Lambda' },
            { code: '\\Mu' },
            { code: '\\Nu' },
            { code: '\\Xi' },
            { code: '\\Pi' },
            { code: '\\Rho' },
            { code: '\\Sigma' },
            { code: '\\Tau' },
            { code: '\\Upsilon' },
            { code: '\\Phi' },
            { code: '\\Chi' },
            { code: '\\Psi' },
            { code: '\\Omega' }
        ]
    },
    {
        title: "逻辑符号",
        symbols: [
            { code: '\\forall' },
            { code: '\\exists' },
            { code: '\\exists!' }, // 存在唯一
            { code: '\\Rightarrow' },
            { code: '\\Leftarrow' },
            { code: '\\Leftrightarrow' },
            { code: '\\implies' },
            { code: '\\impliedby' },
            { code: '\\iff' },
            { code: '\\land' }, // 合取
            { code: '\\lor' }, // 析取
            { code: '\\neg' }, // 否定
            { code: '\\oplus' }, // 异或
            { code: '\\top' }, // 真
            { code: '\\bot' }, // 假
            { code: '\\vdash' }, // 断定符
            { code: '\\vDash' } // 满足符
        ]
    },
    {
        title: "箭头符号",
        symbols: [
            { code: '\\rightarrow' },
            { code: '\\leftarrow' },
            { code: '\\to' },
            { code: '\\gets' },
            { code: '\\Rightarrow' },
            { code: '\\Leftarrow' },
            { code: '\\Leftrightarrow' },
            { code: '\\mapsto' },
            { code: '\\hookrightarrow' }, // 嵌入箭头
            { code: '\\hookrightarrow' },
            { code: '\\rightharpoonup' }, // 右鱼叉箭头
            { code: '\\leftharpoonup' }, // 左鱼叉箭头
            { code: '\\rightleftharpoons' }, // 平衡箭头
            { code: '\\uparrow' },
            { code: '\\downarrow' },
            { code: '\\updownarrow' },
            { code: '\\nearrow' }, // 斜上箭头
            { code: '\\searrow' }, // 斜下箭头
            { code: '\\swarrow' },
            { code: '\\nwarrow' },
            { code: '\\longrightarrow' }, // 长箭头
            { code: '\\longleftarrow' },
            { code: '\\Longrightarrow' }, // 更长箭头
            { code: '\\Longleftarrow' }
        ]
    },
    {
        title: "函数与算子",
        symbols: [
            { code: '\\log' },
            { code: '\\ln' },
            { code: '\\lg' },
            { code: '\\exp' },
            { code: '\\sin' },
            { code: '\\cos' },
            { code: '\\tan' },
            { code: '\\arcsin' },
            { code: '\\arccos' },
            { code: '\\arctan' },
            { code: '\\sinh' },
            { code: '\\cosh' },
            { code: '\\tanh' },
            { code: '\\coth' },
            { code: '\\max' },
            { code: '\\min' },
            { code: '\\sup' }, // 上确界
            { code: '\\inf' }, // 下确界
            { code: '\\limsup' }, // 上极限
            { code: '\\liminf' }, // 下极限
            { code: '\\Pr' }, // 概率
            { code: '\\mathbb{E}' }, // 替换为mathbb{E}（需要amsfonts扩展）
            { code: '\\mathrm{Var}' }, // 或使用数学罗马体的Var
            { code: '\\binom{n}{k}' }, // 二项式系数
            { code: '\\choose' }, // 另一种二项式系数
            { code: '\\Gamma' }, // Gamma函数
            { code: '\\Beta' }, // Beta函数
            { code: '\\Delta' }, // 差分算子
            { code: '\\nabla' }, // nabla算子
            { code: '\\Box' } // 达朗贝尔算子
        ]
    },
    {
        title: "向量与张量",
        symbols: [
            { code: '\\vec{a}' },
            { code: '\\vec{AB}' },
            { code: '\\widehat{ac}' },
            { code: '\\mathbf{A}' },
            { code: '\\boldsymbol{A}' },
            { code: '\\cdot' }, // 点积
            { code: '\\times' }, // 叉积
            { code: '\\circ' }, // 复合运算
            { code: '\\otimes' }, // 张量积
            { code: '\\oplus' }, // 直和
            { code: '\\sum_{i} a_i e_i' }, // 向量展开
            { code: '\\| \\vec{a} \\|' }, // 向量模
            { code: '\\| A \\|' }, // 矩阵范数
            { code: '\\langle a, b \\rangle' }, // 内积
            { code: 'a \\cdot b' }, // 点积
            { code: 'a \\times b' }, // 叉积
            { code: 'T_{ij}' }, // 张量分量
            { code: '\\delta_{ij}' }, // 克罗内克符号
            { code: '\\epsilon_{ijk}' } // 列维-奇维塔符号
        ]
    },
    {
        title: "括号与分隔符",
        symbols: [
            { code: '(a + b)' },
            { code: '[a + b]' },
            { code: '\\{a + b\\}' },
            { code: '|a + b|' },
            { code: '\\|a + b\\|' },
            { code: '\\langle a, b \\rangle' },
            { code: '\\lfloor x \\rfloor' }, // 向下取整
            { code: '\\lceil x \\rceil' }, // 向上取整
            { code: '\\langle x \\rangle' }, // 平均
            { code: '\\left( \\frac{a}{b} \\right)' }, // 自适应大小
            { code: '\\left[ \\sum_{i=1}^n a_i \\right]' },
            { code: '\\left\\{ \\begin{aligned} x &= 1 \\\\ y &= 2 \\end{aligned} \\right.' }, // 分段函数
            { code: '\\bigg( \\Big( \\big( ( ) \\big) \\Big) \\bigg)' }, // 不同大小的括号
            { code: '\\Bigg[ \\Bigg]' }
        ]
    },
    {
        title: "特殊符号",
        symbols: [
            { code: '\\dots' }, // 水平点
            { code: '\\vdots' }, // 垂直点
            { code: '\\ddots' }, // 对角点
            { code: '\\cdots' }, // 居中水平点
            { code: '\\aleph' }, // 阿列夫数
            { code: '\\hbar' }, // 约化普朗克常数
            { code: '\\imath' }, // 不带点的i
            { code: '\\jmath' }, // 不带点的j
            { code: '\\ell' }, // 特殊的l
            { code: '\\Re' }, // 实部
            { code: '\\Im' }, // 虚部
            { code: '\\wp' }, // 魏尔斯特拉斯椭圆函数
            { code: '\\prime' }, // 撇号
            { code: '\\emptyset' }, // 空集
            { code: '\\infty' }, // 无穷大
            { code: '\\triangle' }, // 三角形
            { code: '\\square' }, // 正方形
            { code: '\\blacksquare' }, // 实心正方形
            { code: '\\bigstar' }, // 星号
            { code: '\\dagger' }, // 匕首符号
            { code: '\\ddagger' }, // 双匕首符号
            { code: '\\copyright' }, // 版权符号
            { code: '\\angle' }, // 角符号
            { code: '\\measuredangle' }, // 测量角符号
            { code: '\\odot' }, // 圆符号
            { code: '\\degree' }, // 度符号
            { code: '\\%' } // 百分号
        ]
    },
    {
        title: "数论与代数",
        symbols: [
            { code: 'a \\bmod n' }, // 模运算
            { code: '\\gcd(a, b)' }, // 最大公约数（KaTeX通常支持）
            { code: '\\text{lcm}(a, b)' }, // 替换\lcm为文本模式的lcm
            { code: 'p \\mid n' }, // 整除
            { code: 'p \\nmid n' }, // 不整除
            { code: '\\equiv' }, // 同余
            { code: '\\not\\equiv' }, // 不同余
            { code: '\\sim' }, // 相似
            { code: '\\approx' }, // 近似
            { code: '\\propto' }, // 正比
            { code: '\\bot' }, // 垂直
            { code: '\\parallel' }, // 平行
            { code: '\\nparallel' }, // 不平行
            { code: '\\subsetneq' }, // 真子集
            { code: '\\supsetneq' }, // 真超集
            { code: '\\cong' }, // 同构
            { code: '\\simeq' }, // 同胚
            { code: '\\equiv' }, // 恒等
            { code: '\\bowtie' } // 连接
        ]
    },
    {
        title: "统计与概率",
        symbols: [
            { code: '\\Pr(A)' }, // 概率
            { code: '\\mathbb{E}[X]' }, // 替换\E[X]为\mathbb{E}[X]
            { code: '\\text{Var}(X)' }, // 替换\var(X)为\text{Var}(X)
            { code: '\\text{Cov}(X, Y)' }, // 替换\Cov为文本模式的Cov
            { code: '\\text{Corr}(X, Y)' }, // 相关系数
            { code: 'X \\sim N(\\mu, \\sigma^2)' }, // 正态分布
            { code: 'P(A \\mid B)' }, // 条件概率
            { code: '\\binom{n}{k}' }, // 组合数
            { code: '\\mathcal{N}(\\mu, \\sigma^2)' }, // 正态分布
            { code: '\\chi^2' }, // 卡方分布
            { code: 't_{n}' }, // t分布
            { code: 'F_{n,m}' }, // F分布
            { code: '\\bar{x}' }, // 样本均值
            { code: 's^2' }, // 样本方差
            { code: '\\hat{\\theta}' }, // 参数估计
            { code: '\\alpha' }, // 显著性水平
            { code: '\\beta' }, // 检验功效
            { code: '\\Phi(x)' }, // 分布函数
            { code: '\\text{pdf}(x)' }, // 替换\pdf为文本模式的pdf
        ]
    }
];
