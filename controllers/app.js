export default class ExcelController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindUploadFile(this.handleFileUpload.bind(this));
    this.view.bindNavigation(
      this.showPreviousRow.bind(this),
      this.showNextRow.bind(this),
      this.exit.bind(this)
    );
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.model.setLoading(true);
    this.view.showLoading();
    this.view.setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
          raw: false,
          dateNF: "yyyy-mm-dd",
        });

        this.model.setData(jsonData);
        this.model.setCurrentIndex(0);
        this.model.setLoading(false);

        // this.view.displayHeaders(this.model.headers);
        this.updateDisplay();
        this.view.showResults();
        this.view.showSuccess("File uploaded successfully!");
        this.view.uploadCard.classList.add("hidden");
      } catch (error) {
        this.model.setError(error.message);
        this.model.setLoading(false);
        this.view.showError(error.message);
      } finally {
        this.view.hideLoading();
      }
    };
    reader.readAsArrayBuffer(file);
  }

  updateDisplay() {
    this.view.displayCurrentRow(
      this.model.getCurrentRow(),
      this.model.headers,
      this.model.currentIndex,
      this.model.getTotalRows()
    );
    this.view.updateNavButtons(
      this.model.currentIndex,
      this.model.getTotalRows()
    );
    this.view.updateProgress(this.model.completionPercentage);
  }

  showPreviousRow() {
    if (this.model.setCurrentIndex(this.model.currentIndex - 1)) {
      this.updateDisplay();
    }
  }

  showNextRow() {
    if (this.view.completedRow(this.model.getCurrentRow())) {
      if (this.model.setCurrentIndex(this.model.currentIndex + 1)) {
        this.updateDisplay();
      }
      return;
    }
    if (this.view.bindCopyButton(this.model.getCurrentRow())) {
      this.model.setCompletedTrue(this.model.currentIndex);
      this.model.calculateCompletion();
      if (this.model.setCurrentIndex(this.model.currentIndex + 1)) {
        this.updateDisplay();
      }
    } else {
      alert("Row is not completed");
    }
  }

  exportData() {
    try {
      const dataStr = JSON.stringify(this.model.data, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportName = "exported_data.json";
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportName);
      linkElement.click();

      this.view.showSuccess("Data exported successfully!");
    } catch (error) {
      this.view.showError("Failed to export data: " + error.message);
    }
  }
  exit() {
    this.model.setData([]);
    this.model.setCurrentIndex(0);
    this.view.uploadCard.classList.remove("hidden");

    this.view.results.style.display = "none";
    this.view.fileName.textContent = "No file selected";
    this.view.statusMessage.textContent = "";
    this.view.statusMessage.style.display = "none";
    this.view.loader.style.display = "none";
    this.view.copyBtn = null;
  }
  toggleCompletion() {
    const currentRow = this.model.getCurrentRow();
    currentRow.completed = !currentRow.completed;
    this.model.calculateCompletion();
    this.updateDisplay();
  }
}
