import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileExcel, FaFileAlt, FaPrint, FaShare, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Payslip.css';

const Payslip = () => {
  const [payslipData, setPayslipData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Close share options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareOptions && !event.target.closest('.share-container')) {
        setShowShareOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareOptions]);

  // Sample payslip data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const bonusMultiplier = 1 + (Math.random() * 0.5);
      const baseSalary = 7500 + (Math.random() > 0.5 ? 500 : 0);
      
      const data = {
        employee: {
          name: "John Doe",
          id: `IT-${selectedYear}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          department: "Engineering",
          bankAccount: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
          joinDate: "2020-03-15"
        },
        currentMonth: {
          netPay: (baseSalary * bonusMultiplier - 1950).toFixed(2),
          currency: 'INR',
          payPeriod: `${months[selectedMonth]} ${selectedYear}`,
          paymentDate: `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-28`,
          workingDays: 22,
          leavesTaken: Math.floor(Math.random() * 3)
        },
        ytdEarnings: (baseSalary * (selectedMonth + 1) * bonusMultiplier).toFixed(2),
        breakdown: [
          { component: 'Base Salary', amount: baseSalary, type: 'Earnings', description: 'Monthly fixed salary' },
          { component: 'On-Call Allowance', amount: 500, type: 'Earnings', description: 'After hours support' },
          { component: 'Performance Bonus', amount: (baseSalary * (bonusMultiplier - 1)).toFixed(2), type: 'Earnings', description: 'Quarterly performance bonus' },
          { component: 'Tax', amount: -1200, type: 'Deduction', description: 'Income tax deduction' },
          { component: 'Retirement Plan', amount: -450, type: 'Deduction', description: 'Employee provident fund' },
          { component: 'Health Insurance', amount: -300, type: 'Deduction', description: 'Corporate health plan' }
        ]
      };
      
      setPayslipData(data);
      setIsLoading(false);
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  const toggleRowExpand = (index) => {
    setExpandedRows(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const downloadPayslip = (format) => {
    if (!payslipData) return;
    
    let content, mimeType, fileExtension;
    
    if (format === 'pdf') {
      content = `data:application/pdf;base64,...`;
      mimeType = 'application/pdf';
      fileExtension = 'pdf';
    } else {
      content = "data:text/csv;charset=utf-8,";
      content += "Employee Payslip\r\n\r\n";
      content += `Employee Name,${payslipData.employee.name}\r\n`;
      content += `Employee ID,${payslipData.employee.id}\r\n`;
      content += `Department,${payslipData.employee.department}\r\n`;
      content += `Bank Account,${payslipData.employee.bankAccount}\r\n\r\n`;
      content += `Pay Period,${payslipData.currentMonth.payPeriod}\r\n`;
      content += `Payment Date,${payslipData.currentMonth.paymentDate}\r\n`;
      content += `Currency,${payslipData.currentMonth.currency}\r\n\r\n`;
      content += "Salary Breakdown\r\n";
      content += "Component,Amount,Type,Description\r\n";
      
      payslipData.breakdown.forEach(item => {
        content += `${item.component},${item.amount},${item.type},${item.description}\r\n`;
      });
      
      content += `\r\nNet Pay,${payslipData.currentMonth.netPay}\r\n`;
      content += `YTD Earnings,${payslipData.ytdEarnings}\r\n`;
      
      mimeType = format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv';
      fileExtension = format === 'excel' ? 'xls' : 'csv';
    }
    
    const encodedUri = format === 'pdf' ? content : encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download", 
      `${payslipData.employee.name.replace(/\s+/g, '_')}_Payslip_${payslipData.currentMonth.payPeriod.replace(/\s+/g, '_')}.${fileExtension}`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printPayslip = () => {
    window.print();
  };

  const sharePayslip = async (method) => {
    try {
      const payslipText = `My payslip for ${payslipData.currentMonth.payPeriod}: Net pay ${payslipData.currentMonth.currency} ${payslipData.currentMonth.netPay}`;
      
      if (method === 'Email') {
        window.location.href = `mailto:?subject=My Payslip for ${payslipData.currentMonth.payPeriod}&body=${encodeURIComponent(payslipText)}`;
      } 
      else if (method === 'Link' && navigator.clipboard) {
        await navigator.clipboard.writeText(payslipText);
        alert('Payslip details copied to clipboard!');
      }
      else if (method === 'Message') {
        if (navigator.share) {
          await navigator.share({
            title: `My ${payslipData.currentMonth.payPeriod} Payslip`,
            text: payslipText,
          });
        } else {
          alert(`Sharing not supported in your browser. Here's your payslip info:\n\n${payslipText}`);
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setShowShareOptions(false);
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  };

  const generateMonthOptions = () => {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  };

  if (isLoading || !payslipData) {
    return (
      <div className="payslip-page loading">
        <div className="loading-spinner"></div>
        <p>Loading your payslip details...</p>
      </div>
    );
  }

  return (
    <div className="payslip-page">
      <div className="payslip-header">
        <h2>
          <FaFileAlt className="header-icon" /> Salary Details
        </h2>
        
        <div className="date-selectors">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="month-select"
          >
            {generateMonthOptions().map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="year-select"
          >
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="summary-cards">
        <motion.div 
          className="payslip-card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3>Current Month</h3>
          <div className="amount">
            {payslipData.currentMonth.currency} {parseFloat(payslipData.currentMonth.netPay).toFixed(2)}
          </div>
          <p>Net pay for {payslipData.currentMonth.payPeriod}</p>
          <div className="meta-info">
            <span>{payslipData.currentMonth.workingDays} working days</span>
            <span>{payslipData.currentMonth.leavesTaken} leave(s)</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="payslip-card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3>YTD Earnings</h3>
          <div className="amount">
            {payslipData.currentMonth.currency} {parseFloat(payslipData.ytdEarnings).toFixed(2)}
          </div>
          <p>Jan {selectedYear} - {payslipData.currentMonth.payPeriod}</p>
          <div className="meta-info">
            <span>Joined: {new Date(payslipData.employee.joinDate).toLocaleDateString()}</span>
          </div>
        </motion.div>
      </div>
      
      <div className="breakdown-section">
        <div className="section-header">
          <h3>{payslipData.currentMonth.payPeriod} Breakdown</h3>
          <div className="section-actions">
            <div className="share-container">
              <button 
                className="btn share-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareOptions(!showShareOptions);
                }}
              >
                <FaShare /> Share
              </button>
              
              <AnimatePresence>
                {showShareOptions && (
                  <motion.div 
                    className="share-options"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <button onClick={() => sharePayslip('Email')}>Email</button>
                    <button onClick={() => sharePayslip('Link')}>Copy Link</button>
                    <button onClick={() => sharePayslip('Message')}>Message</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button className="btn print-btn" onClick={printPayslip}>
              <FaPrint /> Print
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Amount ({payslipData.currentMonth.currency})</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {payslipData.breakdown.map((item, index) => (
                <React.Fragment key={index}>
                  <motion.tr 
                    className={item.amount < 0 ? 'deduction-row' : 'earning-row'}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  >
                    <td>{item.component}</td>
                    <td className={item.amount < 0 ? 'deduction' : 'earning'}>
                      {item.amount > 0 ? '+' : ''}{parseFloat(item.amount).toFixed(2)}
                    </td>
                    <td>{item.type}</td>
                    <td className="expand-cell">
                      <button 
                        className="expand-btn"
                        onClick={() => toggleRowExpand(index)}
                      >
                        {expandedRows.includes(index) ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </td>
                  </motion.tr>
                  
                  <AnimatePresence>
                    {expandedRows.includes(index) && (
                      <motion.tr
                        className="detail-row"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan="4">
                          <div className="detail-content">
                            <p>{item.description}</p>
                            {item.type === 'Earnings' && (
                              <div className="calculation">
                                Calculation: Base × {item.component === 'Performance Bonus' ? 
                                ((parseFloat(item.amount) / 7500) * 100).toFixed(0) + '%' : '1.0'}
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td colSpan="1"><strong>Net Pay</strong></td>
                <td colSpan="3">
                  <strong>
                    {payslipData.currentMonth.currency} {parseFloat(payslipData.currentMonth.netPay).toFixed(2)}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="action-buttons">
          <motion.button 
            className="btn pdf-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => downloadPayslip('pdf')}
            title="Download as PDF"
          >
            <FaFilePdf /> Download PDF
          </motion.button>
          
          <motion.button 
            className="btn excel-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => downloadPayslip('excel')}
            title="Download as Excel"
          >
            <FaFileExcel /> Download Excel
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Payslip;