import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../api';
import { useAuthStore } from '../store/authStore';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '../constants';

// ─── Constants ────────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;
const OTP_COUNTDOWN_SECONDS = 60;

interface CountryCode {
  flag: string;
  code: string;
  dial: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { flag: '🇮🇳', code: 'IN', dial: '+91' },
];

type Step = 'phone' | 'otp';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<Step>('phone');

  // Phone step
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [phone, setPhone] = useState('');

  // OTP step
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Store
  const { loginWithOtp, isLoading, error, clearError } = useAuthStore();
  const [sendingOtp, setSendingOtp] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const fullPhone = `${selectedCountry.dial}${phone}`;
  const isPhoneValid = phone.replace(/\D/g, '').length >= 7;
  const otpValue = otp.join('');
  const isOtpComplete = otpValue.length === OTP_LENGTH;

  // ── Countdown ───────────────────────────────────────────────────────────────

  const startCountdown = useCallback(() => {
    setCountdown(OTP_COUNTDOWN_SECONDS);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  // ── Send OTP ─────────────────────────────────────────────────────────────────

  const handleSendOtp = async () => {
    if (!isPhoneValid || sendingOtp) return;
    Keyboard.dismiss();
    setSendError(null);
    setSendingOtp(true);
    try {
      await authService.sendOtp(fullPhone);
      setStep('otp');
      startCountdown();
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  // ── Resend ───────────────────────────────────────────────────────────────────

  const handleResend = async () => {
    if (countdown > 0 || sendingOtp) return;
    setSendError(null);
    setSendingOtp(true);
    setOtp(Array(OTP_LENGTH).fill(''));
    try {
      await authService.sendOtp(fullPhone);
      startCountdown();
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Failed to resend OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  // ── OTP input ────────────────────────────────────────────────────────────────

  const handleOtpChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      const updated = [...otp];
      updated[index - 1] = '';
      setOtp(updated);
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ── Verify ───────────────────────────────────────────────────────────────────

  const handleVerifyOtp = async () => {
    if (!isOtpComplete || isLoading) return;
    clearError();
    try {
      await loginWithOtp(fullPhone, otpValue);
      onLoginSuccess?.();
    } catch { /* error shown via store */ }
  };

  // ── Change number ────────────────────────────────────────────────────────────

  const handleChangeNumber = () => {
    setStep('phone');
    setOtp(Array(OTP_LENGTH).fill(''));
    clearError();
    setSendError(null);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(0);
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Brand ── */}
          <View style={styles.brand}>
            <View style={styles.logoRing}>
              <Text style={styles.logoText}>UK</Text>
            </View>
            <Text style={styles.appName}>Urban Kashmir</Text>
            <Text style={styles.tagline}>Authentic crafts, delivered.</Text>
          </View>

          {step === 'phone' ? (
            // ────── PHONE STEP ──────
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Enter Your Number</Text>
              <Text style={styles.cardSub}>
                We'll send a one-time code to verify your identity.
              </Text>

              {/* Label */}
              <Text style={styles.label}>Mobile Number</Text>

              {/* Country + Phone row */}
              <View style={styles.phoneRow}>
                <TouchableOpacity
                  style={styles.countryBtn}
                  onPress={() => setShowCountryPicker(!showCountryPicker)}
                  activeOpacity={0.7}>
                  <Text style={styles.flag}>{selectedCountry.flag}</Text>
                  <Text style={styles.dial}>{selectedCountry.dial}</Text>
                  <Text style={styles.caret}>▾</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone number"
                  placeholderTextColor={COLORS.gray}
                  keyboardType="phone-pad"
                  maxLength={15}
                  returnKeyType="done"
                  onSubmitEditing={handleSendOtp}
                />
              </View>

              {/* Country dropdown */}
              {showCountryPicker && (
                <View style={styles.dropdown}>
                  {COUNTRY_CODES.map(c => (
                    <TouchableOpacity
                      key={c.code}
                      style={styles.dropdownItem}
                      onPress={() => { setSelectedCountry(c); setShowCountryPicker(false); }}>
                      <Text style={styles.dropdownFlag}>{c.flag}</Text>
                      <Text style={styles.dropdownDial}>{c.dial}</Text>
                      <Text style={styles.dropdownCode}>{c.code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {sendError ? <Text style={styles.errorText}>{sendError}</Text> : null}

              <TouchableOpacity
                style={[styles.primaryBtn, !isPhoneValid && styles.primaryBtnDisabled]}
                onPress={handleSendOtp}
                disabled={!isPhoneValid || sendingOtp}
                activeOpacity={0.85}>
                {sendingOtp
                  ? <ActivityIndicator color={COLORS.background} size="small" />
                  : <Text style={styles.primaryBtnText}>Send OTP</Text>}
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                By continuing you agree to our{' '}
                <Text style={styles.link}>Terms of Service</Text> and{' '}
                <Text style={styles.link}>Privacy Policy</Text>.
              </Text>
            </View>
          ) : (
            // ────── OTP STEP ──────
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Verify Your Number</Text>
              <Text style={styles.cardSub}>
                Enter the 6-digit code sent to{'\n'}
                <Text style={styles.phoneHighlight}>{fullPhone}</Text>
              </Text>

              {/* OTP boxes */}
              <Text style={styles.label}>One-Time Password</Text>
              <View style={styles.otpRow}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={ref => { otpRefs.current[idx] = ref; }}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                    value={digit}
                    onChangeText={t => handleOtpChange(t, idx)}
                    onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, idx)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    caretHidden
                    selectTextOnFocus
                  />
                ))}
              </View>

              {(error || sendError) && (
                <Text style={styles.errorText}>{error || sendError}</Text>
              )}

              {/* Resend */}
              <View style={styles.resendRow}>
                {countdown > 0 ? (
                  <Text style={styles.countdownText}>
                    Resend code in <Text style={styles.countdownNum}>{countdown}s</Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResend} disabled={sendingOtp}>
                    <Text style={styles.resendText}>
                      {sendingOtp ? 'Sending…' : 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, !isOtpComplete && styles.primaryBtnDisabled]}
                onPress={handleVerifyOtp}
                disabled={!isOtpComplete || isLoading}
                activeOpacity={0.85}>
                {isLoading
                  ? <ActivityIndicator color={COLORS.background} size="small" />
                  : <Text style={styles.primaryBtnText}>Verify & Continue</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={styles.changeNumberBtn} onPress={handleChangeNumber}>
                <Text style={styles.changeNumberText}>← Change number</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Styles — matches the app's light-theme design system ────────────────────

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,   // white, same as EditProfileScreen wrapper
  },
  kav: {
    flex: 1,
    backgroundColor: COLORS.lightGray,    // #F3F4F6 container background
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },

  // ── Brand ──────────────────────────────────────────────────────────────────
  brand: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 1,
  },
  appName: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginTop: 4,
  },

  // ── Card — white rounded panel, same as EditProfileScreen sections ─────────
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: SPACING.lg,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  cardSub: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  phoneHighlight: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semiBold,
  },

  // ── Form label — matches EditProfileScreen label ───────────────────────────
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  // ── Phone row ──────────────────────────────────────────────────────────────
  phoneRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    height: 56,
    gap: SPACING.sm,
  },
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,    // same as inputContainer in EditProfileScreen
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    gap: 4,
  },
  flag: {
    fontSize: 20,
  },
  dial: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  caret: {
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.regular,
  },

  // ── Country dropdown ───────────────────────────────────────────────────────
  dropdown: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  dropdownFlag: { fontSize: 20 },
  dropdownDial: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    width: 44,
  },
  dropdownCode: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },

  // ── OTP boxes ──────────────────────────────────────────────────────────────
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  otpBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    color: COLORS.text,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  otpBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },

  // ── Resend ─────────────────────────────────────────────────────────────────
  resendRow: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  countdownText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  countdownNum: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
  resendText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
  },

  // ── Primary button — matches saveButton in EditProfileScreen ──────────────
  primaryBtn: {
    backgroundColor: COLORS.darkGray,
    paddingVertical: SPACING.md,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  primaryBtnDisabled: {
    opacity: 0.4,
  },
  primaryBtnText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: 0.3,
  },

  // ── Footer ─────────────────────────────────────────────────────────────────
  disclaimer: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  changeNumberBtn: {
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  changeNumberText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },

  // ── Error ──────────────────────────────────────────────────────────────────
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
});
