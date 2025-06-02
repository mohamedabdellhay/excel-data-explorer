export default class RowView {
  constructor(container) {
    this.container = container;
  }

  displayRow(rowData, headers) {
    this.container.innerHTML = "";
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
        valueElement.appendChild(this.createCopyButton(value));
      }

      rowElement.appendChild(headerElement);
      rowElement.appendChild(valueElement);
      this.container.appendChild(rowElement);
    });
  }

  formatValue(value) {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return value;
  }

  createCopyButton(value) {
    const button = document.createElement("button");
    button.className = "copy-btn";
    button.textContent = "Copy";
    button.dataset.clicked = "0";
    button.onclick = () => {
      navigator.clipboard.writeText(value.toString());
      button.dataset.clicked = "1";
    };
    return button;
  }
}
