import control from '../control'

/**
 * Form Area control class
 * Output a <div> container element that acts as an empty FormBuilder area, allowing drag-and-drop controls inside.
 * @extends control
 */
export default class controlFormArea extends control {
  /**
   * Constructor for controlFormArea to initialize necessary elements
   */
  constructor(options = {}) {
    super(options)
    this.formAreaControls = [] // Array to hold all controls added inside form area
    this.formBuilderInstance = null // Placeholder for FormBuilder instance inside form area
  }

  /**
   * Build a form area DOM element with an empty FormBuilder instance inside.
   * @return {HTMLElement} DOM Element to be injected into the form.
   */
  build() {
    // Create a div container for form area
    this.formAreaContainer = document.createElement('div')
    this.formAreaContainer.className = 'form-area-container'

    // Initialize FormBuilder instance within this container
    $(this.formAreaContainer).formBuilder({
      controlOrder: [],
      disableFields: [
        'autocomplete',
        'button',
        'checkbox-group',
        'date',
        'file',
        'header',
        'hidden',
        'number',
        'paragraph',
        'radio-group',
        'select',
        'text',
        'textarea',
      ],
      disabledAttrs: ['access'],
      allowEmptyFields: true,
      onAddField: fieldId => this.onAddField(fieldId),
    })

    this.formBuilderInstance = $(this.formAreaContainer).data('formBuilder')

    return this.formAreaContainer
  }

  /**
   * Callback for handling an added field inside the form area
   * @param {string} fieldId - ID of the field added
   */
  onAddField(fieldId) {
    const fieldData = this.getUserData()
    if (fieldData && typeof fieldData === 'object') {
      this.addControlToFormArea(fieldData)
    } else {
      console.warn('Field data is not correctly formatted.')
    }
  }

  /**
   * Retrieves user data from formBuilder instance inside form area
   * @return {Object|null} user data or null if not available
   */
  getUserData() {
    if (this.formBuilderInstance) {
      const formData = this.formBuilderInstance.actions.getData('userData')
      if (!formData) {
        console.warn('No user data found.')
        return null
      }
      return formData
    }
    console.error('FormBuilder instance not initialized.')
    return null
  }

  /**
   * Add control data to the form area controls list
   * @param {Object} controlData - data of control to add
   */
  addControlToFormArea(controlData) {
    this.formAreaControls.push(controlData)
    console.log('Control added to form area:', controlData)
  }

  /**
   * onRender callback
   */
  onRender() {
    console.log('Form area rendered and ready for drag and drop')
  }
}

// Register this control for the 'form-area' type
control.register('area', controlFormArea)
