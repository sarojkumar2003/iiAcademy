import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../images/logo.png';
import signature from '../images/signature.png';
// CertificateVerifier
// Single-file React component (Tailwind CSS assumed available in the project)

const SHEET_ID = '1v4pnBFtZzczrIrhVBR4LmJC15ymdA7EsUpbsHj5vASU'; // provided by you
const SHEET_TAB = 'Sheet1';

function parseGvizResponse(text) {
    const jsonText = text
        .replace(/^[^\(]*\(/, '')
        .replace(/\);?\s*$/, '');
    return JSON.parse(jsonText);
}

function normalizeRow(headerMap, row) {
    const obj = {};
    row.forEach((cell, idx) => {
        const key = headerMap[idx];
        if (!key) return;
        const value = cell && typeof cell === 'object' && 'v' in cell ? cell.v : cell;
        obj[key] = value ?? '';
    });
    return obj;
}

function formatDate(dateVal) {
    if (!dateVal) return '-';

    let date;
    // Handle Google Sheets date format (Date(2025,0,5)) or regular date strings
    if (typeof dateVal === 'string' && dateVal.startsWith('Date(')) {
        const match = dateVal.match(/Date\((\d+),(\d+),(\d+)\)/);
        if (match) {
            date = new Date(match[1], match[2], match[3]);
        }
    } else {
        date = new Date(dateVal);
    }

    if (isNaN(date.getTime())) return dateVal; // Return original if not a valid date

    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

// Inline Icon Components for a professional look without extra dependencies
const Icons = {
    Shield: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
    ),
    Search: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    User: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
    Calendar: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
    ),
    Award: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
    ),
    Loader: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
    ),
    CheckCircle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    ),
    AlertCircle: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
    ),
    Print: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>
    ),
    QrCode: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v.01" /></svg>
    )
};

