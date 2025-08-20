"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/app/i18n/navigation";
import { useLocale } from "next-intl";
import supabase from "@/services/supabase";
import { User, Session } from "@supabase/supabase-js";
import toast from "react-hot-toast";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
        });
      } catch (error) {
        console.error("Error getting initial session:", error);
        setAuthState((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    getInitialSession();

    // Set a timeout to ensure loading doesn't stay true forever
    const timeoutId = setTimeout(() => {
      setAuthState((prev) => {
        if (prev.loading) {
          console.log("Loading timeout reached, setting loading to false");
          return { ...prev, loading: false };
        }
        return prev;
      });
    }, 5000); // 5 seconds timeout

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });

      if (event === "SIGNED_IN" && session?.user) {
        // Create profile record in profiles table
        await createProfile(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const createProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            full_name: user.user_metadata?.full_name || "",
            email: user.email,
          },
        ])
        .select();

      if (error && error.code !== "23505") {
        // Ignore duplicate key errors
        console.error("Error creating profile:", error);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      if (data.user && !data.session) {
        toast.success("Please check your email for verification link");
        return { success: true, data };
      }

      if (data.session) {
        toast.success("Account created successfully!");
        console.log("Signing up, redirecting to:", `/profile`);
        router.push(`/profile`);
        return { success: true, data };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
      return { success: false, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      if (data.session) {
        toast.success("Signed in successfully!");

        router.push(`/profile`);
        return { success: true, data };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Signin error:", error);
      toast.error("An error occurred during signin");
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success("Signed out successfully");
      // Redirect to home page
      console.log("Signing out, redirecting to:", `/`);
      router.push(`/`);
      return { success: true };
    } catch (error) {
      console.error("Signout error:", error);
      toast.error("An error occurred during signout");
      return { success: false, error };
    }
  };

  const redirectIfAuthenticated = useCallback(
    (redirectTo: string = `/profile`) => {
      if (authState.user && !authState.loading) {
        console.log("Redirecting authenticated user to:", redirectTo);
        router.push(redirectTo);
        return true;
      }
      return false;
    },
    [authState.user, authState.loading, router]
  );

  const requireAuth = useCallback(
    (redirectTo: string = `/signin`) => {
      if (!authState.user && !authState.loading) {
        console.log("Redirecting unauthenticated user to:", redirectTo);
        router.push(redirectTo);
        return false;
      }
      return true;
    },
    [authState.user, authState.loading, router]
  );

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    signUp,
    signIn,
    signOut,
    redirectIfAuthenticated,
    requireAuth,
  };
};
