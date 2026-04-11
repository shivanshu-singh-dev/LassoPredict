# LassoPredict: Interactive Dimensionality Reduction

LassoPredict is an interactive, full-stack educational and visualization platform that brings the math of **Lasso (L1 Regularization) Regression** to life. Built with a React/Vite frontend and a serverless-friendly FastAPI backend engine, this tool enables users to upload generic datasets, dynamically apply L1 penalty constraints, and watch in real-time as dimensional noise is mathematically zeroed out.

![LassoPredict](https://img.shields.io/badge/Status-Active-brightgreen) ![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB) ![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688)

---

## 🔥 Key Features

1. **Upload & Analyze**: Drag-and-drop CSV or Excel files. Define your target variable and the dataset is parsed automatically.
2. **Interactive Gradient Penalty ($\alpha$)**: A responsive slider adjusting the alpha constraint in real-time.
3. **Live Mathematical Timeline**: Four distinct visualization stages built using `Recharts`, showing raw feature variance, unregularized weights, the shrinkage descent path, and the final converged vector.
4. **Prediction Sandbox**: A dedicated Prediction Tab dynamically generates input forms perfectly synchronized with only the non-zero surviving features from your model.
5. **Modern UI/UX**: Custom themed dark-mode interface, glassmorphism panels, and heavy integration with `framer-motion` for a premium interaction model.

---

## 🏗️ Architecture

The app is built as a unified monorepo designed explicitly for **Vercel Serverless Functions**.

- **`/frontend`**: Modern React SPA, initialized with Vite. Uses Framer Motion for animations and Recharts for live data mapping.
- **`/api`**: Python backend powered by FastAPI. Relies on `scikit-learn` for ML computations and `pandas` for DataFrame manipulation. It operates ephemerally, returning trained weights to the client `localStorage`.

---

## 🚀 Running Locally (Unlimited Scale)

The live web version on Vercel is capped at 5MB dataset uploads to prevent serverless execution timeouts. To run massive multi-gigabyte files, deploy the backend to your local machine!

### Prerequisites
- Python 3.9+
- Node.js 18+

### 1. Clone & Setup Repository
```bash
git clone https://github.com/shivanshu-singh-dev/LassoPredict.git
cd LassoPredict
```

### 2. Boot Backend Server (FastAPI)
Open a terminal and run the following commands:
```bash
cd api
pip install -r requirements.txt
uvicorn index:app --reload
```
*The engine is now listening on `localhost:8000`.*

### 3. Launch Frontend Client (Vite/React)
Open a separate terminal window and run:
```bash
cd frontend
npm install
npm run dev
```
*The UI is now accessible at `localhost:5173`.*

---

## 🛠️ Deploying to Vercel

If you'd like to deploy your own instance of LassoPredict:
1. Fork this repository.
2. Connect it to Vercel.
3. Vercel automatically detects the Root directory.
4. Ensure the **Framework Preset** is *Vite*, but explicitly set your Root Directory overriding command:
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`
5. The custom `vercel.json` file in the root takes care of routing `/api/*` to the Python serverless environment.

---

## 👨‍💻 Developed By

Developed to create a fluid, intuitive bridge between abstract Machine Learning mathematics and visual human intuition by exploring hyper-parameters practically rather than purely theoretically.

If you enjoy the project, feel free to contribute, open PRs, or leave a star!
