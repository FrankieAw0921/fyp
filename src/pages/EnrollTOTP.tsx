import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hospital } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [totpToken, setTotpToken] = useState('');
  const [showMFAScreen, setShowMFAScreen] = useState(true)
  const [totpQr, setQR] = useState('')
  const [factorId, setFactorId] = useState('')
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { session, signIn } = useAuth();

  // if (!session)
  //   return <Navigate to="/login" />

  useEffect(() => {
    ; (async () => {
      try {
        const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
        if (error) {
          throw error
        }

        console.log(data)

        if (data.nextLevel === 'aal1') {
          setShowMFAScreen(true)
          const { data, error } = await supabase.auth.mfa.enroll({
            factorType: 'totp',
          })
          if (error) {
            throw error
          }
    
          setFactorId(data.id)
    
          // Supabase Auth returns an SVG QR code which you can convert into a data
          // URL that you can place in an <img> tag.
          setQR(data.totp.qr_code)
        } else {
          setShowMFAScreen(false)
        }
      } catch {

      }
    })()
  }, [])

  const onEnableClicked = () => {
    setError('')
    ;(async () => {
      const challenge = await supabase.auth.mfa.challenge({ factorId })
      if (challenge.error) {
        setError(challenge.error.message)
        throw challenge.error
      }

      const challengeId = challenge.data.id

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: totpToken,
      })
      if (verify.error) {
        setError(verify.error.message)
        throw verify.error
      } else {
        navigate("/dashboard")
      }
    })()
  }

  if (!showMFAScreen)
    return <Navigate to="/dashboard" />

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="flex justify-center">
            <Hospital className="h-12 w-12 text-blue-600" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Setup 2FA Authentication
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className='flex justify-center'>
            <img src={totpQr}/>
            </div>
            <div>Please enter the code from your authenticator app.</div>
            <div>
              <label htmlFor="token" className="sr-only">
                2FA Code
              </label>
              <input
                id="token"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="2FA Token"
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button onClick={() => onEnableClicked()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}