import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Atom,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import './Login.css'

const ELEMENTS = [
  'H',
  'He',
  'C',
  'N',
  'O',
  'F',
  'Ne',
  'Na',
  'Mg',
  'Al',
  'Si',
  'P',
  'S',
  'Cl',
  'Ar',
  'K',
  'Ca',
  'Fe',
  'Cu',
  'Zn',
]

function ChemicalParticle({ particle }) {
  return (
    <span
      style={{
        position: 'absolute',
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        transform: 'translate(-50%, -50%)',
        color: particle.color,
        fontSize: particle.size,
        fontWeight: 800,
        opacity: particle.opacity,
        textShadow: `0 0 18px ${particle.color}`,
        animation: `chemicalFloat ${particle.duration}s ease-in-out infinite`,
        animationDelay: `${particle.delay}s`,
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {particle.symbol}
    </span>
  )
}

function MoleculeAnimation() {
  const particles = useMemo(
    () =>
      ELEMENTS.map((symbol, index) => ({
        symbol,
        x: 5 + ((index * 17) % 90),
        y: 8 + ((index * 29) % 84),
        size: 13 + ((index * 7) % 13),
        opacity: 0.2 + ((index * 3) % 6) / 10,
        duration: 5 + (index % 5),
        delay: -(index % 6),
        color:
          index % 4 === 0
            ? '#60a5fa'
            : index % 4 === 1
              ? '#a78bfa'
              : index % 4 === 2
                ? '#22d3ee'
                : '#f472b6',
      })),
    [],
  )

  return (
    <div
      className="login-chemical-animation"
      aria-hidden="true"
    >
      <div className="login-grid" />

      <div className="login-orbit orbit-one">
        <div className="orbit-electron" />
      </div>

      <div className="login-orbit orbit-two">
        <div className="orbit-electron" />
      </div>

      <div className="login-orbit orbit-three">
        <div className="orbit-electron" />
      </div>

      <div className="login-nucleus">
        <div className="nucleus-core">
          <Atom size={42} />
        </div>
      </div>

      {particles.map((particle, index) => (
        <ChemicalParticle
          key={`${particle.symbol}-${index}`}
          particle={particle}
        />
      ))}

      <div className="chemical-bond bond-one" />
      <div className="chemical-bond bond-two" />
      <div className="chemical-bond bond-three" />
      <div className="chemical-bond bond-four" />
    </div>
  )
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('email')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    document.title =
      step === 'otp'
        ? 'Verify OTP | AI Chemistry Tutor'
        : 'AI Chemistry Tutor | Login'

    return () => {
      document.title = 'AI Chemistry Tutor'
    }
  }, [step])

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined
    }

    const timer = setInterval(() => {
      setCooldown((current) => {
        if (current <= 1) {
          clearInterval(timer)
          return 0
        }

        return current - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  function showError(error) {
    console.error('Supabase Auth Error:', error)

    const errorMessage =
      error?.message ||
      error?.error_description ||
      'Unable to complete authentication.'

    setIsError(true)
    setMessage(errorMessage)
  }

  async function sendOtp(targetEmail = email) {
    const cleanEmail = targetEmail.trim().toLowerCase()

    if (!cleanEmail) {
      setIsError(true)
      setMessage('Please enter your email address.')
      return false
    }

    if (!cleanEmail.includes('@')) {
      setIsError(true)
      setMessage('Please enter a valid email address.')
      return false
    }

    if (cooldown > 0) {
      setIsError(true)
      setMessage(
        `Please wait ${cooldown} seconds before requesting another code.`,
      )
      return false
    }

    setIsLoading(true)
    setMessage('')
    setIsError(false)

    try {
      const { data, error } =
        await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true,
          },
        })

      console.log('OTP request response:', data)

      if (error) {
        showError(error)
        return false
      }

      setEmail(cleanEmail)
      setOtp('')
      setStep('otp')
      setCooldown(60)

      setIsError(false)
      setMessage(
        '8-digit verification code sent. Check your email inbox and spam folder.',
      )

      return true
    } catch (error) {
      showError(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault()
    await sendOtp()
  }

  async function verifyOtp(event) {
    event.preventDefault()

    const cleanOtp = otp.replace(/\D/g, '')

    if (cleanOtp.length !== 8) {
      setIsError(true)
      setMessage(
        'Please enter the 8-digit verification code.',
      )
      return
    }

    setIsLoading(true)
    setMessage('')
    setIsError(false)

    try {
      const { data, error } =
        await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: cleanOtp,
          type: 'email',
        })

      console.log('OTP verification response:', data)

      if (error) {
        showError(error)
        return
      }

      if (!data?.session) {
        throw new Error(
          'Verification succeeded, but Supabase did not return an active session.',
        )
      }

      setIsError(false)
      setMessage('Login successful.')

      if (onLogin) {
        await onLogin(data.session)
      }
    } catch (error) {
      showError(error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleOtpChange(event) {
    const value = event.target.value
      .replace(/\D/g, '')
      .slice(0, 8)

    setOtp(value)
    setMessage('')
    setIsError(false)
  }

  function backToEmail() {
    setStep('email')
    setOtp('')
    setMessage('')
    setIsError(false)
  }

  async function resendOtp() {
    if (cooldown > 0 || isLoading) {
      return
    }

    await sendOtp(email)
  }

  return (
    <main className="login-page">
      <MoleculeAnimation />

      <div className="login-overlay" />

      <section className="login-content">
        <div className="login-brand">
          <div className="login-brand-icon">
            <Atom size={25} />
          </div>

          <div>
            <strong>AI Chemistry Tutor</strong>
            <span>Interactive Chemistry Learning</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-glow" />

          {step === 'email' ? (
            <>
              <div className="login-header">
                <div className="login-badge">
                  <Sparkles size={14} />
                  WELCOME BACK
                </div>

                <h1>
                  Enter the
                  <span>Chemistry Lab</span>
                </h1>

                <p>
                  Sign in with your email and receive a
                  secure one-time verification code.
                </p>
              </div>

              <form
                className="login-form"
                onSubmit={handleEmailSubmit}
              >
                <label htmlFor="login-email">
                  Email address
                </label>

                <div className="login-input-wrapper">
                  <Mail size={19} />

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setMessage('')
                      setIsError(false)
                    }}
                    placeholder="student@example.com"
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>

                <button
                  className="login-button"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="login-spinner" />
                      Sending verification code...
                    </>
                  ) : (
                    <>
                      Continue with Email
                      <span>→</span>
                    </>
                  )}
                </button>

                {message && (
                  <div
                    className="login-message"
                    style={{
                      color: isError
                        ? '#fca5a5'
                        : '#86efac',
                      borderColor: isError
                        ? 'rgba(248,113,113,0.25)'
                        : 'rgba(74,222,128,0.2)',
                    }}
                  >
                    {message}
                  </div>
                )}
              </form>

              <div className="login-security">
                <ShieldCheck size={17} />

                <div>
                  <strong>
                    Secure passwordless login
                  </strong>

                  <span>
                    We use a one-time verification code
                    instead of storing your password.
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="login-header">
                <div className="login-badge">
                  <ShieldCheck size={14} />
                  VERIFY YOUR IDENTITY
                </div>

                <h1>
                  Check your
                  <span>email</span>
                </h1>

                <p>
                  We sent an 8-digit verification code to:
                </p>

                <strong
                  style={{
                    display: 'block',
                    marginTop: 10,
                    color: '#c4b5fd',
                    wordBreak: 'break-word',
                  }}
                >
                  {email}
                </strong>
              </div>

              <form
                className="login-form"
                onSubmit={verifyOtp}
              >
                <label htmlFor="login-otp">
                  Verification code
                </label>

                <div className="login-input-wrapper">
                  <ShieldCheck size={19} />

                  <input
                    id="login-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="00000000"
                    maxLength={8}
                    disabled={isLoading}
                    autoFocus
                    style={{
                      letterSpacing: 6,
                      fontSize: 21,
                      fontWeight: 800,
                    }}
                  />
                </div>

                <button
                  className="login-button"
                  type="submit"
                  disabled={
                    isLoading || otp.length !== 8
                  }
                >
                  {isLoading ? (
                    <>
                      <span className="login-spinner" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Enter Lab
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>

                {message && (
                  <div
                    className="login-message"
                    style={{
                      color: isError
                        ? '#fca5a5'
                        : '#86efac',
                      borderColor: isError
                        ? 'rgba(248,113,113,0.25)'
                        : 'rgba(74,222,128,0.2)',
                    }}
                  >
                    {message}
                  </div>
                )}
              </form>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                  marginTop: 18,
                }}
              >
                <button
                  type="button"
                  onClick={backToEmail}
                  disabled={isLoading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    border: 0,
                    background: 'transparent',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: 5,
                    fontSize: 12,
                  }}
                >
                  <ArrowLeft size={15} />
                  Change email
                </button>

                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={cooldown > 0 || isLoading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    border: 0,
                    background: 'transparent',
                    color:
                      cooldown > 0
                        ? '#475569'
                        : '#a5b4fc',
                    cursor:
                      cooldown > 0
                        ? 'not-allowed'
                        : 'pointer',
                    padding: 5,
                    fontSize: 12,
                  }}
                >
                  <RefreshCw size={14} />

                  {cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : 'Resend code'}
                </button>
              </div>

              <div className="login-security">
                <ShieldCheck size={17} />

                <div>
                  <strong>Almost inside the lab</strong>

                  <span>
                    Enter the latest code from your email.
                    Codes expire for security.
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="login-divider">
            <span>CHEMISTRY LAB</span>
          </div>

          <div className="login-mini-stats">
            <div>
              <strong>118</strong>
              <span>Elements</span>
            </div>

            <div>
              <strong>3D</strong>
              <span>Atom Lab</span>
            </div>

            <div>
              <strong>AI</strong>
              <span>Tutor</span>
            </div>
          </div>
        </div>

        <p className="login-footer">
          Built for 11th & 12th standard Chemistry learning
        </p>
      </section>
    </main>
  )
}