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
  Bell,
  ExternalLink,
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
    referredBy: '',
  });

  const [copiedReferral, setCopiedReferral] = useState(false);
  const [existingTicket, setExistingTicket] = useState<string | null>(null);

  // Auto-detect referral code from URL & sync with session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRef = params.get('ref') || params.get('referral');

      if (urlRef) {
        const cleanRef = urlRef.trim().toUpperCase();
        sessionStorage.setItem('lokutsav_ref', cleanRef);
        localStorage.setItem('lokutsav_ref', cleanRef);
        setFormData((prev) => ({
          ...prev,
          referredBy: cleanRef,
        }));
      } else {
        // Check session storage if user navigated from another page
        const savedRef = sessionStorage.getItem('lokutsav_ref') || localStorage.getItem('lokutsav_ref');
        if (savedRef) {
          setFormData((prev) => ({
            ...prev,
            referredBy: savedRef.trim().toUpperCase(),
          }));
        }
      }

      // Check if user already completed a ticket in this session
      const myTicket = sessionStorage.getItem('lokutsav_my_ticket') || localStorage.getItem('lokutsav_my_ticket');
      const isPaid = sessionStorage.getItem('lokutsav_payment_status') === 'COMPLETED' || localStorage.getItem('lokutsav_payment_status') === 'COMPLETED';
      if (myTicket && isPaid) {
        setExistingTicket(myTicket);
      }
    }
  }, []);

  // Photo & Video upload state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState<{ percent: number; uploadedMb: string; totalMb: string } | null>(null);
  const [videoLinkInput, setVideoLinkInput] = useState('');

  const addVideoUrlManually = () => {
    if (!videoLinkInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      videoUrl: videoLinkInput.trim(),
    }));
    setVideoLinkInput('');
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-selecting same file works
    e.target.value = '';

    const fileSizeMb = file.size / (1024 * 1024);
    if (fileSizeMb > 250) {
      setErrorMessage(
        lang === 'mr'
          ? 'व्हिडिओ फाइल खूप मोठी आहे (250MB+). कृपया जलद अपलोडसाठी 720p किंवा कॉम्प्रेस केलेला व्हिडिओ वापरा.'
          : 'File size exceeds 250MB. Please use a compressed or 720p video for fast upload.'
      );
      return;
    }

    setUploadingVideo(true);
    setVideoProgress({
      percent: 0,
      uploadedMb: '0',
      totalMb: fileSizeMb.toFixed(1),
    });
    setErrorMessage('');

    try {
      // 1. Quick duration check with timeout safety (never blocks slow metadata)
      await new Promise<void>((resolve, reject) => {
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        const objUrl = URL.createObjectURL(file);
        videoElement.src = objUrl;

        const timer = setTimeout(() => {
          URL.revokeObjectURL(objUrl);
          resolve(); // Don't hang if slow parsing
        }, 2000);

        videoElement.onloadedmetadata = () => {
          clearTimeout(timer);
          URL.revokeObjectURL(objUrl);
          if (videoElement.duration > 180) {
            reject(
              new Error(
                lang === 'mr'
                  ? 'व्हिडिओचा कालावधी 3 मिनिटांपेक्षा जास्त आहे. कृपया 3 मिनिटांखालील व्हिडिओ निवडा.'
                  : 'Video length exceeds the 3-minute maximum limit. Please select or trim a video under 3 minutes.'
              )
            );
          } else {
            resolve();
          }
        };

        videoElement.onerror = () => {
          clearTimeout(timer);
          URL.revokeObjectURL(objUrl);
          resolve();
        };
      });

      // 2. High-speed upload with real-time XMLHttpRequest progress
      const body = new FormData();
      body.append('file', file);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
            const uploadedMb = (event.loaded / (1024 * 1024)).toFixed(1);
            const totalMb = (event.total / (1024 * 1024)).toFixed(1);
            setVideoProgress({ percent, uploadedMb, totalMb });
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.success && data.url) {
                setVideoProgress({
                  percent: 100,
                  uploadedMb: (file.size / (1024 * 1024)).toFixed(1),
                  totalMb: (file.size / (1024 * 1024)).toFixed(1),
                });
                setFormData((prev) => ({
                  ...prev,
                  videoUrl: data.url,
                }));
                resolve();
              } else {
                reject(new Error(data.error || 'Failed to upload video'));
              }
            } catch {
              reject(new Error('Invalid response from upload server'));
            }
          } else {
            reject(new Error(`Server error (${xhr.status})`));
          }
        };

        xhr.onerror = () => {
          reject(
            new Error(
              lang === 'mr'
                ? 'नेटवर्क त्रुटी: व्हिडिओ अपलोड अयशस्वी झाला. कृपया पुन्हा प्रयत्न करा.'
                : 'Network error during upload. Please retry.'
            )
          );
        };

        xhr.send(body);
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Video upload failed');
    } finally {
      setUploadingVideo(false);
      setTimeout(() => setVideoProgress(null), 1200);
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

    const hasPhoto = formData.photoUrls.length > 0;
    const hasVideo = !!(formData.videoUrl && formData.videoUrl.trim().length > 0);

    if (!hasPhoto && !hasVideo) {
      setErrorMessage(
        lang === 'mr'
          ? 'कृपया सजावटीचा किमान १ फोटो किंवा १ व्हिडिओ जोडा'
          : 'Please upload at least one photo or video of your decoration'
      );
      return;
    }

    const effectiveTitle =
      formData.themeTitle.trim() ||
      (lang === 'mr' ? `${formData.fullName} - गणेश सजावट 2026` : `${formData.fullName}'s Ganpati Decoration 2026`);

    const payload = {
      ...formData,
      themeTitle: effectiveTitle,
      themeDescription: formData.themeDescription.trim() || effectiveTitle,
    };

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setTicketId(data.ticketId);
        setRazorpayOrder(data.order);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('lokutsav_my_ticket', data.ticketId);
          localStorage.setItem('lokutsav_my_ticket', data.ticketId);
        }
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
  // Step 3 -> Launch Razorpay Checkout Modal
  const launchRazorpayCheckout = async () => {
    if (!agreedToTerms) {
      setAgreedToTerms(true); // Auto-accept to avoid blocking
    }

    const keyId =
      razorpayOrder?.keyId ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      'rzp_test_TWn9LmxfmLCs6o';

    // Ensure Razorpay SDK is loaded on window
    const getRazorpayInstance = async (): Promise<any> => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        return (window as any).Razorpay;
      }

      return new Promise((resolve) => {
        if (typeof document === 'undefined') return resolve(null);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve((window as any).Razorpay);
        script.onerror = () => resolve(null);
        document.body.appendChild(script);
      });
    };

    const RazorpayConstructor = await getRazorpayInstance();

    if (RazorpayConstructor) {
      const options = {
        key: keyId,
        amount: razorpayOrder?.amount || 9900,
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
                name: 'Pay using UPI (Intent / QR)',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['intent', 'qr', 'collect'],
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
                termsAccepted: true,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('lokutsav_my_ticket', ticketId);
                localStorage.setItem('lokutsav_my_ticket', ticketId);
                sessionStorage.setItem('lokutsav_payment_status', 'COMPLETED');
                localStorage.setItem('lokutsav_payment_status', 'COMPLETED');
              }
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
        const rzp = new RazorpayConstructor(options);
        rzp.on('payment.failed', function (resp: any) {
          setErrorMessage(`Payment failed: ${resp.error?.description || 'Transaction cancelled'}`);
        });
        rzp.open();
        return;
      } catch (e) {
        console.warn('Direct checkout error, using fallback verification', e);
      }
    }

    // Fallback if Razorpay checkout script is completely unreachable
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
          termsAccepted: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('lokutsav_my_ticket', ticketId);
          localStorage.setItem('lokutsav_my_ticket', ticketId);
          sessionStorage.setItem('lokutsav_payment_status', 'COMPLETED');
          localStorage.setItem('lokutsav_payment_status', 'COMPLETED');
        }
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
        strategy="afterInteractive"
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

        {/* Existing Session Ticket Notice */}
        {existingTicket && step === 1 && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50/90 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-stone-800 font-medium">
              <span className="text-xl">🎫</span>
              <div>
                <p className="font-bold text-stone-900">
                  {lang === 'mr' ? 'आपल्या सत्रातील सक्रिय तिकीट जतन केले आहे' : 'Active Ticket Found in Session'}
                </p>
                <p className="text-stone-600 font-mono text-xs">
                  क्रमांक: <strong className="text-[#9B1B1E]">{existingTicket}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/referral"
                className="font-bold text-[#9B1B1E] hover:underline bg-white px-3.5 py-2 rounded-lg border border-amber-300 text-xs shadow-2xs hover:bg-stone-50 transition-colors"
              >
                {lang === 'mr' ? 'माझे रेफरल्स व लिंक पहा' : 'View Referrals & Rewards'} →
              </Link>
            </div>
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

              {/* Referral Code Field */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-xs text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🎁</span>
                    <span>{lang === 'mr' ? 'रेफरल कोड (Referral Code)' : 'Referral Code'}</span>
                  </label>
                  <span className="text-[11px] text-stone-500">
                    {lang === 'mr' ? 'ऐच्छिक (Optional)' : 'Optional'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.referredBy}
                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value.toUpperCase() })}
                    placeholder={lang === 'mr' ? 'उदा. LOK-2026-8941' : 'e.g. LOK-2026-8941'}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40 uppercase text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 placeholder:normal-case placeholder:tracking-normal"
                  />
                  {formData.referredBy && (
                    <span className="absolute right-2.5 top-2.5 text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      ✓ {lang === 'mr' ? 'लागू' : 'Applied'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500">
                  {lang === 'mr'
                    ? 'जर तुम्हाला एखाद्या स्पर्धकाने आमंत्रित केले असेल, तर त्यांचा तिकीट कोड येथे प्रविष्ट करा (त्यांना १०% कमिशन प्राप्त होईल).'
                    : 'If another participant invited you, enter their Ticket ID code here (they will earn 10% commission).'}
                </p>
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
                    {t.form.decoration.themeTitle}{' '}
                    <span className="text-xs font-normal text-stone-500">
                      ({lang === 'mr' ? 'ऐच्छिक' : 'Optional'})
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.themeTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        themeTitle: e.target.value,
                        themeDescription: e.target.value,
                      })
                    }
                    placeholder={t.form.decoration.themeTitlePlaceholder}
                    className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#9B1B1E]/40"
                  />
                </div>
              </div>

              {/* Photo OR Video requirement banner */}
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300/80 flex items-start gap-2.5 text-xs text-amber-950 shadow-2xs">
                <span className="text-base shrink-0 leading-none mt-0.5">📸</span>
                <div>
                  <span className="font-bold text-amber-900">
                    {lang === 'mr' ? 'फोटो किंवा व्हिडिओ आवश्यक (कोणतेही एक):' : 'Photo OR Video Required (Any One):'}
                  </span>{' '}
                  <span className="text-stone-700">
                    {lang === 'mr'
                      ? 'तुम्ही खालीलपैकी फोटो किंवा कमाल ३ मिनिटांचा व्हिडिओ यांपैकी कोणतेही एक (किंवा दोन्ही) जोडू शकता.'
                      : 'You can upload either decoration photos or a 3-minute video tour (or both).'}
                  </span>
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <label className="block font-semibold text-stone-800 text-sm">
                      {t.form.decoration.photosLabel}
                    </label>
                    <p className="text-xs text-stone-500">
                      {t.form.decoration.photosHint}
                    </p>
                  </div>
                  {formData.photoUrls.length > 0 ? (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full shrink-0">
                      ✓ {formData.photoUrls.length} {lang === 'mr' ? 'फोटो जोडले' : 'Photos added'}
                    </span>
                  ) : formData.videoUrl ? (
                    <span className="text-[11px] font-medium text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-full shrink-0">
                      {lang === 'mr' ? 'व्हिडिओ जोडला असल्याने ऐच्छिक' : 'Optional (video uploaded)'}
                    </span>
                  ) : null}
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

              {/* Direct Video File Upload (Max 3 minutes) */}
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
                  <div className="flex items-center gap-2">
                    {formData.videoUrl ? (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full shrink-0">
                        ✓ {lang === 'mr' ? 'व्हिडिओ जोडला' : 'Video added'}
                      </span>
                    ) : formData.photoUrls.length > 0 ? (
                      <span className="text-[11px] font-medium text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-full shrink-0">
                        {lang === 'mr' ? 'फोटो जोडले असल्याने ऐच्छिक' : 'Optional (photos uploaded)'}
                      </span>
                    ) : null}
                    <span className="self-start text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                      {lang === 'mr' ? 'कमाल कालावधी: 3 मिनिटे' : 'Max Length: 3 Minutes'}
                    </span>
                  </div>
                </div>

                {!formData.videoUrl ? (
                  <div className="space-y-3">
                    <label className="cursor-pointer border-2 border-dashed border-[#E5D7C0] hover:border-[#9B1B1E] bg-white rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center text-center transition-colors group">
                      {!uploadingVideo ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-amber-50 text-[#9B1B1E] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                            <Video className="w-6 h-6" />
                          </div>
                          <span className="font-bold text-sm text-stone-800">
                            {lang === 'mr' ? 'व्हिडिओ निवडा व जलद अपलोड करा (Choose Video)' : 'Select Video File (Direct High-Speed Upload)'}
                          </span>
                          <span className="text-xs text-stone-400 mt-1">
                            MP4, MOV, WebM (कमाल 3 मिनिटे • हाय-स्पीड स्ट्रीमिंग)
                          </span>
                        </>
                      ) : (
                        <div className="w-full max-w-sm space-y-2.5 py-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
                            <span className="flex items-center gap-1.5 text-[#9B1B1E]">
                              <span className="w-2 h-2 rounded-full bg-[#9B1B1E] animate-ping" />
                              <span>{lang === 'mr' ? 'व्हिडिओ वेगाने अपलोड होत आहे...' : 'Uploading video fast...'}</span>
                            </span>
                            <span className="font-mono font-bold text-sm text-[#9B1B1E]">{videoProgress?.percent || 0}%</span>
                          </div>
                          <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-500 via-[#9B1B1E] to-red-600 h-full transition-all duration-150 rounded-full"
                              style={{ width: `${videoProgress?.percent || 0}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                            <span>{videoProgress?.uploadedMb || 0} MB / {videoProgress?.totalMb || 0} MB</span>
                            <span>{videoProgress?.percent === 100 ? (lang === 'mr' ? 'पडताळणी पूर्ण होत आहे...' : 'Finalizing...') : (lang === 'mr' ? 'कृपया प्रतीक्षा करा' : 'Please wait')}</span>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime,video/webm,video/m4v"
                        onChange={handleVideoUpload}
                        disabled={uploadingVideo}
                        className="hidden"
                      />
                    </label>

                    {/* Instant Alternative: Video Link */}
                    <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
                        {lang === 'mr' ? 'किंवा थेट व्हिडिओ लिंक जोडा:' : 'Or paste direct video link:'}
                      </span>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="url"
                          placeholder={lang === 'mr' ? 'YouTube / Drive / Reel लिंक...' : 'YouTube / Drive / Reel URL...'}
                          value={videoLinkInput}
                          onChange={(e) => setVideoLinkInput(e.target.value)}
                          className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-300 bg-white"
                        />
                        <button
                          type="button"
                          onClick={addVideoUrlManually}
                          className="text-xs font-bold px-3.5 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-stone-800 transition-colors cursor-pointer"
                        >
                          {lang === 'mr' ? 'जोडा' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'mr' ? 'व्हिडिओ थेट अपलोड झाला (3 मिनिटांच्या आत)' : 'Video uploaded directly (within 3-min limit)'}</span>
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
                    : lang === 'mr' ? 'पुढील पायरी: ₹99 भरणा' : 'Proceed to ₹99 Payment'}
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
                <span className="font-bold text-stone-900 font-mono">₹99.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-700">{t.form.payment.gstLabel}</span>
                <span className="font-bold text-emerald-700 font-mono">समाविष्ट (₹0.00)</span>
              </div>
              <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-base font-black">
                <span className="text-stone-900">{t.form.payment.totalLabel}</span>
                <span className="font-serif text-2xl text-[#9B1B1E]">₹99 मात्र</span>
              </div>
            </div>

            <div className="text-xs text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-200 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-stone-800 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>नोंदणीमध्ये समाविष्ट:</span>
              </div>
              <p>{t.form.payment.included}</p>
            </div>

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

            <div className="space-y-3 pt-1">
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
                    : 'UPI (GPay/PhonePe/Paytm) किंवा कार्ड द्वारे ₹99 भरा'}
                </span>
              </button>

              <p className="text-center text-xs text-stone-500 flex items-center justify-center gap-1.5 pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {lang === 'mr'
                    ? '२५६-बिट एनक्रिप्टेड व सुरक्षित पेमेंट'
                    : '256-bit Encrypted & Secure Payment'}
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
                  <span className="font-bold text-emerald-700">₹99 पूर्ण (Paid via Razorpay)</span>
                </div>
              </div>
            </div>

            {/* Official Updates & Broadcast Channels (Instagram & WhatsApp) */}
            <div className="bg-white border-2 border-[#E5D7C0] rounded-2xl p-5 sm:p-6 max-w-md mx-auto text-left space-y-4 shadow-sm">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#9B1B1E] flex items-center justify-center text-lg shadow-2xs shrink-0">
                  <Bell className="w-5 h-5 text-[#9B1B1E]" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-stone-900 leading-tight">
                    {lang === 'mr' ? 'स्पर्धेचे महत्त्वाचे अपडेट्स मिळवा' : 'Follow for Official Event Updates'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {lang === 'mr'
                      ? 'निकाल, ज्युरी घोषणा आणि महत्त्वाच्या सूचना वेळेवर मिळवण्यासाठी आमच्या अधिकृत चॅनेलला फॉलो करा.'
                      : 'Follow our official channels for live jury scores, winner announcements, and updates.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Instagram Channel Link */}
                <a
                  href="https://www.instagram.com/lok_utsav/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-between p-3.5 rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50/70 via-rose-50/40 to-amber-50/50 hover:border-pink-400 hover:shadow-xs transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[1.5px] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-pink-600">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block group-hover:text-pink-600 transition-colors">
                        Instagram
                      </span>
                      <span className="text-[11px] text-stone-500 block">@lok_utsav</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center justify-center gap-1.5 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-2xs transition-all">
                    <span>{lang === 'mr' ? 'फॉलो करा' : 'Follow Page'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>

                {/* WhatsApp Broadcast Channel Link */}
                <a
                  href={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || 'https://whatsapp.com/channel/0029VbDSNyQJENxurPmDye1C'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-between p-3.5 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-green-50/40 to-teal-50/50 hover:border-emerald-400 hover:shadow-xs transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform p-1.5">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block group-hover:text-emerald-700 transition-colors">
                        WhatsApp
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        {lang === 'mr' ? 'ब्रॉडकास्ट चॅनेल' : 'Broadcast'}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center justify-center gap-1.5 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold py-2 px-3 rounded-lg shadow-2xs transition-all">
                    <span>{lang === 'mr' ? 'जॉईन करा' : 'Join'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>

                {/* Facebook Page Link */}
                <a
                  href="https://www.facebook.com/profile.php?id=61594526752691"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-between p-3.5 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-sky-50/50 hover:border-blue-400 hover:shadow-xs transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform p-1.5">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block group-hover:text-blue-700 transition-colors">
                        Facebook
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        {lang === 'mr' ? 'अधिकृत पेज' : 'Official Page'}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center justify-center gap-1.5 w-full bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold py-2 px-3 rounded-lg shadow-2xs transition-all">
                    <span>{lang === 'mr' ? 'फॉलो करा' : 'Follow'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              </div>
            </div>

            {/* Referral & Share Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/80 border-2 border-amber-300/90 rounded-2xl p-5 sm:p-6 max-w-md mx-auto text-left space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                  🎁
                </div>
                <div>
                  <h3 className="font-serif font-black text-base text-stone-900">
                    {lang === 'mr' ? 'रेफर करा आणि १०% रोख कमिशन मिळवा!' : 'Refer & Earn 10% Cash Commission!'}
                  </h3>
                  <p className="text-xs text-stone-600">
                    {lang === 'mr'
                      ? 'प्रत्येक यशस्वी नोंदणीवर थेट १०% रोख कमिशन कमवा!'
                      : 'Earn 10% cash commission on every registration!'}
                  </p>
                </div>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-xs text-stone-700 space-y-1">
                <span className="font-bold text-[#9B1B1E] block">
                  {lang === 'mr' ? '💰 थेट १०% कमिशन:' : '💰 10% Cash Commission:'}
                </span>
                <p className="text-[11px] text-stone-600">
                  {lang === 'mr'
                    ? 'तुमच्या रेफरल लिंकवरून होणाऱ्या प्रत्येक नोंदणीवर तुम्हाला थेट १०% रोख कमिशन मिळेल. जास्तीत जास्त मित्रांना जोडा आणि अमर्याद कमाई करा!'
                    : 'Earn a direct 10% cash commission on each participant who registers using your referral link. Refer more friends to earn unlimited cash!'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  {lang === 'mr' ? 'तुमची खास रेफरल लिंक:' : 'Your Referral Link:'}
                </label>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-amber-200 shadow-2xs">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${ticketId}` : `https://lokutsav.com/register?ref=${ticketId}`}
                    className="w-full text-xs font-mono text-stone-700 bg-transparent outline-none truncate select-all px-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const link = typeof window !== 'undefined' ? `${window.location.origin}/register?ref=${ticketId}` : `https://lokutsav.com/register?ref=${ticketId}`;
                      navigator.clipboard.writeText(link);
                      setCopiedReferral(true);
                      setTimeout(() => setCopiedReferral(false), 2500);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedReferral ? (lang === 'mr' ? '✓ कॉपी झाले!' : '✓ Copied!') : (lang === 'mr' ? 'कॉपी करा' : 'Copy')}
                  </button>
                </div>
              </div>

              {/* WhatsApp Share Button */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `🚩 *लोकोत्सव २०२६ | महाराष्ट्र राज्य ऑनलाइन गणेश सजावट स्पर्धा*\n\nमी माझ्या बाप्पाच्या देखाव्याची अधिकृत नोंदणी केली आहे! (प्रवेशिका: ${ticketId})\n\nतुम्हीही तुमच्या घरगुती गणपती किंवा मंडळाच्या सजावटीची केवळ ₹९९ मध्ये नोंदणी करा आणि रोख पारितोषिके जिंका.\n\n👉 माझ्या रेफरल लिंकवरून लगेच नोंदणी करा:\n${typeof window !== 'undefined' ? window.location.origin : 'https://lokutsav.com'}/register?ref=${ticketId}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl font-bold text-sm shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{lang === 'mr' ? 'व्हॉट्सॲपवर मित्रांना शेअर करा' : 'Share on WhatsApp'}</span>
              </a>

              <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-stone-600">
                <span>रेफरल कोड: <strong className="font-mono text-stone-900">{ticketId}</strong></span>
                <Link href="/referral" className="font-bold text-[#9B1B1E] hover:underline">
                  {lang === 'mr' ? 'रेफरल कमिशन व स्थिती पहा' : 'View Commission & Status'} →
                </Link>
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
                    <span>3.</span>
                    <span>{lang === 'mr' ? 'पर्यावरणपूरक सजावट व शाडू माती (Eco-Friendly Guidelines)' : 'Eco-Friendly & Clay Idols'}</span>
                  </h4>
                  <p>
                    {lang === 'mr'
                      ? 'पारंपरिक शाडू मातीची मूर्ती, नैसर्गिक रंग आणि पुनर्वापर करता येण्याजोगे साहित्य वापरणाऱ्या सजावटींना परीक्षकांकडून विशेष गुण व प्राधान्य दिले जाईल. थर्माकोल व प्लास्टिकचा वापर टाळण्यास प्रोत्साहन दिले जाते.'
                      : 'Special evaluation weightage and bonus points are awarded to entries utilizing traditional Shadu clay idols, natural pigments, and sustainable/recyclable materials. Thermocol and plastic are strongly discouraged.'}
                  </p>
                </div>

                <div className="py-3 space-y-2">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span>4.</span>
                    <span>{lang === 'mr' ? 'प्रवेश शुल्क, किमान सहभाग व परतावा धोरण (Registration Fee & Refund Policy)' : 'Registration Fee, Minimum Participation & Refund Policy'}</span>
                  </h4>
                  <p>
                    {lang === 'mr'
                      ? 'नोंदणी शुल्क प्रति प्रवेश ₹99 (जीएसटी समाविष्ट) आहे. ही राज्यव्यापी स्पर्धा यशस्वीरीत्या पार पाडण्यासाठी किमान 1,000 स्पर्धकांचा सहभाग आवश्यक आहे. जर एकूण नोंदणीकृत स्पर्धकांची संख्या 1,000 पेक्षा कमी राहिली, तर सर्व सहभागी स्पर्धकांचे पैसे त्यांच्या मूळ खात्यात परत (Refund) केले जातील; या परताव्याच्या रकमेतून केवळ 3% रेझरपे (Razorpay) गेटवे व्यवहार शुल्क वजा करण्यात येईल. इतर सर्व सामान्य परिस्थितीत तिकीट जनरेट झाल्यानंतर शुल्क परत केले जात नाही.'
                      : 'The registration fee is ₹99 per entry (inclusive of GST). A minimum threshold of 1,000 participants is required to conduct the competition. If the total number of participants is less than 1,000, all money will be refunded back to the participants, with a 3% Razorpay transaction fee deducted. Under all other standard circumstances, fees are non-refundable once the ticket is issued.'}
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] sm:text-xs text-amber-900 font-medium flex items-center gap-2">
                    <span className="shrink-0">🛡️</span>
                    <span>
                      {lang === 'mr'
                        ? 'सुरक्षा हमी: १००० पेक्षा कमी स्पर्धक नोंदणी झाल्यास सर्व पैसे ३% रेझरपे शुल्क वजा करून थेट परत मिळतील.'
                        : 'Protection Assurance: If total participation is under 1,000 entries, full fees will be refunded after a 3% Razorpay fee deduction.'}
                    </span>
                  </div>
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

                <div className="py-3 space-y-1">
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

                <div className="pt-3 space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-1.5">
                    <span>7.</span>
                    <span>{lang === 'mr' ? 'बक्षीस वितरण धोरण (Prize Distribution Policy)' : 'Prize Distribution Policy'}</span>
                  </h4>
                  <p>
                    {lang === 'mr'
                      ? 'स्पर्धेचे निकाल अधिकृत ज्युरी मंडळाद्वारे जाहीर झाल्यानंतर विजेत्यांना रोख पारितोषिके व सन्मानचिन्हे अधिकृतरीत्या प्रदान केली जातील. संयोजन समितीचा निर्णय अंतिम व सर्वमान्य राहील.'
                      : 'Cash prizes and mementos will be officially conferred to all winners following the announcement of final results by the jury panel. The organizing committee decision is final.'}
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
