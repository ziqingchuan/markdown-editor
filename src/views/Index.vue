<template>
  <div class="app-container" :class="{ 'app-dark': isDarkMode }">
    <!-- 顶部导航栏 -->
    <header v-show="!isFullScreen" class="header">
      <div class="header-content">
        <div class="logo">
            <svg class="logo-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M741.888 224.085333C555.633778 375.580444 491.576889 512.512 483.555556 568.888889l0.056888 85.333333c-34.702222 173.511111 25.827556 124.757333 129.934223 41.016889 45.397333-36.522667 99.100444-79.758222 156.842666-114.062222 11.605333 86.755556 27.648 172.373333 49.664 243.484444 12.515556 40.391111-16.384 85.560889-58.709333 85.560889h-449.991111c-86.186667 0-165.774222-48.924444-187.164445-132.380444-44.771556-175.559111-59.733333-412.103111-64.739555-550.343111C57.116444 164.693333 107.861333 113.777778 170.666667 113.777778h455.111111c61.724444 0 112.184889 49.095111 116.110222 110.307555zM199.111111 284.444444a28.444444 28.444444 0 0 0 0 56.888889h227.555556a28.444444 28.444444 0 0 0 0-56.888889h-227.555556z m56.888889 170.666667a28.444444 28.444444 0 0 0 0 56.888889h113.777778a28.444444 28.444444 0 0 0 0-56.888889h-113.777778z m284.444444 170.666667c9.500444-66.389333 96.711111-244.622222 369.777778-426.666667 45.511111-22.755556 75.832889-66.389333 85.333334-85.333333 37.944889 66.389333 62.577778 227.555556-142.222223 341.333333s-312.888889 218.055111-341.333333 256l28.444444-85.333333z" fill="#505E78"></path></svg>
          <span>素笔 Mark</span>
        </div>

        <div class="header-actions">
          <!-- 主题切换按钮 -->
          <div class="theme-toggle" @click="isDarkMode = !isDarkMode">
            <div class="toggle-thumb" :class="{ 'toggle-thumb-dark': isDarkMode }"></div>
            <span class="sun-icon">☀</span>
            <span class="moon-icon">☪</span>
          </div>

          <!-- 下载按钮组 -->
          <div class="download-btn-group">
            <button class="primary-btn" @click.stop="showDropdown = !showDropdown">
              <span>导出 ｜ ▼</span>
            </button>
            <div class="dropdown-menu" :class="{ 'dropdown-show': showDropdown }" @click.stop>
              <!-- 下载选项 -->
              <div class="dropdown-options">
                <div class="dropdown-item" @click="downloadMarkdown">
                  <svg class="file-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M854.6 288.7c6 6 9.4 14.1 9.4 22.6V928c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32h424.7c8.5 0 16.7 3.4 22.7 9.4l215.2 215.3zM790.2 326L602 137.8V326h188.2zM426.13 600.93l59.11 132.975a16.003 16.003 0 0 0 14.624 9.503h24.055c6.33 0 12.065-3.732 14.63-9.518l59.109-133.35v157.458c0 8.838 7.165 16.003 16.003 16.003h27.337c8.838 0 16.003-7.165 16.003-16.003V486.002c0-8.838-7.165-16.003-16.003-16.003h-34.746a16.003 16.003 0 0 0-14.673 9.616l-79.473 182.587-79.473-182.587A16.003 16.003 0 0 0 417.96 470h-34.958c-8.838 0-16.003 7.165-16.003 16.003v271.996c0 8.838 7.165 16.003 16.003 16.003h27.126c8.838 0 16.003-7.165 16.003-16.003v-157.07z" fill="#1296DB"></path></svg>
                  <span>Markdown文件</span>
                </div>
                <div class="dropdown-item" @click="downloadPdf">
                  <svg class="file-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M173.421714 54.857143A46.628571 46.628571 0 0 0 128 100.333714v819.108572a43.483429 43.483429 0 0 0 13.641143 31.817143 44.598857 44.598857 0 0 0 31.780571 13.677714h666.368a43.446857 43.446857 0 0 0 31.762286-13.659429 44.982857 44.982857 0 0 0 13.641143-31.817143V312.612571L627.748571 54.857143H173.403429z" fill="#FE5359"></path><path d="M885.211429 312.649143H673.170286a46.628571 46.628571 0 0 1-45.458286-45.476572V54.857143l257.462857 257.792z" fill="#FFFFFF" fill-opacity=".7"></path><path d="M326.454857 502.125714c16.146286 0 30.189714 2.706286 42.130286 8.155429 11.940571 5.266286 21.065143 12.8 27.373714 22.637714 6.509714 9.837714 9.746286 21.321143 9.746286 34.486857s-3.236571 24.685714-9.746286 34.505143c-6.308571 9.819429-15.433143 17.462857-27.373714 22.912-11.940571 5.266286-25.984 7.899429-42.130286 7.899429h-24.758857V694.857143h-45.019429V502.125714h69.778286z m-5.010286 92.672c10.88 0 19.748571-2.102857 26.605715-6.326857 6.838857-4.205714 10.258286-11.227429 10.258285-21.065143 0-9.654857-3.510857-16.585143-10.532571-20.790857-6.838857-4.388571-15.616-6.582857-26.331429-6.582857H301.714286v54.765714h19.748571z m177.792-92.690285c18.797714 0 35.821714 3.785143 51.090286 11.337142a85.504 85.504 0 0 1 36.077714 33.170286c8.96 14.390857 13.421714 31.597714 13.421715 51.602286 0 20.022857-4.461714 37.302857-13.421715 51.876571a87.241143 87.241143 0 0 1-36.077714 33.444572c-15.104 7.552-32.128 11.318857-51.090286 11.318857h-69.504V502.125714h69.504z m-4.992 154.825142c19.126857 0 33.609143-5.083429 43.446858-15.268571 9.819429-10.185143 14.738286-24.667429 14.738285-43.446857 0-18.596571-4.992-32.914286-14.994285-42.916572-9.837714-10.185143-24.228571-15.268571-43.190858-15.268571h-19.492571v116.900571h19.492571z m134.765715-154.825142h129.024v39.241142h-83.986286v42.130286h75.300571v38.966857h-75.300571V694.857143h-45.037714V502.125714z" fill="#FFFFFF"></path></svg>                  <span>PDF文件</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <!-- 主内容区 -->
    <main class="main-content" :class="{ 'full-screen': isFullScreen }">
      <!-- 编辑器区域 -->
      <div v-show="!onlyPreview" class="editor-container" :class="{ 'only-edit': onlyEdit }">

        <div class="panel-header editor-header">
          <div class="upload-btn" @click="onlyEdit = !onlyEdit" title="编辑模式">
            <svg class="upload-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M514.871 955.411l0.426-95 445.3 1.996-0.426 95zM642 65.8l-576 576 0.2 0.2v316.2H382v-0.4l0.3 0.3 576-576L642 65.8z m182 316.3l-89.1 89.1-182-182 89.1-89.1 182 182zM161.2 863.2V737l126.2 126.2H161.2z m39.1-221.4l282-282 182 182-282 282-182-182z" fill="#999999"></path></svg>
          </div>
          <span>编辑区域</span>

          <!-- 功能按钮组 -->
          <div class="upload-btn" @click="openFileSelect('image/*')" title="上传图片" style="margin-left: auto">
            <svg class="upload-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M853.344 341.344C853.344 294.4 814.944 256 768 256s-85.344 38.4-85.344 85.344 38.4 85.344 85.344 85.344 85.344-38.4 85.344-85.344z" fill="#999999"></path><path d="M0 85.344v853.344h512v-85.344H85.344V742.4l256-256L512 657.056l59.744-59.744-230.4-230.4-256 256V170.656h853.344v298.656l85.344 85.344V85.312z" fill="#999999"></path><path d="M951.456 840.544L1011.2 780.8l-200.544-200.544-200.544 200.544 59.744 59.744L768 742.4v238.944h85.344V742.4z" fill="#999999"></path></svg>          </div>
          <div class="upload-btn" @click="openFileSelect('.html,.md,.pdf,.txt,.doc,.docx')" title="解析文件">
            <svg class="upload-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M942.272 592.192a34.944 34.944 0 0 1 17.472 30.336v249.92c0 48.128-39.168 87.296-87.424 87.296H152.32a87.424 87.424 0 0 1-87.36-87.424V622.528a34.944 34.944 0 1 1 69.888 0v249.92c0 9.6 7.808 17.472 17.536 17.472h720a17.472 17.472 0 0 0 17.536-17.536V622.528a34.944 34.944 0 0 1 52.48-30.336zM512.768 64.96c9.344 0 18.304 3.776 24.896 10.432l236.8 237.696a34.944 34.944 0 0 1-24.448 59.392 34.944 34.944 0 0 1-24.512-10.496L547.264 184.512v534.08a34.944 34.944 0 0 1-34.944 35.008 34.944 34.944 0 0 1-34.944-35.072V184.448L299.072 361.984a35.2 35.2 0 0 1-49.792-49.792l238.592-236.8a34.944 34.944 0 0 1 24.896-10.432z" fill="#999999"></path></svg>          </div>
          <div class="upload-btn" @click="showCodeModal = true" title="代码块">
            <svg class="upload-icon" viewBox="0 0 1706 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M985.856 17.408a85.333333 85.333333 0 0 1 60.330667 104.533333l-220.842667 824.32a85.333333 85.333333 0 1 1-164.864-44.202666L881.322667 77.653333a85.333333 85.333333 0 0 1 104.533333-60.330666z m-506.88 43.264a85.333333 85.333333 0 0 1 21.077333 110.933333l-5.973333 8.789334L235.946667 512l257.962666 331.605333a85.333333 85.333333 0 0 1-6.826666 112.64l-8.106667 7.082667a85.333333 85.333333 0 0 1-112.64-6.826667l-7.082667-8.106666-298.666666-384a85.333333 85.333333 0 0 1-6.485334-95.232l6.485334-9.557334 298.666666-384A85.333333 85.333333 0 0 1 479.061333 60.672z m861.269333 6.826667l7.082667 8.106666 298.666667 384a85.333333 85.333333 0 0 1 6.485333 95.232l-6.485333 9.557334-298.666667 384a85.333333 85.333333 0 0 1-140.8-95.914667l6.144-8.874667L1470.634667 512l-257.962667-331.605333a85.333333 85.333333 0 0 1 6.826667-112.64l8.106666-7.082667a85.333333 85.333333 0 0 1 112.64 6.826667z" fill="#999999"></path></svg>          </div>
          <div class="upload-btn" @click="showTableModal = true" title="表格">
            <svg class="upload-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64"><path d="M907.002003 0.000731a95.085239 95.085239 0 0 1 95.085239 87.77099v299.884215h-614.396928v621.711177h-292.569966a95.450951 95.450951 0 0 1-95.085239-87.77099V95.08597a90.696689 90.696689 0 0 1 87.77099-95.085239h819.195904z m-599.76843 694.853669h-234.055973v219.427474c0 7.314249 7.314249 14.628498 14.628499 21.942748h219.427474V694.8544z m0-307.198464h-234.055973v234.055973h234.055973V387.655936z m0-314.512713h-212.113225c-7.314249 0-14.628498 7.314249-21.942748 14.628498v219.427474h234.055973V73.143223z m307.198464 0h-226.741723v234.055972h234.055972V73.143223z m292.569966 0h-212.113225v234.055972h234.055972V95.08597l-21.942747-21.942747z" fill="#999999"></path><path d="M746.088522 468.039534a57.709426 57.709426 0 0 1 58.513993 58.513993v168.227731h168.22773a48.932327 48.932327 0 0 1 51.199744 43.885494v7.31425a57.709426 57.709426 0 0 1-58.513993 58.513993h-168.22773v168.22773a48.932327 48.932327 0 0 1-43.885495 51.199744h-7.314249a57.709426 57.709426 0 0 1-58.513994-58.513993v-168.22773h-168.22773a48.932327 48.932327 0 0 1-51.199744-43.885495v-7.314249a57.709426 57.709426 0 0 1 58.513993-58.513994h168.227731v-168.22773a48.932327 48.932327 0 0 1 43.885494-51.199744h7.31425z" fill="#999999"></path></svg>          </div>
          <div class="upload-btn" @click="showEmojiModal = true" title="emoji">
            <svg class="upload-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0z m0 960C265 960 64 759 64 512S265 64 512 64s448 201 448 448-201 448-448 448z" fill="#999999"></path><path d="M320 405.3m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#999999"></path><path d="M704 405.3m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#999999"></path><path d="M512 810.7c117.8 0 213.3-95.5 213.3-213.3H298.7c0 117.8 95.5 213.3 213.3 213.3z" fill="#999999"></path></svg>
          </div>
        </div>

        <textarea
            v-model="markdownContent"
            class="editor-textarea"
            placeholder="在此输入内容..."
            ref="editorRef"
            @scroll="handleEditorScroll"
            @keydown="handleKeyDown"
        ></textarea>
      </div>

      <!-- 预览区域 -->
      <div v-show="!onlyEdit" class="preview-container" :class="{ 'only-preview': onlyPreview }">
        <div class="panel-header preview-header">
          <div class="upload-btn" @click="onlyPreview = !onlyPreview" title="预览模式">
            <svg class="upload-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" id="mx_n_1753685709610" width="128" height="128"><path d="M977.824 454.016C826.432 280.288 672.512 192 516.128 192c-156.384 0-310.304 88.288-461.696 262.016a112 112 0 0 0-1.632 145.248c138.24 165.984 293.088 250.24 463.328 250.24s325.088-84.256 463.328-250.24a112 112 0 0 0-1.632-145.248z m-47.552 104.32c-126.848 152.32-264.48 227.2-414.144 227.2s-287.296-74.88-414.144-227.2a48 48 0 0 1 0.704-62.24C243.008 335.072 380.8 256 516.128 256s273.152 79.072 413.44 240.064c15.488 17.792 15.776 44.16 0.704 62.272z"  fill="#999999"></path><path d="M512 288a224 224 0 1 0 0 448 224 224 0 0 0 0-448z m-64 224a64 64 0 1 1 0.032-128.032A64 64 0 0 1 448 512z" fill="#999999"></path></svg>          </div>
          <span>预览区域</span>
          <!-- 功能按钮组 -->
          <div class="upload-btn" @click="isHtmlMode = !isHtmlMode" title="切换到markdown模式" style="margin-left: auto">
            <svg class="upload-icon" :class="{'red': isHtmlMode}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M186.02666667 228.69333333c-25.6 107.52 0 225.28 75.09333333 339.62666667 1.70666667 3.41333333 3.41333333 8.53333333 5.12 13.65333333 6.82666667 23.89333333 5.12 46.08-6.82666667 68.26666667-10.24 22.18666667-30.72 35.84-52.90666666 44.37333333-8.53333333 1.70666667-18.77333333 3.41333333-25.6 3.41333334-35.84 0-69.97333333-22.18666667-85.33333334-56.32 0-1.70666667-1.70666667-1.70666667-1.70666666-3.41333334-1.70666667-3.41333333-3.41333333-8.53333333-3.41333334-11.94666666 0-1.70666667 0-3.41333333-1.70666666-3.41333334-27.30666667-139.94666667-6.82666667-254.29333333 56.32-346.45333333 13.65333333-17.06666667 27.30666667-34.13333333 40.96-47.78666667zM460.8 6.82666667z m0 0s-544.42666667 90.45333333-440.32 631.46666666c1.70666667 5.12 6.82666667 27.30666667 10.24 32.42666667 27.30666667 61.44 87.04 98.98666667 151.89333333 98.98666667 15.36 0 30.72-1.70666667 46.08-6.82666667 87.04-27.30666667 133.12-117.76 105.81333334-203.09333333-3.41333333-10.24-6.82666667-22.18666667-11.94666667-30.72C170.66666667 296.96 273.06666667 105.81333333 460.8 6.82666667"></path><path d="M754.34666667 653.65333333c22.18666667 0 42.66666667 8.53333333 59.73333333 23.89333334 32.42666667 29.01333333 39.25333333 78.50666667 13.65333333 117.76l-8.53333333 6.82666666-8.53333333 8.53333334c-95.57333333 87.04-197.97333333 131.41333333-302.08 131.41333333-27.30666667 0-54.61333333-3.41333333-80.21333334-8.53333333 104.10666667-34.13333333 191.14666667-114.34666667 249.17333334-237.22666667 3.41333333-3.41333333 6.82666667-8.53333333 11.94666666-15.36 17.06666667-17.06666667 39.25333333-27.30666667 64.85333334-27.30666667z m0-71.68c-44.37333333 0-88.74666667 18.77333333-121.17333334 54.61333334-6.82666667 8.53333333-13.65333333 18.77333333-20.48 27.30666666C539.30666667 819.2 426.66666667 884.05333333 310.61333333 884.05333333c-73.38666667 0-146.77333333-25.6-220.16-66.56 0 0 172.37333333 201.38666667 414.72 201.38666667 107.52 0 228.69333333-39.25333333 354.98666667-153.6 3.41333333-3.41333333 20.48-22.18666667 23.89333333-25.6 47.78666667-68.26666667 39.25333333-160.42666667-23.89333333-215.04-27.30666667-30.72-68.26666667-42.66666667-105.81333333-42.66666667" fill="#999999"></path><path d="M588.8 95.57333333h3.41333333c3.41333333 0 8.53333333 1.70666667 13.65333334 3.41333334 3.41333333 0 6.82666667 1.70666667 10.24 1.70666666 136.53333333 40.96 232.10666667 114.34666667 281.6 215.04 8.53333333 18.77333333 15.36 35.84 23.89333333 56.32-71.68-63.14666667-168.96-97.28-279.89333333-97.28-15.36 0-34.13333333 0-52.90666667 1.70666667-3.41333333 0-10.24-1.70666667-15.36-1.70666667-23.89333333-5.12-42.66666667-18.77333333-58.02666667-39.25333333-13.65333333-20.48-18.77333333-42.66666667-13.65333333-66.56 6.82666667-42.66666667 44.37333333-73.38666667 87.04-73.38666667z m0-71.68c-75.09333333 0-143.36 54.61333333-158.72 131.41333334-18.77333333 88.74666667 40.96 172.37333333 128 191.14666666 10.24 1.70666667 22.18666667 3.41333333 32.42666667 3.41333334 18.77333333-1.70666667 34.13333333-1.70666667 49.49333333-1.70666667 242.34666667 0 346.45333333 172.37333333 344.74666667 372.05333333 1.70666667-1.70666667 177.49333333-525.65333333-348.16-687.78666666-6.82666667-1.70666667-30.72-5.12-35.84-6.82666667-1.70666667-1.70666667-8.53333333-1.70666667-11.94666667-1.70666667"></path></svg>
          </div>
          <div v-if="!isFullScreen" class="upload-btn" @click="isFullScreen = true" title="全屏">
            <svg class="upload-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M211.97837653 812.54591147h600.8242176V211.60700587H211.97837653v600.9389056z m81.9593216-518.9632h436.90666667v436.994048h-436.90666667v-436.994048z m-177.39175253 27.26843733c22.61538133 0 40.89992533-18.284544 40.89992533-40.90538667V157.0635776h122.8537856c22.62084267 0 40.90538667-18.284544 40.90538667-40.910848s-18.284544-40.910848-40.90538667-40.910848H116.5459456c-22.626304 0-40.90538667 18.284544-40.90538667 40.910848v163.94594987c-0.15291733 22.46792533 18.13162667 40.75246933 40.90538667 40.75246933z m163.7548032 546.24365227H157.4469632V744.21261653c0-22.63176533-18.284544-40.91630933-40.89992533-40.91630933-22.626304 0-40.90538667 18.284544-40.90538667 40.91630933v163.7875712c0 22.626304 18.27908267 40.910848 40.90538667 40.910848h163.91318186c22.626304 0 40.90538667-18.284544 40.90538667-40.910848-0.15947093-22.62084267-18.44401493-40.90538667-41.0648576-40.90538666zM908.38903467 75.087872H744.4758528c-22.61538133 0-40.89992533 18.284544-40.89992533 40.90538667 0 22.626304 18.284544 40.910848 40.89992533 40.910848h122.86470827v122.8865536c0 22.62084267 18.27908267 40.90538667 40.89992533 40.90538666 22.61538133 0 40.89992533-18.284544 40.89992533-40.90538666v-163.79630934c0.1540096-22.62084267-18.12507307-40.90647893-40.75137706-40.90647893z m0 628.2084352c-22.61538133 0-40.89992533 18.284544-40.89992534 40.91630933v122.88109227H744.63423147c-22.626304 0-40.89992533 18.284544-40.89992534 40.90538667 0 22.626304 18.27362133 40.910848 40.89992534 40.910848h163.9186432c22.61538133 0 40.89992533-18.284544 40.89992533-40.910848V744.21261653c-0.15837867-22.63176533-18.43746133-40.91630933-41.06376533-40.91630933z m0 0" fill="#999999"></path></svg>
          </div>
          <div v-if="isFullScreen" class="upload-btn" @click="isFullScreen = false" title="取消全屏">
            <svg class="upload-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M730.791936 328.03170987c0-20.05292373-16.41458347-36.4675072-36.4675072-36.4675072H329.6657408c-20.05838507 0-36.46204587 16.41458347-36.46204587 36.4675072v364.658688c0 20.05838507 16.4036608 36.4675072 36.46204587 36.4675072h364.658688c20.05292373 0 36.4675072-16.40912213 36.4675072-36.4675072V328.03170987z m-36.4675072 346.42875733c0 10.94014293-7.29634133 18.23102293-18.23102293 18.23102293H347.90222507c-10.94560427 0-18.23648427-7.29088-18.23648427-18.23102293V346.26819413c0-10.94014293 7.29088-18.23648427 18.23648427-18.23648426h328.1911808c10.9346816 0 18.23102293 7.29634133 18.23102293 18.23648426v328.19227307z m62.64149333-387.2555008c4.3646976 4.35923627 13.08972373 4.35923627 17.45442134 4.35923627h130.86665386c26.16743253 0 43.6109312-17.44349867 43.6109312-43.61639254 0-26.16743253-17.44349867-43.62185387-43.6109312-43.62185386h-26.1783552l56.71703894-56.7115776c17.44349867-17.44896 17.44349867-43.62185387 0-61.07081387-8.7293952-8.72393387-17.45442133-13.08972373-30.53868374-13.08972373s-21.8136576 4.3646976-30.53868373 13.08972373l-56.70611627 56.7115776v-26.1783552c0-26.16743253-17.45442133-43.62185387-43.62185386-43.62185387-26.1783552 0-43.6273152 17.45442133-43.6273152 43.62185387v130.8721152c0 4.3646976 0 13.08972373 4.35923626 17.45442133 4.3646976 8.71847253 13.08863147 17.4424064 21.8136576 21.80164267z m122.14162774 529.19773867h26.1783552c26.16743253 0 43.6109312-17.44896 43.6109312-43.61639254 0-26.1783552-17.44349867-43.6273152-43.6109312-43.6273152H774.4192512c-4.3646976 0-13.08972373 0-17.45442133 4.35923627-8.72393387 4.3646976-17.44896 13.08972373-21.8136576 21.8136576-4.35923627 4.35923627-4.35923627 13.08972373-4.35923627 17.45442133v130.86665387c0 26.16743253 17.44896 43.61639253 43.6273152 43.61639253 26.16743253 0 43.62185387-17.44896 43.62185387-43.61639253v-26.1783552l56.70611626 56.7115776c17.45442133 17.44349867 43.62185387 17.44349867 61.0762752 0 17.44349867-17.45442133 17.44349867-43.62185387 0-61.0762752l-56.71594666-56.70720853zM75.09333333 247.94781013c0 26.17289387 17.45442133 43.61639253 43.62185387 43.61639254h130.86665387c4.35923627 0 13.08972373 0 17.44896-4.35923627 8.72393387-4.35923627 17.44896-13.0842624 21.8136576-21.80273493 4.35923627-4.3646976 4.35923627-13.08972373 4.35923626-17.45442134V117.0767872c0-26.16743253-17.44896-43.62185387-43.62185386-43.62185387-26.17289387 0-43.62185387 17.45442133-43.62185387 43.62185387v26.1783552l-56.71703893-56.7115776c-8.71847253-8.72393387-17.44349867-13.08972373-30.5266688-13.08972373-13.09518507 0-21.8136576 4.3646976-30.53868374 13.08972373-17.44349867 17.44896-17.44349867 43.62185387 0 61.07081387l56.7115776 56.7115776h-26.17289386c-26.1685248 0-43.62294613 17.45442133-43.62294614 43.62185386z m191.93746774 485.57042347c-4.35923627-4.35923627-13.08972373-4.35923627-17.44896-4.35923627H118.7151872c-26.16743253 0-43.62185387 17.44896-43.62185387 43.6273152 0 26.16743253 17.45442133 43.61639253 43.62185387 43.61639254H144.88917333l-56.7115776 56.70611626c-17.44349867 17.45442133-17.44349867 43.62185387 0 61.0762752 17.44349867 17.44349867 43.62185387 17.44349867 61.06535254 0l56.71703893-56.7115776v26.1783552c0 26.16743253 17.44896 43.61639253 43.62185387 43.61639254 26.17289387 0 43.62185387-17.44896 43.62185386-43.61639254V772.78631253c0-4.3646976 0-13.09518507-4.35923626-17.45442133-4.3646976-8.72502613-13.08972373-17.44896-21.8136576-21.8136576z" fill="#999999"></path></svg>
          </div>
        </div>
        <div v-if="!isHtmlMode" class="preview-content" ref="previewRef" @scroll="handlePreviewScroll" v-html="renderedMarkdown"></div>
        <iframe
            v-else
            class="html-preview-frame"
            :srcdoc="markdownContent"
            ref="htmlPreviewFrame"
        ></iframe>
      </div>
    </main>

    <!-- 页脚 -->
    <footer v-show="!isFullScreen" class="footer">
      <p>© 2025    <a target="_blank" href="https://try-catch.life/">try-catch.life</a></p>
    </footer>

    <!-- 加载提示 -->
    <div class="loading-mask" v-if="isLoading">
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">处理中，请稍候...</p>
      </div>
    </div>
  </div>
  <TextToolbar
      :editor-ref="editorRef"
      @format="addContentToEditor"
      :is-dark-mode="isDarkMode"
  />
  <!-- 自定义弹窗 -->
  <CustomToast
      :show-toast="showToast"
      :toast-message="toastMessage"
      :toast-type="toastType"
      @close="showToast = false"
  />
  <!-- 代码块配置弹窗 -->
  <CodeBlockModal
      :visible="showCodeModal"
      :is-dark-mode="isDarkMode"
      :default-language="defaultLang"
      :default-content="defaultCode"
      @close="showCodeModal = false"
      @confirm="handleCodeBlockConfirm"
      @error="(msg: any) => showCustomToast(msg, 'error')"
  />

  <!-- 表格配置弹窗 -->
  <TableModal
      :visible="showTableModal"
      :is-dark-mode="isDarkMode"
      @close="showTableModal = false"
      @confirm="handleTableConfirm"
      @error="(msg: any) => showCustomToast(msg, 'error')"
  />
  <!-- Emoji 搜索弹窗 -->
  <EmojiModal
      :visible="showEmojiModal"
      :is-dark-mode="isDarkMode"
      @close="showEmojiModal = false"
      @select-emoji="handleEmojiSelect"
  />
