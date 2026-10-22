import { SignIn } from "@clerk/nextjs";
import AuthLayout from "@/app/components/auth/AuthLayout";
import { clerkCustomAppearance } from "@/app/components/auth/clerkAppearance";

export default function SignInPage() {
  return (
    <AuthLayout mode="sign-in">
      <SignIn appearance={clerkCustomAppearance} />
    </AuthLayout>
  );
}
