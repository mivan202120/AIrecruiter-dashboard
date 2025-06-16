# AI Recruiter Analytics Dashboard

A sophisticated web application that transforms CSV conversation data from AI recruiting systems into actionable insights through advanced analytics and AI-powered analysis using OpenAI API.

## 🚀 Features

### ✅ Completed Features

#### Phase 1: Project Infrastructure
- React 19 with TypeScript and Vite
- Tailwind CSS v4 with custom theme
- ESLint and Prettier configuration
- Dark/Light mode support
- Professional report header with key metrics

#### Phase 2: Core Data Processing
- Drag-and-drop CSV file upload
- Real-time file validation
- CSV parsing with advanced error handling
- Support for multiple date formats (with/without spaces)
- Progress indication during processing
- Data normalization and structuring

#### Phase 3: AI Integration
- **OpenAI API Integration** (replaced Google Gemini)
  - Real-time API key validation
  - Rate limiting and retry logic
  - Comprehensive error handling
- **Advanced Analysis Features**:
  - Candidate status classification (PASS/FAIL/NO_RESP)
  - Multi-dimensional scoring
  - Sentiment analysis (Positive/Negative/Neutral)
  - AI-generated insights and recommendations

#### Phase 4: Dashboard & Visualizations
- **Interactive Visualizations**:
  - Professional pie chart for results distribution
  - Daily conversation activity chart and table
  - Sentiment analysis breakdown by hiring decision
  - **NEW: Conversation Funnel Analysis** 🎯
- **Conversation Funnel Features**:
  - Visual funnel showing candidate progression
  - Dynamic stage detection (AI Engagement → Interview → HR Scheduling → Decision)
  - Interview questions tracked as sub-stages (2.1, 2.2, 2.3, etc.)
  - Conversion rates and drop-off analysis
  - Time-to-decision metrics (measures from start to AI decision)
- **Enhanced Metrics**:
  - Success rate and response rate calculations
  - Processing time and token usage tracking
  - Detailed candidate breakdown with expandable cards

#### Phase 5: Improvements & Bug Fixes
- Fixed date parsing for formats like "11:45am" (no space)
- Robust date handling preventing "Invalid Date" errors
- Removed AI Evaluation Criteria and Process Flow sections
- Professional report styling

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Data Processing**: PapaParse
- **AI Integration**: OpenAI API (GPT-4)
- **Charts**: Recharts
- **State Management**: React Context API

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/mivan202120/AIrecruiter-dashboard.git
cd ai-recruiter-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to `.env`:
```
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

Other available commands:
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## 📊 CSV Format

The application supports two CSV formats:

### Standard Format
| Column | Required | Description |
|--------|----------|-------------|
| MessageID | Yes | Unique identifier for each message |
| CandidateID | Yes | Identifier to group messages by candidate |
| Entity | Yes | "AI", "user", or variations |
| Message | Yes | The message content |
| Date | Yes | Format: "d/m/yyyy h:mm am/pm" or "d/m/yyyy h:mmam/pm" |
| FullName | No | Candidate's full name |

### Summary Format
| Column | Required | Description |
|--------|----------|-------------|
| candidateId | Yes | Unique candidate identifier |
| candidateName | Yes | Candidate's full name |
| messageCount | Yes | Total messages in conversation |
| startTime | Yes | ISO date string |
| duration | Yes | Duration in milliseconds |
| messages | Yes | Pipe-separated messages |
| decision | Yes | PASS/FAIL/NO_RESP |
| tags | Yes | Comma-separated tags |

## 🎯 Conversation Funnel Analysis

The dashboard now includes a sophisticated conversation funnel that tracks candidate progression through:

1. **Stage 1: AI Engagement** - Initial greeting and introduction
2. **Stage 2: Interview Questions** - Main interview with sub-stages:
   - 2.1: First question answered
   - 2.2: Second question answered
   - (Dynamically numbered based on actual questions)
3. **Stage 3: HR Interview Scheduling** - Date/time confirmation
4. **Stage 4: Decision** - AI makes hiring decision

### Key Metrics:
- **Time to Decision**: Measures from conversation start to AI decision (not last message)
- **Conversion Rates**: Shows percentage progressing through each stage
- **Drop-off Points**: Identifies where candidates exit the process
- **Average Time per Stage**: Helps optimize interview flow

## 🔐 Security

- API keys are validated in real-time
- Keys are never exposed in the frontend
- All API calls include error handling
- Rate limiting prevents API abuse

## 📈 Performance

- Efficient data processing with progress indicators
- Caching for API validation results
- Optimized re-renders with React.memo and useMemo
- Lazy loading for large datasets

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React, TypeScript, and AI

## 📝 Recent Updates

### Version 2.0.0 (Latest)
- Added Conversation Funnel Analysis with visual tracking
- Fixed duration calculation to measure time to decision
- Implemented dynamic interview question numbering (2.1, 2.2, etc.)
- Added sentiment analysis integration
- Improved date parsing for various formats
- Enhanced dashboard with professional visualizations
- Added comprehensive API key validation

### Version 1.0.0
- Initial release with basic CSV processing
- Google Gemini integration (now replaced with OpenAI)
- Basic dashboard and metrics