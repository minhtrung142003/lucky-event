export interface Employee {
  part: string;
  department: string;
  code: string;
  name: string;
  lotteryCode: string;
}

const rawEmployees: Employee[] = [
  // ===== EXECUTIVE BOARD =====
  { code: '00001', name: 'James Wilson', part: 'Executive Board', department: 'General Director', lotteryCode: '001' },
  { code: '00002', name: 'Sarah Johnson', part: 'Executive Board', department: 'Deputy Director', lotteryCode: '002' },
  { code: '00003', name: 'Michael Chen', part: 'Executive Board', department: 'Executive Assistant', lotteryCode: '003' },
  { code: '00004', name: 'Emma Thompson', part: 'Executive Board', department: 'Board Secretary', lotteryCode: '004' },

  // ===== ACCOUNTING =====
  { code: '00005', name: 'Lisa Anderson', part: 'Accounting', department: 'Chief Accountant', lotteryCode: '005' },
  { code: '00006', name: 'Robert Martin', part: 'Accounting', department: 'General Accountant', lotteryCode: '006' },
  { code: '00007', name: 'Jennifer Brown', part: 'Accounting', department: 'Payables Accountant', lotteryCode: '007' },
  { code: '00008', name: 'David Garcia', part: 'Accounting', department: 'Internal Auditor', lotteryCode: '008' },
  { code: '00009', name: 'Michelle Lee', part: 'Accounting', department: 'Tax Accountant', lotteryCode: '009' },
  { code: '00010', name: 'Christopher Davis', part: 'Accounting', department: 'Warehouse Accountant', lotteryCode: '010' },
  { code: '00011', name: 'Laura Martinez', part: 'Accounting', department: 'Settlement Accountant', lotteryCode: '011' },

  // ===== HUMAN RESOURCES =====
  { code: '00012', name: 'Daniel Rodriguez', part: 'Human Resources', department: 'HR Manager', lotteryCode: '012' },
  { code: '00013', name: 'Jessica Taylor', part: 'Human Resources', department: 'Recruitment Specialist', lotteryCode: '013' },
  { code: '00014', name: 'Kevin Thomas', part: 'Human Resources', department: 'Compensation & Benefits', lotteryCode: '014' },
  { code: '00015', name: 'Amanda White', part: 'Human Resources', department: 'Training Officer', lotteryCode: '015' },
  { code: '00016', name: 'Brandon Harris', part: 'Human Resources', department: 'Admin Officer', lotteryCode: '016' },
  { code: '00017', name: 'Nicole Clark', part: 'Human Resources', department: 'Benefits Officer', lotteryCode: '017' },

  // ===== MARKETING =====
  { code: '00018', name: 'Gregory Lewis', part: 'Marketing', department: 'Marketing Manager', lotteryCode: '018' },
  { code: '00019', name: 'Stephanie Walker', part: 'Marketing', department: 'Content Marketing', lotteryCode: '019' },
  { code: '00020', name: 'Jason Hall', part: 'Marketing', department: 'Digital Marketing', lotteryCode: '020' },
  { code: '00021', name: 'Victoria Young', part: 'Marketing', department: 'Designer', lotteryCode: '021' },
  { code: '00022', name: 'Andrew King', part: 'Marketing', department: 'SEO Specialist', lotteryCode: '022' },
  { code: '00023', name: 'Megan Scott', part: 'Marketing', department: 'Social Media Manager', lotteryCode: '023' },
  { code: '00024', name: 'Timothy Green', part: 'Marketing', department: 'Brand Manager', lotteryCode: '024' },
  { code: '00025', name: 'Rachel Adams', part: 'Marketing', department: 'PR Specialist', lotteryCode: '025' },
  { code: '00026', name: 'Samuel Nelson', part: 'Marketing', department: 'Event Coordinator', lotteryCode: '026' },

  // ===== SALES =====
  { code: '00027', name: 'Peter Carter', part: 'Sales', department: 'Sales Director', lotteryCode: '027' },
  { code: '00028', name: 'Katherine Mitchell', part: 'Sales', department: 'Sales Team Lead', lotteryCode: '028' },
  { code: '00029', name: 'Mark Perez', part: 'Sales', department: 'Sales Representative', lotteryCode: '029' },
  { code: '00030', name: 'Angela Roberts', part: 'Sales', department: 'Sales Representative', lotteryCode: '030' },
  { code: '00031', name: 'Steven Phillips', part: 'Sales', department: 'Sales Representative', lotteryCode: '031' },
  { code: '00032', name: 'Deborah Campbell', part: 'Sales', department: 'Customer Support', lotteryCode: '032' },
  { code: '00033', name: 'Paul Parker', part: 'Sales', department: 'Customer Support', lotteryCode: '033' },
  { code: '00034', name: 'Rebecca Evans', part: 'Sales', department: 'Sales Representative', lotteryCode: '034' },
  { code: '00035', name: 'Ryan Edwards', part: 'Sales', department: 'Sales Representative', lotteryCode: '035' },
  { code: '00036', name: 'Dorothy Collins', part: 'Sales', department: 'Sales Representative', lotteryCode: '036' },
  { code: '00037', name: 'Eric Reeves', part: 'Sales', department: 'Key Account Manager', lotteryCode: '037' },
  { code: '00038', name: 'Diane Morris', part: 'Sales', department: 'Key Account Manager', lotteryCode: '038' },

  // ===== INFORMATION TECHNOLOGY =====
  { code: '00039', name: 'Charles Murphy', part: 'Information Technology', department: 'IT Manager', lotteryCode: '039' },
  { code: '00040', name: 'Brenda Rogers', part: 'Information Technology', department: 'Backend Developer', lotteryCode: '040' },
  { code: '00041', name: 'George Morgan', part: 'Information Technology', department: 'Backend Developer', lotteryCode: '041' },
  { code: '00042', name: 'Susan Peterson', part: 'Information Technology', department: 'Frontend Developer', lotteryCode: '042' },
  { code: '00043', name: 'Joseph Powell', part: 'Information Technology', department: 'Frontend Developer', lotteryCode: '043' },
  { code: '00044', name: 'Barbara Long', part: 'Information Technology', department: 'DevOps Engineer', lotteryCode: '044' },
  { code: '00045', name: 'Donald Patterson', part: 'Information Technology', department: 'QA Engineer', lotteryCode: '045' },
  { code: '00046', name: 'Sandra Hughes', part: 'Information Technology', department: 'QA Engineer', lotteryCode: '046' },
  { code: '00047', name: 'Ronald Flores', part: 'Information Technology', department: 'Database Administrator', lotteryCode: '047' },
  { code: '00048', name: 'Ashley Washington', part: 'Information Technology', department: 'System Administrator', lotteryCode: '048' },
  { code: '00049', name: 'Kenneth Butler', part: 'Information Technology', department: 'Mobile Developer', lotteryCode: '049' },
  { code: '00050', name: 'Kathleen Simmons', part: 'Information Technology', department: 'Mobile Developer', lotteryCode: '050' },

  // ===== OPERATIONS =====
  { code: '00051', name: 'Dennis Jackson', part: 'Operations', department: 'Operations Manager', lotteryCode: '051' },
  { code: '00052', name: 'Karen White', part: 'Operations', department: 'Operations Specialist', lotteryCode: '052' },
  { code: '00053', name: 'Jerry Harris', part: 'Operations', department: 'Operations Specialist', lotteryCode: '053' },
  { code: '00054', name: 'Pamela Martin', part: 'Operations', department: 'Operations Supervisor', lotteryCode: '054' },
  { code: '00055', name: 'Tyler Thompson', part: 'Operations', department: 'Operations Specialist', lotteryCode: '055' },
  { code: '00056', name: 'Gloria Garcia', part: 'Operations', department: 'Operations Specialist', lotteryCode: '056' },
  { code: '00057', name: 'Aaron Rodriguez', part: 'Operations', department: 'Warehouse Specialist', lotteryCode: '057' },
  { code: '00058', name: 'Ruth Martinez', part: 'Operations', department: 'Warehouse Specialist', lotteryCode: '058' },
  { code: '00059', name: 'Jose Davis', part: 'Operations', department: 'Logistics Specialist', lotteryCode: '059' },
  { code: '00060', name: 'Beverly Lopez', part: 'Operations', department: 'Logistics Specialist', lotteryCode: '060' },

  // ===== LEGAL =====
  { code: '00061', name: 'Adam Gonzalez', part: 'Legal', department: 'Legal Manager', lotteryCode: '061' },
  { code: '00062', name: 'Denise Wilson', part: 'Legal', department: 'Legal Specialist', lotteryCode: '062' },
  { code: '00063', name: 'Frank Anderson', part: 'Legal', department: 'Contract Officer', lotteryCode: '063' },
  { code: '00064', name: 'Janice Taylor', part: 'Legal', department: 'Compliance Officer', lotteryCode: '064' },

  // ===== FINANCE =====
  { code: '00065', name: 'Henry Thomas', part: 'Finance', department: 'Finance Director', lotteryCode: '065' },
  { code: '00066', name: 'Wanda Jackson', part: 'Finance', department: 'Finance Specialist', lotteryCode: '066' },
  { code: '00067', name: 'Ethan White', part: 'Finance', department: 'Budget Officer', lotteryCode: '067' },
  { code: '00068', name: 'Marilyn Harris', part: 'Finance', department: 'Investment Officer', lotteryCode: '068' },
  { code: '00069', name: 'Carl Martin', part: 'Finance', department: 'Internal Control Officer', lotteryCode: '069' },

  // ===== PROCUREMENT =====
  { code: '00070', name: 'Arthur Thompson', part: 'Procurement', department: 'Procurement Manager', lotteryCode: '070' },
  { code: '00071', name: 'Jean Garcia', part: 'Procurement', department: 'Procurement Specialist', lotteryCode: '071' },
  { code: '00072', name: 'Willie Martinez', part: 'Procurement', department: 'Procurement Specialist', lotteryCode: '072' },
  { code: '00073', name: 'Dorothy Robinson', part: 'Procurement', department: 'Negotiation Officer', lotteryCode: '073' },
  { code: '00074', name: 'Albert Clark', part: 'Procurement', department: 'Vendor Manager', lotteryCode: '074' },

  // ===== ADMINISTRATION =====
  { code: '00075', name: 'Roy Rodriguez', part: 'Administration', department: 'Admin Manager', lotteryCode: '075' },
  { code: '00076', name: 'Ruby Lewis', part: 'Administration', department: 'Admin Officer', lotteryCode: '076' },
  { code: '00077', name: 'Louis Lee', part: 'Administration', department: 'Receptionist', lotteryCode: '077' },
  { code: '00078', name: 'Carolyn Walker', part: 'Administration', department: 'Receptionist', lotteryCode: '078' },
  { code: '00079', name: 'Joe Hall', part: 'Administration', department: 'Office Assistant', lotteryCode: '079' },
  { code: '00080', name: 'Helen Young', part: 'Administration', department: 'Security Officer', lotteryCode: '080' },
  { code: '00081', name: 'Roy King', part: 'Administration', department: 'Security Officer', lotteryCode: '081' },
  { code: '00082', name: 'Margaret Scott', part: 'Administration', department: 'Facilities Staff', lotteryCode: '082' },

  // ===== RESEARCH & DEVELOPMENT =====
  { code: '00083', name: 'Ralph Green', part: 'Research & Development', department: 'R&D Manager', lotteryCode: '083' },
  { code: '00084', name: 'Alice Adams', part: 'Research & Development', department: 'Research Specialist', lotteryCode: '084' },
  { code: '00085', name: 'Clarence Nelson', part: 'Research & Development', department: 'Product Developer', lotteryCode: '085' },
  { code: '00086', name: 'Anne Carter', part: 'Research & Development', department: 'Product Developer', lotteryCode: '086' },
  { code: '00087', name: 'Vincent Mitchell', part: 'Research & Development', department: 'Market Research Officer', lotteryCode: '087' },
  { code: '00088', name: 'Doris Perez', part: 'Research & Development', department: 'UX Research Officer', lotteryCode: '088' },

  // ===== CUSTOMER CARE =====
  { code: '00089', name: 'Hugh Roberts', part: 'Customer Care', department: 'Care Team Lead', lotteryCode: '089' },
  { code: '00090', name: 'Evelyn Phillips', part: 'Customer Care', department: 'Care Officer', lotteryCode: '090' },
  { code: '00091', name: 'Bruce Campbell', part: 'Customer Care', department: 'Care Officer', lotteryCode: '091' },
  { code: '00092', name: 'Rose Parker', part: 'Customer Care', department: 'Care Officer', lotteryCode: '092' },
  { code: '00093', name: 'Leon Evans', part: 'Customer Care', department: 'Care Officer', lotteryCode: '093' },
  { code: '00094', name: 'Lois Edwards', part: 'Customer Care', department: 'Care Officer', lotteryCode: '094' },
  { code: '00095', name: 'Russell Collins', part: 'Customer Care', department: 'Care Officer', lotteryCode: '095' },

  // ===== ENGINEERING =====
  { code: '00096', name: 'Norma Reeves', part: 'Engineering', department: 'Engineering Manager', lotteryCode: '096' },
  { code: '00097', name: 'Vincent Morris', part: 'Engineering', department: 'Mechanical Engineer', lotteryCode: '097' },
  { code: '00098', name: 'Judith Rogers', part: 'Engineering', department: 'Electrical Engineer', lotteryCode: '098' },
  { code: '00099', name: 'Stanley Morgan', part: 'Engineering', department: 'Automation Engineer', lotteryCode: '099' },
  { code: '00100', name: 'Phyllis Peterson', part: 'Engineering', department: 'Technician', lotteryCode: '100' },
  { code: '00101', name: 'Roger Powell', part: 'Engineering', department: 'Technician', lotteryCode: '101' },
  { code: '00102', name: 'Frances Long', part: 'Engineering', department: 'Technician', lotteryCode: '102' },
];

export const employees: Employee[] = rawEmployees;
