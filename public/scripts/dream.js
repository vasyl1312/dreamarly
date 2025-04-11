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

    toolbar: "fullscreen | darkmode | saveaspdf", // Додаємо нову кнопку
    skin: "oxide-dark",
    content_css: "dark",
    setup: function (editor) {
      editor.ui.registry.addButton("darkmode", {
        text: "🌙 Dark Mode",
        onAction: function () {
          toggleDarkMode();
        },
      });

      editor.ui.registry.addButton("saveaspdf", {
        text: "📄 Save as PDF",
        onAction: function () {
          const content = editor.getContent();
          const isDarkMode = document.body.classList.contains("dark-mode");

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = content;
          tempDiv.style.padding = "20px";
          tempDiv.style.fontFamily = "Arial, sans-serif";
          tempDiv.style.backgroundColor = isDarkMode ? "#1e1e1e" : "#ffffff";
          tempDiv.style.color = isDarkMode ? "#ffffff" : "#000000";

          const dreamTitle = document.querySelector("h1")?.innerText || "dream";
          const dreamId = "<%= dream._id %>";
          const safeTitle = dreamTitle.replace(/[^a-z0-9а-яієїґ_-]/gi, "_");
          const fileName = safeTitle ? `${safeTitle}.pdf` : `${dreamId}.pdf`;

          html2pdf()
            .set({
              margin: 0,
              filename: fileName,
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: {
                scale: 2,
                logging: true,
                dpi: 192,
                letterRendering: true,
                backgroundColor: isDarkMode ? "#1e1e1e" : "#ffffff",
              },
              jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(tempDiv)
            .save();
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

function toggleReplyForm(commentId) {
  const form = document.getElementById(`reply-form-${commentId}`);
  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "block";
  } else {
    form.style.display = "none";
  }
}

function toggleReplyForm(commentId) {
  const form = document.getElementById(`reply-form-${commentId}`);
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function toggleReplies(commentId) {
  const replies = document.getElementById(`replies-${commentId}`);
  const btn = document.querySelector(`button[onclick="toggleReplies('${commentId}')"]`);
  
  if (replies.style.display === 'none') {
    replies.style.display = 'block';
    btn.textContent = 'Hide replies';
  } else {
    replies.style.display = 'none';
    btn.textContent = `Show ${replies.children.length} replies`;
  }
}