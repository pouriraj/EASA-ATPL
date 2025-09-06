[README.md](https://github.com/user-attachments/files/22185130/README.md)

# ATPL Questions Extraction GUI

A comprehensive Next.js application for extracting practice questions from ATPL Questions website with a user-friendly graphical interface.

## Features

- **Web-based GUI** - Easy-to-use interface for managing extractions
- **Database Selection** - Choose between EASA 2020 and EASA 2020 All Questions databases
- **Subject Selection** - Extract questions from specific subjects or all subjects
- **Progress Tracking** - Real-time progress monitoring during extraction
- **Error Reporting** - Comprehensive error tracking and failed question reports
- **Media Extraction** - Download associated photos and content
- **Multiple Output Formats** - Excel files organized by subject or as master spreadsheet
- **Built-in Setup Guide** - Step-by-step instructions within the app

## Prerequisites

Before running this application, ensure you have:

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)

2. **Yarn Package Manager**
   - Install globally: `npm install -g yarn`

3. **Git** (for version control)
   - Download from [git-scm.com](https://git-scm.com/)

4. **PostgreSQL Database** (for production)
   - Download from [postgresql.org](https://www.postgresql.org/)
   - Or use a cloud service like Supabase or Railway

## Installation & Setup

### Step 1: Download the Project

**Option A: If you have Git**
```bash
git clone <repository-url>
cd atpl_gui
```

**Option B: Download ZIP**
1. Download the project as ZIP file
2. Extract to your desired location
3. Navigate to the extracted folder

### Step 2: Navigate to App Directory
```bash
cd app
```

### Step 3: Install Dependencies
```bash
yarn install
```

### Step 4: Environment Configuration

1. Create a `.env` file in the `app` directory:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your database connection:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/atpl_gui"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### Step 5: Database Setup

1. **Create the database:**
```bash
createdb atpl_gui
```

2. **Run database migrations:**
```bash
yarn prisma migrate dev
```

3. **Generate Prisma client:**
```bash
yarn prisma generate
```

### Step 6: Start the Application
```bash
yarn dev
```

The application will be available at: **http://localhost:3000**

## Usage Guide

### 1. First Time Setup
- Open the application in your browser
- Navigate to the "Setup Guide" tab for detailed instructions
- Configure your ATPL Questions website credentials

### 2. Starting an Extraction
1. Go to the "Settings" tab
2. Configure your extraction preferences:
   - Database selection (EASA 2020 or EASA 2020 All Questions)
   - Subject selection
   - Output format options
3. Return to "Dashboard" tab
4. Click "Start New Extraction"
5. Monitor progress in real-time

### 3. Viewing Results
- Completed extractions appear in the dashboard
- Download generated Excel files
- View extraction logs and error reports
- Access failed question reports for manual recovery

## Project Structure

```
app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Main dashboard page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── extraction/       # Extraction-specific components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   yarn dev --port 3001
   ```

2. **Database connection errors**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Ensure database exists

3. **Dependencies issues**
   ```bash
   rm -rf node_modules yarn.lock
   yarn install
   ```

4. **Prisma client issues**
   ```bash
   yarn prisma generate
   yarn prisma migrate dev
   ```

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Review the extraction logs in the application
3. Verify your ATPL Questions website credentials
4. Ensure stable internet connection

## Development Commands

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run linting
- `yarn prisma studio` - Open Prisma database studio

## Security Notes

- Never commit `.env` files to version control
- Keep your database credentials secure
- Use strong NEXTAUTH_SECRET for production
- Regularly backup your extraction data

---

**Note:** This application is designed for personal use and educational purposes. Ensure compliance with the ATPL Questions website's terms of service.
