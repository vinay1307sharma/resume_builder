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
  reader.onloadend = () => {
    document.getElementById("preview-photo").src = reader.result;
  };
  if (file) reader.readAsDataURL(file);
}

function switchTheme() {
  const theme = document.getElementById("theme").value;
  const resume = document.getElementById("resume");
  resume.classList.remove("light", "dark");
  resume.classList.add(theme);
}

function switchTemplate() {
  const template = document.getElementById("template").value;
  const resume = document.getElementById("resume");
  resume.classList.remove("template1", "template2");
  resume.classList.add(template);
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

async function extractTextFromPDF(file) {
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(" ") + " ";
  }
  return fullText.toLowerCase();
}

async function checkATS() {
  const file = document.getElementById("resumeFile").files[0];
  const jobInput = document.getElementById("jobProfile").value.trim().toLowerCase();
  let content = "";

  if (file) {
    content = await extractTextFromPDF(file);
  } else {
    content = (
      document.getElementById("summary").value +
      " " +
      document.getElementById("education").value +
      " " +
      document.getElementById("skills").value +
      " " +
      document.getElementById("experience").value
    ).toLowerCase();
  }

  const jobProfiles = {
    "frontend developer": ["html", "css", "javascript", "react", "vue", "ui", "responsive", "bootstrap"],
    "backend developer": ["node", "express", "database", "sql", "api", "authentication", "mongodb", "server"],
    "data analyst": ["excel", "sql", "tableau", "power bi", "python", "data analysis", "visualization", "statistics"],
    "graphic designer": ["photoshop", "illustrator", "figma", "adobe", "branding", "typography", "layout"],
    "software engineer": ["git", "ci", "testing", "agile", "oop", "java", "python", "design patterns"]
  };

  let profileToUse = jobInput || "custom";
  let keywords = [];

  if (jobInput && jobProfiles[jobInput]) {
    keywords = jobProfiles[jobInput];
  } else if (jobInput && !jobProfiles[jobInput]) {
    keywords = jobInput.split(/\s+/).filter(word => word.length > 2);
  } else {
    let maxMatches = 0;
    for (let profile in jobProfiles) {
      const matches = jobProfiles[profile].filter(keyword => content.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        profileToUse = profile;
        keywords = jobProfiles[profile];
      }
    }
    if (!keywords.length) {
      document.getElementById("atsResults").innerHTML = `<p style="color:red;">⚠️ Could not detect a suitable job profile.</p>`;
      return;
    }
  }

  const found = [], missing = [];
  keywords.forEach(word => {
    if (content.includes(word)) found.push(word);
    else missing.push(word);
  });

  const score = Math.round((found.length / keywords.length) * 100);
  const result = `
    <p><strong>🧠 Profile Used:</strong> ${profileToUse}</p>
    <p><strong>✅ Matched Keywords:</strong> ${found.join(", ") || "None"}</p>
    <p><strong>❌ Missing Keywords:</strong> ${missing.join(", ") || "None"}</p>
    <p><strong>📊 ATS Score:</strong> ${score}%</p>
    <p><strong>📝 Result:</strong> ${score >= 70 ? "✅ Good Match" : "⚠️ Needs Improvement"}</p>
  `;
  document.getElementById("atsResults").innerHTML = result;
}
