import {HOST} from '../constants.js'
import {removeSFromString, firstLetterUppercase} from "../utils/utils.js";
const MAINFRAME = document.getElementById("mainframe");

/**
 * Rendering HTML templates
 * @param {string} templateName - Template Path, e.g. utils/login.html
 * @param {object} context - Objects to be rendered
 * @param {boolean} style - True: Load stylesheet, False: Ignore
 * @returns {Promise<void>}
 */
export async function renderTemplate(templateName, context = null, style = false) {
  if (style) {
    await addTemplateCSS(templateName);
  }
  const templatePath = `${HOST}/src/templates/${templateName}`;
  try {
    let response = await fetch(templatePath);
    let template;

    if (response.status === 404) {
      response = await fetch(`${HOST}/src/templates/utils/error.html`);
      template = await response.text();

      const error = {
        statusCode: "404",
        statusTitle: "Template file not found",
        statusBody: `The requested template <b>${templateName}</b> does not exist. Make sure, the file exists in directory <b>/templates/${templateName.split("/")[0]}/</b>`
      };
      context = {error};
    } else if (response.ok) {
      template = await response.text();
    } else {
      throw new Error(`Error: ${response.status}`);
    }

    template = replaceIfStatements(template, context);
    template = replaceForLoops(template, context); // Behandelt Loop-Variablen und indexierte {{ table ... }}
    template = replaceNestedObjects(template, context);
    template = replaceElementAttributes(template, context);
    template = replaceSingleValues(template, context);
    template = createFormPlaceholder(template);
    template = createGlobalTablePlaceholder(template);

    MAINFRAME.innerHTML = template;
    replaceTables(context);
    replaceForms(context);

    window.dispatchEvent(new CustomEvent("renderComplete", {
      detail: { template: templateName }
    }));
  } catch (e) {
    console.error(e);
    MAINFRAME.innerHTML = e;
  }
}

/**
 * Replace all if statements witin a template
 * @param {string} templateContent - The template string to search for matches
 * @param {object} context - The context to be rendered within a template
 */
function replaceIfStatements(templateContent, context) {
  return templateContent.replace(
    /{{ if ([\w\.]+) }}([\s\S]*?){{ endif }}/g,
    (match, condition, content) => {
      const value = resolvePath(context, condition);
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return `No ${condition} found`;
      } else {
        return content;
      }
    }
  );
}

/**
 * Replace {{ for element in elements }} {{ element.attribute }} {{ endfor }}
 * Supports nested loops and resolves {{ table ... }} tags within the loop.
 * @param {string} templateContent - The template string to search for matches
 * @param {object} context - The context to be rendered within a template
 * @returns {string} result
 */
function replaceForLoops(templateContent, context) {
  return templateContent.replace(
    /{{ for (\w+) in ([\w\.]+) }}([\s\S]*?){{ endfor }}/g,
    (match, itemVar, listPath, loopContent) => {
      const list = resolvePath(context, listPath);
      if (!Array.isArray(list)) return `No ${firstLetterUppercase(listPath)} found.`;

      let result = "";
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const tempContext = {...context};
        tempContext[itemVar] = item;

        let content = loopContent;

        content = replaceForLoops(content, tempContext);

        content = content.replace(
          /{{\s*table\s+([^ ]+)(?:\s+(\w+))?(?:\s+fields\(([^)]*)\))?\s*}}/g,
          (tableMatch, arrayPath, actions, fieldList) => {
            let finalPath = arrayPath;

            if (arrayPath.startsWith(itemVar + '.')) {
              const propertyPath = arrayPath.substring(itemVar.length + 1).replace(/^{{\s*/, '').replace(/\s*}}$/, '');
              finalPath = `${listPath}[${i}].${propertyPath}`;
            } else {
              finalPath = arrayPath.replace(/^{{\s*/, '').replace(/\s*}}$/, '');
            }

            return `
                  <div class="dynamic-table"
                       data-array="${finalPath}"
                       data-actions="${actions || ''}"
                       data-fields="${fieldList || ''}">
                  </div>
                `;
          }
        );

        content = replaceNestedObjects(content, tempContext);
        content = replaceElementAttributes(content, tempContext);
        content = replaceSingleValues(content, tempContext);

        result += content;
      }

      return result;
    }
  );
}


/**
 * Replace nested objects within a loop, e.g.
 * {{ for element in elements }}
 * {{ element.attribute }}
 * {{ endfor}}
 * @param {string} templateContent - The template string to search for matches
 * @param {object} context - The context to be rendered within a template
 * @returns {*}
 */
function replaceNestedObjects(templateContent, context) {
  return templateContent.replace(/{{ ([\w\.]+) }}/g, (match, path) => {
    const value = resolvePath(context, path);
    return value !== undefined ? String(value) : "";
  });
}

/**
 * Replace {{ element.attribute }} in template string
 * @param {string} templateContent - The template string to search for matches
 * @param {object} context - The context to be rendered within a template
 * @returns {*}
 */
function replaceElementAttributes(templateContent, context) {
  return templateContent.replace(/{{ (\w+)\.(\w+) }}/g, (match, obj, prop) => {
    const value = resolvePath(context, `${obj}.${prop}`);
    return value !== undefined ? String(value) : "";
  });
}

/**
 * Replace single values like {{ value }}
 * @param {string} templateContent - The template string to search for matches
 * @param {object} context - The context to be rendered within a template
 * @returns {*}
 */
function replaceSingleValues(templateContent, context) {
  return templateContent.replace(/{{ (\w+) }}/g, (match, key) => {
    const value = resolvePath(context, key);
    return value !== undefined ? String(value) : "";
  });
}

