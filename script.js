"use strict";

// These interactions are local examples; they never create member records.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
}
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(isOpen));
  navigation.classList.toggle("is-open", isOpen);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia("(min-width: 601px)").addEventListener("change", closeMenu);

const tagButton = document.querySelector("#tag-button");
const resetButton = document.querySelector("#reset-demo");
function setCheckIn(checked) {
  document.querySelector("#visit-count").textContent = checked ? "8" : "7";
  document.querySelector("#today-cell").classList.toggle("attended", checked);
  document.querySelector(".calendar").setAttribute("aria-label", `10월 출석 예시, 목표 12회 중 ${checked ? 8 : 7}회 출석`);
  document.querySelector("#record-message").textContent = checked ? "여덟 번째 발걸음, 잘 쌓았어요!" : "오늘의 출석을 더해 볼까요?";
  tagButton.setAttribute("aria-pressed", String(checked));
  tagButton.querySelector("span").textContent = checked ? "오늘의 출석 완료" : "출석 태그 체험하기";
  tagButton.lastElementChild.textContent = checked ? "✓" : "＋";
  resetButton.hidden = !checked;
}
tagButton.setAttribute("aria-pressed", "false");
tagButton.addEventListener("click", () => setCheckIn(true));
resetButton.addEventListener("click", () => {
  setCheckIn(false);
  tagButton.focus();
});

const roleTabs = [...document.querySelectorAll('[role="tab"]')];
function selectRole(selected) {
  roleTabs.forEach((tab) => {
    const active = tab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
  });
}
roleTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectRole(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? roleTabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + roleTabs.length) % roleTabs.length;
    selectRole(roleTabs[nextIndex]);
    roleTabs[nextIndex].focus();
  });
});

const demoDialog = document.querySelector("#demo-dialog");
const demoFrame = document.querySelector("#demo-frame");
const demos = {
  member: { path: "demo/member.html?v=logo-v1", title: "회원 데모" },
  operator: { path: "demo/operator.html?v=logo-v1", title: "운영자 데모" },
};
let demoTrigger;
document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => {
    const demo = demos[button.dataset.demo];
    if (!demo) return;
    demoTrigger = button;
    document.querySelector("#demo-title").textContent = demo.title;
    document.querySelector("#demo-full-link").href = demo.path;
    demoFrame.title = `디디다 ${demo.title}`;
    demoFrame.src = demo.path;
    demoDialog.showModal();
    document.body.classList.add("modal-open");
    document.querySelector("#close-demo").focus();
  });
});
document.querySelector("#close-demo").addEventListener("click", () => demoDialog.close());
demoDialog.addEventListener("click", (event) => {
  const bounds = demoDialog.getBoundingClientRect();
  if (event.target === demoDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) demoDialog.close();
});
// Keyboard events do not bubble out of an iframe, so forward Escape from our local demos.
demoFrame.addEventListener("load", () => {
  if (!demoDialog.open) return;
  const frameDocument = demoFrame.contentDocument;
  frameDocument?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      demoDialog.close();
    }
  });
});
demoDialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  demoFrame.removeAttribute("src");
  demoTrigger?.focus();
});

document.querySelector("#copy-email").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText("hello@dididah.kr");
    status.textContent = "이메일 주소를 복사했어요.";
  } catch {
    status.textContent = "hello@dididah.kr을 직접 선택해 복사해 주세요.";
  }
});
document.querySelector("#year").textContent = new Date().getFullYear();
