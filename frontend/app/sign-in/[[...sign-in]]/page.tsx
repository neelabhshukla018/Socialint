import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-[#080b12] bg-grid-dashboard p-4 transition-colors duration-150">
      <SignIn />
    </div>
  );
}
