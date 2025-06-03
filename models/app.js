export default class ExcelModel {
  constructor() {
    this.data = [];
    this.headers = [];
    this.currentIndex = 0;
    this.state = {
      isLoading: false,
      error: null,
    };
    this.completionPercentage = 0;
  }

  setData(data) {
    this.data = data;
    if (data.length > 0) {
      this.headers = Object.keys(data[0]);
    }
    this.setCompletedAllFalse();
    this.calculateCompletion();
  }

  setCurrentIndex(index) {
    if (index >= 0 && index < this.data.length) {
      this.currentIndex = index;
      return true;
    }
    return false;
  }
  setCompletedTrue(index) {
    this.data[index].completed = true;
  }
  setCompletedFalse(index) {
    this.data[index].completed = false;
  }

  setCompletedAllFalse() {
    this.data.forEach((row) => {
      row.completed = false;
    });
  }
  getCurrentRow() {
    return this.data[this.currentIndex] || {};
  }

  getTotalRows() {
    return this.data.length;
  }

  setHeaders(headers) {
    this.headers = headers;
  }

  setLoading(isLoading) {
    this.state.isLoading = isLoading;
  }

  setError(error) {
    this.state.error = error;
  }

  getValueType(value) {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (Array.isArray(value)) return "array";
    if (value instanceof Date) return "date";
    return typeof value;
  }

  formatValue(value) {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return value;
  }

  calculateCompletion() {
    if (this.data.length === 0) {
      this.completionPercentage = 0;
      return;
    }

    const completedCount = this.data.filter(
      (item) => item.completed === true
    ).length;
    this.completionPercentage = Math.round(
      (completedCount / this.data.length) * 100
    );
  }
  isAllCompleted() {
    const completedData = this.data.filter((row) => row.completed === true);
    return completedData.length === this.data.length;
  }
}
