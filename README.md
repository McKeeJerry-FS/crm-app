# Customer Relationship Management (CRM) Application

This is a basic Customer Relationship Management (CRM) application built with Next.js. The application allows users to manage customers, contacts, and deals effectively.

## Features

- **Customer Management**: View, add, edit, and delete customers.
- **Contact Management**: View, add, edit, and delete contacts associated with customers.
- **Deal Management**: View, add, edit, and delete deals related to customers.

## Project Structure

```
crm-app
├── app
│   ├── layout.tsx          # Layout for the application
│   ├── page.tsx            # Main entry point
│   ├── customers            # Customer-related pages
│   │   ├── page.tsx        # List of customers
│   │   └── [id]            # Customer details
│   ├── contacts             # Contact-related pages
│   │   ├── page.tsx        # List of contacts
│   │   └── [id]            # Contact details
│   ├── deals                # Deal-related pages
│   │   ├── page.tsx        # List of deals
│   │   └── [id]            # Deal details
│   └── api                 # API routes
│       ├── customers        # Customer API routes
│       ├── contacts         # Contact API routes
│       └── deals            # Deal API routes
├── components               # Reusable components
│   ├── CustomerCard.tsx     # Component for displaying customer info
│   ├── ContactCard.tsx      # Component for displaying contact info
│   ├── DealCard.tsx         # Component for displaying deal info
│   └── Navbar.tsx           # Navigation bar component
├── lib                      # Library files
│   ├── db.ts                # Database connection logic
│   └── types.ts             # TypeScript types and interfaces
├── public                   # Static assets
├── .eslintrc.json           # ESLint configuration
├── next.config.js           # Next.js configuration
├── package.json             # npm configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd crm-app
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.