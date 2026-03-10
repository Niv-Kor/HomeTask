import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { PoliciesPage } from "@/pages/policies";
import { PolicyTestsPage } from "@/pages/policy-tests";
import { NewTestPage } from "@/pages/New Test/new-test";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/policies" replace />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/policies/:policyId/tests" element={<PolicyTestsPage />} />
          <Route path="/policies/:policyId/tests/new" element={<NewTestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