</template>

<script setup lang="ts">
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {marked} from 'marked';
import DOMPurify from 'dompurify';
// @ts-ignore
// 1. 引入Prism核心库（替换highlight.js）
import Prism from 'prismjs';
// 3. 引入主题样式（可选其他主题）
import 'prismjs/themes/prism-tomorrow.css';
import {syncScroll} from "../utils/scrollHandler.ts";
import {initialMarkdownContent} from "../consts/markdownContent.ts";
import { defineAsyncComponent } from 'vue';

const CodeBlockModal = defineAsyncComponent(() =>
    import('../components/codeBlockModal.vue')
);
const TableModal = defineAsyncComponent(() =>
    import('../components/tableModal.vue')
);
const EmojiModal = defineAsyncComponent(() =>
    import('../components/emojiModal.vue')
);
const CustomToast = defineAsyncComponent(() =>
    import('../components/customToast.vue')
);
const TextToolbar = defineAsyncComponent(() =>
    import("../components/textToolbar.vue")
);
// 状态管理
const isDarkMode = ref(true); // 暗黑模式
const isLoading = ref(false);
const showDropdown = ref(false);
const showToast = ref(false);// 弹窗状态
const toastMessage = ref('');
const toastType = ref('success'); // success/error
const onlyEdit = ref(false); // 编辑模式
const onlyPreview = ref(false); // 预览模式

