import { useState } from "react";
import { 
  User, 
  Mail, 
  Briefcase, 
  Layers, 
  MapPin, 
  Phone, 
  Hash, 
  Plus, 
  Trash2, 
  Check, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Printer, 
  Download, 
  CheckCircle
} from "lucide-react";

const DISTRICTS = [
  "Head Office (Chandigarh)",
  "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib",
  "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
  "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga",
  "Mohali (SAS Nagar)", "Muktsar", "Pathankot", "Patiala",
  "Rupnagar", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran",
];

const BRANCHES = [
  "ACCOUNTS",
  "ADVERTISEMENT",
  "CMO",
  "DIRECTOR STAFF",
  "DISTRICT",
  "ELECTRONIC MEDIA",
  "ESTABLISHMENT",
  "FIELD",
  "O/O OSD CM",
  "O/O SIPR",
  "O/O DIPR",
  "O/O ADA",
  "PF",
  "PRESS",
  "PRODUCTION",
  "PUNMEDIA",
  "R&R",
  "RTI",
  "SOCIAL MEDIA",
  "STENO-ADA",
  "STORE",
  "TECHNICAL",
  "NA",
  "OTHER"
];

const DESIGNATIONS = [
  "AD",
  "ADA",
  "APRO",
  "CASHIER",
  "CLERK",
  "CONTENT WRITER",
  "DATA ENTRY OPERATOR",
  "DCFA",
  "DD",
  "DIRECTOR COMMUNICATION",
  "DME",
  "DMM",
  "GRAPHIC DESIGNER",
  "IPRO",
  "JD",
  "MEDIA ADVISOR",
  "PA/DPR",
  "PRESS",
  "R&R",
  "SECRETARY",
  "SEN. ASSISTANT",
  "SEN. STENO",
  "SME",
  "SO",
  "STENO",
  "SUPDT.",
  "VIDEO EDITOR",
  "OTHER"
];

const ASSET_TYPES = [
  "Laptop",
  "Desktop Computer",
  "All-in-One PC",
  "APPLE IPAD",
  "APPLE MACBOOK",
  "APPLE IMAC",
  "Monitor",
  "UPS",
  "Keyboard",
  "Mouse",
  "Wi-Fi Router",
  "Official Mobile Phone",
  "Tablet",
  "Workstation PC",
  "Laser Printer",
  "Ink Tank Printer",
  "Multifunction Printer",
  "Document Scanner",
  "External HDD",
  "External SSD",
  "Pen Drive",
  "Webcam",
  "Biometric Attendance Device",
  "LED TV",
  "Projector",
  "DSLR Camera",
  "Mirrorless Camera",
  "Video Camera / Camcorder",
  "Camera Lens",
  "Camera Flash",
  "Camera Light / LED Video Light",
  "Tripod",
  "Gimbal Stabilizer",
  "Camera Other Accessories",
  "Microphone",
  "Wireless Microphone",
  "Speaker System",
  "Audio Recorder",
  "Live Video Switcher",
  "Streaming Device",
  "Capture Card",
  "Teleprompter",
  "Graphic Tablet",
  "External DVD Writer",
  "Other"
];

const WORKING_STATUS_OPTIONS = [
  "Working Properly",
  "Minor Issue",
  "Major Issue",
  "Not Working"
];

const ISSUED_BY_OPTIONS = [
  "DIPR",
  "PUNMEDIA",
  "Other"
];

const CURRENT_LOCATION_OPTIONS = [
  "Head Office",
  "District Office",
  "Residence (WFH/Official Use)",
  "Other"
];

const emptyAsset = () => ({
  id: Date.now() + Math.random(),
  category: "",
  quantity: 1,
  make: "",
  model: "",
  serial: "",
  status: "",
  issuedBy: "",
  location: "",
  accessories: "",
  remarks: "",
});

const STEPS = ["Employee Details", "Asset Details", "Review & Submit"];

// Deployed Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby9bnomU3BAOUI1-ryTMKBKxSJJTe0e8ovvdWrioH7R9b9uJlM-GZNTXSVgJPERkGJK8w/exec";

