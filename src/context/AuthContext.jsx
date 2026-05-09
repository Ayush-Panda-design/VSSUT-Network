import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          // first-time login → create base user (role: user)
          const base = {
            name: u.displayName || u.email.split("@")[0],
            email: u.email,
            role: "user",
            type: "student",
            createdAt: serverTimestamp(),
          };
          await setDoc(ref, base);
          setProfile(base);
        } else {
          setProfile(snap.data());
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const logout = () => signOut(auth);

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
