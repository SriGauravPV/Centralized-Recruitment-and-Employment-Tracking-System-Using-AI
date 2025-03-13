const express = require('express');
const ExcelJS = require('exceljs');
const Student = require('../models/Student');
const CompanyDrive = require('../models/CompanyDrive');
const router = express.Router();

// Get students by company with export functionality
router.get("/students/by-company/:companyName", async (req, res) => {
    console.log(`Fetching students for company: ${req.params.companyName}`);
    try {
        const companyName = req.params.companyName;
        const format = req.query.format || 'json';

        // Find the company drive
        const drive = await CompanyDrive.findOne({ companyName: companyName });

        if (!drive) {
            console.log(`Company drive not found for: ${companyName}`);
            return res.status(404).json({ error: "Company drive not found" });
        }

        // Get the IDs of students who applied
        const appliedStudentIds = drive.studentsId || [];
        const selectedStudentIds = drive.selectedStudents || [];

        // Get all student details
        const appliedStudents = await Student.find({ _id: { $in: appliedStudentIds } });

        // Format for export with application status
        const allStudentsFormatted = appliedStudents.map(student => ({
            ...student.toObject(),
            status: selectedStudentIds.includes(student._id.toString()) ? 'Selected' : 'Applied'
        }));

        // Handle different export formats
        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Students');

            // Add headers with gradient fill
            worksheet.columns = [
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Registration No', key: 'regNo', width: 20 },
                { header: 'Phone', key: 'phone', width: 18 },
                { header: 'Status', key: 'status', width: 15 }
            ];

            // Apply header styling
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell, colNumber) => {
                cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.fill = {
                    type: 'gradient',
                    gradient: 'path',
                    center: { left: 0.5, top: 0.5 },
                    stops: [
                        { position: 0, color: { argb: '4A90E2' } }, // Dark blue
                        { position: 1, color: { argb: '50E3C2' } }  // Light green
                    ]
                };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Add student rows with conditional styling
            allStudentsFormatted.forEach((student, index) => {
                const rowIndex = index + 2;
                const row = worksheet.addRow({
                    name: student.name || '',
                    email: student.email || '',
                    regNo: student.regNo || '',
                    phone: student.phone || '',
                    status: student.status || ''
                });

                // Apply styling for rows
                row.eachCell((cell) => {
                    cell.font = { size: 11 };
                    cell.alignment = { vertical: 'middle', horizontal: 'left' };
                    cell.border = {
                        bottom: { style: 'dotted', color: { argb: 'A0A0A0' } }
                    };
                });

                // Highlight 'Selected' students in green, others in blue
                const statusCell = row.getCell(5);
                if (student.status === 'Selected') {
                    statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'C6EFCE' } }; // Light green
                    statusCell.font = { bold: true, color: { argb: '006100' } }; // Dark green text
                } else {
                    statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B7B7FF' } }; // Light blue
                    statusCell.font = { bold: true, color: { argb: '003399' } }; // Dark blue text
                }
            });

            // Apply animation effect in Excel (row fade-in)
            worksheet.views = [{ state: 'frozen', ySplit: 1 }];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {
                    row.hidden = true;
                    setTimeout(() => {
                        row.hidden = false;
                    }, rowNumber * 200); // Simulates a fade-in effect
                }
            });

            // Set response headers for Excel download
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${companyName}-students.xlsx"`);

            // Write to buffer and send
            const buffer = await workbook.xlsx.writeBuffer();
            res.send(buffer);
        } else if (format === 'csv') {
            // Set CSV headers
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="${companyName}-students.csv"`);

            // Create CSV content
            const headers = ['Name', 'Email', 'Registration No', 'Phone', 'Status'];
            const csvRows = [
                headers.join(','),
                ...allStudentsFormatted.map(student => [
                    student.name || '',
                    student.email || '',
                    student.regNo || '',
                    student.phone || '',
                    student.status || ''
                ].join(','))
            ];

            res.send(csvRows.join('\n'));
        } else {
            // Default JSON response
            res.json(allStudentsFormatted);
        }
    } catch (error) {
        console.error("Error fetching students by company:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
