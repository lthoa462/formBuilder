import control from '../control'
import FormBuilder from '../form-builder'

export default class controlTableBuilder extends control {
  static get definition() {
    return {
      i18n: {
        default: 'Table Builder',
      },
    }
  }

  configure() {
    // Cấu hình mặc định với một cột
    this.config = {
      columns: [{ header: 'Column 1', controls: [] }],
    }
  }

  build() {
    const table = document.createElement('div')
    table.className = 'table-builder'

    // Khởi tạo cột từ cấu hình
    this.config.columns.forEach((column, columnIndex) => {
      const columnElement = this.createColumn(column, columnIndex)
      table.appendChild(columnElement)
    })

    // Thêm nút "Add Column"
    const addColumnButton = document.createElement('button')
    addColumnButton.textContent = 'Add Column'
    addColumnButton.onclick = () => this.addColumn(table)
    table.appendChild(addColumnButton)

    return table
  }

  // Hàm tạo từng cột
  createColumn(columnConfig, columnIndex) {
    const columnElement = document.createElement('div')
    columnElement.className = 'table-column'

    // Header của cột
    const header = document.createElement('div')
    header.contentEditable = true
    header.className = 'column-header'
    header.textContent = columnConfig.header || `Column ${columnIndex + 1}`
    header.oninput = () => {
      this.config.columns[columnIndex].header = header.textContent // Cập nhật header trong config
    }
    columnElement.appendChild(header)

    // Drop zone (FormBuilder con) trong ô
    const dropZone = document.createElement('div')
    dropZone.className = 'drop-zone'
    dropZone.dataset.column = columnIndex

    const subFormBuilder = document.createElement('div')
    subFormBuilder.className = 'sub-formbuilder'
    dropZone.appendChild(subFormBuilder)

    // Khởi tạo FormBuilder instance cho từng ô và giới hạn chỉ có một control
    const formBuilderInstance = $(subFormBuilder).formBuilder({
      disableFields: ['button', 'header', 'file', 'paragraph', 'select', 'textarea', 'date', 'autocomplete'], // Các control cần vô hiệu hóa
      onAdd: fieldId => {
        const currentFields = formBuilderInstance.actions.getData()

        // Giới hạn chỉ cho phép một control duy nhất
        if (currentFields.length > 1) {
          formBuilderInstance.actions.removeField(currentFields[0].id)
        }
      },
      onSave: fieldData => {
        // Chỉ giữ lại một control
        this.config.columns[columnIndex].controls = fieldData.slice(0, 1) // Chỉ giữ lại control đầu tiên
      },
    })

    // Lưu instance FormBuilder để có thể truy cập sau này
    this.config.columns[columnIndex].formBuilder = formBuilderInstance

    columnElement.appendChild(dropZone)
    return columnElement
  }

  // Hàm thêm cột mới vào bảng
  addColumn(table) {
    const newColumnIndex = this.config.columns.length
    const newColumn = { header: `Column ${newColumnIndex + 1}`, controls: [] }
    this.config.columns.push(newColumn)

    const columnElement = this.createColumn(newColumn, newColumnIndex)
    table.insertBefore(columnElement, table.lastChild) // Thêm cột mới trước nút "Add Column"
  }

  // Render lại các control từ config khi tải lại form
  onRender() {
    this.config.columns.forEach((column, columnIndex) => {
      if (!this.element) {
        console.error('this.element is undefined in onRender.')
        return
      }
      const dropZone = this.element.querySelector(`.drop-zone[data-column="${columnIndex}"] .sub-formbuilder`)
      if (dropZone) {
        const savedFields = this.config.columns[columnIndex].controls
        const formBuilderInstance = $(dropZone).formBuilder({
          fields: savedFields,
          disableFields: ['button', 'header', 'file', 'paragraph', 'select', 'textarea', 'date', 'autocomplete'], // Các control cần vô hiệu hóa
          onAdd: fieldId => {
            const currentFields = formBuilderInstance.actions.getData()

            // Giới hạn chỉ có một control trong mỗi FormBuilder
            if (currentFields.length > 1) {
              formBuilderInstance.actions.removeField(currentFields[0].id)
            }
          },
        })

        // Lưu instance FormBuilder để có thể truy cập sau này
        this.config.columns[columnIndex].formBuilder = formBuilderInstance
      }
    })
  }
}

control.register('tableBuilder', controlTableBuilder)
