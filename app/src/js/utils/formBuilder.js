/**
 * Form Generator Class
 */
export class formGenerator {
  constructor(formTitle, config, fields) {
    this.title = formTitle ? formTitle : null;
    this.fields = fields;
    this.onSubmit = config.onSubmit; // Callback function

    // Create form
    this.formElement = document.createElement("form");

    // Callback
    this.callBack = document.createElement("input");
    this.callBack.setAttribute("type", "hidden");
    this.callBack.id = "callback";
    this.callBack.name = "callback";
    this.callBack.value = config.callback;
    this.formElement.appendChild(this.callBack);

    // Create form header
    if(this.title) {
      this.formElement.append(this.formHeader());
    }

    // Add form fields
    for (const field in this.fields) {
      this.formElement.append(this.createFormGroup(field));
    }
    // Add form buttons (submit, cancel)
    this.formElement.append(this.formFooter());

    // Init eventListener
    this.formEventListener();

    // Return form
    return this.formElement;
  }

  formHeader() {
    const titleBox = document.createElement("div");
    titleBox.id = "form_title";

    const title = document.createElement("h1");
    title.textContent = this.title;
    titleBox.append(title);

    return titleBox;
  }

  /**
   * Creates formfooter with button bar
   * @returns {HTMLDivElement}
   */
  formFooter() {
    const buttonBar = document.createElement("div");
    buttonBar.classList.add("button_bar");

    const confirmButton = document.createElement("button");
    confirmButton.id = "confirm_button";
    confirmButton.textContent = "Save";

    const cancelButton = document.createElement("input");
    cancelButton.id = "cancel_button";
    cancelButton.type = "reset";
    cancelButton.classList.add("button");
    cancelButton.classList.add("secondary");
    cancelButton.value = "Reset";

    buttonBar.append(confirmButton);
    buttonBar.append(cancelButton);
    return buttonBar;
  }

  /**
   * Creates a formgroup
   * @param {string} field - The formfield
   * @returns {HTMLDivElement} - Returns HTMLDivElement
   */
  createFormGroup(field) {
    const fieldContainer = document.createElement("div");
    fieldContainer.classList.add("form_group");
    if (this.fields[field].type === "checkbox") {
      fieldContainer.classList.add("form_checkbox");
    }

    this.addLengthIndicator(field, fieldContainer);

    switch (this.fields[field].type) {
      case "select":
        fieldContainer.append(this.createLabel(field));
        fieldContainer.append(this.createSelect(field));
        break;
      case "textarea":
        fieldContainer.append(this.createLabel(field));
        fieldContainer.append(this.createTextArea(field));
        break;
      case "checkbox":
        fieldContainer.append(this.createCheckbox(field));
        fieldContainer.append(this.createLabel(field));
        break;
      default:
        fieldContainer.append(this.createLabel(field));
        fieldContainer.append(this.createInputField(field));
        break;
    }



    return fieldContainer;
  }

  /**
   * Adds length indicator on load
   * @param {string} field -
   * @param {object} fieldContainer -
   */
  addLengthIndicator(field, fieldContainer) {
    if (this.fields[field].attr?.maxLength) {
      this.lengthIndicator = document.createElement("span");
      this.lengthIndicator.id = `length_indicator_${field}`;
      this.lengthIndicator.classList.add("length_indicator");
      let contentLength = 0;
      if (this.fields[field].attr?.value) {
        contentLength = this.fields[field].attr.value.length;
      } else if (this.fields[field].content) {
        contentLength = this.fields[field].content?.length;
      }
      this.lengthIndicator.innerHTML = contentLength ? `${contentLength} / ${this.fields[field].attr.maxLength}` : `0 / ${this.fields[field].attr.maxLength}`;
      fieldContainer.append(this.lengthIndicator);
    }
  }

  /**
   * Creates labels
   * @param {string} field - The formfield
   * @returns {HTMLLabelElement} - Returns HTMLLabelElement
   */
  createLabel(field) {
    // Create label and add to fieldContainer
    const fieldLabel = document.createElement("label");
    fieldLabel.textContent = field;
    fieldLabel.setAttribute("for", field);
    return fieldLabel;
  }

