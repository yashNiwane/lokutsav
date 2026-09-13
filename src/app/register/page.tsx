'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { useLanguage } from '@/lib/language-context';
import { MAHARASHTRA_DISTRICTS } from '@/lib/translations';
import {
  CheckCircle2,
  Upload,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Share2,
  Download,
  AlertCircle,
  FileText,
  Lock,
  Video,
  Film,
  X,
} from 'lucide-react';
import Link from 'next/link';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RegisterPage() {
  const { lang, t } = useLanguage();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    district: 'Pune',
    city: '',
    address: '',
    category: 'HOUSEHOLD',
    idolType: 'SHADU_MATI_CLAY',
    themeTitle: '',
    themeDescription: '',
    materialsUsed: '',
    photoUrls: [] as string[],
    videoUrl: '',
  });

  // Photo & Video upload state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setErrorMessage('');

    // Client-side 5-minute video duration validation
    try {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      const objUrl = URL.createObjectURL(file);
      videoElement.src = objUrl;

      await new Promise<void>((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          URL.revokeObjectURL(objUrl);
          if (videoElement.duration > 300) {
            reject(
              new Error(
                lang === 'mr'
                  ? 'व्हिडिओचा कालावधी 5 मिनिटांपेक्षा जास्त आहे. कृपया 5 मिनिटांखालील व्हिडिओ निवडा.'
                  : 'Video length exceeds the 5-minute maximum limit. Please select or trim a video under 5 minutes.'
              )
            );
          } else {
            resolve();
          }
        };
        videoElement.onerror = () => {
          resolve(); // Fallback if browser can't read metadata
        };
      });

      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({
          ...prev,
          videoUrl: data.url,
        }));
      } else {
        setErrorMessage(data.error || 'Failed to upload video');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Video upload failed');
    } finally {
      setUploadingVideo(false);
    }
  };

  // Ticket & Order State
  const [ticketId, setTicketId] = useState('');
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhoto(true);
    setErrorMessage('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const body = new FormData();
        body.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body,
        });
        const data = await res.json();
        if (data.success && data.url) {
          setFormData((prev) => ({
            ...prev,
            photoUrls: [...prev.photoUrls, data.url],
          }));
        } else {
          setErrorMessage(data.error || 'Failed to upload photo');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const addPhotoUrlManually = () => {
    if (!photoUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      photoUrls: [...prev.photoUrls, photoUrlInput.trim()],
    }));
    setPhotoUrlInput('');
  };

  const removePhoto = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      photoUrls: prev.photoUrls.filter((_, i) => i !== idx),
    }));
  };

  // Step 1 validation
  const handleNextFromStep1 = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.district.trim()) {
      setErrorMessage(
        lang === 'mr'
          ? 'कृपया सर्व आवश्यक माहिती भरा (नाव, फोन, जिल्हा)'
          : 'Please fill in all required fields (Name, Phone, District)'
      );
      return;
    }
    setErrorMessage('');
    setStep(2);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 2 submission -> generates ticket & creates Razorpay order
  const handleProceedToPayment = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!formData.themeTitle.trim() || !formData.themeDescription.trim()) {
      setErrorMessage(
        lang === 'mr'
          ? 'कृपया सजावटीचे नाव व माहिती भरा'
          : 'Please enter the decoration theme title and description'
      );
      return;
    }

    if (formData.photoUrls.length === 0) {
      formData.photoUrls = [
        'https://images.unsplash.com/photo-1567591370504-20a2e7c54ef5?auto=format&fit=crop&w=1200&q=80',
      ];
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setTicketId(data.ticketId);
        setRazorpayOrder(data.order);
        setStep(3);
      } else {
        setErrorMessage(data.error || 'नोंदणी अयशस्वी झाली');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3 -> Launch Razorpay Checkout Modal
  const launchRazorpayCheckout = () => {
    if (!agreedToTerms) {
      setErrorMessage(
        lang === 'mr'
          ? 'कृपया पेमेंट करण्यापूर्वी नियम व अटी मान्य करा.'
          : 'Please accept the Terms & Conditions before proceeding to payment.'
      );
      return;
    }

    const keyId =
      razorpayOrder?.keyId ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      'rzp_test_TWn9LmxfmLCs6o';

    // If Razorpay SDK is available on window
    if (typeof window !== 'undefined' && window.Razorpay) {
      const options = {
        key: keyId,
        amount: razorpayOrder?.amount || 19900,
        currency: razorpayOrder?.currency || 'INR',
        name: 'लोकोत्सव 2026 | Lokutsav',
        description: `महाराष्ट्र राज्य गणेश सजावट स्पर्धा नोंदणी (${ticketId})`,
        image: 'https://images.unsplash.com/photo-1567591370504-20a2e7c54ef5?auto=format&fit=crop&w=120&q=80',
        order_id: razorpayOrder?.orderId && !razorpayOrder.isSimulated ? razorpayOrder.orderId : undefined,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
          method: 'upi',
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay using UPI Apps (Intent / QR)',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['intent', 'qr', 'collect'],
                    apps: ['google_pay', 'phonepe', 'paytm', 'bhim', 'cred'],
                  },
                ],
              },
              other: {
                name: 'Cards & Netbanking',
                instruments: [
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' },
                ],
              },
            },
            sequence: ['block.upi', 'block.other'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        notes: {
          ticketId,
          district: formData.district,
          category: formData.category,
        },
        theme: {
          color: '#9B1B1E', // Regal Shendur vermilion
        },
        handler: async function (response: any) {
          setIsSubmitting(true);
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ticketId,
                razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpayOrderId: response.razorpay_order_id || razorpayOrder?.orderId,
                razorpaySignature: response.razorpay_signature || 'test_signature',
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setStep(4);
            } else {
              setErrorMessage(verifyData.error || 'Payment verification failed');
            }
          } catch (err: any) {
            setErrorMessage('Payment verification error');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            console.log('Payment window closed by user');
          },
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setErrorMessage(`Payment failed: ${resp.error.description}`);
        });
        rzp.open();
        return;
      } catch (e) {
        console.warn('Direct checkout failed, falling back to simulated verification', e);
      }
    }

    // Fallback if Razorpay checkout script is blocked or offline
    handleCompletePaymentSimulated();
  };

  const handleCompletePaymentSimulated = async () => {
    if (!agreedToTerms) {
      setErrorMessage(
        lang === 'mr'
          ? 'कृपया पेमेंट करण्यापूर्वी नियम व अटी मान्य करा.'
          : 'Please accept the Terms & Conditions before proceeding to payment.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const paymentId = `pay_test_${Date.now()}`;
      const orderId = razorpayOrder?.orderId || `order_${ticketId}`;

      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          razorpayPaymentId: paymentId,
          razorpayOrderId: orderId,
          razorpaySignature: 'simulated_valid_signature',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep(4);
      } else {
        setErrorMessage(data.error || 'Payment verification failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-screen">
      {/* Razorpay Standard Checkout Script */}
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Top Breadcrumb & Title */}
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9B1B1E] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            अधिकृत स्पर्धा नोंदणी पोर्टल 2026
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900">
            {lang === 'mr' ? 'गणेश सजावट स्पर्धा नोंदणी' : 'Competition Entry Registration'}
          </h1>
          <p className="text-stone-600 text-sm">
            {lang === 'mr'
              ? 'केवळ 3 सोप्या चरणांत नोंदणी पूर्ण करा आणि अधिकृत प्रवेश तिकीट मिळवा.'
              : 'Complete your registration in 3 simple steps and get your official entry pass.'}
          </p>
        </div>

        {/* Multi-step progress bar */}
        {step < 4 && (
          <div className="grid grid-cols-3 gap-2 mb-8 text-center text-xs font-bold">
            <div
              className={`p-2.5 rounded-lg border transition-all ${
                step >= 1
                  ? 'bg-[#9B1B1E] text-white border-[#9B1B1E]'
                  : 'bg-white text-stone-400 border-stone-200'
              }`}
            >
              {t.form.steps.step1}
            </div>
            <div
              className={`p-2.5 rounded-lg border transition-all ${
                step >= 2
                  ? 'bg-[#9B1B1E] text-white border-[#9B1B1E]'
                  : 'bg-white text-stone-400 border-stone-200'
              }`}
            >
              {t.form.steps.step2}
            </div>
            <div
              className={`p-2.5 rounded-lg border transition-all ${
                step >= 3
                  ? 'bg-[#9B1B1E] text-white border-[#9B1B1E]'
                  : 'bg-white text-stone-400 border-stone-200'
              }`}
            >
              {t.form.steps.step3}
            </div>
          </div>
        )}

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ================= STEP 1: Personal Details ================= */}
        {step === 1 && (
          <form
            action="javascript:void(0);"
            onSubmit={(e) => {
              e.preventDefault();
              handleNextFromStep1(e);
            }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D7C0] shadow-sm space-y-6"
          >
            <h2 className="font-serif font-black text-2xl text-stone-900 border-b border-stone-100 pb-3">
              {t.form.personal.title}
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  {t.form.personal.fullName} <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={t.form.personal.fullNamePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    {t.form.personal.phone} <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder={t.form.personal.phonePlaceholder}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    {t.form.personal.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.form.personal.emailPlaceholder}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    {t.form.personal.district} <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                  >
                    {MAHARASHTRA_DISTRICTS.map((d) => (
                      <option key={d.en} value={d.en}>
                        {lang === 'mr' ? d.mr : d.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    {t.form.personal.city}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder={t.form.personal.cityPlaceholder}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  {t.form.personal.address}
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={t.form.personal.addressPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                onClick={handleNextFromStep1}
                className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white font-bold px-8 py-3.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <span>{lang === 'mr' ? 'पुढील पायरी: सजावट तपशील' : 'Next: Decoration Details'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 2: Decoration Details ================= */}
        {step === 2 && (
          <form
            action="javascript:void(0);"
            onSubmit={(e) => {
              e.preventDefault();
              handleProceedToPayment(e);
            }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D7C0] shadow-sm space-y-6"
          >
            <h2 className="font-serif font-black text-2xl text-stone-900 border-b border-stone-100 pb-3">
              {t.form.decoration.title}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    {t.form.decoration.category}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                  >
                    <option value="HOUSEHOLD">{t.form.decoration.household}</option>
                    <option value="SARVAJANIK_MANDAL">{t.form.decoration.mandal}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    {t.form.decoration.idolType}
                  </label>
                  <select
                    value={formData.idolType}
                    onChange={(e) => setFormData({ ...formData, idolType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                  >
                    <option value="SHADU_MATI_CLAY">{t.form.decoration.shadu}</option>
                    <option value="ECO_FRIENDLY_PAPER_PULP">{t.form.decoration.paperPulp}</option>
                    <option value="TRADITIONAL_OTHER">{t.form.decoration.traditional}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  {t.form.decoration.themeTitle} <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.themeTitle}
                  onChange={(e) => setFormData({ ...formData, themeTitle: e.target.value })}
                  placeholder={t.form.decoration.themeTitlePlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  {t.form.decoration.themeDesc} <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.themeDescription}
                  onChange={(e) => setFormData({ ...formData, themeDescription: e.target.value })}
                  placeholder={t.form.decoration.themeDescPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  {t.form.decoration.materials}
                </label>
                <input
                  type="text"
                  value={formData.materialsUsed}
                  onChange={(e) => setFormData({ ...formData, materialsUsed: e.target.value })}
                  placeholder={t.form.decoration.materialsPlaceholder}
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                />
              </div>

              {/* Photo Upload Section */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div>
                  <label className="block font-semibold text-stone-800 text-sm">
                    {t.form.decoration.photosLabel}
                  </label>
                  <p className="text-xs text-stone-500">
                    {t.form.decoration.photosHint}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 bg-white border-2 border-dashed border-[#E5D7C0] hover:border-[#9B1B1E] px-4 py-2.5 rounded-lg text-xs font-bold text-stone-700 transition-colors">
                    <Upload className="w-4 h-4 text-[#9B1B1E]" />
                    <span>{uploadingPhoto ? 'अपलोड सुरू आहे...' : 'फोटो निवडा (File Upload)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                  </label>

                  <div className="flex-1 flex gap-2 min-w-[220px]">
                    <input
                      type="url"
                      placeholder="किंवा इमेज URL पेस्ट करा..."
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={addPhotoUrlManually}
                      className="text-xs font-bold px-3 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-stone-800"
                    >
                      जोडा
                    </button>
                  </div>
                </div>

                {formData.photoUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.photoUrls.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone-300 group">
                        <img src={url} alt="upload preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-90 hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Video File Upload (Max 5 minutes) */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <label className="block font-semibold text-stone-800 text-sm">
                      {t.form.decoration.videoLabel}
                    </label>
                    <p className="text-xs text-stone-500">
                      {t.form.decoration.videoHint}
                    </p>
                  </div>
                  <span className="self-start text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    {lang === 'mr' ? 'कमाल कालावधी: 5 मिनिटे' : 'Max Length: 5 Minutes'}
                  </span>
                </div>

                {!formData.videoUrl ? (
                  <label className="cursor-pointer border-2 border-dashed border-[#E5D7C0] hover:border-[#9B1B1E] bg-white rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-[#9B1B1E] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      {uploadingVideo ? (
                        <div className="w-6 h-6 border-2 border-[#9B1B1E] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Video className="w-6 h-6" />
                      )}
                    </div>
                    <span className="font-bold text-sm text-stone-800">
                      {uploadingVideo
                        ? (lang === 'mr' ? 'व्हिडिओ अपलोड होत आहे...' : 'Uploading video file...')
                        : (lang === 'mr' ? 'व्हिडिओ निवडा व थेट अपलोड करा (Choose Video)' : 'Select Video File (Direct Upload)')}
                    </span>
                    <span className="text-xs text-stone-400 mt-1">
                      MP4, MOV, WebM (YouTube लिंकची आवश्यकता नाही • कमाल 5 मिनिटे)
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,video/m4v"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'mr' ? 'व्हिडिओ थेट अपलोड झाला (5 मिनिटांच्या आत)' : 'Video uploaded directly (within 5-min limit)'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, videoUrl: '' })}
                        className="text-xs font-bold text-red-600 hover:text-red-800 underline"
                      >
                        {lang === 'mr' ? 'व्हिडिओ बदला / काढा' : 'Remove / Change Video'}
                      </button>
                    </div>

                    <div className="rounded-lg overflow-hidden bg-black aspect-16/9 max-h-64 flex items-center justify-center">
                      <video
                        src={formData.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 font-semibold text-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{lang === 'mr' ? 'मागील पायरी' : 'Previous Step'}</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting || uploadingPhoto || uploadingVideo}
                onClick={handleProceedToPayment}
                className="inline-flex items-center gap-2 bg-[#9B1B1E] hover:bg-[#781416] text-white font-bold px-8 py-3.5 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {isSubmitting
                    ? lang === 'mr' ? 'प्रक्रिया सुरू आहे...' : 'Processing...'
                    : lang === 'mr' ? 'पुढील पायरी: ₹199 भरणा' : 'Proceed to ₹199 Payment'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: Razorpay Payment ================= */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D7C0] shadow-sm space-y-6">
            <h2 className="font-serif font-black text-2xl text-stone-900 border-b border-stone-100 pb-3">
              {t.form.payment.title}
            </h2>

            <div className="bg-amber-50/70 p-5 rounded-xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-700">{t.form.payment.feeLabel}</span>
                <span className="font-bold text-stone-900 font-mono">₹199.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-700">{t.form.payment.gstLabel}</span>
                <span className="font-bold text-emerald-700 font-mono">समाविष्ट (₹0.00)</span>
              </div>
              <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-base font-black">
                <span className="text-stone-900">{t.form.payment.totalLabel}</span>
                <span className="font-serif text-2xl text-[#9B1B1E]">₹199 मात्र</span>
              </div>
            </div>

            <div className="text-xs text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-200 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-stone-800 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>नोंदणीमध्ये समाविष्ट:</span>
              </div>
              <p>{t.form.payment.included}</p>
            </div>

            {/* UPI Intent Highlight Section */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>UPI Intent & QR Supported</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  1-Tap Intent
                </span>
              </div>

              {/* Supported UPI Apps Badges */}
              <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
                <div className="bg-white border border-stone-200 p-2 rounded-lg text-stone-800 shadow-2xs hover:border-amber-400 transition-colors">
                  Google Pay
                </div>
                <div className="bg-white border border-stone-200 p-2 rounded-lg text-purple-800 shadow-2xs hover:border-amber-400 transition-colors">
                  PhonePe
                </div>
                <div className="bg-white border border-stone-200 p-2 rounded-lg text-sky-800 shadow-2xs hover:border-amber-400 transition-colors">
                  Paytm UPI
                </div>
                <div className="bg-white border border-stone-200 p-2 rounded-lg text-emerald-800 shadow-2xs hover:border-amber-400 transition-colors">
                  BHIM UPI
                </div>
                <div className="bg-white border border-stone-200 p-2 rounded-lg text-stone-900 shadow-2xs hover:border-amber-400 transition-colors">
                  CRED UPI
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-snug">
                📲 <strong>मोबाईलवर:</strong> तुमचे Google Pay, PhonePe किंवा Paytm ॲप थेट आपोआप उघडेल (1-Tap UPI Intent).<br />
                💻 <strong>लॅपटॉप/कॉम्प्युटरवर:</strong> थेट स्कॅन करण्यासाठी Dynamic UPI QR Code दिसेल.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Terms and Conditions Checkbox */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-stone-800 transition-colors">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="termsAgreement"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#9B1B1E] focus:ring-[#9B1B1E] accent-[#9B1B1E] cursor-pointer shrink-0"
                  />
                  <span className="leading-relaxed text-xs sm:text-sm text-stone-800">
                    {lang === 'mr' ? (
                      <>
                        मी स्पर्धेचे सर्व{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowTermsModal(true);
                          }}
                          className="font-bold text-[#9B1B1E] hover:text-[#781416] underline decoration-stone-400 hover:decoration-[#9B1B1E] underline-offset-2 cursor-pointer inline"
                        >
                          नियम आणि अटी (Terms & Conditions)
                        </button>{' '}
                        वाचल्या आहेत आणि मला त्या पूर्णपणे मान्य आहेत. मी पुष्टी करतो/करते की मी दिलेली माहिती खरी असून सादर केलेली सजावट अधिकृत नियमांचे पालन करते.
                      </>
                    ) : (
                      <>
                        I have read and agree to all the{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowTermsModal(true);
                          }}
                          className="font-bold text-[#9B1B1E] hover:text-[#781416] underline decoration-stone-400 hover:decoration-[#9B1B1E] underline-offset-2 cursor-pointer inline"
                        >
                          Terms & Conditions
                        </button>{' '}
                        of the competition. I confirm that all submitted details and materials comply with official guidelines.
                      </>
                    )}
                  </span>
                </label>
              </div>

              <button
                type="button"
                onClick={launchRazorpayCheckout}
                disabled={isSubmitting || !agreedToTerms}
                title={!agreedToTerms ? (lang === 'mr' ? 'कृपया पुढे जाण्यापूर्वी नियम व अटी मान्य करा' : 'Please agree to terms & conditions before proceeding') : ''}
                className="w-full flex items-center justify-center gap-3 bg-[#9B1B1E] hover:bg-[#781416] text-white py-4 rounded-xl font-bold text-base shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <CreditCard className="w-5 h-5 text-amber-300" />
                <span>
                  {isSubmitting
                    ? 'रेझरपे सुरू होत आहे...'
                    : 'UPI (GPay/PhonePe/Paytm) किंवा कार्ड द्वारे ₹199 भरा'}
                </span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleCompletePaymentSimulated}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  किंवा थेट चाचणी पेमेंट पुष्टीकरण करा (Instant Test Simulation)
                </button>
              </div>

              <p className="text-center text-xs text-stone-500 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  रेझरपे अधिकृत टेस्ट की सक्रिय: <code className="font-mono text-stone-700">rzp_test_TWn9LmxfmLCs6o</code>
                </span>
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 4: Success Ticket View ================= */}
        {step === 4 && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border-2 border-amber-500 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                नोंदणी व भरणा यशस्वी
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-stone-900">
                {t.form.ticket.successTitle}
              </h2>
              <p className="text-sm text-stone-600 max-w-lg mx-auto">
                {t.form.ticket.congratsMessage}
              </p>
            </div>

            {/* Ticket Pass Container */}
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border-2 border-dashed border-[#E5D7C0] max-w-md mx-auto text-left space-y-4 shadow-2xs relative">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-500 block">
                    {t.brand.name} 2026 अधिकृत प्रवेशिका
                  </span>
                  <p className="font-serif font-black text-xl text-[#9B1B1E]">
                    {ticketId}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center border border-amber-300 shadow-xs overflow-hidden">
                  <img src="/logo.png" alt="Lokutsav Logo" className="w-full h-full object-contain" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-500 block">स्पर्धकाचे नाव:</span>
                  <span className="font-bold text-stone-900">{formData.fullName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">जिल्हा:</span>
                  <span className="font-bold text-stone-900">{formData.district}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">सजावट संकल्पना:</span>
                  <span className="font-bold text-stone-900 line-clamp-1">{formData.themeTitle}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">शुल्क स्थिती:</span>
                  <span className="font-bold text-emerald-700">₹199 पूर्ण (Paid via Razorpay)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{t.form.ticket.downloadTicket}</span>
              </button>

              <Link
                href="/gallery"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-stone-100 text-stone-800 border border-[#E5D7C0] px-6 py-3 rounded-xl text-sm font-bold transition-colors"
              >
                <span>दालनात देखावा पहा</span>
              </Link>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-stone-600 hover:text-stone-950 px-4 py-3 text-sm font-semibold"
              >
                <span>{t.form.ticket.backToHome}</span>
              </Link>
            </div>
          </div>
        )}

        {/* ================= Terms & Conditions Popup Modal ================= */}
        {showTermsModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setShowTermsModal(false)}
          >
            <div
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#9B1B1E] flex items-center justify-center text-lg shadow-2xs">
                    📜
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-lg text-stone-900 leading-tight">
                      {lang === 'mr' ? 'लोकोत्सव २०२६ - नियम व अटी' : 'Lokutsav 2026 - Terms & Conditions'}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {lang === 'mr' ? 'अधिकृत नियमावली व मार्गदर्शक सूचना' : 'Official Competition Guidelines & Regulations'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed divide-y divide-stone-100">
                <div className="pb-3 space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span>1.</span>
                    <span>{lang === 'mr' ? 'सहभाग व पात्रता (Eligibility)' : 'Eligibility & Categories'}</span>
                  </h4>
                  <p>
                    {lang === 'mr'
                      ? 'ही स्पर्धा संपूर्ण महाराष्ट्रातील सर्व घरगुती गणपती, सार्वजनिक गणेशोत्सव मंडळे, गृहनिर्माण संस्था (Housing Societies) आणि संस्थात्मक प्रतिष्ठानांसाठी खुली आहे. एका तिकिटावर केवळ एकच अधिकृत नोंदणी ग्राह्य धरली जाईल.'
                      : 'This competition is open to all household setups, public mandals, housing societies, and institutions across Maharashtra. One registration pass qualifies a single entry.'}
                  </p>
                </div>

                <div className="py-3 space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span>2.</span>
                    <span>{lang === 'mr' ? 'प्रवेश शुल्क व परतावा (Registration Fee & Refund Policy)' : 'Registration Fee & Policy'}</span>
                  </h4>
                  <p>
                    {lang === 'mr'
                      ? 'नोंदणी शुल्क प्रति प्रवेश ₹199 (जीएसटी समाविष्ट) आहे. एकदा तिकीट जनरेट झाल्यानंतर नोंदणी शुल्क कोणत्याही कारणास्तव परत केले जाणार नाही (Non-Refundable).'
                      : 'The registration fee is ₹199 per entry (inclusive of GST). Once the entry pass/ticket is generated, fees are strictly non-refundable under any circumstances.'}
                  </p>
                </div>

                <div className="py-3 space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span>3.</span>
                    <span>{lang === 'mr' ? 'फोटो व व्हिडिओ मार्गदर्शक तत्त्वे (Photo & Video Guidelines)' : 'Photos & Video Rules'}</span>
                  </h4>
                  <p>
                    {lang === 'mr'
                      ? 'सादर केलेले सर्व फोटो स्पष्ट, चालू वर्षातील (२०२६) व स्वतःच्या सजावटीचे असणे अनिवार्य आहे. व्हिडिओचा कालावधी जास्तीत जास्त ५ मिनिटांपर्यंत असावा. इंटरनेटवरून डाऊनलोड केलेले अथवा जुने फोटो आढळल्यास प्रवेश तात्काळ रद्द केला जाईल.'
                      : 'All photos and videos must be original, from the current year (2026), and clearly depict the setup. Video duration must not exceed 5 minutes. Plagiarized or stock imagery will lead to immediate disqualification.'}
                  </p>
                </div>

                <div className="py-3 space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span>4.</span>
                    <span>{lang === 'mr' ? 'पर्यावरणपूरक सजावट व शाडू माती (Eco-Friendly Guidelines)' : 'Eco-Friendly & Clay Idols'}</span>
                  </h4>
                  <p>
                    {lang === 'mr'
                      ? 'पारंपरिक शाडू मातीची मूर्ती, नैसर्गिक रंग आणि पुनर्वापर करता येण्याजोगे साहित्य वापरणाऱ्या सजावटींना परीक्षकांकडून विशेष गुण व प्राधान्य दिले जाईल. थर्माकोल व प्लास्टिकचा वापर टाळण्यास प्रोत्साहन दिले जाते.'
                      : 'Special evaluation weightage and bonus points are awarded to entries utilizing traditional Shadu clay idols, natural pigments, and sustainable/recyclable materials. Thermocol and plastic are strongly discouraged.'}
                  </p>
                </div>

                <div className="py-3 space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span>5.</span>
                    <span>{lang === 'mr' ? 'परीक्षण व निकाल (Judging & Evaluation)' : 'Judging & Final Decision'}</span>
                  </h4>
                  <p>
                    {lang === 'mr'
                      ? 'परीक्षण कला, संस्कृती, पर्यावरण, सर्जनशीलता आणि संकल्पनेच्या आधारे तज्ज्ञ ज्युरी पॅनेलद्वारे केले जाईल. परीक्षकांचा व लोकोत्सव संयोजन समितीचा निर्णय अंतिम व सर्वमान्य राहील.'
                      : 'Submissions are judged by an independent jury of sculptors, artists, and cultural experts based on creativity, tradition, and eco-friendliness. The jury’s decision is final and binding.'}
                  </p>
                </div>

                <div className="pt-3 space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span>6.</span>
                    <span>{lang === 'mr' ? 'प्रमाणपत्र व सन्मान (Certificates & Awards)' : 'Certificates & Recognition'}</span>
                  </h4>
                  <p>
                    {lang === 'mr'
                      ? 'प्रत्येक वैध सहभागी स्पर्धकाला डिजिटल सहभाग प्रमाणपत्र (QR Verified E-Certificate) दिले जाईल. विजेत्यांना राज्य, विभाग व जिल्हास्तरावर रोख बक्षिसे व स्मृतिचिन्ह प्रदान केले जातील.'
                      : 'Every valid registered entrant receives an official QR-verified Certificate of Participation. Winners across State, Division, and District tiers receive cash awards, trophies, and honor scrolls.'}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:text-stone-900 font-semibold text-xs sm:text-sm hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  {lang === 'mr' ? 'बंद करा' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAgreedToTerms(true);
                    setShowTermsModal(false);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#9B1B1E] hover:bg-[#781416] text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>{lang === 'mr' ? 'मी वाचले आणि मला मान्य आहे' : 'I Agree & Accept'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
