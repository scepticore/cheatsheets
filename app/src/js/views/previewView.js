export async function showPreview() {
  const previewTemplate = await fetch("/preview.html");
  const templateString = await previewTemplate.text();

  // @todo: replace with actual code, that the markdown gets rendered correctly
  // console.log(templateString);
  document.body.innerHTML = templateString;
}