  /**
   * Creates a basic input field
   * @param {string} field - The formfield
   * @returns {HTMLInputElement} - Returns HTMLInputElement
   */
  createInputField(field) {
    const fieldElement = document.createElement("input");
    fieldElement.id = field;
    fieldElement.name = field;
    fieldElement.type = this.fields[field].type;
    fieldElement.placeholder = field;
    this.addAttributes(fieldElement, field);
    if(this.fields[field].attr?.maxLength) {
      this.lengthCounter(fieldElement, this.lengthIndicator);
    }
    return fieldElement;
  }

  /**
   * Creates a checkbox and gets checked if given
   * @param field
   * @returns {HTMLInputElement}
   */
  createCheckbox(field) {
    let fieldElement = document.createElement("input");
    fieldElement.id = field;
    fieldElement.name = field;
    fieldElement.type = "checkbox";
    fieldElement.checked = this.fields[field].checked;
    return fieldElement;
  }

  /**
   * Creates Dropdowns and marks selected option if given
   * @param {string} field - The formfield
   * @returns {HTMLSelectElement} - Returns HTMLSelectElement
   */
  createSelect(field) {
    const fieldElement = document.createElement("select");
    fieldElement.id = field;
    fieldElement.name = field;
    for (const [key, value] of Object.entries(this.fields[field].options)) {
      const selectOption = document.createElement("option");
      selectOption.textContent = String(value);
      selectOption.value = key;
      if ( key === String(this.fields[field].selected) )
      {
        selectOption.selected = true;
      }
      fieldElement.append(selectOption);
      this.addAttributes(fieldElement, field);
    }
    return fieldElement;
  }

  /**
   * Creates Textareas and populates content if given
   * @param {string} field - Field to search for in config
   * @returns {HTMLTextAreaElement} - Returns HTMLTextAreaElement
   */
  createTextArea(field) {
    const fieldElement = document.createElement("textarea");
    fieldElement.id = field;
    fieldElement.name = field;
    fieldElement.placeholder = field;
    fieldElement.innerText = this.fields[field].content;
    this.addAttributes(fieldElement, field);
    if(this.fields[field].attr?.maxLength) {
      this.lengthCounter(fieldElement, this.lengthIndicator);
    }
    return fieldElement;
  }

  /**
   * Adds Attributes to given fieldElement according to configuration
   * @param {object} fieldElement - The input, select or textarea element
   * @param {object} field - The formfield to search for in the config
   */
  addAttributes(fieldElement, field) {
    const config = this.fields[field].attr;
    for (const attr in config) {
      fieldElement.setAttribute(attr, config[attr]);
    }
  }

  /**
   * Listens to submit and sends data over to the defined callback function
   * which then can handle form data.
   */
  formEventListener() {
    this.formElement.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(event.target));
      const callBackString = formData.callback;
      delete formData.callback;

      const sanitizedFormData = this.sanitizeFormData(formData);

      try {
        const functionCall = callBackString.replace("()", `(sanitizedFormData)`);
        eval(functionCall);
      } catch (e) {
        console.error(e);
      }
    });
  }

  /**
   * Sanitize form data
   * @param {object} formData - Date received from the form
   * @returns {object} sanitizedFormData - Sanitized form data
   */
  sanitizeFormData(formData) {
    const sanitizedFormData = {};

    for (const [key, value] of Object.entries(formData)) {
      sanitizedFormData[key] = encodeURI(value);
    }

    return sanitizedFormData;
  }

  // Just another IT guy
  // <script>alert("Hello!");</script>
  /**
   * Indicates length of user input, if maxLength is set
   * @param {object} fieldElement - Element that changes its value
   * @param {object} lengthIndicator - Span Element to display the current length and max length
   */
  lengthCounter(fieldElement, lengthIndicator) {
    fieldElement.addEventListener("input", (e) => {
      lengthIndicator.textContent = `${e.target.value.length} / ${fieldElement.getAttribute("maxlength")}`;
      if (Number(e.target.value.length) === Number(fieldElement.getAttribute("maxlength"))) {
        lengthIndicator.classList.add("max_reached");
      } else {
        if (lengthIndicator.classList.contains("max_reached")) {
          lengthIndicator.classList.remove("max_reached");
        }
      }
    });
  }


}

window.formGenerator = formGenerator;