// 获取DOM引用
const editorRef = ref<HTMLTextAreaElement>();
const previewRef = ref<HTMLDivElement>();
// 用于防止滚动事件循环触发的标志
const isSyncing = ref(false);
// 弹窗相关状态
const showTableModal = ref(false); // 控制弹窗显示
const showCodeModal = ref(false);
const defaultLang = ref('javascript');
const defaultCode = ref();
const showEmojiModal =  ref(false);
const isFullScreen = ref(false); // 全屏状态
const isHtmlMode = ref(false);
// 配置marked高亮代码
marked.setOptions({
  // @ts-ignore
  highlight: function (code: string, language: string) {
    // 检查 Prism 是否支持该语言
    const validLanguage = Prism.languages[language] ? language : 'plaintext';
    // 使用 Prism 进行代码高亮
    return Prism.highlight(code, Prism.languages[validLanguage], validLanguage);
  },
});
// 初始化Markdown内容
const markdownContent = ref(initialMarkdownContent);

// 渲染后的HTML
const renderedMarkdown = computed(() => {
  // @ts-ignore
  return DOMPurify.sanitize(marked.parse(markdownContent.value));
});

// 处理确认插入代码块
const handleCodeBlockConfirm = (language: string, content: string) => {
  // 生成Markdown代码块语法
  const codeBlock = `\n\`\`\`${language}\n${content || ''}\n\`\`\``;
  // 插入到编辑器
  addContentToEditor(codeBlock);
  // 关闭弹窗
  showCodeModal.value = false;
};

