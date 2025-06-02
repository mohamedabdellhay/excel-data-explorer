export default class NavigationView {
  constructor(prevBtn, nextBtn, exitBtn, rowPosition) {
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.exitBtn = exitBtn;
    this.rowPosition = rowPosition;
  }

  updateNavigation(currentIndex, totalRows) {
    this.prevBtn.disabled = currentIndex <= 0;
    this.nextBtn.disabled = currentIndex >= totalRows;
    this.rowPosition.textContent = `Row ${currentIndex + 1} of ${totalRows}`;
  }

  bindNavigation(prevHandler, nextHandler, exitHandler) {
    this.prevBtn.addEventListener("click", prevHandler);
    this.nextBtn.addEventListener("click", nextHandler);
    this.exitBtn.addEventListener("click", exitHandler);
  }
}
