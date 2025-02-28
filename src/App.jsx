import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

 function onCaptchVerify() {
  if (!auth) {
    console.error("Firebase Auth is not initialized!");
    return;
  }

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier( auth,"recaptcha-container", {
      size: "invisible",
      callback: (response) => {
        console.log("reCAPTCHA verified!");
        onSignup();
      },
      "expired-callback": () => {
        console.log("reCAPTCHA expired. Please try again.");
      },
    });

    // window.recaptchaVerifier.verify().catch((error) => {
    //   console.error("reCAPTCHA verification failed:", error);
    // });
  }
}

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <section className="bg-emerald-500 flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white font-medium text-2xl sm:text-3xl">
            👍 Login Success
          </h2>
        ) : (
          <div className="w-full flex flex-col gap-4 rounded-lg p-6 bg-white shadow-lg">
            <h1 className="text-center text-2xl sm:text-3xl font-medium text-emerald-600 mb-4">
              Welcome to <br /> Mobile OTP Authentication
            </h1>
            {showOTP ? (
              <>
                <div className="bg-emerald-100 text-emerald-600 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label className="font-bold text-lg text-emerald-600 text-center">
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="otp-container w-full"
                />
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-2 items-center justify-center py-3 text-white rounded-md hover:bg-emerald-700 transition"
                >
                  {loading && <CgSpinner size={20} className="animate-spin" />}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-emerald-100 text-emerald-600 w-fit mx-auto p-4 rounded-full">
                  <BsTelephoneFill size={30} />
                </div>
                <label className="font-bold text-lg text-emerald-600 text-center">
                  Verify your phone number
                </label>
                <PhoneInput country={"in"} value={ph} onChange={setPh} className="w-full" />
                <button
                  onClick={onSignup}
                  className="bg-emerald-600 w-full flex gap-2 items-center justify-center py-3 text-white rounded-md hover:bg-emerald-700 transition"
                >
                  {loading && <CgSpinner size={20} className="animate-spin" />}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
  
};

export default App;