// 处理确认插入表格
const handleTableConfirm = async (rows: number, cols: number) => {
  // 关闭弹窗
  showTableModal.value = false;
  // 生成表格内容（复用原有的generateMarkdownTable方法）
  const {generateMarkdownTable} = await import("../utils/tableGenerator.ts");
  const tableContent = generateMarkdownTable(rows, cols);
  // 插入到编辑器
  addContentToEditor(tableContent);
  // 显示成功提示
  showCustomToast(`已插入 ${rows}行×${cols}列 表格`);
};

const openFileSelect = (accept: string) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  const fileType = accept === 'image/*' ? 'img' : 'file';
  input.onchange = (e) => handleFileSelect(e, fileType);

  input.click();
};

// 处理文件选择（接收事件和文件类型）
const handleFileSelect = async (e: Event, fileType: 'img' | 'file') => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  try {
    isLoading.value = true;
    // 根据文件类型处理
    let content: string;
    const {FileUploadHandler} = await import("../utils/uploadHandler.ts");
    if (fileType === 'img') {
      // 处理图片
      content = await FileUploadHandler.handleImage(file);
    } else {
      content = await FileUploadHandler.handleFile(file);
    }

    showCustomToast('上传成功！', 'success');
    addContentToEditor(`\n${content}`);
  } catch (error) {
    console.error('上传失败:', error);
    showCustomToast('上传失败，请重试', 'error');
  } finally {
    isLoading.value = false;
    target.value = ''; // 允许重复选择同一文件
  }
};