/**
 * Erstellt Platzhalter für einfache, globale {{ table ... }} Aufrufe.
 * Usage: {{ table tableName actions fields(field1, field2) }}
 * @param {string} templateContent - The template string to search for matches
 * @returns {string}
 */
function createGlobalTablePlaceholder(templateContent) {
  return templateContent.replace(
    /{{\s*table\s+([^ ]+)(?:\s+(\w+))?(?:\s+fields\(([^)]*)\))?\s*}}/g,
    (match, arrayPath, actions, fieldList) => {
      return `
        <div class="dynamic-table"
             data-array="${arrayPath}"
             data-actions="${actions || ''}"
             data-fields="${fieldList || ''}">
        </div>
      `;
    }
  );
}

function createFormPlaceholder(templateContent) {
  return templateContent.replace(
    /{{\s*form\s+([\w\.]+)\s*}}/g,
    (match, formName) => {
      return `
        <div class="form_container" data-form="${formName}">
        </div>
      `;
    }
  );
}

/**
 * Replaces {{ table arrayname actions excludes(key, key) }} with a table.
 * @param {object} context - The context to be rendered within a template
 * @returns {*}
 */
function replaceTables(context) {
  const tables = MAINFRAME.querySelectorAll(".dynamic-table");

  for (const placeholder of tables) {
    let arrayPath = placeholder.dataset.array;
    const type = arrayPath.split(".")[1] ? arrayPath.split(".")[1] : arrayPath;
    const actions = placeholder.dataset.actions === "actions";
    const fieldsRaw = placeholder.dataset.fields;

    const data = resolvePath(context, arrayPath);
    if (!Array.isArray(data) || data.length === 0) {
      placeholder.textContent = `No ${firstLetterUppercase(type)} found.`;
      continue;
    }

    const fields = fieldsRaw ? fieldsRaw.split(",").map(x => x.trim()) : Object.keys(data[0]);

    const tableElement = document.createElement("table");
    const tableHeader = document.createElement("thead");
    const tableHeaderRow = document.createElement("tr");

    for (const field of fields) {
      const tableHeaderRowCell = document.createElement("th");
      tableHeaderRowCell.textContent = firstLetterUppercase(field).replace("_", " ");
      tableHeaderRow.appendChild(tableHeaderRowCell);
    }

    if (actions) {
      const tableColumnActions = document.createElement("th");
      tableColumnActions.textContent = "Actions";
      tableHeaderRow.appendChild(tableColumnActions);
    }

    tableHeader.appendChild(tableHeaderRow);
    tableElement.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");

    for (const row of data) {
      const tableRow = document.createElement("tr");

      for (const field of fields) {
        const tableRowCell = document.createElement("td");
        tableRowCell.textContent = row[field] ?? "";
        tableRow.appendChild(tableRowCell);
      }

      if(arrayPath.includes(".")) {
        arrayPath = arrayPath.split(".")[1];
      }

      if (actions) {
        const tableActionColumn = document.createElement("td");

        const tableActionViewButton = document.createElement("a");
        tableActionViewButton.setAttribute("href", `${type}/${row.id}`);
        tableActionViewButton.textContent = "View";
        tableActionViewButton.classList.add("button");
        tableActionColumn.appendChild(tableActionViewButton);

        const tableActionEditButton = document.createElement("a");
        tableActionEditButton.setAttribute("href", `${type}/${row.id}/edit`);
        tableActionEditButton.textContent = "Edit";
        tableActionEditButton.classList.add("button");
        tableActionColumn.appendChild(tableActionEditButton);

        const tableActionDeleteButton = document.createElement("a");
        tableActionDeleteButton.textContent = "Delete";
        tableActionDeleteButton.setAttribute("data-type", arrayPath);
        tableActionDeleteButton.setAttribute("data-id", row.id);
        tableActionDeleteButton.classList.add("button", "secondary", "delete");

        if ("name" in row || "firstname" in row) {
          tableActionDeleteButton.setAttribute("data-name", row.fullname);
        }

        tableActionColumn.appendChild(tableActionDeleteButton);
        tableRow.appendChild(tableActionColumn);
      }

      tableBody.appendChild(tableRow);
    }

    tableElement.appendChild(tableBody);
    placeholder.appendChild(tableElement);
  }
}

/**
 * Replace Forms
 * @param {object} context -
 */
function replaceForms(context) {
  const forms = MAINFRAME.querySelectorAll(".form_container");
  for (const form of forms) {
    const formContent = form.dataset.form;
    form.appendChild(resolvePath(context, formContent));
  }
}

/**
 * Escapes HTML special characters in a string.
 * @param {string} str
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Resolves a nested path in an object, e.g. "incident.treatments"
 * @param {object} obj
 * @param {string} path
 * @returns {*}
 */
function resolvePath(obj, path) {
  const parts = path.split(/[\.\[\]]/).filter(p => p.length > 0);
  let value = obj;
  for (const part of parts) {
    if (value === undefined || value === null) return undefined;
    value = value[part];
  }
  return value;
}

/**
 * Adds CSS for template if a CSS file exists in ../src/css/ with the name of the directory
 * @param {string} templatePath - Path to template
 * @returns {Promise<null>}
 */
async function addTemplateCSS(templatePath) {
  const parts = templatePath.split("/");
  const folderName = parts[0];
  const cssPath = `${HOST}/src/css/${folderName}.css`;

  try {
    const result = await fetch(cssPath);
    if (!result.ok) {
      console.warn(`CSS file ${cssPath} does not exist. It is not necessary, that this file exist though.`);
      return null;
    } else {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = cssPath;
      document.head.appendChild(link);
    }
  } catch (e) {
    console.warn(`CSS file ${cssPath} does not exist. It is not necessary, that this file exist though.`);
    return null;
  }
}