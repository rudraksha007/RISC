'use client';
import { useEffect, useState } from 'react';
import { signIn, useSession } from "next-auth/react";
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AuthForm() {
  const [isActive, setIsActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const session = useSession();
  const pathName = usePathname();
  const toggleForm = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (session.data?.user && pathName == '/login') router.push('/dashboard');
    else if (pathName != '/login') router.push('/login');
  }, [session]);

  const handleSubmit = async (e: React.FormEvent, type: "signin" | "signup") => {
    setSubmitting(true);
    e.preventDefault();
    const formElement = e.currentTarget as HTMLFormElement;
    const form = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement));
    if (type === 'signin') {
      const result = await signIn("credentials", {
        redirect: false, // Prevent automatic redirection
        email: form.email,
        password: form.password,
      });

      if (result?.error) {
        toast.error('❌ Auth failed. Please try again.', {
          position: "top-right",
        });
      } else {
        toast.success('✅ Login successful!', {
          position: "top-right",
        });
      }
    }
    else {
      if (form.password !== form.confirmPassword) {
        toast.error('❌ Passwords do not match.', {
          position: "top-right",
        });
        return;
      }
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          regno: parseInt(form.regno.toString()),
          password: form.password,
        }),
      });

      if (response.ok) {
        toast.success('✅ Account created successfully!', {
          position: "top-right",
        });
        router.push("/login");
      } else {
        toast.error('❌ Signup failed. Please try again.', {
          position: "top-right",
        });
      }
    }
    formElement.reset();
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-l from-blue-400 to-blue-700 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg relative overflow-hidden w-[798px] max-w-full min-h-[480px]">
        {/* Sign Up Form */}
        <motion.div
          className="absolute top-0 h-full left-0 w-1/2"
          initial={{ opacity: 0, zIndex: 1 }}
          animate={{
            opacity: isActive ? 1 : 0,
            x: isActive ? '100%' : '0%',
            zIndex: isActive ? 5 : 1
          }}
          transition={{
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96], // Custom easing for smoother motion
            opacity: { duration: 0.4, delay: isActive ? 0.2 : 0 }
          }}
        >
          <form className="bg-white flex flex-col items-center justify-center h-full px-10" onSubmit={(e) => handleSubmit(e, 'signup')}>
            <h1 className="text-xl font-bold mb-2">Create Account</h1>
            <span className="text-xs">or use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              name='name'
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              name='email'
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            />
            <input
              type="number"
              placeholder="Registration Number"
              name='regno'
              min={1000}
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              name='password'
              pattern='^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$'
              title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number"
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name='confirmPassword'
              pattern='^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$'
              title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number"
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            />
            <Button
              disabled={submitting}
              className={cn(
              "bg-[#02052c] text-white text-xs py-2.5 px-11 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer",
              { "opacity-50 cursor-not-allowed": submitting }
              )}
            >
              Sign Up
            </Button>
          </form>
        </motion.div>

        {/* Sign In Form */}
        <motion.div
          className="absolute top-0 h-full left-0 w-1/2 z-[2]"
          animate={{
            x: isActive ? '100%' : '0%'
          }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <form className="bg-white flex flex-col items-center justify-center h-full px-10" onSubmit={(e) => handleSubmit(e, 'signin')}>
            <h1 className="text-xl font-bold mb-2">Sign In</h1>
            <span className="text-xs">or use your email password</span>
            <input
              type="email"
              placeholder="Email"
              name='email'
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              name='password'
              pattern='^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$'
              title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number"
              className="bg-gray-100 border-none my-2 py-2.5 px-4 text-sm rounded-lg w-full outline-none"
            />
            <a href="#" className="text-sm text-gray-800 no-underline my-4 mt-2">Forgot your password?</a>
            <Button
              disabled={submitting}
              className={cn(
              "bg-[#02052c] text-white text-xs py-2.5 px-11 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer",
              { "opacity-50 cursor-not-allowed": submitting }
              )}
            >
              Sign In
            </Button>
          </form>
        </motion.div>

        {/* Use a container with no overflow hidden, and put the actual shape inside */}
        <motion.div
          className="absolute top-0 left-1/2 w-1/2 h-full z-[1000]"
          animate={{
            x: isActive ? '-100%' : '0%',
          }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          {/* The actual shape with border radius that morphs */}
          <motion.div
            className="w-full h-full overflow-hidden"
            initial={false}
            animate={{
              borderTopLeftRadius: isActive ? 0 : '9rem',
              borderBottomLeftRadius: isActive ? 0 : '6rem',
              borderTopRightRadius: isActive ? '9rem' : 0,
              borderBottomRightRadius: isActive ? '6rem' : 0,
            }}
            transition={{
              duration: 0.6,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          >
            <motion.div
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white relative -left-full h-full w-[200%]"
              animate={{
                x: isActive ? '50%' : '0%'
              }}
              transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              {/* Toggle Left Panel */}
              <motion.div
                className="absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0"
                animate={{
                  x: isActive ? '0%' : '-200%'
                }}
                transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
              >
                <h1 className="text-xl font-bold mb-2">Welcome Back!</h1>
                <p className="text-sm leading-5 tracking-wide my-5">Enter your personal details to use all of site features</p>
                <button
                  onClick={toggleForm}
                  disabled={submitting}
                  className="bg-transparent text-white text-xs py-2.5 px-11 border border-white rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer"
                >
                  Sign In
                </button>
              </motion.div>

              {/* Toggle Right Panel */}
              <motion.div
                className="absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 right-0"
                animate={{
                  x: isActive ? '200%' : '0%'
                }}
                transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
              >
                <h1 className="text-xl font-bold mb-2">Hello, Friend!</h1>
                <p className="text-sm leading-5 tracking-wide my-5">Register with your personal details to use all of site features</p>
                <button
                  onClick={toggleForm}
                  disabled={submitting}
                  className="bg-transparent text-white text-xs py-2.5 px-11 border border-white rounded-lg font-semibold tracking-wider uppercase mt-2.5 cursor-pointer"
                >
                  Sign Up
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}