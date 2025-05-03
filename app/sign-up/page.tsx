import Register from "../AppComponents/SignUp/register";

export default function SignUpPage() {
  return(
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-r from-indigo-200 via-indigo-300 to-violet-300">
    <div className="w-full max-w-sm">
      <Register />
    </div>
  </div>
  )
}