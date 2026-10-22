import { SignUp } from "@clerk/nextjs";
import AuthLayout from "@/app/components/auth/AuthLayout";
import { clerkCustomAppearance } from "@/app/components/auth/clerkAppearance";

export default function SignUpPage() {
  return (
    <AuthLayout mode="sign-up">
      <SignUp appearance={clerkCustomAppearance} />
    </AuthLayout>
  );
}
