/**
 * Service to handle all API requests.
 * Uses fetch to communicate with the API.
 * @class requestService
 * @static fetchResponse - Fetch data from API and return processed response
 */
export class requestService {
  constructor(coreInstance) {
    this.core = coreInstance;

    this.fetchResponseBound = this.fetchResponse.bind(this);
    window.addEventListener("load", this.fetchResponseBound);
    window.addEventListener("popstate", this.fetchResponseBound);
  }

  /**
   * Connect and get data from REST API
   * @param {string} apiBaseURL - Base URL of the API endpoint
   * @param {string} type - Type of data to fetch
   * @param {string} method - HTTP method (e.g., "GET", "POST")
   * @param {object} headers -  HTTP headers
   * @param {object} body - HTTP body
   * @returns {Promise<object>} - Processed response object or array of objects
   */
  static async fetchResponse(apiBaseURL, type, method, headers, body) {
    let token = "";
    if (window.sessionStorage.getItem("token")) {
      token = window.sessionStorage.getItem("token");
    } else if (window.localStorage.getItem("token")) {
      token = window.localStorage.getItem("token");
    }
    try {
      let config = {};
      console.log(body);

      if (method === "POST" || method === "PUT") {
        config = {
          method: method || 'POST',
          headers: headers || {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
          },
          body: body ? JSON.stringify(body) : null,
          signal: AbortSignal.timeout(5000)
        };
      } else {
        config = {
          method: method || 'GET',
          headers: headers || {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`,
          },
          // body: body ? JSON.stringify(body) : null,
          signal: AbortSignal.timeout(5000)
        };
      }

      console.log(config);

      const response = await fetch(apiBaseURL, config);
      const handled = await this.handleResponse(response, type);

      if (handled.status === 200 || handled.status === 201) {
        const object = await this.returnResponse(handled, type);
        return {
          status: handled.status,
          data: object,
          notification: this.buildSuccessNotification(type, method, handled.data)
        };
      }
      return handled;
    } catch (error) {
      console.log(error);
      return {
        status: 503,
        notification: {
          type: "error",
          title: `Service unavailable`,
          body: "Please connect to VPN"
        }
      }
    }
  };

  // Handle server response by
  static async handleResponse(response, type) {
    // Read body ONCE
    let rawBody;
    const contentType = response.headers.get("content-type") || "";

    try {
      if (contentType.includes("application/json")) {
        rawBody = await response.json();
      } else {
        // fallback: read text
        rawBody = await response.text();
      }
    } catch (e) {
      // fallback: empty body or parse failure
      rawBody = null;
    }

    // Switch based on status
    if (response.status === 200) {
      return {
        status: 200,
        notification: {
          type: "success",
          title: `Success`,
          body: response.body
        },
        data: rawBody
      };
    }
    if (response.status === 201) {
      return {
        status: 200,
        notification: {
          type: "success",
          title: `Successfull`,
          body: response.body
        },
        data: rawBody
      };
    }
    if (response.status === 401) {
      return {
        status: 401,
        notification: {
          type: "error",
          title: "Unauthorized",
          body: "Wrong credentials."
        }
      };
    }
    if (response.status === 403) {
      return {
        status: 403,
        notification: {
          type: "error",
          title: "Forbidden",
          body: "Wrong credentials or prohibited access."
        }
      };
    }
    if (response.status === 404) {
      return {
        status: 404,
        notification: {
          type: "error",
          title: "Not found",
          body: `${type} not found`
        }
      };
    }
    if (response.status === 500) {
      return {
        status: 500,
        notification: {
          type: "error",
          title: "Internal Server Error",
          body: response.statusText
        }
      };
    }

    return {
      status: 500,
      notification: {
        type: "error",
        title: "Unexpected Error",
        body: response.statusText
      }
    };
  }

  /**
   * Return Response in form of single objects or an array of objects
   * @param {object} response - response object from handleResponse
   * @param {string} type - type of data to process
   * @returns
   */
  static async returnResponse(response, type) {
    if (response.status !== 200) {
      return response;
    }

    const data = response.data;

    // Array of objects
    if (Array.isArray(data)) {
      return Promise.all(data.map(item => this.objectFactory(type, item)));
    }

    // Single objects
    return this.objectFactory(type, data);
  }

  /**
   * Create objects according to type and data given
   * @param {string} type - type of object to create
   * @param {object} data -  data to populate the object
   * @returns
   */
  static async objectFactory(type, data) {
    const classMap = {};

    const objectClass = classMap[type];
    return objectClass ? new objectClass(...Object.values(data)) : data;
  }

  /**
   * Returns Notifications
   * @param {string} type - Type of Object (Patients, Incidents, Treatments, Responsibles)
   * @param {string} method - POST, PUT, DELETE
   * @param {object} data - Data object
   * @returns {{type: string, title: string, message: string}}
   */
  static async buildSuccessNotification(type, method, data) {
    let obj = {};
    let name = "";
    if (typeof data === "string") {
      const match = data.match(/\{.*\}$/);
      if (match) {
        obj = JSON.parse(match[0]);
      }

      name = obj.firstname && obj.name
        ? `${obj.firstname} ${obj.name}`
        : "";
    }

    const actionMap = {
      POST: "created",
      PUT: "updated",
      DELETE: "deleted"
    };

    const action = actionMap[method] || "processed";

    let message = `${type.charAt(0).toUpperCase().slice(1)} ${name} was ${action} successfully.`;
    if (!name) {
      message = `${type.charAt(0).toUpperCase() + type.slice(1)}  ${action} successfully.`;
    }
    return {
      type: "success",
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${action}`,
      message: message
    };
  }
}
