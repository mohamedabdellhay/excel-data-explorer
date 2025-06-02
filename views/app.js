export default class ExcelView {
  constructor() {
    this.uploadCard = document.getElementById("uploadCard");
    this.fileInput = document.getElementById("fileInput");
    this.results = document.getElementById("results");
    this.currentRowContainer = document.querySelector(
      "#currentRow .key-value-scroll"
    );
    this.rowPosition = document.getElementById("rowPosition");
    this.fileName = document.getElementById("fileName");
    this.loader = document.getElementById("loader");
    this.statusMessage = document.getElementById("statusMessage");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.exitBtn = document.getElementById("exitBtn");
    this.copyBtn = null;
  }

  bindUploadFile(handler) {
    this.fileInput.addEventListener("change", handler);
  }
  completedRow(currentRow) {
    return currentRow.completed;
  }
  bindCopyButton() {
    this.copyBtn = document.querySelectorAll(".copy-btn");
    for (let i = 0; i < this.copyBtn.length; i++) {
      if (this.copyBtn[i].dataset.clicked === "0") {
        console.log("false");
        return false;
      }
    }
    console.log("true");
    return true;
  }

  bindNavigation(prevHandler, nextHandler, exitHandler) {
    this.prevBtn.addEventListener("click", prevHandler);
    this.nextBtn.addEventListener("click", nextHandler);
    this.exitBtn.addEventListener("click", exitHandler);
  }

  showResults() {
    this.results.style.display = "block";
  }

  hideResults() {
    this.results.style.display = "none";
  }

  displayCurrentRow(rowData, headers, currentIndex, totalRows) {
    this.currentRowContainer.innerHTML = "";
    this.rowPosition.textContent = `Row ${currentIndex + 1} of ${totalRows}`;
    console.log(rowData);
    if (rowData.completed) {
      this.currentRowContainer.parentElement.parentElement.classList.add(
        "status-success"
      );
      this.currentRowContainer.parentElement.classList.add("status-error");
    } else {
      this.currentRowContainer.parentElement.parentElement.classList.remove(
        "status-success"
      );
      this.currentRowContainer.parentElement.classList.remove("status-error");
    }
    headers.forEach((header) => {
      const rowElement = document.createElement("div");
      rowElement.className = "key-value-row flex flex-col";

      const headerElement = document.createElement("div");
      headerElement.className = "key-value-header";
      headerElement.textContent = header;

      const valueElement = document.createElement("div");
      valueElement.className = "key-value-content";

      const value = rowData[header];
      if (value === undefined || value === null || value === "") {
        valueElement.innerHTML = '<span class="empty-value">Empty</span>';
      } else {
        valueElement.innerHTML = `<span>${this.formatValue(value)}</span>`;
        valueElement.appendChild(this.copyButton(rowData, value));
      }

      rowElement.appendChild(headerElement);
      rowElement.appendChild(valueElement);
      this.currentRowContainer.appendChild(rowElement);
    });
  }

  updateNavButtons(currentIndex, totalRows) {
    this.prevBtn.disabled = currentIndex <= 0;
    this.nextBtn.disabled = currentIndex >= totalRows;
  }

  showLoading() {
    this.loader.style.display = "block";
    this.hideResults();
  }

  hideLoading() {
    this.loader.style.display = "none";
  }

  showSuccess(message) {
    this.statusMessage.textContent = message;
    this.statusMessage.className = "status-message status-success";
    this.statusMessage.style.display = "block";
    setTimeout(() => {
      this.statusMessage.style.display = "none";
    }, 3000);
  }

  showError(message) {
    this.statusMessage.textContent = message;
    this.statusMessage.className = "status-message status-error";
    this.statusMessage.style.display = "block";
    setTimeout(() => {
      this.statusMessage.style.display = "none";
    }, 3000);
  }

  setFileName(name) {
    this.fileName.textContent = name || "No file selected";
  }

  formatValue(value) {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return value;
  }

  copyButton(rowData, value) {
    const button = document.createElement("button");

    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6365F1">
                        <path d="M355-240q-27.64 0-47.32-19.68T288-307v-480q0-27.64 19.68-47.32T355-854h384q27.64 0 47.32 19.68T806-787v480q0 27.64-19.68 47.32T739-240H355Zm0-67h384v-480H355v480ZM221-106q-27.64 0-47.32-19.68T154-173v-547h67v547h451v67H221Zm134-201v-480 480Z"/>
                      </svg>`;
    button.className = "copy-btn cursor-pointer text-before-copy";
    if (rowData.completed) {
      button.disabled = true;
      button.style.cursor = "not-allowed";
      button.style.opacity = "0.5";
      button.dataset.clicked = 1;
    }

    button.dataset.clicked = 0;
    button.addEventListener("click", () => {
      button.parentElement.parentElement.classList.add("status-success");
      navigator.clipboard.writeText(value);
      button.dataset.clicked = 1;
    });
    return button;
  }

  getValueType(value) {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (Array.isArray(value)) return "array";
    if (value instanceof Date) return "date";
    return typeof value;
  }

  updateProgress(percentage) {
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;
  }
}
