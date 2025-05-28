const accessibilityBtn = document.getElementById('accessibilityBtn');
const menuBtn = document.getElementById('menuBtn');
const menuModal = document.getElementById('menuModal');
const menuClose = document.getElementById('menuClose');
const menuLogo = document.getElementById('menuLogo');
const accessibilityModal = document.getElementById('accessibilityModal');
const closeAccessibilityModal = document.querySelectorAll('.close-accessibility-modal');
const closeModal = document.querySelectorAll('.close-modal');
const readAloudToggle = document.getElementById('readAloudToggle');
let speechSynthesis = window.speechSynthesis;
let utterance = null;

function toggleModal(id) {
const modal = document.getElementById(id);
modal.classList.toggle('active');
if (modal.classList.contains('active')) {
const firstFocusable = modal.querySelector('button, input');
firstFocusable?.focus();
}
}

function detectSystemTheme() {
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
return systemTheme.matches ? 'dark' : 'light';
}

function applyTheme(theme) {
if (theme === 'system') {
const systemTheme = detectSystemTheme();
document.body.setAttribute('data-theme', systemTheme);
} else {
document.body.setAttribute('data-theme', theme);
}
updateMenuLogo();
saveSettings('theme', theme);
}

function updateMenuLogo() {
const theme = document.body.getAttribute('data-theme');
menuLogo.src = theme === 'dark' ? '/assets/images/logo-dark.svg' : '/assets/images/logo-light.svg';
}

function setTheme(theme) {
applyTheme(theme);
}

function startReadAloud() {
if (speechSynthesis.speaking) {
speechSynthesis.cancel();
}
const jobContent = document.querySelector('.job-content').textContent;
utterance = new SpeechSynthesisUtterance(jobContent);
utterance.lang = 'en-US';
utterance.rate = 0.9;
utterance.pitch = 1;
speechSynthesis.speak(utterance);
}

function stopReadAloud() {
if (speechSynthesis.speaking) {
speechSynthesis.cancel();
}
}

function saveSettings(key, value) {
localStorage.setItem(key, value);
}

function getSetting(key) {
return localStorage.getItem(key);
}

function setHeadingFont(font) {
let fontValue;
switch(font) {
case 'Lexend':
fontValue = "'Lexend', sans-serif";
break;
case 'Montserrat':
fontValue = "'Montserrat', sans-serif";
break;
case 'Atkinson Hyperlegible':
fontValue = "'Atkinson Hyperlegible', sans-serif";
break;
}
document.documentElement.style.setProperty('--font-heading', fontValue);
saveSettings('headingFont', font);
}

function setBodyFont(font) {
let fontValue;
switch(font) {
case 'Noto Sans':
fontValue = "'Noto Sans', sans-serif";
break;
case 'Mona Sans':
fontValue = "'Mona Sans', sans-serif";
break;
case 'Atkinson Hyperlegible':
fontValue = "'Atkinson Hyperlegible', sans-serif";
break;
}
document.documentElement.style.setProperty('--font-body', fontValue);
saveSettings('bodyFont', font);
}

function setTextSize(size) {
let textXs, textSm, textMd, textLg;
switch(size) {
case 'small':
textXs = '0.75rem';
textSm = '0.875rem';
textMd = '1rem';
textLg = '1.25rem';
break;
case 'medium':
textXs = '0.875rem';
textSm = '1rem';
textMd = '1.25rem';
textLg = '1.5rem';
break;
case 'large':
textXs = '1rem';
textSm = '1.125rem';
textMd = '1.5rem';
textLg = '1.75rem';
break;
}
document.documentElement.style.setProperty('--text-xs', textXs);
document.documentElement.style.setProperty('--text-sm', textSm);
document.documentElement.style.setProperty('--text-md', textMd);
document.documentElement.style.setProperty('--text-lg', textLg);
saveSettings('textSize', size);
}

function setLineHeight(height) {
document.documentElement.style.setProperty('--current-leading', height);
saveSettings('lineHeight', height);
}

function setLetterSpacing(spacing) {
document.documentElement.style.setProperty('--current-letter-spacing', spacing);
saveSettings('letterSpacing', spacing);
}

function loadSettings() {
const savedTheme = getSetting('theme');
if (savedTheme) {
applyTheme(savedTheme);
document.querySelector(`#mode-options .option-btn[data-value="${savedTheme}"]`)?.classList.add('active');
}

const savedHeadingFont = getSetting('headingFont');
if (savedHeadingFont) {
setHeadingFont(savedHeadingFont);
document.querySelector(`#heading-font-options .option-btn[data-value="${savedHeadingFont}"]`)?.classList.add('active');
}

const savedBodyFont = getSetting('bodyFont');
if (savedBodyFont) {
setBodyFont(savedBodyFont);
document.querySelector(`#body-font-options .option-btn[data-value="${savedBodyFont}"]`)?.classList.add('active');
}

const savedTextSize = getSetting('textSize');
if (savedTextSize) {
setTextSize(savedTextSize);
document.querySelector(`#text-size-options .option-btn[data-value="${savedTextSize}"]`)?.classList.add('active');
}

const savedLineHeight = getSetting('lineHeight');
if (savedLineHeight) {
setLineHeight(savedLineHeight);
document.querySelector(`#line-height-options .option-btn[data-value="${savedLineHeight}"]`)?.classList.add('active');
}

const savedLetterSpacing = getSetting('letterSpacing');
if (savedLetterSpacing) {
setLetterSpacing(savedLetterSpacing);
document.querySelector(`#letter-spacing-options .option-btn[data-value="${savedLetterSpacing}"]`)?.classList.add('active');
}

window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
if (getSetting('theme') === 'system') {
applyTheme('system');
}
});
}

accessibilityBtn.addEventListener('click', () => {
toggleModal('accessibilityModal');
});

menuBtn.addEventListener('click', () => {
toggleModal('menuModal');
});

menuClose.addEventListener('click', () => {
toggleModal('menuModal');
});

closeAccessibilityModal.forEach(btn => {
btn.addEventListener('click', function() {
const modal = this.closest('.accessibility-modal');
toggleModal(modal.id);
});
});

closeModal.forEach(btn => {
btn.addEventListener('click', function() {
const modal = this.closest('.modal');
toggleModal(modal.id);
});
});

const optionHeaders = document.querySelectorAll('.option-header');
optionHeaders.forEach(header => {
header.addEventListener('click', function() {
const optionId = this.id.replace('-header', '-options');
const optionButtons = document.getElementById(optionId);
const svg = this.querySelector('svg');
optionButtons.classList.toggle('active');
this.classList.toggle('active');
});
});

document.querySelectorAll('.option-btn').forEach(btn => {
btn.addEventListener('click', function() {
const value = this.dataset.value;
const groupId = this.closest('.option-group').querySelector('.option-header').id.replace('-header', '');
const groupButtons = document.querySelectorAll(`#${groupId}-options .option-btn`);
groupButtons.forEach(b => b.classList.remove('active'));
this.classList.add('active');
switch(groupId) {
case 'mode':
setTheme(value);
break;
case 'heading-font':
setHeadingFont(value);
break;
case 'body-font':
setBodyFont(value);
break;
case 'text-size':
setTextSize(value);
break;
case 'line-height':
setLineHeight(value);
break;
case 'letter-spacing':
setLetterSpacing(value);
break;
}
});
});

if (readAloudToggle) {
readAloudToggle.addEventListener('change', function() {
if (this.checked) {
startReadAloud();
} else {
stopReadAloud();
}
});
}
