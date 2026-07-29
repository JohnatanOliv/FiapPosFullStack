import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContextValue";

import HomePage from "../pages/HomePage";
import StudentDashboard from "../pages/aluno/StudentDashboard";
import TeacherDashboard from "../pages/professor/TeacherDashboard";
import ProfessorLoginPage from "../pages/auth/ProfessorLoginPage";
import ProfessorRegisterPage from "../pages/auth/ProfessorRegisterPage";
import StudentLoginPage from "../pages/auth/StudentLoginPage";
import PostDetailsPage from "../pages/PostDetailsPage";
import PublicPostsPage from "../pages/PublicPostsPage";
import UserManagementPage from "../pages/admin/UserManagementPage";

function AppRoutes() {
  const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home - Seleção entre Aluno e Professor */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={user.role === "teacher" ? "/teacher" : "/student"} />
            ) : (
              <HomePage />
            )
          }
        />

        {/* Professor Login */}
        <Route
          path="/professor-login"
          element={
            user && user.role === "teacher" ? (
              <Navigate to="/teacher" />
            ) : (
              <ProfessorLoginPage />
            )
          }
        />

        {/* Professor Register */}
        <Route
          path="/professor-register"
          element={
            user && user.role === "teacher" ? (
              <Navigate to="/teacher" />
            ) : (
              <ProfessorRegisterPage />
            )
          }
        />

        <Route
          path="/student-login"
          element={
            user && user.role === "student" ? (
              <Navigate to="/student" />
            ) : (
              <StudentLoginPage />
            )
          }
        />

        {/* Aluno - requer autenticação */}
        <Route
          path="/student"
          element={
            user && user.role === "student" ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/student-login" />
            )
          }
        />

        {/* Professor - Requer autenticação */}
        <Route
          path="/teacher"
          element={
            user && user.role === "teacher" ? (
              <TeacherDashboard user={user} />
            ) : (
              <Navigate to="/professor-login" />
            )
          }
        />

        <Route path="/posts" element={<PublicPostsPage />} />
        <Route path="/posts/:id" element={<PostDetailsPage />} />
        <Route
          path="/admin/teachers"
          element={user?.role === "teacher" ? <UserManagementPage role="teacher" /> : <Navigate to="/professor-login" />}
        />
        <Route
          path="/admin/students"
          element={user?.role === "teacher" ? <UserManagementPage role="student" /> : <Navigate to="/professor-login" />}
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;