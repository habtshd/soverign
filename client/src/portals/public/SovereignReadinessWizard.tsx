import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Loader2, 
  Check, 
  User, 
  Compass, 
  Clock, 
  Target, 
  FileCheck, 
  Flame, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles
} from 'lucide-react';
import { api } from '../../api/client.js';

interface SovereignReadinessWizardProps {
  onSuccess: (credentials: { email: string; pass: string }) => void;
  onCancel: () => void;
}

const REQUIRED_STATEMENT = "I am ready to be honest, accept correction, and do the work.";

const IMPROVEMENT_AREAS = [
  'Discipline',
  'Career',
  'Business',
  'Money or finances',
  'Physical fitness',
  'Confidence',
  'Leadership',
  'Relationships',
  'Faith or spiritual life',
  'Purpose or direction',
  'Pornography or destructive sexual habits',
  'Social-media or phone addiction',
  'Procrastination',
  'Time management',
  'Anger or emotional control',
  'Social skills',
  'Responsibility',
  'Other',
];

const AGREEMENT_STATEMENTS = [
  'I understand that submitting this form does not guarantee acceptance.',
  'I understand that this is an active brotherhood, not only a Telegram discussion group.',
  'I will participate actively and make a genuine effort to keep my commitments.',
  'I will report honestly, including failures.',
  'I will respect members, leaders, and privacy.',
  'I will not share private club or squad information without permission.',
  'I will not use insulting, hateful, extremist, politically divisive, religiously divisive, or humiliating language in the group.',
  'I understand that serious or repeated violations may result in removal.',
  'The information I provided is accurate.',
];

