// const XLSX = require('xlsx');
// const path = require('path');
// const fs = require('fs');

// const data = [
//   { Category: "About", Question: "What is Kenmark ITan Solutions?", Answer: "Kenmark ITan Solutions is a technology company focused on digital transformation and AI." },
//   { Category: "Services", Question: "What services do you offer?", Answer: "We offer Full Stack Development, AI Chatbots, Consulting, and Cloud Solutions." },
//   { Category: "Contact", Question: "How do I contact you?", Answer: "You can email us at contact@kenmarkitan.com." }
// ];

// const ws = XLSX.utils.json_to_sheet(data);
// const wb = XLSX.utils.book_new();
// XLSX.utils.book_append_sheet(wb, ws, "KnowledgeBase");

// const dir = path.join(__dirname, '..', 'knowledge');
// if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }

// XLSX.writeFile(wb, path.join(dir, 'data.xlsx'));
// console.log("✅ Sample Excel file created.");

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// REAL DATA extracted from https://kenmarkitan.com
const data = [
  // --- ABOUT SECTION ---
  { 
    Category: "About", 
    Question: "What is Kenmark ITan Solutions?", 
    Answer: "Kenmark ITan Solutions is a comprehensive IT services provider based in Mumbai. We serve as a 'one-stop shop' for IT needs, ranging from web and mobile app development to cloud hosting, branding, and digital marketing." 
  },
  { 
    Category: "About", 
    Question: "Why should I choose Kenmark ITan Solutions?", 
    Answer: "We offer exceptional 24/7 customer support, a seasoned team of professionals, fast turnaround times, and tailor-made solutions designed specifically for your business challenges." 
  },
  { 
    Category: "About", 
    Question: "What industries do you serve?", 
    Answer: "We serve a wide range of industries including IT, Real Estate, Health & Fitness, Food & Beverages, Arts, Security, Public Sector, and Marine." 
  },

  // --- SERVICES SECTION ---
  { 
    Category: "Services", 
    Question: "What development services do you offer?", 
    Answer: "We specialize in Web Development, Mobile App Development (Flutter/Native), eCommerce Solutions, Blockchain Solutions, ERP Systems, and Custom Software Development." 
  },
  { 
    Category: "Services", 
    Question: "Do you offer Web Hosting?", 
    Answer: "Yes, we provide Shared Hosting, VPS, Dedicated Servers, Private Cloud Storage, and Google Workspace email solutions." 
  },
  { 
    Category: "Services", 
    Question: "Do you provide Digital Marketing services?", 
    Answer: "Yes, our marketing services include SEO (Search Engine Optimization), SMM (Social Media Marketing), and integrated offline marketing strategies." 
  },
  { 
    Category: "Services", 
    Question: "What technologies do you use?", 
    Answer: "Our toolkit includes Next.js, React.js, Angular, Flutter, Node.js, ExpressJS, MongoDB, MySQL, and Tailwind CSS." 
  },

  // --- CONTACT SECTION ---
  { 
    Category: "Contact", 
    Question: "How can I contact Kenmark ITan Solutions?", 
    Answer: "You can call us at +91-9820283097 or email us at tan@kenmark.in." 
  },
  { 
    Category: "Contact", 
    Question: "Where is your office located?", 
    Answer: "Our office is at 601-604, Chaitanya CHS LTD, Near Ram Mandir Signal, Goregaon West, Mumbai - 400104." 
  },
  { 
    Category: "Contact", 
    Question: "What are your support hours?", 
    Answer: "We provide 24/7 dedicated support to ensure your business runs smoothly at all times." 
  }
];

// Create Sheet
const ws = XLSX.utils.json_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "KnowledgeBase");

// Save File
const dir = path.join(__dirname, '..', 'knowledge');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

XLSX.writeFile(wb, path.join(dir, 'data.xlsx'));
console.log("✅ Real Company Data has been written to /knowledge/data.xlsx");