export default function ITAssetForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    employeeId: "",
    designation: "",
    customDesignation: "",
    branch: "",
    customBranch: "",
    district: "",
    phone: "",
  });
  const [assets, setAssets] = useState([emptyAsset()]);
  const [declared, setDeclared] = useState(false);
  const [errors, setErrors] = useState({});
  const [refId, setRefId] = useState("");

  const updateEmployee = (k, v) => setEmployee(p => ({ ...p, [k]: v }));

  const updateAsset = (id, k, v) =>
    setAssets(p => p.map(a => (a.id === id ? { ...a, [k]: v } : a)));

  const addAsset = () => setAssets(p => [...p, emptyAsset()]);

  const removeAsset = (id) =>
    setAssets(p => p.length > 1 ? p.filter(a => a.id !== id) : p);

  const getFinalDesignation = () => {
    return employee.designation === "OTHER" ? employee.customDesignation.toUpperCase() : employee.designation;
  };

  const getFinalBranch = () => {
    return employee.branch === "OTHER" ? employee.customBranch.toUpperCase() : employee.branch;
  };

  const validateStep0 = () => {
    const e = {};
    if (!employee.name.trim()) e.name = "Full Name is required";
    
    if (!employee.email.trim()) {
      e.email = "Email ID is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
      e.email = "Invalid email format";
    }

    if (!employee.designation) {
      e.designation = "Designation selection is required";
    } else if (employee.designation === "OTHER" && !employee.customDesignation.trim()) {
      e.customDesignation = "Please specify your Designation";
    }

    if (!employee.branch) {
      e.branch = "Branch / Section selection is required";
    } else if (employee.branch === "OTHER" && !employee.customBranch.trim()) {
      e.customBranch = "Please specify your Branch / Section";
    }

    if (!employee.district) e.district = "District Office selection is required";
    
    if (!employee.phone.trim()) {
      e.phone = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(employee.phone.trim().replace(/[-+\s]/g, ""))) {
      e.phone = "Must be a valid 10-digit mobile number";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e = {};
    assets.forEach((a, i) => {
      if (!a.category) e[`cat_${i}`] = "Required";
      if (!a.quantity || a.quantity < 1) e[`qty_${i}`] = "Required (>= 1)";
      if (!a.make.trim()) e[`make_${i}`] = "Required";
      if (!a.model.trim()) e[`model_${i}`] = "Required";
      if (!a.serial.trim()) e[`serial_${i}`] = "Required";
      if (!a.status) e[`status_${i}`] = "Required";
      if (!a.issuedBy) e[`issuedBy_${i}`] = "Required";
      if (!a.location) e[`location_${i}`] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    setErrors({});
    setStep(s => s + 1);
  };

  const back = () => { setErrors({}); setStep(s => s - 1); };

  const handleSubmit = () => {
    if (!declared) { setErrors({ declared: "You must confirm the official declaration statement before submitting." }); return; }
    
    setSubmitting(true);
    const uniqueRef = `DPR/IT/${new Date().getFullYear()}/${Math.floor(100000 + Math.random() * 900000)}`;
    setRefId(uniqueRef);

    const payload = {
      employee: {
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        designation: getFinalDesignation(),
        branch: getFinalBranch(),
        district: employee.district,
        phone: employee.phone
      },
      assets,
      refId: uniqueRef
    };

    if (GOOGLE_SCRIPT_URL === "") {
      setTimeout(() => {
        setSubmitting(false);
        setSubmitted(true);
      }, 1000);
      return;
    }

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    })
    .then(() => {
      setSubmitting(false);
      setSubmitted(true);
    })
    .catch(err => {
      setSubmitting(false);
      alert("Submission failed. Please check your network connection and try again.");
      console.error("Submission error:", err);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ 
      employee: {
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        designation: getFinalDesignation(),
        branch: getFinalBranch(),
        district: employee.district,
        phone: employee.phone
      }, 
      assets, 
      refId, 
      submittedAt: new Date().toISOString() 
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `IT_Asset_Receipt_${refId.replace(/\//g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const FieldError = ({ name }) =>
    errors[name] ? <span className="err-msg"><AlertTriangle size={13} style={{ marginRight: 4, display: 'inline' }} />{errors[name]}</span> : null;

  if (submitted) {
    return (
      <div className="wrap">
        <div className="success-container printable-area">
          <div className="success-card">
            <div className="success-icon-wrapper">
              <CheckCircle className="success-icon" size={48} />
            </div>
            <div className="print-header-only">
              <h3>GOVERNMENT OF PUNJAB</h3>
              <h4>Department of Information & Public Relations, Punjab</h4>
              <p>IT Asset Inventory Submission Receipt</p>
              <hr />
            </div>
            <h2>Submission Acknowledged</h2>
            <p className="success-subtitle">The IT asset inventory data has been successfully verified and logged into the central database.</p>
            
            <div className="ref-box">
              <span>OFFICIAL REFERENCE NUMBER</span>
              <strong>{refId}</strong>
            </div>

            <div className="receipt-details">
              <div className="receipt-section">
                <h4>Employee Profile</h4>
                <div className="receipt-grid">
                  <div><span>Name:</span> <strong>{employee.name}</strong></div>
                  <div><span>Email ID:</span> <strong>{employee.email}</strong></div>
                  {employee.employeeId && <div><span>Employee ID / ID CARD NO:</span> <strong>{employee.employeeId}</strong></div>}
                  <div><span>Designation:</span> <strong>{getFinalDesignation()}</strong></div>
                  <div><span>Branch / Section:</span> <strong>{getFinalBranch()}</strong></div>
                  <div><span>District Office:</span> <strong>{employee.district}</strong></div>
                  <div><span>Mobile:</span> <strong>{employee.phone}</strong></div>
                </div>
              </div>

              <div className="receipt-section">
                <h4>Assets Reported ({assets.length})</h4>
                <table className="receipt-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Asset Type</th>
                      <th>Qty</th>
                      <th>Make & Model</th>
                      <th>Serial Number</th>
                      <th>Status</th>
                      <th>Accessories</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((a, i) => (
                      <tr key={a.id}>
                        <td>{i + 1}</td>
                        <td className="semibold">{a.category}</td>
                        <td>{a.quantity}</td>
                        <td>{a.make} - {a.model}</td>
                        <td><code>{a.serial}</code></td>
                        <td>
                          <span className={`status-pill ${
                            a.status === "Working Properly" ? "green" : 
                            a.status === "Minor Issue" ? "yellow" : 
                            a.status === "Major Issue" ? "orange" : "red"
                          }`}>{a.status}</span>
                        </td>
                        <td>{a.accessories || "None"}</td>
                        <td>{a.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="note no-print">Please save or print this receipt for service records reference. A verification copy will also be archived by the IT Cell.</p>
            
            <div className="receipt-actions no-print">
              <button className="btn-action btn-print" onClick={handlePrint}>
                <Printer size={16} /> Print Receipt
              </button>
              <button className="btn-action btn-export" onClick={handleExportJSON}>
                <Download size={16} /> Export Receipt Data
              </button>
              <button className="btn-action btn-reset" onClick={() => { 
                setSubmitted(false); 
                setStep(0); 
                setEmployee({ name: "", email: "", employeeId: "", designation: "", customDesignation: "", branch: "", customBranch: "", district: "", phone: "" }); 
                setAssets([emptyAsset()]); 
                setDeclared(false); 
              }}>
                Submit Another Form
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      {/* Header */}
      <header className="hdr">
        <div className="header-container">
          <div className="emblem-container">
            <span className="emblem-icon">🏛</span>
          </div>
          <div className="hdr-text">
            <div className="dept">Department of Information & Public Relations, Punjab</div>
            <h1>IT Asset Inventory & Management</h1>
          </div>
        </div>
      </header>

      {/* Notice */}
      <div className="notice-container">
        <div className="notice-banner">
          <div className="notice-icon">⚠️</div>
          <div className="notice-text">
            <strong>Mandatory Directive:</strong> All officers and staff are required to submit accurate records of IT assets assigned to them.
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper-wrapper">
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={i} className={`step-item ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
              <div className="step-dot-container">
                <div className="step-dot">
                  {i < step ? <Check size={16} /> : i + 1}
                </div>
                <span className="step-label">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>
      </div>

      <main className="form-body">
        {/* STEP 0: Employee Details */}
        {step === 0 && (
          <section className="form-step-section">
            <div className="section-header">
              <User className="section-icon" />
              <h2>Section A — Employee Information</h2>
            </div>
            <p className="helper-text">Please provide official personnel details for inventory mapping.</p>
            
            <div className="grid-2">
              <div className="field">
                <label>Full Name <span className="req">*</span></label>
                <div className="input-with-icon">
                  <User className="input-icon" size={16} />
                  <input 
                    value={employee.name} 
                    onChange={e => updateEmployee("name", e.target.value)} 
                    placeholder="Enter name" 
                  />
                </div>
                <FieldError name="name" />
              </div>

              <div className="field">
                <label>Email ID <span className="req">*</span></label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={16} />
                  <input 
                    value={employee.email} 
                    onChange={e => updateEmployee("email", e.target.value)} 
                    placeholder="username@punjab.gov.in" 
                    type="email"
                  />
                </div>
                <FieldError name="email" />
              </div>

              <div className="field">
                <label>Employee ID / ID CARD NO <span className="opt">(Optional)</span></label>
                <div className="input-with-icon">
                  <Hash className="input-icon" size={16} />
                  <input 
                    value={employee.employeeId} 
                    onChange={e => updateEmployee("employeeId", e.target.value)} 
                    placeholder="Enter official ID if available" 
                  />
                </div>
              </div>

              <div className="field">
                <label>Designation <span className="req">*</span></label>
                <div className="input-with-icon">
                  <Briefcase className="input-icon" size={16} />
                  <select value={employee.designation} onChange={e => updateEmployee("designation", e.target.value)}>
                    <option value="">— Select Designation —</option>
                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <FieldError name="designation" />
              </div>

              {employee.designation === "OTHER" && (
                <div className="field">
                  <label>Specify Designation <span className="req">*</span></label>
                  <input 
                    value={employee.customDesignation} 
                    onChange={e => updateEmployee("customDesignation", e.target.value)} 
                    placeholder="Type your designation" 
                  />
                  <FieldError name="customDesignation" />
                </div>
              )}

              <div className="field">
                <label>Branch / Section <span className="req">*</span></label>
                <div className="input-with-icon">
                  <Layers className="input-icon" size={16} />
                  <select value={employee.branch} onChange={e => updateEmployee("branch", e.target.value)}>
                    <option value="">— Select Branch / Section —</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <FieldError name="branch" />
              </div>

              {employee.branch === "OTHER" && (
                <div className="field">
                  <label>Specify Branch / Section <span className="req">*</span></label>
                  <input 
                    value={employee.customBranch} 
                    onChange={e => updateEmployee("customBranch", e.target.value)} 
                    placeholder="Type your branch/section name" 
                  />
                  <FieldError name="customBranch" />
                </div>
              )}

              <div className="field">
                <label>District Office <span className="req">*</span></label>
                <div className="input-with-icon">
                  <MapPin className="input-icon" size={16} />
                  <select value={employee.district} onChange={e => updateEmployee("district", e.target.value)}>
                    <option value="">— Select Location —</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <FieldError name="district" />
              </div>

              <div className="field">
                <label>Mobile Number <span className="req">*</span></label>
                <div className="input-with-icon">
                  <Phone className="input-icon" size={16} />
                  <input 
                    value={employee.phone} 
                    onChange={e => updateEmployee("phone", e.target.value)} 
                    placeholder="Enter 10-digit mobile number" 
                    type="tel"
                  />
                </div>
                <FieldError name="phone" />
              </div>
            </div>
          </section>
        )}

        {/* STEP 1: Asset Details */}
        {step === 1 && (
          <section className="form-step-section animate-fade-in">
            <div className="section-header">
              <FileText className="section-icon" />
              <h2>Section B — IT Asset Allocation Records</h2>
            </div>
            <p className="helper-text font-accent">
              Declare each device in your custody. Use "+ Add Another Asset" to append multiple components.
            </p>

            {assets.map((asset, idx) => (
              <div className="asset-entry-card" key={asset.id}>
                <div className="asset-entry-card-header">
                  <span className="asset-number-tag">Hardware Unit #{idx + 1}</span>
                  {assets.length > 1 && (
                    <button className="btn-remove-asset" onClick={() => removeAsset(asset.id)}>
                      <Trash2 size={13} /> Remove Unit
                    </button>
                  )}
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Asset Type / Category <span className="req">*</span></label>
                    <select value={asset.category} onChange={e => updateAsset(asset.id, "category", e.target.value)}>
                      <option value="">— Select Category —</option>
                      {ASSET_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors[`cat_${idx}`] && <span className="err-msg"><AlertTriangle size={12} /> {errors[`cat_${idx}`]}</span>}
                  </div>

                  <div className="field">
                    <label>Quantity <span className="req">*</span></label>
                    <input 
                      value={asset.quantity} 
                      onChange={e => updateAsset(asset.id, "quantity", parseInt(e.target.value) || 1)} 
                      type="number" 
                      min="1"
                    />
                    {errors[`qty_${idx}`] && <span className="err-msg"><AlertTriangle size={12} /> {errors[`qty_${idx}`]}</span>}
                  </div>

                  <div className="field">
                    <label>Brand / Make <span className="req">*</span></label>
                    <input 
                      value={asset.make} 
                      onChange={e => updateAsset(asset.id, "make", e.target.value)} 
                      placeholder="e.g. Dell, HP, Lenovo, Canon, Logitech" 
                    />
                    {errors[`make_${idx}`] && <span className="err-msg"><AlertTriangle size={12} /> {errors[`make_${idx}`]}</span>}
                  </div>

                  <div className="field">
                    <label>Model Number / Name <span className="req">*</span></label>
                    <input 
                      value={asset.model} 
                      onChange={e => updateAsset(asset.id, "model", e.target.value)} 
                      placeholder="e.g. Latitude 3420, L380, G3010" 
                    />
                    {errors[`model_${idx}`] && <span className="err-msg"><AlertTriangle size={12} /> {errors[`model_${idx}`]}</span>}
                  </div>

                  <div className="field">
                    <label>Serial Number <span className="req">*</span></label>
                    <input 
                      value={asset.serial} 
                      onChange={e => updateAsset(asset.id, "serial", e.target.value)} 
                      placeholder="Serial number or Service Tag" 
                    />
                    {errors[`serial_${idx}`] && <span className="err-msg"><AlertTriangle size={12} /> {errors[`serial_${idx}`]}</span>}
                  </div>

                  <div className="field">
                    <label>Working Status <span className="req">*</span></label>
                    <select value={asset.status} onChange={e => updateAsset(asset.id, "status", e.target.value)}>
                      <option value="">— Select Working Status —</option>
                      {WORKING_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors[`status_${idx}`] && <span className="err-msg"><AlertTriangle size={12} /> {errors[`status_${idx}`]}</span>}
                  </div>

                  <div className="field">
                    <label>Issued By <span className="req">*</span></label>
                    <select value={asset.issuedBy} onChange={e => updateAsset(asset.id, "issuedBy", e.target.value)}>
                      <option value="">— Select Issuer —</option>
                      {ISSUED_BY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors[`issuedBy_${idx}`] && <span className="err-msg"><AlertTriangle size={12} /> {errors[`issuedBy_${idx}`]}</span>}
                  </div>

                  <div className="field">
                    <label>Current Location <span className="req">*</span></label>
                    <select value={asset.location} onChange={e => updateAsset(asset.id, "location", e.target.value)}>
                      <option value="">— Select Current Location —</option>
                      {CURRENT_LOCATION_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    {errors[`location_${idx}`] && <span className="err-msg"><AlertTriangle size={12} /> {errors[`location_${idx}`]}</span>}
                  </div>

                  <div className="field full">
                    <label>Accessories <span className="opt">(if any, e.g. Charger, Adapter, Bag, Cable)</span></label>
                    <input 
                      value={asset.accessories} 
                      onChange={e => updateAsset(asset.id, "accessories", e.target.value)} 
                      placeholder="List any accessories currently issued with this device" 
                    />
                  </div>

                  <div className="field full">
                    <label>Remarks / Issue Details <span className="opt">(Optional)</span></label>
                    <textarea 
                      value={asset.remarks} 
                      onChange={e => updateAsset(asset.id, "remarks", e.target.value)} 
                      placeholder="Mention any physical damages, battery replacement needs, missing chargers or parts here." 
                      rows={2} 
                    />
                  </div>
                </div>
              </div>
            ))}

            <button className="btn-add-unit" onClick={addAsset}>
              <Plus size={16} /> Add Another IT Asset Allocation
            </button>
          </section>
        )}

        {/* STEP 2: Review & Declaration */}
        {step === 2 && (
          <section className="form-step-section animate-fade-in">
            <div className="section-header">
              <ShieldCheck className="section-icon" />
              <h2>Section C — Verification & Declaration</h2>
            </div>
            <p className="helper-text text-danger">Please double-check all information before submitting to the department register.</p>

            <div className="review-block">
              <h3>Employee Record Summary</h3>
              <div className="review-grid">
                <div><span>Full Name:</span> <strong>{employee.name}</strong></div>
                <div><span>Email ID:</span> <strong>{employee.email}</strong></div>
                <div><span>Employee ID / ID CARD NO:</span> <strong>{employee.employeeId || "Not Provided"}</strong></div>
                <div><span>Designation:</span> <strong>{getFinalDesignation()}</strong></div>
                <div><span>Branch / Section:</span> <strong>{getFinalBranch()}</strong></div>
                <div><span>District Office:</span> <strong>{employee.district}</strong></div>
                <div><span>Contact Number:</span> <strong>{employee.phone}</strong></div>
              </div>
            </div>

            <div className="review-block">
              <h3>Reported Hardware Inventory ({assets.length} items)</h3>
              {assets.map((a, i) => (
                <div className="review-asset-item" key={a.id}>
                  <div className="review-asset-item-header">
                    <strong>#{i + 1} — {a.category}</strong>
                    <span className={`status-pill ${
                      a.status === "Working Properly" ? "green" : 
                      a.status === "Minor Issue" ? "yellow" : 
                      a.status === "Major Issue" ? "orange" : "red"
                    }`}>{a.status}</span>
                  </div>
                  <div className="review-asset-item-body">
                    <div className="meta-item"><span>Brand/Make:</span> <strong>{a.make}</strong></div>
                    <div className="meta-item"><span>Model:</span> <strong>{a.model}</strong></div>
                    <div className="meta-item"><span>Qty:</span> <strong>{a.quantity}</strong></div>
                    <div className="meta-item"><span>Serial:</span> <code>{a.serial}</code></div>
                    <div className="meta-item"><span>Accessories:</span> <strong>{a.accessories || "None"}</strong></div>
                    <div className="meta-item"><span>Issued By:</span> <strong>{a.issuedBy}</strong></div>
                    <div className="meta-item"><span>Current Location:</span> <strong>{a.location}</strong></div>
                  </div>
                  {a.remarks && (
                    <div className="review-asset-remarks">
                      <span>Remarks:</span> {a.remarks}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Declaration Box */}
            <div className="declaration-container">
              <h3>Official Affirmation</h3>
              <p>
                I, <strong>{employee.name || "________________"}</strong>, currently serving as <strong>{getFinalDesignation() || "________________"}</strong> in the <strong>{getFinalBranch() || "________________"}</strong> branch, do hereby solemnly declare and verify that the IT asset(s) details supplied above reflect the entire list of public computing hardware and accessories currently allocated in my name or under my direct physical custody. I confirm that all listed devices have been correctly specified by their make, model, and serial numbers, and that any damage or operational failure has been reported in the remarks block.
              </p>
              
              <label className="checkbox-agreement">
                <input 
                  type="checkbox" 
                  checked={declared} 
                  onChange={e => setDeclared(e.target.checked)} 
                />
                <span className="checkbox-custom-label">
                  I solemnly verify the accuracy of the IT asset inventory data and authorize its addition to the departmental records.
                </span>
              </label>
              {errors.declared && <span className="err-msg block"><AlertTriangle size={12} /> {errors.declared}</span>}
            </div>
          </section>
        )}

        {/* Navigation Action Buttons */}
        <div className="navigation-controls">
          {step > 0 && (
            <button className="btn-control btn-back" onClick={back}>
              ← Back
            </button>
          )}
          {step < 2 ? (
            <button className="btn-control btn-next" onClick={next}>
              Continue →
            </button>
          ) : (
            <button 
              className="btn-control btn-submit-declaration" 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting Data..." : "Submit IT Asset Declaration"}
            </button>
          )}
        </div>
      </main>

      <footer className="footer-credits">
        <p>Department of Information & Public Relations (DIPR), Government of Punjab</p>
      </footer>
    </div>
  );
}
