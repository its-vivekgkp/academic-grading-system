import React, { useState, useEffect } from "react";
import {
  Plus,
  Minus,
  Calculator,
  GraduationCap,
  Info,
  Sparkles,
} from "lucide-react";
import "./GradeCalculator.css";

const GradeCalculator = () => {
  const [subjects, setSubjects] = useState([{ id: 1, marks: 0, credits: 0 }]);
  const [semesters, setSemesters] = useState([{ id: 1, sgpa: 0, credits: 0 }]);
  const [sgpa, setSgpa] = useState(0);
  const [cgpa, setCgpa] = useState(0);
  const [showHowToCalculate, setShowHowToCalculate] = useState(false);

  const getGradePoint = (marks) => {
    if (marks >= 90) return 10;
    if (marks >= 80) return 9;
    if (marks >= 70) return 8;
    if (marks >= 60) return 7;
    if (marks >= 50) return 6;
    if (marks >= 40) return 5;
    return 0;
  };

  const getGrade = (marks) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    if (marks >= 40) return "D";
    return "F";
  };

  const addSubject = () => {
    const newId =
      subjects.length > 0 ? Math.max(...subjects.map((s) => s.id)) + 1 : 1;
    setSubjects([...subjects, { id: newId, marks: 0, credits: 0 }]);
  };

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((subject) => subject.id !== id));
    }
  };

  const updateSubject = (id, field, value) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    );
  };

  const addSemester = () => {
    const newId =
      semesters.length > 0 ? Math.max(...semesters.map((s) => s.id)) + 1 : 1;
    setSemesters([...semesters, { id: newId, sgpa: 0, credits: 0 }]);
  };

  const removeSemester = (id) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter((semester) => semester.id !== id));
    }
  };

  const updateSemester = (id, field, value) => {
    setSemesters(
      semesters.map((semester) =>
        semester.id === id ? { ...semester, [field]: value } : semester
      )
    );
  };

  const calculateSGPA = () => {
    let totalGradePoints = 0;
    let totalCreds = 0;

    subjects.forEach((subject) => {
      if (subject.marks > 0 && subject.credits > 0) {
        const gradePoint = getGradePoint(subject.marks);
        totalGradePoints += gradePoint * subject.credits;
        totalCreds += subject.credits;
      }
    });

    const calculatedSGPA = totalCreds > 0 ? totalGradePoints / totalCreds : 0;
    setSgpa(calculatedSGPA);
  };

  const calculateCGPA = () => {
    let totalGradePoints = 0;
    let totalCreds = 0;

    semesters.forEach((semester) => {
      if (semester.sgpa > 0 && semester.credits > 0) {
        totalGradePoints += semester.sgpa * semester.credits;
        totalCreds += semester.credits;
      }
    });

    const calculatedCGPA = totalCreds > 0 ? totalGradePoints / totalCreds : 0;
    setCgpa(calculatedCGPA);
  };

  useEffect(() => {
    calculateSGPA();
  }, [subjects]);

  useEffect(() => {
    calculateCGPA();
  }, [semesters]);

  return (
    <div className="grade-calculator-container">
      <div className="max-width-container">
        <div className="header-container">
          <div className="header-flex">
            <h1 className="main-heading">CGPA Calculator</h1>
          </div>
          <p className="subheading">
            Calculate your Semester Grade Point Average and Cumulative Grade
            Point Average with ease
          </p>

          <button
            onClick={() => setShowHowToCalculate(!showHowToCalculate)}
            className="how-to-calculate-button"
          >
            <Info className="info-icon" />
            How to Calculate
          </button>

          {showHowToCalculate && (
            <div className="how-to-calculate-card fade-in">
              <div className="how-to-calculate-header">
                <h3 className="how-to-calculate-title">
                  How to Calculate SGPA & CGPA
                </h3>
              </div>
              <div className="how-to-calculate-content">
                <div className="calculation-example">
                  <h3 className="example-title">
                    SGPA (Semester Grade Point Average)
                  </h3>
                  <p className="example-text">
                    Formula: SGPA = Σ(Grade Point × Credits) / Σ(Credits)
                  </p>
                  <p className="example-detail">
                    Example: If you have 3 subjects with grades 9, 8, 7 and
                    credits 4, 3, 2 respectively:
                  </p>
                  <p className="example-detail">
                    SGPA = (9×4 + 8×3 + 7×2) / (4+3+2) = (36+24+14) / 9 = 8.22
                  </p>
                </div>
                <div className="calculation-example">
                  <h3 className="example-title">
                    CGPA (Cumulative Grade Point Average)
                  </h3>
                  <p className="example-text">
                    Formula: CGPA = Σ(SGPA × Credits) / Σ(Credits)
                  </p>
                  <p className="example-detail">
                    Example: If you have 2 semesters with SGPA 8.5, 7.8 and
                    credits 22, 24 respectively:
                  </p>
                  <p className="example-detail">
                    CGPA = (8.5×22 + 7.8×24) / (22+24) = (187+187.2) / 46 = 8.13
                  </p>
                </div>
                <div className="calculation-example">
                  <h3 className="example-title">Grade Scale</h3>
                  <div className="grade-scale-grid">
                    <div className="grade-scale-item">A+ (90-100): 10</div>
                    <div className="grade-scale-item">A (80-89): 9</div>
                    <div className="grade-scale-item">B+ (70-79): 8</div>
                    <div className="grade-scale-item">B (60-69): 7</div>
                    <div className="grade-scale-item">C (50-59): 6</div>
                    <div className="grade-scale-item">D (40-49): 5</div>
                    <div className="grade-scale-item-wide">F (&lt;40): 0</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="calculator-grid">
          <div className="sgpa-section">
            <div className="sgpa-card">
              <div className="sgpa-header">
                <h3 className="sgpa-title">
                  <Calculator className="calculator-icon" />
                  SGPA Calculator
                </h3>
              </div>
              <div className="sgpa-content">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="subject-card">
                    <div className="subject-grid">
                      <div>
                        <label className="subject-label">
                          Subject {index + 1}
                        </label>
                        <div className="subject-number">
                          Subject {index + 1}
                        </div>
                      </div>
                      <div>
                        <label className="marks-label">Marks</label>
                        <input
                          type="number"
                          placeholder="0-100"
                          min="0"
                          max="100"
                          value={subject.marks || ""}
                          onChange={(e) =>
                            updateSubject(
                              subject.id,
                              "marks",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="marks-input"
                        />
                      </div>
                      <div>
                        <label className="credits-label">Credits</label>
                        <input
                          type="number"
                          placeholder="Credits"
                          min="0"
                          value={subject.credits || ""}
                          onChange={(e) =>
                            updateSubject(
                              subject.id,
                              "credits",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="credits-input"
                        />
                      </div>
                      <div className="subject-buttons">
                        {subjects.length > 1 && (
                          <button
                            onClick={() => removeSubject(subject.id)}
                            className="remove-button"
                          >
                            <Minus className="minus-icon" />
                          </button>
                        )}
                        {index === subjects.length - 1 && (
                          <button onClick={addSubject} className="add-button">
                            <Plus className="plus-icon" />
                          </button>
                        )}
                      </div>
                    </div>
                    {subject.marks > 0 && (
                      <div className="grade-info">
                        Grade:{" "}
                        <span className="grade-letter">
                          {getGrade(subject.marks)}
                        </span>{" "}
                        | Grade Point:{" "}
                        <span className="grade-point">
                          {getGradePoint(subject.marks)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="sgpa-result-card">
              <div className="sgpa-result-header">
                <h3 className="sgpa-result-title">SGPA Result</h3>
              </div>
              <div className="sgpa-result-content">
                <div className="sgpa-result-display">
                  <div className="sgpa-value">{sgpa.toFixed(2)}</div>
                  <div className="sgpa-label">SGPA</div>
                </div>
              </div>
            </div>
          </div>

          <div className="cgpa-section">
            <div className="cgpa-card">
              <div className="cgpa-header">
                <h3 className="cgpa-title">
                  <GraduationCap className="graduation-icon" />
                  CGPA Calculator
                </h3>
              </div>
              <div className="cgpa-content">
                {semesters.map((semester, index) => (
                  <div key={semester.id} className="semester-card">
                    <div className="semester-grid">
                      <div>
                        <label className="semester-label">
                          Semester {index + 1}
                        </label>
                        <div className="semester-number">SGPA & Credits</div>
                      </div>
                      <div>
                        <label className="sgpa-label">SGPA</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          max="10"
                          step="0.01"
                          value={semester.sgpa || ""}
                          onChange={(e) =>
                            updateSemester(
                              semester.id,
                              "sgpa",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="sgpa-input"
                        />
                      </div>
                      <div>
                        <label className="credits-label"> Total Credits</label>
                        <input
                          type="number"
                          placeholder="Credits"
                          min="0"
                          value={semester.credits || ""}
                          onChange={(e) =>
                            updateSemester(
                              semester.id,
                              "credits",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="credits-input"
                        />
                      </div>
                      <div className="semester-buttons">
                        {semesters.length > 1 && (
                          <button
                            onClick={() => removeSemester(semester.id)}
                            className="remove-button"
                          >
                            <Minus className="minus-icon" />
                          </button>
                        )}
                        {index === semesters.length - 1 && (
                          <button onClick={addSemester} className="add-button">
                            <Plus className="plus-icon" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cgpa-result-card">
              <div className="cgpa-result-header">
                <h3 className="cgpa-result-title">CGPA Result</h3>
              </div>
              <div className="cgpa-result-content">
                <div className="cgpa-result-display">
                  <div className="cgpa-value">{cgpa.toFixed(2)}</div>
                  <div className="cgpa-label">CGPA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;