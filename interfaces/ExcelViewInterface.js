export default class ExcelViewInterface {
  bindUploadFile(handler) {}
  bindCopyButton() {}
  bindNavigation(prevHandler, nextHandler, exitHandler) {}
  showResults() {}
  hideResults() {}
  displayCurrentRow(rowData, headers, currentIndex, totalRows) {}
  updateNavButtons(currentIndex, totalRows) {}
  showLoading() {}
  hideLoading() {}
  showError(message) {}
  showSuccess(message) {}
  updateProgress(percentage) {}
}
