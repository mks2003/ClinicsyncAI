import React, { useState, useEffect } from "react";
import { Activity, Users, FileText, Pill, Calendar } from "lucide-react";
import { supabase } from "./supabaseClient";

// Components
import TabButton from "./components/TabButton";

// Views
import DashboardView from "./views/dashboard/DashboardView";
import ConsentView from "./views/consent/ConsentView";
import DrugMatchingView from "./views/drugmatching/DrugMatchingView";
import EligibilityScreeningView from "./views/eligibilityscreening/EligibilityScreeningView";
import SchedulingView from "./views/scheduling/SchedulingView";

// Auth
import Login from "./auth/Login";

function App() {
  const [user, setUser] = useState(undefined);
  const [activeTab, setActiveTab] = useState("dashboard");

  // 🔐 Auth State
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          setUser(null);
          return;
        }

        if (data?.session) {
          const authUser = data.session.user;

          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, patient_id")
            .eq("id", authUser.id)
            .maybeSingle();   // ✅ safer

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            setUser(null);
            return;
          }

          if (!profile) {
            console.warn("No profile found for user");
            setUser(null);
            return;
          }

          setUser(profile);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Unexpected auth error:", err);
        setUser(null);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          if (session) {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("role, patient_id")
              .eq("id", session.user.id)
              .maybeSingle();

            if (profileError || !profile) {
              console.error("Profile error:", profileError);
              setUser(null);
              return;
            }

            setUser(profile);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Auth state change error:", err);
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔒 Login Gate
  if (user === undefined) return <div>Loading...</div>;
  if (user === null) return <Login />;

  const role = user.role;

  const roleTabs = {
    doctor: ["dashboard", "screening", "drugs", "scheduling"],
    patient: ["dashboard", "consent", "scheduling"],
    admin: ["dashboard", "screening", "consent", "drugs", "scheduling"],
  };

  const allowedTabs = roleTabs[role] || [];

  const renderContent = () => {
    if (!allowedTabs.includes(activeTab)) {
      return <DashboardView />;
    }

    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "screening":
        return <EligibilityScreeningView />;
      case "consent":
        return <ConsentView />;
      case "drugs":
        return <DrugMatchingView />;
      case "scheduling":
        return <SchedulingView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                ClinicSyncAI
              </h1>
              <p className="text-sm text-gray-600">
                Clinical Trial Recruitment System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Logged in as: {user.patient_id} ({user.role})
            </span>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-5 gap-6">
        <div className="col-span-1 space-y-2">
          {allowedTabs.includes("dashboard") && (
            <TabButton
              id="dashboard"
              icon={Activity}
              label="Dashboard"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          )}

          {allowedTabs.includes("screening") && (
            <TabButton
              id="screening"
              icon={Users}
              label="Screening"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          )}

          {allowedTabs.includes("consent") && (
            <TabButton
              id="consent"
              icon={FileText}
              label="Consent"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          )}

          {allowedTabs.includes("drugs") && (
            <TabButton
              id="drugs"
              icon={Pill}
              label="Drugs"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          )}

          {allowedTabs.includes("scheduling") && (
            <TabButton
              id="scheduling"
              icon={Calendar}
              label="Scheduling"
              activeTab={activeTab}
              onClick={setActiveTab}
            />
          )}
        </div>

        <div className="col-span-4">{renderContent()}</div>
      </div>
    </div>
  );
}

export default App;

// import React, { useEffect, useState } from "react";
// import { supabase } from "./supabaseClient";

// function App() {
//   const [status, setStatus] = useState("Starting...");

//   useEffect(() => {
//     const test = async () => {
//       setStatus("Checking session...");

//       try {
//         const result = await supabase.auth.getSession();
//         console.log("Full result:", result);
//         setStatus("Session check completed");
//       } catch (err) {
//         console.error("Auth error:", err);
//         setStatus("Auth failed");
//       }
//     };

//     test();
//   }, []);

//   return <div>{status}</div>;
// }
// console.log("SUPABASE URL:", process.env.REACT_APP_SUPABASE_URL);
// console.log("SUPABASE KEY:", process.env.REACT_APP_SUPABASE_ANON_KEY);
// export default App;