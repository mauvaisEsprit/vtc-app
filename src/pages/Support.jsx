import React from 'react';
import { useTranslation } from 'react-i18next';
import Hero from "../components/Hero";
import '../styles/Support.css'

export default function Support() {
  const { t } = useTranslation();
  const imageSupport = "https://cdn.tripster.ru/thumbs2/eaca4600-11de-11ef-9e38-a60641776996.800x600.jpeg";
  const textSupport = t('support.heroText');
  const buttonTextSupport = t('support.heroButton');

  return (
    <div>
        <Hero image={imageSupport} text={textSupport} buttonText={buttonTextSupport} />
        <div className="support-page" style={{ padding: '40px', maxWidth: '700px', margin: 'auto' }}>
          <h1>{t('support.title', 'Support')}</h1>
          <p>{t('support.needHelp', 'Need Help?')}</p>
          <p>{t('support.desc', 'If you encounter any issues or have questions, our support team is here to assist you.')}</p>
          <h2>{t('support.commonIssues', 'Common Issues')}</h2>
          <ul>
            <li>{t('support.issue1', 'Booking problems')}</li>
            <li>{t('support.issue2', 'Payment issues')}</li>
            <li>{t('support.issue3', 'Account access')}</li>
          </ul>
          <p><strong>{t('support.contactSupport', 'Contact Support')}:</strong></p>
          <p>{t('support.phone', 'Phone')}: +33 6 22 64 99 63</p>
          <p>{t('support.email', 'Email')}: support@bluecoastvtc.com</p>
          <p>{t('support.responseTime', 'We strive to respond to all inquiries within 24 hours.')}</p>
        </div>
    </div>
  );
}