export default function CertificateVerifier() {
    const [query, setQuery] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function loadSheet() {
            setLoading(true);
            setError(null);
            try {
                const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_TAB)}`;
                const res = await fetch(url);
                const text = await res.text();
                const json = parseGvizResponse(text);

                const cols = json.table.cols.map((c) => (c && c.label ? String(c.label).trim() : ''));
                const headerMap = {};
                cols.forEach((label, idx) => {
                    const key = String(label)
                        .toLowerCase()
                        .replace(/\s+/g, '_')
                        .replace(/[^a-z0-9_]/g, '')
                        .trim();
                    headerMap[idx] = key;
                });

                const rows = json.table.rows.map((r) => normalizeRow(headerMap, r.c || []));
                if (mounted) setData(rows);
            } catch (err) {
                console.error(err);
                if (mounted) setError('Database connection failed. Please ensure you have an active internet connection.');
            } finally {
                if (mounted) setLoading(false);
            }
        }
        loadSheet();
        return () => (mounted = false);
    }, []);

    const lookupMap = useMemo(() => {
        if (!data) return {};
        const map = {};
        data.forEach((row) => {
            const possibleKeys = ['certificate_number', 'certificatenumber', 'certificateid', 'id', 'certificate_no', 'certificate'];
            const key = possibleKeys.find((k) => k in row);
            const certVal = key ? String(row[key]).trim() : '';
            if (certVal) map[certVal.toLowerCase()] = row;
        });
        return map;
    }, [data]);

    function handleSearch(e) {
        e.preventDefault();
        setSearched(true);
        const q = query.trim().toLowerCase();
        if (!q) {
            setResult(null);
            return;
        }
        const r = lookupMap[q] || null;
        setResult(r);
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl text-white mb-4 shadow-lg shadow-indigo-200">
                        <Icons.Shield />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Certificate Verification</h1>
                    <p className="text-slate-600 max-w-md mx-auto">
                        Verify the authenticity of certificates issued by iiAcademy using your unique certificate number.
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-2 mb-8 border border-slate-100">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                <Icons.Search />
                            </div>
                            <input
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (searched) setSearched(false);
                                }}
                                placeholder="Enter certificate number (e.g. IIA-01012022)"
                                className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-lg"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? <Icons.Loader /> : 'Verify Now'}
                        </button>
                    </form>
                </div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-sm"
                        >
                            <Icons.AlertCircle />
                            {error}
                        </motion.div>
                    )}

                    {searched && !result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 p-6 bg-slate-100 rounded-3xl text-center border-2 border-dashed border-slate-200"
                        >
                            <div className="flex justify-center mb-3 text-slate-400">
                                <Icons.AlertCircle />
                            </div>
                            <h3 className="text-slate-900 font-semibold mb-1">No certificate found</h3>
                            <p className="text-slate-500 text-sm">Please double-check the certificate number and try again.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Result Card */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-indigo-100/50 overflow-hidden print:shadow-none print:border-none"
                        >
                            <div className="bg-indigo-600 px-8 py-4 flex items-center justify-between text-white">
                                <div className="flex items-center gap-2 font-medium">
                                    <Icons.CheckCircle />
                                    <span>Verified Authentic</span>
                                </div>
                                <span className="text-xs uppercase tracking-widest opacity-80 font-bold">Official Document</span>
                            </div>

                            <div className="p-8 sm:p-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                                    <DetailItem
                                        icon={<Icons.Shield />}
                                        label="Certificate Number"
                                        value={result.certificate_number ?? result.certificatenumber ?? result.id ?? '-'}
                                        highlight
                                    />
                                    <DetailItem
                                        icon={<Icons.Award />}
                                        label="Course/Achievement"
                                        value={result.certificate_name ?? result.certificatename ?? result.certificate ?? '-'}
                                    />
                                    <DetailItem
                                        icon={<Icons.User />}
                                        label="Recipient Name"
                                        value={result.user_name ?? result.username ?? result.name ?? '-'}
                                    />
                                    <DetailItem
                                        icon={<Icons.Calendar />}
                                        label="Date of Issuance"
                                        value={formatDate(result.date_of_issue ?? result.date ?? result.issuedate)}
                                    />
                                </div>

                                <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100 print:hidden">
                                    <button
                                        onClick={handlePrint}
                                        className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-colors"
                                    >
                                        <Icons.Print />
                                        Print & Download Certificate
                                    </button>
                                    <div className="flex-1 flex items-center justify-center px-6 py-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-sm font-medium">
                                        Verification Secured by iiAcademy
                                    </div>
                                </div>
                            </div>

                            {/* Premium Professional Certificate Section */}
                            <div className="hidden print:block fixed inset-0 z-[100] bg-white w-full h-full p-0 m-0 text-slate-900 leading-normal overflow-hidden">
                                <div className="certificate-container relative w-[297mm] h-[210mm] mx-auto bg-[#fdfdfd] p-0 flex flex-col items-center justify-between shadow-none overflow-hidden">

                                    {/* Traditional Ornate Border System - Inspired by the Template */}
                                    <div className="absolute inset-0 border-[24px] border-solid border-[#2b4c7e] flex items-center justify-center">
                                        <div className="absolute inset-[-4px] border-[2px] border-white/30 pointer-events-none"></div>
                                        {/* Repeating Pattern Overlay */}
                                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
                                    </div>

                                    <div className="absolute inset-[32px] border-[1px] border-[#2b4c7e]/20 bg-white shadow-inner pointer-events-none"></div>

                                    {/* Main Content Area */}
                                    <div className="relative z-10 w-full h-full p-16 flex flex-col items-center">

                                        {/* Certificate Metadata - Simple Professional Sidebar Look (Unbolded) */}
                                        <div className="absolute top-1/2 left-8 flex flex-row items-center gap-8 opacity-60 -rotate-90 origin-center whitespace-nowrap -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] text-slate-400 uppercase tracking-[0.15em] font-sans font-medium">Reg. No:</span>
                                                <span className="text-[11px] text-[#2d3748] font-sans tracking-wider">UDYAM-DL-08-0056206</span>
                                            </div>
                                            <div className="h-[1px] w-12 bg-slate-300"></div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] text-slate-400 uppercase tracking-[0.15em] font-sans font-medium">Document ID:</span>
                                                <span className="text-[11px] text-[#2d3748] font-sans tracking-wider">{result.certificate_number ?? result.certificatenumber ?? result.id ?? ''}</span>
                                            </div>
                                        </div>

                                        {/* Header: Logo + Tagline - Stacked Vertically */}
                                        <div className="flex flex-col items-center justify-center gap-1 mb-3 w-full">
                                            <img src={logo} alt="iiAcademy Logo" className="h-12 w-auto drop-shadow-sm" />
                                            <span className="text-[10px] text-slate-400 tracking-[0.3em] font-['Montserrat'] uppercase font-semibold">Empowering the Next Generation</span>
                                        </div>

                                        {/* Main Title Area */}
                                        <div className="text-center w-full mb-4">
                                            <h1 className="text-[3.2rem] font-['Playfair_Display'] font-bold text-[#1a365d] tracking-[0.1em] uppercase leading-none drop-shadow-sm">
                                                Certificate of Internship
                                            </h1>
                                            <p className="text-xl text-slate-400 mt-3 font-['Lora'] italic tracking-widest">This is to certify that</p>
                                        </div>

                                        {/* Recipient Name Section - Perfectly Centered */}
                                        <div className="w-full text-center mb-4">
                                            <div className="inline-block border-b-[2px] border-slate-200 pb-2 px-12">
                                                <h2 className="text-[2.8rem] font-['Playfair_Display'] font-bold text-[#1e293b] uppercase tracking-normal leading-tight">
                                                    {result.user_name ?? result.username ?? result.name ?? ''}
                                                </h2>
                                            </div>
                                        </div>

                                        {/* Body Content - Replicating Template Wording */}
                                        <div className="text-center max-w-[950px] mx-auto space-y-4 px-10">
                                            <p className="text-[1.3rem] leading-[2] text-slate-700 font-['Lora'] tracking-tight">
                                                student of <span className="font-bold border-b border-slate-300 px-1 inline text-[#1a365d]">{result.college_name ?? result.collegename ?? result.College_Name ?? result.CollegeName ?? '[ College Name ]'}</span>, has successfully completed an internship in the
                                            </p>
                                            <p className="text-[1.3rem] leading-[2] text-slate-700 font-['Lora'] tracking-tight -mt-6">
                                                field of <span className="font-bold border-b border-slate-300 px-1 inline text-[#1a365d]">{result.certificate_name ?? result.certificatename ?? result.certificate ?? '[ Field Name ]'}</span> from <span className="font-bold border-b border-slate-300 px-1 inline text-[#1a365d]">{formatDate(result.starting_Date ?? result.starting_date ?? result.start_date ?? '[ Date ]')}</span> to
                                                <span className="font-bold border-b border-slate-300 px-1 inline text-[#1a365d]">{formatDate(result.ending_Date ?? result.ending_date ?? result.end_date ?? result.date_of_issue ?? '[ Date ]')}</span> under guidance of
                                                {" "}
                                                <span className="font-bold border-b border-slate-300 px-1 inline text-[#1a365d]">IIAcademy</span>.
                                            </p>

                                            <p className="text-[1.25rem] text-slate-500 font-['Lora'] italic mt-4 tracking-wide">
                                                During the internship period, the candidate gained practical exposure to
                                                <span className="font-bold italic border-b border-slate-300 px-2 ml-1 inline text-[#1a365d]">
                                                    {result.skills_gained ?? result.skills ?? 'Backend Development, REST APIs, Database Management, and Git Version Control'}
                                                </span>.
                                            </p>
                                        </div>

                                        {/* Footer: Signatures & Info */}
                                        <div className="mt-auto w-full flex justify-between items-end px-24 pb-12">
                                            {/* Left: Signature */}
                                            <div className="flex flex-col items-center w-72">
                                                <img src={signature} alt="Authorized Signature" className="h-20 w-auto mb-[-22px] drop-shadow-sm" />
                                                <div className="w-52 border-t-[2px] border-dotted border-slate-800 mb-1"></div>
                                                <span className="text-[11px] text-slate-400 uppercase tracking-[0.25em] font-medium font-['Montserrat'] mt-1">auth. organ</span>
                                            </div>

                                            {/* Right: Info */}
                                            <div className="flex flex-col items-center w-72">
                                                <span className="text-xl italic text-[#1e293b] font-['Montserrat'] mb-1">
                                                    {result.certificate_number ?? result.certificatenumber ?? result.certificateid ?? result.id ?? result.certificate_no ?? result.certificate ?? ''}
                                                </span>
                                                <div className="w-52 border-t-[2px] border-dotted border-slate-800 mb-1"></div>
                                                <span className="text-[11px] text-slate-400 uppercase tracking-[0.25em] font-medium font-['Montserrat'] mt-1">Issued: {formatDate(result.date_of_issue ?? result.date ?? result.issuedate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <style>{`
                                    @page {
                                        size: landscape;
                                        margin: 0;
                                    }
                                    @media print {
                                        html, body {
                                            height: 100vh;
                                            margin: 0 !important;
                                            padding: 0 !important;
                                            overflow: hidden;
                                            -webkit-print-color-adjust: exact;
                                            print-color-adjust: exact;
                                        }
                                        body * {
                                            visibility: hidden;
                                        }
                                        .print\\:block, .print\\:block * {
                                            visibility: visible;
                                        }
                                        .print\\:block {
                                            position: fixed;
                                            left: 0;
                                            top: 0;
                                            width: 100vw;
                                            height: 100vh;
                                            display: flex !important;
                                            align-items: center;
                                            justify-content: center;
                                            background: white;
                                        }
                                    }
                                `}</style>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Important Notes */}
                <div className="mt-12 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px flex-1 bg-slate-200"></div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Verification Guidelines</h4>
                        <div className="h-px flex-1 bg-slate-200"></div>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            "Enter the exact number case-sensitively",
                            "Include all symbols and hyphens",
                            "Valid for certificates issued after 2023",
                            "Contact support for help"
                        ].map((note, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-500 text-sm">
                                <div className="mt-1.5 h-1 w-1 rounded-full bg-indigo-400 shrink-0"></div>
                                {note}
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div >
        </div >
    );
}

function DetailItem({ icon, label, value, highlight = false }) {
    return (
        <div className="group">
            <div className="flex items-center gap-2 mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                <span className="scale-90 group-hover:scale-100 transition-transform">{icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
            </div>
            <div className={`text-lg font-semibold ${highlight ? 'text-indigo-600' : 'text-slate-900'}`}>
                {value}
            </div>
        </div>
    );
}
