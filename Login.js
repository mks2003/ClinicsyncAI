import React, { useState } from "react";
import { supabase } from "../supabaseClient";

function Login() {
  const [patientId, setPatientId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  try {
    setErrorMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: patientId.trim().toLowerCase() + "@clinicsync.com",
      password: password,
    });

    if (error) {
      setErrorMessage("Invalid ID or Password");
    }
  } catch (err) {
    setErrorMessage("Unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-6 text-center">
          ClinicSync Login
        </h2>

        <input
          type="text"
          placeholder="Patient ID / Doctor ID"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMessage && (
          <p className="text-red-500 text-sm mb-2">
            {errorMessage}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
