import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ShoppingBag, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") as "seller" | "customer" || "customer";
  const navigate = useNavigate();
  const { verifyOtp, setRole } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const { error } = await verifyOtp(email, otp);
      if (error) {
        toast.error(error.message || "Invalid code. Please try again.");
        return;
      }
      setRole(role);
      toast.success("Account verified! Welcome to CapeCart!");
      navigate(role === "seller" ? "/seller/categories" : "/customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-4 pt-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-16 pb-6 max-w-md mx-auto w-full">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Verify your email</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          We've sent a 6-digit verification code to{" "}
          <span className="font-semibold text-foreground">{email}</span>
        </p>

        <div className="mb-8">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-14 text-lg rounded-xl" />
              <InputOTPSlot index={1} className="w-12 h-14 text-lg rounded-xl" />
              <InputOTPSlot index={2} className="w-12 h-14 text-lg rounded-xl" />
              <InputOTPSlot index={3} className="w-12 h-14 text-lg rounded-xl" />
              <InputOTPSlot index={4} className="w-12 h-14 text-lg rounded-xl" />
              <InputOTPSlot index={5} className="w-12 h-14 text-lg rounded-xl" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          onClick={handleVerify}
          disabled={loading || otp.length !== 6}
          className="w-full h-12 rounded-xl text-base font-semibold"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </Button>

        <p className="mt-6 text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <button className="text-primary font-semibold hover:underline">Resend</button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
