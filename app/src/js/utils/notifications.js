/**
 * Show notification box, which disappears after animation
 * @param {string} type - Type of message (error, success)
 * @param {string} title - Notification title
 * @param {string} message - Content of message
 * @param {string} redirect - Optional: Add link, if user should be redirected after the notification (e.g. Login)
 */
function showNotificationBox({type, title, message}, redirect = "") {
  // Add styling to browser
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "src/css/notification.css";
  document.head.appendChild(link);

  // Create div
  const notificationBox = document.createElement("div");
  notificationBox.id = "notification_container";
  document.body.appendChild(notificationBox);

  // Add notification type as class (error, success)
  notificationBox.classList.add(type);

  // Content display depends on notification type, error shows more detail
  const notificationBoxTitle = document.createElement("h3");
  notificationBoxTitle.textContent = title;
  notificationBox.appendChild(notificationBoxTitle);

  const notificationBoxBody = document.createElement("p");
  notificationBoxBody.textContent = message;
  notificationBox.appendChild(notificationBoxBody);

  // Wait for animation to end
  notificationBox.addEventListener("animationend", () => {
    // redirect user if redirect link is given
    if (redirect) {
      window.location.href = redirect;
    } else {
      // remove container
      if (document.body.contains(notificationBox)) {
        document.body.removeChild(notificationBox);
      }
      // remove styling
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    }
  });

  // Allow user to click to dismiss notification
  notificationBox.addEventListener("click", () => {
    notificationBox.classList.add("hidden");
  })
}

/**
 * Show confirmation dialog, if OK, calls callback function
 * @param {string} title - Title shown in the modal
 * @param {string} message - Message shown in the modal
 * @param {Function} callback - Function that will be called, if user confirms with OK
 */
function showConfirmationBox(title, message, callback) {
  // Add styling to browser
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "src/css/notification.css";
  document.head.appendChild(link);

  // Create div
  const confirmationBox = document.createElement("div");
  confirmationBox.id = "confirmation_container";
  document.body.appendChild(confirmationBox);
  confirmationBox.innerHTML += `<h3>${title}</h3><p>${message}</p>`;

  // Add notification type as class (error, success)
  const buttonBar = document.createElement("div");
  buttonBar.classList.add("button_bar");

  confirmationBox.append(buttonBar);

  const confirmButton = document.createElement("button");
  confirmButton.id = "confirm_button";
  confirmButton.textContent = "OK";

  const cancelButton = document.createElement("button");
  cancelButton.id = "cancel_button";
  cancelButton.classList.add("secondary");
  cancelButton.textContent = "Cancel";

  buttonBar.appendChild(confirmButton);
  buttonBar.appendChild(cancelButton);

  // Remove box and call callback on confirm
  confirmButton.addEventListener("click", () => {
    callback();
    document.body.removeChild(confirmationBox);
    document.head.removeChild(link);
  });

  // Just remove box on cancel
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(confirmationBox);
    document.head.removeChild(link);
  });

}

// Make available for other modules or use in HTML
export { showNotificationBox, showConfirmationBox };

// Make available for use in HTML
window.showConfirmationBox = showConfirmationBox;