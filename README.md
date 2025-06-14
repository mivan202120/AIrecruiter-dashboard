# AI Recruiter Analytics Dashboard

A sophisticated web application that transforms CSV conversation data from AI recruiting systems into actionable insights through advanced analytics and AI-powered analysis using Google Gemini API.

## 🚀 Features

### ✅ Completed
- **Phase 1: Project Infrastructure**
  - React with TypeScript and Vite
  - Tailwind CSS with custom theme
  - ESLint and Prettier configuration
  - Dark/Light mode support

- **Phase 2: Core Data Processing**
  - Drag-and-drop CSV file upload
  - Real-time file validation
  - CSV parsing with error handling
  - Progress indication during processing
  - Data normalization and structuring

### 🔄 In Progress
- **Phase 3: AI Integration**
  - Google Gemini API integration
  - Candidate status classification
  - Multi-dimensional scoring
  - Sentiment analysis

### 📋 Upcoming
- **Phase 4: Dashboard Development**
  - Interactive data visualizations
  - Candidate analysis cards
  - Strategic recommendations
  
- **Phase 5: Polish & Launch**
  - PDF export functionality
  - Performance optimizations
  - Comprehensive testing

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Data Processing**: PapaParse
- **AI Integration**: Google Gemini API
- **Charts**: Recharts (planned)
- **PDF Export**: jsPDF (planned)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/mivan202120/AIrecruiter-dashboard.git
cd AIrecruiter-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Google Gemini API key to `.env`:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

Other available commands:
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## 📊 CSV Format

The application expects CSV files with the following columns:

| Column | Required | Description |
|--------|----------|-------------|
| MessageID | Yes | Unique identifier for each message |
| CandidateID | Yes | Identifier to group messages by candidate |
| Entity | Yes | "AI" or "user" |
| Message | Yes | The message content |
| Date | Yes | Format: "d/m/yyyy h:mm am/pm" |
| FullName | No | Candidate's full name |

See `sample-data.csv` for an example.

## 🤝 Contributing

This project is currently in active development. Contributions are welcome!

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React, TypeScript, and AI