const handleEmojiSelect = (emojiUnicode: string) => {
  // 调用现有方法将 Emoji 插入到编辑器光标位置
  addContentToEditor(emojiUnicode);
  // 关闭弹窗
  showEmojiModal.value = false;
};

// 点击空白处关闭下拉菜单
const handleClickOutside = (e: any) => {
  const dropdown = document.querySelector('.dropdown-menu');
  if (dropdown && !dropdown.contains(e.target)) {
    showDropdown.value = false;
  }
};

const downloadMarkdown = async () => {
  showDropdown.value = false;
  try {
    // 动态导入downloadHandler.ts
    const { markdownHandler } = await import("../utils/downloadHandler.ts");
    markdownHandler(markdownContent.value);
    showCustomToast('Markdown文件下载成功');
  } catch (error: any) {
    showCustomToast('下载失败：' + error.message, 'error');
  }
};

// 下载PDF文件（已优化html2pdf，继续优化pdfHandler）
const downloadPdf = async () => {
  showDropdown.value = false;
  isLoading.value = true;
  let tempElement: any;
  try {
    // 动态导入html2pdf和downloadHandler
    const [html2pdfModule] = await Promise.all([
      // @ts-ignore
      import('html2pdf.js')
    ]);
    const html2pdf = html2pdfModule.default;
    const { pdfHandler } = await import("../utils/downloadHandler.ts");

    tempElement = pdfHandler(renderedMarkdown);
    document.body.appendChild(tempElement);
    const {pdfOptions} = await import("../consts/pdfConfig.ts");
    await html2pdf().from(tempElement).set(pdfOptions).save();
    showCustomToast('PDF文件下载成功');
  } catch (error: any) {
    showCustomToast('PDF生成失败：' + error.message, 'error');
  } finally {
    document.body.removeChild(tempElement);
    isLoading.value = false;
  }
};
// 编辑器滚动时同步到预览区（绑定到编辑器的scroll事件）
const handleEditorScroll = () => {
  syncScroll(editorRef, previewRef, isSyncing);
};

