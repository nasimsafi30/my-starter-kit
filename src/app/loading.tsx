"use client";

import { useTheme } from "@/components/providers/theme-provider";

export default function Loading() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <style jsx global>{`
        :root {
          --bg-primary: ${isDark ? '#0a0a0b' : '#f8fafc'};
          --accent: #6366f1;
          --text-secondary: ${isDark ? '#94a3b8' : '#64748b'};
        }
      `}</style>

      <div className="loading-container">
        {/* Background Decorations */}
        <div className="bg-decoration">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
        </div>

        {/* Loading Content */}
        <div className="loading-content">
          {/* Main Spinner */}
          <div className="spinner-wrapper">
            <div className="spinner-ring spinner-ring-1" />
            <div className="spinner-ring spinner-ring-2" />
            <div className="spinner-ring spinner-ring-3" />
            
            <div className="spinner-core">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="spinner-icon"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
          </div>

          {/* Loading Text */}
          <div className="loading-text">
            <h2 className="loading-title">Loading</h2>
            <div className="loading-dots">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }

        /* Background Decorations */
        .bg-decoration {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.1;
        }

        .bg-blob-1 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse-blob 4s ease-in-out infinite;
        }

        .bg-blob-2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          top: 60%;
          left: 40%;
          animation: float 8s ease-in-out infinite;
        }

        @keyframes pulse-blob {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.15; }
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.05); }
          50% { transform: translate(-10px, -30px) scale(0.95); }
          75% { transform: translate(-20px, 10px) scale(1.02); }
        }

        /* Loading Content */
        .loading-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Spinner */
        .spinner-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
        }

        .spinner-ring-1 {
          width: 100%;
          height: 100%;
          border-top-color: #6366f1;
          border-right-color: rgba(99, 102, 241, 0.3);
          animation: spin 1.5s linear infinite;
        }

        .spinner-ring-2 {
          width: 85%;
          height: 85%;
          border-top-color: #8b5cf6;
          border-left-color: rgba(139, 92, 246, 0.3);
          animation: spin 2s linear infinite reverse;
        }

        .spinner-ring-3 {
          width: 70%;
          height: 70%;
          border-bottom-color: #06b6d4;
          border-right-color: rgba(6, 182, 212, 0.3);
          animation: spin 1.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner-core {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
          border: 1px solid rgba(99, 102, 241, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
          animation: pulse-core 2s ease-in-out infinite;
        }

        @keyframes pulse-core {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .spinner-icon {
          animation: float-icon 2s ease-in-out infinite;
        }

        @keyframes float-icon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* Loading Text */
        .loading-text {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .loading-title {
          font-size: 20px;
          font-weight: 700;
          color: ${isDark ? '#e2e8f0' : '#334155'};
          margin: 0;
        }

        .loading-dots {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #6366f1;
          animation: dot-bounce 1.4s ease-in-out infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes dot-bounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.3;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Progress Bar */
        .progress-bar {
          width: 200px;
          height: 3px;
          background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          width: 30%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
          border-radius: 2px;
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
          0% { 
            width: 0%;
            transform: translateX(0);
          }
          50% {
            width: 40%;
          }
          100% {
            width: 30%;
            transform: translateX(230px);
          }
        }
      `}</style>
    </>
  );
}