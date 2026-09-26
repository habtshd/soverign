import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../api/client.js';
import { User, Send, Check } from 'lucide-react';

export const MemberProfileView: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const profile = user?.member?.profile;

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [profession, setProfession] = useState(profile?.profession || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [city, setCity] = useState(profile?.city || '');
  const [telegramHandle, setTelegramHandle] = useState(profile?.telegramHandle || '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.member?.id) return;
    const res = await api.members.updateProfile(user.member.id, {
      firstName,
      lastName,
      phone,
      bio,
      profession,
      company,
      city,
      telegramHandle,
    });

    if (telegramHandle) {
      await api.integrations.linkTelegram(telegramHandle);
    }

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      refreshUser();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Brotherhood Profile</h1>
          <p className="page-subtitle">
            Manage your personal record, verified credentials, and linked Telegram communication channel.
          </p>
        </div>
      </div>

      <div className="card card-gold-border" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {saved && (
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={18} /> Profile successfully updated in Sovereign Operating System!
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Email Address (Primary Identity)</label>
              <input type="text" className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Profession / Executive Role</label>
              <input
                type="text"
                className="form-input"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Company / Syndicate</label>
              <input
                type="text"
                className="form-input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">City / Regional Chapter</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Telegram Handle (@username)</label>
              <input
                type="text"
                className="form-input"
                placeholder="@your_telegram"
                value={telegramHandle}
                onChange={(e) => setTelegramHandle(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Personal Creed & Executive Bio</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary">
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
