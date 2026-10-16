import React, { useEffect, useState } from 'react';
import { api } from '../../api/client.js';
import { FileText, Check, X, Shield, Eye } from 'lucide-react';

export const AdminApplicationsView: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, [statusFilter]);

  const loadApps = async () => {
    const res = await api.members.getApplications({ status: statusFilter || undefined });
    if (res.success && res.data) {
      setApplications(res.data);
    }
    setLoading(false);
  };

  const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedApp) return;
    await api.members.reviewApplication(selectedApp.id, status, reviewNotes || `Processed as ${status}`);
    setSelectedApp(null);
    setReviewNotes('');
    loadApps();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Member Applications & Intake Pipeline</h1>
          <p className="page-subtitle">
            Review incoming aspirants from Google Forms, Google Sheets sync, and direct portal intake.
          </p>
        </div>

        <select
          className="form-select"
          style={{ width: '180px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Applications</option>
          <option value="SUBMITTED">Pending Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Declined</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>Email / Contact</th>
              <th>Profession / Company</th>
              <th>City</th>
              <th>Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td style={{ fontWeight: 600, color: '#fff' }}>{app.fullName}</td>
                <td>
                  <div>{app.email}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.phone || 'No phone'}</div>
                </td>
                <td>
                  <div>{app.occupation || 'Not stated'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.company}</div>
                </td>
                <td>{app.city || 'United States'}</td>
                <td>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
                    {app.source}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      app.status === 'APPROVED'
                        ? 'badge-success'
                        : app.status === 'REJECTED'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-gold"
                    onClick={() => {
                      setSelectedApp(app);
                      setReviewNotes(app.reviewNotes || '');
                    }}
                  >
                    <Eye size={13} /> Inspect & Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal with 38-Question Dossier Inspector */}
      {selectedApp && (() => {
        let dossier: any = null;
        try {
          if (selectedApp.responsesJson) {
            dossier = typeof selectedApp.responsesJson === 'string' 
              ? JSON.parse(selectedApp.responsesJson) 
              : selectedApp.responsesJson;
          }
        } catch (e) {
          dossier = null;
        }

        return (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '880px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="modal-header">
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Sovereign Men’s Club • Readiness Dossier
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 800, margin: '2px 0 0 0' }}>
                    {selectedApp.fullName}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)} 
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ✕
                </button>
              </div>

              {/* Quick Info Ribbon */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '10px', 
                padding: '12px 16px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '10px', 
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px',
                fontSize: '0.8rem'
              }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Email</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedApp.email}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Phone</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedApp.phone || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Location</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedApp.city || 'Addis Ababa'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Role</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedApp.occupation || 'N/A'}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Status</div>
                  <span className={`badge ${selectedApp.status === 'APPROVED' ? 'badge-success' : selectedApp.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                    {selectedApp.status}
                  </span>
                </div>
              </div>

              {dossier ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Section 1 */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Section 1: Personal Information (Questions 1–9)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.82rem' }}>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Age:</strong> {dossier.section1_personal_info?.q2_age} years</div>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Gender:</strong> {dossier.section1_personal_info?.q3_gender}</div>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Telegram:</strong> <span style={{ color: '#38bdf8' }}>{dossier.section1_personal_info?.q6_telegram}</span></div>
                      <div><strong style={{ color: 'var(--text-muted)' }}>Referral Source:</strong> {dossier.section1_personal_info?.q9_referral_source}</div>
                    </div>
                    {dossier.section1_personal_info?.q8_work_studies_business && (
                      <div style={{ marginTop: '8px', fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Work / Studies details: </span>
                        <span>{dossier.section1_personal_info.q8_work_studies_business}</span>
                      </div>
                    )}
                  </div>

                  {/* Section 2 */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Section 2: Current Reality & Motivation (Questions 10–14)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Q10: Why do you want to join Sovereign Men’s Club?</div>
                        <div style={{ fontStyle: 'italic', color: 'var(--text-gold)', marginTop: '2px' }}>
                          "{dossier.section2_reality_and_motivation?.q10_why_join}"
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Q11: Biggest problem or weakness currently affecting life:</div>
                        <div style={{ color: '#f87171', marginTop: '2px' }}>
                          {dossier.section2_reality_and_motivation?.q11_biggest_problem_or_weakness}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Q12: Top Areas Needing Improvement:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                          {(dossier.section2_reality_and_motivation?.q12_improvement_areas || []).map((area: string) => (
                            <span key={area} className="badge" style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--text-gold)' }}>
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Q13: Fear if nothing changes (12 mos):</div>
                          <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{dossier.section2_reality_and_motivation?.q13_afraid_12_months_future}</div>
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Q14: Specific 1-year goal:</div>
                          <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>{dossier.section2_reality_and_motivation?.q14_specific_change_1_year}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Section 3: Responsibility & Evidence (Questions 15–19)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Q15 Blame Handling: </span>
                        <strong>{dossier.section3_responsibility_and_evidence?.q15_blame_handling_statement}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Q16 Difficult Commitment Finished: </span>
                        <span>{dossier.section3_responsibility_and_evidence?.q16_difficult_commitment_completed}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Q17 Past Repeated Failure: </span>
                        <span>{dossier.section3_responsibility_and_evidence?.q17_repeated_failure_and_cause}</span>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Q18 Most Common Excuse: </span>
                        <code style={{ color: '#fbbf24' }}>"{dossier.section3_responsibility_and_evidence?.q18_most_used_excuse}"</code>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Q19 Real Action in Last 30 Days: </span>
                        <span>{dossier.section3_responsibility_and_evidence?.q19_action_taken_last_30_days}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 4 & 5 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Section 4: Time & Action (Q20–24)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                        <div><span style={{ color: 'var(--text-muted)' }}>Hours/week:</span> <strong>{dossier.section4_time_and_participation?.q20_weekly_hours_investment}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Active participation:</span> {dossier.section4_time_and_participation?.q21_active_participation_vs_sidelines}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Low-motiv challenges:</span> {dossier.section4_time_and_participation?.q22_challenges_when_motivation_low}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Session attendance:</span> {dossier.section4_time_and_participation?.q23_session_attendance_consistency}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Honest failure reporting:</span> {dossier.section4_time_and_participation?.q24_honest_progress_failure_reporting}</div>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Section 5: Pressure Test (Q25–29)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                        <div><span style={{ color: 'var(--text-muted)' }}>When tired/busy:</span> {dossier.section5_pressure_test?.q25_handling_tired_discouraged}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Week 3 lost excitement:</span> {dossier.section5_pressure_test?.q26_response_three_weeks_in}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Current man state:</span> <strong>{dossier.section5_pressure_test?.q27_current_man_statement}</strong></div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Why place deserved:</span> {dossier.section5_pressure_test?.q28_why_deserve_place}</div>
                        <div><span style={{ color: 'var(--text-muted)' }}>Brotherhood contribution:</span> {dossier.section5_pressure_test?.q29_contribution_to_brotherhood}</div>
                      </div>
                    </div>
                  </div>

                  {/* Section 6 & 7 */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Section 6 & 7: Accountability & Final Covenant (Q30–38)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                      <div><span style={{ color: 'var(--text-muted)' }}>Squad Respect:</span> {dossier.section6_accountability_and_conduct?.q30_squad_participation_respect}</div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Direct Correction:</span> {dossier.section6_accountability_and_conduct?.q32_receive_direct_correction}</div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Final Readiness:</span> <strong style={{ color: '#22c55e' }}>{dossier.section6_accountability_and_conduct?.q35_final_readiness_declaration}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Affirmed Statement:</span> <code style={{ color: '#22c55e' }}>"{dossier.section7_final_agreement?.q37_affirmation_statement}"</code></div>
                      {dossier.section7_final_agreement?.q38_additional_notes !== 'None' && (
                        <div><span style={{ color: 'var(--text-muted)' }}>Notes:</span> {dossier.section7_final_agreement?.q38_additional_notes}</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Professional Background</div>
                    <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{selectedApp.occupation} at {selectedApp.company || 'Private'} ({selectedApp.city})</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reason To Seek Sovereign Brotherhood</div>
                    <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '6px', color: 'var(--text-gold)', fontStyle: 'italic', marginTop: '4px', lineHeight: '1.5' }}>
                      "{selectedApp.reasonToJoin}"
                    </div>
                  </div>
                </div>
              )}

              {/* Council Notes & Action */}
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Council Review Notes & Determination</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Record council findings or induction remarks..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '16px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
                  onClick={() => handleReview('REJECTED')}
                >
                  <X size={14} /> Decline Application
                </button>

                <button
                  className="btn btn-primary btn-gold-glow"
                  onClick={() => handleReview('APPROVED')}
                >
                  <Check size={14} /> Approve & Grant Sovereign Standing
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
