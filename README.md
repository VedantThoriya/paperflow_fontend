# PaperFlow - Advanced PDF Tool Suite

**PaperFlow** is a powerful, free, and open-source web application that provides a comprehensive suite of PDF tools. Whether you need to merge, split, compress, protect, or unlock PDF documents, PaperFlow handles it all with ease and security, right in your browser.

## 🚀 Live Demo

- **Frontend (Vercel):** [Vercel](https://app-paperflow.vercel.app)

## 🔗 Related Repositories

This is the frontend repository. For the backend application, please visit:

* **[PaperFlow Backend](https://github.com/VedantThoriya/paperflow_backend)**

## ✨ Features

PaperFlow offers a wide range of PDF utilities:

- **🔄 Merge PDF:** Combine multiple PDF files into a single document in your preferred order.
- **✂️ Split PDF:** Separate one page or a whole set for easy conversion into independent PDF files.
- **📉 Compress PDF:** Reduce file size while optimizing for maximal PDF quality.
- **🔒 Protect PDF:** Encrypt your PDF files with a password to prevent unauthorized access.
- **🔓 Unlock PDF:** Remove password security from PDFs, giving you the freedom to use your documents as you want.

## 🛠️ Tech Stack

### Frontend

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **PDF Processing:** [pdfjs-dist](https://mozilla.github.io/pdf.js/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Drag & Drop:** [dnd-kit](https://dndkit.com/)

### Backend

- **Hosted on:** Render
- **Language:** [Node.js](https://nodejs.org/) (Assumed based on typical stack, verify if different)

## 📦 Installation & Setup

Follow these steps to run the frontend locally:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/VedantThoriya/paperflow_frontend.git
    cd paperflow_frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 🏗️ Project Structure

```
src/
├── api/             # API configuration and endpoints
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
│   ├── Layout/      # Layout components (Header, Footer)
│   └── Workspace/   # Workspace components (File uploader, Preview)
├── pages/           # Application pages (Home, Merge, Split, etc.)
├── store/           # Global state management (Zustand)
├── utils/           # Helper functions (PDF utils)
└── App.tsx          # Main application component
```

## 🤝 Contributing

Contributions are always welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch: `git checkout -b feature/your-feature-name`.
3.  Make your changes and commit them: `git commit -m 'Add some feature'`.
4.  Push to the branch: `git push origin feature/your-feature-name`.
5.  Submit a pull request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
