export const overlay = {
  previousOverflowValue: "", // TODO: is this needed?
  isInitiated: false,
  isActive: false,
  init() {
    if (this.isInitiated) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = "termit-overlay";
    document.body.appendChild(overlay);
    this.isInitiated = true;
  },
  on() {
    this.init();
    this.previousOverflowValue = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.getElementById("termit-overlay")!.style.display = "block";
    this.isActive = true;
  },
  off() {
    if (!this.isInitiated){
      return;
    }
    document.body.style.overflow = this.previousOverflowValue;
    document.getElementById("termit-overlay")!.style.display = "none";
    this.isActive = false;
  },
  destroy() {
    const element = document.getElementById("termit-overlay")!;

    document.body.removeChild(element);
    this.isInitiated = false;
  },
};
