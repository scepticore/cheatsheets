import {renderTemplate} from "../utils/templateEngine";

export function showDashboard() {
  const example = {
    "title": "Dashboard",
    "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto at cumque eius modi molestias officiis possimus quaerat quam quibusdam temporibus! Assumenda autem ipsa officia porro quibusdam repudiandae rerum sint velit!",
  };
  return renderTemplate("dashboard/index.html", {example});
}