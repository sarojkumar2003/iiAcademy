// CertificateVerifierFull.jsx
import React, { useMemo, useState } from 'react';

/*
Single-file Certificate Verifier (multi-tab)
- Place this file in your React project and import it:
    import CertificateVerifierFull from './CertificateVerifierFull';
    <CertificateVerifierFull />

Notes:
- Make the Google Sheet "Anyone with the link can view" for client-side access.
- Update SHEET_ID default to your sheet id if desired.
- Recommended sheet header columns (first row): certificate_number, user_name, certificate_name, date_of_issue
  But the component accepts many header name variants (it normalizes headers).
*/

const SHEET_ID = '1v4pnBFtZzczrIrhVBR4LmJC15ymdA7EsUpbsHj5vASU'; // change if needed
const DEFAULT_TABS = ['Sheet1']; // default tab(s) to load

// helpers
function parseGvizResponse(text) {
  // Google returns: /*O_o*/\ngoogle.visualization.Query.setResponse({...});
  const jsonText = text.replace(/^[^\(]*\(/, '').replace(/\);?\s*$/, '');
  return JSON.parse(jsonText);
}

function normalizeHeader(label) {
  if (!label) return '';
  return String(label).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').trim();
}

function normalizeRow(headerMap, rowCells = []) {
  const obj = {};
  rowCells.forEach((cell, idx) => {
    const key = headerMap[idx];
    if (!key) return;
    const value = cell && typeof cell === 'object' && 'v' in cell ? cell.v : cell;
    obj[key] = value ?? '';
  });
  return obj;
}

async function fetchTabRows(sheetId, tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
    tabName
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  const json = parseGvizResponse(text);
  const cols = (json.table.cols || []).map((c) => (c && c.label ? String(c.label).trim() : ''));
  const headerMap = {};
  cols.forEach((label, idx) => {
    headerMap[idx] = normalizeHeader(label);
  });
  const rows = (json.table.rows || []).map((r) => normalizeRow(headerMap, r.c || []));
  return rows;
}

export default function CertificateVerifierFull({
  sheetId = SHEET_ID,
  defaultTabs = DEFAULT_TABS,
}) {
  const [tabsInput, setTabsInput] = useState(defaultTabs.join(','));
  const [loadedTabsInfo, setLoadedTabsInfo] = useState([]); // [{tab, count}|{tab,error}]
  const [data, setData] = useState([]); // aggregated rows with __sheet_tab marker
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [mode, setMode] = useState('certificate'); // 'certificate' or 'user'
  const [certificateQuery, setCertificateQuery] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [result, setResult] = useState(null); // object: single row OR {multiple: []} OR {notFound: true}

  // Load specified tabs (comma-separated)
  async function handleLoadTabs(e) {
    e && e.preventDefault();
    setResult(null);
    setLoadError(null);
    const requested = tabsInput.split(',').map((t) => t.trim()).filter(Boolean);
    if (requested.length === 0) {
      setLoadError('Please provide at least one sheet tab name.');
      return;
    }
    setLoading(true);
    setData([]);
    setLoadedTabsInfo([]);
    try {
      const aggregate = [];
      const info = [];
      for (const tab of requested) {
        try {
          const rows = await fetchTabRows(sheetId, tab);
          // mark origin tab
          rows.forEach((r) => (r.__sheet_tab = tab));
          aggregate.push(...rows);
          info.push({ tab, count: rows.length });
        } catch (err) {
          console.warn(`Tab ${tab} load error:`, err);
          info.push({ tab, error: String(err.message || err) });
        }
      }
      setData(aggregate);
      setLoadedTabsInfo(info);
    } catch (err) {
      console.error(err);
      setLoadError('Failed to load sheet tabs. Ensure the sheet is public or use a server proxy.');
    } finally {
      setLoading(false);
    }
  }

  // lookup maps computed from data
  const lookup = useMemo(() => {
    const byCert = {};
    const byEmail = {};
    const byName = {};
    data.forEach((row) => {
      const certKeys = ['certificate_number', 'certificatenumber', 'certificateid', 'certificate_no', 'id', 'certificate'];
      const emailKeys = ['email', 'e_mail', 'user_email'];
      const nameKeys = ['user_name', 'username', 'name', 'full_name'];

      const certVal = certKeys.map((k) => row[k] ?? '').find(Boolean) || '';
      const emailVal = emailKeys.map((k) => row[k] ?? '').find(Boolean) || '';
      const nameVal = nameKeys.map((k) => row[k] ?? '').find(Boolean) || '';

      if (certVal) byCert[String(certVal).trim().toLowerCase()] = row;
      if (emailVal) {
        const key = String(emailVal).trim().toLowerCase();
        byEmail[key] = byEmail[key] || [];
        byEmail[key].push(row);
      }
      if (nameVal) {
        const key = String(nameVal).trim().toLowerCase();
        byName[key] = byName[key] || [];
        byName[key].push(row);
      }
    });
    return { byCert, byEmail, byName };
  }, [data]);

  // Search handler
  function handleSearch(e) {
    e && e.preventDefault();
    setResult(null);
    if (mode === 'certificate') {
      const q = (certificateQuery || '').trim().toLowerCase();
      if (!q) return setResult({ notFound: true });
      const r = lookup.byCert[q] || null;
      if (!r) setResult({ notFound: true });
      else setResult(r);
    } else {
      const q = (userQuery || '').trim().toLowerCase();
      if (!q) return setResult({ notFound: true });
      // exact email match
      const byEmail = lookup.byEmail[q];
      if (byEmail && byEmail.length) return setResult({ multiple: byEmail });
      // exact name match
      const byName = lookup.byName[q];
      if (byName && byName.length) return setResult({ multiple: byName });
      // fuzzy substring name match
      const fuzzy = data.filter((r) => {
        const candidates = [r.user_name, r.username, r.name, r.full_name].filter(Boolean).map((s) => String(s).toLowerCase());
        return candidates.some((n) => n.includes(q));
      });
      if (fuzzy.length) setResult({ multiple: fuzzy });
      else setResult({ notFound: true });
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Certificate Verification</h1>

      <section className="mb-6">
        <form onSubmit={handleLoadTabs} className="flex gap-2">
          <input
            value={tabsInput}
            onChange={(e) => setTabsInput(e.target.value)}
            placeholder="Sheet tabs (comma-separated) — e.g. Sheet1, Graduates, 2024"
            className="flex-1 p-2 border rounded"
          />
          <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded">Load</button>
        </form>

        <div className="mt-3 text-sm text-gray-700">
          <div>Google Sheet ID: <code className="text-xs">{sheetId}</code></div>
          {loading && <div className="mt-2">Loading tabs…</div>}
          {loadError && <div className="mt-2 text-red-600">{loadError}</div>}

          {!loading && loadedTabsInfo.length > 0 && (
            <div className="mt-2">
              <strong>Tabs:</strong>
              <ul className="list-disc pl-5">
                {loadedTabsInfo.map((t) => (
                  <li key={t.tab}>
                    {t.tab}: {t.count != null ? `${t.count} records` : `error: ${t.error}`}
                  </li>
                ))}
              </ul>
              <div className="mt-1">Total records aggregated: {data.length}</div>
            </div>
          )}
        </div>
      </section>

      <section className="mb-6 p-4 border rounded">
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2">
            <input type="radio" name="mode" checked={mode === 'certificate'} onChange={() => setMode('certificate')} />
            <span>Search by Certificate Number</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="mode" checked={mode === 'user'} onChange={() => setMode('user')} />
            <span>Search by Email / Full Name</span>
          </label>
        </div>

        <form onSubmit={handleSearch}>
          {mode === 'certificate' ? (
            <div className="flex gap-2">
              <input
                value={certificateQuery}
                onChange={(e) => setCertificateQuery(e.target.value)}
                placeholder="Enter certificate number"
                className="flex-1 p-2 border rounded"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Verify</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Enter registered email or full name"
                className="flex-1 p-2 border rounded"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
            </div>
          )}
        </form>
      </section>

      <section>
        {result && result.notFound && (
          <div className="p-3 bg-red-50 border-l-4 border-red-400">No matching records found.</div>
        )}

        {result && result.multiple && (
          <div className="grid gap-3">
            <h2 className="text-lg font-medium">Matches ({result.multiple.length})</h2>
            {result.multiple.map((r, i) => (
              <div key={i} className="p-3 border rounded bg-white">
                <div className="text-sm text-gray-500">Source tab: {r.__sheet_tab || '-'}</div>
                <div className="mt-1 font-medium">{r.user_name || r.username || r.name || '-'}</div>
                <div className="text-sm">Certificate: {r.certificate_name || r.certificatename || r.certificate || '-'}</div>
                <div className="text-sm">Certificate no: {r.certificate_number || r.certificatenumber || r.id || '-'}</div>
                <div className="text-sm">Issue date: {r.date_of_issue || r.date || r.issuedate || '-'}</div>
              </div>
            ))}
          </div>
        )}

        {result && !result.notFound && !result.multiple && (
          <div className="p-6 border rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-medium mb-2">Certificate details</h2>
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
              <div>
                <dt className="text-xs text-gray-500">Source tab</dt>
                <dd className="font-medium">{result.__sheet_tab || '-'}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <a
                href={`https://docs.google.com/spreadsheets/d/${sheetId}/edit`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline"
              >
                Open sheet (admin)
              </a>
            </div>
          </div>
        )}
      </section>

      <footer className="mt-8 text-xs text-gray-500">
        <p>Notes:</p>
        <ul className="list-disc pl-5">
          <li>This client-side approach requires the Google Sheet to be viewable by anyone with the link.</li>
          <li>
            For private sheets or to hide your sheet ID, move loading to a server that uses the Google Sheets API
            (service account or API key) and expose a secure endpoint the client calls.
          </li>
          <li>Recommended column names: <code>certificate_number, user_name, certificate_name, date_of_issue</code> (first row as header).</li>
        </ul>
      </footer>
    </div>
  );
}
