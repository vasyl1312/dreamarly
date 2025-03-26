function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);

  if (tinymce.activeEditor) {
    tinymce.activeEditor.contentDocument.body.style.backgroundColor = isDarkMode
      ? "#1e1e1e"
      : "#ffffff";
    tinymce.activeEditor.contentDocument.body.style.color = isDarkMode ? "#ffffff" : "#000000";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  tinymce.init({
    selector: "textarea",
    menubar: false,
    statusbar: false,
    plugins: "fullscreen",
    editable_root: false,

    toolbar: "fullscreen | darkmode",
    skin: "oxide-dark",
    content_css: "dark",
    setup: function (editor) {
      editor.ui.registry.addButton("darkmode", {
        text: "🌙 Dark Mode",
        onAction: function () {
          toggleDarkMode();
        },
      });

      editor.on("init", function () {
        const isDarkMode = document.body.classList.contains("dark-mode");
        editor.contentDocument.body.style.backgroundColor = isDarkMode ? "#1e1e1e" : "#ffffff";
        editor.contentDocument.body.style.color = isDarkMode ? "#ffffff" : "#000000";
      });
    },
  });
});
