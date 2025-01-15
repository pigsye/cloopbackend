import React, { useState, useEffect } from "react";
import "./main.scss";
import API from "../../../../api.jsx";

export default function ReportedCustomer() {
    const [reports, setReports] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [disableDuration, setDisableDuration] = useState("");
    const [showDisablePopup, setShowDisablePopup] = useState(false);
    const [showCreateReportPopup, setShowCreateReportPopup] = useState(false);
    const [showEditReportPopup, setShowEditReportPopup] = useState(false);

    // Fields for creating or editing a report
    const [reportedId, setReportedId] = useState("");
    const [reporterId, setReporterId] = useState("");
    const [reason, setReason] = useState("");

    // Fetch reports
    useEffect(() => {
        API.get("/reports")
            .then((response) => setReports(response.data))
            .catch((error) => console.error("Error fetching reports:", error));
    }, []);

    // Act on report: Disable user and delete report
    const handleActOnReport = async () => {
        if (!disableDuration) {
            alert("Please select a disable duration.");
            return;
        }

        try {
            const response = await API.post("/reports/actonreport", {
                reportId: selectedReportId,
                duration: disableDuration,
            });
            alert(response.data.message || "User disabled and report deleted successfully.");
            setReports((prev) => prev.filter((report) => report.id !== selectedReportId));
            setShowDisablePopup(false);
        } catch (error) {
            console.error("Error acting on report:", error);
            alert("Failed to disable user and delete report.");
        }
    };

    // Delete report only
    const handleDeleteReport = async (reportId) => {
        try {
            const response = await API.post("/reports/deletereport", { reportId });
            alert(response.data.message || "Report deleted successfully!");
            setReports((prev) => prev.filter((report) => report.id !== reportId));
        } catch (err) {
            console.error("Error deleting report:", err);
            alert("Failed to delete report.");
        }
    };

    // Create a new report
    const handleCreateReport = async () => {
        if (!reportedId || !reporterId || !reason.trim()) {
            alert("All fields are required.");
            return;
        }

        try {
            const response = await API.post("/reports/create", {
                customerId: reportedId,
                reportedBy: reporterId,
                reason,
            });
            alert(response.data.message || "Report created successfully!");
            setReports((prev) => [...prev, response.data.report]);
            setShowCreateReportPopup(false);
            setReportedId("");
            setReporterId("");
            setReason("");
        } catch (err) {
            console.error("Error creating report:", err);
            alert("Failed to create report.");
        }
    };

    // Edit an existing report
    const handleEditReport = async () => {
        if (!reportedId || !reporterId || !reason.trim()) {
            alert("All fields are required.");
            return;
        }

        try {
            const response = await API.post("/reports/edit", {
                reportId: selectedReportId,
                customerId: reportedId,
                reportedBy: reporterId,
                reason,
            });
            alert(response.data.message || "Report updated successfully!");
            setReports((prev) =>
                prev.map((report) =>
                    report.id === selectedReportId
                        ? { ...report, customerId: reportedId, reportedBy: reporterId, reason }
                        : report
                )
            );
            setShowEditReportPopup(false);
            setReportedId("");
            setReporterId("");
            setReason("");
        } catch (err) {
            console.error("Error editing report:", err);
            alert("Failed to edit report.");
        }
    };

    return (
        <div className="reported-customer">
            {reports.map((report) => (
                <div key={report.id} className="report-card">
                    <div className="user-info">
                        <div className="user-details">
                            <h1>{report.customerName}</h1>
                            <p>Reported by: {report.reportedBy}</p>
                        </div>
                    </div>
                    <p className="reason">Reason: {report.reason}</p>
                    <div className="actions">
                        <button
                            className="disable-button"
                            onClick={() => {
                                setSelectedReportId(report.id);
                                setShowDisablePopup(true);
                            }}
                        >
                            Disable {report.customerName}
                        </button>
                        <button
                            className="edit-button remove-button"
                            onClick={() => {
                                setSelectedReportId(report.id);
                                setReportedId(report.customerId);
                                setReporterId(report.reportedBy);
                                setReason(report.reason);
                                setShowEditReportPopup(true);
                            }}
                        >
                            Edit Report
                        </button>
                    </div>
                </div>
            ))}

            {/* Disable User Popup */}
            {showDisablePopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Disable User</h2>
                        <label>
                            Select Disable Duration:
                            <select
                                value={disableDuration}
                                onChange={(e) => setDisableDuration(e.target.value)}
                            >
                                <option value="">Select duration</option>
                                <option value="3600">1 Hour</option>
                                <option value="86400">1 Day</option>
                                <option value="604800">1 Week</option>
                            </select>
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleActOnReport}>Submit</button>
                            <button onClick={() => setShowDisablePopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Report Popup */}
            {showCreateReportPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Create Report</h2>
                        <label>
                            Reported User ID:
                            <input
                                type="number"
                                value={reportedId}
                                onChange={(e) => setReportedId(e.target.value)}
                                placeholder="Enter reported user ID"
                            />
                        </label>
                        <label>
                            Reporter User ID:
                            <input
                                type="number"
                                value={reporterId}
                                onChange={(e) => setReporterId(e.target.value)}
                                placeholder="Enter reporter user ID"
                            />
                        </label>
                        <label>
                            Reason:
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter the reason for reporting"
                            />
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleCreateReport}>Submit</button>
                            <button onClick={() => setShowCreateReportPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditReportPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Edit Report</h2>
                        <label>
                            Reported User ID:
                            <input
                                type="number"
                                value={reportedId} // Default value from the current state
                                onChange={(e) => setReportedId(e.target.value)}
                                placeholder="Enter reported user ID"
                            />
                        </label>
                        <label>
                            Reporter User ID:
                            <input
                                type="number"
                                value={reporterId} // Default value from the current state
                                onChange={(e) => setReporterId(e.target.value)}
                                placeholder="Enter reporter user ID"
                            />
                        </label>
                        <label>
                            Reason:
                            <textarea
                                value={reason} // Default value from the current state
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter the reason for reporting"
                            />
                        </label>
                        <div className="popup-buttons">
                            <button onClick={handleEditReport}>Save</button>
                            <button onClick={() => setShowEditReportPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => setShowCreateReportPopup(true)} className="create-report-button">
                Create Report
            </button>
        </div>
    );
}