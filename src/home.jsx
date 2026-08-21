import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [gradingType, setGradingType] = useState("absolute");

  return (
    <div className="page-container">
      {/* Header */}
      <section className="header-section">
        <div className="header-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="main-heading">Academic Grading Tool</h1>
            <p className="subheading">
              Switch between Absolute and Relative grading methods
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <main className="main-content">
        <section className="card-section">
          <div className="card-container">
            {/* Toggle Button */}
            <div className="toggle-container">
              <button
                className="toggle-grading-btn"
                onClick={() =>
                  setGradingType(
                    gradingType === "absolute" ? "relative" : "absolute"
                  )
                }
              >
                {gradingType === "absolute" ? "◐" : "◑"} Switch to{" "}
                {gradingType === "absolute" ? "Relative" : "Absolute"} Grading
              </button>
            </div>

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grading-card updated-card">
                <div className="card-header updated-header">
                  <h2 className="card-title-black">
                    {gradingType === "absolute"
                      ? "Absolute Grading Calculator"
                      : "Relative Grading Calculator"}
                  </h2>
                </div>

                <div className="card-body">
                  <p className="card-description">
                    {gradingType === "absolute" ? (
                      <>
                        Calculate grades based on{" "}
                        <strong>fixed percentage ranges</strong> regardless of
                        class performance.
                      </>
                    ) : (
                      <>
                        Calculate grades based on{" "}
                        <strong>class distribution</strong> where top performers
                        get better grades.
                      </>
                    )}
                  </p>

                  <button
                    className="navigate-btn-soft"
                    onClick={() =>
                      navigate(
                        gradingType === "absolute" ? "/absolute" : "/relative"
                      )
                    }
                  >
                    {gradingType === "absolute"
                      ? "Go to Absolute Grading"
                      : "Go to Relative Grading"}{" "}
                    <ArrowRight className="nav-icon" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;