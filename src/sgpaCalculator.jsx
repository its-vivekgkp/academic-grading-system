import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Users,
  Calculator,
  HelpCircle,
  Minus,
} from "lucide-react";
import "./SGPACalculator.css";

const SGPACalculator = () => {
  const [subjects, setSubjects] = useState([{ name: "Subject 1", credits: 0 }]);
  const [students, setStudents] = useState([{ id: "", marks: {} }]);
  const [results, setResults] = useState([]);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  const addSubject = () => {
    const newSubject = { name: `Subject ${subjects.length + 1}`, credits: 0 };
    setSubjects([...subjects, newSubject]);
    setStudents(
      students.map((student) => ({
        ...student,
        marks: { ...student.marks, [newSubject.name]: 0 },
      }))
    );
  };

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      const subjectToRemove = subjects[index];
      setSubjects(subjects.filter((_, i) => i !== index));
      setStudents(
        students.map((student) => {
          const { [subjectToRemove.name]: removed, ...restMarks } =
            student.marks;
          return { ...student, marks: restMarks };
        })
      );
    }
  };

  const updateSubject = (index, field, value) => {
    const oldSubjectName = subjects[index].name;
    const newSubjects = subjects.map((subject, i) =>
      i === index ? { ...subject, [field]: value } : subject
    );

    if (field === "name") {
      setStudents(
        students.map((student) => {
          const { [oldSubjectName]: oldMark, ...restMarks } = student.marks;
          return {
            ...student,
            marks: { ...restMarks, [value]: oldMark || 0 },
          };
        })
      );
    }

    setSubjects(newSubjects);
  };

  const addStudent = () => {
    const newStudent = {
      id: "",
      marks: {},
    };
    subjects.forEach((subject) => {
      newStudent.marks[subject.name] = 0;
    });
    setStudents([...students, newStudent]);
  };

  const removeStudent = (index) => {
    if (students.length > 1) {
      setStudents(students.filter((_, i) => i !== index));
    }
  };

  const updateStudent = (studentIndex, value) => {
    setStudents(
      students.map((student, i) =>
        i === studentIndex ? { ...student, id: value } : student
      )
    );
  };

  const updateStudentMark = (studentIndex, subjectName, marks) => {
    setStudents(
      students.map((student, i) =>
        i === studentIndex
          ? {
              ...student,
              marks: { ...student.marks, [subjectName]: marks },
            }
          : student
      )
    );
  };

  const calculateGradePoint = (marks, mean, stdDev) => {
    if (marks < 40) return 0;
    if (marks < Math.min(mean - 0.5 * stdDev, 50)) return 5;
    if (marks < Math.min(mean, 60)) return 6;
    if (marks < Math.min(mean + 0.5 * stdDev, 70)) return 7;
    if (marks < Math.min(mean + stdDev, 80)) return 8;
    if (marks < Math.min(mean + 1.5 * stdDev, 90)) return 9;
    return 10;
  };

  const getLetterGrade = (gradePoint) => {
    if (gradePoint === 10) return "A+";
    if (gradePoint === 9) return "A";
    if (gradePoint === 8) return "B+";
    if (gradePoint === 7) return "B";
    if (gradePoint === 6) return "C";
    if (gradePoint === 5) return "D";
    return "F";
  };

  const calculateSGPA = () => {
    const validStudents = students.filter(
      (s) => s.id && Object.values(s.marks).some((mark) => mark > 0)
    );

    if (validStudents.length === 0) {
      alert("Please enter valid student data with marks.");
      return;
    }

    const subjectStats = {};

    subjects.forEach((subject) => {
      const subjectMarks = validStudents
        .map((student) => student.marks[subject.name] || 0)
        .filter((mark) => mark > 0);

      if (subjectMarks.length > 0) {
        const mean =
          subjectMarks.reduce((sum, mark) => sum + mark, 0) /
          subjectMarks.length;
        const variance =
          subjectMarks.reduce(
            (sum, mark) => sum + Math.pow(mark - mean, 2),
            0
          ) / subjectMarks.length;
        const stdDev = Math.sqrt(variance);

        subjectStats[subject.name] = {
          mean: Math.round(mean * 100) / 100,
          stdDev: Math.round(stdDev * 100) / 100,
        };
      }
    });

    const studentResults = validStudents.map((student) => {
      let totalPoints = 0;
      let totalCredits = 0;

      const subjectResults = subjects
        .map((subject) => {
          const marks = student.marks[subject.name] || 0;
          const stats = subjectStats[subject.name];

          if (marks > 0 && stats && subject.credits > 0) {
            const gradePoint = calculateGradePoint(
              marks,
              stats.mean,
              stats.stdDev
            );
            const letterGrade = getLetterGrade(gradePoint);
            totalPoints += gradePoint * subject.credits;
            totalCredits += subject.credits;

            return {
              name: subject.name,
              marks,
              credits: subject.credits,
              gradePoint,
              letterGrade,
              mean: stats.mean,
              stdDev: stats.stdDev,
            };
          }

          return null;
        })
        .filter(Boolean);

      const sgpa =
        totalCredits > 0
          ? Math.round((totalPoints / totalCredits) * 100) / 100
          : 0;

      return {
        id: student.id,
        subjects: subjectResults,
        sgpa,
        totalCredits,
      };
    });

    setResults(studentResults);
  };

  return (
    <div className="s-gpa-calculator">
      {/* Header with How to Calculate */}
      <div className="calculator-header">
        <div className="header-content">
          <Users className="header-icon" />
          <h2>Relative SGPA Calculator</h2>
        </div>
        <p className="header-description">
          Calculate your Semester Grade Point Average with Relative Grading
        </p>

        <button className="help-button" onClick={() => setShowHelpDialog(true)}>
          <HelpCircle className="help-icon" />
          How to Calculate
        </button>
      </div>

      {showHelpDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-header">
              <h3>How to Calculate SGPA with Relative Grading</h3>
              <button
                className="dialog-close"
                onClick={() => setShowHelpDialog(false)}
              >
                ×
              </button>
            </div>
            <div className="dialog-body">
              <div className="help-section">
                <h4>Step 1: Enter Student Data</h4>
                <p>• Add student IDs and their marks for each subject</p>
                <p>• Set credits for each subject (same for all students)</p>
              </div>

              <div className="help-section">
                <h4>Step 2: Relative Grading Formula</h4>
                <p>
                  For each subject, grades are assigned based on class
                  statistics:
                </p>

                <div className="grade-table-container">
                  <table className="grade-table">
                    <thead>
                      <tr>
                        <th>Letter grade</th>
                        <th>Numerical grade</th>
                        <th>Formula</th>
                        <th>Computation of the grade cut off</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          A<sup>+</sup>
                        </td>
                        <td>10</td>
                        <td>{`m ≥ x̄ +1.5σ`}</td>
                        <td>
                          The value of x̄ +1.5σ account for grade computation.
                          The grade cut off will be x̄ +1.5σ or 90% whichever is
                          lower
                        </td>
                      </tr>
                      <tr>
                        <td>A</td>
                        <td>9</td>
                        <td>{`x̄ +1.0σ ≤ m < x̄ +1.5σ`}</td>
                        <td>
                          The value of x̄ +1.0σ to be taken into account for
                          grade computation. The grade cut off will be x̄ +1.0σ
                          or 80% whichever is lower
                        </td>
                      </tr>
                      <tr>
                        <td>
                          B<sup>+</sup>
                        </td>
                        <td>8</td>
                        <td>{`x̄ +0.5σ ≤ m < x̄ +1.0σ`}</td>
                        <td>
                          The value of x̄ +0.5σ account for grade computation.
                          The grade cut off will be x̄ +0.5σ or 70% whichever is
                          lower
                        </td>
                      </tr>
                      <tr>
                        <td>B</td>
                        <td>7</td>
                        <td>{`x̄ +0.0σ ≤ m < x̄ +0.5σ`}</td>
                        <td>
                          The value of x̄ +0.0σ to be taken into account for
                          grade computation. The grade cut off will be x̄ +0.0σ
                          or 60% whichever is lower
                        </td>
                      </tr>
                      <tr>
                        <td>C</td>
                        <td>6</td>
                        <td>{`x̄ -0.5σ ≤ m < x̄ +0.0σ`}</td>
                        <td>
                          The value of x̄ -0.5σ to be taken into account for
                          grade computation. The grade cut off will be x̄ -0.5σ
                          or 50% whichever is lower
                        </td>
                      </tr>
                      <tr>
                        <td>D</td>
                        <td>5</td>
                        <td>{`40 ≤ m < x̄ -0.5σ`}</td>
                        <td>The lower grade cut off will be 40%</td>
                      </tr>
                      <tr>
                        <td>F</td>
                        <td>0</td>
                        <td>{`m < 40`}</td>
                        <td>Less than 40%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* You can keep the list version too if you want */}
                <ul className="grade-list">
                  <li>
                    <strong>A+ (10):</strong> Marks ≥ min(Mean + 1.5×SD, 90)
                  </li>
                  <li>
                    <strong>A (9):</strong> Marks ≥ min(Mean + SD, 80)
                  </li>
                  <li>
                    <strong>B+ (8):</strong> Marks ≥ min(Mean + 0.5×SD, 70)
                  </li>
                  <li>
                    <strong>B (7):</strong> Marks ≥ min(Mean, 60)
                  </li>
                  <li>
                    <strong>C (6):</strong> Marks ≥ min(Mean - 0.5×SD, 50)
                  </li>
                  <li>
                    <strong>D (5):</strong> Marks ≥ 40
                  </li>
                  <li>
                    <strong>F (0):</strong> Marks &lt; 40
                  </li>
                </ul>
              </div>

              <div className="help-section">
                <h4>Step 3: SGPA Calculation</h4>
                <p>
                  <strong>SGPA = Σ(Grade Point × Credits) / Σ(Credits)</strong>
                </p>
              </div>

              <div className="example-box">
                <h4>Detailed Example:</h4>

                <div className="example-step">
                  <h5>1. Input Data</h5>
                  <ul>
                    <li>
                      <strong>Subject:</strong> Mathematics (Course Code:
                      MATH101)
                    </li>
                    <li>
                      <strong>Credits:</strong> 3
                    </li>
                    <li>
                      <strong>Class Marks:</strong> [85, 75, 90, 70, 80]
                    </li>
                  </ul>
                </div>

                <div className="example-step">
                  <h5>2. Calculate Statistics</h5>
                  <ul>
                    <li>
                      <strong>Mean (x̄):</strong> (85 + 75 + 90 + 70 + 80) / 5 =
                      80
                    </li>
                    <li>
                      <strong>Standard Deviation (σ):</strong> 7.07
                    </li>
                    <li>
                      <strong>Grade Boundaries:</strong>
                      <ul>
                        <li>
                          A+: min(80 + 1.5×7.07, 90) = min(90.605, 90) = 90
                        </li>
                        <li>A: min(80 + 1.0×7.07, 80) = min(87.07, 80) = 80</li>
                        <li>
                          B+: min(80 + 0.5×7.07, 70) = min(83.535, 70) = 70
                        </li>
                        <li>B: min(80 + 0.0×7.07, 60) = min(80, 60) = 60</li>
                        <li>
                          C: min(80 - 0.5×7.07, 50) = min(76.465, 50) = 50
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div className="example-step">
                  <h5>3. Determine Student Grade</h5>
                  <p>
                    <strong>Student Mark:</strong> 85
                  </p>
                  <p>
                    <strong>Grade Calculation:</strong>
                  </p>
                  <ul>
                    <li>85 ≥ 90? No → Not A+</li>
                    <li>
                      85 ≥ 80? Yes → Check if less than next boundary (87.07)
                    </li>
                    <li>
                      Since 80 ≤ 85 is less than 87.07 → Grade: B+ (8 points)
                    </li>
                  </ul>
                </div>

                <div className="example-step">
                  <h5>4. SGPA Contribution</h5>
                  <p>
                    <strong>Calculation:</strong> Grade Points × Credits = 8 × 3
                    = 24
                  </p>
                  <p>
                    <strong>If this was the only subject:</strong> SGPA = 24 / 3
                    = 8.0
                  </p>
                </div>

                <div className="example-box">
                  <h4>Relative Grading in Action</h4>

                  <div className="scenario">
                    <h5>Class Scenario:</h5>
                    <ul>
                      <li>
                        <strong>Subject:</strong> Data Structures (4 credits)
                      </li>
                      <li>
                        <strong>Class Size:</strong> 30 students
                      </li>
                      <li>
                        <strong>Marks Distribution:</strong> [92, 88, 85, 85,
                        82, 80, 78, 75, 75, 72, 70, 68, 65, 65, 63, 60, 58, 55,
                        55, 52, 50, 48, 45, 45, 42, 40, 38, 35, 32, 30]
                      </li>
                    </ul>
                  </div>

                  <div className="calculations">
                    <h5>Statistical Calculations:</h5>
                    <ul>
                      <li>
                        <strong>Mean (x̄):</strong> 62.4
                      </li>
                      <li>
                        <strong>Standard Deviation (σ):</strong> 16.2
                      </li>
                      <li>
                        <strong>Key Boundaries:</strong>
                        <table className="boundary-table">
                          <thead>
                            <tr>
                              <th>Grade</th>
                              <th>Calculation</th>
                              <th>Absolute Cap</th>
                              <th>Final Cutoff</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>A+</td>
                              <td>62.4 + (1.5 × 16.2) = 86.7</td>
                              <td>90</td>
                              <td>86.7 (no cap applied)</td>
                            </tr>
                            <tr>
                              <td>A</td>
                              <td>62.4 + (1.0 × 16.2) = 78.6</td>
                              <td>80</td>
                              <td>78.6 (no cap applied)</td>
                            </tr>
                            <tr>
                              <td>B+</td>
                              <td>62.4 + (0.5 × 16.2) = 70.5</td>
                              <td>70</td>
                              <td>70 (capped at 70)</td>
                            </tr>
                            <tr>
                              <td>B</td>
                              <td>62.4 + (0.0 × 16.2) = 62.4</td>
                              <td>60</td>
                              <td>60 (capped at 60)</td>
                            </tr>
                            <tr>
                              <td>C</td>
                              <td>62.4 - (0.5 × 16.2) = 54.3</td>
                              <td>50</td>
                              <td>50 (capped at 50)</td>
                            </tr>
                          </tbody>
                        </table>
                      </li>
                    </ul>
                  </div>

                  <div className="grading-results">
                    <h5>Resulting Grade Distribution:</h5>
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Grade</th>
                          <th>Mark Range</th>
                          <th>Students</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>A+</td>
                          <td>≥86.7</td>
                          <td>2</td>
                          <td>6.7%</td>
                        </tr>
                        <tr>
                          <td>A</td>
                          <td>78.6-86.6</td>
                          <td>3</td>
                          <td>10%</td>
                        </tr>
                        <tr>
                          <td>B+</td>
                          <td>70.5-78.5</td>
                          <td>4</td>
                          <td>13.3%</td>
                        </tr>
                        <tr>
                          <td>B</td>
                          <td>62.4-70.4</td>
                          <td>3</td>
                          <td>10%</td>
                        </tr>
                        <tr>
                          <td>C</td>
                          <td>50-62.3</td>
                          <td>8</td>
                          <td>26.7%</td>
                        </tr>
                        <tr>
                          <td>D</td>
                          <td>40-49.9</td>
                          <td>6</td>
                          <td>20%</td>
                        </tr>
                        <tr>
                          <td>F</td>
                          <td>&lt;40</td>
                          <td>4</td>
                          <td>13.3%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="key-observations">
                    <h5>Key Observations:</h5>
                    <ol>
                      <li>
                        <strong>Relative Nature:</strong> A mark of 75 (which
                        would be B in absolute grading) becomes an A due to
                        overall class performance
                      </li>
                      <li>
                        <strong>Capping Effect:</strong> The B+ boundary was
                        reduced from 70.5 to 70 due to the absolute cap
                      </li>
                      <li>
                        <strong>Distribution:</strong> Only top 16.7% got A/A+,
                        while bottom 13.3% failed, showing forced distribution
                      </li>
                      <li>
                        <strong>Pass Percentage:</strong> 86.7% passed (C or
                        above), demonstrating leniency in the cutoff
                        calculations
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Calculator */}
      <div className="calculator-grid">
        {/* SGPA Calculator */}
        <div className="calculator-card">
          <div className="card-header">
            <div className="card-title">
              <Users className="card-icon" />
              <span>SGPA Calculator</span>
            </div>
          </div>
          <div className="card-content">
            {/* Subject Configuration */}
            <div className="subject-section">
              <div className="section-header">
                <h3>Subjects</h3>
                <button onClick={addSubject} className="add-button">
                  <Plus className="button-icon" />
                </button>
              </div>
              <div className="subject-list">
                {subjects.map((subject, index) => (
                  <div key={index} className="subject-item">
                    <input
                      value={subject.name}
                      onChange={(e) =>
                        updateSubject(index, "name", e.target.value)
                      }
                      placeholder="Subject Name"
                      className="subject-input"
                    />
                    <div className="credits-input-group">
                      <label>Credits:</label>
                      <input
                        type="number"
                        min="0"
                        value={subject.credits || ""}
                        onChange={(e) =>
                          updateSubject(
                            index,
                            "credits",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="Credits"
                        className="credits-input"
                      />
                    </div>
                    {subjects.length > 1 && (
                      <button
                        onClick={() => removeSubject(index)}
                        className="remove-button"
                      >
                        <Minus className="button-icon" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Student Data Table */}
            <div className="student-section">
              <div className="section-header">
                <h3>Student Data</h3>
                <button onClick={addStudent} className="add-button">
                  <Plus className="button-icon" />
                </button>
              </div>

              <div className="student-table-container">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      {subjects.map((subject) => (
                        <th key={subject.name}>
                          {subject.name}
                          <br />
                          <span className="subheader">Marks</span>
                        </th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, studentIndex) => (
                      <tr key={studentIndex}>
                        <td>
                          <input
                            value={student.id}
                            onChange={(e) =>
                              updateStudent(studentIndex, e.target.value)
                            }
                            placeholder="Student ID"
                            className="student-id-input"
                          />
                        </td>
                        {subjects.map((subject) => (
                          <td key={subject.name}>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={student.marks[subject.name] || ""}
                              onChange={(e) =>
                                updateStudentMark(
                                  studentIndex,
                                  subject.name,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="0-100"
                              className="mark-input"
                            />
                          </td>
                        ))}
                        <td>
                          {students.length > 1 && (
                            <button
                              onClick={() => removeStudent(studentIndex)}
                              className="remove-button"
                            >
                              <Minus className="button-icon" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button onClick={calculateSGPA} className="calculate-button">
              <Calculator className="button-icon" />
              Calculate SGPA
            </button>
          </div>
        </div>

        {/* SGPA Result */}
        <div className="result-card">
          <div className="card-header">
            <h3 className="card-title">SGPA Result</h3>
          </div>
          <div className="card-content">
            {results.length > 0 ? (
              <div className="result-list">
                {results.map((student, index) => (
                  <div key={index} className="student-result">
                    <div className="result-header">
                      <h4>Student ID: {student.id}</h4>
                      <div className="sgpa-value">{student.sgpa}</div>
                    </div>
                    <div className="sgpa-label">SGPA</div>

                    {/* Subject breakdown */}
                    <div className="subject-results">
                      {student.subjects.map((subject, i) => (
                        <div key={i} className="subject-result">
                          <span>
                            {subject.name}: {subject.marks} marks
                          </span>
                          <span
                            className={`grade-badge grade-${subject.letterGrade}`}
                          >
                            {subject.letterGrade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-result">
                <div className="sgpa-circle">
                  <span>0.00</span>
                </div>
                <div className="sgpa-label">SGPA</div>
                <p className="empty-message">
                  Enter student data and calculate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SGPACalculator;