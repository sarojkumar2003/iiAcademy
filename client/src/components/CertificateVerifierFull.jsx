import React, { useEffect, useMemo, useState } from 'react';

// CertificateVerifier
// Single-file React component (Tailwind CSS assumed available in the project)
// Usage: import CertificateVerifier from './CertificateVerifier';
// Then <CertificateVerifier /> in your app.

// IMPORTANT: Make your Google Sheet visible to "Anyone with the link can view".
// By default this component looks for a sheet named "Sheet1" and expects the header
// row to contain these (case-insensitive) column names:
// certificate_number | user_name | certificate_name | date_of_issue
// If your sheet uses different column names or a different sheet tab name,
// update SHEET_ID and SHEET_TAB and/or mapping in `normalizeRow` below.

const SHEET_ID = '1v4pnBFtZzczrIrhVBR4LmJC15ymdA7EsUpbsHj5vASU'; // provided by you
const SHEET_TAB = 'Sheet1';

function parseGvizResponse(text) {
    // the Google gviz endpoint returns: "/*O_o*/\ngoogle.visualization.Query.setResponse({...});"
    const jsonText = text
        .replace(/^[^\(]*\(/, '')
        .replace(/\);?\s*$/, '');
    return JSON.parse(jsonText);
}

function normalizeRow(headerMap, row) {
    // headerMap maps colIndex -> normalizedKey
    const obj = {};
    row.forEach((cell, idx) => {
        const key = headerMap[idx];
        if (!key) return;
        // cell can be {v: 'value'} or null
        const value = cell && typeof cell === 'object' && 'v' in cell ? cell.v : cell;
        obj[key] = value ?? '';
    });
    return obj;
}

export default function CertificateVerifier() {
    const [query, setQuery] = useState('');
    const [data, setData] = useState(null); // array of objects
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    // Fetch the sheet once on mount
    useEffect(() => {
        let mounted = true;
        async function loadSheet() {
            setLoading(true);
            setError(null);
            try {
                const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
                    SHEET_TAB
                )}`;
                const res = await fetch(url);
                const text = await res.text();
                const json = parseGvizResponse(text);

                // the structure: json.table.cols (array of {label}), json.table.rows (array of {c: [...]})
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
                if (mounted) setError('Failed to load sheet. Make sure the sheet is published or visible to anyone with the link.');
            } finally {
                if (mounted) setLoading(false);
            }
        }
        loadSheet();
        return () => (mounted = false);
    }, []);

    // memoize lookup by certificate number for fast search
    const lookupMap = useMemo(() => {
        if (!data) return {};
        const map = {};
        data.forEach((row) => {
            // possible column names to try (after normalization)
            const possibleKeys = [
                'certificate_number',
                'certificatenumber',
                'certificateid',
                'id',
                'certificate_no',
                'certificate',
            ];
            const key = possibleKeys.find((k) => k in row);
            const certVal = key ? String(row[key]).trim() : '';
            if (certVal) map[certVal.toLowerCase()] = row;
        });
        return map;
    }, [data]);

    function handleSearch(e) {
        e.preventDefault();
        const q = query.trim().toLowerCase();
        if (!q) {
            setResult(null);
            return;
        }
        const r = lookupMap[q] || null;
        setResult(r);
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Certificate Verification</h1>

            <p className="mb-4 text-sm text-gray-600">
                Enter a certificate number to verifying your certificate.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter certificate number"
                    className="flex-1 p-3 border rounded shadow-sm"
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-slate-800 text-white hover:opacity-95"
                >
                    Verify
                </button>
            </form>

            {loading && (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">Loading sheet data...</div>
            )}

            {error && <div className="p-4 bg-red-50 border-l-4 border-red-400">{error}</div>}

            {/* {!loading && data && (
                <div className="mb-6 text-sm text-gray-700">Loaded {data.length} records from sheet.</div>
            )} */}

            {result === null && query && !loading && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400">Certificate not found.</div>
            )}

            {result && (
                <div className="p-6 border rounded-lg shadow-sm bg-white">
                    <h2 className="text-xl font-medium mb-2">Certificate Details</h2>
                    <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-gray-500">Certificate number</dt>
                            <dd className="font-medium">{result.certificate_number ?? result.certificatenumber ?? result.id ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Certificate name</dt>
                            <dd className="font-medium">{result.certificate_name ?? result.certificatename ?? result.certificate ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">User name</dt>
                            <dd className="font-medium">{result.user_name ?? result.username ?? result.name ?? '-'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-gray-500">Date of issue</dt>
                            <dd className="font-medium">{result.date_of_issue ?? result.date ?? result.issuedate ?? '-'}</dd>
                        </div>
                    </dl>

                    {/* <div className="mt-4 flex gap-2">
            <a
              href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline"
            >
              Open sheet (admin)
            </a>
          </div> */}
                </div>
            )}

            <div className="mt-8 text-xs text-gray-500">
                <p>Notes:</p>
                <ul className="list-disc pl-5">
                    <li>Enter your certificate number exactly as printed on your certificate.</li>
                    <li>If your certificate number contains letters or symbols, include them as well.</li>
                    <li>If the system shows “Certificate not found,” check the number again or contact the institute.</li>
                    <li>Ensure you have a stable internet connection while verifying.</li>
                    <li>Each certificate has a unique number — verify them one by one if you have multiple certificates.</li>
                </ul>
            </div>
        </div>
    );
}
