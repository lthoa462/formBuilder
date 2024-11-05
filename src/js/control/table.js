import control from '../control'

/**
 * Table control class
 * Output a <table> form element with customizable rows and columns.
 * @extends control
 */
export default class controlTable extends control {
  /**
   * build a table DOM element with rows and cells containing input fields and Alert button
   * @return {HTMLElement} DOM Element to be injected into the form.
   */
  build() {
    const cols = this.config.cols || 1

    // Tạo phần tử div chứa table và nút thêm hàng
    this.tableContainer = document.createElement('div')
    this.tableContainer.innerHTML = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th><input type="text" class="form-control header-input" placeholder="Tên cột"></th>
            <th><button type="button" class="btn btn-success add-col">+</button></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <button type="button" class="btn btn-success add-row">+</button>
    `

    const tbody = this.tableContainer.querySelector('tbody')

    // Tạo dòng đầu tiên với các ô input
    const row = this.createRow(cols)
    tbody.appendChild(row)

    return this.tableContainer
  }

  /**
   * Helper method to create a table row with input cells
   * @param {Number} cols - Number of columns
   * @return {HTMLElement} A table row element
   */
  createRow(cols) {
    const row = document.createElement('tr')

    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('td')
      const input = document.createElement('input')
      input.type = 'text'
      input.className = 'form-control cell-input'
      cell.appendChild(input)
      row.appendChild(cell)
    }

    // Thêm nút Alert ở cuối mỗi hàng
    const alertCell = document.createElement('td')
    const alertButton = document.createElement('button')
    alertButton.type = 'button'
    alertButton.className = 'btn btn-primary alert-row'
    alertButton.textContent = 'Alert'

    alertButton.addEventListener('click', () => {
      const rowInputs = row.querySelectorAll('.cell-input')
      const rowData = Array.from(rowInputs).map(input => input.value)
      alert('Dữ liệu hàng này: ' + rowData.join(', '))
    })

    alertCell.appendChild(alertButton)
    row.appendChild(alertCell)

    return row
  }

  /**
   * onRender callback
   */
  onRender() {
    // Xử lý sự kiện cho nút thêm cột
    const addColButton = this.tableContainer.querySelector('.add-col')
    addColButton.addEventListener('click', () => {
      this.addColumn()
    })

    // Xử lý sự kiện cho nút thêm hàng
    const addRowButton = this.tableContainer.querySelector('.add-row')
    addRowButton.addEventListener('click', () => {
      const newRow = this.createRow(this.getCurrentColumnCount())
      this.tableContainer.querySelector('tbody').appendChild(newRow)
    })
  }

  /**
   * Helper method to add a new column
   */
  addColumn() {
    const theadRow = this.tableContainer.querySelector('thead tr')
    const tbodyRows = this.tableContainer.querySelectorAll('tbody tr')

    // Thêm ô input vào hàng đầu của thead để nhập tên cột mới
    const newHeaderCell = document.createElement('th')
    const headerInput = document.createElement('input')
    headerInput.type = 'text'
    headerInput.className = 'form-control header-input'
    headerInput.placeholder = 'Tên cột'
    newHeaderCell.appendChild(headerInput)
    theadRow.insertBefore(newHeaderCell, theadRow.lastChild)

    // Thêm ô mới vào mỗi hàng trong tbody
    tbodyRows.forEach(row => {
      const newCell = document.createElement('td')
      const input = document.createElement('input')
      input.type = 'text'
      input.className = 'form-control cell-input'
      newCell.appendChild(input)
      row.appendChild(newCell)
    })
  }

  /**
   * Helper method to get the current column count based on header cells
   */
  getCurrentColumnCount() {
    const headerCells = this.tableContainer.querySelectorAll('thead tr th')
    return headerCells.length - 1 // Loại trừ ô chứa nút thêm cột
  }
}

// Register this control for the 'table' type
control.register('table', controlTable)
