// dom
const inputDom = document.querySelector("#txt-content"); // 文本输入
const inputFileDom = document.querySelector("#file"); // 文件input
const logoDom = document.querySelector(".logo"); // 触发上传文件的dom
const logoTip = document.querySelector(".logo-tip"); // logo上传提示文字
const logoClose = document.querySelector(".logo-close"); // logo删除按钮
const logoImg = document.querySelector(".logo-img"); // logo img
const qrBoxDom = document.querySelector(".qrcode-box"); // 二维码区域
const downloadDom = document.querySelector(".download"); // 下载用容器
const qrImgDom = document.querySelector("#qrcode"); // 二维码图片
const qrLogoImgDom = document.querySelector("#qr-logo"); // 二维码图片
const btnDom = document.querySelector("#btn"); // 提交按钮
const yearDom = document.getElementById("year"); // 底部声明的年

// logoUrl
let logoUrl;

// 初始化方法
function initialization() {
  yearDom.innerText = new Date().getFullYear();
  qrImgDom.src = `class/qr.php?content=${location.href}&logo=../images/ico/qr.png`;
}

// 初始化
initialization();

// 文本框输入事件
inputDom.addEventListener("input", function (e) {
  const value = e.target.value;
  if (value.replace(/\s/g, "") === "") initialization();
});

// 点击上传logo的div
logoDom.addEventListener("click", function () {
  inputFileDom.click();
});

// 文件input选择文件事件
inputFileDom.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    logoUrl = e.target.result;
    logoImg.src = logoUrl;
    logoImg.style.display = "block";
    logoTip.style.display = "none";
    logoClose.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// 删除logo
logoClose.addEventListener("click", function (e) {
  e.stopPropagation();
  logoUrl = null;
  logoImg.src = "";
  logoImg.style.display = "none";
  logoTip.style.display = "block";
  logoClose.style.display = "none";
});

// 生成二维码方法
btnDom.addEventListener("click", function submit() {
  let content = inputDom.value.replace(/(^\s*)|(\s*$)/g, "");
  if (content === "") {
    initialization();
    inputDom.value = "";
    inputDom.focus();
    return;
  }
  content = encodeURIComponent(content);
  qrImgDom.src = `class/qr.php?content=${content}`;
  if (logoUrl) {
    qrLogoImgDom.src = logoUrl;
    qrLogoImgDom.style.display = "block";
  } else {
    qrLogoImgDom.style.display = "none";
  }
});

// 点击二维码下载
qrBoxDom.addEventListener("click", function () {
  html2canvas(downloadDom).then((canvas) => {
    const imageUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = inputDom.value.slice(0, 30) || "image" + ".png";
    a.click();
  });
});

// 二维码区域阻止右键
qrBoxDom.addEventListener("mousedown", function (e) {
  e.preventDefault();
  e.stopPropagation();
});
qrBoxDom.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  e.stopPropagation();
});

// 作为子应用时的处理
if (window.self !== window.top) {
  const body = document.body;
  body.style.backgroundColor = "#fff";
  const box = document.querySelector(".box");
  if (box) {
    box.style.backgroundColor = "#fff";
    box.style.boxShadow = "none";
    box.style.padding = "0 20px";
  }
  const footer = document.querySelector(".copyright");
  if (footer) footer.style.display = "none";
}
