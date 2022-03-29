export const overlay = {
  previousOverflowValue: "",
  init() {
    const overlay = document.createElement("div");
    overlay.id = "termit-overlay";
    document.body.appendChild(overlay);
  },
  on() {
    this.previousOverflowValue = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.getElementById("termit-overlay").style.display = "block";
  },
  off() {
    document.body.style.overflow = this.previousOverflowValue;
    document.getElementById("termit-overlay").style.display = "none";
  },
};
