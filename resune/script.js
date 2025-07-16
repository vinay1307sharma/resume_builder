function updateResume() {
  document.getElementById("preview-name").innerText = document.getElementById("name").value || "Your Name";
  document.getElementById("preview-email").innerText = document.getElementById("email").value || "you@example.com";
  document.getElementById("preview-summary").innerText = document.getElementById("summary").value || "";
  document.getElementById("preview-education").innerText = document.getElementById("education").value || "";
  document.getElementById("preview-skills").innerText = document.getElementById("skills").value || "";
  document.getElementById("preview-experience").innerText = document.getElementById("experience").value || "";
}

function previewPhoto() {
  const file = document.getElementById("photo").files[0];
  const reader = new FileReader();
  reader.onloadend = function () {
    document.getElementById("preview-photo").src = reader.result;
  };
  if (file) {
    reader.readAsDataURL(file);
  } else {
    document.getElementById("preview-photo").src = "";
  }
}

function switchTheme() {
  const theme = document.getElementById("theme").value;
  const resume = document.getElementById("resume");
  resume.classList.remove("light", "dark");
  resume.classList.add(theme);
}

function downloadPDF() {
  const resume = document.getElementById("resume").cloneNode(true);
  const styles = `
    <style>
      body { font-family: 'Inter', sans-serif; padding: 40px; }
      h2 { color: #333; }
      h3 { color: #007bff; margin-top: 20px; }
      img { max-width: 100px; border-radius: 50%; }
    </style>
  `;
  const win = window.open("", "", "width=800,height=600");
  win.document.write(`<html><head><title>Resume</title>${styles}</head><body>${resume.innerHTML}</body></html>`);
  win.document.close();
  win.print();
}

function checkATS() {
  const job = document.getElementById("jobTitle").value.toLowerCase();
  const content = (
    document.getElementById("summary").value +
    " " +
    document.getElementById("education").value +
    " " +
    document.getElementById("skills").value +
    " " +
    document.getElementById("experience").value
  ).toLowerCase();

  const keywordMap = {
    "frontend developer": ["html", "css", "javascript", "react", "responsive", "ui", "accessibility"],
    "backend developer": ["node", "express", "database", "api", "rest", "mongodb", "sql"],
    "data analyst": ["excel", "sql", "python", "tableau", "data", "visualization", "analysis"]
  };

  const keywords = keywordMap[job] || [];
  let found = [];
  let missing = [];

  keywords.forEach(word => {
    if (content.includes(word)) {
      found.push(word);
    } else {
      missing.push(word);
    }
  });

  const result = `
    <strong>ATS Result:</strong> ${found.length >= keywords.length * 0.7 ? "✅ Good Match" : "⚠️ Needs Improvement"}<br/>
    <strong>Matched:</strong> ${found.join(", ") || "None"}<br/>
    <strong>Missing:</strong> ${missing.join(", ") || "None"}<br/>
    <strong>Total Keywords:</strong> ${keywords.length}
  `;

  document.getElementById("atsResults").innerHTML = result;
}