export const SovereignReadinessWizard: React.FC<SovereignReadinessWizardProps> = ({ onSuccess, onCancel }) => {
  // Current section: 0 = Intro, 1..7 = Sections 1..7, 8 = Success celebration
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State - Section 1: Personal Information (Page 2/9)
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('Male');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [role, setRole] = useState('');
  const [roleOther, setRoleOther] = useState('');
  const [workDetails, setWorkDetails] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [referralOther, setReferralOther] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [membershipTier, setMembershipTier] = useState('GENERAL');

  // Form State - Section 2: Reality and Motivation (Page 3/9)
  const [q10_whyJoin, setQ10_whyJoin] = useState('');
  const [q11_biggestWeakness, setQ11_biggestWeakness] = useState('');
  const [q12_improvementAreas, setQ12_improvementAreas] = useState<string[]>([]);
  const [q12_otherText, setQ12_otherText] = useState('');
  const [q13_afraid12Months, setQ13_afraid12Months] = useState('');
  const [q14_specificChange1Year, setQ14_specificChange1Year] = useState('');

  // Form State - Section 3: Responsibility and Evidence (Page 4/9)
  const [q15_blameHandling, setQ15_blameHandling] = useState('');
  const [q16_difficultCommitment, setQ16_difficultCommitment] = useState('');
  const [q17_repeatedFailure, setQ17_repeatedFailure] = useState('');
  const [q18_mostUsedExcuse, setQ18_mostUsedExcuse] = useState('');
  const [q19_last30DaysAction, setQ19_last30DaysAction] = useState('');

  // Form State - Section 4: Time and Participation (Page 5/9)
  const [q20_weeklyHours, setQ20_weeklyHours] = useState('');
  const [q21_activeParticipation, setQ21_activeParticipation] = useState('');
  const [q22_completeChallengesLowMotiv, setQ22_completeChallengesLowMotiv] = useState('');
  const [q23_attendScheduledSessions, setQ23_attendScheduledSessions] = useState('');
  const [q24_reportProgressHonestFailures, setQ24_reportProgressHonestFailures] = useState('');

  // Form State - Section 5: Pressure Test (Page 6/9)
  const [q25_busyTiredResponse, setQ25_busyTiredResponse] = useState('');
  const [q26_threeWeeksPassed, setQ26_threeWeeksPassed] = useState('');
  const [q27_currentManDescription, setQ27_currentManDescription] = useState('');
  const [q28_whyGivePlace, setQ28_whyGivePlace] = useState('');
  const [q29_contributionToBrotherhood, setQ29_contributionToBrotherhood] = useState('');

  // Form State - Section 6: Accountability, Conduct & Readiness (Page 7/8 of 9)
  const [q30_squadRespect, setQ30_squadRespect] = useState('');
  const [q31_confidentiality, setQ31_confidentiality] = useState('');
  const [q32_directCorrection, setQ32_directCorrection] = useState('');
  const [q33_holdAccountableWithoutInsult, setQ33_holdAccountableWithoutInsult] = useState('');
  const [q34_removalPolicyAwareness, setQ34_removalPolicyAwareness] = useState('');
  const [q35_finalReadinessChoice, setQ35_finalReadinessChoice] = useState('');

  // Form State - Section 7: Final Agreement (Page 9/9)
  const [agreementsChecked, setAgreementsChecked] = useState<Record<number, boolean>>({});
  const [q37_typedStatement, setQ37_typedStatement] = useState('');
  const [q38_additionalNotes, setQ38_additionalNotes] = useState('');

  // Improvement area toggling (limit to max 3)
  const handleToggleArea = (area: string) => {
    if (q12_improvementAreas.includes(area)) {
      setQ12_improvementAreas(q12_improvementAreas.filter((a) => a !== area));
    } else {
      if (q12_improvementAreas.length >= 3) {
        setErrorMsg('You may select a maximum of 3 areas needing improvement.');
        return;
      }
      setErrorMsg(null);
      setQ12_improvementAreas([...q12_improvementAreas, area]);
    }
  };

  // Toggle single agreement checkbox
  const handleToggleAgreement = (index: number) => {
    setAgreementsChecked((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Select all 9 agreements
  const handleSelectAllAgreements = () => {
    const all: Record<number, boolean> = {};
    AGREEMENT_STATEMENTS.forEach((_, idx) => {
      all[idx] = true;
    });
    setAgreementsChecked(all);
  };

  // Validation per step
  const validateCurrentStep = (): boolean => {
    setErrorMsg(null);

    if (currentStep === 1) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name (Question 1).');
        return false;
      }
      if (!age.trim() || isNaN(Number(age.trim())) || Number(age.trim()) < 16) {
        setErrorMsg('Please enter a valid age in years (Question 2).');
        return false;
      }
      if (!gender) {
        setErrorMsg('Please select your gender (Question 3).');
        return false;
      }
      if (!location.trim()) {
        setErrorMsg('Please provide where you currently live: city and country (Question 4).');
        return false;
      }
      if (!phone.trim()) {
        setErrorMsg('Please provide your phone number (Question 5).');
        return false;
      }
      if (!telegramUsername.trim() || !telegramUsername.includes('@')) {
        setErrorMsg('Please enter your Telegram username in @username format (Question 6).');
        return false;
      }
      if (!role) {
        setErrorMsg('Please select your current role (Question 7).');
        return false;
      }
      if (role === 'Other' && !roleOther.trim()) {
        setErrorMsg('Please specify your current role details (Question 7).');
        return false;
      }
      if (!referralSource) {
        setErrorMsg('Please select how you heard about Sovereign Men’s Club (Question 9).');
        return false;
      }
      if (referralSource === 'Other' && !referralOther.trim()) {
        setErrorMsg('Please describe how you heard about the club (Question 9).');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address for your member account.');
        return false;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Please create a secure password of at least 6 characters.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (!q10_whyJoin.trim()) {
        setErrorMsg('Please answer Question 10: Why do you want to join Sovereign Men’s Club?');
        return false;
      }
      if (!q11_biggestWeakness.trim()) {
        setErrorMsg('Please answer Question 11: What is the biggest problem or weakness currently affecting your life?');
        return false;
      }
      if (q12_improvementAreas.length === 0) {
        setErrorMsg('Please select at least 1 and no more than 3 areas of improvement (Question 12).');
        return false;
      }
      if (q12_improvementAreas.includes('Other') && !q12_otherText.trim()) {
        setErrorMsg('Please specify the "Other" area of improvement.');
        return false;
      }
      if (!q13_afraid12Months.trim()) {
        setErrorMsg('Please answer Question 13: What are you afraid your life will look like in 12 months?');
        return false;
      }
      if (!q14_specificChange1Year.trim()) {
        setErrorMsg('Please answer Question 14: What specific measurable change would you like to see in 1 year?');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!q15_blameHandling) {
        setErrorMsg('Please select a response for Question 15: Handling blame and responsibility.');
        return false;
      }
      if (!q16_difficultCommitment.trim()) {
        setErrorMsg('Please answer Question 16: Describe a difficult commitment completed after motivation disappeared.');
        return false;
      }
      if (!q17_repeatedFailure.trim()) {
        setErrorMsg('Please answer Question 17: Describe something you repeatedly failed to complete and why.');
        return false;
      }
      if (!q18_mostUsedExcuse.trim()) {
        setErrorMsg('Please answer Question 18: What excuse do you use most often?');
        return false;
      }
      if (!q19_last30DaysAction.trim()) {
        setErrorMsg('Please answer Question 19: Real action taken during the last 30 days.');
        return false;
      }
    }

    if (currentStep === 4) {
      if (!q20_weeklyHours) {
        setErrorMsg('Please answer Question 20: Hours per week willing to invest.');
        return false;
      }
      if (!q21_activeParticipation) {
        setErrorMsg('Please answer Question 21: Will you participate actively rather than on the sidelines?');
        return false;
      }
      if (!q22_completeChallengesLowMotiv) {
        setErrorMsg('Please answer Question 22: Willing to complete assigned challenges when motivation is low?');
        return false;
      }
      if (!q23_attendScheduledSessions) {
        setErrorMsg('Please answer Question 23: Willing to attend scheduled sessions consistently?');
        return false;
      }
      if (!q24_reportProgressHonestFailures) {
        setErrorMsg('Please answer Question 24: Willing to report progress honestly, including failure days?');
        return false;
      }
    }

    if (currentStep === 5) {
      if (!q25_busyTiredResponse.trim()) {
        setErrorMsg('Please answer Question 25: What will you do when busy, tired, or discouraged?');
        return false;
      }
      if (!q26_threeWeeksPassed.trim()) {
        setErrorMsg('Please answer Question 26: 3 weeks passed, excitement gone, missed commitment — what will you do?');
        return false;
      }
      if (!q27_currentManDescription) {
        setErrorMsg('Please answer Question 27: Which statement describes the man you are right now?');
        return false;
      }
      if (!q28_whyGivePlace.trim()) {
        setErrorMsg('Please answer Question 28: Why should we give you a place in Sovereign Men’s Club?');
        return false;
      }
      if (!q29_contributionToBrotherhood.trim()) {
        setErrorMsg('Please answer Question 29: What can you contribute to the brotherhood?');
        return false;
      }
    }

    if (currentStep === 6) {
      if (!q30_squadRespect) {
        setErrorMsg('Please answer Question 30: Squad participation and respectful communication.');
        return false;
      }
      if (!q31_confidentiality) {
        setErrorMsg('Please answer Question 31: Protecting privacy and confidentiality.');
        return false;
      }
      if (!q32_directCorrection) {
        setErrorMsg('Please answer Question 32: Receiving direct correction.');
        return false;
      }
      if (!q33_holdAccountableWithoutInsult) {
        setErrorMsg('Please answer Question 33: Holding brothers accountable respectfully.');
        return false;
      }
      if (!q34_removalPolicyAwareness) {
        setErrorMsg('Please answer Question 34: Understanding removal policies for dishonorable conduct.');
        return false;
      }
      if (!q35_finalReadinessChoice) {
        setErrorMsg('Please answer Question 35: Are you honestly ready to join and participate?');
        return false;
      }
      if (q35_finalReadinessChoice.startsWith('NO')) {
        setErrorMsg('You selected that you are not ready to make this commitment at this time. We honor your honesty. Take the time you need before applying.');
        return false;
      }
    }

    if (currentStep === 7) {
      const allAgreed = AGREEMENT_STATEMENTS.every((_, idx) => !!agreementsChecked[idx]);
      if (!allAgreed) {
        setErrorMsg('You must check and agree to all 9 statements in the Applicant Agreement (Question 36).');
        return false;
      }

      const cleanTyped = q37_typedStatement.trim().replace(/\s+/g, ' ');
      const cleanReq = REQUIRED_STATEMENT.trim().replace(/\s+/g, ' ');
      if (cleanTyped.toLowerCase() !== cleanReq.toLowerCase()) {
        setErrorMsg('Question 37 must match the exact declaration: "I am ready to be honest, accept correction, and do the work."');
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmitFinal();
    }
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitFinal = async () => {
    if (!validateCurrentStep()) return;
    setSubmitting(true);
    setErrorMsg(null);

    // Build the comprehensive 38 questions dossier
    const responsesDossier = {
      section1_personal_info: {
        q1_full_name: fullName.trim(),
        q2_age: Number(age.trim()),
        q3_gender: gender,
        q4_living_location: location.trim(),
        q5_phone: phone.trim(),
        q6_telegram: telegramUsername.trim(),
        q7_role: role === 'Other' ? `Other: ${roleOther.trim()}` : role,
        q8_work_studies_business: workDetails.trim() || 'Not specified',
        q9_referral_source: referralSource === 'Other' ? `Other: ${referralOther.trim()}` : referralSource,
      },
      section2_reality_and_motivation: {
        q10_why_join: q10_whyJoin.trim(),
        q11_biggest_problem_or_weakness: q11_biggestWeakness.trim(),
        q12_improvement_areas: q12_improvementAreas.map(a => a === 'Other' ? `Other: ${q12_otherText.trim()}` : a),
        q13_afraid_12_months_future: q13_afraid12Months.trim(),
        q14_specific_change_1_year: q14_specificChange1Year.trim(),
      },
      section3_responsibility_and_evidence: {
        q15_blame_handling_statement: q15_blameHandling,
        q16_difficult_commitment_completed: q16_difficultCommitment.trim(),
        q17_repeated_failure_and_cause: q17_repeatedFailure.trim(),
        q18_most_used_excuse: q18_mostUsedExcuse.trim(),
        q19_action_taken_last_30_days: q19_last30DaysAction.trim(),
      },
      section4_time_and_participation: {
        q20_weekly_hours_investment: q20_weeklyHours,
        q21_active_participation_vs_sidelines: q21_activeParticipation,
        q22_challenges_when_motivation_low: q22_completeChallengesLowMotiv,
        q23_session_attendance_consistency: q23_attendScheduledSessions,
        q24_honest_progress_failure_reporting: q24_reportProgressHonestFailures,
      },
      section5_pressure_test: {
        q25_handling_tired_discouraged: q25_busyTiredResponse.trim(),
        q26_response_three_weeks_in: q26_threeWeeksPassed.trim(),
        q27_current_man_statement: q27_currentManDescription,
        q28_why_deserve_place: q28_whyGivePlace.trim(),
        q29_contribution_to_brotherhood: q29_contributionToBrotherhood.trim(),
      },
      section6_accountability_and_conduct: {
        q30_squad_participation_respect: q30_squadRespect,
        q31_confidentiality_protection: q31_confidentiality,
        q32_receive_direct_correction: q32_directCorrection,
        q33_hold_brothers_accountable_with_honor: q33_holdAccountableWithoutInsult,
        q34_removal_policy_acknowledgement: q34_removalPolicyAwareness,
        q35_final_readiness_declaration: q35_finalReadinessChoice,
      },
      section7_final_agreement: {
        q36_agreed_statements: AGREEMENT_STATEMENTS,
        q37_affirmation_statement: q37_typedStatement.trim(),
        q38_additional_notes: q38_additionalNotes.trim() || 'None',
      },
      metadata: {
        submittedAt: new Date().toISOString(),
        formVersion: '2026.1_AUTHENTIC_38Q',
        membershipTierTrack: membershipTier,
      }
    };

    try {
      const parts = fullName.trim().split(/\s+/);
      const fName = parts[0] || 'Brother';
      const lName = parts.slice(1).join(' ') || 'Sovereign';

      const res = await api.auth.register({
        email: email.trim().toLowerCase(),
        password,
        firstName: fName,
        lastName: lName,
        fullName: fullName.trim(),
        phone: phone.trim(),
        occupation: role === 'Other' ? roleOther.trim() : role,
        city: location.trim(),
        reasonToJoin: q10_whyJoin.trim(),
        telegramUsername: telegramUsername.trim(),
        membershipTypeCode: membershipTier,
        responses: responsesDossier,
      });

      if (res.success && res.data?.token) {
        localStorage.setItem('sovereign_token', res.data.token);
        onSuccess({ email: email.trim(), pass: password });
      } else {
        setErrorMsg(res.error || 'Failed to submit readiness application. Please check fields.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: 'Personal Info', desc: 'Questions 1–9' },
    { num: 2, title: 'Reality & Motive', desc: 'Questions 10–14' },
    { num: 3, title: 'Responsibility', desc: 'Questions 15–19' },
    { num: 4, title: 'Time & Action', desc: 'Questions 20–24' },
    { num: 5, title: 'Pressure Test', desc: 'Questions 25–29' },
    { num: 6, title: 'Accountability', desc: 'Questions 30–35' },
    { num: 7, title: 'Final Covenant', desc: 'Questions 36–38' },
  ];

  return (
    <div className="sovereign-wizard-wrapper">
      {/* Top Banner / Progress Indicator */}
      {currentStep > 0 && (
        <div className="wizard-progress-header">
          <div className="wizard-stepper-row">
            {stepsList.map((step) => {
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div 
                  key={step.num}
                  className={`wizard-step-node ${isCurrent ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                >
                  <div className="wizard-node-circle">
                    {isPast ? <Check size={12} strokeWidth={3} /> : step.num}
                  </div>
                  <div className="wizard-node-meta">
                    <span className="wizard-node-title">{step.title}</span>
                    <span className="wizard-node-desc">{step.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="wizard-bar-track">
            <div 
              className="wizard-bar-fill" 
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Alert Box */}
      {errorMsg && (
        <div className="wizard-error-banner">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SECTION 0: Welcome & Orientation */}
      {currentStep === 0 && (
        <div className="wizard-intro-card">
          <div className="wizard-intro-seal">
            <Shield size={36} className="text-gold" />
          </div>
          <h2 className="wizard-intro-title">
            Sovereign Men’s Club — Registration & Readiness Application
          </h2>
          <div className="wizard-intro-creed">
            <p>
              <strong>Sovereign Men’s Club</strong> is a brotherhood for men who want to grow in discipline, purpose, responsibility, competence, leadership, and service.
            </p>
            <p>
              This is <em>not a passive Telegram group</em>. Members are expected to participate, accept accountability, keep their word, support other men, and take real action.
            </p>
            <p>
              This application helps us understand who you are and whether you are genuinely ready to join. Answer honestly. Strong-looking answers are less valuable than truthful answers. Completing this form does not guarantee acceptance.
            </p>
          </div>

          <div className="wizard-pillars-grid">
            <div className="wizard-pillar-card">
              <Compass className="pillar-icon" size={24} />
              <h4>Discipline & Purpose</h4>
              <p>Uncompromising self-governance, daily standards, and rigorous personal mastery.</p>
            </div>
            <div className="wizard-pillar-card">
              <Shield className="pillar-icon" size={24} />
              <h4>Brotherhood & Accountability</h4>
              <p>Active squad check-ins, direct honest feedback, and mutual loyalty.</p>
            </div>
            <div className="wizard-pillar-card">
              <Flame className="pillar-icon" size={24} />
              <h4>Real Tangible Action</h4>
              <p>Physical vitality, financial competence, service, and leadership in life.</p>
            </div>
          </div>

          <div className="wizard-action-footer" style={{ marginTop: '28px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Back to Member Sign In
            </button>
            <button
              type="button"
              className="btn btn-primary btn-gold-glow"
              onClick={() => setCurrentStep(1)}
            >
              <span>Begin Readiness Application (38 Questions)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: Personal Information (Page 2 of 9) */}
      {currentStep === 1 && (
        <div className="wizard-step-section">
          <div className="wizard-section-heading">
            <span className="wizard-section-badge">Section 1 of 7 • Page 2 of 9</span>
            <h3 className="wizard-section-title">Personal Information</h3>
            <p className="wizard-section-subtitle">
              Please provide accurate information so we can identify and contact you.
            </p>
          </div>

          {/* Q1 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">1.</span> Full name <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Eyob Tadesse Haile"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Q2 & Q3 */}
          <div className="grid-2-col">
            <div className="wizard-question-block">
              <label className="wizard-q-label">
                <span className="q-number">2.</span> Age <span className="req">*</span>
              </label>
              <div className="q-help-text">Enter your age in years.</div>
              <input
                type="number"
                min="16"
                max="99"
                className="form-input"
                placeholder="e.g. 26"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="wizard-question-block">
              <label className="wizard-q-label">
                <span className="q-number">3.</span> Gender <span className="req">*</span>
              </label>
              <div className="q-help-text">Select your gender.</div>
              <div className="wizard-radio-group horizontal">
                {['Male', 'Female'].map((g) => (
                  <label 
                    key={g} 
                    className={`wizard-radio-card ${gender === g ? 'selected' : ''}`}
                    onClick={() => setGender(g as any)}
                  >
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === g}
                      onChange={() => setGender(g as any)}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Q4 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">4.</span> Where do you currently live? <span className="req">*</span>
            </label>
            <div className="q-help-text">Write your city and country.</div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Addis Ababa, Ethiopia"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Q5 & Q6 */}
          <div className="grid-2-col">
            <div className="wizard-question-block">
              <label className="wizard-q-label">
                <span className="q-number">5.</span> Phone number <span className="req">*</span>
              </label>
              <div className="q-help-text">Include country code if outside Ethiopia.</div>
              <input
                type="tel"
                className="form-input"
                placeholder="+251 91 234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="wizard-question-block">
              <label className="wizard-q-label">
                <span className="q-number">6.</span> Telegram username <span className="req">*</span>
              </label>
              <div className="q-help-text">Format: @username. Must be publicly searchable.</div>
              <input
                type="text"
                className="form-input"
                placeholder="@yourhandle"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Q7 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">7.</span> What is your current role? <span className="req">*</span>
            </label>
            <div className="wizard-radio-grid">
              {[
                'Student',
                'Employed',
                'Self-employed',
                'Business owner',
                'Looking for work',
                'Between jobs',
                'Other',
              ].map((r) => (
                <label 
                  key={r} 
                  className={`wizard-radio-card ${role === r ? 'selected' : ''}`}
                  onClick={() => setRole(r)}
                >
                  <input
                    type="radio"
                    name="role"
                    checked={role === r}
                    onChange={() => setRole(r)}
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            {role === 'Other' && (
              <input
                type="text"
                className="form-input"
                style={{ marginTop: '8px' }}
                placeholder="Specify your current role..."
                value={roleOther}
                onChange={(e) => setRoleOther(e.target.value)}
              />
            )}
          </div>

          {/* Q8 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">8.</span> Briefly describe your current work, studies, or business.
              <span className="optional-tag">Optional</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Outline your occupation, current academic focus, or commercial operations..."
              value={workDetails}
              onChange={(e) => setWorkDetails(e.target.value)}
            />
          </div>

          {/* Q9 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">9.</span> How did you first hear about Sovereign Men’s Club? <span className="req">*</span>
            </label>
            <div className="wizard-radio-grid">
              {[
                'Eyob Haile YouTube',
                'Eyob Haile TikTok',
                'Telegram',
                'Sovereign Men’s Initiation Program',
                'A Sovereign Men’s Club member',
                'Friend or family member',
                'Other',
              ].map((src) => (
                <label 
                  key={src} 
                  className={`wizard-radio-card ${referralSource === src ? 'selected' : ''}`}
                  onClick={() => setReferralSource(src)}
                >
                  <input
                    type="radio"
                    name="referralSource"
                    checked={referralSource === src}
                    onChange={() => setReferralSource(src)}
                  />
                  <span>{src}</span>
                </label>
              ))}
            </div>
            {referralSource === 'Other' && (
              <input
                type="text"
                className="form-input"
                style={{ marginTop: '8px' }}
                placeholder="Specify how you heard about us..."
                value={referralOther}
                onChange={(e) => setReferralOther(e.target.value)}
              />
            )}
          </div>

          {/* Platform Access Credentials Header */}
          <div className="wizard-sub-divider">
            <div className="sub-divider-line" />
            <span className="sub-divider-title">Sovereign Portal Account Setup</span>
            <div className="sub-divider-line" />
          </div>

          <div className="grid-2-col">
            <div className="wizard-question-block">
              <label className="wizard-q-label">
                Account Email <span className="req">*</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="wizard-question-block">
              <label className="wizard-q-label">
                Create Secure Password <span className="req">*</span>
              </label>
              <div className="auth-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-text-input"
                  style={{ paddingLeft: '14px' }}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="auth-toggle-pwd-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Current Reality and Motivation (Page 3 of 9) */}
      {currentStep === 2 && (
        <div className="wizard-step-section">
          <div className="wizard-section-heading">
            <span className="wizard-section-badge">Section 2 of 7 • Page 3 of 9</span>
            <h3 className="wizard-section-title">Your Current Reality and Motivation</h3>
            <p className="wizard-section-subtitle">
              Be specific and honest. These are screening questions.
            </p>
          </div>

          {/* Q10 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">10.</span> Why do you want to join Sovereign Men’s Club? <span className="req">*</span>
            </label>
            <div className="q-help-text">
              Explain why joining matters to you now, not what you think we want to hear.
            </div>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="State your genuine reason for seeking brotherhood and standards now..."
              value={q10_whyJoin}
              onChange={(e) => setQ10_whyJoin(e.target.value)}
            />
          </div>

          {/* Q11 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">11.</span> What is the biggest problem or weakness currently affecting your life? <span className="req">*</span>
            </label>
            <div className="q-help-text">
              Describe what you repeatedly do, avoid, or fail to control.
            </div>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Be ruthlessly honest. Acknowledging weakness is the first step of sovereignty..."
              value={q11_biggestWeakness}
              onChange={(e) => setQ11_biggestWeakness(e.target.value)}
            />
          </div>

          {/* Q12 */}
          <div className="wizard-question-block">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="wizard-q-label">
                <span className="q-number">12.</span> Which areas of your life most need improvement? <span className="req">*</span>
              </label>
              <span className="badge" style={{ background: q12_improvementAreas.length === 3 ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.08)', color: 'var(--text-gold)' }}>
                {q12_improvementAreas.length} / 3 selected
              </span>
            </div>
            <div className="q-help-text">Select no more than 3 areas.</div>

            <div className="wizard-checkbox-grid">
              {IMPROVEMENT_AREAS.map((area) => {
                const checked = q12_improvementAreas.includes(area);
                return (
                  <label 
                    key={area}
                    className={`wizard-checkbox-card ${checked ? 'selected' : ''}`}
                    onClick={() => handleToggleArea(area)}
                  >
                    <div className={`checkbox-box ${checked ? 'checked' : ''}`}>
                      {checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="checkbox-text">{area}</span>
                  </label>
                );
              })}
            </div>

            {q12_improvementAreas.includes('Other') && (
              <input
                type="text"
                className="form-input"
                style={{ marginTop: '8px' }}
                placeholder="Specify the other area of improvement..."
                value={q12_otherText}
                onChange={(e) => setQ12_otherText(e.target.value)}
              />
            )}
          </div>

          {/* Q13 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">13.</span> If nothing changes, what are you afraid your life will look like 12 months from now? <span className="req">*</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe the stagnation or decay you refuse to tolerate..."
              value={q13_afraid12Months}
              onChange={(e) => setQ13_afraid12Months(e.target.value)}
            />
          </div>

          {/* Q14 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">14.</span> What specific change would you like to see in your life one year from now? <span className="req">*</span>
            </label>
            <div className="q-help-text">
              Describe a result that can be observed or measured.
            </div>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Bodyweight, revenue, habits broken, daily routine stabilized..."
              value={q14_specificChange1Year}
              onChange={(e) => setQ14_specificChange1Year(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* SECTION 3: Responsibility and Evidence (Page 4 of 9) */}
      {currentStep === 3 && (
        <div className="wizard-step-section">
          <div className="wizard-section-heading">
            <span className="wizard-section-badge">Section 3 of 7 • Page 4 of 9</span>
            <h3 className="wizard-section-title">Responsibility and Evidence</h3>
            <p className="wizard-section-subtitle">
              Readiness is shown through ownership and action, not only intention.
            </p>
          </div>

          {/* Q15 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">15.</span> When something goes wrong in your life, which statement describes you most accurately? <span className="req">*</span>
            </label>
            <div className="wizard-radio-list">
              {[
                'I usually blame other people or circumstances.',
                'I sometimes blame others, but I can recognize my responsibility.',
                'I usually ask what I could have done differently.',
                'I take responsibility for my response even when the situation was not my fault.',
              ].map((stmt) => (
                <label 
                  key={stmt}
                  className={`wizard-statement-card ${q15_blameHandling === stmt ? 'selected' : ''}`}
                  onClick={() => setQ15_blameHandling(stmt)}
                >
                  <input
                    type="radio"
                    name="q15"
                    checked={q15_blameHandling === stmt}
                    onChange={() => setQ15_blameHandling(stmt)}
                  />
                  <span>{stmt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q16 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">16.</span> Describe one difficult commitment you completed even after your motivation disappeared. <span className="req">*</span>
            </label>
            <div className="q-help-text">
              It can be small. We are looking for evidence of persistence, not an impressive story.
            </div>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Give a grounded example of discipline over emotion..."
              value={q16_difficultCommitment}
              onChange={(e) => setQ16_difficultCommitment(e.target.value)}
            />
          </div>

          {/* Q17 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">17.</span> Describe something you repeatedly failed to complete. Why did you stop or fail? <span className="req">*</span>
            </label>
            <div className="q-help-text">
              Take responsibility where appropriate. Do not only blame circumstances or other people.
            </div>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Analyze your past failure with clear personal accountability..."
              value={q17_repeatedFailure}
              onChange={(e) => setQ17_repeatedFailure(e.target.value)}
            />
          </div>

          {/* Q18 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">18.</span> What excuse do you use most often when you avoid doing what you know you should do? <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 'I am too tired', 'I will start Monday', 'I don't have enough time'..."
              value={q18_mostUsedExcuse}
              onChange={(e) => setQ18_mostUsedExcuse(e.target.value)}
            />
          </div>

          {/* Q19 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">19.</span> What real action have you taken during the last 30 days to improve your life? <span className="req">*</span>
            </label>
            <div className="q-help-text">
              Give a specific example. Intention alone is not action.
            </div>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Concrete actions taken in the last month (e.g. gym streak, book read, expense trimmed)..."
              value={q19_last30DaysAction}
              onChange={(e) => setQ19_last30DaysAction(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* SECTION 4: Time and Participation (Page 5 of 9) */}
      {currentStep === 4 && (
        <div className="wizard-step-section">
          <div className="wizard-section-heading">
            <span className="wizard-section-badge">Section 4 of 7 • Page 5 of 9</span>
            <h3 className="wizard-section-title">Time and Participation</h3>
            <p className="wizard-section-subtitle">
              The club requires active participation, not passive membership.
            </p>
          </div>

          {/* Q20 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">20.</span> How many hours per week are you honestly willing to invest in club activities and personal development? <span className="req">*</span>
            </label>
            <div className="wizard-radio-grid">
              {['Less than 1 hour', '1–2 hours', '3–5 hours', '5–7 hours', 'More than 7 hours'].map((hrs) => (
                <label 
                  key={hrs}
                  className={`wizard-radio-card ${q20_weeklyHours === hrs ? 'selected' : ''}`}
                  onClick={() => setQ20_weeklyHours(hrs)}
                >
                  <input
                    type="radio"
                    name="q20"
                    checked={q20_weeklyHours === hrs}
                    onChange={() => setQ20_weeklyHours(hrs)}
                  />
                  <span>{hrs}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q21 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">21.</span> Will you participate actively rather than remain on the sidelines? <span className="req">*</span>
            </label>
            <div className="wizard-radio-group horizontal">
              {['Yes', 'No'].map((ans) => (
                <label 
                  key={ans}
                  className={`wizard-radio-card ${q21_activeParticipation === ans ? 'selected' : ''}`}
                  onClick={() => setQ21_activeParticipation(ans)}
                >
                  <input
                    type="radio"
                    name="q21"
                    checked={q21_activeParticipation === ans}
                    onChange={() => setQ21_activeParticipation(ans)}
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q22 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">22.</span> Are you willing to complete assigned challenges even when your motivation is low? <span className="req">*</span>
            </label>
            <div className="wizard-radio-group horizontal">
              {['Yes', 'No', 'I am uncertain'].map((ans) => (
                <label 
                  key={ans}
                  className={`wizard-radio-card ${q22_completeChallengesLowMotiv === ans ? 'selected' : ''}`}
                  onClick={() => setQ22_completeChallengesLowMotiv(ans)}
                >
                  <input
                    type="radio"
                    name="q22"
                    checked={q22_completeChallengesLowMotiv === ans}
                    onChange={() => setQ22_completeChallengesLowMotiv(ans)}
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q23 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">23.</span> Are you willing to attend scheduled online or in-person sessions consistently? <span className="req">*</span>
            </label>
            <div className="wizard-radio-group horizontal">
              {['Yes', 'No', 'It depends on the exact schedule'].map((ans) => (
                <label 
                  key={ans}
                  className={`wizard-radio-card ${q23_attendScheduledSessions === ans ? 'selected' : ''}`}
                  onClick={() => setQ23_attendScheduledSessions(ans)}
                >
                  <input
                    type="radio"
                    name="q23"
                    checked={q23_attendScheduledSessions === ans}
                    onChange={() => setQ23_attendScheduledSessions(ans)}
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q24 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">24.</span> Are you willing to report your progress honestly, including days when you fail? <span className="req">*</span>
            </label>
            <div className="wizard-radio-group horizontal">
              {['Yes', 'No', 'I find this difficult, but I am willing to learn'].map((ans) => (
                <label 
                  key={ans}
                  className={`wizard-radio-card ${q24_reportProgressHonestFailures === ans ? 'selected' : ''}`}
                  onClick={() => setQ24_reportProgressHonestFailures(ans)}
                >
                  <input
                    type="radio"
                    name="q24"
                    checked={q24_reportProgressHonestFailures === ans}
                    onChange={() => setQ24_reportProgressHonestFailures(ans)}
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: Pressure Test (Page 6 of 9) */}
      {currentStep === 5 && (
        <div className="wizard-step-section">
          <div className="wizard-section-heading">
            <span className="wizard-section-badge">Section 5 of 7 • Page 6 of 9</span>
            <h3 className="wizard-section-title">Pressure Test</h3>
            <p className="wizard-section-subtitle">
              Think about how you will behave after the first excitement disappears.
            </p>
          </div>

          {/* Q25 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">25.</span> What will you do when you are busy, tired, discouraged, or no longer motivated? <span className="req">*</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe your protocol for sustaining standards when feelings drop..."
              value={q25_busyTiredResponse}
              onChange={(e) => setQ25_busyTiredResponse(e.target.value)}
            />
          </div>

          {/* Q26 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">26.</span> Imagine that three weeks have passed. The excitement is gone, the work is difficult, you missed a commitment, and nobody is forcing you to continue. What will you do next? <span className="req">*</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="State your exact response to breaking discipline and regaining your post..."
              value={q26_threeWeeksPassed}
              onChange={(e) => setQ26_threeWeeksPassed(e.target.value)}
            />
          </div>

          {/* Q27 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">27.</span> Which statement describes the man you are right now most accurately? <span className="req">*</span>
            </label>
            <div className="wizard-radio-list">
              {[
                'I usually keep my word and finish what I begin.',
                'I begin strongly but often lose consistency.',
                'I avoid difficult commitments or quit when they become uncomfortable.',
                'I genuinely want to change, but I have not yet proved that I can remain consistent.',
              ].map((stmt) => (
                <label 
                  key={stmt}
                  className={`wizard-statement-card ${q27_currentManDescription === stmt ? 'selected' : ''}`}
                  onClick={() => setQ27_currentManDescription(stmt)}
                >
                  <input
                    type="radio"
                    name="q27"
                    checked={q27_currentManDescription === stmt}
                    onChange={() => setQ27_currentManDescription(stmt)}
                  />
                  <span>{stmt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q28 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">28.</span> Why should we give you a place in Sovereign Men’s Club? <span className="req">*</span>
            </label>
            <div className="q-help-text">
              Focus on honesty, readiness, commitment, and willingness to work—not achievements or status.
            </div>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="State your case for brotherhood membership..."
              value={q28_whyGivePlace}
              onChange={(e) => setQ28_whyGivePlace(e.target.value)}
            />
          </div>

          {/* Q29 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">29.</span> What can you contribute to the brotherhood? <span className="req">*</span>
            </label>
            <div className="q-help-text">
              You may mention a skill, experience, attitude, service, encouragement, leadership, or another positive contribution.
            </div>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Outline what value you bring to other men in the ranks..."
              value={q29_contributionToBrotherhood}
              onChange={(e) => setQ29_contributionToBrotherhood(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* SECTION 6: Accountability, Conduct, and Final Readiness (Page 7/8 of 9) */}
      {currentStep === 6 && (
        <div className="wizard-step-section">
          <div className="wizard-section-heading">
            <span className="wizard-section-badge">Section 6 of 7 • Page 7/8 of 9</span>
            <h3 className="wizard-section-title">Accountability, Conduct, and Final Readiness</h3>
            <p className="wizard-section-subtitle">
              Read each question carefully. These standards protect the brotherhood.
            </p>
          </div>

          {/* Q30 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">30.</span> Are you willing to participate in an accountable squad and communicate respectfully? <span className="req">*</span>
            </label>
            <div className="wizard-radio-group horizontal">
              {['Yes', 'No'].map((ans) => (
                <label 
                  key={ans}
                  className={`wizard-radio-card ${q30_squadRespect === ans ? 'selected' : ''}`}
                  onClick={() => setQ30_squadRespect(ans)}
                >
                  <input
                    type="radio"
                    name="q30"
                    checked={q30_squadRespect === ans}
                    onChange={() => setQ30_squadRespect(ans)}
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q31 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">31.</span> Will you protect the privacy and confidentiality of other members? <span className="req">*</span>
            </label>
            <div className="wizard-radio-group horizontal">
              {['Yes', 'No'].map((ans) => (
                <label 
                  key={ans}
                  className={`wizard-radio-card ${q31_confidentiality === ans ? 'selected' : ''}`}
                  onClick={() => setQ31_confidentiality(ans)}
                >
                  <input
                    type="radio"
                    name="q31"
                    checked={q31_confidentiality === ans}
                    onChange={() => setQ31_confidentiality(ans)}
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q32 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">32.</span> Are you willing to receive direct correction without insulting, attacking, or disappearing? <span className="req">*</span>
            </label>
            <div className="wizard-radio-group vertical">
              {['Yes', 'No', 'I struggle with this, but I am willing to work on it'].map((ans) => (
                <label 
                  key={ans}
                  className={`wizard-radio-card ${q32_directCorrection === ans ? 'selected' : ''}`}
                  onClick={() => setQ32_directCorrection(ans)}
                >
                  <input
                    type="radio"
                    name="q32"
                    checked={q32_directCorrection === ans}
                    onChange={() => setQ32_directCorrection(ans)}
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q33 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">33.</span> Are you willing to encourage and hold other men accountable without insulting or humiliating them? <span className="req">*</span>
            </label>
            <div className="wizard-radio-group vertical">
              {['Yes', 'No', 'I need guidance on how to do this properly'].map((ans) => (
                <label 
                  key={ans}
                  className={`wizard-radio-card ${q33_holdAccountableWithoutInsult === ans ? 'selected' : ''}`}
                  onClick={() => setQ33_holdAccountableWithoutInsult(ans)}
                >
                  <input
                    type="radio"
                    name="q33"
                    checked={q33_holdAccountableWithoutInsult === ans}
                    onChange={() => setQ33_holdAccountableWithoutInsult(ans)}
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q34 */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">34.</span> Do you understand that repeated dishonesty, disrespect, harmful conduct, or refusal to participate may result in removal from the club? <span className="req">*</span>
            </label>
            <div className="wizard-radio-group horizontal">
              {['Yes, I understand', 'No'].map((ans) => (
                <label 
                  key={ans}
                  className={`wizard-radio-card ${q34_removalPolicyAwareness === ans ? 'selected' : ''}`}
                  onClick={() => setQ34_removalPolicyAwareness(ans)}
                >
                  <input
                    type="radio"
                    name="q34"
                    checked={q34_removalPolicyAwareness === ans}
                    onChange={() => setQ34_removalPolicyAwareness(ans)}
                  />
                  <span>{ans}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Q35 */}
          <div className="wizard-question-block" style={{ marginTop: '16px', background: 'rgba(212,175,55,0.04)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)' }}>
            <label className="wizard-q-label" style={{ fontSize: '0.98rem' }}>
              <span className="q-number">35.</span> After reading everything above, are you honestly ready to join and participate? <span className="req">*</span>
            </label>
            <div className="q-help-text" style={{ marginBottom: '12px' }}>
              Choose honestly. "No" does not make you a bad person; it means this may not be the right time.
            </div>
            <div className="wizard-radio-list">
              {[
                'YES — I am ready to participate, accept accountability, and do the work.',
                'NO — I am not ready to make this commitment at this time.',
              ].map((opt) => (
                <label 
                  key={opt}
                  className={`wizard-statement-card ${q35_finalReadinessChoice === opt ? 'selected' : ''}`}
                  onClick={() => setQ35_finalReadinessChoice(opt)}
                >
                  <input
                    type="radio"
                    name="q35"
                    checked={q35_finalReadinessChoice === opt}
                    onChange={() => setQ35_finalReadinessChoice(opt)}
                  />
                  <span style={{ fontWeight: 600 }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: Final Agreement and Completion (Page 9 of 9) */}
      {currentStep === 7 && (
        <div className="wizard-step-section">
          <div className="wizard-section-heading">
            <span className="wizard-section-badge">Section 7 of 7 • Page 9 of 9</span>
            <h3 className="wizard-section-title">Final Agreement and Completion</h3>
            <p className="wizard-section-subtitle">
              Complete every required item below to finish the READY application path.
            </p>
          </div>

          {/* Q36: Applicant Agreement */}
          <div className="wizard-question-block">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="wizard-q-label" style={{ margin: 0 }}>
                <span className="q-number">36.</span> Applicant agreement <span className="req">*</span>
              </label>
              <button
                type="button"
                className="btn btn-sm btn-outline-gold"
                style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                onClick={handleSelectAllAgreements}
              >
                Confirm All Statements
              </button>
            </div>
            <div className="q-help-text" style={{ marginBottom: '12px' }}>
              Select every statement to bind your word to the brotherhood standard.
            </div>

            <div className="wizard-agreements-stack">
              {AGREEMENT_STATEMENTS.map((statement, idx) => {
                const checked = !!agreementsChecked[idx];
                return (
                  <label 
                    key={idx}
                    className={`wizard-agreement-row ${checked ? 'checked' : ''}`}
                    onClick={() => handleToggleAgreement(idx)}
                  >
                    <div className={`checkbox-box ${checked ? 'checked' : ''}`}>
                      {checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="agreement-text">{statement}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Q37: Exact Affirmation Statement */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">37.</span> Write this statement exactly: <span className="req">*</span>
            </label>
            <div className="affirmation-quote-card">
              "{REQUIRED_STATEMENT}"
            </div>
            <div className="q-help-text" style={{ marginTop: '6px' }}>
              Type the declaration verbatim below to confirm your resolve.
            </div>

            <input
              type="text"
              className="form-input"
              style={{
                borderColor: 
                  q37_typedStatement.trim().toLowerCase() === REQUIRED_STATEMENT.toLowerCase()
                    ? '#22c55e'
                    : q37_typedStatement.length > 0 ? '#eab308' : undefined
              }}
              placeholder="Type exact statement here..."
              value={q37_typedStatement}
              onChange={(e) => setQ37_typedStatement(e.target.value)}
            />

            {q37_typedStatement.trim().toLowerCase() === REQUIRED_STATEMENT.toLowerCase() && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontSize: '0.8rem', marginTop: '6px' }}>
                <CheckCircle2 size={15} />
                <span>Declaration affirmed word-for-word.</span>
              </div>
            )}
          </div>

          {/* Q38: Optional Notes */}
          <div className="wizard-question-block">
            <label className="wizard-q-label">
              <span className="q-number">38.</span> Is there anything important we should know when reviewing your application?
              <span className="optional-tag">Optional</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Any personal context, questions, or specific circumstances..."
              value={q38_additionalNotes}
              onChange={(e) => setQ38_additionalNotes(e.target.value)}
            />
          </div>

          {/* Membership Track */}
          <div className="wizard-question-block" style={{ marginTop: '16px' }}>
            <label className="wizard-q-label">
              Target Sovereign Tier
            </label>
            <select
              className="form-select"
              value={membershipTier}
              onChange={(e) => setMembershipTier(e.target.value)}
            >
              <option value="GENERAL">Sovereign Brother ($300/yr)</option>
              <option value="EXECUTIVE">Executive Member ($600/yr)</option>
              <option value="FOUNDING">Founding Council ($1,200/yr)</option>
              <option value="YOUNG_LEADER">Rising Sovereign ($150/yr)</option>
            </select>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      {currentStep > 0 && (
        <div className="wizard-action-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrevStep}
            disabled={submitting}
          >
            <ArrowLeft size={16} />
            <span>{currentStep === 1 ? 'Cancel' : 'Previous Section'}</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-gold-glow"
            onClick={handleNextStep}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                <span>Transmitting Dossier & Inducting...</span>
              </>
            ) : currentStep < 7 ? (
              <>
                <span>Save & Continue to Step {currentStep + 1}</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Submit 38-Question Dossier & Enter Brotherhood</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