// 预览区滚动时同步到编辑器（绑定到预览区的scroll事件）
const handlePreviewScroll = () => {
  syncScroll(previewRef, editorRef, isSyncing);
};


// 解决Tab按键冲突
const handleKeyDown = async (e: KeyboardEvent) => {
  // 动态导入keyboardHandler.ts
  const { keyboardHandler } = await import("../utils/keyboardHandler.ts");
  await keyboardHandler(e, editorRef, markdownContent);
};
// 工具类：显示自定义弹窗
const showCustomToast = (message: any, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  // 3秒后自动关闭
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 工具类：插入内容到光标处
const addContentToEditor = (content: string) => {
  if (!editorRef.value) return;
  // 插入表格到编辑器（光标位置）
  const editor = editorRef.value;
  const startPos = editor.selectionStart;
  const endPos = editor.selectionEnd;

  markdownContent.value =
      markdownContent.value.substring(0, startPos) +
      content+
      markdownContent.value.substring(endPos);
}

// 监听代码块的高亮
watch(markdownContent, () => {
  nextTick(() => {
    // 只高亮预览区域内的代码块
    const previewContainer = document.querySelector('.preview-content');
    if (previewContainer) {
      previewContainer.querySelectorAll('pre code').forEach((block) => {
        // 使用 Prism 进行代码高亮
        Prism.highlightElement(block as HTMLElement);
      });
    }
  });
});

onMounted(() => {
  // 监听点击事件关闭下拉菜单
  document.addEventListener('click', handleClickOutside);
});

// 在组件卸载时移除事件监听
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
@import '../styles/editArea.css';
@import '../styles/previewArea.css';
@import '../styles/common.css';
@import '../styles/header.css';
@import '../styles/loading.css';
</style>
