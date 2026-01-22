import {renderTemplate} from "../utils/templateEngine";

export async function showDashboard() {
  const example = {
    "title": "Dashboard",
    "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto at cumque eius modi molestias officiis possimus quaerat quam quibusdam temporibus! Assumenda autem ipsa officia porro quibusdam repudiandae rerum sint velit!",
  };
  await renderTemplate("dashboard/index.html", {example});

  const editor = ace.edit("editor");
  editor.setTheme("ace/theme/github_dark");
  editor.session.setMode("ace/mode/markdown");
}