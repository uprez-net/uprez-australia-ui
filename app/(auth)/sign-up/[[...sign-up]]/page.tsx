import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen p-24'>
      <SignUp fallbackRedirectUrl={`/organisation/create`} />
    </main>
  );
}
